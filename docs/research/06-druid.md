# The Druid — foundation, builds and the fire-to-wind route

**Researched:** 2026-09-04
**Baseline:** D2R Patch 3.3 / Ladder Season 15 — see [`00-game-state.md`](00-game-state.md)
**Status:** Executed. Thirty skills with pages, two builds, one journey.

---

## 0. What this pass added

| Thing | Where |
| --- | --- |
| Three trees, thirty skills, bilingual | `content/classes/druid/skills.ts`, `content/classes/skills-pt-br.ts` |
| The generated graph, extended to five classes | `content/classes/skill-graph.ts` |
| A **physical** damage table in the graph | `scripts/generate-skill-graph.ts`, `lib/skills.ts` |
| Wind Druid, Fire Druid | `content/builds/wind-druid.ts`, `content/builds/fire-druid.ts` |
| The fire-to-wind journey | `content/progression/druid-journey.ts` |

---

## 1. The extraction, and the four things it forced

Everything structural came from the same pinned commit the other four classes
use: `blizzhackers/d2data` at `fc469993502d0498809b9fc1af140ee2a9eb8902`
(2026-08-21, "Updated for patch 3.3.93847"). Adding `dru` to the generator's
`classOf` produced 150 nodes with 170 synergy edges, and `graph-drift` reports
**all 90 baseline nodes byte-identical, 60 added**.

Four things in the Druid's rows had no precedent in the four classes already in
scope, and each one is a decision recorded in code rather than a value typed in.

### 1.1 Skills that deal physical damage

The Druid is the first class in scope whose skills carry `MinDam`/`MaxDam`.
Tornado and Twister carry **nothing else** — no `EType`, no `EMin` — so a graph
reading only the elemental columns publishes an empty damage table for the
class's best skill. Molten Boulder, Volcano and Armageddon carry both at once,
and the game synergises them separately.

The formula is the same as elemental, and that is checkable rather than assumed:

| Skill | `MinDam`-`MaxDam` | `HitShift` | Published at level 1 |
| --- | --- | --- | --- |
| Tornado | 25-35 | 8 | 25-35 |
| Twister | 12-16 | 7 | 6-8 |
| Armageddon | 18-26 | 8 | 18-26 (plus 25-75 fire) |

**Which rows publish one is an allow-list**, because these columns mean four
different things across the rows now in scope:

| Meaning | Example | Published? |
| --- | --- | --- |
| The skill's own damage | Tornado 25-35 | Yes |
| A minion's damage per hit | Raven 2-4, Grizzly 30-60 | No — minion numbers are prose, as they are for the Necromancer |
| A bonus written onto another skill | Holy Shield 3-6, which is added to Smite | No |
| Not a range at all | Spirit of Barbs' 32, the damage-return share — the row has **no `MaxDam` whatsoever** | No |

Magic Arrow is excluded by rule rather than by name: its missile declares
`EType = mag`, so those columns are delivered as magic and the site already
models the skill as `weapon-converted-to-element`.
`assertPhysicalClassified` stops the generator on any in-scope row carrying both
columns that appears in neither list.

### 1.2 The wolves buff each other through *soft* levels

`SOFT_LEVEL_SYNERGIES` was written for Revive with a comment saying the Druid's
summons would arrive in the same shape. They did. Summon Dire Wolf raises the
Spirit Wolf's life, the Grizzly raises both wolves' damage, and every one of
those expressions reads `skill('X'.lvl)` — the **effective** level, which
+skills gear raises — under a parameter the game labels "(also used for
synergy)".

That is the opposite of a synergy, and drawing it as an edge would tell a reader
to spend hard points that a Ravenlore or a +3 Summoning pelt buys more cheaply.
The three summons are listed, and the relationships are on the skill pages in
prose.

> This also disarmed a control. `synergy-param-owner.test.ts` proved that an
> unruled soft-level synergy stops the generator, using **"Summon Grizzly"** as
> the stand-in precisely because that is the shape the Druid's summons were
> expected to arrive in. The moment the Grizzly was listed, the assertion began
> claiming a listed skill was unlisted. The stand-in is now a name no skill can
> have.

### 1.3 Eight skills whose identifier no player has seen

Larger than any other class's gap, so each is pinned by its own row rather than
by resemblance:

| Identifier | Pinned by | Published as |
| --- | --- | --- |
| `Plague Poppy` | page 1, level 1, `pettype = vine`, poison over 100 frames | Poison Creeper |
| `Cycle of Life` | page 1, level 12, requires Plague Poppy, life steal 4% + 1%/level | Carrion Vine |
| `Vines` | page 1, level 24, requires Cycle of Life, mana steal 4% + 1%/level | Solar Creeper |
| `Summon Fenris` | page 1, level 18, `petmax = min(lvl, par3)` with par3 = 3 | Summon Dire Wolf |
| `Wearwolf` | page 2, level 1 | Werewolf |
| `Shape Shifting` | page 2, level 1, requires Wearwolf, no mana cost, grants form duration and life | Lycanthropy |
| `Wearbear` | page 2, level 6 | Werebear |
| `Eruption` | page 3, level 12, requires Molten Boulder | Fissure |

### 1.4 A third `petmax` shape

Raven and both wolves use `min(lvl, parN)` — one per level to a ceiling the row
holds in a parameter (five ravens, five spirit wolves, three dire wolves).
`petMaxFromColumn` reads that parameter rather than transcribing the numbers.

---

## 2. Facts the pages rest on, and where each came from

| Claim | Source | Note |
| --- | --- | --- |
| Hurricane and Armageddon last 250 frames and `Param2 = 0` for duration | Tier 1, `skills.json` | Their own level buys no duration; Cyclone Armor and Fissure buy 50 frames a hard point |
| Tornado's radius 3, periodic delay 15 frames | Tier 1, `Param2`/`Param1` | |
| Cyclone Armor absorbs 40 + 12/level, fire/cold/lightning only | Tier 1, `aurastat1/2 = bonearmor` | |
| Werewolf attack speed 10→80% diminishing; +25% life | Tier 1, `dm34`, `par2` | |
| Lycanthropy +20% life +5%/level, 1000 + 500 frames duration, **no mana cost** | Tier 1 | All three mana columns are zero |
| Werebear +55%/+15% damage, +40%/+10% defence, +75% life, uninterruptible | Tier 1, `par6 = 100`, `skill_concentration` | |
| Fury: 2 hits at level 1, capped at 5 from level 4; +100% +17%/level damage | Tier 1, `min(par5 + lvl - 1, par6)` | |
| **Shock Wave rolls no attack rating** | Tier 1 | It carries neither `ToHit` nor `LevToHit`, where Maul, Fury, Feral Rage, Rabies, Fire Claws and Hunger all carry both. Modelled as `spell`, not `attack`, which is why it needed no new damage model |
| Spirit of Barbs returns 32% at level 1, 347% at level 20 | Tier 1 bands, evaluated with the site's own boundaries | |
| Minions inherit the player's immunity-piercing | Tier 1 **and** Tier 2 | The rows read `stat('item_pierce_damage_immunity'.accr)`; Blizzard's live 2.5 blog states that Sundering Charm abilities "extend to your pets and summons" — a clause absent from the 2.5 PTR article, which is why community guides disagree |
| FCR 0/4/10/19/30/46/68/99/163 human form; werewolf and werebear differ | Already published in `content/breakpoints` | |

### 2.1 What was deliberately not published

- **Werewolf and werebear IAS frame tables.** Blizzard has never published one.
  The de-facto community source is a calculator built against a 2022 PTR build
  whose own repository carries an open issue titled "Fury is wrong". Patch 2.4
  officially raised the shapeshift IAS cap from +75% to +150% and moved the
  forms onto the human-form attack-speed calculation; those two facts are
  citable and a frame table is not. Nothing on this site states a wereform IAS
  breakpoint.
- **Per-charge numbers for Maul and Feral Rage.** Maul's `aurastatcalc1` is
  `lvl * par3` under a parameter the game calls "Damage % per Charge"; how the
  state stacks charges is in the engine and in no extracted column. A row headed
  "Damage dealt" reading 600% at level 20 would be either a sixth of the truth
  or six times it. The charge *count* and the stun are published; the per-charge
  values are described in a sentence.
- **Arctic Blast's mana cost in the effects table.** It is 0.375 at
  `manashift` 2, which is correct and is *per frame* — roughly nine mana a
  second. Printed under the same heading as Hurricane's 30 it reads as cheap, so
  it stays in prose. It is the one Druid skill of thirty that publishes no
  effect at all, and `damage.test.ts` pins that count at 29.

---

## 3. Build inventory

Seven families are real and distinct. Two are published in this pass.

### 3.1 Consolidated

| Family | Aliases folded in | Status |
| --- | --- | --- |
| **Wind Druid** | Tornado Druid, Windy Druid, Windmaster, Wind Elemental, Tornado Hurricane Druid | **Published** |
| **Fire Druid** | Fissure Druid, Fire Elemental, Volcanic Elementalist, **Armageddon Druid** | **Published** |
| Fury Druid | Werewolf Druid, Fury Werewolf | Researched, not yet written |
| Maul Druid | Werebear Druid | Researched, not yet written |
| Fire Claws Druid | Flamebear, Fire Claws Werebear, Fire Claws Werewolf, Werewolf Armageddon | Researched, not yet written |
| Summon Druid | Summoner, Beastmaster | Researched, not yet written |
| Rabies Druid | Rabies Wolf | Researched, not yet written — niche |

### 3.2 Rejected, with reasons

- **"Armageddon Druid" as its own page.** Same tree, same gear, same mercenary,
  same Sunder Charm as the Fissure build; only the maxing order differs. It is a
  variant note on the Fire Druid, and an alias.
- **"Elemental Druid" as a wind-plus-fire hybrid.** The two halves share not one
  synergy. This is the *leveling route*, documented as a journey, not a build.
- **"Wolf + Wind" hybrid.** 2.4 made Hurricane and Cyclone Armor castable in
  form, which makes it legal. No specialist guide covers it; theorycraft only.
- **Shock Wave Druid.** The primary specialist source archived its guide and its
  own changelog records the removal. Shock Wave stays a utility skill inside the
  Maul build.
- **"Hunger Druid".** Hunger is a one-point sustain skill, never a build.

### 3.3 Why these two first

The journey needs both. The route is fire to level 38 and wind afterwards, so
both ends of it had to exist before the journey could reference them — the Wind
Druid's `levelingPath.viaBuild` resolves to the Fire Druid, and the journey's
`targetBuild` resolves to the Wind Druid. Publishing either alone would have
left a route pointing at a page that does not exist.

### 3.4 Point plans, and where they diverge from the community

The Fire Druid maxes **Armageddon fourth and Molten Boulder fifth**, where the
main specialist guide has Armageddon fifth. The reason is in the columns:
Molten Boulder gives Fissure **nothing at all** — Fissure's only synergies are
Firestorm and Volcano, at 12% each — while Armageddon is a damage skill in its
own right. Molten Boulder's contribution is 14% of Armageddon's fire and 16% of
Volcano's physical, both of which are worth having and neither of which is worth
having before the skill they feed.

Volcano's 18% contribution to Armageddon's physical is the largest single
synergy coefficient in the class.

---

## 4. Open questions

1. The five unwritten build families. Each has a research basis; none has a
   page.
2. Whether a wereform IAS frame table can ever be sourced to Tier 1 or Tier 2.
   Until it can, no melee Druid build on this site can carry an IAS breakpoint,
   which is a real gap in the Fury and Maul pages when they are written.
3. Metamorphosis (the 2.6 shapeshifter runeword) is not in this repository's
   runeword registry and its stat lines are not verified here. It will need an
   entry before a shapeshifting build can name it.
4. Whether the `json/base/` extraction is genuinely pre-2.4. All 30 Druid rows
   are byte-identical across the two extractions, and 2.4's Druid balance pass
   was substantial — which suggests the "agreement" figure in the generated
   header measures less independence than its own caveat already warns. The
   header's caveat stands; no claim on this site depends on the number.

## Sources

Tier 1 throughout for mechanics. Blizzard's own patch notes for the 2.4
shapeshifting change and the 2.5 Sundering Charm clause. Specialist guides were
used for the build roster and the leveling consensus only, and every number they
carried was re-derived from the extraction before it was published.
