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
- 19 runeword definitions with stat lines and base restrictions
- 18 unique items with roll ranges
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
- Increased Attack Speed tables (weapon- and skill-dependent)
