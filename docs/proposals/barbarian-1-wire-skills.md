# Proposal 1 — wiring the Barbarian's thirty skills

**From:** Agent B (Barbarian), branch `claude/barbarian-complete`
**To:** the coordinator, before `npm run gen:skill-graph`
**Status:** Phase 1 is committed. Nothing below is in a file this branch owns.

Every change here is in a coordinator-owned file. They are listed in the order
they have to be applied, because **three of them stop the generator** and the
graph cannot be produced until all three are in.

---

## 0. Summary

| # | File | What | Blocks generation? |
| --- | --- | --- | --- |
| 1 | `scripts/skill-graph-rules.ts` | one `SLUG_OVERRIDES` entry | yes, if declined — see §1 |
| 2 | `scripts/skill-graph-rules.ts` | two `SYNERGY_KINDS` entries | **yes** |
| 3 | `lib/labels.ts` | one `SYNERGY_KINDS_LABELLED` entry, one `synergyKindLabels` row | yes, via `check:content` |
| 4 | `lib/i18n/dictionaries/{en-us,pt-br}.ts` | one word per locale for the new kind | yes, via `check:content` |
| 5 | `scripts/generate-skill-graph.ts` | two `PUBLISHES_PHYSICAL` entries | **yes** |
| 6 | `scripts/generate-skill-graph.ts` | `bar: "barbarian"` in `classOf` | it is the trigger |
| 7 | `content/classes/index.ts` | one import, two array entries | — |
| 8 | `content/classes/skills-pt-br.ts` | spread two overlays | — |
| 9 | `scripts/class-tree-rules.ts` | remove `barbarian` from `TREES_NOT_YET_AUTHORED` | — |

**Verified as needing no change:** `lib/skills.ts` (`CLASSES_WITH_SKILL_PAGES`
derives itself from the graph), `scripts/graph-drift.ts` (`BASELINE_NODES = 150`
describes the *baseline* commit, not the new graph), `scripts/damage.test.ts`
(the Barbarian publishes zero effect rows, so it is absent from `perClass`
rather than wrong in it — see §5), and `scripts/check-content.test.ts`'s
`publishedClasses.length === 6`, which counts classes **with builds** and stays
at 6 until Phase 3.

---

## 1. `SLUG_OVERRIDES` — one entry

The evidence and the decline path are in
[`barbarian-2-slug-overrides.md`](barbarian-2-slug-overrides.md). The edit, in
`scripts/skill-graph-rules.ts`, after the Assassin block:

```ts
  /*
   * The Barbarian, one of thirty, and the smallest gap on the site: a single
   * space. `Pole Arm Mastery` in the table ships as **Polearm Mastery** —
   * `str name = skillname134` resolves to it in `allstrings-eng.json` — which is
   * the same shape as `Clay Golem`, spelled with a space where its three
   * siblings are not. Slugifying the identifier would publish
   * `/classes/barbarian/skills/pole-arm-mastery`, a URL nobody types.
   *
   * Pinned by its own row: page 2, row 2, level 6, `passiveitype = pole`.
   *
   * The other twenty-nine identifiers are byte-identical to their shipped names.
   * Two were checked because they looked like candidates and are not: `Blade
   * Mastery` really is called Blade Mastery, and `Battle Command`'s `str alt`
   * "Battle Cmd" is a short label rather than a second name.
   */
  "Pole Arm Mastery": "polearm-mastery",
```

### If you decline this

`content/classes/barbarian/skills.ts` and `content/classes/barbarian/pt-br.ts`
author the slug **`polearm-mastery`**. Declining the override means the generator
emits `pole-arm-mastery` and `check:content` reports one `orphan-skill` and one
`orphan-node`. The fix is three string replacements on my branch — say the word
and I will make them. It is the only item here that goes either way.

## 2. `SYNERGY_KINDS` — two entries

**This one is not optional and it is not a judgement call.** Running this
repository's own `synergiesFor` over the thirty pinned `bar` rows throws on
three of them:

```
Bash:      unknown synergy kind "Attack Rating synergy"
Stun:      unknown synergy kind "Attack Rating synergy"
Find Item: unknown synergy kind "% chance synergy"
```

In `SYNERGY_KINDS`, after `"bonus shot per # levels"`:

```ts
  /*
   * The Barbarian, whose two new labels are both the game's own words.
   *
   * "Attack Rating synergy" maps to the kind the golem ring already uses.
   * Concentrate raises Bash's and Stun's attack rating by 5% per hard point
   * through their `ToHitCalc`, which makes it the only *bare* attack-rating
   * synergy in the extraction — the Necromancer's three are source-owned and
   * carry the golem's name in the label.
   *
   * "% chance synergy" is genuinely new. Find Potion raises Find Item's chance
   * to roll a second drop by one point per hard point, and that is neither
   * damage nor duration: a reader told Find Potion raises Find Item's "damage"
   * would be told something with no meaning at all.
   */
  "attack rating": "attack-rating",
  "% chance": "chance",
```

`attack-rating` is already in `SYNERGY_KINDS_LABELLED` and already translated,
so it costs exactly the line above. `chance` needs §3 and §4.

## 3. `lib/labels.ts` — one kind, two places

```ts
export const synergyKindLabels = (t: Dictionary): Record<string, string> => ({
  // ...
  shots: t.skills.synergyKindShots,
  chance: t.skills.synergyKindChance,   // <- add
});

export const SYNERGY_KINDS_LABELLED: readonly string[] = [
  // ...
  "shots",
  "chance",                              // <- add
];
```

## 4. `lib/i18n/dictionaries/{en-us,pt-br}.ts` — one word per locale

Add `synergyKindChance` beside `synergyKindShots` in both. Suggested, and yours
to overrule:

| locale | word |
| --- | --- |
| en-US | `find chance` |
| pt-BR | `chance de achar` |

Only one edge in the graph carries it (Find Item ← Find Potion), and the sentence
it lands in is "+1% find chance per level".

## 5. `PUBLISHES_PHYSICAL` — two entries

`assertPhysicalClassified` stops the generator on any in-scope row carrying
`MinDam`/`MaxDam` that neither list classifies. Two Barbarian rows do.

```ts
const PUBLISHES_PHYSICAL = new Set<string>([
  // ...
  "blade-sentinel", "blade-fury", "blade-shield", "mind-blast",
  /*
   * The Barbarian's two, and they are the two shapes already on this list.
   *
   * Leap Attack is the Blade Fury shape: `SrcDam = 128` **and** a physical
   * range of its own, 10-20 at level 1 and 150-300 at 20. The weapon's full
   * damage lands and this lands with it, which is why the page also carries
   * `damageModel: "weapon-plus-element"` — without a model the partition in
   * `check-content.ts` drops it into `table` and it stops being an attack.
   *
   * War Cry is the Shock Wave shape: no `SrcDam`, no `EType`, so the range is
   * the whole of the skill's damage — 30-40 at level 1, 198-208 at 20. It is
   * the only Barbarian skill that kills without a weapon.
   */
  "leap-attack", "war-cry",
]);
```

> A discriminator that was tried and rejected: every row already on
> `PUBLISHES_PHYSICAL` prints a physical range in the game's own tooltip
> (`desccalca = pnma`/`pxma`), and so do Holy Shield, Raven and Spirit of Barbs,
> which are all excluded. `descdam` is closer — empty on five of the six excluded
> rows — but Psychic Hammer breaks it. The list stays a list. Written up in
> `docs/research/08-barbarian.md` §2.3 so the next class does not retry it.

## 6. `classOf` — the trigger

```ts
const classOf = { pal: "paladin", sor: "sorceress", ama: "amazon", nec: "necromancer", dru: "druid", ass: "assassin", bar: "barbarian" } as const;
```

`expected = Object.keys(classOf).length * 30` becomes 210, and the extraction has
exactly thirty `bar` rows — confirmed against the pinned commit.

## 7. `content/classes/index.ts`

```ts
import { barbarianSkills, barbarianTrees } from "./barbarian/skills";
// ...
export const allSkills: Skill[] = [ /* ... */ , ...barbarianSkills ];
export const allSkillTrees: SkillTree[] = [ /* ... */ , ...barbarianTrees ];
```

No slug collides. All 30 skill slugs and the three tree slugs were checked
against the 198 slugs already in `content/classes/*/skills.ts`; the only
collision in the whole set is `combat-skills`, which is why the tree is
`barbarian-combat-skills`, exactly as `classes.ts` already declares.

## 8. `content/classes/skills-pt-br.ts`

```ts
import { barbarianSkillsPtBr, barbarianTreesPtBr } from "./barbarian/pt-br";

export const skillTreesPtBr: Overlay<SkillTreeCopy> = {
  // ...
  ...barbarianTreesPtBr,
};

export const skillsPtBr: Overlay<SkillCopy> = {
  // ...
  ...barbarianSkillsPtBr,
};
```

Parity is proven on my branch rather than assumed: 30 summaries, `mechanics`
arrays of identical length on both sides for all thirty, and `synergyBonuses`
positionally matching `synergies` on all thirteen skills that have any.

## 9. `scripts/class-tree-rules.ts`

Remove `"barbarian"` from `TREES_NOT_YET_AUTHORED`, leaving `["warlock"]`. All
three trees are authored, ten skills each, so the "all or none" rule is
satisfied.

---

## What the graph should contain afterwards

Stated so a mismatch is visible rather than plausible. All of it is the output of
this repository's own `synergiesFor` and `slugFor` run against the pinned rows
with §1 and §2 applied.

- **180 nodes → 210.** `graph-drift` should report 150 baseline nodes
  byte-identical and 30 added, touching nothing else.
- **Page → tree**: page 1 → `barbarian-combat-skills`, page 2 →
  `combat-masteries`, page 3 → `warcries`. Ten skills each.
- **Twenty synergy edges**, on thirteen receivers:

```
bash            <- concentrate (attack-rating), stun (damage)
stun            <- bash (damage), concentrate (attack-rating), war-cry (duration)
double-swing    <- bash (damage)
double-throw    <- double-swing (damage)
leap-attack     <- leap (damage)
concentrate     <- bash (damage), battle-orders (damage)
frenzy          <- double-swing (damage), taunt (damage)
berserk         <- battle-orders (damage), howl (damage)
war-cry         <- battle-cry (damage), howl (damage), taunt (damage)
shout           <- battle-command (duration), battle-orders (duration)
battle-orders   <- battle-command (duration), shout (duration)
battle-command  <- battle-orders (duration), shout (duration)
find-item       <- find-potion (chance)
```

- **No `magnitude` on any of the twenty.** Every Barbarian coefficient is
  receiver-owned, so all twenty numbers are authored prose, as seventeen edges
  elsewhere on the site already are.
- **Zero effect rows.** No Barbarian slug is in `EFFECTS`, so all thirty publish
  an empty effects table. This is the first class in that position and it is
  deliberate: every magnitude is in `mechanics`. If a later pass wants three,
  Battle Orders' life percentage, Natural Resistance's resist-all and Grim Ward's
  slow are the class's three most-quoted numbers.
- **Two physical tables**, Leap Attack and War Cry, and no elemental table
  anywhere on the class — Concentrate, Frenzy and Berserk carry `EType = mag`
  with no `EMin`/`EMax`, so nothing is tabulated for them.
