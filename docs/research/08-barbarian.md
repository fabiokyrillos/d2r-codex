# Barbarian — foundation notes

Baseline: **D2R Patch 3.3 / Ladder Season 15**. Data pinned at
`blizzhackers/d2data@fc469993502d0498809b9fc1af140ee2a9eb8902`
("Updated for patch 3.3.93847"), the same commit the skill graph is generated
from. Verified 2026-09-06.

This note covers the class foundation only: three trees, thirty skills, and the
four things in the Barbarian's rows that the generator cannot handle as it
stands. **No build page exists yet and nothing on the site promises one.** The
build inventory is the next cycle's work.

---

## 1. The three trees, and which page is which

The Barbarian is the sixth class to arrive and the first whose tree slugs were
already declared before a skill was authored. `content/classes/classes.ts`
carries `trees: ["warcries", "combat-masteries", "barbarian-combat-skills"]`,
and the prefix on the third is not cosmetic: `combat-skills` is the Paladin's,
tree slugs resolve globally, and the collision rendered ten Paladin skills under
the Barbarian's heading. `scripts/class-tree-rules.ts` records that defect.

So the mapping had to be derived rather than assumed, and the extraction states
it twice over.

| `SkillPage` | Skills | Game's own tab name | Site slug | `order` |
| --- | --- | --- | --- | --- |
| 1 | Bash, Leap, Double Swing, Stun, Double Throw, Leap Attack, Concentrate, Frenzy, Whirlwind, Berserk | `SkillCategoryBa3` = **Combat Skills** | `barbarian-combat-skills` | 3 |
| 2 | Blade, Axe, Mace, Polearm, Throwing, Spear Mastery, Increased Stamina, Iron Skin, Increased Speed, Natural Resistance | `SkillCategoryBa2` = **Combat Masteries** | `combat-masteries` | 2 |
| 3 | Howl, Find Potion, Taunt, Shout, Find Item, Battle Cry, Battle Orders, Grim Ward, War Cry, Battle Command | `SkillCategoryBa1` = **Warcries** | `warcries` | 1 |

Ten skills per page, exactly.

**`SkillPage` runs backwards from the display order, and it does so for every
class in the game.** Checked, not assumed — the rule `SkillPage N` ↔
`SkillCategory<class>(4 − N)` holds for all seven classes in
`allstrings-eng.json`, including the six already authored. The Assassin's file
already noted this for itself; it is general.

### 1.1 There are two numberings, and both are Tier 1

A reader told "tab 1" can be told two different things, so the site says
neither. `charstats.json` maps the Barbarian's item-modifier tabs
`StrSkillTab1/2/3` to `StrSklTabItem11/12/10`, which resolve to
**"+N to Combat Skills" / "+N to Masteries" / "+N to Warcries"** — the *page*
numbering, not the display one. `+1 to Barbarian Skill Levels` is `ModStr3e`.

The site publishes tree names and never a tab index.

---

## 2. Four things the extraction forced

Each is a change to a file this pass does not own, and each is written up in
`docs/proposals/`. Three of the four stop `gen:skill-graph` outright.

### 2.1 One slug is not what the table calls it

| `skill` column | published slug | pinned by |
| --- | --- | --- |
| `Pole Arm Mastery` | `polearm-mastery` | page 2, row 2, level 6, `passiveitype = pole`, and `str name = skillname134`, which resolves to **"Polearm Mastery"** |

The gap is one space, and it is the same shape as `Clay Golem` — a spacing
artifact in the table that no player has ever seen. The string table is
unambiguous: the shipped name has no space in it, and
`/classes/barbarian/skills/pole-arm-mastery` would be a URL naming something
nobody types.

The other twenty-nine identifiers are byte-identical to their display names.
Two were checked specifically because they looked like candidates and were not:
`Blade Mastery` really is called Blade Mastery (`skillname127`), and its own
description — "improves swords and daggers fighting skill" — explains why it is
not called Sword Mastery. `Battle Command`'s `str alt` is "Battle Cmd", which is
a short label for a narrow UI element rather than a second name.

### 2.2 Two synergy kinds the table has never seen

`synergiesFor` throws on an unrecognised parameter label rather than defaulting
to "damage", which is the whole reason this was caught before generation rather
than after. Running the repository's own `synergiesFor` over the thirty pinned
`bar` rows fails on three of them:

```
Bash:      unknown synergy kind "Attack Rating synergy"
Stun:      unknown synergy kind "Attack Rating synergy"
Find Item: unknown synergy kind "% chance synergy"
```

Both need an entry in `SYNERGY_KINDS`. `"attack rating"` maps to the existing
kind `attack-rating` — already in `SYNERGY_KINDS_LABELLED` and already
translated, because the Necromancer's golem ring uses it — so it costs one line.
`"% chance"` is a genuinely new kind and needs a value, a label and words in
both locales.

Neither is a judgement call about what the number means. The game labels its own
parameters and these two labels are simply new to this repository.

### 2.3 Two skills carry a physical damage table

`assertPhysicalClassified` stops the generator on any in-scope row carrying
`MinDam`/`MaxDam` that nobody has classified. Two Barbarian rows do:

| Skill | `MinDam`-`MaxDam` | bands | `SrcDam` | at level 20 | Verdict |
| --- | --- | --- | --- | --- | --- |
| Leap Attack | 10-20 | 4/8/12/16/20 and 8/16/24/32/40 | 128 | 150-300 | Publishes |
| War Cry | 30-40 | 8/9/10/12/14, both | none | 198-208 | Publishes |

Both are the skill's own damage, and each is the shape of a row already on the
allow-list. Leap Attack is the Blade Fury shape — a weapon share **and** a
published physical range, so the table is half the story and the page says the
other half. War Cry is the Shock Wave shape — no `SrcDam`, no `EType`, so the
range is the whole of it.

> **A discriminator that was tried and does not work.** Every row on
> `PUBLISHES_PHYSICAL` also prints a physical range in the game's own tooltip
> (`desccalca = pnma`/`pxma`, against `StrSkill4 = "Damage: %d-%d"`). So does
> Holy Shield, so does Raven, and so does Spirit of Barbs — all three excluded.
> The tooltip is not the tell, and the allow-list stays an allow-list.
>
> `descdam` comes closer: it is empty on five of the six excluded rows and set on
> every included one. Psychic Hammer breaks it, and one counterexample in six is
> not a rule. Recorded here so the next class does not spend the hour again.

### 2.4 The Barbarian is the first class to publish no effect rows at all

`EFFECTS` is keyed by slug and no Barbarian slug is in it, so all thirty skills
publish an empty effects table and every magnitude on every page is prose. This
is a statement rather than an oversight: `damage.test.ts` counts effect-
publishing skills per class and asserts that no class outside its own list
publishes one, and a class publishing zero is absent from that map rather than
wrong in it. **The test needs no change**, which was checked.

Three rows would earn an effect if the next pass wants them — Battle Orders'
life percentage, Natural Resistance's resist-all and Grim Ward's slow are the
class's three most-quoted numbers. Adding them is a generator change and belongs
to whoever owns that file.

---

## 3. The class's own shape, from the columns

### 3.1 The Warcries feed the Combat Skills

Twenty synergy edges, produced by running the repository's `synergiesFor` over
the pinned rows and reading the output rather than a guide. Thirteen skills
receive; thirteen give.

| Receiver | Sources, and what each gives per hard point |
| --- | --- |
| Bash | Stun +5% damage; **Concentrate +5% attack rating** |
| Stun | Bash +8% damage; **Concentrate +5% attack rating**; **War Cry +5 frames of stun** |
| Double Swing | Bash +10% damage |
| Double Throw | Double Swing +8% damage |
| Leap Attack | Leap +10% damage |
| Concentrate | Bash +5% damage; **Battle Orders +10% damage** |
| Frenzy | Double Swing +8% damage; **Taunt +8% damage** |
| Berserk | **Howl +10% damage**; **Battle Orders +10% damage** |
| War Cry | Howl, Taunt and Battle Cry, +6% damage each |
| Shout | Battle Orders and Battle Command, +5 s duration each |
| Battle Orders | Shout and Battle Command, +5 s duration each |
| Battle Command | Shout and Battle Orders, +5 s duration each |
| Find Item | Find Potion, +1% chance |

The bold entries cross a tree. That is the class in one table: **Berserk,
Concentrate and Frenzy — the three skills every serious Barbarian build is built
on — all take their largest damage synergy from the Warcries tree**, and
Battle Orders is a damage skill for two of them on top of being the party's life
buff. No other class in scope has its damage tree fed by its utility tree.

Every coefficient is receiver-owned — the `parN` lives on the row being raised,
inside a sum of several sources — so the graph carries no `magnitude` for any of
the twenty edges and all twenty numbers are authored prose. That is the ordinary
case, not a special one; seventeen edges elsewhere on the site are the same.

### 3.2 Whirlwind neither gives a synergy nor receives one

It is the only level-30 skill in the class with both lists empty, and one of
twelve skills of thirty in that position — the ten Combat Masteries, Grim Ward
and Whirlwind. `calc1 = ln12` and nothing else:
**30% weapon damage at one point and 5% more per level**, with attack rating
+50% and +5% per level. There is no synergy to spend points on, which is why the
build's remaining forty-odd points go to a mastery and the Warcries.

### 3.3 Three relationships that are real and are *not* synergies

Each reads another skill's `blvl` under a parameter the game does **not** label
a synergy, so `synergiesFor` correctly drops it and the page shows no edge. All
three are prose, and authoring them as `synergies` would be rejected by
`check:content`.

| On | Reads | Under | Effect |
| --- | --- | --- | --- |
| Concentrate | `calc4 = skill('Berserk'.blvl)` | "% Damage Dealt as Elemental" | +1% of its damage converted to **magic** per hard point of Berserk |
| Frenzy | `calc4 = skill('Berserk'.blvl)` | the same | the same |
| Grim Ward | `aurastatcalc4 = -par3 - (skill('Find Potion'.blvl) * par4)` | "Damage Taken % per level" | enemies take **+20%, and +5% more per hard point of Find Potion** |
| Frenzy | `auralencalc = par7 + skill('Increased Stamina'.blvl) * 10` | a bare literal, no `parN` at all | +10 frames of Frenzy duration per hard point of Increased Stamina |

Four rows, three shapes. The Berserk conversion is the one that matters most: it
is the only route by which a Concentrate or Frenzy Barbarian deals damage a
physical immune cannot ignore, and it costs hard points in a skill neither build
presses.

### 3.4 Three skills cannot be interrupted, and they are the three that matter

`interrupt` is blank on eleven of the game's hundred and fifty player skills.
Three of the eleven are the Barbarian's: **Concentrate, Frenzy and Whirlwind**.
The other eight are Smite, Zeal, Charge, Werewolf, Werebear and the Assassin's
three kicks — which is to say, exactly the set players already describe as
uninterruptible.

The direction of the column is settled by the game's own text rather than by the
company it keeps: Concentrate's description is "attack that is **not
interruptible** and improves attack rating and defense".

### 3.5 Weapon selection, read off the column rather than off a guide

`weapsel` is populated on eleven rows in the whole game and falls into four
groups. Nothing in the file names the modes, so only what the grouping supports
is published.

| `weapsel` | Rows | What the site says |
| --- | --- | --- |
| 1 | `Left Hand Throw`, `Left Hand Swing` (internal) | nothing; not player skills |
| 2 | **Whirlwind**, and the Ancients' copy of it | Whirlwind has a weapon-selection mode of its own, shared with no other skill in the game |
| 3 | **Double Swing, Double Throw, Frenzy**, and the Assassin's four two-claw skills | strikes with both weapons |
| 4 | Kick, Smite, Dragon Talon, Dragon Tail, Dragon Flight | the damage is not the held weapon's — the site already models these as `kick` and `shield` |

Group 3 is corroborated by the rows themselves: every skill in it carries both
`itypea1` **and** `itypeb1`, an off-hand item requirement, where Whirlwind, Bash,
Stun, Concentrate, Berserk and Leap Attack carry only `itypea1`. Frenzy's own
description closes it — "requires you to equip two weapons".

**What is not published:** that `weapsel = 2` means Whirlwind alternates between
the two weapons on successive hits. That is the community's account and it may
well be right; the extraction says only that Whirlwind's mode is its own.

### 3.6 What each mastery actually covers

`passiveitype` is an item-type code, and the codes are wider than the names. The
equivalence chains in `itemtypes.json` resolve as follows, and three of them are
surprises worth a sentence on the page.

| Mastery | `passiveitype` | Type name | Also reaches |
| --- | --- | --- | --- |
| Blade | `blde` | "Swords and Knives" | daggers, and throwing knives |
| Axe | `axe` | "Axe" | throwing axes |
| Mace | `blun` | "Blunt" | clubs, hammers, maces — **and scepters, staves and wands** through `rod` |
| Polearm | `pole` | "Polearm" | nothing else |
| Throwing | `thro` | "Thrown Weapon" | throwing axes, throwing knives, javelins, missile potions |
| Spear | `spea` | "Spear" | **javelins**, and Amazon spears |

So a javelin is covered by Spear Mastery *and* Throwing Mastery; a throwing axe
by Axe Mastery *and* Throwing Mastery. The stats granted differ — the five melee
masteries write `passive_mastery_melee_th/dmg/crit` and Throwing Mastery writes
`passive_mastery_throw_th/dmg/crit` — so which one applies to a thrown swing is
a question the columns do not answer and the site does not either.

Numerically the six are near-identical: **28% damage +5% per level**, critical
strike **0% climbing toward 35%**, and attack rating **40% +8% per level** for
Blade, Axe and Mace against **44% +8%** for Polearm, Throwing and Spear. The
Barbarian's 35% critical ceiling is ten points above the Assassin's Claw
Mastery, which reaches 25%.

Blade, Axe and Mace Mastery carry `aura = 1` where the other three do not. No
`aurastate` accompanies it and nothing on the row uses it; it is not published.

### 3.7 Throwing Mastery is three skills wide

It is the only mastery with more than three passive stats, and the extra three
are the modern ones:

| Stat | Curve | Tooltip |
| --- | --- | --- |
| `skill_pierce` | 0% to 55% | "%d%% Chance to Pierce" |
| `passive_mastery_noconsume` | 0% to 66% | "%d%% Chance to not consume Quantity" |
| `passive_mastery_replenish_oncrit` | flag, `Param11 = 1` | "Replenish Quantity on Critical Strike" |

A throwing Barbarian's ammunition problem is solved inside the mastery: two
thirds of throws consume nothing, and a critical hit puts one back. This is the
single largest difference between the current baseline and the 1.1x-era guides
that still describe throwing as unplayable past Normal.

---

## 4. Facts the pages rest on, and where each came from

Tier 1 throughout unless stated. Figures are at one hard point unless a level is
named, and 25 frames is one second.

| Claim | Column |
| --- | --- |
| Bash 50% damage +5%/level, +1 flat +1/level | `calc1 = ln12`, `calc2 = ln34` |
| **Double Swing has no damage of its own** — `calc1 = skill('Bash'.blvl)*par8` and nothing else | its entire Damage % is Bash's 10% per point |
| Double Swing +50% attack speed | `calc3 = par5 = 50` |
| Double Swing costs 1 mana at level 1 and **nothing from level 9** | `mana 8, lvlmana -1, manashift 5`, `minmana 0` |
| Stun 30 frames +5/level, +5 per hard point of War Cry, tooltip capped at 250 frames | `ELen`, `ELevLen`, `ELenSymPerCalc`, `min(250, edln)` |
| Double Throw 16% +8%/level | `calc1 = ln12` |
| Leap knockback radius 4 +1/level, range 8 to 30 | `Param1-4` |
| Leap Attack 200% +30%/level, radius 7 | `calc1 = ln34`, `desccalca4 = 7` |
| Concentrate +100% defence +10%/level while it swings | `aurastat1 = skill_armor_percent` |
| Concentrate 70% damage +5%/level | `calc1 = ln12` |
| Frenzy 90% +5%/level; run/walk 20% to 200%; attack speed 0% to 50%; 6 s duration | `calc1`, `dm34`, `dm56`, `par7 = 150` |
| **Whirlwind costs 12.5 mana, not 25** | `mana 25` at `manashift 7`; 22 at level 20 |
| **War Cry costs 10 mana, not 40** | `mana 40` at `manashift 6`; 24.25 at level 20 |
| Berserk 150% +15%/level, delivered **100% as magic** | `calc1`, `calc4 = 100`, `EType = mag` |
| Berserk sets defence to zero | `aurastat2 = armor_override_percent = -100` |
| **Berserk's defenceless window shrinks with level**, from about 68 frames to about 33 | `par4 - min(((110*lvl)/(lvl+6)*(par4-par3)/100), par4-par3)`, par3 25, par4 75 |
| Berserk grants no damage reduction | `aurastat1 = damageresist`, `aurastatcalc1 = par5`, and **`par5 = 0`** |
| Iron Skin +30% defence +10%/level | `passivecalc1 = ln12` |
| Increased Stamina +30% stamina +15%/level | `passivecalc1 = ln12` |
| Increased Speed 7% to 50% run/walk | `passivecalc1 = dm12` |
| Natural Resistance 0% to 80% all resistances | `dm12` onto all four resist stats |
| Howl: fear 3 s +1 s/level, monsters run 24 +5/level | `ln56`, `ln34` |
| Taunt: target's attack rating −5% −2%/level, damage −5% −2%/level | `aurastat1/2` |
| Shout +100% defence +10%/level, 30 s +10 s/level, radius 19 | `ln12`, `ln34`, `desccalca3 = 19` |
| Battle Cry: enemy defence −50% −2%/level, enemy damage −25% −1%/level, 12 s +2.4 s/level, radius 5 | `Param1-6` |
| **Battle Orders +35% life, mana and stamina, +3%/level**, 30 s +10 s/level, radius 19 | `item_maxhp_percent`, `item_maxmana_percent`, `skill_staminapercent`, all on `ln34` |
| **Battle Command grants +1 to all skills and does not scale** | `aurastat1 = item_allskills`, `aurastatcalc1 = par3`, `par3 = 1` at every level |
| Find Potion 0% to 100% chance; 30% of finds are mana, 10% rejuvenation | `dm12`, `par3`, `par4` |
| Find Item 5% to 60% chance +1% per hard point of Find Potion; 30% high quality, 5% magic | `dm12 + skill('Find Potion'.blvl)*par8` |
| Grim Ward: radius 6 +1/level, slows 0% to 75%, **enemies take +20% damage +5% per Find Potion point**, ward lasts 40 s and does not scale | `ln12`, `dm78` onto velocity/attackrate/animrate, `aurastatcalc4`, `calc1 = 1000` |
| War Cry stun 25 frames +5/level, radius 7 | `calc4 = ln12`, `desccalca4 = 7` |
| Barbarian life: 55 at level 1, **4 per Vitality**, 2 per level; 10 mana, 1 per Energy | `charstats.json`, "the following are in fourths" |
| Block factor 25; primal helms are `phlm`, class `bar` | `charstats.json`, `itemtypes.json` |

### 4.1 The three counterintuitive mana costs

`manashift` is a power-of-two divisor and three Barbarian rows are shifted. Read
at face value the `mana` column is wrong by a factor of two or four on exactly
the skills a player presses most.

| Skill | `mana` | `manashift` | Level 1 | Level 20 |
| --- | --- | --- | --- | --- |
| Whirlwind | 25 | 7 | **12.5** | 22 |
| War Cry | 40 | 6 | **10** | 24.25 |
| Frenzy | 3 | 7 | **1.5** | 1.5 |

---

## 5. What was deliberately not published

- **Any attack-speed breakpoint.** The site publishes Faster Cast Rate, Faster
  Hit Recovery and Faster Block Rate tables for the Barbarian and no attack-speed
  table for anyone. Whirlwind and Frenzy are the two builds where a frame table
  would matter most and where the weapon's own speed modifier enters the
  calculation, so the number is per weapon rather than per class. `weapons.json`
  carries the modifiers at Tier 1 and the frame tables are not sourced at any
  acceptable tier. The Fury Druid page's empty table with
  `breakpointNotes` is the precedent when the build pages arrive.
- **That `weapsel = 2` means alternating weapons.** See §3.5.
- **Which mastery applies to a thrown swing** where two cover the same item.
  See §3.6.
- **Stun's length at level 20.** The row bands it through `ELevLen 5/5/2` and
  the site's `bandedTotal` models five bands where the elemental-length columns
  give three. The baseline, the per-level parameter, the War Cry contribution
  and the game's own 250-frame display cap are all published; the level-20
  total is not, because publishing it would mean asserting a band mapping this
  repository has not established.
- **Berserk's exact defenceless window in seconds.** The formula is integer
  arithmetic in the engine and the two ends — about 2.7 s falling toward about
  1.3 s — are stated as approximations, with the direction (it *shrinks*) as the
  fact that matters.
- **What `aura = 1` does on three of the six masteries.** Nothing on the row
  consumes it.

---

## 6. `json/base/` agrees with `json/`, which is the fourth time this has happened

All thirty `bar` rows are identical between the two extractions except for
`aitype`, which is absent from the base file and set to `4` on Bash, Stun,
Frenzy and Berserk. `aitype` is a hint for monster and hireling use of a skill
and touches no player behaviour.

This is the same observation the Druid pass recorded as its open question 4: if
the base extraction were genuinely pre-2.4 it would differ from the current one
on a class the 2.4 balance pass touched, and the Barbarian was touched — Throwing
Mastery's pierce, no-consume and replenish stats (§3.7) are exactly that era's
work, and they are in **both** files. The "agreement" figure in the generated
header measures less independence than its own caveat already warns. No claim on
this site depends on it.

---

## 7. Open questions for the build cycle

1. Whether a Barbarian attack-speed frame table can be sourced at Tier 1 or
   Tier 2 for a *named weapon*. The Whirlwind and Frenzy pages both want one and
   neither can have a class-wide one.
2. Whether the Berserk conversion on Concentrate and Frenzy (§3.3) is enough to
   carry a physical-immune pack, or whether those builds need a second answer.
   It is a percentage of a physical hit, not a separate damage source.
3. Whether Grim Ward's +damage-taken debuff is worth the Find Potion points a
   maxed one implies. Twenty points in a level-1 skill for +100% damage taken
   inside a 40-second ward is either the best point spend on the class or a
   trap, and the columns cannot say which.
4. Whether the Ancients' copies of Barbarian skills (`Korlic's Bash`,
   `Korlic's Leap Attack`, `Talic's Whirlwind`) ever need to be mentioned. They
   are separate rows outside `charclass`, they read the *player's* skill levels
   through the same `skill('Leap'.blvl)` expressions, and nothing on the site
   models a monster's skill bar.

## Sources

Tier 1 throughout, from the pinned commit: `skills.json`, `skilldesc.json`,
`allstrings-eng.json`, `itemtypes.json`, `charstats.json` and `base/skills.json`.
The synergy table in §3.1 and the three failures in §2.2 are the output of this
repository's own `synergiesFor` run against those rows, not a transcription.
No guide was consulted for the foundation.
