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

- *"Traps are laid at a rate governed by Faster Cast Rate."* **False, and now
  proven false — see §5.** Cycle 1 doubted it for the wrong reason, cycle 2
  restored it for a worse one, and cycle 3 settled it against the animation
  data. Trap laying plays `anim = S2` and runs on attack speed.
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

## 5. The breakpoints question, settled against the animation data

Cycle 1 doubted that Faster Cast Rate governs trap laying, for a bad reason.
Cycle 2 restored the claim, for a worse one, and published 65% / 102% on the
Lightning Trapsin and the levelling journey. **Cycle 3 settled it: trap laying
runs on attack speed, and cycle 2's conclusion is retracted.**

The section is kept long on purpose. The failure was not a wrong number — it was
three arguments that felt like evidence and were not, and the same three are
available to anyone editing this page next.

### What cycle 2 argued, and why none of it was evidence

1. **"This site already publishes the answer."** `fcr-assassin` carried
   `summary: "Applies to trap laying as well as to spells."` with
   `confidence: "verified"`. That is the site validating itself. The table was
   authored before any Assassin research existed and its summary was never
   independently checked; citing it proves only that the sentence is old.
2. **"65 and 102 are the two rows every Trapsin guide names."** They are — and
   they are the numbers of the Assassin's *cast* animation, which those guides
   also publish, correctly, for Mind Blast. That guides repeat them beside the
   word "trapper" shows the copy is widespread, not that it is right.
3. **"There is no column in `skills.txt` that assigns an animation-speed
   source, so the pinned data is silent rather than opposed."** **This is simply
   false.** The column is `anim`, it is present on every row, and it is the
   column that decides which animation the character plays — which is the thing
   a speed stat shortens. Cycle 1 reasoned from `UseAttackRate`, which decides
   whether an action can *miss*; cycle 2 correctly rejected that and then
   concluded the data was silent, without looking one column further.

### What the data says

`anim`, from the same pinned commit the skill graph is generated from
(`blizzhackers/d2data` @ `fc46999`, `json/skills.json`). The Assassin has three
animation families and they do not overlap:

| `anim` | Skills | Shortened by |
| --- | --- | --- |
| `SC` | Mind Blast, Cloak of Shadows, Fade, Burst of Speed, Venom, Psychic Hammer, Shadow Warrior, Shadow Master, Weapon Block, Claw Mastery, Blade Shield | Faster Cast Rate |
| `S2` | **every placeable trap**, plus Fire Blast (`Fire Trauma`), Shock Web (`Shock Field`) and Blade Sentinel | attack speed |
| `A1`, `SQ`→`A1`, `KK` | the martial arts, Blade Fury, the kicks | attack speed |

Traps are in **neither** the cast family nor the ordinary attack family. They
are their own animation. That alone kills the naive form of both hypotheses —
"it is a cast, so FCR" and "it is an attack, so IAS" are each wrong about which
animation is playing.

### The animation itself

AnimData extracted from `d2common.dll` — RTB's table, published at
`mannm.org/d2library/faqtoids/animspeed.html` under the `CCAAWWW` convention
(class, animation, weapon class):

```
AISC*  17 frames @ animation speed 256      the cast animation
AIS2*   8 frames @ animation speed 128      trap laying, identical for every
                                            weapon class
```

**The source was validated before being used.** `AISC*` = 17 @ 256 reproduces
exactly the "Casting Base 17 / Animation Speed 256" that Maxroll and the Diablo
Wiki publish independently, and pushing it through the cast formula regenerates
the whole published `fcr-assassin` table — 0/8/16/27/42/65/102/174 →
16/15/14/13/12/11/10/9, every row minimal. A source that reproduces the row
everybody has can be trusted for the row nobody has tabulated.

### The empirical control, and why it was needed

At weapon speed 0 with no Burst of Speed, the two hypotheses give **the same
table**: 0/9/18/30/48/78/125 → 15/14/13/12/11/10/9 either way. That is exactly
why this error survives — the naive check cannot see it. The discriminator is
weapon dependence, which only the attack-speed calculation has.

So: derive trap-laying frames from the `S2` animdata using the attack formula

```
fpa  = ceil(256 × 8 / floor(128 × (100 + SIAS + EIAS − WSM) / 100)) − 1
EIAS = floor(IAS × 120 / (IAS + 120)), capped at 75
WSM  = the claw's base speed; dual wielding, the average of both
```

and confront it with AsgardPvP's independently published matrix, *"IAS needed
for 9-frame trap laying speed"*, indexed by both claws' base speed. The
derivation had no sight of it.

**All fifteen cells match.** 10/10 = 174, 10/0 = 147, 10/−10 = 125, 10/−20 = 105,
10/−30 = 89, 0/0 = 125, 0/−10 = 105, 0/−20 = 89, 0/−30 = 75, −10/−10 = 89,
−10/−20 = 75, −10/−30 = 63, −20/−20 = 63, −20/−30 = 52, −30/−30 = 42.

Under Faster Cast Rate, reaching nine frames would cost **one weapon-independent
number**. It takes five different values on the diagonal alone, spanning 42% to
174%, and it depends on *both* claws. That is a weapon in the formula, and cast
rate has no weapon in its formula. **H1 is falsified; H2 is confirmed
quantitatively, not merely asserted.**

Corroborating and not load-bearing: the D2library FCR page states flatly
*"Assassin's Trap skills gain no profit by Casting Speed, this is a die-hard
rumour"* — the same failure, named as a known one. The current Maxroll Lightning
Sentry guide marks Burst of Speed as an attack-speed skill that "increases … the
rate you lay Traps", tells the reader to shop for Increased Attack Speed, and
cites Cannot Be Frozen as protecting trap-laying speed. Maxroll's breakpoints
page publishes no trap-laying table at all — only skill delays.

### Patch 3.3 changed none of this

3.3 (18 August 2026, Ladder Season 15) carries sixteen changes: five item buffs,
eight runewords moving to Non-Ladder, Terror Zone loot retuning, and seven bug
fixes. No Assassin trap change, and nothing touching the animation-speed system.
2.4 changed trap synergies; 2.6 let traps benefit from −% enemy resistance.
**No patch has ever moved trap laying onto cast rate.** The historical
behaviour and the current behaviour agree.

### The second defect, which is independent of the first

65% and 102% are the numbers of the `SC` animation: 17 frames at speed 256.
Trap laying is `S2`: 8 frames at speed 128. So the published figures were wrong
**under either hypothesis** — even if cast rate had governed traps, the trap
table would have been 0/9/18/30/48/78/125, never 0/8/16/27/42/65/102/174. Cycle
2 did not merely pick the wrong stat; it applied one animation's table to a
different animation.

### What is published now

- **`fcr-assassin` is kept and narrowed**, not deleted. Its rows are a correct
  derivation of the cast animation and every one is minimal. It gains
  `variant: "Cast animation only"`, a summary naming what it governs, and
  guidance stating in the first line that it does *not* cover trap laying.
- **The Lightning Trapsin keeps a 65% Faster Cast Rate target, rescoped to Mind
  Blast** — genuinely the button that opens every pack, 16 frames to 11. The
  102% row is gone: it existed only as "the stretch" for trap laying.
- **No Increased Attack Speed row, and for the opposite reason to before.** Not
  because attack speed is irrelevant, but because the claw's base speed is an
  input to the same formula, so any single percentage is wrong for most readers.
  This is the house policy the breakpoints page already states for IAS
  generally: *"a single table cannot express it, and every site that publishes
  one is simplifying to the point of being wrong for most setups."*
- **Scenarios instead**, all derived and all re-derived by the test on every run:

  | Claws | Bare | 9 frames costs |
  | --- | --- | --- |
  | two Runic Talons / Greater Talons (−30) | 12f | 42% IAS |
  | two Feral Claws / Greater Claws (−20) | 13f | 63% |
  | Suwayyah / Quhab / Cestus / Wrist Blade (0) | 15f | 125% |
  | two Hatchet Hands / Fascia (+10) | 17f | 174% |

  A five-frame spread before a single point of IAS is bought, which is why the
  page now tells the reader the claw *base* matters more than the affix.
- **Three rules that decide whether owned IAS counts**, all published: dual
  wielding averages the two claws; off-hand IAS does not count at all; Burst of
  Speed adds up to 60% undiminished, which is the real cost of running Fade
  instead. Being chilled slows the animation, so Cannot Be Frozen protects it.

### The gate that would have caught it

`scripts/trap-speed.test.ts`, wired into `npm run check`. It does not match text.
It derives the mechanical category from `anim` and the animdata, regenerates
`fcr-assassin` from the cast animation, and re-derives all fifteen cells of the
outside matrix; then it checks that the prose agrees with the arithmetic. Eleven
mutation controls cover both directions of the error, the universal-number
error, the firing-interval confusion, and the pt-BR half.

Two real bugs surfaced while building it, both in the rules that guard the
prose. `"not just"` was being read as a denial, which silenced the rule on the
exact sentence it existed to catch. And `s[óo]\b` never matched, because
JavaScript defines `\b` against `[A-Za-z0-9_]` and `ó` is not a word character —
the same accent trap already documented on `CALLED_A_FINISHER`, which had
silently disabled the pt-BR half of that rule once before.

### "Kick speed comes from the boots" is still false, and still not published.

Unchanged from cycle 1. Boots supply kick *damage*; nothing in the boots' row
touches speed. Dragon Talon's kick count is `lvl/6 + 1` from its own row, and
Dragon Tail carries `Param4 = -40`, an attack-speed *penalty*. The kick pages
will state those two and nothing about boots and speed.
