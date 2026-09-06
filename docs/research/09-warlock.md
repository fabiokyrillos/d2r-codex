# Warlock — foundation notes, the thirty skills, and what is not established

**Researched:** 2026-09-06
**Applies to:** D2R Patch 3.3 / Ladder Season 15, *Reign of the Warlock* DLC
**Phase:** 1 of 5. This document covers the trees and the thirty skills only.
Builds, journey and controls are later phases and are not started here.

Everything below is Tier 1 from the pinned extraction unless it says otherwise.
The pin is the one the whole site already uses:

```
blizzhackers/d2data @ fc469993502d0498809b9fc1af140ee2a9eb8902
2026-08-21, "Updated for patch 3.3.93847"
```

---

## 1. The skill tables are Tier 1, and this is the argument

`docs/research/00-game-state.md` carries an instruction not to publish Warlock
skill numbers, on the grounds that "Blizzard's announcement is prose, not a
skill table". That was true of the announcement. It is not true of the pin.

`json/skills.json` at the pinned commit carries **exactly thirty rows with
`charclass = "war"`**, `*Id` 373 through 402 — appended after the 373 rows of
the pre-expansion table, in one contiguous block. Every one of them has the same
ninety columns the other 210 class rows have: `reqlevel`, `maxlvl`, `reqskill1`,
`reqskill2`, the twelve `Param` columns with Blizzard's own descriptions beside
them, the elemental damage tables, the synergy calc columns.

That is the same file, the same commit and the same columns that the attributes
exception already rests on. So the boundary that document draws — *attributes
published because verified, skills unverified and unpublished* — has moved: the
skills are verified by exactly the argument the attributes were.

Two independent checks that the block is the real class and not a fragment:

- **`json/base/skills.json` has zero `war` rows.** That file is the second
  extraction the generator reads, and it is the pre-expansion baseline. The
  Warlock exists in one and not the other, which is what a class added by an
  expansion looks like and is not what a mod or a stale PTR dump looks like.
- **Exactly thirty, in three pages of ten.** `generate-skill-graph.ts` asserts
  `classes × 30`; the Warlock satisfies it without special-casing.

What is *not* Tier 1, and is not published: a single word of the game's own
descriptive prose. `docs/sources/README.md` records that the `str name` /
`str long` tables are never extracted and never shipped, and every sentence on
the Warlock pages is written here, as it is for the other seven classes.

The proper nouns are a different matter, and §3 is the correction that says so.
Skill and tree *names* are read from `str name` and published as the game shows
them — that is what the eighteen existing `SLUG_OVERRIDES` do, and the first pass
of this document got eight Warlock names wrong by not doing it.

---

## 2. The three trees, and where the split comes from

The split is derived from `skilldesc.json`'s `SkillPage`, joined on the
`skilldesc` key — never from the names. Names would have got it wrong: "Cleave"
sits in the weapon tree and "Blood Boil" in the demon tree, and either could
have been guessed the other way.

| `SkillPage` | Tree slug | Name | The ten it holds |
| --- | --- | --- | --- |
| 1 | `demon` | Demon | Summon Goatman, Demonic Mastery, Death Mark, Summon Tainted, Summon Defiler, Blood Oath, Engorge, Blood Boil, Consume, Bind Demon |
| 2 | `eldritch` | Eldritch | Levitation Mastery, Cleave, Echoing Strike, Blade Warp, Mirrored Blades, Hex: Bane, Hex: Purge, Hex: Siphon, Psychic Ward, Eldritch Blast |
| 3 | `chaos` | Chaos | Miasma Bolt, Ring of Fire, Sigil: Lethargy, Miasma Chain, Sigil: Rancor, Flame Wave, Sigil: Death, Enhanced Entropy, Apocalypse, Abyss |

Named as the game names them, which is not always how the table spells them —
see §3 for the eight rows where the two differ.

The three slugs are not this document's choice. `content/classes/classes.ts`
already publishes `trees: ["demon", "eldritch", "chaos"]` for the Warlock, and
the generator throws `page war:N maps to two authored trees` if a page is split
across two of them. The mapping above is the one the authored file uses.

`order` is 1, 2, 3, matching the pages. The Necromancer's trees are ordered
against their pages because the game numbers that class's UI the other way; no
such conflict exists here, and Blizzard's announcement lists the three in the
same order the pages do.

**"Chaos" is overloaded on this site.** The tree slug `chaos` is unrelated to
the *Chaos* runeword (`Fal Ohm Um`, claws) that the Assassin pages reference.
Prose on Warlock pages says "the Chaos tree" rather than "Chaos" alone.

### Tree names — Tier 1, not the announcement

The first pass took the three names from Blizzard's announcement, because the
tree captions were assumed to be out of reach. They are not:

```
SkillCategoryWa1  "Demon"
SkillCategoryWa2  "Eldritch"
SkillCategoryWa3  "Chaos"
```

in `json/allstrings-eng.json` at the same pinned commit, in the same series that
gives `SkillCategoryNe2 = "Poison and Bone"` and `SkillCategoryAs3 = "Traps"`.
The three bare nouns are the shipped captions, not a house choice, and the
announcement merely happened to agree with them.

Worth noting for anyone copying the pattern: the site is not literal about tree
names everywhere. The Necromancer publishes "Summoning Spells" where the caption
is "Summoning", and the Druid publishes "Elemental Skills" where it is
"Elemental". The Warlock's three are published exactly as shipped.

---

## 3. Names and slugs: eight gaps, two of which move a slug

**This section replaces a wrong finding, and the way it was wrong is the part
worth keeping.**

The first pass reported "no `SLUG_OVERRIDES` needed, zero collisions" on the
strength of two checks: the thirty Warlock slugs against the 198 already on the
site, and against all 240 identifiers across the eight playable classes. Both
checks were run correctly and both results are true. Zero collisions anywhere,
including the six names the brief flagged as plausible — Cleave, Apocalypse,
Ring of Fire, Flame Wave, Levitate and Consume are Warlock names that no other
class has.

**And it was the wrong check.** Collisions govern slug *uniqueness*. What governs
`SLUG_OVERRIDES` is a different rule, and the comment above that table says so
plainly: `Clay Golem`'s spelling is "an artifact of how the rows were typed
rather than anything a player sees", and the Druid's eight are "working titles
the shipped game replaced". The rule is **the site publishes the name the game
shows, and the override lets the identifier stay the join key.** A name can
differ from its identifier and collide with nothing at all — and then a collision
check returns clean while every published name is wrong.

### The rule, checked rather than assumed

Resolved from each row's `skilldesc.json` `str name` key against
`json/allstrings-eng.json` at the same pinned commit. Across the eight playable
classes there are **27 identifier/name gaps**: 18 in the six already-authored
classes, 1 Barbarian (`Pole Arm Mastery` -> "Polearm Mastery"), and 8 Warlock.
**All 18 of the authored ones publish the shipped name. Eighteen for eighteen,
no exceptions.**

### The Warlock's eight

| identifier | `str name` | shipped name | slug |
| --- | --- | --- | --- |
| `Levitate` | `LevitateName` | **Levitation Mastery** | `levitation-mastery` — **changes** |
| `Miasma Chains` | `MiasmaChainName` | **Miasma Chain** (singular) | `miasma-chain` — **changes** |
| `Hex Bane` | `BaneHexName` | **Hex: Bane** | `hex-bane` — same |
| `Hex Purge` | `PurgeHexName` | **Hex: Purge** | `hex-purge` — same |
| `Hex Siphon` | `SiphonHexName` | **Hex: Siphon** | `hex-siphon` — same |
| `Sigil Lethargy` | `LethargySigilName` | **Sigil: Lethargy** | `sigil-lethargy` — same |
| `Sigil Rancor` | `RancorSigilName` | **Sigil: Rancor** | `sigil-rancor` — same |
| `Sigil Death` | `DeathSigilName` | **Sigil: Death** | `sigil-death` — same |

The other twenty-two rows resolve to their identifier exactly. Note the shape of
the four hex and sigil keys: the game stores them as `BaneHexName` and
`LethargySigilName`, noun last, which is the tell that the shipped name is
`Hex: Bane` rather than `Hex Bane` and is visible in `skilldesc.json` alone.

### Why a collision check cannot find any of this

Six of the eight slugify identically either way, because `": "` and `" "` both
collapse to one hyphen: `slugify("Hex: Bane")` and `slugify("Hex Bane")` are
both `hex-bane`. Those six are **invisible** to every slug-based check the
repository has — uniqueness, collisions, drift — and would have shipped as
"Hex Bane" on six pages with nothing anywhere complaining. The two that do move a
slug are equally invisible, for the same reason: they collide with nothing
either.

**The lesson, stated so it is not re-derived:** a slug check answers "is this
name unique?" and never answers "is this the name?" The second question has
exactly one source — the row's `str name` key resolved against the string table
— and it has to be asked of every row of a new class, not only of rows that look
suspicious. Nothing about `Levitate` looks suspicious. It is a real word, it is
spelled correctly, it describes the skill, and it is not what the game calls it.

One tension to flag rather than resolve, because `docs/sources/README.md` is
coordinator-owned: that file records the `str name` / `str long` tables as "never
extracted, never shipped". The eighteen existing overrides show the rule's intent
is the *descriptive prose* — the long descriptions this site always writes itself
— and not proper nouns, which the site publishes everywhere. The wording is worth
tightening so the next class does not read it as a prohibition on the only check
that catches this.

### Two invariants that hold after the correction

- `slug === slugify(published name)` for all thirty, overrides included.
  `slugify("Levitation Mastery")` is `levitation-mastery` and `slugify("Hex:
  Bane")` is `hex-bane`. The override maps *identifier -> slug*; the published
  name already slugifies to that slug, so the two never have to be reconciled
  again.
- Zero collisions, still. The original check was not wasted, only insufficient.

A near-miss worth recording so nobody re-derives it: the *identifier* is
`Eldritch Blast` with a space, the `skilldesc` key is `eldritchblast` without
one, and the shipped name is "Eldritch Blast". Three spellings, one slug, no
override needed.

Throughout the rest of this document, a row is referred to by its **identifier**
when the subject is a column or an expression in the extraction, and by its
**shipped name** when the subject is what the site publishes. `Levitate` is the
row; Levitation Mastery is the skill.

---

## 4. Class mechanics

### 4.1 Levitation, and the column that carries it

The class passive is a skill: **Levitation Mastery** — the row `Levitate` —
page 2, row 1, column 1, level 1, no prerequisite, `passive = 1`. Its row is a weapon mastery in the same shape as
the Barbarian's, with one column that is not:

```
passiveitype           weap
passivereqweaponcount  1
passivestat1  passive_mastery_melee_crit          dm12   0% -> 35% ceiling
passivestat2  passive_mastery_item_req_percent    -1*min(ln78,50)   -2% -2%/lvl, floor -50%
passivestat3  passive_mastery_melee_th            ln56   +40% +5%/lvl
passivestat4  passive_mastery_melee_dmg           ln34   +25% +4%/lvl
```

`passivereqweaponcount = 1` is the levitation rule as the tables express it: the
mastery pays while **exactly one weapon** is equipped, and it is indifferent to
whether that weapon is one-handed or two-handed. Nothing in this row says a
two-handed weapon frees the off-hand — that claim is Blizzard's, from the
announcement, and is already published on the class page. What the row does
establish is that the mastery is not a one-hand mastery: the Warlock's damage
passive does not care about hand count, which is the mechanical half of the same
statement and is the half that can be checked here.

The `-50%` requirements floor is worth flagging early for the build phases: a
Warlock at high Levitate pays half the listed Strength and Dexterity for his
weapon, which changes attribute planning materially.

### 4.2 Grimoires

Confirmed against `itemtypes.json` and `armor.json`, and the game-state
document's table is correct in every cell.

```
itemtypes:  Grimoire   code grim   Class war   Equiv1 shld   Equiv2 warl
            bodyloc rarm/larm      StorePage armo
            Warlock Item  code warl  (the class-restriction parent)
```

A Grimoire is a **shield-equivalent off-hand restricted to the Warlock** — the
same construction as the Necromancer's Shrunken Head (`head`, equiv `shld` +
`necr`). All fifteen bases carry `gemsockets = 2`.

| Normal | Exceptional | Elite | Block | Sockets |
| --- | --- | --- | --- | --- |
| Old Book (wa1) | Burnt Text (wa6) | Forgotten Volume (wab) | 3 | 2 |
| Tome (wa2) | Dark Tome (wa7) | Occult Tome (wac) | 5 | 2 |
| Codex (wa3) | Dark Codex (wa8) | Occult Codex (wad) | 8 | 2 |
| Compendium (wa4) | Possessed Compendium (wa9) | Blasphemous Compendium (wae) | 10 | 2 |
| Grimoire (wa5) | Possessed Grimoire (waa) | Blasphemous Grimoire (waf) | 12 | 2 |

The `normcode`/`ubercode`/`ultracode` chain on every row confirms the upgrade
path, so the five families are pinned rather than inferred from the names. This
closes the *Reign of the Warlock* Grimoire table against Tier 1.

**Not established here:** the inherent Fire-or-Magic weapon damage affix. That
is an `automagic`-style roll and lives outside `armor.json`; it is Tier 2 from
the announcement and is not this phase's file. Item content is not owned by this
agent and no number for it is published.

### 4.3 Demons: the cap, and the two pools

All three summons carry `pettype = demon` and the identical

```
petmax = (skill('Demonic Mastery'.blvl)>=10)?3:((skill('Demonic Mastery'.blvl)>=5)?2:1)
```

`petmax` is evaluated per **pet type**, not per skill — the site already
publishes that reasoning for the Necromancer, whose four golem skills "share a
single pet type with a maximum of one". So the Warlock's cap is **one demon
total**, rising to two at 5 hard points in Demonic Mastery and three at 10 —
across Goatmen, Tainted and Defilers together, not one of each.

Two independent rows corroborate the ceiling: Death Mark's `calc2` and Blood
Oath's `calc2` are both `3`, both described "Max pet count".

**Bind Demon is a separate pool.** Its `pettype` is `binddemon`, not `demon`,
with `petmax = 1`. A Warlock at ten points of Demonic Mastery can therefore hold
three summoned demons *and* one bound demon. This is the single most
build-relevant fact in the tree and it falls straight out of two columns.

The three summon rows in `monstats.json` are `wargoatman`, `warbighead`
(display name "Tainted") and `warputriddefiler`, all `Align 1`, all
`AI = GenericPet`.

### 4.4 Hexes are on-hit, not cast

The four hex-family rows — Hex Bane, Hex Purge, Hex Siphon, and Eldritch Blast,
which re-applies Hex Bane's debuff — install their effect through
`auraevent`/`auraeventfunc` pairs on `domeleeattack`, `domissiledamage` and a
`hextrigger` event, not through a cast. Three of the four also carry
`requiresweapon = 1` with `itypea1 = weap` and `etypea1 = h2h` — any weapon
**except** hand-to-hand. This is not a Necromancer curse tree and should never be
described as one: a hex is applied by hitting something with a weapon.

Hex Bane additionally writes `magicmindam` / `magicmaxdam` onto the character
from its own rolled range (`passivecalc1 = enma`, `passivecalc2 = exma`), which
is why it functions as a weapon imbue as well as a debuff.

### 4.5 Sigils are placed, tiered objects

The three sigils share `srvdofunc 157`, `progressive = 1`, three missile sizes,
and

```
prgcalc1      (lvl >= 20)?3:((lvl>=10)?2:1)      which of the three sizes
aurarangecalc (lvl >= 20)?8:((lvl>=10)?6:4)      radius
```

so a sigil steps at hard points **10 and 20** and nowhere else. Nothing between
those thresholds changes the footprint.

### 4.6 One Chaos spell runs on attack rate

`Miasma Chains` carries `UseAttackRate = 1`. No other Chaos-tree skill does.
Its animation therefore follows the attack rate rather than the cast rate. What
this means for a Faster Cast Rate breakpoint on that one skill is **not
established** and is not published; the column is stated and stops there.

---

## 5. Damage models, and the two rows that will stop the generator

### 5.1 Which skills need a `damageModel`

`unclassifiedElementalAttacks` (in `lib/skills.ts`) requires a `damageModel` on
any skill with `kind === "attack"` whose graph node carries `damage` or
`conversion`. Four Warlock rows are attacks with an elemental table:

| Skill | `SrcDam` | Table | Model | Why |
| --- | --- | --- | --- | --- |
| Hex: Bane | — | mag 9-16 | `weapon-plus-element` | `ToHit 20 / LevToHit 9`, `requiresweapon`; the magic range is also written onto the weapon as flat magic damage |
| Hex: Purge | — | mag 10-15 | `weapon-plus-element` | same shape: a weapon swing that rolls attack rating and adds magic |
| Blade Warp | **absent** | mag 8-10 | `element-only-attack` | see below |
| Mirrored Blades | 128 | *none* | *none needed* | no elemental table; plain weapon damage |

Cleave (`SrcDam 128`), Hex: Siphon and Echoing Strike are attacks with no
elemental table and need no model.

### 5.2 Blade Warp, and why `element-only-attack` rather than a refusal

`lib/types/class.ts` warns that Charged Strike and Lightning Strike are
indistinguishable in the columns and are told apart by the server stage each
runs. Blade Warp is the same *kind* of question, and it has an answer the
javelin pair does not:

Three Warlock skills share `srvdofunc = 166` — Echoing Strike, Blade Warp and
Mirrored Blades. Two of them declare a weapon share explicitly (`SrcDam` 116 and
128). Blade Warp declares none, and its `calc1` ("Damage %") and `calc2` ("Flat
Damage") are both literal `0`. Under one function, with two siblings that fill
the column and one that empties it, the empty column is a deliberate zero rather
than an ambiguity.

So the magic table is published as the whole of Blade Warp's damage, and the
skill's page says so. **If a future extraction gives Blade Warp a `SrcDam`, this
classification is the thing that changes**, and the skill carries
`confidence: "single"` for that reason rather than `"verified"`.

### 5.3 Two rows that make `gen:skill-graph` throw

`assertPhysicalClassified` refuses any in-scope row carrying `MinDam`/`MaxDam`
that appears in neither `PUBLISHES_PHYSICAL` nor `PHYSICAL_IS_NOT_THE_SKILLS_OWN`.
Two Warlock rows carry those columns, and **neither list mentions them**, so
adding `war` to `classOf` without touching the generator stops it dead. Both are
in `docs/proposals/warlock-1-wire-skills.md` with the diff.

**Echoing Strike** — `MinDam 8 / MaxDam 12` with five level bands, `SrcDam 116`,
no `EType`, missile `echoingstrike` with no `EType` of its own. This is exactly
the Assassin blade pattern the existing comment already describes: a flat
physical table *plus* a weapon share, 116/128 ≈ 90.6% here against the blades'
96/128 = 75%. It belongs in `PUBLISHES_PHYSICAL`.

**Blood Boil** — `MinDam 10 / MaxDam 20` and `EType fire` with `EMin 10 /
EMax 20`, and the five level bands are byte-identical between the two tables
(8/10/12/16/20 and 10/12/18/26/30). That is Psychic Hammer's shape, which the
generator excludes as "the same damage twice". It is also Molten Boulder's and
Volcano's shape, which the generator **includes**. The two precedents disagree,
and one column tells them apart:

| Row | Numbers identical | `DmgSymPerCalc` | `EDmgSymPerCalc` | Verdict in the generator today |
| --- | --- | --- | --- | --- |
| Psychic Hammer | yes | — | — | excluded |
| Molten Boulder | yes | `Volcano * par7` | `Firestorm * par8` | **published** |
| Volcano | yes | `Molten Boulder * par7` | `Eruption + Armageddon * par8` | **published** |
| **Blood Boil** | yes | `Engorge * par8` | `Blood Oath * par8` | *unclassified — throws* |

Two damage components fed by two different synergies are two components. One
damage written into two column pairs has no synergy on either. Blood Boil is on
the Molten Boulder side of that line by the only column that separates them, so
the recommendation is `PUBLISHES_PHYSICAL`, and the reason is a rule rather than
a resemblance. **Accepted by the coordinator**, who re-derived it independently.

One refinement to the argument, which does not move the conclusion and is worth
not overstating later: Molten Boulder and Volcano carry **two separately
labelled parameters** ("Physical Damage synergy" and "Fire Damage synergy"),
where Blood Boil has a single `par8` labelled only "Damage synergy" and read by
both expressions. So it is the distinct **donors** that carry the argument —
`Engorge` into the physical and `Blood Oath` into the fire — and not the labels.
Psychic Hammer is excluded because it has no donor on either side at all, which
is a stronger statement than "no label".

Cross-agent note for the coordinator: adding `bar` to `classOf` will hit the
same guard on **Leap Attack** (`MinDam 10/20`, `SrcDam 128`) and **War Cry**
(`MinDam 30/40`). Those are Agent B's rows, not this one's, but they are in the
same single generator run.

---

## 6. Synergies: three throws and six silent drops

`synergiesFor` was run against all thirty Warlock rows in isolation, before
anything was authored, precisely so the coordinator's generator run would not be
the first place these surfaced. Twenty-seven rows pass. Three throw, and six
edges disappear without throwing — which is worse.

### 6.1 Three unknown synergy kinds — hard failures

`SYNERGY_KINDS` throws on an unrecognised label rather than defaulting. Three
Warlock labels are not in it. The keys below are what the existing normaliser
(`described.replace(/\s*synergy\s*/i, "").trim().toLowerCase()`) actually
produces, double space included:

| Row | Param | Raw description | Key produced | Suggested kind |
| --- | --- | --- | --- | --- |
| Eldritch Blast | 4 | `Synergy Duration per level  (psychic ward)` | `duration per level  (psychic ward)` | `duration` |
| Hex Purge | 2 | `Debuff Duration synergy` | `debuff duration` | `duration` |
| Hex Siphon | 9 | `life/mana steal synergy` | `life/mana steal` | new kind — `steal` |

`buff duration` is already in the table and maps to `duration`; `debuff duration`
is its mirror. The third is a genuinely new kind and should not be folded into an
existing one — Hex Siphon's heal-after-kill and mana-after-kill are neither
damage nor duration, and the table exists to stop exactly that kind of quiet
mislabelling.

### 6.2 Six edges the generator drops in silence

Two shapes appear in the Warlock rows and in no other class, and neither throws.
Both simply produce `governing.length === 0` and `continue`.

**The `paNN` short form.** `PAR_REF` is `/par(\d+)/g` and `DONOR_PAR_REF` is
`/skill\('([^']+)'\.par(\d+)\)/g`. Neither matches `pa10`, `pa11` or `pa12`.
Five expressions in the extraction use that form. Four are Warlock and are the
four that matter, because they are the four that name a donor skill:

```
Hex Bane   EDmgSymPerCalc  (skill('Consume'.blvl)*pa10)+(skill('Hex Purge'.blvl)*pa10)+(skill('Mirrored Blades'.blvl)*pa10)
Hex Purge  calc2           (ln21+(skill('Sigil Death'.blvl) *pa10)) / 100
Engorge    aurastatcalc5   (skill('Blood Oath'.blvl)*skill('Blood Oath'.pa11))
Engorge    aurastatcalc6   (skill('Blood Oath'.pa12)*skill('Blood Oath'.blvl))
```

There is a fifth occurrence of the short form, missed on the first pass and
supplied by the coordinator: `bar` Throwing Mastery's `passivecalc6 = pa11`. It
carries no `skill()` donor, so it creates no edge and is unaffected either way —
but "four" was wrong and the count is five.

**The `Param10` description column is spelled differently.** It is named
`*Param10 Description2`, with a trailing `2`, where 1-9 and 11-12 are
`*ParamN Description`. `readParam` reads `*Param${index} Description`, so a
`Param10` described as a synergy can never be seen.

Two counts make the shape of a fix clear, and both were measured rather than
assumed:

- **`*Param10 Description` — the spelling the generator looks for — exists on
  zero rows in the whole file.** That lookup has never succeeded for any class.
- **`*Param10 Description2` exists on 13 rows: 1 Barbarian, 11 Warlock, and one
  non-class row.** So reading the second spelling cannot disturb any of the 180
  nodes already published; there is no row among the six authored classes for it
  to reach.

All six `Param10`-and-above synergy descriptions in the entire eight-class
extraction are Warlock rows:

| Row | Param | Description | Value |
| --- | --- | --- | --- |
| Hex Bane | 10 | Hex Purge Damage synergy | 35 |
| Hex Purge | 10 | Chance to Explode Synergy | 100 |
| Hex Siphon | 10 | Damage% synergy | 1 |
| Echoing Strike | 10 | Mirrored Blade Projectile Count Synergy | 1 |
| Cleave | 10 | Mirrored Blades Synergy for degrees arc increased | 12 |
| Blood Oath | 11 | Synergy Defense per level with Demonic Mastery | 25 |

The edges lost to the two gaps together are Hex Bane ← Consume / Hex Purge /
Mirrored Blades, Hex Purge ← Sigil Death, and Engorge ← Blood Oath. Six edges,
none of which raises anything.

This is a repository whose generator is built to stop rather than guess. Here it
neither stops nor guesses — it drops. The proposal asks the coordinator to decide
between teaching the two regexes the short form and reading both spellings of the
description column, or recording the omission deliberately. It is not this
agent's file and the graph must not be hand-edited, so nothing was changed.

**No skill's authored `synergies` array names an edge from this section.** The
authored magnitudes are only for edges the generator emits today, so
`check:content`'s "synergy the graph recognises" rule holds either way, and
nothing has to be rewritten if the coordinator declines the change.

---

## 7. Two claims already published that this phase touched

### 7.1 "Bind Demon was nerfed as recently as Patch 3.3" — NOT CORROBORATED

`content/classes/classes.ts` line 347 lists this among the Warlock's weaknesses.
Nothing reachable from this worktree supports it, and three things point the
other way:

1. **The pin cannot show it.** `skills.json` at `fc46999` is a single snapshot
   *of* 3.3. A value in a snapshot is not a change.
2. **There is no before.** `json/base/skills.json` — the second extraction the
   generator reads, and the only historical comparison the repository has — holds
   **zero** `war` rows. There is no in-repo before/after pair for any Warlock
   skill, so no Warlock nerf is derivable here at all.
3. **The site's own registry does not claim it.** `docs/sources/README.md` lists
   the Patch 3.3 / Season 15 notes as the source for Terror Zone tuning, Latent
   Sunder Charm changes and the ladder→non-ladder migration. Skill balance is not
   among them, and no file in `content/` cites a Warlock skill change.

Bind Demon's row does carry values a nerf could plausibly have touched
(`petmax = 1`; `Param4 = 64`, "Cap for % capture"), but that is a shape, not
evidence. **Recommendation:** cite the specific patch-note line or soften the
bullet to something the site can stand behind — the surrounding claim, that the
class is young and actively balanced, needs no specific nerf to be true. Flagged
to the coordinator; `classes.ts` is coordinator-owned and was not edited.

External verification was attempted and is not available: web access is not
reachable from this agent's tool set, so no Tier 2 patch-note fetch was possible.
This is recorded so the next cycle does not assume it was checked and failed.

### 7.2 Open question 10 is closed, and closed against its own prediction

`00-game-state.md` open question 10 reads "Whether Warlock has its own FCR/FHR
breakpoint table (near-certain that it does)". It does not, and the site already
says so. `content/breakpoints/breakpoints.ts` publishes, all at
`confidence: "verified"`:

- `fcr-paladin-necromancer-warlock` — the Warlock shares the Paladin and
  Necromancer Faster Cast Rate table (0/9/18/30/48/75/125).
- `fhr-necromancer-druid-warlock` — shares the Necromancer and Druid Faster Hit
  Recovery table.
- `fbr-necromancer-druid-warlock` — shares the same two for Faster Block Rate.

The prediction in the question is wrong, and the guidance line on the FCR entry
already draws the useful consequence: existing Paladin and Necromancer gear
advice transfers to the new class. Breakpoints are not a Warlock-owned file and
the numbers were not re-derived here; the question should be marked closed with a
pointer to that file, and the parenthetical prediction struck rather than left to
mislead the next reader.

---

## 8. Sources rejected

No community Warlock guide was used, quoted or consulted for any number in this
phase, and the reason is structural rather than cautious: **every number
published came out of the pinned extraction**, so a secondary source could only
have corroborated or contradicted, and none was needed to author.

The rule applied to anything encountered describing this class: the thirty
identifiers in §2 are the whole of it. Any source describing a Warlock skill not
on that list is describing something else — a mod, a datamined build that did not
ship, or another game — and is discarded rather than reconciled. This is the
first filter to run on any Warlock source, and it is cheap: the list is thirty
names long.

Three inferences that were deliberately **not** made, because the classes they
would borrow from are different classes:

- Not from the Necromancer. The Warlock's demons are capped by pet *type* the way
  golems are, and that reasoning was reused — but the Necromancer's corpse
  economy, his curse-replacement rule, and his summon mechanics have no bearing
  here, and nothing in §4 rests on them. Hexes in particular are on-hit and are
  not curses (§4.4).
- Not from the Sorceress. "Apocalypse" is a Warlock skill; there is no Sorceress
  skill of that name in the extraction, and no Sorceress fire mechanic was
  carried across.
- Not from any modded class. Checked structurally rather than by reputation: the
  thirty rows sit at `*Id` 373-402 in the shipped table, immediately after the
  373 base rows, with `charclass = "war"` — which a mod's added rows would not do
  in the vendor extraction the site pins.

---

## 9. Six things NOT ESTABLISHED, which the pages say rather than guess

1. **Whether Sigil Lethargy's third line lowers defence or damage.** The stat is
   `item_armor_percent`; the parameter pair it reads (`par5 = -33`, `par6 = -1`)
   is described "Damage Dealt %" and "Damage Dealt % per level". The stat and the
   label disagree and nothing in the row settles it. The two lines that *do*
   agree — `attackrate` and `velocitypercent`, both `ln78` = a flat −50% — are
   published; the third is described and not quantified.
   The same row's `Param3`/`Param4` ("Damage Resistance %", 20 and 1) are read by
   no expression in the row at all.
2. **Whether Sigil Rancor's damage and attack-speed bonus lands on the monsters
   or on the Warlock.** `aurastat1 = damagepercent` (+50%, +5%/level) and
   `aurastat2 = attackrate` (+5%, +1%/level) are unambiguous magnitudes with no
   column naming the recipient. `aurafilter = 2` against Sigil Lethargy's `3`
   distinguishes them but is a bitfield this site has not decoded anywhere else,
   so it is not used as evidence. `calc1 = 75`, "Chance to confuse ai", is
   published because it is labelled.
3. **Whether Hex Siphon's damage reduction grows with level.** `aurastatcalc1` is
   the literal `-33`. `Param11 = 33` ("damage % baseline") and `Param12 = 3`
   ("damage % steal per level") describe growth and are read by no expression in
   the row. The flat −33% is published; the growth is not.
4. **Whether Blade Warp carries any weapon damage.** Argued in §5.2 and resolved
   *for publication* as `element-only-attack`, on the strength of two siblings
   under the same server function that fill `SrcDam` where it is empty. The
   argument is good and it is still an argument; the skill carries
   `confidence: "single"` and the page says the magic table is the whole of it.
5. **What Faster Cast Rate does for Miasma Chains.** `UseAttackRate = 1` is
   stated. Nothing is published about a breakpoint for that skill.
6. **The unit of Abyss's ground fire.** `Param3 = 2`, "Duration of ground fire
   baseline", with no unit named and `Param4 = 0` per level. The value is not
   published as seconds, frames or anything else.

A seventh case is the same shape and is handled inline on the pages rather than
listed above, because it is one pattern rather than six findings: **four rows
carry a radius parameter that the expression beside it overrides or ignores.**
Hex Purge's `aurarangecalc` is `par7/100` — a flat 4 — while `Param8` ("Radius
per level * 100", 33) is read by nothing. All three sigils carry a `Radius`
parameter of 7 that the stepped `(lvl >= 20) ? 8 : ((lvl >= 10) ? 6 : 4)`
expression overrides. In every case the expression is published and the
parameter is not.

One further gap that is not a mechanic: **Mirrored Blades' `DmgSymPerCalc` reads
`par8`, and that row has no `Param8`.** The expression
`(skill('Blade Warp'.blvl)+skill('Echoing Strike'.blvl))*par8` therefore
multiplies by a parameter that does not exist. The generator's own guard passes
it (the missing parameter is the receiver's own, not a donor's) and emits no
edge. Recorded as a probable upstream data defect; nothing is published about a
Mirrored Blades damage synergy in either direction.

---

## 10. What Phase 1 hands over

- `content/classes/warlock/skills.ts` — `warlockTrees` (3) and `warlockSkills`
  (30), every one carrying `release: "reign-of-the-warlock"`.
- `content/classes/warlock/pt-br.ts` — `warlockTreesPtBr` and
  `warlockSkillsPtBr`. Names stay English per ADR 0003.
- `docs/proposals/warlock-1-wire-skills.md` — every shared-file line the
  coordinator must add, including the two `PUBLISHES_PHYSICAL` entries and the
  three `SYNERGY_KINDS` entries **without which `gen:skill-graph` throws**, and
  the two `SLUG_OVERRIDES` entries from §3.

Two `SLUG_OVERRIDES` entries are needed — `"Levitate": "levitation-mastery"` and
`"Miasma Chains": "miasma-chain"` — which is a correction of what this document
said on its first pass; §3 is the whole story. No proposal for a new
`damageModel` (§5.1: the existing seven cover all four cases).

Phases 2-5 do not start until the graph exists.
