# Sorceress build families — research and editorial plan

**Researched:** 2026-08-30
**Baseline:** Diablo II: Resurrected, Patch 3.3 / Ladder Season 15 (see
[`00-game-state.md`](00-game-state.md))
**Status:** Executed. All ten planned pages shipped, plus their dependencies.

| Planned | Outcome |
| --- | --- |
| Lightning, Fire Ball Meteor, Frozen Orb, Nova | Shipped (lote 1) |
| Enchant, Hydra, Meteorb, Frost Nova | Shipped (lote 2) |
| Fire Wall | Shipped (lote 3) |
| Melee Sorceress (Zeal + Werebear as variants) | Shipped (lote 3), merged as recommended |
| Magic Find, self-wield Infinity, Hydra/Orb, Fireball | Documented as internal variants, as planned |
| PvP, Blizzard/Frozen Orb | Not implemented, as planned |
| **Enchant promoted from batch 3** | Done — the ordering recommendation was accepted |
| **Nova moved after the two cheap builds** | Done |

**Gaps closed during implementation:** G2 (Demon Machine added), G5 (all six
Sunder Charms named in the resistances article with their real penalty), G6
(Throne of Destruction added). **G4 partially** — Energy Shield's base ratio of
two mana per point of damage is documented on the Nova and Melee pages; the
Telekinesis per-level figure is still unverified and is stated as such rather
than guessed. **G3 stands**: Blizzard/Frozen Orb was excluded for want of a
source, and nothing found since changes that.

**Three errors this pass surfaced in already-shipped content**, all now covered
by permanent checks in `check:content`:

1. **Unspendable skill plans.** Lightning Mastery requires Thunder Storm and
   Frozen Orb requires Blizzard; three builds allocated the skill without the
   prerequisite. The plans rendered fine and could not be spent. Now checked.
2. **Mechanics translation drift.** A locale overlay replaces a mechanics body
   wholesale, so adding blocks to the source left pt-BR a block short with the
   slug still counted as covered. Now checked block-for-block.
3. **Gear affix overflow, twice.** `lookFor` renders as a nowrap badge; an
   over-long entry widened the page at mobile widths. Now capped at 40
   characters, and `Badge` truncates rather than stretching.

> Same method as [`01-paladin-builds.md`](01-paladin-builds.md). This document
> decides *which* Sorceress builds the site documents, at what granularity, and
> in what order. Numbers are marked with the tier they came from.

---

## 1. What could and could not be consulted

| Source | Tier | Sorceress coverage | Declared baseline | Usable |
| --- | --- | --- | --- | --- |
| `skills.json` (blizzhackers/d2data) | 1 | All 30 Sorceress skills, required levels, damage types, skill parameters | Current extraction | **Yes — primary** |
| The Arreat Summit | 2 | — | Pre-D2R | **No.** Its class skill pages return *Document Not Found*, as with the Paladin. |
| D2Runewizard | 3 | Blizzard Sorceress guide (2025-04-10); breakpoint tables | Not declared | Yes, narrow |
| Maxroll | 4 | **12 endgame guides + a levelling guide** | **Season 14** | Yes |
| Wowhead | 4 | 8 build guides + magic find + levelling, **all by one author** | Not declared per guide | Yes, with caveats |
| DiabloBytes | 4 | 10 Sorceress builds in its master tier list | Tier list **S13** | Yes, with caveats |
| Icy Veins | 4 | Unknown | — | **No.** Cloudflare bot protection. Not bypassed. |

**Still no source on our baseline.** Maxroll is Season 14 across every Sorceress
guide (all updated 2026-05-22), DiabloBytes' tier list is Season 13. Gap G1 from
the Paladin pass carries over unchanged.

**Wowhead is weaker here than it was for the Paladin.** All ten Sorceress guides
are written by a single author, where the Paladin set had four. Only the
Lightning and Levelling guides have cleared their vote thresholds. It is used
below for alias evidence and nothing else.

**Maxroll's coverage is unusually deep for this class** — twelve endgame guides,
more than any other class on the site — which makes it the primary taxonomy
source for this pass.

---

## 2. Tier 1 facts established in this pass

From `skills.json`. Three of these change how builds must be framed.

| Skill | Req. level | Damage | Key parameters |
| --- | --- | --- | --- |
| Frost Nova | **6** | cold | Damage synergy param 10 |
| Static Field | 6 | lightning | Radius 5 +1/level. **HP % damage 25** |
| Fire Ball | 12 | fire | Explosion radius 4. Damage synergy param 14 |
| Nova | 12 | lightning | Damage synergy param 5 |
| Lightning | 12 | lightning | Damage synergy param 8 |
| Chain Lightning | 18 | lightning | Jump radius 20 |
| Fire Wall | 18 | fire | Two damage synergies |
| Enchant | 18 | fire | Buff duration 3600 +600/level. **% Damage for Ranged Weapons = 33** |
| Teleport | 18 | — | — |
| Glacial Spike | 18 | cold | Freeze length 50 +3/level |
| Blizzard | 24 | cold | Area radius 7 |
| Meteor | **24** | fire | Explosion radius 6. Ground fire 30 +15/level |
| Energy Shield | 24 | — | **Mana per HP damage = 32 sixteenths**, i.e. 2 mana per point of damage at base |
| Thunder Storm | 24 | lightning | Buff duration 3600 +600/level |
| **Frozen Orb** | **30** | cold | Damage synergy param 2 |
| **Hydra** | **30** | fire | Duration 250. Max 18 hydras |
| Cold Mastery | 30 | — | **Resistance reduction 20% baseline, +5%/level** |
| Lightning Mastery | 30 | — | **Damage 50% baseline, +12%/level** |
| Fire Mastery | 30 | fire | **Damage 30% baseline, +7%/level** |

Editorially, three matter:

1. **Frozen Orb and Hydra both require level 30.** Both are widely described as
   ladder starters, and both are — but not from level 1. Any "starter" framing
   has to say what you play for the first thirty levels, exactly as the FoHdin
   page had to.
2. **Enchant has a dedicated ranged-weapon damage parameter (33%).** This is the
   mechanical basis of the modern bow/crossbow Enchantress, and it is why that
   build is a real thing rather than a curiosity. Maxroll attributes the change
   to Patch 2.6.
3. **The three masteries are not equivalent.** Cold Mastery reduces enemy
   resistance (20% + 5%/level); Lightning and Fire Mastery increase your damage
   (50% + 12%, and 30% + 7%). That is why cold builds handle immunity
   differently from fire and lightning builds, and it should be stated once
   rather than re-derived per page.

As with the Paladin auras, the extraction records that synergies exist and their
magnitudes without naming the source skills, so synergy identities below are
published consensus rather than Tier 1.

---

## 3. Build catalogue

Rankings are from the two sources that publish them. Maxroll rates within its
own build list; DiabloBytes rates across all 54 builds in the game.

| # | Canonical | Aliases | Primary skill | Damage | Maxroll | DiabloBytes |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | **Blizzard Sorceress** | Blizz Sorc | Blizzard | cold | **S** | S |
| 2 | **Lightning Sorceress** | Light Sorc, Lightning/Chain Lightning | Lightning | lightning | **S** | S |
| 3 | **Nova Sorceress** | Novamancer | Nova | lightning | **S** | **S+** |
| 4 | **Fire Ball Meteor Sorceress** | Fire Sorc, Fireball Sorc, Meteor Sorc | Fire Ball + Meteor | fire | **S** | S |
| 5 | **Enchant Sorceress** | Enchantress, Demon Machine Sorc, Bowsorc | Enchant | fire + physical | A | **S** |
| 6 | **Frozen Orb Sorceress** | Orb Sorc | Frozen Orb | cold | A | B |
| 7 | **Hydra Sorceress** | — | Hydra | fire | B | B |
| 8 | **Meteorb Sorceress** | Frozen Orb Meteor Sorceress | Meteor + Frozen Orb | fire + cold | B | B |
| 9 | **Frost Nova Sorceress** | — | Frost Nova | cold | B | B |
| 10 | **Fire Wall Sorceress** | — | Fire Wall | fire | B | C |
| 11 | *Zeal Sorceress* | Passion Sorc | Zeal (from Passion) | lightning + physical | C | **absent** |
| 12 | *Werebear Sorceress* | Bear Sorceress | Werebear (from Beast) | physical + lightning | C | **absent** |

### Purpose, stage, cost

| # | Canonical | Purpose | Stage | Cost | Hard dependency |
| --- | --- | --- | --- | --- | --- |
| 1 | Blizzard | Boss farming, magic find | **Starter → endgame** | Low | None |
| 2 | Lightning | All-round; Baal, key bosses, Arcane Sanctuary | Endgame | Medium → high | Infinity for lightning immunes |
| 3 | Nova | Density destruction | Endgame | **Very high** | **Self-wielded Infinity** — this is the standard setup, not a variant |
| 4 | Fire Ball Meteor | Boss farming, key farming | **Starter → endgame** | Low → medium | A fire Sunder Charm, or Infinity |
| 5 | Enchant | Ranged physical + fire; cow level, Stony Tomb | Endgame | Medium → high | **Demon Machine** crossbow |
| 6 | Frozen Orb | Boss farming, magic find | **Starter from 30** | Low | None |
| 7 | Hydra | Single target, key farming, bossing | **Starter from 30** | Low → medium | A fire Sunder Charm |
| 8 | Meteorb | Two damage types for immunity coverage | Starter → mid | Low | None |
| 9 | Frost Nova | Close-range cold area damage | Endgame | Medium | — |
| 10 | Fire Wall | Ground denial, Ubers | Endgame | Medium | — |
| 11 | Zeal Sorc | Melee novelty; Ubers | Endgame | **Very high** | **Two Dreams plus a Passion** |
| 12 | Werebear Sorc | Melee novelty; Ubers | Endgame | **Very high** | **Beast plus a Dream** |

---

## 4. Deduplication

### The starting inventory, resolved

| Inventory item | Resolution |
| --- | --- |
| Blizzard | Exists. Audit only. |
| Lightning | Canonical build #2. |
| Nova / Energy Shield Nova | **One build.** Energy Shield is part of the Nova build, not a separate one — Maxroll's variants are Starter, Standard, Magic Find and Hydra Hybrid, none of them an "Energy Shield" split. |
| Fireball | **Not a separate build.** Merges into #4. |
| Meteor/Fireball | Canonical build #4. Maxroll publishes it as one guide under both names. |
| Frozen Orb | Canonical build #6. |
| Meteorb | Canonical build #8. Maxroll's own title is "Frozen Orb Meteor Sorceress", and it names "Meteorb Sorc" as the alias. |
| Hydra | Canonical build #7. |
| Hydra/Frozen Orb | **Variant.** It is the Hydra guide's own *Starter* variant — you spec cold or lightning early for immunity coverage, then respec fully into fire. Not a build. |
| Blizzard/Frozen Orb | **No source found.** Neither Maxroll, Wowhead nor DiabloBytes documents this pairing. It is a plausible community hybrid; without evidence it does not get a page. Tracked as gap G3. |
| Enchantress melee | **Misnamed in the inventory.** The melee Sorceress is not Enchant-based — it is the Zeal or Werebear Sorceress, built on Dream, Passion and Beast. Enchant's modern form is the *ranged* build. See below. |
| Bow Enchantress / Demon Machine | **This is the Enchant Sorceress** (#5), not a variant of it. Maxroll's Enchant guide is the Demon Machine build. |
| Bear Sorceress | Build #12, and see the melee recommendation below. |
| self-wield Infinity Nova | **Not a variant.** Maxroll states Infinity in the Sorceress's own hands is the *best* Nova setup, precisely because it frees the mercenary for Insight. It is the standard build. |
| Magic Find variants | **Internal variant on nearly every build.** Maxroll ships a Magic Find variant inside Lightning, Nova, Fire Ball Meteor, Frozen Orb, Hydra, Blizzard and Enchant. Giving these pages would produce seven near-identical duplicates. |

### Two families the inventory missed

**Frost Nova Sorceress** and **Fire Wall Sorceress** are both carried by Maxroll
*and* DiabloBytes with their own guides and tier placements, and neither appears
in the starting inventory. On the evidence they belong ahead of several
inventory items that are only variants.

### The melee Sorceress question

Zeal Sorceress and Werebear Sorceress are **single-source**: Maxroll has full
guides for both, DiabloBytes' 54-build tier list carries neither, and Wowhead
has neither. Both sit at Maxroll's C tier. Both are built on the same premise —
a Sorceress who does not cast, powered by Dream for damage and a runeword that
grants a non-class skill (Passion's Zeal, Beast's Werebear).

Following the Paladin precedent, where single-source Omnidin was documented
inside another page rather than given its own, the recommendation is **one
shared page — "Melee Sorceress" — with Zeal and Werebear as its two variants**.
They share a family, a cost profile (two Dreams, or a Dream plus a Beast), a
purpose (novelty and Ubers) and a tier. Two pages would be two near-identical
gear tables.

### Out of scope

| Excluded | Reason |
| --- | --- |
| **PvP** | Zero Sorceress PvP guides on Maxroll, DiabloBytes or Wowhead. Unlike the Paladin, where one existed, here there is nothing at all. Same conclusion as the Paladin pass, reached faster. |
| **Sorceress Magic Find "build"** (Wowhead) | A gearing guide, not a build. It belongs with the existing Magic Find mechanics article. |

---

## 5. Recorded divergences

**D1 — Frozen Orb's ranking.** Maxroll A, DiabloBytes B. Small, and both are in
the same band; recorded but not blocking.

**D2 — Fire Wall's ranking.** Maxroll B, DiabloBytes C. Also small.

**D3 — Enchant's ranking and position.** Maxroll A, DiabloBytes S. The
divergence matters because the starting inventory places this build in the last
implementation batch while both sources rank it in their top two bands. See the
ordering recommendation.

**D4 — Blizzard's own ranking versus the site's existing framing.** Maxroll rates
Blizzard S and tags it **Starter**; the site's existing page sets
`budget: "low"` and `difficulty: "beginner"`, which agrees. No conflict — noted
because the Blizzard page is the one being audited rather than written.

**D5 — Is Nova affordable?** Maxroll's Nova guide states the best setup uses a
self-wielded Infinity, which is a Ber and a Jah among four runes. Its Starter
variant exists, but a build whose defining item is Infinity cannot be presented
as cheap. The Paladin pass's Avenger lesson applies: say which resource is
scarce.

---

## 6. Recommendation and implementation order

The user's provisional order is kept where the evidence supports it. Two
changes are recommended and flagged.

| Order | Build | Recommendation | Rationale |
| --- | --- | --- | --- |
| — | **Blizzard** | Exists. Audit only. | See §8. |
| **1** | **Lightning** | Own page | S on both sources. The site's only Sorceress is cold; this adds lightning and the Infinity relationship the class is defined by. |
| **2** | **Fire Ball Meteor** | Own page | S on both. Adds fire, and it is a genuine ladder starter — which the site currently only offers in cold. **Moved ahead of Nova** because it is cheap and Nova is not. |
| **3** | **Frozen Orb** | Own page | A/B, a true starter from level 30, and it completes the cold pair with Blizzard. |
| **4** | **Nova** | Own page | S/S+, but its standard setup is a self-wielded Infinity. Best written after the cheaper builds so the site is not top-heavy. |
| **5** | **Enchant (Demon Machine)** | Own page | **Recommended promotion from batch 3.** A on Maxroll and S on DiabloBytes, and mechanically unlike anything on the site — a Sorceress whose damage is a crossbow. |
| **6** | **Hydra** | Own page | B/B, cheap, and a real single-target answer. Its Hydra/Frozen Orb starter is a variant here. |
| **7** | **Meteorb** | Own page | B/B. Its distinct value is two damage types across two masteries, which is a different immunity plan from either parent. |
| **8** | **Frost Nova** | Own page | B/B on both sources, and absent from the starting inventory. |
| **9** | **Fire Wall** | Own page | B/C. Lowest-ranked of the caster builds; worth a page mainly for Ubers. |
| **10** | **Melee Sorceress** | **One page, two variants** | Zeal and Werebear together. Single-source and C tier, so one page rather than two. |
| — | Magic Find, self-wield Infinity, Hydra/Orb, Fireball | **Internal variants** | See §4. |
| — | PvP, Blizzard/Frozen Orb | **Out of scope / unsupported** | See §4 and G3. |

**Net effect:** the Sorceress goes from 1 documented build to 10 pages plus a
set of named internal variants — with three inventory items resolved as
variants and two families added that the inventory did not have.

**The two recommended changes to the provisional order**, stated plainly so they
can be rejected:

1. **Enchant moves from batch 3 to batch 1–2.** Both ranked sources place it in
   their top two bands; the inventory placed it last.
2. **Nova moves after Fire Ball Meteor and Frozen Orb.** Not because it is
   weaker — it is the highest-rated Sorceress build on DiabloBytes — but
   because its standard setup requires Infinity, and shipping two cheap builds
   first serves the site's progression-first premise better.

---

## 7. Dependencies

### 7.1 Runewords

Present and reusable: Spirit, Insight, Infinity, Enigma, Heart of the Oak,
Chains of Honor, Lore, Stealth, Ancients' Pledge, Rhyme, Smoke, Memory, Wealth,
Call to Arms, Passion, Death, **Dream** (added in the Paladin pass).

| Missing | Needed by | Blocking? |
| --- | --- | --- |
| **Beast** | Werebear Sorceress — it is what grants the form | Yes, for build 10's Werebear variant |
| **Leaf** | Fire builds while levelling — it is already on the site; verify | No |

The Paladin pass already added Dream, which builds 10 and 3 both want. That is
the largest single dependency already discharged.

### 7.2 Unique items

Present and reusable: The Oculus, Death's Fathom, Nightwing's Veil, Harlequin
Crest, Skin of the Vipermagi, Ormus' Robes, Magefist, Frostburn, Arachnid Mesh,
War Traveler, Sandstorm Trek, Stone of Jordan, Mara's Kaleidoscope, Wizardspike,
Tarnhelm, Nagelring, Stormshield, Crown of Ages, Vampire Gaze, Raven Frost,
Highlord's Wrath, Gore Rider.

| Missing | Needed by | Blocking? |
| --- | --- | --- |
| **Demon Machine** | Enchant Sorceress — the build is named after it | **Yes** |
| **Griffon's Eye** | Lightning, Nova | Yes at the top tiers |
| **Eschuta's Temper** | Fire and lightning builds | Yes at the top tiers |
| **Thundergod's Vigor** | Lightning, Nova — lightning absorb and max lightning resist | No |
| **Lidless Wall** | Cheap caster shield across several builds | No |
| **Titan's Revenge / other bow uniques** | Enchant's budget tiers | To verify |
| **Spirit Shroud, Vipermagi alternatives** | Levelling tiers | No |

### 7.3 Farming areas

No gaps expected. Maxroll's Sorceress guides point at Mephisto, Andariel,
Pindleskin, Countess, Travincal, Chaos Sanctuary, Worldstone Keep, Ancient
Tunnels, the Pit, Stony Tomb, Arcane Sanctuary and the Secret Cow Level — all of
which the site already documents. **Baal** is named repeatedly and the site does
not have a Throne of Destruction / Baal entry; that is the one likely addition.

### 7.4 Mercenaries

No gaps. The Act 2 Desert Mercenary with Insight and Infinity covers nearly
every build; the Nova page will need to explain the inversion where the
*Sorceress* carries Infinity and the mercenary carries Insight.

### 7.5 Breakpoints

| Table | Status |
| --- | --- |
| FCR (Sorceress) | Present — 0/9/20/37/63/105/200 |
| FCR (Sorceress, Lightning/Chain Lightning) | **Present**, and it is the one that matters most here: the Lightning Sorceress must be planned against the *separate* table |
| FHR | Present |
| FBR | Present |
| IAS | **Missing** — but only the melee Sorceress and the Enchant bow build need it |

This is a much better position than the Paladin pass. Eight of the ten planned
pages are casters and are fully served by the existing FCR and FHR tables.

### 7.6 Mechanics

- Present: Magic Find, Area levels, Resistances and immunities, Terror Zones,
  Sockets.
- **Missing: Energy Shield as a mechanic.** The Nova build depends on it, its
  mana-per-damage ratio is a real number (Tier 1: 2 mana per point at base,
  modified by Telekinesis), and it is the single most misunderstood defensive
  mechanic in the game. Worth an article, or at minimum a thorough section on
  the Nova page.
- **Missing: the fire and lightning Sunder Charms.** Only Cold Rupture is
  documented. Maxroll's Hydra guide explicitly plans around **Flame Rift**.

---

## 8. Blizzard Sorceress coverage audit

Audited, not rewritten.

**Complete:** all six gear tiers, `damageTypes: ["cold"]`, `primarySkill:
"blizzard"`, `difficulty: "beginner"`, `budget: "low"`, all eight ratings,
`confidence: "verified"`, `complete: true`, plus `modes: {}`.

**No verifiable errors found in this pass.** The two claims worth re-checking
against the new Tier 1 data both hold:

- Static Field's **25% of current life** matches `HP % Damage = 25` exactly.
- Cold Mastery's behaviour as a *resistance reduction* rather than a damage
  increase matches `Cold Resistance reduction baseline 20, +5 per level`.

**Non-blocking observations:**

1. `modes: {}` is an empty object rather than absent. Harmless, but it should
   either carry real values or be removed for consistency with the Paladin
   builds.
2. The page has no cross-link to Frozen Orb, which will be the obvious "what
   else is cold" question the moment build 3 ships. A one-line addition then,
   not a rewrite now.
3. Hellfire Torch appears as a plain label rather than a reference, the same
   observation recorded for the Hammerdin.

---

## 9. Gaps to resolve before implementation

| ID | Gap | Blocks | Resolution |
| --- | --- | --- | --- |
| **G1** | No source is on Patch 3.3 / Season 15. Maxroll is S14, DiabloBytes S13. | Confidence on every page | Carried over from the Paladin pass. Read the 3.3 notes for Sorceress-affecting changes and record the result explicitly. |
| **G2** | **Demon Machine is not documented** and the Enchant build is named after it. | Enchant (order 5) | Add it as a unique item first, with Tier 1 stats, exactly as the Paladin dependencies were handled. |
| **G3** | **Blizzard/Frozen Orb has no source.** | Nothing — it is proposed for exclusion | Either find two sources or leave it out. Do not write it on the strength of it sounding plausible. |
| **G4** | **Energy Shield is undocumented as a mechanic.** | Nova (order 4) | Tier 1 gives the base ratio; the Telekinesis interaction needs verifying before it is written. |
| **G5** | **Fire and lightning Sunder Charms undocumented.** | Hydra, Fire Ball Meteor, Lightning | The charms exist in `uniqueitems.json` (Flame Rift, Crack of the Heavens) alongside the already-documented Cold Rupture. Straightforward to add. |
| **G6** | **No Baal / Throne of Destruction farming area.** | Lightning, Nova | Several guides name it as a primary target. Add before order 1 or accept a thinner farming section. |
| **G7** | Synergy identities are consensus, not Tier 1 — same limitation as the Paladin auras. | All pages | Handle as before: follow the published plan, state magnitudes only where Tier 1 supplies them, and set `confidence` accordingly. |

---

## 10. Sources consulted

| URL | Tier | Retrieved | Declared baseline |
| --- | --- | --- | --- |
| `raw.githubusercontent.com/blizzhackers/d2data/master/json/skills.json` | 1 | 2026-08-30 | Current |
| `maxroll.gg/d2/build-guides/sorceress` and its 13 linked guides | 4 | 2026-08-30 | Season 14 |
| `wowhead.com/diablo-2/guides/sorceress-builds` (10 guides, one author) | 4 | 2026-08-30 | Not declared |
| `diablobytes.com/d2-resurrected/builds/` (tier list) | 4 | 2026-08-30 | Season 13 |
| `d2runewizard.com/guides` | 3 | 2026-08-30 | Blizzard guide 2025-04-10 |
| `icy-veins.com` | 4 | 2026-08-30 | **Blocked — Cloudflare** |

No text was copied. Tier ratings, variant names, aliases and stated costs are
attributed; all mechanical numbers come from Tier 1.
