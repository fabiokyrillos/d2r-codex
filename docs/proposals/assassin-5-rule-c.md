# Proposal 5 — Rule C: a claim scoped to *this site* must be registered

**From** Agent A (Assassin), branch `claude/assassin-finish`
**Touches** `scripts/content-rules.ts`, `scripts/check-content.ts`,
`scripts/check-content.test.ts` — all **coordinator-owned**, so this is a
proposal and not a commit
**Catches** finding 6 (`void`, "the only item on this site besides Chaos") and
the Barbarian journey's "Every other class on this site respecs"

Measured against the corpus before it was designed. It fits in the budget you
set: **~60 lines of logic and a 29-row table.**

---

## 1. What it can and cannot do

It **cannot decide whether a site-scoped claim is true.** Half the ones in the
corpus are comparatives ("the deepest avoidance investment on this site") whose
truth needs a human. Any rule that promised to check those would be lying.

What it can do is make an unregistered one **impossible to add silently**. That
is the same shape the repo already uses twice — `SOFT_LEVEL_SYNERGIES` in
`skill-graph-rules.ts` ("Listing it here is what keeps that a decision instead
of an accident") and `GATED_ITEM_NAMES` in `availability-rules.ts`. A new
site-scoped absolute goes red, and the author either weakens the sentence or
adds a row saying what enumeration makes it true.

Both known defects were written by people who would have re-derived the claim if
a gate had asked. Finding 6 was written while its author was routing this exact
defect class to other agents.

## 2. The predicate

A sentence is in scope when it contains **both**:

```ts
/** "on this site", "on the site", "deste site" — the corpus, not the game. */
const SITE_SCOPE =
  /\b(?:on|of) (?:this|the) site\b|\bthis site'?s\b|\bde(?:ste)? site\b|\bneste site\b|\bdo site\b/i;

/** An exclusivity claim. Comparatives are deliberately excluded — see §1. */
const EXCLUSIVE =
  /\bthe only\b|\bno other\b|\bnothing else\b|\bevery other\b|\bnone of\b|\bo [úu]nico\b|\ba [úu]nica\b|\bnenhum\w* outr\w*\b|\btoda outra\b|\btodo outro\b|\bnada mais\b/i;

/** Comparative shapes the rule must not claim to judge. */
const COMPARATIVE =
  /\bthan any other\b|\bmore than any\b|\bqualquer outr\w+\b|\bmais que\b|\bmenos que\b|\bdeepest\b|\bbiggest difference\b/i;
```

`SITE_SCOPE && EXCLUSIVE && !COMPARATIVE`, sentence-scoped, using the
`sentencesIn` splitter `assassin-rules.ts` already exports — including its
`\*{0,2}` handling, because these sentences routinely open in bold.

**Measured on `main` at `d6f847e`: 29 sentences — 13 en-US, 16 pt-BR.** The
en-US thirteen are in `blade-fury`, `dragon-tail` (×2), `enchant-sorceress`,
`exploding-arrow-amazon`, `fohdin`, `hydra-sorceress`, `maul-druid`,
`multiple-shot-amazon`, `summon-druid`, `barbarian-journey`,
`necromancer-journey`, and the pt-BR sixteen are their mirrors.

## 3. Where it lives

**No new script.** `check-content.ts` already walks every authored string on
every page in both locales for the availability sweep (`allStrings` + the
`checkAvailabilityClaims` loop). Rule C rides that walk:

- `scripts/content-rules.ts` — the three regexes above, the
  `SITE_SCOPED_CLAIMS` table, and `checkSiteScopedClaims(lines, where)`.
  **~35 lines plus the table.**
- `scripts/check-content.ts` — one call inside the existing per-page loop, and
  its problems joined into the same reporter. **~8 lines.**
- `scripts/check-content.test.ts` — the mutation controls in §5. **~15 lines.**

## 4. The table

```ts
/**
 * Every sentence on the site whose scope is *the site itself*.
 *
 * "On this site" names the registries, so a claim scoped that way is checkable
 * by construction — and the way to keep it checked is to make each one carry
 * the enumeration that settles it. `why` is prose on purpose: the rule cannot
 * evaluate these, and pretending otherwise is how the last one shipped wrong.
 *
 * Keyed on the first 60 characters. Editing the sentence re-trips the rule,
 * which is intended: an edited absolute is an absolute that wants re-checking.
 */
export const SITE_SCOPED_CLAIMS: { key: string; why: string }[] = [
  { key: "Every other elemental build on this site answers a resis",
    why: "true: every other build with a resisted primary carries a second entry in `damageTypes`." },
  { key: "**Fifteen points, which no other build on the site spends",
    why: "true: no other build allocates that skill above one — check the allocations." },
  // …27 more, one line each
];
```

Two rows are worth writing carefully because they are the model. The
`exploding-arrow-amazon` entry — *"the only thing on the site that breaks fire
immunity **without costing you resistance**"* — is **true**, and true only
because of the qualifier: the same page names Flame Rift and its 70–90 point
cost three times. That is the sentence the rule exists to produce. The
`barbarian-journey` entry is the opposite and cannot be registered as true: the
site's own `respecPlan[].at` values include "Never", "Usually never" and
"Never".

## 5. The mutation control, which is the point

Plant finding 6's original sentence back into `content/runewords/runewords.ts`
on the `void` entry and show the gate goes red, then remove it and show green:

```ts
check(
  "rejects an unregistered site-scoped exclusivity claim",
  checkSiteScopedClaims(
    ["`oskill Abyss` puts a Warlock capstone on any class that can hold a dagger, " +
     "and it is the only item on this site besides Chaos that grants a skill across classes."],
    "planted",
  ).length === 1,
);
check(
  "and accepts the same sentence once it is registered",
  /* same string, with its key in SITE_SCOPED_CLAIMS */
);
check(
  "a comparative is out of scope rather than silently allowed",
  checkSiteScopedClaims(
    ["This build takes less damage than any other Sorceress on the site."],
    "planted",
  ).length === 0,
);
```

The third control is the one I would not skip. A rule that quietly swallowed
comparatives would read as though it had checked them.

## 6. What it does not catch, stated so nobody assumes otherwise

Neither of the two worst findings this run. **Finding 1** (the Warlock's
two-hander claim) is scoped to the game, not the site, and its refutation is a
column in `weapons.json`. **Finding 7** (Phoenix Strike's triple immunity) is
scoped to the game and its refutation is a row in `monstats.json`. Rule C would
have been silent on both.

Rules A and B from my report would reach them, and both are larger — rule A's
"the plumbing already exists" claim rests on `item-rules.ts` reading
`properties.json`, which I have not tested for this purpose and would want to
before anyone calls it a small job.

**A gate does not replace the sweep. It shortens the next one.**
