/**
 * What the *served* build page promises before a line of JavaScript runs.
 *
 * This is the R-BUILD-12 contract, and it is the half of Phase 1 that has to
 * be true for a reader who never gets a bundle: the six gear tiers are all
 * there, all open, with their six anchors, and the page promises nothing
 * about a preference it cannot keep.
 *
 * It reads files rather than driving a browser, which is why it can afford to
 * sweep all 53 builds in both languages instead of the one build a headless
 * gate would have time for. That breadth is the point — the failure this
 * catches in practice is "it works on the build I happened to look at".
 *
 * Two things this deliberately does *not* try to assert, because it cannot:
 *
 *   - **Whether anything is visible.** Visibility is a fact about laid-out
 *     boxes after CSS. The compact preview's `peer-open:hidden` is checked as
 *     a *selector* here and as a computed `display` in
 *     `build-tier-state.test.ts`. Asserting the text of both affordance
 *     labels would pass whether or not the mechanism works, since both are in
 *     the markup either way.
 *   - **The enhanced state.** Six closed tiers are the result of the
 *     enhancement, never of the HTML. `build-tier-state.test.ts` owns that.
 *
 * Requires `npm run build`. Run with `npm run test:build-tiers-html`.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { assertFreshBuild } from "./build-freshness";
import { getBuilds } from "../lib/registry";
import { LOCALES, type Locale } from "../lib/i18n/config";
import { dictionaryFor } from "../lib/i18n";
import { tierOrder } from "../lib/labels";
import { TIER_ANCHOR_PREFIX } from "../lib/prefs";

/**
 * The tier-picker strings.
 *
 * Read through `unknown` because the dictionary type is a literal shape and
 * these keys land with the UI, not with this test. Missing keys are a real
 * failure, asserted below rather than papered over with a default — a picker
 * of empty strings would make every "this text is absent" check vacuous.
 */
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
const PICKER_KEYS: (keyof Picker)[] = [
  "legend", "myTier", "announce", "goToGear", "clear", "clearLabel", "expand", "collapse",
];
const pickerFor = (locale: Locale): Partial<Picker> =>
  ((dictionaryFor(locale).builds as unknown as { tierPicker?: Partial<Picker> }).tierPicker ?? {});

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

const root = assertFreshBuild();

const pageFor = (locale: Locale, classSlug: string, slug: string) =>
  join(root, locale, "builds", classSlug, `${slug}.html`);

/** Rendered markup only. The RSC payload in a <script> is not the page. */
const markup = (html: string) => html.replace(/<script[\s\S]*?<\/script>/g, " ");

const decode = (s: string) =>
  s
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&hellip;/g, "…")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&times;/g, "×")
    .replace(/\s+/g, " ")
    .trim();

/**
 * The slice of a document between an element bearing `id` and its close.
 *
 * Depth-counted rather than lazily regexed, because the gear section contains
 * nested sections and a lazy match closes on the first one.
 */
function idSlice(html: string, id: string): string | undefined {
  const open = new RegExp(`<(section|div|details)\\b[^>]*\\bid="${id}"[^>]*>`);
  const m = open.exec(html);
  if (!m) return undefined;
  const tag = m[1];
  const from = m.index + m[0].length;
  const step = new RegExp(`<${tag}\\b[^>]*>|</${tag}>`, "g");
  step.lastIndex = from;
  let depth = 1;
  let hit: RegExpExecArray | null;
  while ((hit = step.exec(html))) {
    depth += hit[0].startsWith("</") ? -1 : 1;
    if (depth === 0) return html.slice(from, hit.index);
  }
  return undefined;
}

const allBuilds = LOCALES.flatMap((locale) =>
  getBuilds(locale).map((b) => ({ locale, classSlug: String(b.classSlug), slug: String(b.slug) })),
);

console.log(`\nsweeping ${allBuilds.length} build pages (${LOCALES.length} locales)\n`);

/*
 * The strings have to exist before anything can assert on their absence.
 * Without this, a renamed key would make every "no preference text in the
 * markup" check below pass for the wrong reason.
 */
for (const locale of LOCALES) {
  const keys = pickerFor(locale);
  const absent = PICKER_KEYS.filter((k) => typeof keys[k] !== "string" || !keys[k]);
  check(`${locale}: builds.tierPicker carries all eight strings`, absent.length === 0, absent.join(", "));
}

// ---------------------------------------------------------------------------
// 1. Six tiers, six of them open, six anchors — on every page
// ---------------------------------------------------------------------------

{
  const missing: string[] = [];
  const wrongOpen: string[] = [];
  const wrongAnchors: string[] = [];
  const notDetails: string[] = [];

  for (const { locale, classSlug, slug } of allBuilds) {
    const p = pageFor(locale, classSlug, slug);
    if (!existsSync(p)) {
      missing.push(`${locale}/${classSlug}/${slug}`);
      continue;
    }
    const html = markup(readFileSync(p, "utf8"));
    const gear = idSlice(html, "gear");
    if (!gear) {
      missing.push(`${locale}/${classSlug}/${slug} (no #gear)`);
      continue;
    }

    // Each tier's element must be a <details> carrying `open`.
    const opened = tierOrder.filter((t) =>
      new RegExp(`<details\\b[^>]*\\bid="${TIER_ANCHOR_PREFIX}${t}"[^>]*\\bopen\\b`).test(gear) ||
      new RegExp(`<details\\b[^>]*\\bopen\\b[^>]*\\bid="${TIER_ANCHOR_PREFIX}${t}"`).test(gear),
    );
    if (opened.length !== 6) {
      const present = tierOrder.filter((t) =>
        new RegExp(`<details\\b[^>]*\\bid="${TIER_ANCHOR_PREFIX}${t}"`).test(gear),
      );
      if (present.length !== 6) notDetails.push(`${locale}/${slug}: ${present.length} <details>`);
      else wrongOpen.push(`${locale}/${slug}: ${opened.length} open`);
    }

    const anchors = [...gear.matchAll(/href="#gear-([a-z-]+)"/g)].map((m) => m[1]);
    const unique = [...new Set(anchors)];
    if (unique.length !== 6 || tierOrder.some((t) => !unique.includes(t))) {
      wrongAnchors.push(`${locale}/${slug}: [${unique.join(",")}]`);
    }
  }

  check("every build page was written", missing.length === 0, missing.slice(0, 3).join(" | "));
  check("every gear tier is a <details>", notDetails.length === 0, notDetails.slice(0, 3).join(" | "));
  check("all six ship open (R-BUILD-12)", wrongOpen.length === 0, wrongOpen.slice(0, 3).join(" | "));
  check("all six anchors are present", wrongAnchors.length === 0, wrongAnchors.slice(0, 3).join(" | "));
}

// ---------------------------------------------------------------------------
// 2. The anchors are identical in both languages (R-I18N-2)
// ---------------------------------------------------------------------------

{
  const drift: string[] = [];
  for (const b of getBuilds(LOCALES[0])) {
    const perLocale = LOCALES.map((locale) => {
      const p = pageFor(locale, String(b.classSlug), String(b.slug));
      if (!existsSync(p)) return "missing";
      const gear = idSlice(markup(readFileSync(p, "utf8")), "gear") ?? "";
      return [...new Set([...gear.matchAll(/href="#gear-([a-z-]+)"/g)].map((m) => m[1]))]
        .sort()
        .join(",");
    });
    if (new Set(perLocale).size !== 1) drift.push(`${b.slug}: ${perLocale.join(" vs ")}`);
  }
  check("the six anchors are byte-identical across locales", drift.length === 0, drift.slice(0, 3).join(" | "));
  check(
    "…and they are the canonical tier slugs",
    tierOrder.length === 6 && tierOrder.every((t) => typeof t === "string"),
    tierOrder.join(","),
  );
}

// ---------------------------------------------------------------------------
// 3. The served HTML promises no preference (R-PREF-4 / R-BUILD-12)
// ---------------------------------------------------------------------------

{
  const promised: string[] = [];
  const controlMissing: string[] = [];

  for (const { locale, classSlug, slug } of allBuilds) {
    const p = pageFor(locale, classSlug, slug);
    if (!existsSync(p)) continue;
    const raw = readFileSync(p, "utf8");
    const rendered = markup(raw);
    const text = decode(rendered);
    const picker = pickerFor(locale);

    /*
     * Two ways of asking, because neither alone is sound.
     *
     * The *text* check uses only the "My tier:" stem. It is the one string
     * here that cannot occur by accident. Searching for `clear` matched
     * "Clear speed" — a rating axis — and "Clear Nightmare comfortably" — a
     * tier goal — on every page: ordinary English, not a preference promise.
     * A rule with that much noise reports a defect that is not there, and
     * teaches whoever reads it next to ignore the gate.
     *
     * The *attribute* check carries the rest. The controls that may only
     * exist once a preference does are identified by their data attributes,
     * which are unambiguous and cannot appear in prose.
     */
    const stem = (picker.myTier ?? "").split("{")[0].trim();
    if (stem && text.includes(stem)) promised.push(`${locale}/${slug}: "${stem}"`);
    for (const attr of ["data-go-to-gear", "data-clear-tier"]) {
      if (new RegExp(`\b${attr}\b`).test(rendered)) promised.push(`${locale}/${slug}: [${attr}]`);
    }
    // …but the navigation half must always be there.
    if (!picker.legend || !text.includes(picker.legend)) controlMissing.push(`${locale}/${slug}`);
  }

  check("no preference text in the served markup", promised.length === 0, promised.slice(0, 3).join(" | "));
  check("the navigation legend is always served", controlMissing.length === 0, controlMissing.slice(0, 3).join(" | "));

  /*
   * Anti-vacuity. "The string is absent" is only a claim about markup if the
   * string exists somewhere in the document — otherwise a typo in the
   * dictionary key would make this pass on a page that renders the promise.
   */
  const sample = readFileSync(pageFor("en-us", "sorceress", "blizzard-sorceress"), "utf8");
  const enPicker = pickerFor("en-us");
  check(
    "control: the preference strings do reach the document, so their absence from markup is a claim",
    !!enPicker.goToGear && sample.includes(enPicker.goToGear),
    "not found even in the RSC payload — the assertion above is vacuous",
  );
}

// ---------------------------------------------------------------------------
// 4. The mechanism classes (the half of C28 that a file can see)
// ---------------------------------------------------------------------------

/*
 * Tailwind compiles `peer-*` with `~` and `group-*` with a descendant
 * combinator, and both need their marker class on the right element. Get
 * either wrong and the CSS silently does nothing: the preview would hide for
 * every later tier, or the affordance would read "Expand" on an open tier
 * forever. Neither is visible in the text of the page, so the selectors
 * themselves are the assertion here, and the computed styles are asserted in
 * `build-tier-state.test.ts`.
 */
{
  const noGroup: string[] = [];
  const noPeer: string[] = [];
  const noToggle: string[] = [];
  const unwrapped: string[] = [];

  for (const { locale, classSlug, slug } of allBuilds) {
    const p = pageFor(locale, classSlug, slug);
    if (!existsSync(p)) continue;
    const gear = idSlice(markup(readFileSync(p, "utf8")), "gear") ?? "";

    for (const t of tierOrder) {
      const open = new RegExp(`<details\\b[^>]*\\bid="${TIER_ANCHOR_PREFIX}${t}"[^>]*>`).exec(gear);
      const tag = open?.[0] ?? "";
      if (!/\bclass="[^"]*\bgroup\b/.test(tag)) noGroup.push(`${locale}/${slug}/${t}`);
      if (!/\bclass="[^"]*\bpeer\b/.test(tag)) noPeer.push(`${locale}/${slug}/${t}`);
    }

    if (!/class="[^"]*\bpeer-open:hidden\b/.test(gear)) noToggle.push(`${locale}/${slug}: no peer-open:hidden`);
    if (!/class="[^"]*\bgroup-open:/.test(gear)) noToggle.push(`${locale}/${slug}: no group-open:`);

    /*
     * Each <details> must sit inside its own wrapper, or `peer-*`'s general
     * sibling combinator reaches past it to every later tier's preview. The
     * shape that proves it: between one tier's <details> and the next tier's
     * id there must be a closing wrapper tag.
     */
    for (let i = 0; i < tierOrder.length - 1; i++) {
      const a = gear.indexOf(`id="${TIER_ANCHOR_PREFIX}${tierOrder[i]}"`);
      const b = gear.indexOf(`id="${TIER_ANCHOR_PREFIX}${tierOrder[i + 1]}"`);
      if (a < 0 || b < 0 || b < a) continue;
      if (!/<\/(section|article|li|div)>/.test(gear.slice(a, b))) {
        unwrapped.push(`${locale}/${slug}: ${tierOrder[i]}→${tierOrder[i + 1]}`);
      }
    }
  }

  check("every tier <details> carries `group`", noGroup.length === 0, noGroup.slice(0, 3).join(" | "));
  check("every tier <details> carries `peer`", noPeer.length === 0, noPeer.slice(0, 3).join(" | "));
  check("the preview and the affordance carry their variant classes", noToggle.length === 0, noToggle.slice(0, 3).join(" | "));
  check(
    "each tier is wrapped, so `peer-*` cannot reach the next tier's preview",
    unwrapped.length === 0,
    unwrapped.slice(0, 3).join(" | "),
  );
}

// ---------------------------------------------------------------------------
// 5. No query parameter was introduced for tier (R-BUILD-10)
// ---------------------------------------------------------------------------

{
  const withQuery: string[] = [];
  for (const { locale, classSlug, slug } of allBuilds) {
    const p = pageFor(locale, classSlug, slug);
    if (!existsSync(p)) continue;
    const html = readFileSync(p, "utf8");
    if (/[?&]tier=/.test(html)) withQuery.push(`${locale}/${slug}`);
  }
  check("no ?tier= anywhere in any prerendered page", withQuery.length === 0, withQuery.slice(0, 3).join(" | "));
}

// ---------------------------------------------------------------------------

console.log(`\n${passed} checks passed.`);
if (failures.length) {
  console.error(`\n${failures.length} FAILED:`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
