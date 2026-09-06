# Proposal: wire the Warlock's thirty skills

**From:** Agent C (Warlock), branch `claude/warlock-complete`
**To:** the coordinator
**Phase:** 1 of 5 — skills only. Builds, journey and controls come later.
**Research:** [`docs/research/09-warlock.md`](../research/09-warlock.md)

Phase 1 is complete and committed. This is every line in a coordinator-owned
file that has to change before `npm run gen:skill-graph` will run, and what to
change after it does.

Sections **A** and **B** are blocking: without them the generator throws and no
graph is produced. **C** is the ordinary registration. **D** is a real defect
that does not throw, and needs a decision rather than a fix by default. **E** and
**F** are documentation. **G** is what I need back.

---

## A. `scripts/generate-skill-graph.ts` — two rows that stop the generator

`assertPhysicalClassified` refuses any in-scope row carrying `MinDam`/`MaxDam`
that is in neither list. Two Warlock rows carry those columns and are in neither.

### A1. `PUBLISHES_PHYSICAL` — add both

```ts
const PUBLISHES_PHYSICAL = new Set<string>([
  "molten-boulder", "twister", "shock-wave", "volcano", "tornado", "armageddon",
  "blade-sentinel", "blade-fury", "blade-shield", "mind-blast",
  /*
   * The Warlock's two.
   *
   * Echoing Strike is the Assassin blades' shape: a flat physical table plus a
   * weapon share, `SrcDam = 116` — 91% of the weapon against the blades' 75%.
   *
   * Blood Boil is the harder one, because the two precedents above disagree
   * about it. Its physical and fire tables are byte-identical, numbers and all
   * five bands, which is Psychic Hammer's shape and Psychic Hammer is excluded.
   * It is also Molten Boulder's and Volcano's shape, and those are published.
   * The column that separates them is the synergy: Molten Boulder and Volcano
   * each feed the two tables from *different* skills, and Psychic Hammer feeds
   * neither from anything. Blood Boil reads `Engorge` into the physical and
   * `Blood Oath` into the fire. Two components fed by two synergies are two
   * components; one damage written twice has no synergy on either.
   */
  "echoing-strike", "blood-boil",
]);
```

The full evidence table is in `09-warlock.md` §5.3. If you would rather not
extend the two lists on this reasoning, the alternative is
`PHYSICAL_IS_NOT_THE_SKILLS_OWN["blood-boil"]` with a reason — but then the
Warlock page publishes half of Blood Boil's damage and the Druid's two
equivalent rows publish all of theirs, and the site is inconsistent about the
same shape. My recommendation is the diff above.

Content impact if you take it: `content/classes/warlock/skills.ts` already
describes Blood Boil as two tables with two synergies, and Echoing Strike as a
physical table plus a 91% weapon share. Both are written for this outcome. If
you choose the other reading, tell me and I will rewrite those two entries — do
not paper over it in the generator.

### A2. Not mine, but the same run

Adding `bar` to `classOf` hits the same guard on **Leap Attack** (`MinDam 10/20`,
`SrcDam 128`) and **War Cry** (`MinDam 30/40`, no `SrcDam`). Those are Agent B's
rows. Flagged only because the graph is regenerated once for everyone.

---

## B. `scripts/skill-graph-rules.ts` — three unknown synergy kinds

`SYNERGY_KINDS` throws on an unrecognised label. Three Warlock labels are not in
it. I ran `synergiesFor` against all thirty rows in isolation before authoring
anything, so these are observed failures and not predictions: **27 rows pass,
these 3 throw.**

The keys below are what the existing normaliser produces
(`described.replace(/\s*synergy\s*/i, "").trim().toLowerCase()`). The double
space in the first is real — it is in Blizzard's column and survives the
normaliser.

```ts
  // The Warlock. `buff duration` is already here; `debuff duration` is its
  // mirror, and Eldritch Blast writes the same idea as a sentence.
  "debuff duration": "duration",
  "duration per level  (psychic ward)": "duration",
  // Hex: Siphon's heal-after-kill and mana-after-kill. Neither damage nor
  // duration, and folding it into either would be the exact mislabelling this
  // table exists to refuse.
  "life/mana steal": "steal",
```

| Row | Param | Raw description |
| --- | --- | --- |
| Hex Purge | 2 | `Debuff Duration synergy` |
| Eldritch Blast | 4 | `Synergy Duration per level  (psychic ward)` |
| Hex Siphon | 9 | `life/mana steal synergy` |

If `"steal"` is the wrong word for the third, pick another — the point is that
it is a fourth kind and not one of the three you have.

---

## C. Registration

### C1. `scripts/generate-skill-graph.ts`

```ts
const classOf = { pal: "paladin", sor: "sorceress", ama: "amazon", nec: "necromancer", dru: "druid", ass: "assassin", war: "warlock" } as const;
```

`expected = Object.keys(classOf).length * 30` then wants 210, and the extraction
has exactly 30 `war` rows, so that assertion passes unchanged.

### C2. `content/classes/index.ts`

```ts
import { warlockSkills, warlockTrees } from "./warlock/skills";
// ...
export const allSkills: Skill[] = [ ..., ...warlockSkills ];
export const allSkillTrees: SkillTree[] = [ ..., ...warlockTrees ];
```

**Two `SLUG_OVERRIDES` entries are needed** — you flagged this and you were
right; the first version of this proposal said none were. Yours to land:

```ts
  Levitate: "levitation-mastery",
  "Miasma Chains": "miasma-chain",
```

I re-derived the whole thing independently before changing anything rather than
taking the correction on trust, and it confirms your table cell for cell: the
thirty `str name` keys resolved against `json/allstrings-eng.json` at the pinned
commit give **8 name gaps and exactly 2 slug changes**. Across all eight classes
there are 27 such gaps — 18 in the authored six, 1 Barbarian (`Pole Arm Mastery`),
8 Warlock — and all 18 authored ones publish the shipped name, so the rule is
18/18. All eight Warlock names are corrected in `skills.ts` and `pt-br.ts`;
`09-warlock.md` §3 is rewritten around why a collision check could not see them.

Zero collisions remains true and is now recorded as insufficient rather than
sufficient. A useful invariant fell out of the fix: **`slug === slugify(published
name)` for all thirty**, overrides included — `slugify("Hex: Bane")` is
`hex-bane` and `slugify("Levitation Mastery")` is `levitation-mastery` — so the
override maps identifier to slug and the published name already agrees with it.

One thing for you, since `docs/sources/README.md` is yours: it records the
`str name` / `str long` tables as "never extracted, never shipped". The eighteen
existing overrides show the intent is descriptive prose rather than proper nouns,
but as written it reads as a prohibition on the only check that catches this
class of defect. Worth one clause.

**No new `damageModel` is needed.** The existing seven cover all four Warlock
attacks with a table (§5.1). The only judgement call is Blade Warp, argued at
§5.2 and carried at `confidence: "single"`.

### C3. `content/classes/skills-pt-br.ts`

Both exports are plain `Overlay<SkillCopy>` / `Overlay<SkillTreeCopy>` maps keyed
by the same slugs, so either merge point works:

```ts
// in content/classes/skills-pt-br.ts, which is one flat literal per export:
import { warlockSkillsPtBr, warlockTreesPtBr } from "./warlock/pt-br";
export const skillTreesPtBr: Overlay<SkillTreeCopy> = { ...warlockTreesPtBr, /* existing */ };
export const skillsPtBr: Overlay<SkillCopy> = { ...warlockSkillsPtBr, /* existing */ };

// or spread them in lib/registry/overlays.ts, where both are already imported.
```

Your call which — I did not want to reformat a 1,500-line literal you own.

Parity is already verified locally: 30 skills, 3 trees, `mechanics` bullet
counts equal in both locales for every skill, `synergyBonuses` length equal to
`synergies` length for every skill that has any, and no orphan keys in either
direction.

### C4. `content/classes/classes.ts`

Nothing to add. `trees: ["demon", "eldritch", "chaos"]` is already published and
the authored file uses exactly those three, mapped from `SkillPage` 1, 2, 3 in
that order.

### C5. `scripts/class-tree-rules.ts`

Remove `"warlock"` from `TREES_NOT_YET_AUTHORED`, leaving `["barbarian"]` until
Agent B lands. All three Warlock trees are authored, so the
all-or-none rule is satisfied.

---

## D. A defect that does not throw — please decide, do not default

Two shapes appear in the Warlock rows and nowhere else in the extraction, and
neither raises anything. Both end at `governing.length === 0 → continue`, so
**six real synergy edges are dropped in silence**. Full detail at
`09-warlock.md` §6.2.

**D1. The `paNN` short form.** `PAR_REF` is `/par(\d+)/g` and `DONOR_PAR_REF` is
`/skill\('([^']+)'\.par(\d+)\)/g`. Neither matches `pa10`, `pa11`, `pa12`. Five
expressions use that form — thank you for the fifth, `bar` Throwing Mastery's
`passivecalc6`; my "four" was wrong. The four that name a donor and therefore
create an edge are all Warlock: Hex: Bane's `EDmgSymPerCalc`, Hex: Purge's
`calc2`, and both of Engorge's references to Blood Oath.

**D2. `*Param10 Description2`.** The `Param10` description column carries a
trailing `2` where 1-9 and 11-12 do not. `readParam` reads
`*Param${index} Description`, so a `Param10` described as a synergy is invisible.
Two counts I measured after your note, which make the fix safer than I had
argued: **`*Param10 Description` — the spelling the generator looks for — exists
on zero rows in the whole file**, so that lookup has never once succeeded; and
`*Param10 Description2` exists on **13 rows: 1 `bar`, 11 `war`, 1 non-class**.
Reading the second spelling cannot reach any of the 180 published nodes. All six
`Param10`-and-above synergy descriptions across the eight classes are Warlock.

Lost between them: Hex: Bane ← Consume / Hex: Purge / Mirrored Blades (magnitude
35 each), Hex: Purge ← Sigil: Death (100), Engorge ← Blood Oath (25).

I have not touched either file, and nothing I authored depends on the outcome:
**no `synergies` array in `skills.ts` names an edge from this section.** Where
the relationship is real and the graph will not carry it, the skill's `mechanics`
say so in prose without a magnitude — Hex: Bane, Hex: Purge and Eldritch Blast each
carry such a bullet. So `check:content` passes either way and nothing has to be
rewritten if you decline.

It is still worth doing. This is a repository whose generator stops rather than
guesses, and here it neither stops nor guesses — it drops, on the newest class,
where nobody would notice.

---

## E. `docs/research/00-game-state.md`

### E1. Open question 1 — close it

Replace the "Unverified: exact skill lists…" block under **The Warlock** and the
paragraph in **The Warlock attributes exception** that reads "the Warlock's
skills are not verified and are not [published]". The thirty rows are Tier 1 by
exactly the argument the attributes were: same pin, same file, same columns.
`09-warlock.md` §1 has the wording and the two structural checks.

### E2. Open question 10 — close it, and strike its prediction

It reads "Whether Warlock has its own FCR/FHR breakpoint table (near-certain
that it does)". **It does not, and the site already says so.**
`content/breakpoints/breakpoints.ts` publishes `fcr-paladin-necromancer-warlock`,
`fhr-necromancer-druid-warlock` and `fbr-necromancer-druid-warlock`, all at
`confidence: "verified"`. The parenthetical prediction should be struck rather
than left to mislead the next reader.

### E3. Class coverage table

```
| **Warlock** | **30, with pages** | — | — | **Skills and trees as of 2026-09-06; see [`09-warlock.md`](09-warlock.md)** |
```

### E4. Related research

Add `09-warlock.md` to the list.

---

## F. One published claim I could not corroborate

`content/classes/classes.ts` line 347 lists, among the Warlock's weaknesses:

> "Actively being balanced; Bind Demon was nerfed as recently as Patch 3.3"

**Nothing reachable from this worktree supports the Bind Demon half of that.**
Reasoning in full at `09-warlock.md` §7.1; in brief:

1. The pin is a single snapshot *of* 3.3 and cannot show a change.
2. `json/base/skills.json` — the only historical comparison the repository has —
   holds **zero** `war` rows, so no Warlock before/after exists in-repo at all.
3. `docs/sources/README.md` lists the 3.3 notes as the source for Terror Zone
   tuning, Latent Sunder Charm changes and the ladder→non-ladder migration.
   Skill balance is not among them, and nothing in `content/` cites one.

I attempted external verification and could not: web access is not reachable
from this agent's tool set, so no Tier 2 patch-note fetch was possible. Recorded
so the next cycle does not assume it was tried and failed silently.

Either cite the patch-note line, or soften the bullet — the surrounding claim,
that the class is young and actively balanced, stands on its own. `classes.ts`
is yours and I have not edited it.

---

## G. What I need back before Phase 2

1. The regenerated `content/classes/skill-graph.ts` with `war` in it, merged
   forward into `claude/warlock-complete`.
2. Your decision on **A1** (Blood Boil). If you take the other reading I rewrite
   two skill entries rather than leave them describing damage the graph does not
   publish.
3. Your decision on **D**. If you fix it, tell me and I will add the six
   magnitudes to Hex: Bane, Hex: Purge, Hex: Siphon, Eldritch Blast and Engorge and
   drop the "no magnitude is published" hedges from their prose. If you decline,
   the files are already correct as they stand.

Phase 2 does not start until the graph exists.

---

## Verification already done on my side

- `npx eslint content/classes/warlock` — clean.
- 30 skills, 3 trees, all thirty slugs equal to `slugify(published name)`, every
  `prerequisites` entry a Warlock skill, no self-synergy, ten skills per tree.
- **Every published name equals the `str name` string** at the pinned commit,
  for all thirty, and all three tree names equal `SkillCategoryWa1-3`
  ("Demon", "Eldritch", "Chaos" — so the tree names are Tier 1 after all, not
  the announcement's).
- Every authored `requiredLevel`, `prerequisites` set and `SkillPage → tree`
  mapping cross-checked programmatically against the pinned extraction, with
  your two overrides applied to `slugFor`: **all thirty rows match**.
- `synergiesFor` run over all thirty rows: 27 pass, 3 throw for the reason in
  **B**, and the six silent drops in **D** identified.
- pt-BR parity: bullet counts and `synergyBonuses` lengths equal for all thirty.
- `npm run check` → **`EXIT=1`**, failing only at `typecheck`, on 32
  `Cannot find name 'PageProps' / 'LayoutProps' / 'RouteContext'` errors in
  `app/**`. Those come from `.next/types`, which a fresh worktree with no build
  does not have. Proven pre-existing rather than assumed: `tsc --noEmit` with my
  two files moved out of the tree produces **the identical 32 errors**. Every
  check before `typecheck` passed, including `test:class-trees` and
  `test:attributes`.
