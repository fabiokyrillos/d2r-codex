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

- ~~*"Traps are laid at a rate governed by Faster Cast Rate."*~~ **This note was
  wrong and is retracted — see §5.** `UseAttackRate = 1` says whether the action
  can miss, not how fast its animation plays. Faster Cast Rate is the trap-laying
  table and the site already published it as such.
- *"Kick speed comes from the boots."* Boots supply kick *damage*. Nothing in the
  boots' row touches speed.

The foundation stated neither. §5 is the breakpoints pass they were waiting for:
the first is retracted and the site's existing table stands, the second holds.

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

---

## 4. Definitive roster — cycle 2

Cycle 1 recorded fifteen families with a create/consolidate/refuse verdict.
This is the same set re-examined against the pinned data rather than against
the guides, with the columns a build page actually needs. **Nothing was
re-researched that cycle 1 had already settled and sourced**; what changed is
that the point plans and rotations below are now derived from `skills.json`
rather than transcribed, and three verdicts moved.

Sources are unchanged from §3 and are not re-listed per row: the pinned
extraction at `fc46999` for every mechanical figure, Maxroll's nine Assassin
guides (all stamped 2026-05-22) for what is *played*, and Blizzard's patch
material for availability. Where a guide and the extraction disagree, the row
says so.

### Availability, stated once

Only one thing on this page varies by mode, and it varies in one direction:
**Mosaic cannot be crafted on Ladder** and can be worn there. Every other
family below is craftable and usable in all three modes, so their availability
column would read the same word three times and is omitted rather than padded.
The distinction now has a type — `Availability` in `lib/types/core.ts` — and
`npm run test:availability` refuses the two collapsed sentences.

### The nine, ordered by what the cycle will build

| # | Canonical | Aliases | Main skill | Distribution (110) | Rotation | Distinctive gear | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | **Lightning Trapsin** | Trapsin, Trapper, Lightsin, LS/DS | Lightning Sentry | LS 20, CBS 20, Shock Web 20, Death Sentry 20, Fire Blast 1, Shadow suite 9 = **90**, 20 in one package | Mind Blast to stun, lay 4 Lightning + 1 Death Sentry on the pack, Cloak of Shadows if it turns | Two Spirits or a claw with +3 Lightning Sentry; nothing mode-gated | **CREATE** — flagship |
| 2 | **Fire Trapsin** | WoF Trapsin, Fire Trapper | Wake of Inferno | WoI 20, Wake of Fire 20, Fire Blast 20, Death Sentry 1, Shadow suite 9 = **70**, 40 in packages | Spread Wake of Fire across the room; Wake of Inferno stacked on one target | Fire facets rather than lightning; the same claws | **CREATE** — inverted immunity profile, different rotation |
| 3 | **Phoenix Strike** | PS Sin, Mosaic Sin, Mosaic Martial Arts | Phoenix Strike | Phoenix Strike 20, Fists of Fire 20, Claws of Thunder 20, Blades of Ice 20, Dragon Talon or Dragon Claw as finisher, Shadow suite | Charge to 3, release with a finisher; the three elements fire in order | **Mosaic ×1 or ×2 — Ladder-gated** | **CREATE**, and it is the only page that has to carry the availability block |
| 4 | **Kicksin** | Dragon Talon Sin, Kick Assassin, Kicker | Dragon Talon | Dragon Talon 20, Venom 20, Fade, Weapon Block, Shadow Master, Burst of Speed | Tiger Strike to 3 charges, release with Dragon Talon's kick chain | **Boots** — kick damage lives there and nowhere else | **CREATE** — Uber specialist |
| 5 | **Blade Fury** | Bladesin, Furysin | Blade Fury | Blade Fury 20, Blade Sentinel 20, Blade Shield 20, Venom 20 | Hold Blade Fury at range; Blade Shield running | The one Assassin build that wants a **normal weapon**, not claws | **CREATE** |
| 6 | **Dragon Tail** | Tigertail | Dragon Tail | Dragon Tail 20, Tiger Strike 20, Venom, Fade | Tiger Strike ×3 then one Dragon Tail | Boots again, but the payload is a **fire** blast | **CREATE** — see the −40% attack speed note below |
| 7 | **Riftsin** | — | Dragon Talon | Dragon Talon 20 plus the trap tree for utility | Kick for hit-rate; the weapon procs Frozen Orb | **Rift** — a *weapon* runeword, so the Mosaic block does not touch it | **CREATE** — hard ceiling at /players 1-3 |
| 8 | **Whirlwind Assassin** | WWsin | Whirlwind (from the item) | Zero points in the damage skill; everything in Venom, Fade, Weapon Block, Shadow Master | Whirlwind | **Chaos** — claw-only, and verified to carry no restriction flag | **CREATE**, low priority |
| 9 | **Fire Blast Assassin** | Bomber, Bombasin | Fire Blast | Fire Blast 20 fed by all five traps at 11%/pt | Aimed throw | Nothing distinctive | **FOLD INTO Lightning Trapsin** — verdict moved, see below |

### One cycle-1 sentence that the arithmetic contradicts

§3 calls the Lightning Trapsin "the one Assassin build that levels as itself
into endgame". **That is wrong, and the numbers say so.** Every lightning trap
has a minimum damage of 1 at every level — Lightning Sentry is 1-20 at level 1
and 8-2574 at level 20 with both synergies maxed — so the build is a lottery
ticket until roughly sixty points are in it. Wake of Fire at the same twenty-four
points deals **71-81 per wave** with a floor that is not 1. The Lightning
Trapsin levels on *fire* and respecs once, at level 45; the leveling page states
the closure. Nothing was published on the strength of the cycle-1 sentence, so
this is a correction to a note rather than to a page.

### Three verdicts that moved, and why

- **Fire Blast Assassin: CREATE (borderline) → FOLD.** Cycle 1 called it the
  weakest of the nine and said it could be folded "if a tighter set is wanted".
  The arithmetic settles it. Fire Blast receives 11% per hard point from all
  five traps, and the Lightning Trapsin already maxes three of them; at that
  point a 19-point package takes Fire Blast to **646-859 per bomb**, which is
  the same character with the same gear pressing a different button. There is
  no distribution, no rotation and no gear that differs. It ships as the
  Lightning Trapsin's lightning-immunity package, where it is a real answer,
  rather than as a page describing a build nobody plays on its own.
- **"Martial Arts without Mosaic": CONSOLIDATE → the Phoenix Strike page's
  default.** Cycle 1 was right that it is not a family. It is stronger than
  that: on the current Ladder it is *the only version that can be started*, so
  it is not the fallback section, it is the opening section, and the Mosaic
  route is the one written as conditional.
- **Kicksin hybrid with traps: CONSOLIDATE, confirmed.** Death Sentry's corpse
  explosion is **40-80% of the monster type's base life and does not scale with
  skill level** (`mon death sentry` Param1/Param2, against the Necromancer's
  70-120%). One point buys the entire chain reaction. That is what makes the
  "hybrid" a one-point splash on a kick build rather than a family — and it is
  also why the Lightning Trapsin maxes Death Sentry *last*.

### Refused, unchanged from cycle 1

Standalone Tiger / Cobra / Fists builds (charge-ups cannot kill alone; v1.10-era
guide names), PvP WW/Trapper hybrid (no current-patch maintenance), "IceKicksin"
(traced to the D2R Reimagined mod, not retail).

### Two mechanics found this cycle that change a recommendation

- **Dragon Tail carries `Param4 = -40`, "Attack Speed % Reduction".** Its own
  row applies a 40% attack-speed penalty. No guide consulted mentions this. It
  is the reason Dragon Tail is a one-big-kick build and Dragon Talon is a
  many-small-kicks build, and it belongs on both pages.
- **Charged Bolt Sentry gains a shot per 4 hard points of Lightning Sentry**
  (`Param7 = 4`), and Shock Web gains a bolt per 3 (`Param6 = 3`). On the
  finished Lightning Trapsin this is decoration: the five-trap ceiling is spent
  on Lightning and Death Sentries, so **Charged Bolt Sentry is twenty points in
  a trap the finished build never lays**. It is a pure synergy, and the page
  has to say so or the reader will keep casting it.

### One open question, recorded and not published

`mon death sentry` computes its shot count as `par8 + skill('Fire Trauma'.blvl)/3`
— Fire Blast would add corpse explosions — while the parent Death Sentry row
carries a flat `Param1 = 5` and the column comment says the two "must match".
They do not match once Fire Blast has levels. Which one the engine reads is not
determinable from the table, so nothing on the site depends on it.

---

## 5. The breakpoints question, settled

Cycle 1 recorded two claims from secondary sources that it believed the pinned
data contradicted, and deferred both. Publishing a build page forces the
question. One of the two was a misreading by cycle 1; the other stands.

### Faster Cast Rate does govern trap laying. Cycle 1's note was wrong.

The note reasoned from `UseAttackRate = 1`, which is set on every trap row, to
"laying a trap is an attack, so attack speed governs it". That inference does
not hold. `UseAttackRate` is the column that decides **whether an action can
miss** — whether the game runs a to-hit check against the target's defence, or
the action simply lands. It says nothing about animation speed, and the two are
independent: Fire Blast is a thrown missile that can miss and is cast at cast
rate.

Three things point the same way and none points the other:

1. **This site already publishes the answer.** `content/breakpoints/breakpoints.ts`
   carries `fcr-assassin` with `summary: "Applies to trap laying as well as to
   spells."`, `confidence: "verified"`, and the eight-row table
   0 / 8 / 16 / 27 / 42 / 65 / 102 / 174. It shipped before the Assassin cycle
   and was not written from the trap research.
2. **The table's shape is specific to the claim.** 65 and 102 are the two rows
   every Trapsin guide names, and they are named *as trap-laying breakpoints*.
   A table that governed something else would not have converged on those two.
3. **Nothing in the extraction contradicts it.** There is no column in
   `skills.txt` that assigns an animation-speed source, so the pinned data is
   silent rather than opposed — and cycle 1 treated silence as opposition.

So the build pages publish **65% Faster Cast Rate as the practical target and
102% as the stretch**, matching the table the site already has. Nothing claims
that Burst of Speed speeds up trap laying, and the levelling page's Burst of
Speed step was rewritten to say what it does buy: run speed, and access to Fade.

### "Kick speed comes from the boots" is still false, and still not published.

Unchanged from cycle 1. Boots supply kick *damage*; nothing in the boots' row
touches speed. Dragon Talon's kick count is `lvl/6 + 1` from its own row, and
Dragon Tail carries `Param4 = -40`, an attack-speed *penalty*. The kick pages
will state those two and nothing about boots and speed.

### What the Lightning Trapsin page therefore publishes

| Stat | Target | Frames | Why |
| --- | --- | --- | --- |
| FCR | 65% | 11 | The practical trap-laying target; the site's own table. |
| FCR | 102% | 10 | The stretch, and the last row worth chasing — 174% is one frame more for double the investment. |
| FHR | 48% | 5 | The shared Paladin/Assassin/Barbarian table's standard target. |

No IAS row. The build's damage is laid rather than swung, and an Increased
Attack Speed target on a page whose character never attacks would be the same
mistake in the other direction.
