# Source registry

Where the numbers on this site come from, and how much weight each source
carries. Content is verified against the highest tier available for the claim in
question.

## Tier 1 — The game's own data

The most authoritative source that exists: the game itself, not a description
of it.

| Source | Used for |
| --- | --- |
| `levels.txt` (via the [blizzhackers/d2data](https://github.com/blizzhackers/d2data) JSON extraction) | Area levels per difficulty, monster levels |
| `skills.txt` / `skilldesc.txt` (same extraction) | **The skill graph**: unlock levels, prerequisite edges, tree membership. Also skill parameters, mana formulas and per-level damage bands. |
| `charstats.txt` (same extraction) | Starting attributes and per-level gain rates, for every class including the Warlock |
| `uniqueitems.txt` / `runes.txt` (same extraction) | **Unique item and runeword properties** since the Amazon pass — see below |
| `weapons.txt` / `armor.txt` / `misc.txt` / `itemtypes.txt` (same extraction) | Base requirements, socket ceilings, weapon speed, and the item-type hierarchy that decides which runeword fits which base |

**Critical detail:** `levels.txt` contains two parallel sets of monster-level
columns.

| Columns | Describes |
| --- | --- |
| `MonLvl`, `MonLvl(N)`, `MonLvl(H)` | Classic Diablo II |
| `MonLvlEx`, `MonLvlEx(N)`, `MonLvlEx(H)` | **Lord of Destruction / D2R** |

D2R uses the Expansion columns. Reading the wrong set gives Ancient Tunnels a
Hell area level of 67 instead of 85 — a complete inversion of whether the area
is worth farming. Every area level on this site comes from the `Ex` columns.

The same extraction confirmed the dataset is current: it contains a
`ColossalSummit` level at monster level 87, the arena added by *Reign of the
Warlock*.

### Item numbers, and why they moved from Tier 3 to Tier 1

Every unique and runeword catalogued before the Amazon pass was verified against
D2Runewizard, a Tier 3 database. That was a reasonable choice and it is not
being revisited. What changed is that the Amazon pass could not use it: its item
pages are client-rendered, and a headless fetch returns a shell with no data in
it.

Rather than author from memory, that pass decoded `uniqueitems.json` and
`runes.json` from the same pinned commit the skill graph comes from, and
**calibrated the decoder against four items already in this catalogue** —
Harlequin Crest, Raven Frost, Highlord's Wrath and Demon Machine. It reproduces
every one of their published lines exactly, including the per-level divisor of
eight that turns a raw `par=12` into "+1.5 to Life per Character Level" and the
`hpadd`-style quirks that a spot-check of final values would not catch. Only
after that did it decode anything new.

#### What that does *not* mean

The item numbers and the skill graph are both Tier 1, and their provenance is
not equally strong. Saying otherwise would be the more flattering description
and the wrong one.

| | Skill graph | Item and runeword numbers |
| --- | --- | --- |
| Produced by | `scripts/generate-skill-graph.ts`, versioned here | A decoder written and run once, during the Amazon research pass |
| Reproducible | `npm run gen:skill-graph` reproduces the committed file exactly or fails | **No.** Nothing in this repository regenerates them |
| If the pin moves | The generator refuses, or emits a diff to read | Nothing happens; the values are transcribed prose |
| Checked by | `check:content`, against the generated file | `check:content`, against a hand-written control set |

So the item values were **decoded from Tier 1 in a research run, calibrated
against four controls, and then transcribed**. What is committed is the result,
not the process. A future contributor cannot re-derive a single item number from
this repository, and a value that drifts drifts silently.

The Amazon audit found exactly the failure that arrangement invites, and it is
worth naming rather than filing away. Thunderstroke published "14% Chance to
cast level 20 Lightning on striking" where the extraction gives `min=20 max=14`
— chance and level exchanged. **None of the four calibration items carries a
cast-on-striking line**, so the column's argument order was never exercised by
the calibration, and no gate could see the result.

`scripts/item-rules.ts` is the narrow answer to that: nine controls across six
entities and all three trigger columns, pinning the one thing that went wrong.
It is not a decoder and does not pretend to be. **A reproducible item generator
is outstanding work**, and until it exists the honest summary is that item
numbers carry Tier 1 *values* with Tier 3 *reproducibility*.

Two rules came out of it that are worth stating once, because both are easy to
get wrong from a database listing:

1. **A runeword's displayed stat block is the runeword's own properties plus
   each constituent rune's mod for that item type.** The table gives Faith
   +280% Enhanced Damage; this site publishes +330%, because Ohm's weapon mod
   supplies the other fifty. Every runeword added since is composed the same
   way, from this repository's own rune data.
2. **Item type membership is a hierarchy, not a list.** Amazon-only bows are
   missile weapons (`abow` → `bow` → `miss`), so every bow runeword can be made
   in one. Javelins are not (`ajav` → `jave` → `comb` → `mele`), and no Amazon
   javelin base has a socket — which is why no javelin runeword exists rather
   than why none is documented.

The same extraction corrected a number already published: the resistances
article gave Black Cleft the same −70 to −90% penalty as the four elemental
Sunder Charms, where `res-mag` gives −45 to −65.

### The skill graph, and why it is generated rather than authored

`content/classes/skill-graph.ts` is written by `npm run gen:skill-graph`, never
by hand. Our skill prerequisites *were* hand-authored, and 29 of 60 were wrong
— eight of them following the pattern "the skill drawn directly above it in the
tree", which is what you infer from a picture rather than what the game
enforces. Fourteen of eighteen build pages published skill plans that could not
be spent as a result.

| | |
| --- | --- |
| **Repository** | [blizzhackers/d2data](https://github.com/blizzhackers/d2data) |
| **Commit** | `fc469993502d0498809b9fc1af140ee2a9eb8902` — 2026-08-21, *"Updated for patch 3.3.93847"* |
| **Verified** | 2026-08-31 |
| **Paths** | `json/skills.json`, `json/skilldesc.json`, `json/base/skills.json` |
| **Baseline** | D2R Patch 3.3 / Ladder Season 15 extraction |
| **Regenerate** | `npm run gen:skill-graph` |
| **Fields taken** | `charclass`, `reqlevel`, `reqskill1`, `reqskill2`, `SkillPage`, the `calc`/`Param` columns for synergies and effects, `mana`/`lvlmana`/`manashift`, and `petmax` |
| **Normalization** | Filter to the `charclass` codes in scope — currently `pal`, `sor`, `ama`, `nec`; slugify the identifier through `SLUG_OVERRIDES`; sort prerequisite sets; join `SkillPage` on the `skilldesc` key; derive tree slugs by membership, failing if one page maps to two trees |
| **Agreement** | Prerequisite sets identical across the repository's current D2R tables and its pre-D2R `json/base/` tables for **120 of 120** skills |
| **Non-drift** | `npm run check:graph-drift` compares every node body against the file as committed at `c98e3ed` and fails on any change to one that already existed |

**Why a commit and not `master`.** A moving ref means the generator is not a
function of anything written down: re-running it later can rewrite the graph
from a source nobody chose, while the header keeps claiming a baseline that no
longer produced it. Pinned, `npm run gen:skill-graph` either reproduces the
committed file exactly or fails. Moving to a newer extraction is a deliberate
act — bump `SOURCE_SHA`, regenerate, and read the diff as a game change with
the patch notes that justify it. The generator refuses to run if the pinned
commit is unreachable or if a column it parses has disappeared, rather than
emitting a graph with rows silently missing.

**What that agreement does and does not show.** These are two snapshots of
different game versions from one extraction project, not two independent
publishers. Their agreement shows the values are not an artifact of a single
extraction pass, and that the prerequisite graph did not change between Lord of
Destruction and D2R. It is not corroboration by an unrelated party, and it says
nothing about patches after the baseline.

### Synergies, and the eight claims that were removed

Synergies were authored in **two** hand-maintained directions — `synergies` on
the receiver and `synergyFor` on the source — and the two disagreed on ten of
thirty-four edges. Checking the identities against the game's own formulas found
that eight of the twenty-five authored edges were wrong outright.

The formulas settle it without interpretation. A skill's calc columns are
expressions; where one reads another skill's base level the contribution is
scaled by a `parN`, and the matching `*ParamN Description` says what that
parameter is. The game labels the synergy parameters itself:

```
Blessed Hammer  EDmgSymPerCalc       (skill('Vigor'.blvl)+skill('Blessed Aim'.blvl))*par8
                *Param8 Description  "Damage synergy"
```

So an edge exists when the contribution is governed by a parameter the game
calls a synergy — **136 edges across 63 receivers** at four classes. Both
directions now come from that one extraction; `synergyFor` is gone and the
reverse index is computed.

**Removed, because the formulas contradict them:**

| Claimed | What the game actually gives |
| --- | --- |
| Holy Shield ← Smite | Holy Shield ← Defiance (`"Armor synergy"`) |
| Fist of the Heavens ← Holy Bolt | Fist of the Heavens ← Holy Shock; the Holy Bolt edge runs the other way |
| Cleansing ← Prayer | Cleansing receives no synergy; Prayer feeds Holy Bolt's *healing* |
| Frozen Orb ← Ice Blast | Frozen Orb ← Ice Bolt only |
| Nova ← Charged Bolt, Lightning | Nova ← Static Field |
| Thunder Storm ← Lightning | Thunder Storm ← Static Field |
| Blaze ← Inferno | Blaze ← Warmth |

**Recorded gaps.** Of the 136 edges, **84 carry an authored magnitude** and 52
do not. The identity of all 136 is sourced; the missing magnitudes are a gap in
this repository's prose, not a claim about the game, and a page shows the source
and what it improves without inventing a number.

**Twelve carry an extracted one.** See the next section: where the game keeps the
coefficient on the *source* skill's row, the graph states it.

**What is excluded, and what only looks excluded.** The rule drops individual
*references*, not skills, and the difference matters because one pair of skills
can appear in two columns meaning two different things.

| Reference | Column | Governed by | Outcome |
| --- | --- | --- | --- |
| Energy Shield → Telekinesis | `calc2` | par5, *"Mana consumed per HP damage (in sixteenths)"* | No edge. A mana ratio, and Energy Shield receives no synergy anywhere. |
| Hydra → Fire Bolt, Fire Ball | `sumsk2calc`, `sumsk3calc` | nothing | These references dropped — the columns choose which missile to summon. |
| Hydra → Fire Bolt, Fire Ball | `EDmgSymPerCalc` | par8, *"Damage synergy"* | **Both edges kept.** Hydra genuinely receives a damage synergy from each. |

So Hydra is not an exception to the graph: `hydra ← fire-bolt` and
`hydra ← fire-ball` are two of the 69. Only its summon columns are ignored.

Concentration is not excluded either — it is never a `skill()` reference in the
extracted rows at all. Its boost to Blessed Hammer arrives through the aura
state, and the only trace of it is `*Param1 Description` on Blessed Hammer,
*"Damage % from Concentration (in 8ths)"*: a parameter description with no skill
reference for it to govern. There is nothing for the rule to reject, because an
aura that never appears in a formula is never a candidate.

### Who owns the parameter, and the golem ring

The rule above says an edge exists where the contribution is governed by "a
`parN`". Which row that `parN` lives on was, until the Necromancer pass, assumed
to be the receiver's — and for the Paladin, the Sorceress and the Amazon it
always is:

```
Blessed Hammer  EDmgSymPerCalc  (skill('Vigor'.blvl)+skill('Blessed Aim'.blvl))*par8
```

The Necromancer's golems write it the other way:

```
Clay Golem      passivecalc4    skill('IronGolem'.blvl)*skill('IronGolem'.par8)
```

There the description **and** the value are Iron Golem's. Reading them off Clay
Golem's row instead gives "Clay Golem Attack Rating synergy" at 20 — which is
what Clay Golem *gives* — for a bonus the game calls armour at 35. Twelve edges,
in both directions, would have carried the wrong stat and the wrong number.

| | Gives | Magnitude |
| --- | --- | --- |
| Clay Golem | Attack rating | 20 |
| Blood Golem | Life | 5 |
| Iron Golem | Defence | 35 |
| Fire Golem | Damage | 6 |

The extractor now attributes each `parN` to its owner before reading it, and the
graph carries `magnitude` for exactly these source-owned cases. Regenerating the
pre-Necromancer scope after the fix reproduced all ninety node bodies byte for
byte, which is what `check:graph-drift` pins.

Three shapes are deliberately **not** edges, and each is a decision rather than a
filter:

| Shape | Example | Why not |
| --- | --- | --- |
| A skill scaling itself | `skill('Blessed Aim'.blvl) * par8` | No second skill in it |
| A skill applying its own coefficient to its own level | Clay Golem's `lvl*par8` | Same |
| A synergy-labelled parameter over a *soft* level | Revive reading `skill('Skeleton Mastery'.lvl)` | A synergy reads `blvl`, hard points only. `.lvl` is raised by +skills, so the game's own "Revive Synergy" label describes something that is not one. Listed explicitly; the Druid's three summons have the same shape and will stop the generator until someone rules on them. |

Skeleton Mastery, Golem Mastery and Summon Resist are not edges for the same
reason: they reach their minions through the effective level. They are explained
in prose instead, and a control fails if one ever becomes an edge.

### The Necromancer's numbers, cross-checked against 1.11

The Arreat Summit documents patch 1.11 and was written from the game rather than
from `skills.json`, which makes it the only source available here that is
genuinely independent of the file this repository parses. `scripts/necromancer-rules.ts`
pins the comparison.

**37 values agree exactly** — Teeth's damage at both ends (2–4 and 23–31, which
corroborates the five damage bands and the HitShift divisor), Poison Dagger's
7–15 growing to 540–581 over 2 to 9.6 seconds (the poison duration multiply),
eleven mana costs across every shape `manashift` produces, and the minion count
at levels 2, 3 and 4 where the piecewise formula bends.

**10 values disagree**, all in the bone and poison trees:

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
| Corpse Explosion radius, level 20 | 27 half squares | 9 yards |

**The site publishes the extraction.** The pattern is what D2R's rebalancing of
the bone tree looks like — lower base damage against higher synergies — and
Teeth agreeing exactly rules out an error in how the columns are read. The last
row is a unit disagreement rather than a value one: the engine halves the
parameter and the older documentation divides it by three.

All ten are pinned **in both directions**. One rule catches the site drifting off
Tier 1; the other catches a future author reading the older source, deciding the
site is wrong, and "correcting" 305 back to 210.

### Facts versus protected content

The repository carries an MIT licence, but its contents are extracted from
Blizzard's game files and Blizzard owns the underlying data — a repository
owner cannot license someone else's data. The site's line:

| Thing | Treatment |
| --- | --- |
| **Mechanical facts** — unlock levels, prerequisite edges, tree coordinates, parameter values | Used freely. Facts about a system are not copyrightable. |
| **The game's descriptive prose** — the `str name` / `str long` string tables | **Never extracted, never shipped.** All prose on this site is written here. |
| **Artwork** — `IconCel` sprite-sheet indices | **Never extracted, never shipped.** The site draws its own marks. |

`localestrings-*.json` covers eng, deu, esp, fra, ita, pol, chi and kor — and no
Portuguese. That independently confirms ADR 0003: no official pt-BR string
table is available to us, so game proper nouns stay in English in both locales.

## Tier 2 — Blizzard official

| Source | Used for | Caveat |
| --- | --- | --- |
| [Blizzard News](https://news.blizzard.com/) — *Rain Annihilation in Reign of the Warlock* | Warlock class design, Grimoires, Colossal Ancients, Terror Zone rework, new runewords and uniques, quality-of-life changes | Prose, not tables. Contains at least two internal inconsistencies (see below). |
| Patch 3.3 / Season 15 notes | Terror Zone tuning, Latent Sunder Charm changes, ladder→non-ladder item migration | — |
| [The Arreat Summit](https://classic.battle.net/diablo2exp/) | Rune modifiers and required levels, Horadric Cube recipes, difficulty penalties, quest structure, and — since the Necromancer pass — an independent cross-check on published skill numbers | Predates D2R. Authoritative for mechanics unchanged since 1.11; must be cross-checked for anything patched since. Where it disagrees with the pinned extraction the extraction wins, and the disagreement is recorded above. |

### Known inconsistencies in Blizzard's own material

1. **Colossal Ancients statue count.** The expansion announcement says a statue
   is used "in combination with all five *other* statues" (implying six) in one
   paragraph, and "combine all five statues in the Horadric Cube" in another.
   Documented as unresolved; the site avoids stating a number.
2. **"Blapshemous" vs "Blasphemous" Grimoire.** Spelled both ways on the same
   page. Treated as a typo; the site uses "Blasphemous".

## Tier 3 — Structured community databases

Cross-checked against each other and against Tier 1 where the data overlaps.

| Source | Used for |
| --- | --- |
| [D2Runewizard](https://d2runewizard.com/) | Runeword definitions and stat lines, unique item statistics and roll ranges, breakpoint tables (including the new Warlock tables), class starting attributes |
| [Diablo Wiki (Fandom)](https://diablo.fandom.com/) | Skill mechanics detail |
| [PureDiablo](https://www.purediablo.com/) | Rune scarcity, general mechanics background |

**Note on attribute units.** D2Runewizard publishes life/mana gains in
quarter-units — Sorceress "Life per Vitality 8" means 2 life per point. The site
stores player-facing values. The conversion was confirmed by checking it against
the long-established Sorceress figures (1 life/level, 2 mana/level, 2 life per
Vitality, 2 mana per Energy).

## Tier 4 — Build guides

Used for consensus, playstyle and judgement. **Never as the sole source for a
number.**

| Source | Used for |
| --- | --- |
| [Maxroll](https://maxroll.gg/d2) | Build consensus, patch coverage, mechanics detail |
| [D2Runewizard guides](https://d2runewizard.com/guides) | Build consensus |
| [DiabloBytes](https://diablobytes.com/d2-resurrected/) | Build consensus, current-patch framing |
| [Icy Veins](https://www.icy-veins.com/d2/) | Build consensus |

Where these disagree with each other, the disagreement is investigated and, if
unresolvable, documented on the page.

## Live disagreements

Recorded rather than resolved by guesswork.

| Claim | Position A | Position B | Site's handling |
| --- | --- | --- | --- |
| Does enemy Lightning Resistance reduce Static Field? | Diablo Wiki: yes, it is affected by Lightning Resist | Some build guides: no, it ignores resistance | Both recorded. Static Field is presented as a softening tool, not an answer to immunity. Confidence set to `community`. |
| How many statues open the Colossal Ancients? | Blizzard: "all five other statues" (six) | Blizzard: "all five statues" (five) | Neither asserted. Described as "one statue from each terrorized Act boss". |
| Bone and poison damage figures | Pinned 3.3 tables | The Arreat Summit's 1.11 tables, consistently higher | The extraction is published; all ten differences are pinned in both directions so neither side can drift. See above. |
| What unit is Corpse Explosion's radius in? | The game names it "half squares" and the engine halves it | The Arreat Summit publishes the same parameter divided by three, as yards | Neither converted. The site publishes the parameter and states the halving. A curse's radius is a different unit again and shares no conversion with it. |
| Does the fire half of Corpse Explosion take +Fire Skills, Fire Mastery or +% Fire Skill Damage? | Community guides: yes | Not established from the skill function, which computes the split from the corpse's life before the damage pipeline runs | **Not asserted either way.** The article names the gap; a gate fails if any page starts claiming it. |

## Verified in this research pass

- Class roster: **8**, including the Warlock (*Reign of the Warlock*, Feb 2026)
- Patch 3.3, client build 1.39, Ladder Season 15 (started 2026-08-21)
- All 33 rune modifiers and required levels
- All rune upgrade recipes, including the gem tiers (Chipped → Flawed →
  standard → Flawless — **not** the Flawless→Perfect progression that is easy to
  misremember)
- 46 runeword definitions with stat lines and base restrictions — the six added
  in the Amazon pass composed from Tier 1 rather than a database
- 49 unique items with roll ranges, including the five Sunder Charms and their
  real penalties
- Amazon skill trees: 30 skills, with the columns that decide eight build plans
  — Strafe's ten-shot cap, Multiple Shot's absent attack-rating bonus, Freezing
  Arrow's 36 mana, Plague Javelin's fixed three-second duration, and Pierce's
  10%-to-100% diminishing curve
- Necromancer skill trees: 30 skills, three trees, and the columns that decide
  the class — the golem ring's four source-owned magnitudes, Corpse Explosion's
  70–120% of the monster *type's* base life with a 50/50 physical–fire split,
  the piecewise minion count, Revive's fixed three minutes, Poison Nova's fixed
  two seconds, and the `AiCurseDivisor` that shortens Dim Vision and Terror in
  Nightmare and Hell and shortens nothing else
- Sorceress skill trees: 30 skills, correct unlock levels, Blizzard's three
  synergies at +5% per level each
- Sorceress and Warlock starting attributes and gain rates
- FCR, FHR and FBR tables for all eight classes, including the Sorceress's
  separate Lightning cast table
- Area levels for 11 farming areas, plus the complete Hell area-level-85 list
- Magic Find diminishing-returns factors (250 / 500 / 600)
- Static Field floors: 33% in Nightmare, 50% in Hell
- Difficulty penalties: −40 / −100 resistances, 5% / 10% experience on death
- Quest reward totals: 4 skill points and 5 stat points per difficulty

## Outstanding tooling

Not a gap in what is published, but in how it can be checked.

- **Receiver-owned synergy magnitudes are not in the graph.** Where the game
  keeps a synergy's coefficient on the source skill's row the graph now states
  it, and where it keeps it on the receiver's — Blessed Hammer's `par8` of 14,
  governing a sum of several sources at once — it is left to authored prose.
  That number is equally real and equally extractable. It is deferred because
  emitting it rewrites all 136 edges, which is a diff to read on its own rather
  than one to bury inside a directional bug fix.
- **Mana is extracted for the Necromancer only.** The other three classes
  publish mana in authored prose where it is decision-relevant. Moving them onto
  extraction is another ninety-node rewrite and belongs in its own pass.
- **A reproducible item and runeword generator.** The values came from Tier 1;
  the process did not survive the research pass that produced them. See
  ["What that does *not* mean"](#what-that-does-not-mean) above. Until a
  generator exists, `scripts/item-rules.ts` pins a control set rather than the
  whole catalogue, and every other item number rests on a one-time transcription.

## Still unverified

Tracked in [`../research/00-game-state.md`](../research/00-game-state.md). Nothing
in this list has been written into user-facing content as fact.

- Warlock skill tables — names, unlock levels, synergies, numeric values
- Madawc's two Colossal Ancients jewels
- The exact statue count for the Colossal Ancients recipe
- What Latent Sunder Charms and Worldstone Shards actually do
- Stat lines for Authority, Coven, Void, Vigilence and Ritual
- The complete Terror Zone rotation group list
- Increased Attack Speed tables (weapon- and skill-dependent). Since the Amazon
  pass this is enforced rather than merely intended: `check:content` fails if
  any build publishes an `ias` breakpoint
- Hellfire Torch's on-striking proc, whose display name the extraction gives
  only as an internal identifier. The charm is named in prose and not catalogued
- Set items of any kind, which is why M'avina's Battle Hymn is described on the
  Freezing Arrow page rather than given one
- Five questions about summons, listed on the minions article rather than
  answered: whether minions take the −40 / −100 difficulty resistance penalty,
  whether a Skill Shrine's bonus survives on minions raised under it, when an
  Iron Golem persists between games and what loses one, minion life and damage
  per difficulty for the current build, and behaviour against the Uber bosses.
  Because the third is open, no page recommends building an Iron Golem from an
  expensive item, and a gate fails if one starts to
