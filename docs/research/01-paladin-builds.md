# Paladin build families — research and editorial plan

**Researched:** 2026-08-30
**Baseline:** Diablo II: Resurrected, Patch 3.3 / Ladder Season 15 (see
[`00-game-state.md`](00-game-state.md))
**Status:** Executed. All five planned pages shipped, plus their dependencies.

| Planned | Outcome |
| --- | --- |
| Smiter, Zealot, FoHdin, Avenger | Shipped (lote 1) |
| Tesladin, Holy Fire Paladin | Shipped (lote 2) |
| Dragon Paladin | Shipped as the Holy Fire page's `optimized` tier and flex point, as planned |
| Holy Freeze Zealot | Shipped as a named variant in the Zealot's flex points, as planned |
| Omnidin | Documented in the Holy Fire flex points; still no separate page |
| Vindicator Templar, Tri-Brid | Documented in the FoHdin flex points, as planned |
| PvP, Redeemer's Wrath | Not implemented, as planned |
| Avenger cost divergence (D1) | **Resolved** — see the note below |

**D1 is closed.** Working the point budget out from `skills.txt` showed the two
sources were describing different resources. Vengeance plus its three
resistance synergies plus Conviction is 100 skill points, and the prerequisite
chains cost roughly 13 more — 113 against the 110 a level 99 character has. The
Avenger is cheap in currency and expensive in levels. Both sources were right
about the half they were talking about.

**G2 (no IAS breakpoint table) remains open** and is now a stated position
rather than a gap: D2Runewizard publishes FCR, FHR and FBR only, the thresholds
depend on weapon speed and animation data, and every melee Paladin page says so
explicitly instead of printing an unverified number.

**Two further Tier 1 corrections came out of implementation.** The
`blizzhackers/d2data` runeword extraction caps at seven properties per
runeword, so stat lists past that point must come from Tier 3 — verified by
round-tripping Grief, Infinity and Enigma against content already on the site.
That same check settled two disagreements in favour of the game data:
Kingslayer's Open Wounds reads 25% (not 50%) and Last Wish's Crushing Blow
reads 40-50% (not 60-70%).

> This document decides *which* Paladin builds the site documents, at what
> granularity, and in what order. It does not contain build guidance. Numbers
> below are marked with the tier they came from; anything unverified is called
> out rather than smoothed over.

---

## 1. What could and could not be consulted

| Source | Tier | Paladin coverage | Declared baseline | Usable |
| --- | --- | --- | --- | --- |
| `skills.json` (blizzhackers/d2data) | 1 | All 30 Paladin skills, synergy formulas, aura parameters | Current extraction (contains `ColossalSummit`) | **Yes — primary** |
| The Arreat Summit | 2 | — | Pre-D2R | **No.** `/diablo2exp/skills/paladin*.shtml` returns *Document Not Found*. Still valid for runes and cube recipes; no longer a Paladin skill source. |
| Blizzard patch notes | 2 | Not located for the Paladin-relevant changes | — | **Partially.** See gap G3. |
| D2Runewizard | 3 | Hammerdin only, updated 2025-04-11 | Not declared | Yes, narrow |
| Maxroll | 4 | 7 guides + 5 tier lists | **Season 14** | Yes |
| Wowhead | 4 | 12 guides (community-authored) | **Season 13**, one at **Patch 2.4** | Yes, with caveats |
| DiabloBytes | 4 | 6 in tier list, 7 guide pages, 1 experimental | Tier list **S13**; class page **S14 / 3.2** | Yes, with caveats |
| Icy Veins | 4 | Unknown | — | **No.** Cloudflare bot protection returns a block page. Not bypassed. |

**No source is on our Patch 3.3 / Season 15 baseline.** The freshest Paladin
material found is Maxroll at Season 14 (Smite guide updated 2026-07-09; the rest
2026-05-22). Wowhead's Paladin guides are Season 13, dated 2026-02-20, and its
Holy Freeze guide still declares **Patch 2.4**. This is the single largest
caveat on everything below and is tracked as gap G1.

**On Wowhead's reliability.** Its D2 guides are a community platform with
per-guide authorship and voting. Of the 12 Paladin guides, only the Hammerdin
has cleared its vote threshold ("out of 7 votes"); every other guide still reads
"needs 2–5 more votes". Two are authored by "Wowhead" itself (Smiter, FoH). It
is used here for *taxonomy and alias evidence*, which it is unusually good at,
and not as a numeric source.

---

## 2. Tier 1 facts established in this pass

Extracted from `skills.json`. These are the mechanical anchors the build pages
will be written against, and they settled two source disputes.

| Skill | Req. level | Max level | Key parameters |
| --- | --- | --- | --- |
| Smite | 1 | 20 | Damage 15% baseline, +15%/level. Stun 15 baseline, +5/level. |
| Zeal | 12 | 20 | Hits `min(2 + level − 1, 5)`. Damage 0% baseline, +6%/level from level 5. Synergy: Sacrifice ×12%. |
| Blessed Hammer | 18 | 20 | Concentration adds damage in eighths (param 4). Damage synergy ×14%. |
| Vengeance | 18 | 20 | Damage 70% baseline, +6%/level. **Synergies: Resist Fire, Resist Cold, Resist Lightning ×10% each, plus Salvation ×2%.** |
| Holy Freeze | 18 | 20 | Radius 6 +1/level. Slow 25%→60%. Attack damage multiplier 5. |
| Holy Shock | 24 | 20 | Radius 6 +1/level. Attack damage multiplier 6. |
| Holy Shield | 24 | 20 | Block 10%→40%. Armor 25% +15%/level. Synergy: Defiance ×15%. |
| Holy Fire | 6 | 20 | Radius 6 +1/level. Attack damage multiplier 6. |
| Fist of the Heavens | **30** | 20 | 6 Holy Bolt missiles baseline, +1/level. |
| Conviction | 30 | 20 | **Resistance reduction 30% baseline, +5%/level.** Radius 20, flat. Armor reduction 40%→100%. |
| Fanaticism | 30 | 20 | Attack speed 10%→40%. Damage 50% baseline, +17%/level. Radius 11 +1/level. |
| Salvation | 30 | 20 | Resistance 50%→120%. Radius 16 +2/level. |
| Redemption | 30 | 20 | Redeem chance 10%→100%. HP/mana 25 baseline, +5/level. |
| Sacrifice | 1 | 20 | Damage 180% +15%/level. Synergies: Redemption ×15%, Fanaticism ×5%. |

Three of these matter editorially:

1. **Fist of the Heavens requires level 30, not 18.** Any "FoH starter" framing
   has to account for a build that cannot exist before 30 and whose defining
   aura (Conviction) also unlocks at 30.
2. **Zeal reaches its 5-hit cap at skill level 4.** Points 5–20 buy damage only.
   This is exactly the "one point or max it" question the site answers, and it
   is Tier 1 rather than guide consensus.
3. **Vengeance has four synergies, not three** — see the divergence table.

---

## 3. Build catalogue — identity and classification

Canonical name is what the site would use. Aliases are recorded so search can
find the build under any of them without a duplicate page.

| # | Canonical | Aliases | Primary skill | Primary aura | Damage | Family |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | **Hammerdin** | Blessed Hammer Paladin, Hdin | Blessed Hammer | Concentration | Magic | — (own) |
| 2 | **Smiter** | Smite Paladin, Smitedin | Smite | Fanaticism | Physical | — (own) |
| 3 | **FoHdin** | Fist of the Heavens Paladin, FoH | Fist of the Heavens | Conviction | Lightning + Magic (Holy Bolt) | — (own) |
| 4 | **Zealot** | Zealadin, Zealer, Zeal Paladin | Zeal | Fanaticism | Physical | — (own) |
| 5 | **Tesladin** | Dream Paladin, Dreamadin | Zeal (attack) | Holy Shock **from gear** | Lightning + Physical | Auradin |
| 6 | **Holy Fire Paladin** | — | Zeal (attack) | Holy Fire | Fire + Physical | Auradin |
| 6a | *Dragon Paladin* | Holy Fire Zealot | Zeal | Holy Fire from Dragon / Hand of Justice | Fire + Physical | variant of 6 |
| 7 | **Avenger** | Vengeance Paladin, Convictionist | Vengeance | Conviction | Fire + Cold + Lightning + Physical | — (own) |
| 8 | *Holy Freeze Zealot* | Holy Freeze Zealadin | Zeal | Holy Freeze (usually from Doom) | Cold + Physical | variant of 4 |
| 9 | *Omnidin* | Omnidin Auradin | varies | Fanaticism, swapping | varies | Auradin |
| 10 | *Vindicator Templar* | V/T, Smite/FoH hybrid | FoH + Smite | Conviction / Fanaticism | Lightning + Magic + Physical | variant of 3 |
| 11 | *Tri-Brid FoH* | — | FoH + Blessed Hammer | Conviction / Fanaticism | Lightning + Magic | variant of 3 |
| 12 | *Hammerdin PvP* | — | Blessed Hammer | Concentration | Magic | PvP |
| 13 | *Redeemer's Wrath* | — | Zeal | Fanaticism (self, from Beast) | Physical + Fire | theorycraft |

### Purpose, cost and stage

| # | Canonical | Purpose | Stage | Mode | Cost (as reported) |
| --- | --- | --- | --- | --- | --- |
| 1 | Hammerdin | Density, general farming | Starter → endgame | PvM | Medium; Enigma for full speed |
| 2 | Smiter | Uber bosses, Torch farming | Starter variant exists → endgame | **Ubers**, PvM bossing | Maxroll: "Cheap Starting Gear"; top end expensive |
| 3 | FoHdin | Elite sniping, Undead/Demon density, party support | Starter variants exist; guide assumes level 75 | PvM, support | Medium → high |
| 4 | Zealot | Single target, Ubers, general melee | Leveling → endgame | PvM, Ubers | Low → high, weapon-dependent |
| 5 | Tesladin | All-round late-game clear | **Endgame only** | PvM | **High — 2× Jah** |
| 6 | Holy Fire Paladin | Melee AoE, limited areas | Starter variant → endgame | PvM | Low to start; Dragon variant very high |
| 7 | Avenger | Immunity-proof single target, party Conviction | **Disputed** | PvM | **Disputed — see D1** |
| 8 | Holy Freeze Zealot | Melee with crowd slow, group play | Endgame | PvM, group | High |
| 9 | Omnidin | Party aura support | Endgame | PvM group | Very high (4 aura runewords) |
| 10 | Vindicator Templar | Bossing + density in one spec | Budget through endgame | PvM, Ubers | Reported low → high |
| 11 | Tri-Brid FoH | Density + Crushing-Blow bossing | Endgame | PvM | High |
| 12 | Hammerdin PvP | Duelling | Endgame | **PvP** | High |
| 13 | Redeemer's Wrath | Hardcore-safe four-aura Zeal | — | PvM | Unvalidated |

### Hard dependencies

The item(s) without which the build is not the build.

| # | Canonical | Hard dependency |
| --- | --- | --- |
| 1 | Hammerdin | None to start. Enigma for full clear speed. |
| 2 | Smiter | A **Life Tap** source — Dracul's Grasp or Exile. Crushing Blow. Cannot Be Frozen. |
| 3 | FoHdin | Conviction (skill, level 30). 125% FCR target per Maxroll. |
| 4 | Zealot | A weapon — Grief in a Phase Blade is the consensus. Cannot Be Frozen (Raven Frost). |
| 5 | Tesladin | **Two Dream runewords** (helm + shield) = two Jah runes. Non-negotiable. |
| 6 | Holy Fire Paladin | Conviction or Lower Resist for Hell fire immunes. Dragon variant needs Dragon + Hand of Justice. |
| 7 | Avenger | Conviction maxed. Rest disputed. |
| 8 | Holy Freeze Zealot | Doom (or maxed Holy Freeze). Cannot Be Frozen. |
| 9 | Omnidin | Dream + Exile + Doom + Dragon to reach the intended playstyle. |
| 10 | Vindicator Templar | Grief for Smite damage; 2× Last Wish on an Act 5 mercenary at the top end. |
| 11 | Tri-Brid FoH | Heaven's Light + Gore Rider for the Crushing Blow package. |

---

## 4. Deduplication

Applying the rule that a variant earns a page only when it materially changes
skills, gameplay, purpose, breakpoints or progression.

### Merged — alias only, no separate page

| Alias | Folds into | Evidence |
| --- | --- | --- |
| Dream Paladin, Dreamadin | **Tesladin** | Maxroll: "Also known as a Tesladin". Wowhead titles its guide "Tesladin Dream Auradin". Same skills, same two Dream runewords. |
| Zealadin, Zealer, Zealot | **Zealot** | Wowhead lists all three as names for one build. |
| Blessed Hammer Paladin, Hdin | **Hammerdin** | Universal. |
| Convictionist, Vengeance Paladin | **Avenger** | DiabloBytes lists both. |
| Smite Paladin | **Smiter** | Universal. |

### Merged — internal variant of another page

| Variant | Becomes a variant of | Why not its own page |
| --- | --- | --- |
| **Dragon Paladin** | Holy Fire Paladin | Maxroll already models it as the "Dragon + HoJ" variant *inside* its Holy Fire guide. Same skill plan and same attack; the change is which item supplies Holy Fire. That is a gear swap, not a build. |
| **Holy Freeze Zealot** | Zealot | Wowhead's own guide opens by calling it "mostly a flavor of the Zeal Paladin build", and says the build is "cheesed by equipping for Holy Freeze rather than speccing for it". No other source carries it. It changes one aura and one gear slot. |
| **Vindicator Templar (FoH/Smite)** | FoHdin | A bossing variant: same FoH core, adds a Smite bar. Materially a variant, not a family. |
| **Tri-Brid (FoH/Hammer)** | FoHdin | Maxroll already ships it as one of four internal variants on its FoH page. |
| **Omnidin** | Tesladin / Auradin section | Single-source (Wowhead only), absent from every tier list found, and defined by aura-swapping rather than a distinct skill plan. Recorded, not given a page. Revisit if a second source picks it up. |

### Out of scope

| Excluded | Reason |
| --- | --- |
| **Redeemer's Wrath** | DiabloBytes publishes it under an explicit "EXPERIMENTAL THEORYCRAFT — NOT IN TIER LIST YET" banner and states the community has not validated it. Single source, self-declared unvalidated. |
| **All PvP builds**, including Hammerdin PvP | Only one guide exists anywhere found (Wowhead, Season 13, below its vote threshold). Maxroll, DiabloBytes and D2Runewizard have **zero** PvP pages. This fails the project's multi-source rule. See gap G6 — PvP also needs a different content model, not just a build entry. |
| **Paladin Magic Find "build"** (Wowhead) | A gearing guide, not a build. Belongs with the existing Magic Find mechanics article if anywhere. |

---

## 5. Recorded divergences

Per project policy these are documented, not resolved by preference.

**D1 — Avenger cost. Unresolved.**
Wowhead: "a very expensive build to run well… recommended that this be a
late-game switch rather than an out-of-the-gate build."
DiabloBytes: "one of the cheapest endgame Paladins to gear. A budget version
using Kingslayer or a self-found rare polearm + Rhyme shield + Treachery clears
Hell."
These are opposite answers to the single question that determines whether the
build has a real starter tier. **Blocking for the Avenger page.**

**D2 — Vengeance synergies. Resolved at Tier 1.**
DiabloBytes: "three direct synergies — Resist Fire, Resist Cold, and Resist
Lightning". Wowhead: also maxes Salvation "only for synergy for Vengeance".
Game data: all four contribute — the three resistances at ×10 and Salvation at
×2. Wowhead is correct; DiabloBytes is incomplete. Site follows Tier 1.

**D3 — Is Dragon Paladin its own build?**
Wowhead ships a dedicated Dragon Paladin guide. Maxroll models it as an internal
variant of Holy Fire Paladin. Resolved in favour of Maxroll's structure, because
the skill plan is unchanged (see §4).

**D4 — How many Auradin variants are there?**
Wowhead's Tesladin page says "there are three different versions" and lists
Tesladin, Dragon and Omnidin. Its Dragon page lists four, adding Holy Freeze
Zeal. Its Omnidin page lists four but then calls Omnidin "the most versatile of
the three". Internally inconsistent within one source. Site does not assert a
count.

**D5 — Is FoHdin a ladder starter?**
Maxroll ranks FoHdin **S** on its Ladder Start Tier List, while its own FoHdin
guide states it "assumes you have a Character at Level 75 before transitioning
to it" and tags the guide Endgame. Partially explained by the guide shipping
"FoH Starter" and "Holy Bolt Starter" variants. Site should present FoH as a
level-30+ transition with a genuine starter tier, not as a level-1 plan.

**D6 — DiabloBytes contradicts its own tier list.**
Its Paladin class page lists Avenger (A) and Auradin (A) among top builds; its
54-build master tier list contains neither, listing exactly six Paladin builds
(Hammerdin S+, FoHdin S, Dreamadin A, Smiter A, Zealot B, Holy Fire B). Treated
as the tier list being the maintained artefact.

**D7 — Doom's aura, described wrongly by Wowhead.**
Wowhead's Omnidin page states "Doom Runeword provides Level 12 Holy Freeze Aura,
which increases Defense of the party" — the description is copy-pasted from the
Exile/Defiance line above it. Holy Freeze slows; it does not raise defence.
Tier 1 confirms Holy Freeze's aura stats are `velocitypercent` and `attackrate`.
Do not reuse Wowhead's wording.

**D8 — Conviction's maximum resistance reduction.**
DiabloBytes: "drop enemy Fire, Cold, and Lightning resistances by up to −150%
(with high enough skill levels)". Tier 1: 30% baseline, +5% per level → −125% at
skill level 20. −150% requires roughly skill level 25, i.e. hard `+skills` gear.
The claim is reachable but the site should state the formula, not the headline.

---

## 6. Recommendation and implementation order

| Order | Build | Recommendation | Rationale |
| --- | --- | --- | --- |
| — | **Hammerdin** | Exists. Audit only, do not rewrite. | See §8. |
| **1** | **Smiter** | **Own page** | The largest real gap. S-tier for Ubers on both Maxroll and DiabloBytes. The site already references Ubers and Hellfire Torch from the Hammerdin page without documenting the build that actually farms them. Maxroll ships a Starter variant, so the six-tier table is honest. Distinct mechanics worth a page on their own: Smite ignores Attack Rating, and Life Steal, Mana Steal and Deadly Strike do not work with it. |
| **2** | **FoHdin** | **Own page** | S on Maxroll's Ladder Start list and S on DiabloBytes. Gives the site its first ranged Paladin and its first genuine Paladin party-support build. Complements the Hammerdin, whose clear speed is gated behind Enigma. Vindicator Templar and Tri-Brid become internal variants. |
| **3** | **Zealot** | **Own page** | The classic melee Paladin, on every source, explicitly new-player friendly, and the natural companion to the Paladin levelling journey the site already publishes. Holy Freeze Zealot folds in as a variant. Blocked on IAS — see G2. |
| **4** | **Tesladin** | **Own page** | A-tier on both ranked sources and mechanically unlike anything the site documents: the damage comes from a gear aura, so the skill plan maxes Resist Lightning, Salvation and Conviction rather than an attack. Must be presented as endgame-only — two Jah runes. Blocked on the Dream runeword entry. |
| **5** | **Holy Fire Paladin** | **Own page, low priority** | Lowest-ranked Paladin build found (Maxroll D overall and D for Ubers; DiabloBytes B). Worth a page mainly because it is the build the levelling plan naturally drifts into, and because the site should be honest about a build people will try. Dragon + Hand of Justice as an internal variant. |
| **6** | **Avenger** | **Own page — blocked** | Two sources, no tier-list presence on either ranked list, and they contradict each other on cost (D1). Cannot write a six-tier progression table without knowing whether the starter tier is real. Hold until a third source or a damage calculation settles it. |
| — | Omnidin, Holy Freeze Zealot, Dragon, Vindicator Templar, Tri-Brid | **Internal variants** | See §4. |
| — | PvP, Redeemer's Wrath, Magic Find guide | **Out of scope** | See §4. |

**Net effect:** the Paladin goes from 1 documented build to 5 published pages
plus 5 named internal variants, with one build (Avenger) explicitly held back.

---

## 7. Dependencies

### 7.1 Runewords — missing

The site has 33 runewords. These are needed by the planned builds and are absent.

| Runeword | Runes | Needed by | Blocking? |
| --- | --- | --- | --- |
| **Dream** | Io + Jah + Pul | Tesladin (×2), Omnidin, Holy Fire Dragon variant | **Yes — Tesladin cannot be written without it** |
| **Exile** | Vex + Ohm + Ist + Dol | Smiter (Life Tap), Omnidin | **Yes — one of two Life Tap routes** |
| **Dragon** | Sur + Lo + Sol | Holy Fire Dragon variant, Omnidin | Yes, for that variant |
| **Hand of Justice** | Sur + Cham + Amn + Lo | Holy Fire Dragon variant, Auradin | Yes, for that variant |
| **Last Wish** | Jah + Mal + Jah + Sur + Jah + Ber | FoHdin mercenary top end, Avenger BiS | No — top tier only |
| **Beast** | Ber + Tir + Um + Mal + Lum | Fanaticism from gear (Zealot, Omnidin) | No |
| **Phoenix** | Vex + Vex + Lo + Jah | Redemption aura | No |
| **Kingslayer** | Mal + Um + Gul + Fal | Avenger budget option per DiabloBytes | Tied to D1 |

Already present and reusable: Grief, Doom, Infinity, Enigma, Heart of the Oak,
Chains of Honor, Spirit, Call to Arms, Fortitude, Treachery, Insight, Passion,
Crescent Moon, Death, Pride, Faith, Rhyme, Ancients' Pledge, Lore, Stealth,
Smoke, Duress, Bramble, Memory, Wealth, Lionheart, Steel, Leaf.

### 7.2 Unique items — missing

| Item | Needed by | Blocking? |
| --- | --- | --- |
| **Dracul's Grasp** | Smiter — the cheaper of the two Life Tap routes | **Yes** |
| **Raven Frost** | Zealot, Tesladin, Holy Fire — Cannot Be Frozen | **Yes for every melee build** |
| **Gore Rider** | Smiter, Tri-Brid FoH — Crushing Blow | **Yes** |
| **Guillaume's Face** | Smiter — Crushing Blow and Deadly Strike | Yes |
| **The Reaper's Toll** | Tesladin mercenary — Decrepify | Yes |
| **Highlord's Wrath** | Zealot, Avenger — Deadly Strike and IAS | Yes |
| **Steelrend** | Smiter alternative | No |
| **Heaven's Light** | Tri-Brid FoH | No |
| **Griffon's Eye** | Tesladin | No |
| **Dwarf Star**, **Wisp Projector** | Dragon Paladin, Tesladin — elemental absorb | No |
| **Verdungo's Hearty Cord** | Melee builds generally | No |
| **Hellfire Torch** | Every Paladin endgame tier; currently only a plain label on the Hammerdin page, not an entity | Yes — it is referenced but not modelled |
| **Annihilus**, **Gheed's Fortune** | General endgame charms | No |

Already present and reusable: Herald of Zakarum, Stormshield, Crown of Ages,
Harlequin Crest, Vampire Gaze, String of Ears, Duriel's Shell, War Traveler,
Sandstorm Trek, Stone of Jordan, Mara's Kaleidoscope, Arachnid Mesh.

### 7.3 Farming areas

All Paladin farming targets found map to areas the site already has —
**except the Uber content**, which is the Smiter's entire purpose.

- Present and reusable: Chaos Sanctuary, Travincal, Worldstone Keep, Pit,
  Ancient Tunnels, Mephisto, Countess, Mausoleum, Pindleskin, Lower Kurast,
  Nihlathak, Arcane Sanctuary, Secret Cow Level, River of Flame.
- **Missing: Uber Tristram / the Pandemonium Event.** Also the mini-Uber
  encounters (Lilith, Duriel, Izual in their Uber forms). The key-dropping
  bosses themselves are already covered — Countess, the Summoner via Arcane
  Sanctuary, and Nihlathak.
- **Missing: Diablo Clone**, referenced by tracker tooling on two sources but
  not by any Paladin guide read here. Not required for this phase.

The content model question is real: `FarmingArea` carries area levels per
difficulty from `levels.txt`, and Uber Tristram is a fixed-level event, not a
rotating farm. See gap G4.

### 7.4 Mercenaries

No gaps. All four are already documented, and the two the Paladin guides call
for — the Act 2 Desert Mercenary (Might, Holy Freeze) and the Act 5 Barbarian
(Maxroll's FoH top-end uses two Last Wish weapons on it) — both exist.

### 7.5 Breakpoints

| Table | Status | Impact |
| --- | --- | --- |
| FCR | Present | Hammerdin and FoHdin covered |
| FHR | Present | All builds |
| FBR | Present | All shield builds |
| **IAS** | **Missing entirely** | **Blocks Zealot, Smiter, Tesladin, Holy Fire and Avenger — every melee Paladin** |

`BreakpointTarget.stat` already accepts `"ias"`, so the type is ready; there is
no data and no table. This is the largest single blocker in this plan. It is
also already listed as unverified in
[`../sources/README.md`](../sources/README.md). See gap G2.

### 7.6 Mechanics articles

- Present: Magic Find, Area levels and treasure classes, Resistances and
  immunities, Terror Zones, Sockets.
- **Missing: the physical Sunder Charm ("Bone Break").** Maxroll's Zeal guide
  leans on it for physical immunes. Only Cold Rupture is currently documented,
  from the Blizzard Sorceress work.
- **Missing: an Ubers / Pandemonium Event article.** Prerequisite for the
  Smiter page to explain what it is farming and why.

---

## 8. Hammerdin coverage audit

Audited, not rewritten, per the brief.

**Complete:** all six gear tiers (`starter` → `bis`), 17 skill allocations,
FCR ×2 / FHR / FBR breakpoint targets, 9 farming entries, `immunityPlan`,
`levelingPath`, `selfFoundNotes`, `hardcoreNotes`, `flexPoints`,
`mercenaryNotes`, `mercenary`, all 8 ratings, `confidence: "verified"`,
`complete: true`.

**Gaps found — none blocking, all deferred to a later pass:**

1. `modes` and `release` are unset. Both optional. `modes` matters once a PvP
   build exists or once ladder-only gear is called out; `release` matters if the
   site starts filtering by expansion.
2. **Hellfire Torch appears as a plain `label` in two gear tiers rather than an
   item reference.** Once the Torch is modelled as an entity it should become a
   real ref so the reverse index ("builds that use this") works.
3. The build rates `ubers: 3` and mentions Uber Tristram in `flexPoints`, but
   there is no Ubers content to link to. Resolves when §7.6 lands.
4. No cross-link to the Smiter, which is the standard answer to "the Hammerdin
   is mediocre at Ubers". Should be added when the Smiter page ships — a
   one-line addition, not a rewrite.

---

## 9. Gaps to resolve before implementation

Ordered by how much they block.

| ID | Gap | Blocks | Suggested resolution |
| --- | --- | --- | --- |
| **G1** | **No source is on our Patch 3.3 / Season 15 baseline.** Maxroll is S14, Wowhead S13, DiabloBytes' tier list S13. | Confidence rating on every Paladin page | Read the Patch 3.3 and Season 14→15 notes specifically for Paladin skill, aura, runeword and Crushing Blow changes. If none, record "no Paladin-affecting changes found" explicitly and set confidence accordingly. |
| **G2** | **No IAS breakpoint data or table.** | Zealot, Smiter, Tesladin, Holy Fire, Avenger — 4 of 5 planned pages | IAS in D2 is not one table: it depends on the weapon's speed modifier and the skill's animation. Decide whether `BreakpointTable` can express that or whether it needs a per-weapon-class model. This is a content-model decision, not just data entry. |
| **G3** | **The Fist of the Heavens cast-delay claim is unverified.** Wowhead states the delay went from 1s to 0.4s and no longer shares a cooldown; Maxroll says "Patch 2.4 MASSIVELY buffed this build". The `delay` column is **absent from the d2data `skills.json` extraction**, so Tier 1 could not confirm it. | How the FoHdin page describes its own playstyle | Find the delay data in another game-data file, or locate the 2.4 patch notes. Until then, describe the rhythm without asserting the numbers. |
| **G4** | **Uber Tristram / Pandemonium is not modelled.** | Smiter (order 1) | Decide whether it is a `FarmingArea` with a fixed level, a mechanics article, or a new content type. It is the Smiter's whole purpose, so this must be settled first. |
| **G5** | **Avenger cost divergence (D1).** | Avenger (order 6) | Find a third source, or compute whether the DiabloBytes budget kit (Kingslayer + Rhyme + Treachery) actually clears Hell given the Tier 1 Vengeance formula. Do not publish a starter tier on a coin flip. |
| **G6** | **PvP has one source and no content model.** | Any PvP page | Out of scope for this phase. A PvP page needs its own fields — duelling rules, max block vs max damage, no `/players` setting — which the current `Build` type does not express. Treat as a separate future phase, not a build backlog item. |
| **G7** | **Physical Sunder Charm not documented.** | Zealot, Smiter | Verify the charm's real name and effect at Tier 1/2 before writing. Note Patch 3.3 changed Latent Sunder Charm drop rules (see `00-game-state.md`), so this must be written against 3.3, not older guides. |
| **G8** | **Herald of Zakarum has no Faster Cast Rate**, which matters for whether a Hammerdin or FoHdin can wear it. Noted on the existing Hammerdin page but never verified against a stat source. | FoHdin gear tiers | Cross-check the item's stat lines at Tier 3 before the FoHdin page reuses the claim. |

---

## 10. Sources consulted

Recorded for `docs/sources/README.md` once this plan is executed.

| URL | Tier | Retrieved | Declared baseline |
| --- | --- | --- | --- |
| `raw.githubusercontent.com/blizzhackers/d2data/master/json/skills.json` | 1 | 2026-08-30 | Current |
| `maxroll.gg/d2/build-guides/paladin` | 4 | 2026-08-30 | Season 14 |
| `maxroll.gg/d2/guides/smite-paladin` | 4 | 2026-08-30 | Season 14, updated 2026-07-09 |
| `maxroll.gg/d2/guides/fist-of-the-heavens-paladin` | 4 | 2026-08-30 | Season 14 |
| `maxroll.gg/d2/guides/zeal-paladin` | 4 | 2026-08-30 | Season 14 |
| `maxroll.gg/d2/guides/dream-paladin` | 4 | 2026-08-30 | Season 14 |
| `maxroll.gg/d2/guides/holy-fire-paladin` | 4 | 2026-08-30 | Season 14 |
| `maxroll.gg/d2/tierlists/ladder-start-tier-list` | 4 | 2026-08-30 | Season 14 |
| `maxroll.gg/d2/tierlists/uber-tier-list` | 4 | 2026-08-30 | Season 14 |
| `wowhead.com/diablo-2/guides/paladin-builds` (12 guides) | 4 | 2026-08-30 | Season 13; Holy Freeze guide Patch 2.4 |
| `diablobytes.com/d2-resurrected/classes/paladin/` | 4 | 2026-08-30 | Season 14 / Patch 3.2 |
| `diablobytes.com/d2-resurrected/builds/` (tier list) | 4 | 2026-08-30 | Season 13 |
| `diablobytes.com/d2-resurrected/builds/avenger-paladin/` | 4 | 2026-08-30 | Updated May 2026 |
| `d2runewizard.com/guides` | 3 | 2026-08-30 | Not declared; Hammerdin updated 2025-04-11 |
| `classic.battle.net/diablo2exp/skills/paladin*.shtml` | 2 | 2026-08-30 | **Dead — Document Not Found** |
| `icy-veins.com/d2/paladin-builds` | 4 | 2026-08-30 | **Blocked — Cloudflare** |

No text was copied from any source. Tier ratings, variant names, aliases and
stated costs are attributed above; all mechanical numbers come from Tier 1.
