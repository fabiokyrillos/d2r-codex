# Amazon build families — research and editorial plan

**Researched:** 2026-09-02
**Baseline:** Diablo II: Resurrected, Patch 3.3 / Ladder Season 15 (see
[`00-game-state.md`](00-game-state.md))
**Status:** Executed. All eight planned pages shipped, plus their dependencies,
a leveling journey, a Pierce article and four new gates.

| Planned | Outcome |
| --- | --- |
| Lightning Fury, Lightning Strike | Shipped. Charged Strike merged into both as the single-target component, as planned |
| Strafe, Multiple Shot | Shipped as separate pages, on the mechanical grounds in §3 |
| Freezing Arrow, Exploding Arrow | Shipped. M'avina's documented as a textual variant, no set page |
| Poison Javelin | Shipped. Plague Javelin merged into it |
| Jab and Fend | Shipped, after Bone Break was catalogued |
| Javazon / Bowazon / Spearazon / Strafezon | Search aliases, no pages — enforced by a rule |
| Guided Arrow, Plague Javelin, Charged Strike | Components of builds, no pages — same rule |

**Gaps closed during implementation:** the six Sunder Charms had never been
catalogued (five now are, and Bone Break's real cost is on a page); the items
index had no group containing a bow, crossbow or javelin, so Demon Machine had
a page nothing linked to; and `commonImmunities` had never been used as an
editorial input, which it now is on eight farming lists.

**Three defects this pass surfaced in already-shipped content**, all corrected:

1. **Black Cleft's penalty was wrong** in the resistances article — stated as
   −70 to −90% like the four elemental charms, where the extraction gives
   `res-mag -65 to -45`. Corrected in both locales. No build on this site deals
   magic damage, so nothing else depended on it.
2. **`playstyle` was the one prose field on a build page not passed through
   `RichText`**, and the farming area page rendered a build's farming reason raw
   while the build page rendered the same string correctly. Neither had ever
   mattered because no earlier build used a marker in either field.
3. **Four Amazon farming reasons contradicted the area pages they link to** —
   written before `commonImmunities` was consulted, and caught by reading the
   two pages together rather than by any check. Corrected; see §6 for why the
   rule written to catch this class of error was then removed.

---

## 1. What could and could not be consulted

| Source | Tier | Amazon coverage | Usable |
| --- | --- | --- | --- |
| `skills.json`, `skilldesc.json` (blizzhackers/d2data, pinned at fc46999) | 1 | All 30 skills: unlock levels, prerequisites, damage bands, mana costs, ToHit columns, effect parameters | **Yes — primary** |
| `uniqueitems.json`, `runes.json` (same extraction) | 1 | Every unique and runeword property, as `code`/`param`/`min`/`max` triples | **Yes — primary for this pass** |
| `weapons.json`, `armor.json`, `misc.json`, `itemtypes.json` (same extraction) | 1 | Base requirements, socket ceilings, weapon speed, and the item-type hierarchy | **Yes** |
| `charstats.json` (same extraction) | 1 | Starting attributes | Already used, unchanged |
| The Arreat Summit | 2 | — | **No.** Its class skill pages return *Document Not Found*, as for the Paladin and Sorceress |
| D2Runewizard | 3 | Item database, breakpoint tables | **Partially.** Its item pages are client-rendered and returned no content to a headless fetch; the breakpoint tables already in this repo were unaffected |
| Maxroll, Wowhead, DiabloBytes | 4 | Amazon guides | Not consulted for numbers this pass — see §2 |

### The method changed, and it is worth saying why

The Paladin and Sorceress passes took structure from Tier 1 and item numbers
from a Tier 3 database. This pass took **item and runeword numbers from Tier 1
as well**, from the same pinned commit the skill graph is generated from.

That was not planned. The first attempt fetched D2Runewizard's item pages and
got a client-rendered shell with no data in it. Rather than fall back to memory,
the pass decoded `uniqueitems.json` and `runes.json` directly — and then
calibrated the decoder against four items already in this catalogue (Harlequin
Crest, Raven Frost, Highlord's Wrath, Demon Machine), reproducing every
published line including the per-level divisor of eight that turns `par=12` into
"+1.5 to Life per Character Level".

Two things fell out of that which a Tier 3 lookup would not have given:

- **A runeword's displayed stat block is the runeword's own properties plus each
  rune's mod for that item type.** Faith's table row says +280% Enhanced Damage
  and this site publishes +330%, because Ohm's weapon mod supplies the other
  fifty. Every runeword added this pass is composed the same way, from this
  repository's own rune data.
- **Amazon-only bows are missile weapons** (`abow` → `bow` → `miss`), so every
  bow runeword can be made in one; and **javelins cannot take a runeword at
  all**, because `ajav` resolves to `mele` rather than `miss` and no Amazon
  javelin base has a socket. That is why the javelin pages' weapon lists are
  uniques and rares only, and it is a fact rather than an omission.

---

## 2. Tier 1 facts established in this pass

From `skills.json`. Every one of these changed how a page was written.

| Skill | Column | Value | Why it matters |
| --- | --- | --- | --- |
| Strafe | `min(par3 + lvl - 1, par4)` | 4 shots, +1/level, **cap 10** | The cap arrives at skill level 7. Points past it buy 5% damage and no arrows |
| Strafe | `ToHit` / `LevToHit` | 30 / 9 | Strafe carries its own attack-rating bonus |
| Multiple Shot | `min(ln12, 24)` | 2 arrows, +1/level, cap 24 | +skills keep buying arrows where Strafe's stop |
| Multiple Shot | `ToHit` | **absent** | No attack-rating bonus at all — hence twenty points of Penetrate, against Strafe's ten |
| Freezing Arrow | `mana` / `lvlmana` | 36, +1/level | 55 mana at level 20: the most expensive Amazon skill by a wide margin |
| Freezing Arrow | synergy kinds | `damage` from Cold Arrow, `freeze` from Ice Arrow | Only one damage synergy. Ice Arrow's twenty points buy duration |
| Exploding Arrow | synergies | `damage` from Fire Arrow only | Immolation Arrow receives and gives nothing back |
| Poison Javelin | `ELen` / `ELevLen` | 200 frames, +50/level | Eight seconds at level 1, forty-six at twenty |
| Plague Javelin | `ELen` / `ELevLen` | 75, **+0** | Fixed at three seconds, as patch 2.4 made it |
| Impale | `Param1` / `Param2` | 300% damage, +25%/level | 300% weapon damage for one point — the best single point in the class |
| Fend | `Param3` / `Param4` / `Param1` | 70% +10%/level, +1 target/level | The crowd skill, and the one that locks you in an animation |
| Jab | `Param3` / `Param4` | −15% baseline, +3%/level | Three thrusts per attack: Crushing Blow and any on-hit curse fire three times |
| Lightning Fury | `Param1` / `Param2` / `Param3` | 2 bolts, +1/level, radius 15 | No cap in the columns; scales with +skills indefinitely |
| Charged Strike | `effects` | 3 bolts, +1 per 5 levels | Seven bolts at twenty, all landable on one target at point-blank |
| Pierce | `Param1` / `Param2` | Min 10%, Max 100%, `dm12` | A diminishing curve in the engine. The floor and ceiling are publishable; nothing between them is |

**The Guided Arrow asymmetry.** Guided Arrow's row reads Multiple Shot's level
under a parameter the game labels "Damage synergy"; Multiple Shot's row reads
Guided Arrow's under one it labels "Damage % per level". The generated graph
records only the labelled synergy, which is correct and is also why only one
arrow appears in the tree. Both directions are stated on the Multiple Shot page
rather than smoothed over.

---

## 3. Which builds the site documents, and which names are aliases

The Amazon has more nicknames than builds, and treating each as a page would
have published the same character several times with its gear advice divided
between the copies. The decision, and the mechanical grounds for it:

| Name | Decision | Grounds |
| --- | --- | --- |
| **Javazon** | Alias → Lightning Fury Amazon | A family name covering three different builds |
| **Bowazon** | Alias → Strafe Amazon | Same; four bow builds share it |
| **Spearazon**, **Fendazon** | Alias → Jab Fend Amazon | Same |
| **Strafezon** | Alias → Strafe Amazon | Same build, shorter name |
| **Charged Strike** | Component of Lightning Fury and Lightning Strike | It takes the same three 14%-per-level synergies both builds already need and shares every gear slot |
| **Guided Arrow** | Component of four bow builds | Maxed on all four; a page would restate four gear lists |
| **Plague Javelin** | Component of Poison Javelin | The two are each other's only synergy |
| **M'avina's** | Textual variant inside Freezing Arrow | Set items are not catalogued on this site; a set page with unverified stat lines would be worse than a paragraph |
| Equipment variants (Buriza, Faith, Windforce…) | Gear-set entries and alternatives | A weapon is not a build |

**Strafe and Multiple Shot are separate pages**, and that is the one call in
this table that needed evidence rather than judgement. Two columns separate
them: the arrow cap (10 at skill level 7 against 24) and the attack-rating
bonus (30 + 9/level against none). Those produce genuinely different plans —
Pierce 1 and Penetrate 10 on one page, Pierce 15 and Penetrate 20 on the other —
and different weapons. Had the columns been the same, one page would have been
right.

---

## 4. Skill plans

Every plan closes under the generated graph and fits the 110-point budget
(98 level-ups plus 12 quest points). None uses a flex allocation.

| Build | Mandatory | Shape |
| --- | --- | --- |
| Lightning Fury | 109 | Four maxed lightning skills, Lightning Strike as the fifth synergy |
| Lightning Strike | 109 | Four maxed, thirteen in Penetrate, one point of Lightning Fury as a thrown clear |
| Strafe | 108 | Three maxed bow skills, Critical Strike maxed, ten Penetrate, five Dodge |
| Multiple Shot | 108 | Two maxed bow skills, Critical Strike and Penetrate maxed, fifteen Pierce |
| Freezing Arrow | 109 | Three maxed cold skills, Guided Arrow maxed as the physical answer, fifteen Pierce |
| Exploding Arrow | 109 | Two maxed fire skills, Immolation Arrow, Guided Arrow maxed, fourteen Pierce |
| Poison Javelin | 109 | Two maxed poison skills, then twenty Decoy and twenty Penetrate to fund the Valkyrie |
| Jab Fend | 109 | Two maxed attacks, Critical Strike and Penetrate maxed, twenty-four in the avoidance passives |

**Jab and Fend is the only plan on the site with no synergies in it**, because
the graph gives Jab, Impale and Fend empty synergy lists. That is stated on the
page rather than left for a reader to notice that the maxing order looks unlike
every other one.

---

## 5. Increased Attack Speed

The breakpoints page already refuses to tabulate IAS, on the grounds that the
frames depend on the weapon's base speed, the attack skill and in some cases the
class. Eight Amazon pages that each discuss attack speed several times are
exactly where a number would have crept in, so the position is now a rule:
`check:content` fails if any build publishes an `ias` breakpoint, and the
build-page gate asserts none renders one.

What the pages say instead is per weapon and per skill: that throwing Lightning
Fury and striking with Charged Strike do not share an animation, that a Balista
and a Ward Bow reach their frames at very different totals, and that the right
number is the one that feels fastest on the weapon in hand. No Amazon IAS
breakpoint is published anywhere on this site.

---

## 6. A rule that was written and removed

The pass wrote a check comparing each build's farming ratings against the
area's `commonImmunities`, reasoning that a zone resisting everything a build
deals cannot be rated four or five. **It fired on thirty-nine shipped entries**
across the Paladin and Sorceress pages, and the rule was wrong rather than the
content: `commonImmunities` records the immunities *present* in a zone, not
universal resistance. The Chaos Sanctuary lists lightning and remains one of the
best Lightning Sorceress zones in the game.

The defect it was chasing was real but was prose — four Amazon reasons asserted
an absence of immunity the area records — and prose of that kind is not
checkable this way. Those four were corrected by hand. A rule that would have
required thirty-nine edits to already-approved content in order to pass is a
rule that should not exist, and `scripts/amazon-rules.ts` records the reasoning
where the next author will find it.

---

## 7. What shipped

**Eight builds**, both locales, six gear tiers each.

**Dependencies, in commits before the builds that use them:**

- 12 unique items — Titan's Revenge, Thunderstroke, Windforce, Buriza-Do
  Kyanon, Widowmaker, Eaglehorn, Razortail, Thundergod's Vigor, Andariel's
  Visage, The Cat's Eye, Atma's Scarab, Waterwalk
- 5 Sunder Charms — Bone Break, Crack of the Heavens, Cold Rupture, Flame Rift,
  Rotting Fissure. Black Cleft is not catalogued: no build on this site deals
  magic damage
- 6 runewords — Edge, Peace, Melody, Harmony, Wrath, Ice
- The Pierce mechanics article, before the builds rather than after, because
  five of the eight depend on it to explain their belt slot

**After the builds:** the Amazon leveling journey, search aliases, and four
gates (`test:search`, `test:build-page`, `test:crawl`, plus the four Amazon
rules in `check:content`).

---

## 8. Blocking gaps that remain

Nothing blocked a page, and two things were deliberately not published:

1. **Hellfire Torch is not catalogued.** One of its lines is a proc whose
   display name the extraction gives only as an internal skill identifier, and
   resolving it would mean importing Blizzard's string table, which this
   repository's licensing note excludes. It remains a `label` in charm lists,
   as it is on all eighteen earlier builds.
2. **Set items are still not modelled**, so M'avina's Battle Hymn is described
   in prose on the Freezing Arrow page rather than given a page.

One inconsistency was found and deferred, and the audit that followed showed it
was larger than this section first recorded.

The area entity gives the Ancient Tunnels `fire` and `poison`, and the Blizzard
Sorceress page agrees — "essentially no cold immunes in the base population".
This section originally named **two** pages that disagreed, Frozen Orb and Frost
Nova. A sweep of all twenty-six builds found **eight**: those two plus Avenger,
Enchant, Fireball/Meteor, Holy Fire, Meteorb, and — written *during this pass* —
the Strafe Amazon, which called the zone "a cold build's problem zone" one click
from the Freezing Arrow page calling it that build's natural home.

That last one is the part worth keeping. The pass had a commit whose entire
purpose was to stop Amazon farming prose contradicting the area entity, and the
rule that came out of it compares each build's *own* damage types against the
zone. A claim about somebody else's damage type slips straight through it, which
is why a ninth instance was added by the commit series that was fixing the
problem.

All nine are corrected now, in both locales, in a commit kept separate from the
Amazon fixes. Two ratings moved with the prose: Frozen Orb had the zone at 2 and
Frost Nova at 1, both gated behind a Cold Rupture, and those numbers were the
false claim in structured form — the same pages rate the Pit and the Mausoleum 4
and 5 *with* a real cold clash. The Hammerdin page was read and left alone: "less
of a standout here than for a cold build" asserts nothing about the population
and is true.

Two claims about *other* areas were noticed and deliberately not touched, being
outside this correction's scope: the Fireball/Meteor page calls Stony Tomb and
Mephisto "light on fire immunity" where the entity records fire in both. Flagged
for a Sorceress pass.
