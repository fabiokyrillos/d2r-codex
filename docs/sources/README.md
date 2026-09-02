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
| **Fields taken** | `charclass`, `reqlevel`, `reqskill1`, `reqskill2`, `SkillPage`, and the `calc`/`Param` columns for synergies |
| **Normalization** | Filter to `pal`/`sor`; slugify the identifier; sort prerequisite sets; join `SkillPage` on the `skilldesc` key; derive tree slugs by membership, failing if one page maps to two trees |
| **Agreement** | Prerequisite sets identical across the repository's current D2R tables and its pre-D2R `json/base/` tables for **60 of 60** skills |

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
calls a synergy — **69 edges across 34 receivers**. Both directions now come
from that one extraction; `synergyFor` is gone and the reverse index is
computed.

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

**Recorded gaps.** Of the 69 edges, **17 carry an authored magnitude** and 52 do
not. The identity of all 69 is sourced; the missing magnitudes are a gap in this
repository's prose, not a claim about the game, and a page shows the source and
what it improves without inventing a number.

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
| [The Arreat Summit](https://classic.battle.net/diablo2exp/) | Rune modifiers and required levels, Horadric Cube recipes, difficulty penalties, quest structure | Predates D2R. Authoritative for mechanics unchanged since 1.11; must be cross-checked for anything patched since. |

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
