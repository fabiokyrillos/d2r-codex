# Necromancer foundation (research and execution record)

**Executed 2026-09-03.** Scope: the class's technical and content foundation
only — three trees, thirty bilingual skills, the extraction, three mechanics
articles and the gates around them. No builds, no levelling journey, no items,
no aliases.

## What this pass found before it wrote anything

### 1. The synergy extractor read the wrong row

A skill's calc columns scale a synergy one of two ways:

```
(skill('Vigor'.blvl)+skill('Blessed Aim'.blvl))*par8    the receiver's par8
skill('IronGolem'.blvl)*skill('IronGolem'.par8)         Iron Golem's par8
```

The extractor matched `par(\d+)` anywhere in the expression and looked the index
up on the **receiving** skill's row. Every Paladin, Sorceress and Amazon
expression is the first shape, so that was right for ninety nodes and wrong the
moment a second shape appeared.

The golems are the second shape, and there the two rows disagree about both
facts at once:

| | Clay Golem's own Param8 | Iron Golem's Param8 |
| --- | --- | --- |
| Description | "Clay Golem Attack Rating synergy" | "Iron Golem Armor synergy" |
| Value | 20 | 35 |

So the bonus Clay Golem *receives* from the Iron Golem would have been published
as attack rating at 20 — which is what Clay Golem *gives* — on every golem page
and in both directions. In practice the old rule threw on the unrecognised
label rather than publishing it, which is the only reason it was not shipped
quietly.

Fixed by attributing each `parN` to its owner before reading its description.
Regenerating the pre-Necromancer scope afterwards reproduced all ninety node
bodies byte for byte; `npm run check:graph-drift` pins that against `c98e3ed`.

Two further shapes had to be decided rather than guessed:

- **A skill scaling itself.** Blessed Aim's `skill('Blessed Aim'.blvl) * par8`
  under "Attack Rating % passive synergy", and Clay Golem's
  `skill('Golem Mastery'.ln56) + (lvl*par8)` under its own Param8. Neither is an
  edge: there is no other skill in them.
- **A donor's synergy parameter with no base-level reference.** Revive reads
  Skeleton Mastery through `.lvl`, the *effective* level, which +skills raise —
  so the game's own "Revive Synergy HP % per level" label describes something a
  synergy is not. Listed in `SOFT_LEVEL_SYNERGIES` with the reason. The Druid's
  Spirit Wolf, Fenris and Grizzly have the same shape and will stop the
  generator until someone rules on them.

### 2. Two class pages were rendering another class's tree

`CharacterClass.trees` is a list of slugs and the class page resolved it with
`.map(getSkillTree).filter(Boolean)`. Tree slugs resolve globally, like skill
slugs, and:

- The **Barbarian** listed `combat-skills`, which is the Paladin's. Its class
  page rendered the Paladin's Combat Skills card — theme sentence and ten
  Paladin skills — under the Barbarian's heading.
- The **Druid** listed `summoning`, which was free until this pass authored a
  Necromancer tree with that slug.

Both are now class-prefixed, and `scripts/class-tree-rules.ts` holds eight rules
so it cannot recur.

### 3. Two tree assertions encoded facts about three classes

- "Every prerequisite edge runs from a lower row to a higher one." Skeleton
  Mastery and Raise Skeleton are both level-1 skills in row 1 and Skeleton
  Mastery requires Raise Skeleton, so the edge is horizontal. The invariant is
  that no edge runs *upward*.
- "A skill whose slug ends in `-mastery` takes no prerequisite." Skeleton
  Mastery requires Raise Skeleton and Golem Mastery requires Clay Golem, both
  at or below their own unlock level. The suffix was a proxy for a real defect
  (an early draft chained the Sorceress's masteries behind their damage skills);
  it is replaced by the invariant it was reaching for — no prerequisite unlocks
  after the skill that needs it — plus a named control on the three Sorceress
  masteries, which the general rule would not catch.

### 4. Corpse Explosion does not read the corpse

The class page said the damage was "based on the exploded corpse's maximum
life". The reference implementation looks up the monster **type's** life range
in the game's own table, at that monster's level and difficulty, and averages
it. Consequences, each of which changes how the skill is played:

- Player count does not raise it.
- Champion, Unique and Super Unique bonuses do not raise it.
- A corpse whose monster level exceeds the character's level scales the damage
  down by character level over monster level. That is the only level
  interaction, and it is a penalty rather than a bonus.

The 70–120% band, the 50/50 physical–fire split and the radius parameters are
the skill's own columns.

### 5. Radius is two units, and a third convention exists

| Source | Corpse Explosion at level 1 |
| --- | --- |
| Game columns | `8`, in parameters named "Explosion Radius (half squares)" |
| Reference implementation | halves it — an effective radius of 4 |
| The Arreat Summit | "2.6 yards", which is the same parameter divided by 3 |

Curses' radius parameters are named only "Radius" and the engine uses them as
they stand, with no halving. So no shared conversion is applied to the two, and
the site publishes the parameter with the halving stated rather than asserting
a distance in yards.

## Cross-checking against a source that is not the extraction

The Arreat Summit documents patch 1.11 and was written from the game rather than
from `skills.json`, which makes it the one thing available here that is
genuinely independent of the file this repository parses.

**37 values agree exactly**, and they cover the whole pipeline: Teeth's damage
at both ends of its table (2–4 and 23–31, proving the five damage bands and the
HitShift divisor), Poison Dagger's 7–15 growing to 540–581 over 2 to 9.6 seconds
(proving the poison duration multiply), eleven mana costs across every shape the
`manashift` produces including Bone Prison's falling one, and the minion count
at levels 2, 3 and 4 where the piecewise formula bends.

**10 values disagree**, all of them in the bone and poison trees:

| Claim | Pinned 3.3 tables | 1.11 documentation |
| --- | --- | --- |
| Bone Armor absorbed, level 20 | 305 | 210 |
| Bone Spear damage, level 1 min | 16 | 17 |
| Bone Spear damage, level 20 max | 204 | 218 |
| Bone Spirit damage, level 1 min | 20 | 22 |
| Bone Spirit damage, level 20 max | 369 | 413 |
| Bone Spear / Bone Spirit synergies | +8% per level | +7% / +6% per level |
| Poison Explosion damage, level 1 min | 25 | 28 |
| Poison Explosion damage, level 20 max | 1410 | 1620 |
| Poison Nova damage, level 1 min | 50 | 52 |
| Poison Nova damage, level 20 max | 440 | 468 |
| Corpse Explosion radius, level 20 | 27 (half squares) | 9 (yards) |

The site publishes the extraction. The pattern is consistent with D2R's
rebalancing of the bone tree — lower base damage against higher synergies — and
Teeth agreeing exactly is what rules out an error in how the columns are read.
The Corpse Explosion row is a unit disagreement rather than a value one.

All ten are pinned **in both directions** by `checkPublishedNumbers`: one rule
catches the site drifting off Tier 1, and the other catches a future author
reading the older source, deciding the site is wrong, and "correcting" 305 back
to 210.

## Decisions taken

| Decision | Reason |
| --- | --- |
| Tree order is Summoning, Poison and Bone, Curses | The public order. The game's `SkillPage` numbers them the other way; `order` drives the reader and `page` stays as extracted. |
| Golem slugs are `blood-golem`, `iron-golem`, `fire-golem` | The identifiers are `BloodGolem` etc. and would slugify to `bloodgolem`. Registered in `SLUG_OVERRIDES` for provenance; a gate asserts none reaches a page, a URL or the sitemap. |
| `corpse-life` is its own damage model | Reusing `proportional` prints Static Field's sentence — current life, difficulty floors — where every clause is false. Falling through to `none` announced that the skill dealt no damage. |
| Diminishing curves publish a floor and a ceiling | The `dmNN` columns are evaluated in the engine. Interpolating would draw a line the game does not; `effectAtLevel` returns nothing for them. |
| Mana is extracted for the Necromancer only | Moving the other three classes onto extraction rewrites ninety nodes and deserves its own diff. |
| `magnitude` is emitted only for source-owned coefficients | See "Outstanding" below. |
| No build tiers, no "best build" claims | Out of scope for a foundation, and the curse tree in particular does not have a strongest member. |

## Summons: what was established, and what was not

Established from the tables and the reference implementation of the **legacy**
engine, named as such on the page:

- Minion stats are written at creation and are not recalculated. Re-raising is
  the only way to collect a skill or gear change.
- Skeletons and skeletal mages have separate caps, eight each at twenty hard
  points, from `(lvl < 4) ? lvl : (2 + lvl/3)` — corroborated level by level.
- One golem across all four skills: they share a pet type with `petmax = 1`.
- Revive's count is the effective skill level, it lasts 4500 frames flat, its
  life is re-rolled from the monster type's table, and a monster above your
  character level is scaled down.
- Summon Resist is applied to skeletons, mages and golems and **not** to
  revives, and it does not overwrite an element the minion already absorbs.
- Each minion inherits the caster's immunity-piercing stats, and which
  immunities differ per minion.

**Not established, and listed on the page rather than answered:**

1. Whether minions take the −40 / −100 difficulty resistance penalty.
2. Whether a Skill Shrine's bonus survives on minions raised under it.
3. When an Iron Golem persists between games, and what loses one.
4. Minion life and damage per difficulty for the current build.
5. Behaviour against the Uber bosses.

Because (3) is open, the site does **not** recommend building an Iron Golem from
an expensive item, and a gate fails if any page starts to.

## Blocked work

> **Unblocked 2026-09-03.** Every item below was answered or scoped by the
> builds pass; see [`05-necromancer-builds.md`](05-necromancer-builds.md). Four
> of the five open summons questions were settled from `monstats.json`, which
> this pass had not decoded, and the fifth — the Ubers — is answered as far as
> the `primeevil` flag goes and left open for the multiplier and the fight. The
> list is kept as written so the record shows what was blocking and why.

The three approved builds — `summoner-necromancer`, `poison-nova-necromancer`,
`bone-spear-necromancer` — and the Summoner levelling journey need the following
first:

- **Minion life and damage per difficulty.** A Summoner's whole argument is that
  the army survives; without per-difficulty figures the build page cannot say
  when it stops.
- **The difficulty resistance penalty question**, which decides how many points
  Summon Resist is worth and therefore the shape of the point plan.
- **Iron Golem persistence**, which decides whether the golem is a gear slot or
  a consumable.
- **Necromancer items** — Shrunken Heads, Marrowwalk, Trang-Oul's, Homunculus,
  Arm of King Leoric — none of which are in the item catalogue yet, so no gear
  progression can be written.
- **Whether the fire half of Corpse Explosion takes fire-skill modifiers**,
  which decides whether a Fire Golem or +Fire Skills belongs anywhere near a
  Summoner's gear.
- **The Uber question**, for the Iron Maiden section every Necromancer build
  page will want.

## Related research

- [`00-game-state.md`](00-game-state.md) — version baseline and class coverage.
- [`03-amazon-builds.md`](03-amazon-builds.md) — the pass that moved item
  numbers to Tier 1 and set the precedent for a control set.
- [`05-necromancer-builds.md`](05-necromancer-builds.md) — the pass that
  answered four of the five summons questions above, and the three builds,
  journey and dependency pages they were blocking.
