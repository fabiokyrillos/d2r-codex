# Assassin — foundation notes and build inventory

Baseline: **D2R Patch 3.3 / Ladder Season 15**. Data pinned at
`blizzhackers/d2data@fc469993502d0498809b9fc1af140ee2a9eb8902`
("Updated for patch 3.3.93847"), the same commit the skill graph is generated
from. Verified 2026-09-05.

This note covers what was settled while authoring the class foundation, and the
build inventory that the **next** cycle will draw on. No build page exists yet,
and nothing on the site promises one.

---

## 1. What the foundation shipped

Thirty skills, three trees, starting attributes, sixty pages in two locales.
Everything downstream — the sitemap, the search index, the tree on the class
page, the tile on every build page — comes from adding `ass` to `classOf` in the
generator. There is no second list.

### Six slugs are not what the table calls them

`skills.txt` carries working titles the shipped game replaced. Two of them name
a *different* concept, which is what makes slugifying dangerous rather than
merely ugly — `royal-strike` would have been the URL of the most-searched skill
the class has.

| `skill` column | published slug | pinned by |
| --- | --- | --- |
| Fire Trauma | `fire-blast` | page 1, level 1, `srvmissile = "bomb in air"` with `lob = 1`, fire, radius 5 |
| Shock Field | `shock-web` | page 1, level 6, requires Fire Trauma, lightning, Param1 "# of Missiles created" = 6 |
| Wake of Fire Sentry | `wake-of-fire` | page 1, level 12, `summon = wakeofdestruction`, `pettype = assassintrap` |
| Inferno Sentry | `wake-of-inferno` | page 1, level 24, `summon = infernosentry`, HitShift 4 |
| Quickness | `burst-of-speed` | page 2, level 6, aurastate granting `velocitypercent` 15–70 and `attackrate` 15–60 |
| Royal Strike | `phoenix-strike` | page 3, level 30, `progressive = 1`, missiles named meteor / chainlightning / chaosice |

### Five mechanics that are not like the other classes

Each is a rule that is right elsewhere on this site and wrong here. Each has a
control in `scripts/assassin-rules.ts`, exercised by `npm run test:assassin`.

- **Charge-ups are not finishers.** Six rows carry `progressive = 1` and build
  charges; four carry `finishing = 1` with `prgchargesconsumed = 1` and spend
  them. The sets are disjoint.
- **Charge duration is 375 frames — 15.0 s**, identical on all six rows
  (`auralencalc = par3`). This settles a live disagreement: the same specialist
  site states 14 s on its Dragon Talon page and 15 s on its Phoenix Strike page.
- **The kicks do not use the weapon.** Dragon Talon, Dragon Tail and Dragon
  Flight carry `Kick = 1` and no `SrcDam` at all. Dragon Claw sits in the same
  tree row, is a finisher like them, and carries `SrcDam = 128` with no `Kick`.
- **The blades take three quarters.** `SrcDam = 96` of 128 on Blade Sentinel,
  Blade Fury and Blade Shield.
- **Five traps, shared.** `petmax = 5` on every sentry; it is a ceiling on traps
  in total, not per skill. Shadow Warrior and Shadow Master share
  `pettype = shadowwarrior` with `petmax = 1`, so they replace each other.
- **Venom is not poison as this site models poison.** `ELen = 10` under
  `aurastat3 = skill_poison_override_length`: four tenths of a second, and it
  *overrides* rather than adds. Poison Nova, the shortest poison anywhere else on
  the site, is five times longer.

### Two claims from secondary sources that the data contradicts

Both were encountered in current guides and are **not** published here.

- *"Traps are laid at a rate governed by Faster Cast Rate."* Laying a trap is an
  attack (`UseAttackRate = 1` on every trap row); attack speed governs it, and
  Burst of Speed raises it. The 102% FCR figure those guides also quote is for
  Mind Blast, Cloak of Shadows, Fade and Teleport, which a trapper casts
  constantly — two true statements about different skills, collapsed into one
  false one.
- *"Kick speed comes from the boots."* Boots supply kick *damage*. Nothing in the
  boots' row touches speed.

Both need a breakpoints pass of their own before anything is published about
them; the foundation states neither.

---

## 2. The Mosaic problem, and why it shapes the build cycle

**Verified at Tier 1**, from `json/runes.json` at the pinned commit:

```
Mosaic (internal Runeword173)   Mal + Gul + Amn   itype1: h2h (claws only)
  disallowCraftingInLadder : 1
  firstLadderSeason        : 3
  lastLadderSeason         : 12
  charge-noconsume         : 50 / 50
  skilltab par=20          : 2 / 2      (+2 Martial Arts)
  swing2                   : 20 / 20    (+20% IAS)
  dmg%                     : 200 / 250
  extra-fire/cold/ltng     : 8 / 15 each
```

Two facts, and they are usually confused with each other:

1. **It has not been nerfed.** `charge-noconsume` is still 50. No property
   changed.
2. **It cannot be made on Ladder.** `disallowCraftingInLadder: 1` is set on
   **exactly one runeword out of all 181 in the file** — this one. Blizzard's
   stated reason was a graphics fault that could crash clients, not balance.

So there are effectively two metas, and every major guide documents only the
non-Ladder one. Any Assassin build page has to be written Ladder-aware, and
structured so that a re-enable is a section swap rather than a rewrite.

**Not verified, and not to be published as fact:**

- *Dual Mosaic gives 100% charge preservation.* The data says 50 per claw.
  Whether two claws add, roll independently, or only the main hand counts is
  engine behaviour invisible to `runes.txt`.
- *A finisher refreshes the charge timer.* No property line expresses this.

---

## 3. Build inventory — for the next cycle

Researched against Maxroll (nine endgame guides plus a levelling guide, all
stamped *Last Updated: May 22, 2026*), Blizzard's patch material, and the pinned
data. **Source-freshness caveat:** none of the nine Assassin guides has been
touched for Season 15, while other classes on the same index carry August 2026
dates. Patch 3.3 changed nothing for Assassins — its four skill fixes are all
Warlock — so they remain substantively current, but their "Patch 3.2 / Season 14"
framing must not be copied.

**Two contamination hazards found while researching, worth recording:**

- `wiki.d2r-reimagined.com` is a **community mod** with its own version
  numbering, including a "Patch Notes 3.0.0" page that reads like official notes
  and ranks well in search. It is the origin of claims such as "Blade Fury base
  missiles 2→3, weapon damage 75%→62%". The pinned retail data gives
  `SrcDam = 96` (75%) and no missile-count parameter of that shape. Same applies
  to `wiki.projectdiablo2.com`.
- Gold-seller sites dominate "D2R Season 15 tier list" results and rank
  **Mosaic Martial Arts as S-tier for Season 15** while it is Ladder-disabled.
  Usable only as weak evidence that a build is talked about; never for mechanics.

### Decisions

| Family | Aliases | Identity | Decision |
| --- | --- | --- | --- |
| **Lightning Trapsin** | Trapsin, Trapper, Lightsin, LS/DS | Lightning Sentry's piercing bolts kill; Death Sentry chains corpses | **CREATE** — flagship, and the one Assassin build that levels as itself into endgame |
| **Fire Trapsin** | WoF Trapsin | Wake of Fire's ground waves; inverted immunity profile | **CREATE** — materially different rotation (spread, not stacked), gear and merc; also the levelling build most Assassins respec out of ~36 |
| **Phoenix Strike** | PS Sin, Mosaic Sin, Mosaic Martial Arts | Charge three elements, release with a finisher | **CREATE** — highest value, because it must be written Ladder-aware in a way no current source manages |
| **Kicksin (Dragon Talon)** | Kick Assassin, Kicker | Rapid kicks killing through stacked Crushing Blow | **CREATE** — Uber specialist; boots-and-Crushing-Blow gear axis |
| **Dragon Tail** | Tigertail | One charged kick detonating as fire AoE | **CREATE** — differs from Talon on main skill, distribution, rotation, gear and content |
| **Riftsin** | — | Dragon Talon's hit-rate as a proc engine for Rift's Frozen Orb | **CREATE** — structurally untouched by the Mosaic disable, because its core item is a weapon rather than claws. Hard ceiling at /players 1–3 |
| **Bladesin** | Blade Fury Assassin, Furysin | Blade Fury at range carrying 75% weapon damage | **CREATE** — the one build that wants a normal weapon; also carries the Blade Shield durability hazard |
| **Whirlwind Assassin** | WWsin | Whirlwind via the claw-only Chaos runeword | **CREATE**, low priority — verified Ladder-legal (Chaos has no restriction flag); notable for investing zero points in its own damage skill |
| **Fire Blast Assassin** | — | Aimed thrown bomb, fed by *lightning* trap synergies | **CREATE, borderline** — weakest of the nine; fold into Lightning Trapsin if a tighter set is wanted |
| Kicksin hybrid with traps | — | — | **CONSOLIDATE** into Kicksin — it is that build's budget skill split, not a family |
| Martial Arts without Mosaic | — | — | **CONSOLIDATE** into Phoenix Strike — it is what Phoenix Strike *is* on Ladder right now |
| "Bomber" / "Bombasin" | — | — | **REFUSE** — community label for a point split already covered |
| Standalone Tiger / Cobra / Fists builds | — | — | **REFUSE** — charge-ups cannot kill alone; v1.10-era guide names |
| PvP WW/Trapper hybrid | — | — | **REFUSE** — no current-patch maintenance |
| "IceKicksin" | — | — | **REFUSE** — traced to the D2R Reimagined mod, not retail |

### One loose end closed

Patch 3.3 moved eight runewords to Non-Ladder. Two of Blizzard's names —
**Mania** and **Hysteria** — do not exist under those names in the pinned
extraction. Querying `lastLadderSeason: 14` returns exactly eight rows:
Bulwark, Cure, Ground, Hearth, Metamorphosis, Temper, and *"Hustle (armor)"* +
*"Hustle (weapon)"*. Mania and Hysteria are the renamed halves of the old Hustle
runeword; the count and the set match, and the extraction simply retains the
older internal names. Worth knowing before anyone treats the pin as disagreeing
with Blizzard.

Incidentally, **Mania** — a claw-legal weapon runeword with a level 1 Fanaticism
aura and +30% IAS, now Non-Ladder-available — looks mechanically well suited to a
non-Mosaic kick build. **No source recommends it for one.** That is an open
question, not a recommendation.

### One loose end left open

Whether Blizzard intends to re-enable Mosaic on Ladder, and when. Maxroll's
standing banner says "when Mosaic is reintroduced", which is an expectation
rather than information.
