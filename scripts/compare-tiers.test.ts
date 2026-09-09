/**
 * Proof that adjacent-tier comparison says what the page will draw.
 *
 * `lib/builds/compare-tiers.ts` is pure — no display string, no locale, no
 * `lib/registry` — so every claim R-BUILD-6 makes about "what changed since the
 * last tier" can be settled here, over the real 53 builds, without a build or a
 * browser. This runs in `check`, not `check:built`.
 *
 * Four failure modes are the reason this file is as long as it is, and each of
 * them is a defect that ships silently:
 *
 *   1. **Anything keyed by slot name loses a row.** `blade-fury`'s budget tier
 *      lists `weapon` twice — the claws at index 0, and the Call to Arms weapon
 *      switch as the eleventh and last entry. A `Map<GearSlot, …>` collapses
 *      them, the CTA line stops being compared, and nothing else changes. T9
 *      is the assertion that would notice.
 *   2. **Sorting preserves length and indices.** A comparison array that has
 *      been re-ordered into `GEAR_SLOTS` order still has the right length and
 *      still has an entry at every index, so a length check passes over it.
 *      T3 asserts *object identity* — `slots[i].entry === set.slots[i]` — which
 *      is the only form of the assertion a sort cannot survive. Authored order
 *      is structural load here: exactly 1 of 318 tiers happens to list its
 *      slots in canonical order.
 *   3. **Identity is `ref` first, and that is what makes it locale-invariant.**
 *      pt-BR overlays rewrite `label`; 385 of them do. `hammerdin`'s BiS gloves
 *      are `unique:magefist` in both dictionaries but carry a pt-BR `label` of
 *      "Trang-Oul's Claws" — a label-first identity reads that one row as
 *      changed in Portuguese and unchanged in English. T11 and T12 watch it.
 *   4. **"Removed" is a structural fact, not an identity one.** The rule is
 *      §4.5's: publish a removal when the *slot name* has no occurrence left.
 *      The identity-based guard the first version of the plan carried could
 *      never fire — identity is `ref` first, so `label:weapon switch: call to
 *      arms…` and `runeword:call-to-arms` are different by construction — and
 *      an assertion over a guard that suppresses nothing cannot detect its
 *      removal. T10 and T10b are written so that dropping the rule moves
 *      48 → 49 and 30 → 31.
 *
 * The numbers here are measurements of the corpus, published in §3.2, §3.3 and
 * §3.4 of the Phase 2 plan and reproduced digit by digit by an independent
 * review. They are expectations, not calibrations: if one moves, the content
 * moved, and that is the thing worth being told about.
 *
 * Run with `npm run test:compare-tiers`.
 */
import {
  compareProgression,
  compareTiers,
  identityOf,
  type SlotMarker,
  type TierComparison,
} from "../lib/builds/compare-tiers";
import { getBuilds } from "../lib/registry";
import { LOCALES } from "../lib/i18n/config";
import { GEAR_SLOTS, PROGRESSION_TIERS } from "../lib/types/core";
import type {
  GearPick,
  GearSet,
  GearSetSlotEntry,
  GearSlot,
  ItemRef,
  ProgressionTier,
} from "../lib/types";

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

// ---------------------------------------------------------------------------
// Fixture helpers
// ---------------------------------------------------------------------------

const pick = (init: Partial<GearPick>): GearPick => ({ why: "fixture", ...init });
const byRef = (kind: ItemRef["kind"], slug: string, init: Partial<GearPick> = {}): GearPick =>
  pick({ ref: { kind, slug } as ItemRef, ...init });
const byLabel = (label: string, init: Partial<GearPick> = {}): GearPick => pick({ label, ...init });
const entry = (slot: GearSlot, ...picks: GearPick[]): GearSetSlotEntry => ({ slot, picks });
const gearSet = (tier: ProgressionTier, ...slots: GearSetSlotEntry[]): GearSet => ({
  tier,
  goal: "fixture",
  slots,
});

// ---------------------------------------------------------------------------
// The corpus, compared once
// ---------------------------------------------------------------------------

interface Row {
  slug: string;
  build: number;
  set: GearSet;
  comparison: TierComparison;
}

const rowsFor = (locale: (typeof LOCALES)[number]): Row[] => {
  const rows: Row[] = [];
  getBuilds(locale).forEach((build, b) => {
    const comparisons = compareProgression(build.gearSets);
    comparisons.forEach((comparison, i) => {
      rows.push({ slug: String(build.slug), build: b, set: build.gearSets[i], comparison });
    });
  });
  return rows;
};

const enBuilds = getBuilds("en-us");
const rows = rowsFor("en-us");
const withPrevious = rows.filter((r) => r.comparison.previousTier !== undefined);

// ---------------------------------------------------------------------------
// T1–T3 — the walk, and what it must not do to the authored order
// ---------------------------------------------------------------------------

console.log("\nT1-T3 — the progression walk");

check("T1 the 53 builds yield 318 tier comparisons", rows.length === 318, String(rows.length));
check(
  "T1 every build compares the six tiers in canonical order",
  enBuilds.every(
    (b) =>
      compareProgression(b.gearSets)
        .map((c) => c.tier)
        .join(",") === PROGRESSION_TIERS.join(","),
  ),
  `${enBuilds.length} builds`,
);
check(
  "T1 the first comparison of all 53 is `starter`",
  enBuilds.filter((b) => compareProgression(b.gearSets)[0]?.tier === "starter").length === 53,
);
check(
  "T1 the last comparison of all 53 is `bis`",
  enBuilds.filter((b) => compareProgression(b.gearSets).at(-1)?.tier === "bis").length === 53,
);
check(
  "T1 only the first tier has no previous, so 265 comparisons carry one",
  withPrevious.length === 265,
  String(withPrevious.length),
);
check(
  "T1 every previousTier is the tier immediately before it in authored order",
  enBuilds.every((b) =>
    compareProgression(b.gearSets).every(
      (c, i) => c.previousTier === (i === 0 ? undefined : b.gearSets[i - 1].tier),
    ),
  ),
);

{
  const starter = rows.filter((r) => r.set.tier === "starter");
  const starterSlots = starter.reduce((n, r) => n + r.comparison.slots.length, 0);
  check(
    "T2 `starter` carries no marker at all — 290 occurrences, every one null",
    starterSlots === 290 && starter.every((r) => r.comparison.slots.every((s) => s.marker === null)),
    `${starterSlots} occurrences`,
  );
  check(
    "T2 …and no occurrence outside `starter` is left unmarked",
    withPrevious.length === 265 &&
      withPrevious.every((r) => r.comparison.slots.every((s) => s.marker !== null)),
  );
}

{
  const mismatched: string[] = [];
  for (const r of rows) {
    if (r.comparison.slots.length !== r.set.slots.length) {
      mismatched.push(`${r.slug}/${r.set.tier}: length`);
      continue;
    }
    for (let i = 0; i < r.set.slots.length; i++) {
      const s = r.comparison.slots[i];
      // Object identity, not equality: a sort into `GEAR_SLOTS` order preserves
      // both the length and the set of indices, and would survive anything
      // weaker than this. Only 1 of 318 tiers is authored in canonical order.
      if (s.entry !== r.set.slots[i] || s.index !== i) {
        mismatched.push(`${r.slug}/${r.set.tier}#${i}`);
      }
    }
  }
  check(
    "T3 slots[i].entry is the same object as set.slots[i], across the 318 tiers",
    rows.length === 318 && mismatched.length === 0,
    mismatched.slice(0, 3).join(" | "),
  );
  check(
    "T3 …and the key is the slot name plus its occurrence, in authored order",
    rows.length === 318 &&
      rows.every((r) => {
        const seen = new Map<string, number>();
        return (
          r.comparison.slots.length === r.set.slots.length &&
          r.comparison.slots.every((s, i) => {
            const nth = seen.get(r.set.slots[i].slot) ?? 0;
            seen.set(r.set.slots[i].slot, nth + 1);
            return (
              s.slot === r.set.slots[i].slot &&
              s.occurrence === nth &&
              s.key === `${r.set.slots[i].slot}#${nth}`
            );
          })
        );
      }),
  );
}

// ---------------------------------------------------------------------------
// T4–T6 — the four states are total
// ---------------------------------------------------------------------------

console.log("\nT4-T6 — the four states");

const MARKERS: SlotMarker[] = ["new", "kept", "alternative"];

const tally = (subset: Row[]) => {
  const t = { new: 0, kept: 0, alternative: 0, removed: 0 };
  for (const r of subset) {
    for (const s of r.comparison.slots) if (s.marker) t[s.marker]++;
    t.removed += r.comparison.removed.length;
  }
  return t;
};

const total = tally(rows);

check(
  "T4 every occurrence outside `starter` carries exactly one of the three states",
  withPrevious.every((r) => r.comparison.slots.every((s) => MARKERS.includes(s.marker!))) &&
    total.new + total.kept + total.alternative === 2369,
  `${total.new + total.kept + total.alternative} markers`,
);
check(
  "T4 …which is every slot occurrence on the site minus `starter`'s (2659 − 290)",
  rows.reduce((n, r) => n + r.set.slots.length, 0) - 290 === 2369,
);
check(
  "T4 `alternativeVia` is present exactly on the `alternative` rows",
  rows.length === 318 &&
    rows.every((r) =>
      r.comparison.slots.every((s) =>
        s.marker === "alternative" ? s.alternativeVia !== undefined : s.alternativeVia === undefined,
      ),
    ),
);

check("T5 new = 999", total.new === 999, String(total.new));
check("T5 kept = 1245", total.kept === 1245, String(total.kept));
check("T5 alternative = 125", total.alternative === 125, String(total.alternative));
check("T5 removed = 48", total.removed === 48, String(total.removed));

{
  const via = { "secondary-pick": 0, "nested-alternative": 0 };
  for (const r of rows)
    for (const s of r.comparison.slots) if (s.alternativeVia) via[s.alternativeVia]++;
  check(
    "T5 the 125 alternatives split 33 secondary-pick / 92 nested-alternative",
    via["secondary-pick"] === 33 && via["nested-alternative"] === 92,
    `${via["secondary-pick"]}/${via["nested-alternative"]}`,
  );
}

{
  /*
   * §3.2 of the plan, by destination tier — with one correction, recorded here
   * rather than quietly applied.
   *
   * Nineteen of the twenty cells reproduce exactly. The removal row does not:
   * the plan publishes `budget 2 / optimized 2`, and the corpus measures
   * `budget 3 / optimized 1`. The row **total** (48), the pair count (30), the
   * naive comparison (49 over 31) and every new/kept/alternative cell all agree,
   * so this is a split within a confirmed total, not a different rule.
   *
   * The three budget removals are slot names present in `early-hell` and absent
   * in `budget`: `smiter` loses `belt` and `amulet`, `zealot` loses `gloves`.
   * The one optimized removal is `nova-sorceress`, which drops `offhand` after
   * budget. The second optimized removal the naive rule finds is exactly
   * `blade-fury weapon#1` — the one §4.5 suppresses — so the two rules differ
   * at `optimized`, never at `budget`, and `budget 2` cannot be produced by
   * either of them.
   */
  const PER_TIER: Record<string, { new: number; kept: number; alternative: number; removed: number }> = {
    nightmare: { new: 329, kept: 32, alternative: 15, removed: 8 },
    "early-hell": { new: 279, kept: 145, alternative: 18, removed: 36 },
    budget: { new: 220, kept: 252, alternative: 41, removed: 3 },
    optimized: { new: 109, kept: 373, alternative: 37, removed: 1 },
    bis: { new: 62, kept: 443, alternative: 14, removed: 0 },
  };
  check(
    "T6 the removal row still sums to the 48 the plan publishes",
    Object.values(PER_TIER).reduce((n, r) => n + r.removed, 0) === 48,
  );
  for (const [tier, want] of Object.entries(PER_TIER)) {
    const got = tally(rows.filter((r) => r.set.tier === tier));
    check(
      `T6 ${tier}: ${want.new} new / ${want.kept} kept / ${want.alternative} alternative / ${want.removed} removed`,
      got.new === want.new &&
        got.kept === want.kept &&
        got.alternative === want.alternative &&
        got.removed === want.removed,
      `${got.new}/${got.kept}/${got.alternative}/${got.removed}`,
    );
  }
}

// ---------------------------------------------------------------------------
// T7, T8, T13 — identity
// ---------------------------------------------------------------------------

console.log("\nT7, T8, T13 — identity");

{
  let deep = 0;
  let shallow = 0;
  let unusable = 0;
  const kindsBySlug = new Map<string, Set<string>>();
  const walk = (p: GearPick, nested: boolean) => {
    deep++;
    if (!nested) shallow++;
    const id = identityOf(p);
    if (p.ref) {
      if (id !== `${p.ref.kind}:${p.ref.slug}`) unusable++;
      const kinds = kindsBySlug.get(String(p.ref.slug)) ?? new Set<string>();
      kinds.add(p.ref.kind);
      kindsBySlug.set(String(p.ref.slug), kinds);
    } else if (!id.startsWith("label:") || id.length <= "label:".length) {
      unusable++;
    }
    for (const a of p.alternatives ?? []) walk(a, true);
  };
  for (const build of enBuilds)
    for (const set of build.gearSets) {
      for (const e of set.slots) for (const p of e.picks) walk(p, false);
      for (const p of set.charms ?? []) walk(p, false);
      for (const p of set.weaponSwap ?? []) walk(p, false);
    }

  // The two censuses are reported separately on purpose: 3519 top-level picks
  // across `slots`, `charms` and `weaponSwap`, and 3827 once the 308 nested
  // `alternatives[]` are counted too (§3.4).
  check(
    "T7 the sweep actually visited the corpus: 3519 top-level picks, 3827 deep",
    shallow === 3519 && deep === 3827,
    `${shallow}/${deep}`,
  );
  check(
    "T7 identityOf is total — every one of the 3827 picks yields a usable identity",
    unusable === 0,
    `${unusable} unusable`,
  );
  const collisions = [...kindsBySlug].filter(([, kinds]) => kinds.size > 1);
  check(
    "T8 no slug appears under two `ref.kind`s, so `kind:` in the key guards a future collision, not a current one",
    collisions.length === 0,
    collisions
      .slice(0, 3)
      .map(([slug, k]) => `${slug}: ${[...k].join("+")}`)
      .join(" | "),
  );
}

check(
  "T13 two rare rings that differ only after the comma stay distinct",
  identityOf(byLabel("Rare ring: 10% FCR, resistances, life")) !==
    identityOf(byLabel("Rare ring: 10% FCR, resistances, life, mana")),
);
check(
  "T13 punctuation is not stripped — the colon is part of the recommendation",
  identityOf(byLabel("Rare ring: 10% FCR")) !== identityOf(byLabel("Rare ring 10% FCR")),
);
check(
  "T13 …while case and runs of whitespace are normalised away",
  identityOf(byLabel("  Rare  Ring:  10% FCR ")) === identityOf(byLabel("rare ring: 10% fcr")),
  identityOf(byLabel("  Rare  Ring:  10% FCR ")),
);
check(
  "T13 a `ref` wins over a `label` on the same pick, which is what makes identity locale-invariant",
  identityOf(byRef("unique", "magefist", { label: "Trang-Oul's Claws" })) === "unique:magefist",
  identityOf(byRef("unique", "magefist", { label: "Trang-Oul's Claws" })),
);

// ---------------------------------------------------------------------------
// T9, T10, T10b — the one duplicated slot, and the removal rule
// ---------------------------------------------------------------------------

console.log("\nT9-T10b — the duplicated slot and the removal rule");

{
  const bladeFury = enBuilds.find((b) => String(b.slug) === "blade-fury")!;
  const comparisons = compareProgression(bladeFury.gearSets);
  const budget = comparisons.find((c) => c.tier === "budget");
  const optimized = comparisons.find((c) => c.tier === "optimized");

  check(
    "T9 blade-fury/budget yields 11 comparisons, one per authored entry",
    budget?.slots.length === 11,
    String(budget?.slots.length),
  );
  const keys = (budget?.slots ?? []).map((s) => s.key);
  check(
    "T9 `weapon#0` and `weapon#1` are distinct keys, and the second is the last entry",
    keys.includes("weapon#0") && keys.includes("weapon#1") && keys.at(-1) === "weapon#1",
    keys.join(","),
  );
  check("T9 …and all 11 keys are distinct", new Set(keys).size === 11, String(new Set(keys).size));

  // §4.5: `weapon` still has an occurrence in `optimized`, so nothing is
  // "removed" — the content moved into `weaponSwap`, and publishing "Removed:
  // Weapon — Call to Arms weapon switch" would be a ghost.
  check(
    "T10 blade-fury budget→optimized publishes no removal",
    optimized?.removed.length === 0,
    (optimized?.removed ?? []).map((r) => r.key).join(",") || "no comparison",
  );
}

{
  const pairs = withPrevious.filter((r) => r.comparison.removed.length > 0);
  check(
    "T10b the 48 removals fall in 30 distinct (build, tier) pairs",
    pairs.length === 30,
    String(pairs.length),
  );
  check(
    "T10b …so the removed block is absent from 235 of the 265 renderings that could carry one",
    withPrevious.length - pairs.length === 235,
    String(withPrevious.length - pairs.length),
  );

  // The control that makes M11 detectable. Under the naive rule — "publish when
  // this *occurrence* is gone" — the count is 49 over 31 pairs. The adopted rule
  // suppresses exactly one, and it is the blade-fury weapon switch. An assertion
  // that could not tell the two rules apart would let the rule be deleted.
  let naive = 0;
  const naivePairs = new Set<string>();
  for (const r of withPrevious) {
    const build = enBuilds.find((b) => String(b.slug) === r.slug)!;
    const i = build.gearSets.indexOf(r.set);
    const previous = build.gearSets[i - 1];
    const keyed = (set: GearSet) => {
      const seen = new Map<string, number>();
      return set.slots.map((e) => {
        const nth = seen.get(e.slot) ?? 0;
        seen.set(e.slot, nth + 1);
        return `${e.slot}#${nth}`;
      });
    };
    const now = new Set(keyed(r.set));
    for (const key of keyed(previous))
      if (!now.has(key)) {
        naive++;
        naivePairs.add(`${r.slug}/${r.set.tier}`);
      }
  }
  check(
    "T10b control: the naive occurrence rule would publish 49 over 31 pairs",
    naive === 49 && naivePairs.size === 31,
    `${naive}/${naivePairs.size}`,
  );
  check(
    "T10b …so the slot-is-empty rule suppresses exactly one, and dropping it would move 48→49",
    naive - total.removed === 1,
    String(naive - total.removed),
  );
}

// ---------------------------------------------------------------------------
// T11, T12 — the markers do not depend on the language
// ---------------------------------------------------------------------------

console.log("\nT11-T12 — locale invariance");

{
  const fingerprint = (locale: (typeof LOCALES)[number]) => {
    const out = new Map<string, string>();
    for (const build of getBuilds(locale)) {
      const lines: string[] = [];
      for (const c of compareProgression(build.gearSets)) {
        for (const s of c.slots) lines.push(`${c.tier}/${s.key}=${s.marker}/${s.alternativeVia ?? "-"}`);
        for (const rm of c.removed) lines.push(`${c.tier}/-${rm.key}`);
      }
      out.set(String(build.slug), lines.join("\n"));
    }
    return out;
  };
  const en = fingerprint("en-us");
  const pt = fingerprint("pt-br");
  const drifted = [...en.keys()].filter((slug) => en.get(slug) !== pt.get(slug));
  // Anti-vacuity: two empty fingerprints are also identical. The line count is
  // every slot occurrence on the site plus every removal — 2659 + 48.
  const lineCount = [...en.values()].reduce((n, v) => n + (v ? v.split("\n").length : 0), 0);
  check(
    "T11 the marker of every slot of every tier is identical in en-US and pt-BR, in all 53 builds",
    en.size === 53 && pt.size === 53 && lineCount === 2707 && drifted.length === 0,
    drifted.length ? drifted.slice(0, 3).join(" | ") : `${lineCount} lines compared`,
  );

  // The row that a label-first identity gets wrong: `unique:magefist` in both
  // dictionaries, but pt-BR overlays a `label` of "Trang-Oul's Claws" onto it.
  for (const locale of LOCALES) {
    const hammerdin = getBuilds(locale).find((b) => String(b.slug) === "hammerdin")!;
    const bis = compareProgression(hammerdin.gearSets).find((c) => c.tier === "bis");
    const gloves = bis?.slots.find((s) => s.key === "gloves#0");
    check(
      `T12 hammerdin/bis/gloves#0 is kept in ${locale}`,
      gloves?.marker === "kept" && gloves.previous === "unique:magefist",
      `${gloves?.marker} / ${gloves?.previous}`,
    );
  }
}

// ---------------------------------------------------------------------------
// T14 — the majority state
// ---------------------------------------------------------------------------

console.log("\nT14 — the majority state");

{
  const wrong: string[] = [];
  let declared = 0;
  for (const r of rows) {
    const counts: Record<SlotMarker, number> = { new: 0, kept: 0, alternative: 0 };
    for (const s of r.comparison.slots) if (s.marker) counts[s.marker]++;
    const totalMarked = counts.new + counts.kept + counts.alternative;
    const winner = MARKERS.find((m) => totalMarked > 0 && counts[m] / totalMarked > 0.7);
    const got = r.comparison.majority;
    if (winner === undefined) {
      if (got !== undefined) wrong.push(`${r.slug}/${r.set.tier}: declared ${got.marker}`);
    } else if (
      got === undefined ||
      got.marker !== winner ||
      got.count !== counts[winner] ||
      got.total !== totalMarked
    ) {
      wrong.push(`${r.slug}/${r.set.tier}: want ${winner} ${counts[winner]}/${totalMarked}`);
    }
    if (got) declared++;
  }
  check(
    "T14 `majority` is present exactly when one state passes 70%, with the right count and total",
    wrong.length === 0,
    wrong.slice(0, 3).join(" | "),
  );
  check(
    "T14 control: some tiers declare a majority and some do not",
    declared > 0 && declared < rows.length,
    `${declared} of ${rows.length}`,
  );
  check(
    "T14 `starter` never declares one — there is nothing to be a majority of",
    rows.filter((r) => r.set.tier === "starter").every((r) => r.comparison.majority === undefined),
  );
}

{
  // The boundary, where a fixture is the only honest witness: 70% is not "more
  // than 70%", and the tenth slot is what decides it.
  const slots = (kept: number) =>
    Array.from({ length: 10 }, (_, i) =>
      entry(GEAR_SLOTS[i], i < kept ? byRef("unique", `k${i}`) : byRef("unique", `n${i}`)),
    );
  const previous = gearSet(
    "budget",
    ...Array.from({ length: 10 }, (_, i) => entry(GEAR_SLOTS[i], byRef("unique", `k${i}`))),
  );
  check(
    "T14 exactly 70% is not a majority",
    compareTiers(previous, gearSet("optimized", ...slots(7))).majority === undefined,
  );
  const eight = compareTiers(previous, gearSet("optimized", ...slots(8))).majority;
  check(
    "T14 …and 80% is, carrying {marker, count, total}",
    eight?.marker === "kept" && eight.count === 8 && eight.total === 10,
    JSON.stringify(eight),
  );
}

// ---------------------------------------------------------------------------
// T15–T22 — the case matrix of §5, by fixture
// ---------------------------------------------------------------------------

console.log("\nT15-T22 — the case matrix");

{
  // Cases 1–2: same `ref`, and same `label` after normalisation.
  const previous = gearSet(
    "budget",
    entry("helm", byRef("unique", "harlequin-crest")),
    entry("amulet", byLabel("Rare amulet: +2 skills")),
  );
  const current = gearSet(
    "optimized",
    entry("helm", byRef("unique", "harlequin-crest")),
    entry("amulet", byLabel("  RARE   Amulet:  +2 Skills ")),
  );
  const c = compareTiers(previous, current);
  check(
    "T15 cases 1-2: the same ref and the same normalised label both read `kept`",
    c.slots.length === 2 &&
      c.slots.every((s) => s.marker === "kept") &&
      c.slots[0].previous === "unique:harlequin-crest",
    c.slots.map((s) => s.marker).join(",") || "no slots",
  );
}

{
  // Case 3: the previous primary is still recommended, one rank down.
  const previous = gearSet("budget", entry("body", byRef("unique", "skin-of-the-vipermagi")));
  const current = gearSet(
    "optimized",
    entry("body", byRef("runeword", "enigma"), byRef("unique", "skin-of-the-vipermagi")),
  );
  const [s] = compareTiers(previous, current).slots;
  check(
    "T16 case 3: the previous primary demoted to a secondary pick reads `alternative` via secondary-pick",
    s?.marker === "alternative" &&
      s.alternativeVia === "secondary-pick" &&
      s.previous === "unique:skin-of-the-vipermagi",
    `${s?.marker}/${s?.alternativeVia}`,
  );
}

{
  // Case 4: the previous primary survives inside the new primary's own
  // `alternatives[]`, which is where 92 of the 125 live.
  const previous = gearSet("budget", entry("weapon", byRef("runeword", "spirit")));
  const [nested] = compareTiers(
    previous,
    gearSet(
      "optimized",
      entry(
        "weapon",
        byRef("runeword", "heart-of-the-oak", { alternatives: [byRef("runeword", "spirit")] }),
      ),
    ),
  ).slots;
  check(
    "T17 case 4: the previous primary nested in `alternatives[]` reads `alternative` via nested-alternative",
    nested?.marker === "alternative" && nested.alternativeVia === "nested-alternative",
    `${nested?.marker}/${nested?.alternativeVia}`,
  );
  const [both] = compareTiers(
    previous,
    gearSet(
      "optimized",
      entry(
        "weapon",
        byRef("runeword", "heart-of-the-oak", { alternatives: [byRef("runeword", "spirit")] }),
        byRef("runeword", "spirit"),
      ),
    ),
  ).slots;
  check(
    "T17 …and when it is both, secondary-pick wins — the ranked list is the stronger statement",
    both?.alternativeVia === "secondary-pick",
    String(both?.alternativeVia),
  );
}

{
  // Case 5: the previous primary is gone from this occurrence entirely.
  const previous = gearSet("budget", entry("helm", byRef("unique", "harlequin-crest")));
  const [s] = compareTiers(
    previous,
    gearSet("optimized", entry("helm", byRef("runeword", "delirium"))),
  ).slots;
  check(
    "T18 case 5: a primary that replaced the old one outright reads `new`, and still reports what it replaced",
    s?.marker === "new" && s.previous === "unique:harlequin-crest",
    `${s?.marker}/${s?.previous}`,
  );
}

{
  // Cases 6–7: the slot name is new, and the slot name is old but the
  // occurrence is new. Both read `new`, and neither has anything to report as
  // the previous identity.
  const previous = gearSet("budget", entry("helm", byRef("unique", "tarnhelm")));
  const c = compareTiers(
    previous,
    gearSet(
      "optimized",
      entry("helm", byRef("unique", "tarnhelm")),
      entry("helm", byLabel("Weapon switch helm")),
      entry("ring1", byRef("unique", "stone-of-jordan")),
    ),
  );
  check(
    "T19 case 6: a slot name that did not exist before reads `new` with no previous identity",
    c.slots.length === 3 && c.slots[2].marker === "new" && c.slots[2].previous === undefined,
    `${c.slots[2]?.marker}/${c.slots[2]?.previous}`,
  );
  check(
    "T19 case 7: a second occurrence of an existing slot name reads `new` too — this is blade-fury's weapon#1",
    c.slots[1]?.key === "helm#1" &&
      c.slots[1].marker === "new" &&
      c.slots[1].previous === undefined,
    `${c.slots[1]?.key}/${c.slots[1]?.marker}`,
  );
  check(
    "T19 …and nothing is reported removed",
    c.slots.length === 3 && c.removed.length === 0,
  );
}

{
  // Case 8 against case 8b, side by side. The difference is the whole of §4.5.
  const boots = byRef("unique", "war-traveler");
  const gone = compareTiers(
    gearSet(
      "budget",
      entry("helm", byRef("unique", "tarnhelm")),
      entry("boots", boots),
    ),
    gearSet("optimized", entry("helm", byRef("unique", "tarnhelm"))),
  );
  check(
    "T20 case 8: a slot name with no occurrence left is published as removed, with its identity and pick",
    gone.removed.length === 1 &&
      gone.removed[0].key === "boots#0" &&
      gone.removed[0].slot === "boots" &&
      gone.removed[0].occurrence === 0 &&
      gone.removed[0].identity === "unique:war-traveler",
    JSON.stringify(gone.removed.map((r) => r.key)),
  );
  const previous = gearSet(
    "budget",
    entry("weapon", byRef("runeword", "passion")),
    entry("weapon", byLabel("Weapon switch: Call to Arms and a Spirit shield")),
  );
  const thinned = compareTiers(previous, gearSet("optimized", entry("weapon", byRef("runeword", "grief"))));
  check(
    "T20 case 8b: an occurrence that vanished while the slot name survives is not published",
    thinned.slots.length === 1 && thinned.removed.length === 0,
    thinned.removed.map((r) => r.key).join(","),
  );
  check(
    "T20 …and the surviving occurrence still says what happened to it",
    thinned.slots[0]?.marker === "new" && thinned.slots[0].previous === "runeword:passion",
    `${thinned.slots[0]?.marker}/${thinned.slots[0]?.previous}`,
  );
  check(
    "T20 the removed pick is the object from the previous set, not a copy of it",
    gone.removed[0]?.pick === boots,
    String(gone.removed[0]?.pick?.ref?.slug),
  );
}

{
  // Case 9: the same identity in two slots of the same tier. `spirit` in the
  // weapon and the offhand is the real shape, 70 times over. Each key is
  // compared against its own history and nothing else.
  const previous = gearSet(
    "budget",
    entry("ring1", byRef("unique", "stone-of-jordan")),
    entry("ring2", byLabel("Rare ring")),
  );
  const c = compareTiers(
    previous,
    gearSet(
      "optimized",
      entry("ring1", byRef("unique", "stone-of-jordan")),
      entry("ring2", byRef("unique", "stone-of-jordan")),
    ),
  );
  check(
    "T21 case 9: two slots holding the same identity are compared in isolation, not against each other",
    c.slots.length === 2 &&
      c.slots[0].marker === "kept" &&
      c.slots[1].marker === "new" &&
      c.slots[1].previous === "label:rare ring",
    c.slots.map((s) => `${s.key}=${s.marker}`).join(",") || "no slots",
  );
}

{
  // Cases 11–12: the identity held, the sockets and the affix list did not.
  // R-BUILD-6 says "same reference", so this is `kept` — recorded here so it is
  // a decision rather than a surprise.
  const previous = gearSet(
    "budget",
    entry("helm", byRef("unique", "vampire-gaze", { sockets: "2 x Um", lookFor: ["cold absorb"] })),
  );
  const [s] = compareTiers(
    previous,
    gearSet(
      "optimized",
      entry("helm", byRef("unique", "vampire-gaze", { sockets: "Ral + Um", lookFor: ["resist", "life"] })),
    ),
  ).slots;
  check(
    "T22 cases 11-12: changed sockets and lookFor under the same identity still read `kept`",
    s?.marker === "kept",
    String(s?.marker),
  );

  // Case 18: present → absent → present, 46 times in the corpus.
  const walk = compareProgression([
    gearSet("budget", entry("boots", byRef("unique", "war-traveler"))),
    gearSet("optimized", entry("helm", byRef("unique", "tarnhelm"))),
    gearSet("bis", entry("boots", byRef("unique", "war-traveler"))),
  ]);
  check(
    "T22 case 18: a slot that leaves and comes back is removed, then new",
    walk.length === 3 &&
      walk[1].removed.map((r) => r.key).join(",") === "boots#0" &&
      walk[2].slots.find((s2) => s2.key === "boots#0")?.marker === "new" &&
      walk[2].slots.find((s2) => s2.key === "boots#0")?.previous === undefined,
    `${walk[1]?.removed.length} removed / ${walk[2]?.slots[0]?.marker}`,
  );
}

{
  // Case 19: a straight ring1/ring2 swap. The plan measured zero, and a
  // measurement of zero is worth an assertion only if the harness can see a
  // non-zero — so the same detector is run over a fixture that does swap.
  const swapped = (a: GearSet, b: GearSet): boolean => {
    const primary = (set: GearSet, slot: GearSlot) => {
      const e = set.slots.find((x) => x.slot === slot);
      return e ? identityOf(e.picks[0]) : null;
    };
    const [a1, a2, b1, b2] = [
      primary(a, "ring1"),
      primary(a, "ring2"),
      primary(b, "ring1"),
      primary(b, "ring2"),
    ];
    return a1 !== null && a2 !== null && a1 !== a2 && a1 === b2 && a2 === b1;
  };
  let swaps = 0;
  for (const build of enBuilds)
    for (let i = 1; i < build.gearSets.length; i++)
      if (swapped(build.gearSets[i - 1], build.gearSets[i])) swaps++;
  check("T22 case 19: no build swaps ring1 and ring2 between two tiers", swaps === 0, String(swaps));
  check(
    "T22 control: the swap detector does fire on a set that swaps",
    swapped(
      gearSet(
        "budget",
        entry("ring1", byRef("unique", "stone-of-jordan")),
        entry("ring2", byRef("unique", "bul-kathos-wedding-band")),
      ),
      gearSet(
        "optimized",
        entry("ring1", byRef("unique", "bul-kathos-wedding-band")),
        entry("ring2", byRef("unique", "stone-of-jordan")),
      ),
    ),
  );
}

{
  // Case 10, §4.7: an identity that was the primary of one key and is now the
  // primary of another. It deliberately does not become a fifth marker — the
  // origin reads `new` or `removed` and the destination reads `new`. The count
  // is published with its definition attached, because the investigation and
  // the review each measured a different thing.
  let moved = 0;
  for (const build of enBuilds) {
    const comparisons = compareProgression(build.gearSets);
    for (let i = 1; i < build.gearSets.length; i++) {
      const previous = build.gearSets[i - 1];
      const primaries = new Map<string, string>();
      const seen = new Map<string, number>();
      for (const e of previous.slots) {
        const nth = seen.get(e.slot) ?? 0;
        seen.set(e.slot, nth + 1);
        primaries.set(`${e.slot}#${nth}`, identityOf(e.picks[0]));
      }
      const now = new Map(
        (comparisons[i]?.slots ?? []).map((s) => [s.key, identityOf(s.entry.picks[0])]),
      );
      for (const [key, identity] of primaries) {
        if (now.get(key) === identity) continue;
        for (const [otherKey, otherIdentity] of now)
          if (otherKey !== key && otherIdentity === identity) {
            moved++;
            break;
          }
      }
    }
  }
  check(
    "T22 case 10 (§4.7): 17 occurrences move slot, and none of them becomes a fifth marker",
    moved === 17,
    String(moved),
  );
}

// ---------------------------------------------------------------------------
// T23–T29 — R-BUILD-7, and the promise that no text is invented
// ---------------------------------------------------------------------------

console.log("\nT23-T29 — the next-upgrade data");

const hasText = (s: GearSet) => typeof s.nextUpgrade === "string" && s.nextUpgrade.trim().length > 0;

{
  const source = enBuilds.flatMap((b) => b.gearSets.filter((s) => s.tier !== "bis"));
  check(
    "T23 the 265 source tiers (starter…optimized) carry a nextUpgrade",
    source.length === 265 && source.every(hasText),
    `${source.filter(hasText).length}/${source.length}`,
  );

  const gaps = enBuilds.flatMap((b) => b.gearSets.filter((s) => !hasText(s)));
  check(
    "T24 the 45 absences are all in `bis`",
    gaps.length === 45 && gaps.every((s) => s.tier === "bis"),
    `${gaps.length}, ${gaps.filter((s) => s.tier !== "bis").length} outside bis`,
  );
  check(
    "T24 …leaving 8 `bis` tiers that do carry one, which §6 keeps rather than overwrites",
    enBuilds.filter((b) => hasText(b.gearSets.at(-1)!)).length === 8,
  );
}

check(
  "T25 no tier loses its next step: every one of the 265 comparisons has a previous tier with text",
  withPrevious.length === 265 &&
    withPrevious.every((r) => {
      const build = enBuilds.find((b) => String(b.slug) === r.slug)!;
      return hasText(build.gearSets[build.gearSets.indexOf(r.set) - 1]);
    }),
);

{
  // M12: the compact tier's line comes from the tier *before* it, never from
  // itself. `previousTier` is the whole of that contract in the pure module, and
  // the two texts differ across the 265 pairs — so a mutation that read its own
  // tier would change every rendering, not a subtle few.
  let differs = 0;
  for (const build of enBuilds)
    for (let i = 1; i < build.gearSets.length; i++)
      if (build.gearSets[i - 1].nextUpgrade !== build.gearSets[i].nextUpgrade) differs++;
  check(
    "T26 the line a compact tier shows belongs to its previous tier, and that text differs across the 265",
    differs === 265,
    String(differs),
  );
  check(
    "T26 …and `previousTier` names it, so the caller cannot pick the wrong one",
    withPrevious.every((r) => {
      const build = enBuilds.find((b) => String(b.slug) === r.slug)!;
      return r.comparison.previousTier === build.gearSets[build.gearSets.indexOf(r.set) - 1].tier;
    }),
  );
}

{
  const ALLOWED = new Set(["tier", "previousTier", "slots", "removed", "majority"]);
  const strays = rows.filter((r) => Object.keys(r.comparison).some((k) => !ALLOWED.has(k)));
  check(
    "T27 a comparison carries nothing but tier, previousTier, slots, removed and majority",
    rows.length === 318 && strays.length === 0,
    strays
      .slice(0, 3)
      .map((r) => `${r.slug}/${r.set.tier}: ${Object.keys(r.comparison).join(",")}`)
      .join(" | "),
  );
  const bis = rows.filter((r) => r.set.tier === "bis");
  check(
    "T27 `bis` gets no derived next step — the module has no field to put one in",
    bis.length === 53 && bis.every((r) => !("nextUpgrade" in r.comparison)),
    `${bis.length} bis comparisons`,
  );
}

{
  const census = (locale: (typeof LOCALES)[number]) =>
    getBuilds(locale)
      .flatMap((b) => b.gearSets.map((s) => `${String(b.slug)}/${s.tier}=${hasText(s) ? 1 : 0}`))
      .join("\n");
  check(
    "T28 which tiers have a next step and which do not is identical in en-US and pt-BR",
    census("en-us") === census("pt-br"),
  );
}

{
  // T29 in its pure form. The rendered half of this — "no string in the HTML is
  // absent from `content/`" — belongs to `build-markers-html.test.ts`; what can
  // be settled here is that the module itself writes no text. Every string it
  // emits is either a closed vocabulary or an identity that traces back to a
  // pick in the source.
  const VIA = new Set(["secondary-pick", "nested-alternative"]);
  const invented: string[] = [];
  let inspected = 0;
  for (const build of enBuilds) {
    const comparisons = compareProgression(build.gearSets);
    comparisons.forEach((c, i) => {
      const previous = build.gearSets[i - 1];
      const previousIds = new Set<string>();
      const collect = (p: GearPick) => {
        previousIds.add(identityOf(p));
        for (const a of p.alternatives ?? []) collect(a);
      };
      for (const e of previous?.slots ?? []) for (const p of e.picks) collect(p);

      for (const s of c.slots) {
        inspected++;
        if (s.key !== `${s.slot}#${s.occurrence}` || !GEAR_SLOTS.includes(s.slot))
          invented.push(`${c.tier}/${s.key}: key`);
        if (s.marker !== null && !MARKERS.includes(s.marker))
          invented.push(`${c.tier}/${s.key}: marker ${s.marker}`);
        if (s.alternativeVia && !VIA.has(s.alternativeVia))
          invented.push(`${c.tier}/${s.key}: via ${s.alternativeVia}`);
        if (s.previous !== undefined && !previousIds.has(s.previous))
          invented.push(`${c.tier}/${s.key}: previous ${s.previous}`);
      }
      for (const rm of c.removed) {
        if (rm.identity !== identityOf(rm.pick)) invented.push(`${c.tier}/${rm.key}: identity`);
        if (!previousIds.has(rm.identity)) invented.push(`${c.tier}/${rm.key}: unknown identity`);
      }
    });
  }
  check(
    "T29 every string the module emits is a closed vocabulary or an identity taken from the source",
    inspected === 2659 && invented.length === 0,
    invented.length ? invented.slice(0, 3).join(" | ") : `${inspected} occurrences inspected`,
  );
}

// ---------------------------------------------------------------------------

console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length > 0) {
  console.error("\nFailures:");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
