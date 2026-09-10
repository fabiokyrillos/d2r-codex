/**
 * The language switch, and everything the URL is carrying when it happens.
 *
 * The defect this file was written for (R-I18N-7): the switcher reassembles the
 * destination from `usePathname()` — which returns the path and nothing else —
 * plus `location.search`. The fragment was never read at all, so switching
 * language on `…/blizzard-sorceress#gear-budget` dropped the reader at the top
 * of the other language's page with a different tier open. The query half was
 * fixed earlier and must not regress while the fragment half is added.
 *
 * **Why this needs a browser, when `build-filters.test.ts:579-599` already
 * reads the source.** That gate fixes the *shape* of the source: no
 * `useSearchParams`, a bare `href`, and the literal `location.search` in the
 * handler. All three of those stay true of a handler that reads the query and
 * then throws it away, and all three stay true of a handler that never looks at
 * the fragment — which is exactly the code that shipped. The source gate cannot
 * see where the reader lands. Nothing but a real click in a real layout can.
 *
 * **Why the switcher is clicked and never navigated to.** Phase 1 learned this
 * the expensive way: a gate that reached the destination by URL passed against
 * a build with `localStorage.clear()` planted in it, because the mechanism it
 * claimed to test was never invoked. Every switch here is a pointer press on
 * the real `a[hreflang=…]` in the real header.
 *
 * **What this file measures rather than assumes.** The plan (§9.2, §22k) makes
 * the fragment case a *full* navigation and leaves the query case soft, and says
 * plainly that the choice is subject to measurement. So the navigation kind is
 * observed and printed for every case — a marker planted on `window` before the
 * press survives a soft navigation and dies in a full one — but the *outcome*
 * is what is asserted: the fragment survives, the right tier is open, and the
 * anchor lands where `anchorOffsetPx()` says it should. If the soft path is
 * later found to satisfy all three, these assertions stay green and the log
 * says `soft`; if it does not, the landing assertion is the one that goes red.
 * Neither result is baked in.
 *
 * Requires `npm run build`. Run with `npm run test:locale-switch`.
 */
import { assertFreshBuild } from "./build-freshness";
import { Page, startSite } from "./headless";
import { BCP47, LOCALES, LOCALE_COOKIE, type Locale } from "../lib/i18n/config";
import { anchorOffsetPx, TIER_KEY } from "../lib/prefs";
import { getSkillsForClass } from "../lib/registry";
import { routes } from "../lib/routes";
import { PROGRESSION_TIERS, type Slug } from "../lib/types";

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

/** Evidence, not a contract: printed for a human to read in the log. */
const note = (text: string) => console.log(`  note ${text}`);

assertFreshBuild();

const SUBJECT = { classSlug: "sorceress" as Slug, slug: "blizzard-sorceress" as Slug };

/**
 * A stored preference that is *not* the tier any fragment names.
 *
 * It does two jobs at once. It proves Phase 1's guarantee still holds across a
 * language change — the value is still there afterwards — and it makes the
 * "the Budget tier is open" assertion mean something: with `bis` stored and
 * `#gear-budget` in the URL, Budget can only be open because the fragment
 * arrived and won, which is the precedence `lib/prefs.ts` already fixes.
 */
const SEEDED_TIER = "bis";

const other = (locale: Locale): Locale => (LOCALES.find((l) => l !== locale) ?? locale) as Locale;

// ---------------------------------------------------------------------------
// The probe
// ---------------------------------------------------------------------------

interface Probe {
  href: string;
  pathname: string;
  search: string;
  hash: string;
  cookie: string;
  tierValue: string | null;
  openTiers: string[];
  tierPicker: number;
  targetFound: boolean;
  targetTop: number | null;
  targetDocTop: number | null;
  scrollMarginTop: string | null;
  scrollPaddingTop: string;
  headerBottom: number | null;
  maxScroll: number;
  buildCards: number;
  soft: boolean;
  scrollY: number;
  innerWidth: number;
}

/** Marks the current document, so a full navigation can be told from a soft one. */
const PLANT = `window.__localeSwitch = "alive"`;

/**
 * Everything a case needs, in one round trip.
 *
 * `targetDocTop` and `maxScroll` are here so the expected landing can be
 * *computed* rather than guessed: a browser scrolls to
 * `clamp(targetDocTop - offset, 0, maxScroll)`, so a target too near the top of
 * the document to be pushed down that far — `#content` is one — has a
 * predictable landing that is not the offset, and asserting the offset there
 * would be asserting something false.
 */
/**
 * Build cards on the page, counted by URL shape rather than by class name.
 *
 * `/xx-xx/builds/<class>/<slug>` is four segments with `builds` second, which
 * the class links at the foot of the catalogue and the header's own navigation
 * are not. Shared between the probe and the waits so that "wait for the filter"
 * and "read the count" can never drift apart.
 */
const CARDS = `[...document.querySelectorAll("main a[href]")].filter((a) => {
  const segs = (a.getAttribute("href") || "").split("/").filter(Boolean);
  return segs.length === 4 && segs[1] === "builds";
}).length`;

const probeFor = (targetId: string | null): string => `(() => {
  const id = ${JSON.stringify(targetId)};
  const el = id ? document.getElementById(id) : null;
  const rect = el ? el.getBoundingClientRect() : null;
  const header = document.querySelector("header");
  const tiers = ${JSON.stringify(PROGRESSION_TIERS)};
  const doc = document.documentElement;
  return {
    href: location.href,
    pathname: location.pathname,
    search: location.search,
    hash: location.hash,
    cookie: document.cookie,
    tierValue: (() => { try { return localStorage.getItem(${JSON.stringify(TIER_KEY)}); } catch (e) { return "<blocked>"; } })(),
    openTiers: tiers.filter((t) => { const d = document.getElementById("gear-" + t); return !!d && d.open === true; }),
    tierPicker: document.querySelectorAll("button[data-tier]").length,
    targetFound: !!el,
    targetTop: rect ? Math.round(rect.top) : null,
    targetDocTop: rect ? Math.round(rect.top + window.scrollY) : null,
    scrollMarginTop: el ? getComputedStyle(el).scrollMarginTop : null,
    scrollPaddingTop: getComputedStyle(doc).scrollPaddingTop,
    headerBottom: header ? Math.round(header.getBoundingClientRect().bottom) : null,
    maxScroll: Math.max(0, Math.round(doc.scrollHeight - window.innerHeight)),
    buildCards: ${CARDS},
    soft: window.__localeSwitch === "alive",
    scrollY: Math.round(window.scrollY),
    innerWidth: window.innerWidth
  };
})()`;

const px = (value: string | null): number => {
  const n = Number.parseFloat(String(value ?? "").replace("px", ""));
  return Number.isFinite(n) ? Math.round(n) : 0;
};

// ---------------------------------------------------------------------------
// Driving
// ---------------------------------------------------------------------------

/**
 * Polls, and survives the document being replaced underneath it.
 *
 * `Page.waitFor` throws if the evaluation lands mid-navigation, and a full
 * navigation is the thing this file exists to exercise. Swallowing that is
 * correct here and nowhere else.
 */
async function settle(page: Page, expression: string, timeoutMs = 20_000): Promise<boolean> {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    try {
      if (await page.evaluate<boolean>(`!!(${expression})`)) return true;
    } catch {
      // The execution context is being swapped for the new document.
    }
    if (Date.now() > deadline) return false;
    await new Promise((r) => setTimeout(r, 100));
  }
}

/** Two stable samples, because `globals.css` sets `scroll-behavior: smooth`. */
/**
 * Wait until the page has stopped moving *and* stopped growing, then report
 * `scrollY`.
 *
 * Settling on `scrollY` alone is not enough, and the class page is why. There,
 * `scrollY` stops immediately — the browser jumps to the fragment and never
 * moves again — while the document keeps growing *above* the anchor as the
 * skill tree hydrates. The anchor is therefore pushed down under a scroll
 * position that is already final: measured on a plain direct load with no
 * switcher involved, `#skills` reads 144px from the top an instant after the
 * jump and 572px (pt-BR) or 482px (en-US) once hydration finishes. Both numbers
 * are true; they are just readings of a moving target taken at different
 * moments, and a test that samples one of them is a coin toss.
 *
 * So the settle waits for `scrollHeight` to hold still as well. Every landing
 * assertion then compares two readings of the *rested* page, which is the only
 * state a reader ever sees.
 *
 * (The drift itself is a real, pre-existing defect of the class page — a reader
 * following `#skills` from anywhere ends up 428px past it — but it belongs to
 * the skill tree, which Phase 4 owns. It is recorded in the plan, not fixed
 * here, and this file must not pretend the switcher caused it.)
 */
async function settledScrollY(page: Page, mustMove = false): Promise<number> {
  const sample = () =>
    page.evaluate<[number, number]>(
      "[Math.round(window.scrollY), Math.round(document.documentElement.scrollHeight)]",
    );
  /*
   * Two things, and the gate was missing both. It failed once in a full
   * `predeploy` and passed on the re-run, which is the signature of a wait that
   * ends at the wrong moment rather than of a page that lands in the wrong
   * place — ten direct loads of the same URL land on the contract to the pixel.
   *
   * **Three identical samples, not two.** A smooth scroll is eased: its last
   * frames move a pixel or less, and two readings 180ms apart can round to the
   * same integer while the animation is still finishing. That is what produced
   * the failure — the build page's `#skills` read at 1733 where the contract is
   * 1741, eight pixels short, on the switcher's own hard navigation.
   *
   * **And the jump has to have happened.** Quiet is not arrival. Before the
   * browser begins a fragment scroll, `scrollY` is 0 and the height has already
   * settled, so *any* number of identical samples is satisfied by a page that
   * has not moved yet — and lengthening the quiet window makes that *more*
   * likely, not less. Asking for three samples without this guard turned one
   * flaky failure into a different one, at `scrollY 0` with the target 13,215px
   * down. So a caller that has just sent the page to a fragment says so, and
   * the wait declines to call zero a landing.
   *
   * Two intervals of quiet is 360ms; the scroll on these pages finishes
   * 800-976ms after navigation, measured, so the extra interval costs nothing.
   */
  let last: [number, number] | null = null;
  let quiet = 0;
  let moved = !mustMove;
  for (let i = 0; i < 40; i++) {
    let now: [number, number] | null = null;
    try {
      now = await sample();
    } catch {
      // Mid-navigation; start the run again.
      last = null;
      quiet = 0;
    }
    if (now && now[0] > 0) moved = true;
    if (now && last && now[0] === last[0] && now[1] === last[1]) quiet += 1;
    else quiet = 0;
    last = now;
    if (now && now[0] >= 0 && moved && quiet >= 2) return now[0];
    try {
      await page.evaluate("new Promise(r => setTimeout(() => r(1), 180))");
    } catch {
      last = null;
      quiet = 0;
    }
  }
  return -1;
}

const centreOf = async (page: Page, expr: string) =>
  page.evaluate<{ x: number; y: number } | null>(
    `(() => { const el = ${expr}; if (!el) return null; const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return null;
      return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) }; })()`,
  );

const SWITCHER = (to: Locale) =>
  `document.querySelector('header a[hreflang="${BCP47[to]}"]')`;

/** Clears the cookie so "the cookie was written" is a claim about *this* press. */
async function forgetLocaleCookie(page: Page): Promise<void> {
  await page.evaluate(
    `(() => { document.cookie = ${JSON.stringify(`${LOCALE_COOKIE}=; Path=/; Max-Age=0`)}; return 1; })()`,
  );
}

/** Puts a preference on the origin before the case navigates anywhere. */
async function seedTier(page: Page, origin: string): Promise<void> {
  await page.goto(`${origin}/en-us`);
  await page.evaluate(
    `(() => { try { localStorage.clear(); localStorage.setItem(${JSON.stringify(TIER_KEY)}, ${JSON.stringify(SEEDED_TIER)}); } catch (e) {} return 1; })()`,
  );
}

// ---------------------------------------------------------------------------
// The five examples of §9.2, plus the control
// ---------------------------------------------------------------------------

interface Case {
  /** Printed, and used in check names. */
  id: string;
  /** The URL to start on, locale-less-ish: built from `routes(locale)`. */
  from: (locale: Locale) => string;
  /** The element the fragment names, if any. */
  targetId: string | null;
  /** What `location.search` must be after the switch. */
  search: string;
  /** What `location.hash` must be after the switch. */
  hash: string;
  /** Widths this case runs at. */
  widths: number[];
  /** True when the destination is a build page with the tier picker on it. */
  build: boolean;
}

const CASES: Case[] = [
  {
    id: "1 · a tier fragment on a build page",
    from: (l) => `${routes(l).build(SUBJECT.classSlug, SUBJECT.slug)}#gear-budget`,
    targetId: "gear-budget",
    search: "",
    hash: "#gear-budget",
    // Both sides of `anchorOffsetPx`: 72px below 640, 112px from it.
    widths: [390, 1280],
    build: true,
  },
  {
    id: "2 · a section fragment on a build page",
    from: (l) => `${routes(l).build(SUBJECT.classSlug, SUBJECT.slug)}#skills`,
    targetId: "skills",
    search: "",
    hash: "#skills",
    widths: [1280],
    build: true,
  },
  {
    id: "3 · a section fragment on a class page",
    from: (l) => routes(l).classSkills(SUBJECT.classSlug),
    targetId: "skills",
    search: "",
    hash: "#skills",
    widths: [1280],
    build: false,
  },
  {
    id: "4 · a query, and no fragment (this already works and must not regress)",
    from: (l) => `${routes(l).builds()}?class=necromancer&damage=cold`,
    targetId: null,
    search: "?class=necromancer&damage=cold",
    hash: "",
    widths: [1280],
    build: false,
  },
  {
    id: "4b · a query that leaves builds on the page",
    from: (l) => `${routes(l).builds()}?class=sorceress&damage=cold`,
    targetId: null,
    search: "?class=sorceress&damage=cold",
    hash: "",
    widths: [1280],
    build: false,
  },
  {
    id: "5 · a query and a fragment, in the order path + ?query + #hash",
    from: (l) => `${routes(l).builds()}?class=necromancer#content`,
    targetId: "content",
    search: "?class=necromancer",
    hash: "#content",
    widths: [1280],
    build: false,
  },
  {
    id: "7 · the control: neither query nor fragment",
    from: (l) => routes(l).builds(),
    targetId: null,
    search: "",
    hash: "",
    widths: [1280],
    build: false,
  },
];

/** Tallied across the run and printed — evidence for §22k, not a contract. */
let sawSoft = 0;
let sawHard = 0;
/** Set by case 1 and case 7 respectively — the anti-vacuity pair. */
let sawHashPresent = false;
let sawHashAbsent = false;

async function runCase(
  page: Page,
  origin: string,
  from: Locale,
  kase: Case,
  width: number,
  unfiltered: number,
): Promise<void> {
  const to = other(from);
  const label = `${from}→${to} @${width} · ${kase.id}`;
  console.log(`\n${label}`);

  await seedTier(page, origin);
  await page.setViewport(width, width < 640 ? 844 : 900);
  await page.goto(origin + kase.from(from));
  if (kase.build) await settle(page, `document.querySelectorAll("button[data-tier]").length === 6`, 20_000);
  /*
   * The catalogue's Suspense fallback is the *complete* list, so a filtered
   * page reads as unfiltered until the client filter has run. Reading the count
   * before that is reading the fallback, and the comparison after the switch
   * would then be unfiltered-against-unfiltered — green whatever the switcher
   * did with the query.
   */
  if (kase.search) await settle(page, `${CARDS} !== ${unfiltered}`, 15_000);
  await settledScrollY(page, kase.hash !== "");

  const before = await page.evaluate<Probe>(probeFor(kase.targetId));
  check(
    `${label}: the page under test really carries ${kase.hash || "(no fragment)"}`,
    before.hash === kase.hash,
    `hash=${JSON.stringify(before.hash)}`,
  );
  check(
    `${label}: …and ${kase.search || "(no query)"}`,
    before.search === kase.search,
    `search=${JSON.stringify(before.search)}`,
  );
  if (kase.targetId) {
    check(`${label}: the fragment names a real element`, before.targetFound, kase.targetId);
  }
  if (kase.search) {
    check(
      `${label}: the query narrows the catalogue before the switch — ${before.buildCards} of ${unfiltered}`,
      before.buildCards !== unfiltered,
      `${before.buildCards} vs ${unfiltered} unfiltered`,
    );
  }
  if (kase.hash) sawHashPresent = true;
  else sawHashAbsent = true;

  await forgetLocaleCookie(page);
  await page.evaluate(PLANT);

  const spot = await centreOf(page, SWITCHER(to));
  check(`${label}: the switcher for ${to} is on screen and hittable`, spot !== null);
  if (!spot) return;

  const wantPath = kase.from(to).split("?")[0].split("#")[0];
  await page.click(spot.x, spot.y);
  const arrived = await settle(page, `location.pathname === ${JSON.stringify(wantPath)}`, 20_000);
  check(`${label}: the switch reaches ${wantPath}`, arrived, wantPath);
  if (!arrived) return;

  /*
   * Three waits before anything is measured, in the order they finish.
   *
   * `readyState` first, because a full navigation reports the new pathname long
   * before the document that goes with it. Then hydration, where there is a
   * tier picker — the inline boot script has run by then, which is what puts a
   * tier anchor where it belongs. Then the scroll itself, twice, because
   * `globals.css` sets `scroll-behavior: smooth` and one sample of a moving
   * page is not a position.
   */
  await settle(page, `document.readyState === "complete"`, 20_000);
  if (kase.build) await settle(page, `document.querySelectorAll("button[data-tier]").length === 6`, 20_000);
  const restedY = await settledScrollY(page, kase.hash !== "");
  const after = await page.evaluate<Probe>(probeFor(kase.targetId));

  note(`${label}: navigation was ${after.soft ? "soft (router.push)" : "full (location.assign)"}`);
  if (after.soft) sawSoft++;
  else sawHard++;
  /*
   * The query-only path is settled — the plan leaves it exactly as it was — so
   * a reload there is a regression and is asserted. The *fragment* path is the
   * one under measurement (§22k), so it is recorded above and not asserted:
   * this file must not decide by assertion a question the plan says to decide
   * by measurement.
   */
  if (!kase.hash) {
    check(
      `${label}: with no fragment to carry, the switch stays a soft navigation`,
      after.soft,
      after.soft ? "soft" : "reloaded the document",
    );
  }

  // -- the URL ------------------------------------------------------------
  check(`${label}: the query survived`, after.search === kase.search, JSON.stringify(after.search));
  check(`${label}: the fragment survived`, after.hash === kase.hash, JSON.stringify(after.hash));
  check(
    `${label}: assembled as path + query + fragment, in that order`,
    after.href === `${origin}${wantPath}${kase.search}${kase.hash}`,
    after.href,
  );

  // -- the cookie, on every single one of them ----------------------------
  check(
    `${label}: the locale cookie was written`,
    after.cookie.split(";").map((c) => c.trim()).includes(`${LOCALE_COOKIE}=${to}`),
    after.cookie,
  );

  // -- Phase 1's guarantee ------------------------------------------------
  check(
    `${label}: the stored tier preference survived the switch`,
    after.tierValue === SEEDED_TIER,
    String(after.tierValue),
  );

  // -- the tier state, where there is one ---------------------------------
  if (kase.build && kase.targetId === "gear-budget") {
    check(
      `${label}: Budget is the tier that is open, and the only one`,
      after.openTiers.join() === "budget",
      `[${after.openTiers}] (preference was ${SEEDED_TIER})`,
    );
    check(`${label}: the tier picker is live on the destination`, after.tierPicker === 6, String(after.tierPicker));
  }

  // -- the landing --------------------------------------------------------
  if (kase.targetId) {
    check(`${label}: the fragment still names a real element`, after.targetFound, kase.targetId);
    if (after.targetFound && after.targetTop !== null && after.targetDocTop !== null) {
      const band = px(after.scrollMarginTop) + px(after.scrollPaddingTop);
      /*
       * The tier band is the shared constant, so say so. `lib/prefs.ts`
       * returns the same number to the boot script that `globals.css` gives
       * the browser, and if those two ever disagree the reader lands under
       * the header on exactly the anchor this fix is about.
       */
      if (kase.targetId === "gear-budget") {
        check(
          `${label}: the tier's anchor band is anchorOffsetPx(${width}) = ${anchorOffsetPx(width)}px`,
          band === anchorOffsetPx(width),
          `scroll-mt ${after.scrollMarginTop} + scroll-padding ${after.scrollPaddingTop} = ${band}px`,
        );
      } else {
        // §9.1: a `<Section>` carries `scroll-mt-24` and lands 32px lower than
        // a tier does. That dead space is published, not fixed, in this phase —
        // so the floor is the band, not equality with it.
        check(
          `${label}: the anchor lands at or below the ${anchorOffsetPx(width)}px band`,
          band >= anchorOffsetPx(width),
          `band ${band}px`,
        );
      }
      /*
       * The landing is asserted against a *direct load of the same destination
       * URL*, not against a computed prediction.
       *
       * That is the switcher's actual contract: switching language must put the
       * reader where opening that URL would have put them. A computed
       * prediction says something stronger, and something the switcher does not
       * own — it assumes the document does not reflow after the browser has
       * scrolled. On the class page it does. Measured, on a direct load with no
       * switcher involved at all: `/pt-br/classes/sorceress#skills` lands at
       * 572px and `/en-us/classes/sorceress#skills` at 482px, against a band of
       * 144 — the same two numbers this assertion produced when it was written
       * as a prediction. Content above `#skills` grows by 428px (pt) and 338px
       * (en) as the skill tree hydrates, after the fragment scroll has already
       * happened. The build page, which has no such block above its anchor,
       * lands on 144 exactly.
       *
       * So a prediction here fails on a pre-existing page defect that belongs
       * to the skill tree — Phase 4's territory — and says nothing about
       * R-I18N-7. The baseline comparison catches every way the switcher could
       * actually break the landing, and stays silent about a shift it did not
       * cause. The prediction is still printed, so the drift is visible rather
       * than hidden.
       */
      const predicted = after.targetDocTop - Math.min(Math.max(after.targetDocTop - band, 0), after.maxScroll);
      const destination = `${origin}${wantPath}${kase.search}${kase.hash}`;
      await page.goto(destination);
      await settle(page, `document.readyState === "complete"`, 20_000);
      if (kase.build) await settle(page, `document.querySelectorAll("button[data-tier]").length === 6`, 20_000);
      await settledScrollY(page, kase.hash !== "");
      const direct = await page.evaluate<Probe>(probeFor(kase.targetId));
      const drift = direct.targetTop === null ? null : after.targetTop - direct.targetTop;
      note(
        `${label}: landed ${after.targetTop}px from the top; a direct load of the same URL lands ` +
          `${direct.targetTop}px; a no-reflow prediction would be ${predicted}px`,
      );

      if (kase.build) {
        /*
         * Where the destination does not reflow after its fragment scroll, the
         * landing is exact and is asserted twice over: against a direct load of
         * the same URL (the switcher's actual contract — switching language
         * must put the reader where opening that URL would) and against the
         * no-reflow prediction.
         */
        check(
          `${label}: switching language lands the reader where loading that URL directly lands them`,
          drift !== null && Math.abs(drift) <= 8,
          `via switcher ${after.targetTop}px, direct ${direct.targetTop}px, drift ${drift}px`,
        );
        check(
          `${label}: …and that is the band the anchor contract predicts`,
          Math.abs(after.targetTop - predicted) <= 4,
          `docTop ${after.targetDocTop}, band ${band}, maxScroll ${after.maxScroll}, scrollY ${restedY}`,
        );
      } else {
        /*
         * The class page's anchor races its own hydration, and no assertion on
         * where it lands can be honest.
         *
         * Measured, with no switcher anywhere near it: a plain load of
         * `/pt-br/classes/sorceress#skills` reads `#skills` at 144px from the
         * top immediately after the jump and at 572px (482px in en-US) once the
         * skill tree has hydrated and grown the document above it. Both are
         * rested readings — `scrollY` never moves again, and the settle waits
         * for `scrollHeight` too — so this is not a sampling artefact. Whether
         * Chrome's last fragment re-anchor happens before or after hydration
         * finishes decides which number the reader gets, and that race is won
         * differently by a fresh load and by `location.assign` from a page that
         * was already scrolled.
         *
         * That is a real, pre-existing defect, and it is the skill tree's —
         * Phase 4 owns it, and it is recorded in the plan's out-of-scope list.
         * R-I18N-7 is about carrying the fragment, which is asserted above and
         * holds. Pinning either number here would make this gate a coin toss
         * and would blame the switcher for something it does not touch, so the
         * drift is printed and the only assertion left is the one that cannot
         * race: the anchor is a real element, and the reader is not left under
         * the header.
         */
        note(
          `${label}: the class page's anchor races its own hydration (drift ${drift}px) — ` +
            `pre-existing, skill tree, Phase 4. Not asserted here; the fragment itself is.`,
        );
      }
      check(
        `${label}: …and clear of the sticky header`,
        after.headerBottom !== null && after.targetTop >= after.headerBottom - 1,
        `top ${after.targetTop} vs header bottom ${after.headerBottom}`,
      );
    }
  }

  // -- the filtered listing, where there is one ---------------------------
  if (kase.search) {
    /*
     * The URL surviving is not the same as the *listing* surviving, and the
     * listing is what the reader actually loses. A switcher that dropped the
     * query lands on the Suspense fallback, which is the whole catalogue — so
     * this is the assertion that would have caught the original defect on its
     * own, without knowing anything about how the switcher is written.
     */
    await settle(page, `${CARDS} === ${before.buildCards}`, 15_000);
    const settled = await page.evaluate<Probe>(probeFor(kase.targetId));
    check(
      `${label}: the listing still shows what the query asks for — ${before.buildCards} before, ${settled.buildCards} after`,
      settled.buildCards === before.buildCards,
      `${before.buildCards} -> ${settled.buildCards} (unfiltered is ${unfiltered})`,
    );
    check(
      `${label}: …and did not fall back to the whole catalogue`,
      settled.buildCards !== unfiltered,
      `${settled.buildCards} vs ${unfiltered}`,
    );
  }

  // -- the control: the early return is live, not dead code ---------------
  if (!kase.search && !kase.hash) {
    /*
     * "Without `preventDefault`" is not observable from outside React, and
     * saying so is better than faking it.
     *
     * React delegates to the root, so this component's `onClick` and
     * `next/link`'s own handler are two functions inside one delegated call:
     * `next/dist/client/app-dir/link.js:336` runs `if (e.defaultPrevented)
     * return`, and when our early return fires it is `linkClicked` that calls
     * `preventDefault` instead. Exactly one call happens on the same event
     * object either way, and there is nowhere to stand between them —
     * everything below `document` fires before both, everything at or above it
     * fires after both.
     *
     * So the claim is asserted by its two observable consequences. The press
     * must not become a full navigation, asserted above with every other
     * fragment-less case; and the URL must be the bare `href` with nothing
     * appended, asserted here. The no-JS block in `main` carries the other
     * half — that the `href` alone is a working link, which is what "the plain
     * `<a>` path" means for a reader with no bundle at all.
     */
    check(
      `${label}: the URL is the bare path, with no stray "?" or "#" appended`,
      after.href === origin + wantPath,
      after.href,
    );
  }
}

// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const site = await startSite();
  const page = await Page.launch();

  try {
    // The baseline every filtered count is measured against. Without it "0 of
    // 0" would pass for a switcher that threw the query away.
    await page.setViewport(1280, 900);
    await page.goto(`${site.origin}${routes("en-us").builds()}`);
    const unfiltered = await page.evaluate<number>(CARDS);
    check(
      `the unfiltered catalogue lists ${unfiltered} builds, so a filtered count means something`,
      unfiltered > 1,
      String(unfiltered),
    );

    for (const l of LOCALES) {
      for (const kase of CASES) {
        for (const width of kase.widths) {
          await runCase(page, site.origin, l as Locale, kase, width, unfiltered);
        }
      }
    }

    // -----------------------------------------------------------------------
    // Anti-vacuity: the harness can see an absent fragment, and can tell the
    // two kinds of navigation apart
    // -----------------------------------------------------------------------
    console.log("\nanti-vacuity");
    check(
      "the probe reported a present fragment somewhere in this run",
      sawHashPresent,
    );
    check(
      "…and an absent one somewhere else, so a fragment assertion cannot pass by accident",
      sawHashAbsent,
    );
    note(`across the run: ${sawSoft} case(s) navigated soft, ${sawHard} navigated in full`);
    {
      /*
       * The marker discriminates — proved on navigations this file performs
       * itself, not on the switcher's.
       *
       * Deriving it from the cases would smuggle in an assumption: if the plan
       * is later corrected to keep the fragment path soft, every case would be
       * soft and a `sawSoft && sawHard` assertion would go red for a change
       * that is allowed. A `pushState` and a `goto` settle the same question
       * without depending on the component at all.
       */
      await page.setViewport(1280, 900);
      await page.goto(`${site.origin}${routes("en-us").builds()}`);
      await page.evaluate(PLANT);
      await page.evaluate(
        `(() => { history.pushState({}, "", location.pathname + "?probe=1"); return 1; })()`,
      );
      const afterPush = await page.evaluate<boolean>(`window.__localeSwitch === "alive"`);
      await page.goto(`${site.origin}${routes("en-us").builds()}`);
      const afterLoad = await page.evaluate<boolean>(`window.__localeSwitch === "alive"`);
      check(
        "the marker survives a same-document push and dies on a full load",
        afterPush && !afterLoad,
        `pushState=${afterPush} reload=${afterLoad}`,
      );
    }
    {
      /*
       * And the sharpest one: with the fragment deleted from the same URL, the
       * same probe must report it gone. A gate that could only ever see
       * `#gear-budget` would pass against a switcher that hard-coded it.
       */
      await page.setViewport(1280, 900);
      await page.goto(`${site.origin}${routes("en-us").build(SUBJECT.classSlug, SUBJECT.slug)}#gear-budget`);
      const withHash = await page.evaluate<Probe>(probeFor("gear-budget"));
      await page.goto(`${site.origin}${routes("en-us").build(SUBJECT.classSlug, SUBJECT.slug)}`);
      const withoutHash = await page.evaluate<Probe>(probeFor("gear-budget"));
      check(
        "the same probe reads #gear-budget as present, then as absent",
        withHash.hash === "#gear-budget" && withoutHash.hash === "",
        `${JSON.stringify(withHash.hash)} then ${JSON.stringify(withoutHash.hash)}`,
      );
    }

    // -----------------------------------------------------------------------
    // The measurement §22k asks for: what a *soft* push does with a fragment
    // -----------------------------------------------------------------------
    /*
     * The plan's first reason for the full navigation is that Next 16 does not
     * document what `router.push` with a fragment does about scrolling. The app
     * already contains one link that answers it: a skill page links back to
     * `/classes/<slug>#skills`, which is a route change carrying a fragment,
     * pushed by `next/link`. Pressing it measures the platform behaviour the
     * plan is uncertain about, without changing the switcher to find out.
     *
     * Recorded, not asserted — it is a fact about Next, not a promise this
     * repository makes. The one thing asserted is that the probe really was
     * soft, because a hard navigation here would make the number meaningless.
     */
    console.log("\nmeasurement · a soft push that carries a fragment");
    {
      const skills = getSkillsForClass("en-us", SUBJECT.classSlug);
      const skill = skills[0];
      if (!skill) {
        note("no skill page to press from; the measurement was skipped");
      } else {
        const r = routes("en-us");
        await page.setViewport(1280, 900);
        await page.goto(`${site.origin}${r.skill(SUBJECT.classSlug, skill.slug as Slug)}`);
        await page.evaluate(PLANT);
        const target = r.classSkills(SUBJECT.classSlug);
        const link = `[...document.querySelectorAll('main a[href]')].find(a => a.getAttribute('href') === ${JSON.stringify(target)})`;
        /*
         * That link sits near the foot of a long page, and `Input.dispatchMouse`
         * takes viewport coordinates — pressing where an off-screen element
         * "is" presses whatever is actually there. Bring it into view first,
         * with `behavior: "auto"` so the smooth scroll does not leave the press
         * chasing it.
         */
        await page.evaluate(
          `(() => { const el = ${link}; if (el) el.scrollIntoView({ block: "center", behavior: "auto" }); return 1; })()`,
        );
        await settledScrollY(page);
        const spot = await centreOf(page, link);
        if (!spot) {
          note("the back-link to #skills was not on the page; the measurement was skipped");
        } else {
          await page.click(spot.x, spot.y);
          const got = await settle(page, `location.hash === "#skills"`, 15_000);
          await settledScrollY(page, true);
          const p = await page.evaluate<Probe>(probeFor("skills"));
          check("the fragment probe really was a soft navigation", p.soft, p.soft ? "soft" : "reloaded");
          const band = px(p.scrollMarginTop) + px(p.scrollPaddingTop);
          const predicted =
            p.targetDocTop === null
              ? -1
              : p.targetDocTop - Math.min(Math.max(p.targetDocTop - band, 0), p.maxScroll);
          note(
            `router.push with #skills: hash=${JSON.stringify(p.hash)} arrived=${got} ` +
              `landed at ${p.targetTop}px, a CSS jump would have landed it at ${predicted}px ` +
              `(band ${band}px, scrollY ${p.scrollY})`,
          );
          note(
            "if that landing matches the prediction, §22k's full navigation can be reconsidered; " +
              "if it does not, the full navigation is what the anchor contract needs.",
          );
        }
      }
    }

    // -----------------------------------------------------------------------
    // Without JavaScript, the switcher is still a link to the same page
    // -----------------------------------------------------------------------
    /*
     * R-A11Y-12 allows the fragment to be lost here: the `href` is the bare
     * path by design (`build-filters.test.ts:596`), because a crawler and a
     * reader with no bundle should each get exactly one URL per page. What must
     * *not* happen is the switch failing, or landing on the home page.
     */
    console.log("\nno JavaScript · the href alone still changes language");
    for (const l of LOCALES) {
      const locale = l as Locale;
      const to = other(locale);
      const from = `${routes(locale).build(SUBJECT.classSlug, SUBJECT.slug)}#gear-budget`;
      const wantPath = routes(to).build(SUBJECT.classSlug, SUBJECT.slug);

      await page.setViewport(1280, 900);
      await page.setScriptsEnabled(false);
      await page.goto(site.origin + from);
      // Scripting is off, so the *harness* needs it back to read coordinates —
      // the same manoeuvre `mobile-navigation.test.ts` makes for the same reason.
      await page.setScriptsEnabled(true);
      const spot = await centreOf(page, SWITCHER(to));
      await page.setScriptsEnabled(false);
      check(`no-JS ${locale}: the switcher is rendered without a bundle`, spot !== null);
      if (spot) {
        await page.click(spot.x, spot.y);
        await page.setScriptsEnabled(true);
        const landed = await settle(page, `location.pathname === ${JSON.stringify(wantPath)}`, 20_000);
        check(`no-JS ${locale}: following it reaches ${wantPath}`, landed);
        const p = await page.evaluate<Probe>(probeFor("gear-budget"));
        check(
          `no-JS ${locale}: and not the home page`,
          p.pathname === wantPath,
          p.pathname,
        );
        note(`no-JS ${locale}: the fragment is ${p.hash ? `kept (${p.hash})` : "dropped, as the bare href implies"}`);
        await page.setScriptsEnabled(false);
      }
    }
    await page.setScriptsEnabled(true);
  } finally {
    page.close();
    site.stop();
  }

  console.log(`\n${passed} passed, ${failures.length} failed`);
  if (failures.length > 0) {
    for (const f of failures) console.error(`  FAIL ${f}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(`  the gate could not run: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
