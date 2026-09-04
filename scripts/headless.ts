/**
 * A browser, for the gates that need one, and nothing more than that.
 *
 * Two of this repository's rules are load-bearing about layout, and neither can
 * be checked without a layout engine: a page must not scroll sideways at 320px,
 * and a filter row must be a large enough target to hit with a thumb. Both are
 * facts about boxes after CSS has run. Reading the prerendered HTML — which is
 * what every other `check:built` gate does — cannot see either.
 *
 * So this drives a real Chrome over the DevTools Protocol, with no dependency
 * added to do it. That is the whole reason it is hand-rolled: `playwright` and
 * `puppeteer` both download a browser in a `postinstall`, and this project's
 * `npm install` runs on every Vercel deployment, where no gate ever runs. A
 * hundred lines of CDP here costs the deployment nothing.
 *
 * It is deliberately small. Navigate, resize, evaluate, click, press a key,
 * screenshot. Anything that wants more than that wants a real driver, and can
 * argue for the dependency then.
 *
 * The browser is found, never installed:
 *
 *   1. `$D2R_CHROME`, if set — the escape hatch, and what CI would use.
 *   2. The usual install locations for Chrome, Chromium and Edge.
 *
 * If none is present the gate fails with that sentence rather than passing
 * quietly, because a layout check that skips itself is worse than no layout
 * check: it reports green on a page it never opened.
 */
import { spawn, type ChildProcess } from "node:child_process";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";

// ---------------------------------------------------------------------------
// Finding a browser
// ---------------------------------------------------------------------------

const CANDIDATES: Record<string, string[]> = {
  win32: [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  ],
  darwin: [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  ],
  linux: [
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/usr/bin/microsoft-edge",
    "/snap/bin/chromium",
  ],
};

export function findBrowser(): string {
  const fromEnv = process.env.D2R_CHROME;
  if (fromEnv) {
    if (!existsSync(fromEnv)) {
      console.error(`  $D2R_CHROME points at ${fromEnv}, which does not exist.`);
      process.exit(1);
    }
    return fromEnv;
  }
  for (const path of CANDIDATES[process.platform] ?? []) {
    if (existsSync(path)) return path;
  }
  console.error(
    "  No Chrome, Chromium or Edge found, and this gate measures laid-out boxes —\n" +
      "  it cannot run without one, and must not pass without running.\n" +
      "  Install one, or point $D2R_CHROME at an existing binary.",
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// A port, and a server on it
// ---------------------------------------------------------------------------

export function freePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const srv = createServer();
    srv.on("error", reject);
    srv.listen(0, "127.0.0.1", () => {
      const addr = srv.address();
      const port = typeof addr === "object" && addr ? addr.port : 0;
      srv.close(() => resolve(port));
    });
  });
}

async function waitForHttp(url: string, timeoutMs: number): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    try {
      const res = await fetch(url, { redirect: "manual" });
      if (res.status > 0) return;
    } catch {
      // not up yet
    }
    if (Date.now() > deadline) throw new Error(`${url} never came up`);
    await new Promise((r) => setTimeout(r, 150));
  }
}

export interface Server {
  origin: string;
  stop(): void;
}

/**
 * The site, served from the build that is already on disk.
 *
 * `$D2R_BASE_URL` skips the spawn and points at something already running —
 * how a gate is pointed at a preview deployment.
 */
export async function startSite(): Promise<Server> {
  const existing = process.env.D2R_BASE_URL;
  if (existing) {
    await waitForHttp(existing, 30_000);
    return { origin: existing.replace(/\/$/, ""), stop: () => {} };
  }

  const port = await freePort();
  const next = join(process.cwd(), "node_modules", "next", "dist", "bin", "next");
  const child = spawn(process.execPath, [next, "start", "-p", String(port)], {
    stdio: "ignore",
    env: { ...process.env },
  });
  const origin = `http://127.0.0.1:${port}`;
  try {
    await waitForHttp(origin, 60_000);
  } catch (err) {
    child.kill();
    throw err;
  }
  return { origin, stop: () => child.kill() };
}

// ---------------------------------------------------------------------------
// CDP
// ---------------------------------------------------------------------------

interface Pending {
  resolve: (value: Record<string, unknown>) => void;
  reject: (err: Error) => void;
}

export class Page {
  private ws!: WebSocket;
  private proc!: ChildProcess;
  private profile!: string;
  private nextId = 1;
  private pending = new Map<number, Pending>();
  private sessionId?: string;
  private loaded?: () => void;

  static async launch(): Promise<Page> {
    const page = new Page();
    const binary = findBrowser();
    page.profile = mkdtempSync(join(tmpdir(), "d2r-headless-"));
    page.proc = spawn(
      binary,
      [
        "--headless=new",
        "--remote-debugging-port=0",
        `--user-data-dir=${page.profile}`,
        "--no-first-run",
        "--no-default-browser-check",
        "--disable-gpu",
        "--hide-scrollbars",
        "--mute-audio",
        "--disable-extensions",
        "--disable-background-networking",
        "--disable-dev-shm-usage",
        "about:blank",
      ],
      { stdio: ["ignore", "ignore", "pipe"] },
    );

    const endpoint = await new Promise<string>((resolve, reject) => {
      let buf = "";
      const timer = setTimeout(() => reject(new Error("browser never printed a DevTools endpoint")), 30_000);
      page.proc.stderr?.on("data", (chunk: Buffer) => {
        buf += chunk.toString();
        const m = buf.match(/DevTools listening on (ws:\/\/\S+)/);
        if (m) {
          clearTimeout(timer);
          resolve(m[1]);
        }
      });
      page.proc.on("exit", (code) => {
        clearTimeout(timer);
        reject(new Error(`browser exited with ${code} before listening`));
      });
    });

    await page.connect(endpoint);
    return page;
  }

  private async connect(endpoint: string): Promise<void> {
    this.ws = new WebSocket(endpoint);
    await new Promise<void>((resolve, reject) => {
      this.ws.addEventListener("open", () => resolve(), { once: true });
      this.ws.addEventListener("error", () => reject(new Error("could not connect to the browser")), {
        once: true,
      });
    });
    this.ws.addEventListener("message", (event) => this.onMessage(String(event.data)));

    const { targetId } = (await this.send("Target.createTarget", { url: "about:blank" })) as {
      targetId: string;
    };
    const attached = (await this.send("Target.attachToTarget", { targetId, flatten: true })) as {
      sessionId: string;
    };
    this.sessionId = attached.sessionId;
    await this.send("Page.enable");
    await this.send("Runtime.enable");
  }

  private onMessage(raw: string): void {
    const msg = JSON.parse(raw) as {
      id?: number;
      method?: string;
      result?: Record<string, unknown>;
      error?: { message: string };
    };
    if (msg.id !== undefined) {
      const p = this.pending.get(msg.id);
      if (!p) return;
      this.pending.delete(msg.id);
      if (msg.error) p.reject(new Error(msg.error.message));
      else p.resolve(msg.result ?? {});
      return;
    }
    if (msg.method === "Page.loadEventFired") this.loaded?.();
  }

  private send(method: string, params: Record<string, unknown> = {}): Promise<Record<string, unknown>> {
    const id = this.nextId++;
    const payload: Record<string, unknown> = { id, method, params };
    if (this.sessionId) payload.sessionId = this.sessionId;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify(payload));
      setTimeout(() => {
        if (this.pending.delete(id)) reject(new Error(`${method} timed out`));
      }, 60_000);
    });
  }

  /** CSS pixels, and whether to present as a touch device. */
  async setViewport(width: number, height = 800, mobile = width < 768): Promise<void> {
    await this.send("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor: 1,
      mobile,
      screenWidth: width,
      screenHeight: height,
    });
  }

  /** Emulates the OS-level light/dark preference. */
  async setColorScheme(scheme: "light" | "dark"): Promise<void> {
    await this.send("Emulation.setEmulatedMedia", {
      features: [{ name: "prefers-color-scheme", value: scheme }],
    });
  }

  async goto(url: string): Promise<void> {
    const load = new Promise<void>((resolve) => {
      this.loaded = resolve;
    });
    await this.send("Page.navigate", { url });
    await Promise.race([load, new Promise((r) => setTimeout(r, 30_000))]);
    this.loaded = undefined;
  }

  /** Runs `expression` in the page and returns its value. */
  async evaluate<T>(expression: string): Promise<T> {
    const res = (await this.send("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    })) as { result?: { value?: T }; exceptionDetails?: { text: string } };
    if (res.exceptionDetails) throw new Error(res.exceptionDetails.text);
    return res.result?.value as T;
  }

  /** Polls `expression` until it is truthy. Returns false on timeout. */
  async waitFor(expression: string, timeoutMs = 10_000): Promise<boolean> {
    const deadline = Date.now() + timeoutMs;
    for (;;) {
      if (await this.evaluate<boolean>(`!!(${expression})`)) return true;
      if (Date.now() > deadline) return false;
      await new Promise((r) => setTimeout(r, 80));
    }
  }

  /** A real mouse click at viewport coordinates, so labels behave like labels. */
  async click(x: number, y: number): Promise<void> {
    for (const type of ["mousePressed", "mouseReleased"] as const) {
      await this.send("Input.dispatchMouseEvent", {
        type,
        x,
        y,
        button: "left",
        clickCount: 1,
        buttons: type === "mousePressed" ? 1 : 0,
      });
    }
  }

  /**
   * A key press.
   *
   * `text` is not optional decoration: without it Chrome delivers the event as
   * a raw key and the default action never runs, so Enter on a `<summary>`
   * focuses it and does nothing. Keys that produce no character — Escape, Tab —
   * are the ones that leave it undefined.
   */
  async press(key: string, code: string, keyCode: number, text?: string): Promise<void> {
    const common = {
      key,
      code,
      windowsVirtualKeyCode: keyCode,
      nativeVirtualKeyCode: keyCode,
    };
    await this.send("Input.dispatchKeyEvent", {
      ...common,
      type: text ? "keyDown" : "rawKeyDown",
      ...(text ? { text, unmodifiedText: text } : {}),
    });
    await this.send("Input.dispatchKeyEvent", { ...common, type: "keyUp" });
  }

  /** Base64 PNG. Only used to produce evidence, never committed. */
  async screenshot(): Promise<string> {
    const res = (await this.send("Page.captureScreenshot", { format: "png" })) as { data: string };
    return res.data;
  }

  close(): void {
    try {
      this.ws.close();
    } catch {
      // already gone
    }
    this.proc.kill();
    try {
      rmSync(this.profile, { recursive: true, force: true });
    } catch {
      // Windows sometimes still holds the profile; it is a temp dir either way.
    }
  }
}
