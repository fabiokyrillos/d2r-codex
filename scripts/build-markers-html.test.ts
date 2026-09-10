/**
 * The half of R-BUILD-6 and R-BUILD-7 that a reader can actually see.
 *
 * `compare-tiers.test.ts` proves the comparison is *right*. It proves nothing
 * about the page. "Classify 2,369 slot occurrences and render none of them" was
 * a mutation that passed the whole suite — the visible half of the phase's first
 * requirement, with no gate, no file and no mutation. This is that gate.
 *
 * What it holds, and why each rule is shaped the way it is:
 *
 *   - **Every marked row carries exactly one marker, and it is the one the pure
 *     function computed for that `${slot}#${occurrence}`.** Rows are matched to
 *     comparisons *by document order*, never by slot name: `blade-fury`'s budget
 *     tier lists `weapon` twice, and anything keyed by name compares the second
 *     occurrence against the first and reports green.
 *   - **A tier's majority state suppresses that marker in both channels.** When
 *     one state passes 70% the tier says it once, at the top of the body, and
 *     the rows holding that state carry *nothing at all* — no visible label and
 *     no `sr-only` text. A rule that silenced the visual channel and left the
 *     screen reader repeating "Kept" eight times would be trading noise for
 *     noise, so the assertion here is symmetric: those rows must have zero
 *     markers, and the tier must carry the line that replaces them.
 *   - **The marker is a hidden text node in document order, and never an
 *     `aria-label`.** The slot row and the label cell both compute
 *     `role=generic`, ARIA prohibits an author name on those, and a measurement
 *     of Chrome's accessibility tree showed `{"role":"generic","name":"Kept"}`
 *     — a gate over `axNodes()` would have gone green over something no screen
 *     reader announces. So this asserts the text node *and* the absence of the
 *     attribute.
 *   - **`bis` is terminal.** It shows the final-setup block, never the ember
 *     "what to fix next" one, in all 53 builds. Where `nextUpgrade` exists on
 *     `bis` — eight builds, six of which carry real advice past the word
 *     "Nothing" — the text is still rendered under that heading, because
 *     deleting it would be an editorial change. Asserted by attribute rather
 *     than by searching the tier's prose for the heading's words: `goal`,
 *     `notes` and `nextUpgrade` all live in the same slice, and "does the phrase
 *     appear anywhere in this tier" is a question about editorial copy.
 *   - **The "Next:" line is a sibling of the preview, never a child of it.**
 *     `build-tier-state.test.ts` asserts `ul[data-tier-preview].children.length
 *     === slots.length`; one extra `<li>` turns five of six tiers red, and a
 *     `<p>` inside a `<ul>` is invalid markup besides.
 *   - **The removed block is conditional.** 48 removals over 30 of the 265
 *     (build, tier) pairs — absent from 235 renderings. It appears in exactly
 *     the pairs that have removals and nowhere else.
 *
 * Both halves are here on purpose. The file half sweeps the seven height
 * subjects in both languages from the prerendered HTML; the browser half
 * measures the one thing markup cannot say — that from 640px the micro-label
 * costs **zero** extra height, because the 8rem slot column is shorter than the
 * picks column it sits beside. Height is a fact about laid-out boxes.
 *
 * Requires `npm run build`. Run with `npm run test:build-markers-html`.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { assertFreshBuild } from "./build-freshness";
import { Page, startSite } from "./headless";
import { compareProgression, type TierComparison } from "../lib/builds/compare-tiers";
import { getBuilds } from "../lib/registry";
import { LOCALES, type Locale } from "../lib/i18n/config";
import { dictionaryFor, fmt } from "../lib/i18n";
import { tierOrder } from "../lib/labels";
import { TIER_ANCHOR_PREFIX } from "../lib/prefs";

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

/**
 * The same seven builds `build-tier-heights.test.ts` measures.
 *
 * Deliberately duplicated rather than exported from there: that file is a
 * browser gate and importing it would start a second server. The list is
 * asserted against the registry below, so a rename fails here rather than
 * quietly shrinking the sweep.
 */
const HEIGHT_SUBJECTS = [
  "blizzard-sorceress",
  "blade-fury",
  "phoenix-strike",
  "fire-trapsin",
  "whirlwind-assassin",
  "tesladin",
  "leap-attack-barbarian",
];

/**
 * The strings this phase adds, read through `unknown`.
 *
 * They land with the UI, not with this test, and the dictionary type is a
 * literal shape. A missing key has to fail as a missing key — asserted once,
 * below — rather than turn every text comparison into a comparison against
 * `undefined`.
 */
interface MarkerStrings {
  markerNew: string;
  markerKept: string;
  markerAlternative: string;
  markerRemoved: string;
  removedTitle: string;
  finalSetup: string;
  nextShort: string;
  majorityNew: string;
  majorityKept: string;
  majorityAlternative: string;
  whatToFixNext: string;
}
const MARKER_KEYS: (keyof MarkerStrings)[] = [
  "markerNew", "markerKept", "markerAlternative", "markerRemoved", "removedTitle",
  "finalSetup", "nextShort", "majorityNew", "majorityKept", "majorityAlternative", "whatToFixNext",
];
const stringsFor = (locale: Locale): Partial<MarkerStrings> =>
  dictionaryFor(locale).builds as unknown as Partial<MarkerStrings>;

/**
 * The fallback for a dictionary key that is missing.
 *
 * Never the empty string: `"anything".includes("")` and `.startsWith("")` are
 * both true, so an empty fallback turns every one of the text assertions below
 * into a tautology — a renamed key would make the gate greener rather than
 * redder. This value cannot occur in rendered markup, so a missing key fails.
 * Its absence is separately asserted above, which is the real guard; this is
 * the belt.
 */
const ABSENT = "<no such dictionary key>";

const WORD_KEY = {
  new: "markerNew",
  kept: "markerKept",
  alternative: "markerAlternative",
} as const;
const MAJORITY_KEY = {
  new: "majorityNew",
  kept: "majorityKept",
  alternative: "majorityAlternative",
} as const;

// ---------------------------------------------------------------------------
// Markup helpers
// ---------------------------------------------------------------------------

/** Rendered markup only. The RSC payload in a <script> is not the page. */
const markup = (html: string) => html.replace(/<script[\s\S]*?<\/script>/g, " ");

const decode = (s: string) =>
  s
    .replace(/<[^>]+>/g, " ")
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
 * Decoded text with `RichText`'s three markers folded away.
 *
 * Content strings carry `**bold**`, `*italic*` and `` `code` ``, and the page
 * renders them as elements — so a source string and its rendered text are never
 * equal, and "the whole upgrade is carried" would fail on every build that
 * emphasises a word. Stripping the three marker characters from *both* sides
 * makes them comparable, and a literal asterisk in the prose is stripped from
 * both sides too, so it cannot make the comparison lie.
 */
const plain = (s: string) => decode(s).replace(/[*`]/g, "").replace(/\s+/g, " ").trim();

/** Attribute values come back HTML-escaped; class names carry `>` and `&`. */
const attrText = (s: string) => s.replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"');

const classOf = (tag: string) => attrText(/\bclass="([^"]*)"/.exec(tag)?.[1] ?? "");

/**
 * Does this class list reveal the line only when the *previous* tier is open?
 *
 * Three separate facts, because the one that matters is the combinator. A
 * variant that dropped `+section` and kept the rest would reveal the line on
 * the expanded tier itself, which is the M12b shape: the line on every compact
 * tier costs ~230px and breaks six of the seven height constants.
 */
function revealsOnAdjacentOpen(classList: string): boolean {
  const flat = classList.replace(/\s/g, "");
  return flat.includes("section:has(>details[open])") && flat.includes("+section") && flat.includes("line-clamp-2");
}

/**
 * Is `hidden` in this class list as a class of its own?
 *
 * Membership, not a substring, and the difference is the whole of M12b. This
 * was `/\bhidden\b/` over the joined class string, and the line also carries
 * `peer-open:hidden` — a word boundary sits after the colon, so the regex was
 * satisfied by the variant whatever happened to the default. Deleting the
 * unconditional `hidden`, which is exactly "show the Next: line on every
 * compact tier", left this file reporting 45 checks passed while
 * `build-tier-heights.test.ts` went red on nine rows. A class list is a list;
 * splitting it is the only way to ask whether something is in it.
 */
const hasClass = (classList: string, name: string) => classList.split(/\s+/).includes(name);

/**
 * The slice between an element bearing `id` and its close.
 *
 * Depth-counted rather than lazily regexed: the gear section nests sections,
 * and a lazy match closes on the first one it meets.
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

interface Row {
  slot: string;
  tag: string;
  html: string;
}

/**
 * The `[data-gear-slot]` rows of one tier body, **in document order**.
 *
 * Order is the whole point: it is what lets a row be matched to
 * `comparison.slots[i]` and therefore to `${slot}#${occurrence}`. Matching by
 * slot name instead would compare `blade-fury`'s second `weapon` against its
 * first and never notice.
 */
function rowsOf(body: string): Row[] {
  const out: Row[] = [];
  const start = /<div\b[^>]*\bdata-gear-slot="([a-z0-9-]+)"[^>]*>/g;
  let m: RegExpExecArray | null;
  while ((m = start.exec(body))) {
    const from = m.index + m[0].length;
    const step = /<div\b[^>]*>|<\/div>/g;
    step.lastIndex = from;
    let depth = 1;
    let hit: RegExpExecArray | null;
    let end = body.length;
    while ((hit = step.exec(body))) {
      depth += hit[0].startsWith("</") ? -1 : 1;
      if (depth === 0) {
        end = hit.index;
        break;
      }
    }
    out.push({ slot: m[1], tag: m[0], html: body.slice(from, end) });
    start.lastIndex = Math.max(start.lastIndex, end);
  }
  return out;
}

interface Marker {
  state: string;
  text: string;
  at: number;
  drawn: boolean;
}

function markersOf(row: string): Marker[] {
  return [...row.matchAll(/<span\b([^>]*\bdata-slot-marker="([a-z]+)"[^>]*)>([\s\S]*?)<\/span>/g)].map(
    (m) => ({
      state: m[2],
      text: decode(m[3]),
      at: m.index ?? 0,
      drawn: !/\bclass="[^"]*\bsr-only\b/.test(m[1]),
    }),
  );
}

// ---------------------------------------------------------------------------

const subjects = LOCALES.flatMap((locale) =>
  getBuilds(locale)
    .filter((b) => HEIGHT_SUBJECTS.includes(String(b.slug)))
    .map((b) => ({ locale, classSlug: String(b.classSlug), slug: String(b.slug), build: b })),
);

console.log(`\nsweeping ${subjects.length} build pages (${HEIGHT_SUBJECTS.length} builds x ${LOCALES.length} locales)\n`);

check(
  "all seven height subjects resolve to real builds in both languages",
  subjects.length === HEIGHT_SUBJECTS.length * LOCALES.length,
  `${subjects.length} of ${HEIGHT_SUBJECTS.length * LOCALES.length}`,
);

/*
 * The strings have to exist before anything can compare against them. Without
 * this a renamed key would turn every "the marker reads X" check into a
 * comparison with `undefined` and report the render as broken, or — worse — an
 * absence check into a tautology.
 */
for (const locale of LOCALES) {
  const s = stringsFor(locale);
  const absent = MARKER_KEYS.filter((k) => typeof s[k] !== "string" || !s[k]);
  check(`${locale}: builds carries all eleven marker strings`, absent.length === 0, absent.join(", "));
}

async function main() {
  // -------------------------------------------------------------------------
  // 1. Every row's marker is the one the comparison computed for its key
  // -------------------------------------------------------------------------
  console.log("\nmarkers against compareTiers, row by row, in document order\n");

  const wrongState: string[] = [];
  const wrongCount: string[] = [];
  const wrongMarkerCount: string[] = [];
  const wrongWord: string[] = [];
  const starterMarked: string[] = [];
  const majorityLeak: string[] = [];
  const majorityMissing: string[] = [];
  const majoritySpurious: string[] = [];
  const outOfOrder: string[] = [];
  const labelled: string[] = [];
  const removedWrong: string[] = [];
  const terminalWrong: string[] = [];
  const nextWrong: string[] = [];
  let starterRows = 0;
  let classified = 0;
  let drawnMarkers = 0;
  let hiddenMarkers = 0;
  let suppressed = 0;
  let removedBlocks = 0;
  let tiersSeen = 0;

  for (const { locale, classSlug, slug, build } of subjects) {
    const file = join(root, locale, "builds", classSlug, `${slug}.html`);
    if (!existsSync(file)) {
      check(`${locale}/${slug} was written`, false, file);
      continue;
    }
    const html = markup(readFileSync(file, "utf8"));
    const gear = idSlice(html, "gear");
    if (!gear) {
      check(`${locale}/${slug} has a #gear section`, false);
      continue;
    }
    const words = stringsFor(locale);
    const ordered = [...build.gearSets].sort(
      (a, b) => tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier),
    );
    const comparisons = compareProgression(ordered);
    const byTier = new Map<string, TierComparison>(comparisons.map((c) => [c.tier, c]));

    for (const [i, set] of ordered.entries()) {
      const where = `${locale}/${slug}/${set.tier}`;
      const body = idSlice(gear, `${TIER_ANCHOR_PREFIX}${set.tier}`);
      if (!body) {
        check(`${where} has a tier body`, false);
        continue;
      }
      tiersSeen++;
      const comparison = byTier.get(set.tier)!;
      const rows = rowsOf(body);
      if (rows.length !== comparison.slots.length) {
        wrongCount.push(`${where}: ${rows.length} rows for ${comparison.slots.length} slots`);
        continue;
      }

      // --- the majority line -------------------------------------------------
      const majorityTag = /<p\b[^>]*\bdata-tier-majority="([a-z]+)"[^>]*>([\s\S]*?)<\/p>/.exec(body);
      if (comparison.majority) {
        const want = fmt(words[MAJORITY_KEY[comparison.majority.marker]] ?? ABSENT, {
          count: comparison.majority.count,
          total: comparison.majority.total,
        });
        if (!majorityTag) {
          majorityMissing.push(
            `${where}: ${comparison.majority.marker} ${comparison.majority.count}/${comparison.majority.total}`,
          );
        } else if (majorityTag[1] !== comparison.majority.marker || decode(majorityTag[2]) !== want) {
          majorityMissing.push(
            `${where}: got "${majorityTag[1]}: ${decode(majorityTag[2])}" want "${comparison.majority.marker}: ${want}"`,
          );
        }
      } else if (majorityTag) {
        majoritySpurious.push(`${where}: ${majorityTag[1]}`);
      }

      // --- the rows ----------------------------------------------------------
      for (const [j, row] of rows.entries()) {
        const slot = comparison.slots[j];
        const key = slot.key;
        if (row.slot !== slot.slot) {
          outOfOrder.push(`${where} #${j}: row is ${row.slot}, comparison is ${key}`);
          continue;
        }
        if (/\baria-label=/.test(row.tag) || /\baria-label=/.test(row.html)) {
          labelled.push(`${where} ${key}`);
        }
        const markers = markersOf(row.html);
        const covered = !!comparison.majority && slot.marker === comparison.majority.marker;

        if (slot.marker === null) {
          starterRows++;
          if (markers.length !== 0) starterMarked.push(`${where} ${key}: ${markers.map((m) => m.state).join(",")}`);
          continue;
        }
        classified++;
        if (covered) {
          suppressed++;
          // Both channels, or the rule is not the rule.
          if (markers.length !== 0) {
            majorityLeak.push(`${where} ${key}: ${markers.map((m) => `${m.state}${m.drawn ? "" : "(sr)"}`).join(",")}`);
          }
          continue;
        }
        if (markers.length !== 1) {
          wrongMarkerCount.push(`${where} ${key}: ${markers.length} markers, want 1 ${slot.marker}`);
          continue;
        }
        const marker = markers[0];
        if (marker.state !== slot.marker) {
          wrongState.push(`${where} ${key}: rendered ${marker.state}, computed ${slot.marker}`);
        }
        const word = words[WORD_KEY[slot.marker]] ?? ABSENT;
        if (marker.text !== word) {
          wrongWord.push(`${where} ${key}: "${marker.text}" is not "${word}"`);
        }
        // `kept` is never drawn; the other two always are.
        if (slot.marker === "kept" && marker.drawn) {
          wrongState.push(`${where} ${key}: "kept" was drawn`);
        }
        if (slot.marker !== "kept" && !marker.drawn) {
          wrongState.push(`${where} ${key}: ${slot.marker} is sr-only`);
        }
        if (marker.drawn) drawnMarkers++;
        else hiddenMarkers++;
        // In document order inside the row, after the slot name. A text node
        // placed before the name reads as a heading for it, and an
        // `aria-label` on the row is not read at all.
        const name = row.html.indexOf("<span");
        if (marker.at <= name) outOfOrder.push(`${where} ${key}: marker precedes the slot name`);
      }

      // --- the removed block -------------------------------------------------
      const block = new RegExp(`<div\\b[^>]*\\bdata-tier-removed="${set.tier}"`).test(body);
      if (block) removedBlocks++;
      if (block !== comparison.removed.length > 0) {
        removedWrong.push(`${where}: block ${block ? "present" : "absent"} for ${comparison.removed.length} removals`);
      }
      if (comparison.removed.length > 0) {
        const rendered = [...body.matchAll(/\bdata-removed-slot="([a-z0-9-]+)"/g)].map((m) => m[1]);
        const want = comparison.removed.map((r) => r.slot);
        if (JSON.stringify(rendered) !== JSON.stringify(want)) {
          removedWrong.push(`${where}: rows [${rendered}] want [${want}]`);
        }
        // From the block onward, so a tier goal that happens to contain the
        // heading's words cannot answer for it.
        const at = body.indexOf(`data-tier-removed="${set.tier}"`);
        if (!decode(body.slice(at)).includes(words.removedTitle ?? ABSENT)) {
          removedWrong.push(`${where}: no removed heading`);
        }
      }

      // --- bis is terminal ---------------------------------------------------
      const forwardTag = new RegExp(`<div\\b[^>]*\\bdata-tier-upgrade="${set.tier}"`).test(body);
      const terminalTag = new RegExp(`<div\\b[^>]*\\bdata-tier-terminal="${set.tier}"`).test(body);
      /** The first 600 characters of one of the two blocks, as text. */
      const blockText = (attr: string) => {
        const from = body.indexOf(`${attr}="${set.tier}"`);
        return from < 0 ? "" : decode(body.slice(from, from + 600));
      };
      if (set.tier === "bis") {
        if (!terminalTag) {
          terminalWrong.push(`${where}: no terminal block`);
        } else if (!blockText("data-tier-terminal").includes(words.finalSetup ?? ABSENT)) {
          terminalWrong.push(`${where}: the terminal block does not read "${words.finalSetup}"`);
        }
        if (forwardTag) terminalWrong.push(`${where}: carries the forward "what to fix next" block`);
        if (set.nextUpgrade && !plain(body).includes(plain(set.nextUpgrade))) {
          terminalWrong.push(`${where}: the authored nextUpgrade was dropped`);
        }
      } else {
        if (terminalTag) terminalWrong.push(`${where}: a non-bis tier reads as terminal`);
        if (set.nextUpgrade && !forwardTag) {
          terminalWrong.push(`${where}: no "what to fix next" block`);
        } else if (set.nextUpgrade && !blockText("data-tier-upgrade").includes(words.whatToFixNext ?? ABSENT)) {
          terminalWrong.push(`${where}: the forward block does not read "${words.whatToFixNext}"`);
        }
      }

      // --- the "Next:" line --------------------------------------------------
      const line = new RegExp(`<p\\b([^>]*\\bdata-tier-next="${set.tier}"[^>]*)>([\\s\\S]*?)</p>`).exec(gear);
      const previous = i > 0 ? ordered[i - 1] : undefined;
      if (!previous || !previous.nextUpgrade) {
        if (line) nextWrong.push(`${where}: a line with no previous tier`);
      } else if (!line) {
        nextWrong.push(`${where}: no line carrying ${previous.tier}'s upgrade`);
      } else {
        const cls = classOf(line[1]);
        const shown = plain(line[2]);
        if (!shown.startsWith(words.nextShort ?? ABSENT)) {
          nextWrong.push(`${where}: line does not open with the short label — "${shown.slice(0, 40)}"`);
        }
        // The whole string, never a truncation: the clamp is the browser's.
        if (!shown.includes(plain(previous.nextUpgrade))) {
          nextWrong.push(`${where}: the upgrade text is not carried whole`);
        }
        if (set.nextUpgrade && shown.includes(plain(set.nextUpgrade))) {
          nextWrong.push(`${where}: the line repeats this tier's own upgrade`);
        }
        if (!hasClass(cls, "hidden")) nextWrong.push(`${where}: the line is not hidden by default — "${cls}"`);
        if (!hasClass(cls, "peer-open:hidden")) nextWrong.push(`${where}: the line has no peer-open:hidden`);
        if (!revealsOnAdjacentOpen(cls)) {
          nextWrong.push(`${where}: the line has no adjacent-tier reveal — "${cls}"`);
        }
        // Outside the <ul>, or `build-tier-state.test.ts` goes red on five of
        // six tiers and the markup is invalid besides.
        const ul = gear.indexOf(`data-tier-preview="${set.tier}"`);
        const close = ul < 0 ? -1 : gear.indexOf("</ul>", ul);
        const at = gear.indexOf(`data-tier-next="${set.tier}"`);
        if (ul < 0 || close < 0 || at < close) {
          nextWrong.push(`${where}: the line is inside the preview list`);
        }
      }
    }
  }

  check("every tier body has one row per slot", wrongCount.length === 0, wrongCount.slice(0, 4).join(" | "));
  check("every marked row carries exactly one marker", wrongMarkerCount.length === 0, wrongMarkerCount.slice(0, 4).join(" | "));
  check("every row's marker is the state the comparison computed", wrongState.length === 0, wrongState.slice(0, 4).join(" | "));
  check("every marker reads its own language's word", wrongWord.length === 0, wrongWord.slice(0, 4).join(" | "));
  check("rows are matched to comparisons in document order", outOfOrder.length === 0, outOfOrder.slice(0, 4).join(" | "));
  check("`starter` carries no marker at all", starterMarked.length === 0, starterMarked.slice(0, 4).join(" | "));
  check("a tier's majority state is declared once, with its own count", majorityMissing.length === 0, majorityMissing.slice(0, 4).join(" | "));
  check("no tier declares a majority the data does not have", majoritySpurious.length === 0, majoritySpurious.slice(0, 4).join(" | "));
  check("the majority state is silent in BOTH channels on the rows it covers", majorityLeak.length === 0, majorityLeak.slice(0, 4).join(" | "));
  check("no `aria-label` on a slot row — ARIA forbids naming role=generic", labelled.length === 0, labelled.slice(0, 4).join(" | "));
  check("the removed block appears in exactly the pairs that have removals", removedWrong.length === 0, removedWrong.slice(0, 4).join(" | "));
  check("`bis` is terminal, and keeps the advice it was authored with", terminalWrong.length === 0, terminalWrong.slice(0, 4).join(" | "));
  check("the \"Next:\" line carries the previous tier's upgrade, outside the preview", nextWrong.length === 0, nextWrong.slice(0, 4).join(" | "));

  console.log(
    `\n  ${tiersSeen} tiers · ${drawnMarkers} drawn · ${hiddenMarkers} hidden · ` +
      `${suppressed} covered by a majority line · ${starterRows} starter rows · ${removedBlocks} removed blocks\n`,
  );

  /*
   * The census, which is what makes every rule above a claim rather than a
   * tautology. Each of the four buckets has to be non-empty — a page with no
   * markers at all satisfies "every marker is correct", "kept is never drawn"
   * and "the majority state is silent" simultaneously, which is exactly the
   * M39 mutation this file exists to catch — and together they have to account
   * for every classified occurrence, with nothing lost between them.
   */
  check("control: markers are drawn", drawnMarkers > 0, `${drawnMarkers}`);
  check("control: markers are also emitted for a screen reader only", hiddenMarkers > 0, `${hiddenMarkers}`);
  check("control: some rows really are covered by a majority line", suppressed > 0, `${suppressed}`);
  check("control: `starter` really has rows to carry nothing", starterRows > 0, `${starterRows}`);
  check(
    "every classified occurrence is drawn, hidden or covered — none lost",
    drawnMarkers + hiddenMarkers + suppressed === classified,
    `${drawnMarkers} + ${hiddenMarkers} + ${suppressed} != ${classified}`,
  );

  /*
   * Anti-vacuity, in the shape `page-structure.test.ts` uses: the scanners are
   * run over synthetic markup carrying each defect, so a change that makes them
   * blind fails here instead of reporting a clean sweep.
   */
  {
    const sample =
      '<div data-gear-slot="helm" class="grid"><div class="pt-0.5"><span class="text-xs">Helm</span>' +
      '<span data-slot-marker="new" class="block text-xs">New</span></div>' +
      '<div class="min-w-0"><span>Harlequin Crest</span></div></div>' +
      '<div data-gear-slot="weapon" class="grid"><div><span>Weapon</span>' +
      '<span data-slot-marker="kept" class="sr-only">Kept</span></div><div><span>Grief</span></div></div>';
    const rows = rowsOf(sample);
    check("control: the row scanner finds both rows", rows.length === 2, `${rows.length}`);
    check("control: nested divs do not truncate a row", rows[0]?.html.includes("Harlequin Crest") === true);
    check("control: the second row is the second row", rows[1]?.slot === "weapon", rows[1]?.slot);
    const first = markersOf(rows[0]?.html ?? "");
    const second = markersOf(rows[1]?.html ?? "");
    check("control: a drawn marker reads as drawn", first.length === 1 && first[0].drawn && first[0].text === "New");
    check("control: an sr-only marker reads as hidden", second.length === 1 && !second[0].drawn && second[0].text === "Kept");
    check(
      "control: a row with no marker is detected as having none",
      markersOf('<div><span>Belt</span></div>').length === 0,
    );
    check(
      "control: an aria-label on a row is detected",
      /\baria-label=/.test('<div data-gear-slot="helm" aria-label="Kept">'),
    );
    const escaped =
      'class="mt-1.5 hidden text-sm peer-open:hidden [:where(section:has(&gt;details[open]))+section_&amp;]:line-clamp-2"';
    const cls = classOf(`<p ${escaped}>`);
    check("control: the reveal variant survives HTML escaping", revealsOnAdjacentOpen(cls), cls);
    check(
      "control: a reveal that lost its adjacent-sibling combinator is rejected",
      !revealsOnAdjacentOpen("hidden peer-open:hidden [:where(section:has(>details[open]))_&]:line-clamp-2"),
    );
    check(
      "control: a line that is never revealed is rejected",
      !revealsOnAdjacentOpen("mt-1.5 hidden text-sm peer-open:hidden"),
    );
    /*
     * M12b, in the shape that got past this file once: the default `hidden` is
     * deleted and every other class stays, so the line is drawn on all six
     * compact tiers. The old `/\bhidden\b/` said yes to this list, because
     * `peer-open:hidden` contains the word. These three assert the membership
     * test discriminates in both directions, so a return to the substring form
     * fails here rather than on nine height rows in another file.
     */
    const M12B = "mt-1.5 text-sm peer-open:hidden [:where(section:has(>details[open]))+section_&]:line-clamp-2";
    check("control: the M12b class list is rejected — peer-open:hidden is not `hidden`", !hasClass(M12B, "hidden"), M12B);
    check("control: …and the substring form it defeated would have accepted it", /\bhidden\b/.test(M12B));
    check(
      "control: the shipped class list is still accepted",
      hasClass(`mt-1.5 hidden ${M12B.slice("mt-1.5 ".length)}`, "hidden"),
    );
    check(
      "control: `plain` folds RichText's markers so a source string can be found in rendered text",
      plain("Buy a <strong>Spirit</strong> first") === plain("Buy a **Spirit** first"),
    );
    check("control: the missing-key sentinel cannot be found in prose", !"Final setup".includes(ABSENT));
  }

  // -------------------------------------------------------------------------
  // 2. From 640px the micro-label costs nothing — measured, not reasoned
  // -------------------------------------------------------------------------
  /*
   * §7.1's whole justification for a micro-label over a chip is that the 8rem
   * slot column is shorter than the picks column beside it, so a second line
   * inside it cannot make the row taller. That is a claim about laid-out boxes
   * and no amount of markup reading can settle it.
   *
   * **Measured by removal, not by comparison.** The first version of this
   * compared the two grid cells' heights, and a grid stretches its items: both
   * cells reported exactly the row's height, the "slack" came out 0.0px on
   * every row of every page, and the check passed for a reason that had nothing
   * to do with markers. The honest measurement is the counterfactual — measure,
   * delete every marker from the DOM, measure again — because that is the
   * quantity the claim is about.
   *
   * Scripting is disabled so all six tiers ship open (R-BUILD-12) and every
   * marker is in flow at once, which is also the state the no-JavaScript reader
   * gets. 320 and 390px are measured and *published* rather than asserted:
   * below 640px the grid stacks and §7.1 says the label costs a 16px line
   * there.
   */
  console.log("\nwhat the micro-label costs, measured by removing it (scripting disabled, six tiers open)\n");
  const site = await startSite();
  const page = await Page.launch();
  try {
    interface Cost {
      found: boolean;
      rows: number;
      drawn: number;
      worst: number;
      gear: number;
      gearAfter: number;
      over: string[];
    }
    for (const width of [1280, 768, 390, 320]) {
      await page.setViewport(width, width <= 390 ? 844 : 900);
      for (const locale of LOCALES) {
        await page.setScriptsEnabled(false);
        await page.goto(`${site.origin}/${locale}/builds/assassin/blade-fury`);
        await page.setScriptsEnabled(true);
        const cost = await page.evaluate<Cost>(
          `(() => {
             const h = (n) => n.getBoundingClientRect().height;
             const gear = document.getElementById("gear");
             // Reported, never thrown. A missing #gear is a real defect — it is
             // one of the seven published anchors — and it belongs in the
             // failure list with a name, not as a stack trace that hides every
             // check after it.
             if (!gear) return { found: false, rows: 0, drawn: 0, worst: 0, gear: 0, gearAfter: 0, over: [] };
             const rows = [...gear.querySelectorAll("[data-gear-slot]")];
             const before = rows.map(h);
             const gearBefore = h(gear);
             const drawn = gear.querySelectorAll("[data-slot-marker]:not(.sr-only)").length;
             for (const m of [...gear.querySelectorAll("[data-slot-marker]")]) m.remove();
             const after = rows.map(h);
             const deltas = before.map((b, i) => Math.round((b - after[i]) * 10) / 10);
             return {
               found: true,
               rows: rows.length,
               drawn,
               worst: deltas.length ? Math.max(...deltas) : 0,
               gear: Math.round(gearBefore),
               gearAfter: Math.round(h(gear)),
               over: rows
                 .map((r, i) => (deltas[i] > 0.5 ? r.getAttribute("data-gear-slot") + " +" + deltas[i] + "px" : ""))
                 .filter(Boolean)
                 .slice(0, 4),
             };
           })()`,
        );
        await page.setScriptsEnabled(false);
        console.log(
          `       ${locale} @${width}px  ${cost.rows} rows · ${cost.drawn} drawn · ` +
            `worst row cost ${cost.worst}px · gear ${cost.gear}px (${cost.gear - cost.gearAfter}px of it markers)`,
        );
        if (!cost.found) {
          check(`${locale} @${width}px: the served page has a #gear section`, false, "getElementById('gear') is null");
          continue;
        }
        check(
          `${locale} @${width}px: control — there were markers to cost anything`,
          cost.drawn > 0,
          "no drawn marker on the page, so the measurement below is vacuous",
        );
        if (width >= 640) {
          check(
            `${locale} @${width}px: the micro-label costs no row a single pixel`,
            cost.worst <= 0.5,
            cost.over.join(" | "),
          );
        }
      }
    }
    await page.setScriptsEnabled(true);
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
