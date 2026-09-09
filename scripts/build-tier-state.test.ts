/**
 * The build page's tier state, in a real browser, in every state a reader can
 * put it into.
 *
 * The whole of Phase 1 is a claim about laid-out boxes and stored values, and
 * almost none of it can be seen from the prerendered HTML:
 * `build-tiers-html.test.ts` proves what is *served*, and this proves what the
 * reader actually gets. The two halves need each other — one of them alone is
 * how a mechanism ships broken with a green suite.
 *
 * The rules this file exists to hold, and why each is here rather than
 * somewhere cheaper:
 *
 *   - **Selecting never moves the page.** R-BUILD-2 makes this an acceptance
 *     criterion, and `scrollY` after a click is not derivable from markup.
 *     Sampled twice, because `globals.css` sets `scroll-behavior: smooth` and
 *     a single read can catch an animation mid-flight.
 *   - **Visibility, not class names.** A `peer-open:` or `group-open:` variant
 *     with its marker class on the wrong element compiles to CSS that matches
 *     nothing. The selector is asserted in the HTML gate; the *computed
 *     display* is asserted here, which is the only thing that can tell the
 *     difference.
 *   - **Storage is broken before the page boots, not after.** A preference
 *     read happens in the inline script during parse. Making `localStorage`
 *     throw with `evaluate` after `goto` tests a moment no reader ever
 *     experiences, so it goes in via `addInitScript`.
 *   - **The heading skeleton is compared to the build before this phase**,
 *     not to itself with scripts off. Comparing a page to itself is green
 *     even if every heading were deleted on both sides.
 *
 * Requires `npm run build`. Run with `npm run test:build-tier-state`.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { assertFreshBuild } from "./build-freshness";
import { Page, startSite } from "./headless";
import { getBuilds } from "../lib/registry";
import { LOCALES, type Locale } from "../lib/i18n/config";
import { dictionaryFor } from "../lib/i18n";
import { tierOrder } from "../lib/labels";
import { TIER_KEY } from "../lib/prefs";

let passed = 0;
const failures: string[] = [];
const check = (name: string, ok: boolean, detail = "") => {
  if (ok) {
    passed++;
    console.log(`  ok   ${name}`);
  } else {
    failures.push(`${name}${detail ? ` — ${detail}` : ""}`);
    console.log(`  FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  }
};

assertFreshBuild();

/** The builds this file opens in a browser, and why each one is here. */
const SUBJECTS = [
  { classSlug: "sorceress", slug: "blizzard-sorceress", why: "the PRD's own baseline" },
  { classSlug: "assassin", slug: "blade-fury", why: "11 slots, and a duplicated weapon slot" },
  { classSlug: "barbarian", slug: "leap-attack-barbarian", why: "the catalogue's tallest page" },
] as const;

/** Read through `unknown`: these keys land with the UI, not with this test. */
interface Picker {
  legend: string;
  myTier: string;
  announce: string;
  goToGear: string;
  clear: string;
  clearLabel: string;
  expand: string;
  collapse: string;
}
const picker = (locale: Locale): Partial<Picker> =>
  ((dictionaryFor(locale).builds as unknown as { tierPicker?: Partial<Picker> }).tierPicker ?? {});

/** Reads the whole tier state out of the page in one round trip. */
const PROBE = `(() => {
  const tiers = ${JSON.stringify(tierOrder)};
  const el = (t) => document.getElementById("gear-" + t);
  const vis = (n) => {
    if (!n) return false;
    const s = getComputedStyle(n);
    return s.display !== "none" && s.visibility !== "hidden";
  };
  const chips = [...document.querySelectorAll("[data-tier]")];
  const inGear = (n) => !!n.closest("#gear");
  const top = chips.filter((c) => !inGear(c));
  const mirror = chips.filter(inGear);
  return {
    open: tiers.filter((t) => el(t) && el(t).open),
    present: tiers.filter((t) => !!el(t)),
    slotLines: tiers.map((t) => {
      const s = el(t);
      const ul = s && s.parentElement ? s.parentElement.querySelector("ul[data-tier-preview]") : null;
      return { tier: t, count: ul ? ul.children.length : -1, visible: vis(ul) };
    }),
    pressed: top.filter((c) => c.getAttribute("aria-pressed") === "true").map((c) => c.dataset.tier),
    anyPressedTrue: [...document.querySelectorAll('[aria-pressed="true"]')].length,
    current: [...document.querySelectorAll('[aria-current="location"]')].map((c) => c.dataset.tier || null),
    topIsButton: top.length ? top.every((c) => c.tagName === "BUTTON") : null,
    topCount: top.length,
    mirrorCount: mirror.length,
    mirrorPressed: mirror.filter((c) => c.hasAttribute("aria-pressed")).length,
    legend: (document.getElementById("tier-picker-legend") || {}).textContent || "",
    goTo: (() => { const a = document.querySelector("[data-go-to-gear]"); return a ? a.getAttribute("href") : null; })(),
    goToVisible: vis(document.querySelector("[data-go-to-gear]")),
    clearVisible: vis(document.querySelector("[data-clear-tier]")),
    affordance: tiers.map((t) => {
      const s = el(t);
      if (!s) return { tier: t, shown: null };
      const ex = s.querySelector("[data-affordance-expand]");
      const co = s.querySelector("[data-affordance-collapse]");
      return { tier: t, shown: vis(co) ? "collapse" : vis(ex) ? "expand" : "none" };
    }),
    headings: [...document.querySelectorAll("h2, h3")].map((h) => h.textContent.replace(/\\s+/g, " ").trim()),
    scrollY: Math.round(window.scrollY),
    scrollLeft: Math.round(document.documentElement.scrollLeft),
    href: location.href,
    storage: (() => { try { return Object.keys(localStorage).sort(); } catch { return ["<blocked>"]; } })(),
    tierValue: (() => { try { return localStorage.getItem(${JSON.stringify(TIER_KEY)}); } catch { return "<blocked>"; } })(),
    roleTab: document.querySelectorAll('[role="tab"], [role="tablist"]').length,
    stickyBelowHeader: [...document.querySelectorAll("*")]
      .filter((n) => getComputedStyle(n).position === "sticky")
      .map((n) => (n.closest("header") ? "header" : (n.id || n.className || n.tagName).toString().slice(0, 40))),
  };
})()`;

const url = (origin: string, locale: Locale, c: string, s: string) =>
  `${origin}/${locale}/builds/${c}/${s}`;

async function clearStorage(page: Page, origin: string): Promise<void> {
  await page.goto(`${origin}/en-us`);
  await page.evaluate(`(() => { try { localStorage.clear(); } catch {} return 1; })()`);
}

async function seed(page: Page, origin: string, value: string): Promise<void> {
  await page.goto(`${origin}/en-us`);
  await page.evaluate(
    `(() => { try { localStorage.clear(); localStorage.setItem(${JSON.stringify(TIER_KEY)}, ${JSON.stringify(value)}); } catch {} return 1; })()`,
  );
}

/** Two stable samples, because smooth scrolling makes a single read racy. */
async function settledScrollY(page: Page): Promise<number> {
  const a = await page.evaluate<number>("Math.round(window.scrollY)");
  await page.evaluate<number>("new Promise(r => setTimeout(() => r(1), 200))");
  const b = await page.evaluate<number>("Math.round(window.scrollY)");
  return a === b ? b : -1;
}

interface State {
  open: string[];
  present: string[];
  slotLines: { tier: string; count: number; visible: boolean }[];
  pressed: string[];
  anyPressedTrue: number;
  current: (string | null)[];
  topIsButton: boolean | null;
  topCount: number;
  mirrorCount: number;
  mirrorPressed: number;
  legend: string;
  goTo: string | null;
  goToVisible: boolean;
  clearVisible: boolean;
  affordance: { tier: string; shown: string | null }[];
  headings: string[];
  scrollY: number;
  scrollLeft: number;
  href: string;
  storage: string[];
  tierValue: string | null;
  roleTab: number;
  stickyBelowHeader: string[];
}

async function main() {
  const site = await startSite();
  const page = await Page.launch();
  const subject = SUBJECTS[0];

  try {
    // -----------------------------------------------------------------------
    // S1 — no JavaScript
    // -----------------------------------------------------------------------
    console.log("\nS1 · no JavaScript");
    for (const locale of LOCALES) {
      await page.setScriptsEnabled(false);
      await page.goto(url(site.origin, locale, subject.classSlug, subject.slug));
      await page.setScriptsEnabled(true);
      const s = await page.evaluate<State>(PROBE);
      await page.setScriptsEnabled(false);
      check(`${locale}: the six tiers are open`, s.open.length === 6, `[${s.open}]`);
      check(`${locale}: nothing claims a preference`, s.anyPressedTrue === 0 && !s.goToVisible && !s.clearVisible);
      check(`${locale}: every affordance reads "collapse" over an open tier`,
        s.affordance.every((a) => a.shown === "collapse"), JSON.stringify(s.affordance));
      check(`${locale}: the previews are hidden while the bodies are open`,
        s.slotLines.every((l) => !l.visible), JSON.stringify(s.slotLines.map((l) => l.visible)));
    }
    await page.setScriptsEnabled(true);

    // -----------------------------------------------------------------------
    // S2 — JavaScript, no preference
    // -----------------------------------------------------------------------
    console.log("\nS2 · JavaScript, no preference");
    let s2: State | null = null;
    for (const locale of LOCALES) {
      await clearStorage(page, site.origin);
      await page.setViewport(390, 844);
      await page.goto(url(site.origin, locale, subject.classSlug, subject.slug));
      const s = await page.evaluate<State>(PROBE);
      if (locale === "en-us") s2 = s;
      check(`${locale}: all six compact`, s.open.length === 0, `open=[${s.open}]`);
      check(`${locale}: all six still in the DOM`, s.present.length === 6, `[${s.present}]`);
      check(`${locale}: nothing is pressed`, s.anyPressedTrue === 0, `${s.anyPressedTrue}`);
      check(`${locale}: the legend asks rather than asserts`, s.legend.includes(picker(locale).legend ?? " "), s.legend);
      check(`${locale}: no "go to gear" action yet`, !s.goToVisible);
      check(`${locale}: page did not move`, s.scrollY === 0, `${s.scrollY}`);
      check(`${locale}: URL untouched`, !s.href.includes("#") && !s.href.includes("?"), s.href);
      check(`${locale}: nothing was written`, s.storage.length === 0, s.storage.join(","));
      check(`${locale}: every preview is visible`, s.slotLines.every((l) => l.visible),
        JSON.stringify(s.slotLines.map((l) => `${l.tier}:${l.visible}`)));
      check(`${locale}: every affordance reads "expand"`,
        s.affordance.every((a) => a.shown === "expand"), JSON.stringify(s.affordance));
      check(`${locale}: the control became buttons`, s.topIsButton === true && s.topCount === 6, `${s.topCount}`);
      check(`${locale}: no tab semantics anywhere`, s.roleTab === 0, `${s.roleTab}`);
    }

    // The slot lines must match the data, in every state.
    {
      const build = getBuilds("en-us").find((b) => b.slug === subject.slug)!;
      const expected = tierOrder.map((t) => build.gearSets.find((g) => g.tier === t)!.slots.length);
      const got = s2!.slotLines.map((l) => l.count);
      check("the preview shows one line per slot entry, including duplicates",
        JSON.stringify(got) === JSON.stringify(expected), `got ${got} want ${expected}`);
    }

    // -----------------------------------------------------------------------
    // C6 — the heading skeleton against the build before this phase
    // -----------------------------------------------------------------------
    console.log("\nC6 · the heading skeleton is unchanged from the pre-phase build");
    {
      const fixture = JSON.parse(readFileSync(join(process.cwd(), "scripts", "heading-snapshot.json"), "utf8")) as {
        capturedFrom: string;
        pages: Record<string, string[]>;
      };
      const drift: string[] = [];
      for (const locale of LOCALES) {
        for (const sub of SUBJECTS) {
          await clearStorage(page, site.origin);
          await page.goto(url(site.origin, locale, sub.classSlug, sub.slug));
          const s = await page.evaluate<State>(PROBE);
          const want = fixture.pages[`${locale}/${sub.classSlug}/${sub.slug}`];
          if (!want) { drift.push(`${locale}/${sub.slug}: not in fixture`); continue; }
          if (JSON.stringify(s.headings) !== JSON.stringify(want)) {
            const i = s.headings.findIndex((h, k) => h !== want[k]);
            drift.push(`${locale}/${sub.slug}: at ${i} got "${s.headings[i]}" want "${want[i]}"`);
          }
        }
      }
      check(`headings identical to ${fixture.capturedFrom.slice(0, 7)}`, drift.length === 0, drift.slice(0, 2).join(" | "));
      check("control: the fixture is not empty", Object.keys(fixture.pages).length === 106,
        `${Object.keys(fixture.pages).length} pages`);
    }

    // -----------------------------------------------------------------------
    // C6b — the tier headings survive inside <summary>
    // -----------------------------------------------------------------------
    console.log("\nC6b · the six tier headings are still headings in the accessibility tree");
    for (const locale of LOCALES) {
      await clearStorage(page, site.origin);
      await page.goto(url(site.origin, locale, subject.classSlug, subject.slug));
      const nodes = await page.axNodes();
      const headingNames = nodes.filter((n) => n.role === "heading").map((n) => n.name);
      const t = dictionaryFor(locale).tiers as Record<string, string>;
      const wanted = [t.starterLabel, t.nightmareLabel, t.earlyHellLabel, t.budgetLabel, t.optimizedLabel, t.bisLabel];
      const lost = wanted.filter((w) => !headingNames.some((h) => h.includes(w)));
      check(`${locale}: all six tier names reach the heading rotor`, lost.length === 0, `lost: ${lost.join(", ")}`);
    }

    // -----------------------------------------------------------------------
    // S3 / S4 / S5 — preference, invalid preference, blocked storage
    // -----------------------------------------------------------------------
    console.log("\nS3 · a valid preference expands exactly one tier");
    for (const locale of LOCALES) {
      await seed(page, site.origin, "budget");
      await page.goto(url(site.origin, locale, subject.classSlug, subject.slug));
      const s = await page.evaluate<State>(PROBE);
      check(`${locale}: only the preferred tier is open`, s.open.join() === "budget", `[${s.open}]`);
      check(`${locale}: it is the pressed one`, s.pressed.join() === "budget", `[${s.pressed}]`);
      check(`${locale}: the label names it`, s.legend.includes((picker(locale).myTier ?? " ").split("{")[0].trim()), s.legend);
      check(`${locale}: the explicit action points at it`, s.goTo === "#gear-budget" && s.goToVisible, String(s.goTo));
      check(`${locale}: clearing is offered (R-PREF-3)`, s.clearVisible);
      check(`${locale}: loading with a preference did not scroll`, s.scrollY === 0, `${s.scrollY}`);
      check(`${locale}: its preview is hidden, the other five are not`,
        s.slotLines.every((l) => (l.tier === "budget" ? !l.visible : l.visible)),
        JSON.stringify(s.slotLines.map((l) => `${l.tier}:${l.visible}`)));
      check(`${locale}: its affordance reads "collapse", the others "expand"`,
        s.affordance.every((a) => a.shown === (a.tier === "budget" ? "collapse" : "expand")),
        JSON.stringify(s.affordance));
    }

    console.log("\nS4 · an invalid stored value is ignored and kept");
    {
      await seed(page, site.origin, "Budget ");
      await page.goto(url(site.origin, "en-us", subject.classSlug, subject.slug));
      const s = await page.evaluate<State>(PROBE);
      check("it behaves exactly like no preference", s.open.length === 0 && s.anyPressedTrue === 0, `[${s.open}]`);
      check("the corrupt value is not deleted", s.tierValue === "Budget ", String(s.tierValue));
      check("no scroll, no URL change", s.scrollY === 0 && !s.href.includes("#"));
    }

    console.log("\nS5 · storage that throws before the page boots");
    {
      const hostile = await Page.launch();
      try {
        await hostile.addInitScript(`
          Object.defineProperty(window, "localStorage", {
            configurable: true,
            get() { throw new DOMException("blocked", "SecurityError"); }
          });
        `);
        await hostile.setViewport(390, 844);
        await hostile.goto(url(site.origin, "en-us", subject.classSlug, subject.slug));
        const s = await hostile.evaluate<State>(PROBE);
        const noise = hostile.drainConsole();
        check("the page still enhances to six compact tiers", s.open.length === 0, `[${s.open}]`);
        check("nothing is pressed and no action is promised", s.anyPressedTrue === 0 && !s.goToVisible);
        check("all six tiers are still in the DOM", s.present.length === 6);
        check("the page logged no error", noise.length === 0, noise.slice(0, 2).join(" | "));
      } finally {
        hostile.close();
      }
    }

    // -----------------------------------------------------------------------
    // S7 / S8 / S9 / S10 — the hash
    // -----------------------------------------------------------------------
    console.log("\nS7-S10 · the hash");
    {
      await clearStorage(page, site.origin);
      await page.goto(`${url(site.origin, "en-us", subject.classSlug, subject.slug)}#gear-optimized`);
      const s = await page.evaluate<State>(PROBE);
      check("S7 valid hash, no preference: it expands", s.open.join() === "optimized", `[${s.open}]`);
      check("S7 …and still nothing is pressed (R-BUILD-3)", s.anyPressedTrue === 0, `${s.anyPressedTrue}`);
      check("S7 …and aria-current marks it", s.current.join() === "optimized", `[${s.current}]`);
      check("S7 …and nothing was written", s.storage.length === 0, s.storage.join(","));
    }
    {
      await clearStorage(page, site.origin);
      await page.goto(`${url(site.origin, "en-us", subject.classSlug, subject.slug)}#gear-bogus`);
      const s = await page.evaluate<State>(PROBE);
      check("S8 invalid hash: degrades to the no-preference state", s.open.length === 0, `[${s.open}]`);
      check("S8 …and the page is intact", s.present.length === 6 && s.headings.length > 10);
    }
    for (const locale of LOCALES) {
      await seed(page, site.origin, "bis");
      await page.goto(`${url(site.origin, locale, subject.classSlug, subject.slug)}#gear-starter`);
      const s = await page.evaluate<State>(PROBE);
      check(`S9 ${locale}: the hash wins the expansion`, s.open.join() === "starter", `[${s.open}]`);
      check(`S9 ${locale}: the preference is not overwritten`, s.tierValue === "bis", String(s.tierValue));
      check(`S9 ${locale}: aria-pressed still marks the preference`, s.pressed.join() === "bis", `[${s.pressed}]`);
      check(`S9 ${locale}: aria-current marks what is on screen`, s.current.join() === "starter", `[${s.current}]`);
    }
    {
      await seed(page, site.origin, "budget");
      await page.goto(`${url(site.origin, "en-us", subject.classSlug, subject.slug)}#gear-nope`);
      const s = await page.evaluate<State>(PROBE);
      check("S10 invalid hash falls back to the preference", s.open.join() === "budget", `[${s.open}]`);
    }

    // -----------------------------------------------------------------------
    // T1 / C8 — selecting never moves the page
    // -----------------------------------------------------------------------
    console.log("\nT1 · selecting writes once and never moves the page");
    for (const at of [0, 600]) {
      await clearStorage(page, site.origin);
      await page.setViewport(390, 844);
      await page.goto(url(site.origin, "en-us", subject.classSlug, subject.slug));
      if (at) await page.evaluate(`window.scrollTo(0, ${at})`);
      const before = await settledScrollY(page);
      const box = await page.evaluate<{ x: number; y: number } | null>(
        `(() => { const c = document.querySelector('[data-tier="optimized"]:not(#gear [data-tier])');
                  if (!c) return null; const r = c.getBoundingClientRect();
                  return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) }; })()`,
      );
      check(`at scrollY=${at}: the control is on screen to click`, box !== null);
      if (!box) continue;
      await page.click(box.x, box.y);
      await page.waitFor(`document.querySelector('[data-tier="optimized"]').getAttribute("aria-pressed") === "true"`);
      const after = await settledScrollY(page);
      const s = await page.evaluate<State>(PROBE);
      check(`at scrollY=${at}: scrollY is unchanged`, before >= 0 && after === before, `${before} → ${after}`);
      check(`at scrollY=${at}: no sideways movement`, s.scrollLeft === 0, `${s.scrollLeft}`);
      check(`at scrollY=${at}: exactly one key was written`, s.storage.length === 1 && s.storage[0] === TIER_KEY, s.storage.join(","));
      check(`at scrollY=${at}: with a canonical value`, s.tierValue === "optimized", String(s.tierValue));
      check(`at scrollY=${at}: the URL is untouched`, !s.href.includes("#") && !s.href.includes("?"), s.href);
      check(`at scrollY=${at}: the action now points at it`, s.goTo === "#gear-optimized" && s.goToVisible, String(s.goTo));
    }

    // -----------------------------------------------------------------------
    // T3 / T4 / C26 — idempotent re-activation, and Limpar
    // -----------------------------------------------------------------------
    console.log("\nC26 · re-activating is idempotent; only Limpar clears");
    {
      await seed(page, site.origin, "budget");
      await page.goto(url(site.origin, "en-us", subject.classSlug, subject.slug));
      const box = await page.evaluate<{ x: number; y: number } | null>(
        `(() => { const c = document.querySelector('[data-tier="budget"]:not(#gear [data-tier])');
                  const r = c.getBoundingClientRect();
                  return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) }; })()`,
      );
      await page.click(box!.x, box!.y);
      await page.evaluate("new Promise(r => setTimeout(() => r(1), 150))");
      const s = await page.evaluate<State>(PROBE);
      check("re-activating the pressed control keeps the preference", s.tierValue === "budget", String(s.tierValue));
      check("…and keeps exactly one key", s.storage.length === 1, s.storage.join(","));
      check("…and keeps it expanded", s.open.join() === "budget", `[${s.open}]`);

      const clearBox = await page.evaluate<{ x: number; y: number } | null>(
        `(() => { const c = document.querySelector("[data-clear-tier]"); if (!c) return null;
                  const r = c.getBoundingClientRect();
                  return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) }; })()`,
      );
      check("the Limpar control exists", clearBox !== null);
      if (clearBox) {
        const before = await settledScrollY(page);
        await page.click(clearBox.x, clearBox.y);
        await page.waitFor(`document.querySelectorAll('[aria-pressed="true"]').length === 0`);
        const after = await settledScrollY(page);
        const c = await page.evaluate<State>(PROBE);
        check("Limpar removes the key", c.storage.length === 0, c.storage.join(","));
        check("…and nothing is pressed", c.anyPressedTrue === 0);
        check("…and the label goes back to the question", c.legend.includes(picker("en-us").legend ?? " "), c.legend);
        check("…and no action is promised", !c.goToVisible && !c.clearVisible);
        check("…and the page did not move", after === before, `${before} → ${after}`);
      }
    }

    // -----------------------------------------------------------------------
    // C27 — opening a <summary> keeps the reader's visual position
    // -----------------------------------------------------------------------
    console.log("\nC27 · opening a summary preserves visual position, and writes nothing");
    {
      await clearStorage(page, site.origin);
      await page.goto(url(site.origin, "en-us", subject.classSlug, subject.slug));
      await page.evaluate(`document.getElementById("gear-bis").scrollIntoView()`);
      await page.evaluate("new Promise(r => setTimeout(() => r(1), 250))");
      const rectBefore = await page.evaluate<number>(
        `Math.round(document.getElementById("gear-bis").getBoundingClientRect().top)`,
      );
      await page.evaluate(
        `(() => { const s = document.getElementById("gear-starter"); s.open = true;
                  s.dispatchEvent(new Event("toggle")); return 1; })()`,
      );
      await page.evaluate("new Promise(r => setTimeout(() => r(1), 250))");
      const rectAfter = await page.evaluate<number>(
        `Math.round(document.getElementById("gear-bis").getBoundingClientRect().top)`,
      );
      const s = await page.evaluate<State>(PROBE);
      check("the element being read stays where it was", Math.abs(rectAfter - rectBefore) <= 2, `${rectBefore} → ${rectAfter}`);
      check("opening is not choosing: nothing was written", s.storage.length === 0, s.storage.join(","));
      check("…and nothing became pressed", s.anyPressedTrue === 0);
      check("…and both tiers are open", s.open.includes("starter") && s.open.includes("bis"), `[${s.open}]`);
      check("…and only the open tiers hide their previews",
        s.slotLines.every((l) => l.visible === !s.open.includes(l.tier)),
        JSON.stringify(s.slotLines.map((l) => `${l.tier}:${l.visible}`)));
    }

    // -----------------------------------------------------------------------
    // C8b — the in-Gear mirror navigates and nothing more
    // -----------------------------------------------------------------------
    console.log("\nC8b · the sticky mirror navigates, and does not write or expand");
    {
      await clearStorage(page, site.origin);
      await page.setViewport(1280, 900);
      await page.goto(url(site.origin, "en-us", subject.classSlug, subject.slug));
      const s0 = await page.evaluate<State>(PROBE);
      check("the mirror exists inside Gear", s0.mirrorCount === 6, `${s0.mirrorCount}`);
      check("the mirror carries no aria-pressed", s0.mirrorPressed === 0, `${s0.mirrorPressed}`);
      await page.evaluate(`document.querySelector("#gear [data-tier='optimized']").click()`);
      await page.evaluate("new Promise(r => setTimeout(() => r(1), 250))");
      const s1 = await page.evaluate<State>(PROBE);
      check("activating the mirror writes nothing", s1.storage.length === 0, s1.storage.join(","));
      check("…and presses nothing", s1.anyPressedTrue === 0, `${s1.anyPressedTrue}`);
      check("…and expands nothing", s1.open.length === 0, `[${s1.open}]`);
      check("…but it did navigate", s1.href.endsWith("#gear-optimized"), s1.href);
    }

    // -----------------------------------------------------------------------
    // C17 — no sticky below 640 but the header
    // -----------------------------------------------------------------------
    console.log("\nC17 · nothing but the header is sticky below 640px");
    for (const w of [320, 390]) {
      await page.setViewport(w, 640);
      await clearStorage(page, site.origin);
      await page.goto(url(site.origin, "en-us", subject.classSlug, subject.slug));
      const s = await page.evaluate<State>(PROBE);
      const stray = s.stickyBelowHeader.filter((x) => x !== "header");
      check(`${w}px: only the header is sticky`, stray.length === 0, stray.join(" | "));
    }

    // -----------------------------------------------------------------------
    // C25b — nothing is inferred
    // -----------------------------------------------------------------------
    console.log("\nC25b · no stage is inferred from anything");
    for (const locale of LOCALES) {
      for (const w of [320, 390, 768, 1280]) {
        await page.setViewport(w, w === 320 ? 640 : 844);
        await clearStorage(page, site.origin);
        await page.goto(url(site.origin, locale, subject.classSlug, subject.slug));
        const s = await page.evaluate<State>(PROBE);
        check(`${locale} @${w}: six closed, none pressed`, s.open.length === 0 && s.anyPressedTrue === 0,
          `open=[${s.open}] pressed=${s.anyPressedTrue}`);
      }
    }

    // -----------------------------------------------------------------------
    // T5 / T6 — the preference outlives a build and a language
    // -----------------------------------------------------------------------
    console.log("\nT5/T6 · the preference survives pages and languages");
    {
      await seed(page, site.origin, "early-hell");
      await page.setViewport(390, 844);
      for (const sub of SUBJECTS) {
        await page.goto(url(site.origin, "en-us", sub.classSlug, sub.slug));
        const s = await page.evaluate<State>(PROBE);
        check(`carried into ${sub.slug}`, s.open.join() === "early-hell" && s.tierValue === "early-hell", `[${s.open}]`);
      }
      await page.goto(url(site.origin, "pt-br", subject.classSlug, subject.slug));
      const pt = await page.evaluate<State>(PROBE);
      check("carried across the language switch", pt.open.join() === "early-hell" && pt.tierValue === "early-hell", `[${pt.open}]`);
      check("…and the label is the Portuguese one", pt.legend.includes((picker("pt-br").myTier ?? " ").split("{")[0].trim()), pt.legend);
    }

    // -----------------------------------------------------------------------
    // Regression: the mobile menu is still a working <details>
    // -----------------------------------------------------------------------
    console.log("\nregression · the header menu still works");
    {
      await page.setViewport(390, 844);
      await clearStorage(page, site.origin);
      await page.goto(url(site.origin, "en-us", subject.classSlug, subject.slug));
      const header = await page.evaluate<{ details: number; open: boolean }>(
        `(() => { const d = document.querySelector("header details");
                  return { details: document.querySelectorAll("header details").length, open: !!(d && d.open) }; })()`,
      );
      check("the header still has exactly one <details>", header.details === 1, `${header.details}`);
      check("…and it is shut on load", header.open === false);
    }
  } finally {
    page.close();
    site.stop();
  }

  console.log(`\n${passed} checks passed.`);
  if (failures.length) {
    console.error(`\n${failures.length} FAILED:`);
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
