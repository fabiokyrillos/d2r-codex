/**
 * The search box keeps exactly what was typed.
 *
 * This gate exists because of one defect and one gap. The defect: the filter
 * box compared the *raw* draft with the query the URL handed back, and since
 * the URL trims, typing `"cold "` and pausing left the box reading `"cold"` —
 * so the next word arrived as `"coldmastery"` and the listing went empty. The
 * gap: the fix was only ever demonstrated by driving a browser by hand, and a
 * regression that happens between two keystrokes leaves no trace in the markup
 * for any of the other gates to catch.
 *
 * So the reconciliation lives in `lib/builds/query-draft.ts` as three pure
 * decisions, `reduceQueryDraft` is built out of those same three, and this file
 * drives it through the sequences a reader actually produces: typing with a
 * trailing space, pausing, typing the next word, reloading, going Back and
 * Forward, switching language.
 *
 * The invariant under all of it: **normalisation compares and it filters; it
 * never rewrites the input.** The URL is free to carry the canonical form. The
 * box is not.
 *
 * The control at the end restores the broken comparison and shows it failing
 * the same assertions, so this file cannot pass for the wrong reason.
 *
 * Run with `npm run test:search-draft`.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { getBuilds } from "../lib/registry";
import { LOCALES, type Locale } from "../lib/i18n/config";
import {
  MAX_QUERY_LENGTH,
  EMPTY_FILTER_STATE,
  filterBuilds,
  filterQueryString,
  matchesQuery,
  normalizeQuery,
  parseFilterState,
  type BuildFilterState,
} from "../lib/builds/filter";
import { buildRows } from "../lib/builds/rows";
import {
  echoOf,
  needsWrite,
  draftForUrl,
  openQueryDraft,
  reduceQueryDraft,
  runQueryDraft,
  type QueryDraftEvent,
  type QueryDraftState,
} from "../lib/builds/query-draft";

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

/** Typing a string one character at a time, the way a reader produces it. */
const keystrokes = (from: string, text: string): QueryDraftEvent[] =>
  [...text].map((_, i) => ({ type: "type", value: from + text.slice(0, i + 1) }) as const);

/** What the URL hands back after a write — the round trip, not an assumption. */
const roundTrip = (draft: string): string => {
  const qs = filterQueryString({ ...EMPTY_FILTER_STATE, q: draft });
  return parseFilterState(new URLSearchParams(qs), {}).q;
};

// ---------------------------------------------------------------------------
// 1. The defect itself: "cold " then "mastery"
// ---------------------------------------------------------------------------
{
  console.log("\ntyping across a trailing space");

  // Type "cold ", let the trailing-edge write land, then type "mastery".
  const afterPause = runQueryDraft(openQueryDraft(""), [
    ...keystrokes("", "cold "),
    { type: "settle" },
    // The write lands and `useSearchParams` reports the new query back.
    { type: "url", q: "cold" },
  ]);

  check(
    'the box still reads "cold " after the URL came back as "cold"',
    afterPause.draft === "cold ",
    JSON.stringify(afterPause.draft),
  );
  check("the URL carries the canonical form", afterPause.url === "cold");

  const typed = runQueryDraft(afterPause, keystrokes("cold ", "mastery"));
  check(
    'the next word lands as "cold mastery", not "coldmastery"',
    typed.draft === "cold mastery",
    JSON.stringify(typed.draft),
  );

  const settled = runQueryDraft(typed, [{ type: "settle" }, { type: "url", q: "cold mastery" }]);
  check("and reaches the URL intact", settled.url === "cold mastery" && settled.draft === "cold mastery");
}

// ---------------------------------------------------------------------------
// 2. The visible value is exactly what was typed
// ---------------------------------------------------------------------------
{
  console.log("\nthe input is never rewritten");

  const drafts = [
    "cold ",
    " cold",
    "cold  mastery",
    "cold mastery ",
    "  ",
    "frozen orb   sorceress ",
    "túneis ",
  ];

  for (const draft of drafts) {
    // A full cycle: type it, settle, and take the URL's answer back.
    const end = runQueryDraft(openQueryDraft(""), [
      { type: "type", value: draft },
      { type: "settle" },
      { type: "url", q: roundTrip(draft) },
    ]);
    check(
      `a full write cycle leaves ${JSON.stringify(draft)} untouched`,
      end.draft === draft,
      JSON.stringify(end.draft),
    );
  }

  // Stated directly, because it is the rule the defect broke: no reachable
  // state hands a normalised string back to the box.
  const rewrites = drafts.filter((draft) => {
    const end = runQueryDraft(openQueryDraft(""), [
      { type: "type", value: draft },
      { type: "settle" },
      { type: "url", q: roundTrip(draft) },
    ]);
    return end.draft !== draft && end.draft === normalizeQuery(draft);
  });
  check("normalisation never becomes the input's value", rewrites.length === 0, rewrites.join(", "));

  // Intermediate spaces are not a special case of the trailing one.
  const mid = runQueryDraft(openQueryDraft(""), [
    ...keystrokes("", "cold  mastery"),
    { type: "settle" },
    { type: "url", q: "cold  mastery" },
  ]);
  check("a double space between words survives", mid.draft === "cold  mastery");
}

// ---------------------------------------------------------------------------
// 3. The URL may hold the canonical form
// ---------------------------------------------------------------------------
{
  console.log("\nthe query parameter is canonical, the draft is not");

  check('"cold " writes ?q=cold', filterQueryString({ ...EMPTY_FILTER_STATE, q: "cold " }) === "?q=cold");
  check("echoOf is what the URL gives back", echoOf("cold ") === roundTrip("cold "));
  check("a draft agreeing with the URL needs no write", needsWrite("cold ", "cold") === false);
  check("a genuinely changed draft does", needsWrite("cold mastery", "cold") === true);
  check("our own echo must not touch the box", draftForUrl("cold", "cold") === null);
  check("someone else's URL must", draftForUrl("fire", "cold") === "fire");

  // The cap is the URL's, and it applies to the same string on both sides.
  const long = "x".repeat(MAX_QUERY_LENGTH + 40);
  check(
    "an over-long draft settles to the truncated URL without a write loop",
    (() => {
      const s = runQueryDraft(openQueryDraft(""), [
        { type: "type", value: long },
        { type: "settle" },
        { type: "url", q: roundTrip(long) },
      ]);
      return s.draft === long && s.url.length === MAX_QUERY_LENGTH && !needsWrite(s.draft, s.url);
    })(),
  );
}

// ---------------------------------------------------------------------------
// 4. Reload, Back and Forward
// ---------------------------------------------------------------------------
{
  console.log("\nreload, back and forward");

  const reloaded = openQueryDraft(parseFilterState(new URLSearchParams("q=cold+mastery"), {}).q);
  check("reloading ?q=cold+mastery restores it whole", reloaded.draft === "cold mastery");
  check("and asks for no write of its own", needsWrite(reloaded.draft, reloaded.url) === false);

  // "cold " -> settle -> "cold mastery" -> settle, then Back, then Forward.
  let s: QueryDraftState = openQueryDraft("");
  s = runQueryDraft(s, [...keystrokes("", "cold "), { type: "settle" }, { type: "url", q: "cold" }]);
  s = runQueryDraft(s, [
    ...keystrokes("cold ", "mastery"),
    { type: "settle" },
    { type: "url", q: "cold mastery" },
  ]);

  const back = reduceQueryDraft(s, { type: "url", q: "cold" });
  check("Back shows the previous query", back.draft === "cold");
  check("Back glues nothing together", !back.draft.includes("coldmastery"));

  const forward = reduceQueryDraft(back, { type: "url", q: "cold mastery" });
  check("Forward returns the whole query", forward.draft === "cold mastery");
  check("Forward loses no characters", forward.draft.length === "cold mastery".length);

  // A language switch carries the query across as a URL change, not a keystroke.
  const switched = reduceQueryDraft(forward, { type: "url", q: "cold mastery" });
  check("a same-query URL change is a no-op for the box", switched.draft === "cold mastery");

  // Back to the bare listing.
  const cleared = reduceQueryDraft(forward, { type: "url", q: "" });
  check("Back past the first query empties the box", cleared.draft === "");
}

// ---------------------------------------------------------------------------
// 5. Both locales, and what folding is allowed to touch
// ---------------------------------------------------------------------------
{
  console.log("\nboth locales");

  const state = (q: string): BuildFilterState => ({ ...EMPTY_FILTER_STATE, q });

  for (const locale of LOCALES) {
    const rows = buildRows(locale as Locale, getBuilds(locale as Locale));

    /*
     * The two words come from a real build's own name in this locale rather
     * than from a hard-coded pair. "cold mastery" is an English phrase; a
     * pt-BR listing contains no such words, and a gate written around them
     * would have asserted "nothing matches, and nothing still matches" — true
     * of a broken search too.
     */
    const twoWord = rows.find((r) => r.name.trim().split(/\s+/).length >= 2);
    if (!twoWord) {
      check(`${locale}: a two-word build name exists to search for`, false);
      continue;
    }
    const [first, second] = twoWord.name.trim().split(/\s+/);
    const phrase = `${first} ${second}`;
    const glued = `${first}${second}`;

    // The trailing space must not change what the listing shows.
    const withSpace = filterBuilds(rows, state(`${first} `));
    const without = filterBuilds(rows, state(first));
    check(
      `${locale}: a trailing space on ${JSON.stringify(first)} filters identically`,
      withSpace.length === without.length && withSpace.length > 0,
      `${withSpace.length} vs ${without.length}`,
    );

    // Two words joined by the defect must find nothing — which is what made it
    // visible to a reader in the first place.
    check(
      `${locale}: the glued query ${JSON.stringify(glued)} finds nothing`,
      filterBuilds(rows, state(glued)).length === 0,
    );
    check(
      `${locale}: the spaced query ${JSON.stringify(phrase)} finds something`,
      filterBuilds(rows, state(phrase)).length > 0,
    );

    const cycle = runQueryDraft(openQueryDraft(""), [
      ...keystrokes("", `${first} `),
      { type: "settle" },
      { type: "url", q: first },
      ...keystrokes(`${first} `, second),
    ]);
    check(
      `${locale}: the box holds ${JSON.stringify(phrase)} after the pause`,
      cycle.draft === phrase,
      JSON.stringify(cycle.draft),
    );
    check(
      `${locale}: the listing filters on the draft, spaces and all`,
      filterBuilds(rows, state(cycle.draft)).length === filterBuilds(rows, state(phrase)).length,
    );
  }

  // Accents: folded for the comparison, never for the value.
  const accented = runQueryDraft(openQueryDraft(""), [
    { type: "type", value: "túneis " },
    { type: "settle" },
    { type: "url", q: roundTrip("túneis ") },
  ]);
  check("an accented draft keeps its accents", accented.draft === "túneis ");
  check("and the URL keeps them too", accented.url === "túneis");

  const ptRows = buildRows("pt-br", getBuilds("pt-br"));
  const foldTarget = ptRows.filter((r) => matchesQuery(r, "física"));
  check(
    "folding is comparison-only: accented and unaccented match the same rows",
    foldTarget.length > 0 &&
      ptRows.filter((r) => matchesQuery(r, "fisica")).length === foldTarget.length,
  );
}

// ---------------------------------------------------------------------------
// 6. Control: the comparison written the broken way
// ---------------------------------------------------------------------------
{
  console.log("\ncontrol: the defect, restored");

  /**
   * The reducer as it behaved before the fix: the echo stored the *raw* draft,
   * so the trim came back looking like somebody else's edit.
   */
  const brokenReduce = (state: QueryDraftState, event: QueryDraftEvent): QueryDraftState => {
    switch (event.type) {
      case "type":
        return { ...state, draft: event.value };
      case "settle": {
        if (state.draft === state.url) return state;
        // The bug, in one line: what we remember is the draft, not what the
        // URL will hand back for it.
        return { ...state, url: normalizeQuery(state.draft), echo: state.draft };
      }
      case "url":
        return state.echo === event.q
          ? { ...state, url: event.q }
          : { draft: event.q, url: event.q, echo: event.q };
    }
  };
  const brokenRun = (init: QueryDraftState, events: readonly QueryDraftEvent[]) =>
    events.reduce(brokenReduce, init);

  const brokenPause = brokenRun(openQueryDraft(""), [
    ...keystrokes("", "cold "),
    { type: "settle" },
    { type: "url", q: "cold" },
  ]);
  check(
    'control: the broken comparison deletes the space, leaving "cold"',
    brokenPause.draft === "cold",
    JSON.stringify(brokenPause.draft),
  );

  const brokenTyped = brokenRun(brokenPause, keystrokes("cold", "mastery"));
  check(
    'control: the next word arrives glued as "coldmastery"',
    brokenTyped.draft === "coldmastery",
    JSON.stringify(brokenTyped.draft),
  );

  const rows = buildRows("en-us", getBuilds("en-us"));
  check(
    "control: and the glued query empties a listing the real one fills",
    filterBuilds(rows, { ...EMPTY_FILTER_STATE, q: brokenTyped.draft }).length === 0 &&
      filterBuilds(rows, { ...EMPTY_FILTER_STATE, q: "cold mastery" }).length > 0,
  );

  // The control has to disagree with the shipped reducer, or it proves nothing.
  const realTyped = runQueryDraft(
    runQueryDraft(openQueryDraft(""), [
      ...keystrokes("", "cold "),
      { type: "settle" },
      { type: "url", q: "cold" },
    ]),
    keystrokes("cold ", "mastery"),
  );
  check(
    "control: the shipped reducer disagrees with it on the same input",
    realTyped.draft !== brokenTyped.draft,
  );
}

// ---------------------------------------------------------------------------
// 7. The component still routes through these decisions
// ---------------------------------------------------------------------------
{
  console.log("\nthe component uses them");

  const src = readFileSync(join(process.cwd(), "components", "builds", "build-filters.tsx"), "utf8");

  check(
    "build-filters.tsx imports the three decisions",
    /from "@\/lib\/builds\/query-draft"/.test(src) &&
      ["draftForUrl", "echoOf", "needsWrite"].every((fn) => src.includes(fn)),
  );
  check(
    "the input renders the draft verbatim",
    /value=\{draft\}/.test(src) && !/value=\{normalizeQuery/.test(src),
  );
  check(
    "no normalised value is pushed back into the box",
    !/setDraft\(\s*normalizeQuery/.test(src),
  );
}

// ---------------------------------------------------------------------------

console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length > 0) {
  for (const f of failures) console.error(`  FAIL ${f}`);
  process.exit(1);
}
