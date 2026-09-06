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
rather than transcribed, and three verdicts moved. A fourth — Riftsin — moved in
cycle 4 and has its own section below.

Sources are unchanged from §3 and are not re-listed per row: the pinned
extraction at `fc46999` for every mechanical figure, Maxroll's nine Assassin
guides (all stamped 2026-05-22) for what is *played*, and Blizzard's patch
material for availability. Where a guide and the extraction disagree, the row
says so.

### The count, stated as a number so it cannot drift again

The table below has **nine rows and nine verdicts**, and rows are not pages. A
closing note in cycle 3 said "2 of 7 builds" while listing six still to come,
which is eight, and neither number matched the table. So the arithmetic is
written out here once:

| | |
| --- | --- |
| Families examined | **9** |
| — folded into another page (Fire Blast Assassin) | −1 |
| — demoted to a gear package (Riftsin, see below) | −1 |
| **Build pages the Assassin gets** | **7** |
| Published (Lightning Trapsin, Fire Trapsin) | 2 |
| Remaining | **5** |

The five remaining, in build order: **Phoenix Strike, Kicksin, Blade Fury,
Dragon Tail, Whirlwind Assassin.** The Assassin is complete when those five
exist, and not before.

### Riftsin: a package on the Kicksin page, not a page

Verdict moved this cycle, from CREATE to a named gear package, and the reason is
one column. **Dragon Talon carries no `SrcDam` and `weapsel = 4`** — the weapon
slot contributes nothing at all to a kick, whose base damage is the boots'
`mindam`/`maxdam`. So a Riftsin is the same skills, the same rotation, the same
boots, the same attributes, the same target content and the same levelling path,
holding something different in its hands. Measured against the seven axes a
separate page has to move, it moves one, narrowly, and that one is confined to
the two hand slots.

It is a *package* rather than a one-line note because the swap is not free:
Rift is a polearm or scepter, so it forfeits **Weapon Block** (`passiveitype =
"h2h"`, claws in both hands) and the claw `+skills` that feed `calc1 =
"lvl/6+1"` — which can cost a whole kick per activation. What buys that back is
`hit-skill` → level-16 Tornado, whose `item_skillonhit` fires on
`domeleedamage`, the same per-hit event a multi-kick Dragon Talon presents over
and over. That is a real cost and a real benefit, and it needs a costed section
rather than a sentence.

**And one caveat ships with it.** Whether a weapon-sourced `item_skillonhit`
(flagged `damagerelated = 1`) fires at all from a `weapsel = 4` armour-strike is
**not establishable from the pinned data**. Rift's two largest lines — 160–250
magic and 60–180 fire — are weapon-damage adds a kick structurally cannot use.
If the proc does not fire either, the package is worthless and the honest
verdict becomes REJECT. The page says so rather than picking a side.

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
| 7 | **Riftsin** | — | Dragon Talon | identical to the Kicksin | identical to the Kicksin | **Rift** — a polearm or scepter, so it costs Weapon Block and the claw +skills | **PACKAGE INSIDE KICKSIN** — verdict moved, see above |
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

### Three verdicts that moved in cycle 2, and why

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
   a speed stat shortens. Cycle 1 reasoned from `UseAttackRate`; cycle 2
   correctly rejected that and then concluded the data was silent, without
   looking one column further.

   Cycle 4 footnote: cycles 1 and 2 both described `UseAttackRate` as the column
   that "decides whether an action can *miss*". **It is not, and controls in the
   same file settle it** — Zeal, Whirlwind, Fend, Charge and Leap Attack all
   leave it blank and every one of them misses; 263 of 429 rows are blank. It
   marks the rows that call the standard attack-rate path, and a blank row
   resolves its own hit check inside `srvdofunc`. A skill's attack rating lives
   in `ToHit` and `LevToHit`, present on 72 rows. Nothing in §5 rests on this —
   the speed finding is `anim` plus the animdata plus the 15/15 empirical
   control — but the sentence was wrong and is retracted here rather than left
   for a later cycle to reason from.

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

---

## 6. Next hit delay, and why the two trap builds are different builds

Cycle 3's second finding, and the one that gave the Fire Trapsin an identity
rather than a palette. `missiles.json` at the pinned commit:

| Missile | `NextHit` | `NextDelay` |
| --- | --- | --- |
| `wake of destruction` (Wake of Fire's wave) | 1 | **4** |
| `wake of destruction maker` | 1 | **4** |
| `inferno sentry 1` (Wake of Inferno) | — | — |
| `bomb on ground` (Fire Blast's explosion) | — | — |
| `shock field on ground` (Shock Web) | 1 | **25** |

**The column was calibrated before it was used.** The same file gives
`chainlightning`, `frostnova` and `poisonnova` a `NextDelay` of 4 and `tornado`
25 — the figures those four skills are published with everywhere. A column that
reproduces four known answers can be trusted for the unknown one.

So:

- **Wake of Fire's wave carries the standard four-frame next hit delay**, and
  the ceiling is per monster rather than per trap. Five traps on one square is
  four traps wasted against the thing standing on it. Wake of Fire is a skill
  for covering ground.
- **Wake of Inferno carries no next hit delay at all**, so five of them on one
  target all land. It is the stacked answer to anything that does not walk.
- **Shock Web's ground missile is 25 frames** — a full second, the longest in
  the tree, and the reason it is a synergy rather than a clear skill.

That is the whole shape of the Fire Trapsin: lay across the path, then invert
completely when the target stops moving. It is a different rotation from the
Lightning Trapsin's five-on-one-square, and it comes out of the data rather than
out of guide convention.

### Two errors of mine that the repository's own gates caught

Worth recording, because both were confidently written and neither was noticed
by re-reading.

1. The draft said *"the Ancient Tunnels have no fire immunes among the
   natives"*. The area's own `commonImmunities` is `["fire", "poison"]` — it is
   the **cold**-immune-free zone, which is why cold Sorceresses farm it.
   `build-claims.test.ts` compares every build's farming prose against the
   area's own data and reported the contradiction.
2. Following from the same confusion, the whole premise was backwards. The
   draft led with *"fire immunity is far rarer than lightning immunity"*. This
   site's own immunity census counts **fire in 13 of 20 farming areas against
   lightning's 8** — fire is the commonest immunity there is. The lead strength,
   a new weakness, the immunity plan and the entire farming list were rewritten
   around areas whose data does not list fire.

The gates are load-bearing rather than decorative, and the second error is the
kind that would have shaped a reader's whole season.

---

## 7. Phoenix Strike and Mosaic — researched, not yet written

The page is the next cycle's first task. Everything below is from the pinned
commit and is ready to publish; nothing here has been shipped yet.

### The finding that should lead the page

`Param8 = 1` on **Dragon Claw, Dragon Talon and Dragon Tail alike**, and the
column comment is explicit about what it means:

```
Always Hit (0 = disabled | 1 = enabled only when Charges are consumed)
```

A finisher cannot miss — **but only on the swing that spends charges.** Mosaic's
entire purpose is a 50% chance *not* to consume them, and on exactly those
swings the Always Hit flag does not apply.

So Mosaic buys charge uptime at the price of guaranteed hits, and attack rating
stops being irrelevant on a Mosaic character in a way no guide read this cycle
mentions. It is also a mechanic that makes the Ladder-legal build easier to
write honestly: without Mosaic every finisher consumes charges, so every
finisher always hits.

### Royal Strike, which is Phoenix Strike

```
progressive = 1, SrcDam = 128        full weapon damage on the swing itself
auralencalc = 375                    15.0 s, flat — not per level
Param7 = 25                          "Attack Rating % per Charge"
Param2 = 6                           meteor explosion radius     (1 charge)
Param3 / Param4 = 30 + 15 per level  ground fire duration
Param6 = 10                          "64/# = Total Chain Lightning Missiles"
                                     -> 6 missiles               (2 charges)
Param5 = 16                          "# of Ice Bolt Missiles"    (3 charges)
Param1 = 8                           chain lightning jump radius
```

Claws of Thunder takes 8% per point from Royal Strike and Fists of Fire 12%;
both feed back into its missiles, and the graph already carries both directions.

### The three finishers

| Skill | Damage % | Notable |
| --- | --- | --- |
| Dragon Claw | 50 + 15 / level, `SrcDam = 128` | `calc1 = ln12 + skill('Claw Mastery'.blvl) * 4` — Claw Mastery is a 4%/point damage synergy |
| Dragon Talon | 5 + 7 / level, `Kick = 1` | `calc1 = lvl/6 + 1` kicks; knockback 50–100% vs unique, 25–99% vs boss |
| Dragon Tail | 50 + 20 / level, radius 6, fire | `Param4 = -40`, an attack-speed **penalty** |

### What the page must not do

- **It must not restate the availability modes.** `content/runewords/runewords.ts`
  already carries Mosaic's full `availability` block — ladder `usable`,
  non-ladder-online `craftable`, offline `craftable` — with the consequence
  note, the history note, the source and the baseline. The build page sets
  `gatedBy: ["mosaic"]` and lets that block render. A restatement is a second
  copy of a fact that changes on Blizzard's schedule.
- **It must not treat the historical Mosaic as the current one.** It was
  Ladder-*only* from Season 3 through Season 12, which is the reverse of
  today's answer and the reason so much written about it is backwards rather
  than merely stale.
- **The Ladder-legal opening is the default section and the Mosaic route is the
  conditional one**, because on the current baseline the claw cannot be made on
  Ladder at all. The runeword page already promises exactly this.
- **Two claims remain unverified and must stay unpublished**: that two Mosaics
  give 100% preservation — the property is 50 on each claw and the extraction
  says nothing about how two combine — and that a finisher refreshes the charge
  timer. No property line expresses either.

---

## 8. Cycle 4 — what the missiles said, and what a status word could not

Three things were settled this cycle and one shipped page was corrected. The
roster arithmetic is in §4; this section is the mechanics.

### Phoenix Strike's loop closes through its missiles, not its row

§7 called the synergy "bidirectional" and gave no magnitudes. Half of that is
right and the reason was wrong. **Royal Strike's row carries no synergy column
and no damage column at all** — no `EDmgSymPerCalc`, no EMin/EMax. Nothing feeds
"Phoenix Strike", because Phoenix Strike has no damage of its own to feed. The
return direction is on the three missiles:

```
royalstrikemeteor          EMin 20 EMax 40 fire
                           EDmgSymPerCalc = skill('Fists of Fire'.blvl)    * 10
royalstrikechainlightning  EMin  1 EMax 40 ltng   NextHit 1  NextDelay 4
                           EDmgSymPerCalc = skill('Claws of Thunder'.blvl) * 13
royalstrikechaosice        EMin 16 EMax 32 cold   NextHit 1  NextDelay 4
                           EDmgSymPerCalc = skill('Blades of Ice'.blvl)    * 10
                           ELen 100 chill, Param5 = 16 bolts
```

Outbound, the skill pays 12 / 8 / 8. So it is a **closed four-way loop with
asymmetric rates**, and Claws of Thunder returning 13% is why the build page
maxes it first. That derivation replaces "every guide maxes all four".

### The to-hit question, settled on the right column

Cycles 1 and 2 both described `UseAttackRate` as the column deciding whether an
action can miss. **It is not**, and controls in the same file settle it: Zeal,
Whirlwind, Fend, Charge and Leap Attack all leave it blank and every one of them
misses. 263 of 429 rows are blank. It marks the rows that call the standard
attack-rate path; a blank row resolves its own hit check inside `srvdofunc`.

A skill's attack rating lives in **`ToHit` / `LevToHit`**, present on 72 rows:

| | ToHit | LevToHit |
| --- | --- | --- |
| Royal Strike and the five other charge-ups | 25 | 10 |
| Dragon Talon | 20 | **35** |
| Dragon Claw | 40 | 25 |
| Dragon Tail | 20 | 15 |
| Dragon Flight | 60 | 25 |
| Zeal / Whirlwind / Fend / Charge — all of which miss | 10 / 50 / 40 / 50 | 10 / 5 / 10 / 15 |
| **Smite**, which never misses | **none** | **none** |

So every Assassin finisher rolls to hit normally, and `Param8 = 1` — "Always Hit
(0 = disabled | 1 = enabled only when Charges are consumed)" — is what suspends
that on a consuming swing. **A Mosaic swing that preserves charges therefore
loses the override and has to roll**, which now rests on two independent columns
rather than on one comment. Royal Strike's `aurastat2 = progressive_tohit` at
+25% per charge is a third line of support: a bonus that would be pointless on a
swing that could not miss.

### Availability needed a third verb, and the old model had shipped a fiction

Mosaic's Ladder row read `usable`, and the sentence beneath it said a claw could
be "brought over on a transferred character" or "traded to you". **Both are
false.** The season-end conversion runs Ladder *into* Non-Ladder and never back,
and nothing on Ladder can make one, so no Ladder player has one to trade — the
supply is empty rather than restricted. A player starting the current Ladder
season has **no legitimate route to a Mosaic at all**.

The gap was in the vocabulary. There are three verbs — make it, get hold of one,
use it — and the type had words for the first and the third. "Usable" reads as an
invitation to go and find one, so that is what got written.
`AVAILABILITY_STATUSES` now carries **`unobtainable`**, styled with `disabled`
rather than with `usable`, because a reader takes the colour before the words.

One more distinction, because collapsing it is the second most common error
about this item: `lastLadderSeason: 12` means the ordinary ladder **exclusivity
expired after Season 12**. What blocks it now is `disallowCraftingInLadder`, a
separate item-specific flag and the only one of its kind in 181 rows. Two
opposite mechanisms that a single status word renders identically.

### Kicksin: two derivations that contradict the usual advice

- **Dragon Talon has no synergies in either direction.** Nothing in the file
  names it as a source, its own row carries no synergy column, and the only
  reference to it anywhere is Dragon Claw's `reqskill1`. There is nothing to buy
  that raises the kick past the twenty points already in it, which is why the
  core is 74 rather than 90.
- **Claw Mastery is a Dragon Claw skill.** Dragon Claw's damage is
  `ln12 + skill('Claw Mastery'.blvl) * par7`; Dragon Talon's `calc1` is
  `lvl/6+1` and names nothing. Claw Mastery's own row is `passive = 1`,
  `passiveitype = "h2h"`, with three `passive_mastery_melee_*` stats — so
  whether the generic passive still reaches an attack whose damage is the boots'
  is **not** determinable here. What is determinable is that the link was written
  into one and not the other, and that is enough to spend one point rather than
  twenty.
- Kick count reads the **effective** level, so `+skills` buy whole kicks at
  effective 6, 12, 18, 24, 30, 36, 42 and 48. Every boot in the game is
  `reqdex 0`.
- Crushing Blow is physical damage, so it does not answer physical immunity —
  which eight of this site's twenty farming areas carry. Venom is in the core for
  that reason rather than in a package.

---

## 9. Blade Fury — researched, not yet written

Everything below is Tier 1 from the pinned commit unless marked otherwise. The
page is the next cycle's first task and needs no further extraction.

### The prerequisite chain runs through the Traps tree

```
fire-blast(1) -> wake-of-fire(12) ─┐
blade-sentinel(6) ─────────────────┴─> blade-fury(18) -> blade-shield(30)
```

Two prerequisite points outside the blade skills, not one.

### The row

```
SrcDam        96          75% of the weapon — the same share as Sentinel and Shield
Param8        10          "Damage synergy"
DmgSymPerCalc (skill('Blade Sentinel'.blvl) + skill('Blade Shield'.blvl)) * par8
ToHitCalc     "lvl*10"    +10% attack rating per level
anim SQ, seqtrans A1      the attack family — attack speed, never cast rate
Param4        5           "Delay between Missiles created"
usemanaondo   1           mana is charged per blade, not per activation
finishing     absent      it does NOT release charge-ups
no itypea1 / itypeb1 / restrict — any weapon, and not even melee-locked
```

### The triangle is real, symmetric, and hard-points-only

All three carry `Param8 = 10` and each names the other two, so twenty points in
two of them is **+400%** on the third. Every formula reads `blvl`, so **`+skills`
from gear do not feed it** — worth publishing, because it is the opposite of how
kick count behaves one tree over.

### The missile, and the three claims it refutes

`bladefragment1`: `NumDirections 1`, `CollideKill 1`, `Pierce` unset,
`ToHit 1`, `Half2HSrc 1`, no `NextHit`, no `NextDelay`, `Vel 22`, `Range 40`.

- **No shotgun.** One server missile per throw, and `Param4` is a delay
  *between* missiles — the blades are separated in time, not fired together.
- **No pierce**, and Pierce% gear cannot grant it: arrow and javelin carry
  `Pierce = 1` *and* `LastCollide = 1`, and this carries neither.
- **No next hit delay at all**, which is where the density actually comes from.
  Contrast Blade Sentinel's `blade creeper` at `NextHit 1 / NextDelay 25`.
- **It can miss.** `ToHitCalc = "lvl*10"`, and the missile's own `ToHit = 1`
  where Guided Arrow — the never-miss control — is `ToHit = 0`. Tier 2 confirms
  it independently: patch 2.4, 14 Apr 2022, "Blade Fury — Attack rating
  increased by 10% per level". Guides calling it an always-hit skill are wrong.

### Two findings that will shape the page

- **`Half2HSrc = 1`** is on exactly 9 of 742 missiles and all nine are the
  Assassin blade family. Read literally it halves the transferred weapon damage
  on a **two-handed** weapon. Every claw is one-handed, so claws are never
  penalised — which reverses cycle 1's note that this is "the one Assassin build
  that wants a normal weapon". The exact multiplier semantics are read from the
  column name plus its exclusive distribution: strong, but not a spec.
- **Blade Sentinel is `pettype = assassintrap` with `petmax = 5`** — it shares
  the five-trap ceiling with the sentries — and `anim = S2`, so it is *laid* at
  attack speed like a trap rather than thrown like Blade Fury. Two skills on one
  page with two different animations and one shared pet cap.

### Patch history — checked, and mostly empty

Patch **2.4** (14 Apr 2022) added all three synergies at 10% per level and the
+10%-per-level attack rating, raised Sentinel and Shield from 37% and 25% to 75%
weapon damage, and cut Sentinel's cast delay from two seconds to one. Patch
**2.7.4** (20 Aug 2024) fixed Blade Fury dropping its channel when the initially
targeted monster died. **Nothing in the 3.x line touches any of the three**, and
patch 3.3's notes mention no Assassin content at all. Beware a forum thread
titled "Patch 3.3 PTR Notes": it is self-declared fan fiction and ranks well in
search.

### Four things NOT ESTABLISHED, which the page must say rather than guess

1. Whether chance-to-cast-on-striking, life and mana leech, Crushing Blow, Open
   Wounds and Deadly Strike apply to the projectile. The stats exist; nothing in
   skills or missiles encodes which skills honour them. `bladefragment1`'s hit
   classification is byte-identical to `arrow` — an argument, not evidence.
2. Whether Venom's poison rides it. Venom writes character stats through
   `aurastate = venomclaws`; a scan of every string column in both files finds no
   reference to venom outside its own row, and `bladefragment1` carries no EType
   of its own.
3. Whether `Param4 = 5` is a hard floor capping throws at roughly five frames
   regardless of Increased Attack Speed. The animation family is settled;
   whether IAS keeps paying past that point is not. **No breakpoint table until
   it is.**
4. Whether the synergy scales only the flat damage or also the 75% weapon share.
   It is worth an enormous amount either way, and the two readings are far apart.

One controlled in-game test settles (1) and (2) together: Venom up, Blade Fury
only, against a high-HP monster.


## 10. Cycle 5 — the three published debts, closed

Cycle 4 shipped four pages and three open questions. All three are now answered,
and two of them turned out to be answers *against* what had been published.

### 10.1 The column that decides all of it

`itemstatcost.txt` carries a boolean called `damagerelated`. The Phrozen Keep
file guide states what it does:

> DamageRelated: this boolean controls whenever the stat will be restricted to a
> single weapon and not stack with the item owners accumulated total of that
> stat when he equips the weapon … when you swing your weapon the game copies
> all these stats (from the weapon involved) to a temporary statlist that is
> then flushed after the attack is completed.

108 stats carry it in the pinned data, and the set is exactly the one that
reading predicts: `mindamage`/`maxdamage`, every elemental damage pair, both
leeches, `tohit`, `item_fasterattackrate`, `item_crushingblow`,
`item_openwounds`, `item_deadlystrike`, `item_skillonhit`, `item_skillonattack`.

`item_fasterattackrate` is the control that matters, because this project has
already tested it. Cycle 3's trap-speed contract rests on off-hand Increased
Attack Speed not counting, and that was confirmed 15/15 against an independently
published matrix. Off-hand IAS does not count *because IAS is damagerelated*. So
the flag's meaning is not being taken on trust; it was verified here first, by
accident, a cycle early.

### 10.2 Debt A — a weapon proc does fire from a kick, and Rift is better than
### the page said

The question cycle 4 left open was whether a weapon-sourced `item_skillonhit`
survives a `weapsel = 4` strike. It does. The D2library mechanics reference
lists what a kick carries and **trigger events are on the list**, beside
Crushing Blow, Open Wounds and both leeches. It also says the thing that decides
where the proc has to sit: "Secondary claw doesn't count for special events."

Two corrections follow, and the second is the more serious.

**The caveat comes off.** Riftsin survives as a gear variant of the Kicksin, and
its central claim is now supported rather than hedged.

**And the page had the other half backwards.** It told the reader that Rift's
160–250 magic and 60–180 fire damage were "weapon-damage adds a kick
structurally cannot use". They are not. The damage order adds plain minimum and
maximum damage from equipment at one step — from which Smite, Vengeance and the
Assassin's kicks are excluded — and adds elemental and magic damage from skills
and equipment at a *later* step, from which they are not. The page collapsed two
steps into one and threw away the two largest lines on the item.

The full list, as published on the build page:

| effect | on a Dragon Talon kick |
| --- | --- |
| chance to cast on striking / on attack | yes |
| Crushing Blow, Open Wounds | yes |
| life and mana leech | yes |
| elemental and magic damage from equipment | yes |
| poison damage, Venom | yes |
| Deadly Strike | **no** |
| Claw Mastery | **no** |
| + minimum and maximum *physical* damage | **no** |
| anything at all on the off-hand claw | **no** |

Deadly Strike is the third correction. It was sold on the Kicksin page in five
places — three on Gore Rider, two on Highlord's Wrath — and it does nothing on a
kick. Both items are still right for the slot; the reason given was wrong.

Claw Mastery is the one place cycle 4's conclusion survives intact. It spent one
point there rather than twenty, on the strength of an asymmetry in the formulas
alone, and marked the mechanism "not determinable". It is determinable, and the
answer agrees: Claw Mastery is not applied to kick damage.

Crushing Blow's magnitude was also marked unavailable. It is available:
100 / (2 × (players + 1)) percent of the monster's **current** life, taken from
its single-player pool even in a full game; halved against champions and bosses,
halved again for a ranged hit, a tenth against objects; uncapped chance, and
nothing over 100% helps. Positive physical resistance cuts it, which is why a
physical immune takes none — the wall the page already named, now with a number.

### 10.3 Debt B — two Mosaics do give 100%, and it is derived

Cycle 4 refused to publish a combined figure and said so on the page. The refusal
was right at the time and is wrong now. `item_charge_noconsume` (`*ID 200`)
settles it in three columns, each with a control inside the same file:

- **no `damagerelated`** — so it is not restricted to one weapon. The contrast is
  its own sibling: `item_noconsume` *does* carry the flag. A stat without it
  reaches "the item owners accumulated total", which is the same path that makes
  two claws' `+skills` add — a fact this site already publishes, for kick count.
- **no `Save Param Bits`** — instances are not keyed by a parameter, so two
  sources sum into one entry rather than standing as two. `item_skillonhit`
  carries `Save Param Bits 16` precisely so two different procs stay separate.
- **no `maxstat`** — only four stats in the entire file have one, and all four
  are current/max pairs (`durability`, `hitpoints`, `mana`, `stamina`). There is
  no cap, and `Save Bits 7` holds 0–127.

So: one claw 50%, two claws 100%, **one roll rather than two**, no application
order, and no second chance. A finisher that misses spends nothing, so the roll
only matters on the one that lands.

### 10.4 Debt C — the charge timer

Fifteen seconds flat, at every level, for all six charge-ups: `auralencalc` is
`par3 = 375` on the five martial arts charge-ups and a literal 375 on Royal
Strike, and 375 / 25 = 15.0.

`states.json` adds the part that was missing. The six are
`progressive_damage`, `progressive_steal`, `progressive_fire`,
`progressive_lightning`, `progressive_cold` and `progressive_other`; each is
`pgsv = 1` with its own `stat` and its own overlay, and **none of them is in a
`group`**. `group` is the column that makes two states exclude each other. So
the six timers are independent: a second Phoenix Strike hit re-applies
`progressive_other` and restarts *that* fifteen seconds, and charging Tiger
Strike starts a different state without touching it. The charge count lives in
those stats at `Send Bits 3`, which is why three is the ceiling.

A finisher that consumes clears them. A finisher that *preserves* them leaves
the timer where it was — the property's only job is to skip the consumption
step, so nothing else is touched. That last step is derived from the mechanism
rather than measured, and the page says which.

Not established, and not published: whether swapping weapons or changing area
clears the states.

### 10.5 A fourth item closed for free

The Kicksin page published Fade and Burst of Speed's mutual exclusion as resting
"on behaviour, not on a column", because `states.txt` was outside the
extraction. It is inside it now: `fade` and `quickness` are the only two members
of `group = 2`. The control is `group = 1`, which holds exactly the Sorceress
armours. `venomclaws` carries no group, which is why Venom stacks with either.

### 10.6 New controls

Four rules were added and one was rewritten, taking `scripts/assassin-rules.ts`
from sixteen to twenty.

- `kick-blocks-every-weapon-effect` — the shipped defect: denying a kick every
  weapon property rather than the physical share. A correct total denial has to
  name what it is denying.
- `deadly-strike-on-a-kick` — crediting an affix that does nothing.
- `proc-limited-to-one-kick` — confining a per-hit proc to the first kick, which
  nothing establishes in either direction.
- `charge-timer-refreshed-by-a-finisher` — the wrong event restarting the
  fifteen seconds.
- `charge-preservation-overstated` was **inverted where it needed inverting**.
  It previously rejected 100 as unfounded; it now knows that 50 is right for one
  claw and 100 for two, reads the sentence to see which it is about, and rejects
  each figure attached to the wrong number of claws. A rule left as it was would
  have been enforcing the error.

Two escape clauses were forced onto `kick-scales-with-weapon` by correct
sentences it rejected: a weapon credit scoped to the elemental or magic half is
true, and a sentence *denying* the credit is the thing the rule wants said.
Neither clause reaches the three mutations the rule was written for.
