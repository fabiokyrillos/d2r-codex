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

**Twenty-four synergy edges**, produced by running the repository's
`synergiesFor` over the pinned rows and reading the output rather than a guide.
Thirteen skills receive; thirteen give. Fourteen edges are damage, seven
duration, two attack rating and one find chance — counted off the shipped graph,
because the first draft of this note said "twenty" over a list of twenty-four
and the coordinator caught it.

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
the twenty-four edges and all twenty-four numbers are authored prose. That is the
ordinary case, not a special one; seventeen edges elsewhere on the site are the
same.

### 3.2 Whirlwind neither gives a synergy nor receives one

Twelve of the thirty have both lists empty — the ten Combat Masteries, Grim Ward
and Whirlwind — and eleven of the twelve are passives or a corpse skill.
**Whirlwind is the only *attack* on the class in that position**, and Natural
Resistance is the only other level-30 skill in it. `calc1 = ln12` and nothing
else:
**30% weapon damage at one point and 5% more per level**, with attack rating
+50% and +5% per level. There is no synergy to spend points on, which is why the
build's remaining forty-odd points go to a mastery and the Warcries.

### 3.2.1 Four more facts about the skill, from the Assassin's pass

The Assassin reaches Whirlwind as a runeword-granted oskill, so the same `bar`
row was researched twice from two directions. These are that pass's findings,
recorded here because four of the five are facts about **the skill** rather than
about either class, and because a Barbarian page that ignored them would be
worse rather than merely unbroken. They are relayed through the coordinator;
where a tier is given it is theirs.

| Claim | Verdict | Tier |
| --- | --- | --- |
| Weapon Block works at **full effectiveness** while whirling — it is *running* that is cut | Established | 3, corroborated |
| Whirlwind releases no charge-up | Established — the row carries **no `finishing` flag**; the six that do are `Attack`, `Left Hand Swing` and the four Dragon skills | 1 |
| Whirlwind takes Increased Attack Speed from **all equipment**, not only from the weapon's own sockets | The 1.1x-era claim is **refuted**; patch 2.4.3 also states that while dual wielding the attack frame for each weapon is averaged, rounding up | 2 |
| Whether on-striking procs fire during a whirl | **NOT ESTABLISHED**, and it is to be published as not established rather than resolved either way | — |

Two of these change what a Barbarian page can say. The block one is why the
Whirlwind page can hold a shield without a caveat, and the attack-speed one
retires a claim that still appears in guides — which also means the site's
absence of an attack-speed frame table for this class (§5) is a gap in the
*table*, not a reason to repeat the socket myth in its place.

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

### 3.5 Weapon selection — the column, and the guide that names it

`weapsel` is populated on sixteen rows in the whole game and falls into four
groups. **Counted rather than eyeballed**, because the first draft of this
section said "eleven rows" and grouped them by eye:

```
weapsel=1  rows=2   playerSkills=0
weapsel=2  rows=2   playerSkills=1
weapsel=3  rows=7   playerSkills=7
weapsel=4  rows=5   playerSkills=4
```

| `weapsel` | Rows | What the site says |
| --- | --- | --- |
| 1 | `Left Hand Throw`, `Left Hand Swing` (internal) | nothing; not player skills |
| 2 | **Whirlwind**, and `Talic's Whirlwind` | the right weapon, the left, or both. Whirlwind is the only **player** skill with this mode — 2 rows, 1 of them a player skill |
| 3 | **Double Swing, Double Throw, Frenzy**, and the Assassin's Fists of Fire, Dragon Claw, Claws of Thunder and Blades of Ice | always both weapons. **Seven skills, not three** |
| 4 | Kick, Smite, Dragon Talon, Dragon Tail, Dragon Flight | the damage is not the held weapon's — the site already models these as `kick` and `shield` |

Group 3 is corroborated by the rows themselves: every skill in it carries both
`itypea1` **and** `itypeb1`, an off-hand item requirement, where Whirlwind, Bash,
Stun, Concentrate, Berserk and Leap Attack carry only `itypea1`. Frenzy's own
description closes it — "requires you to equip two weapons".

**The modes are named, and this note previously said they were not.** The
Phrozen Keep `Skills.txt` file guide (kb 440) gives 2 as "it can either use the
Right or the Left or Both weapons (used by Whirlwind)", 3 as always both, and 4
as no weapon. That is the same author and series as kb 448, which this project
has already validated and which the Assassin's Whirlwind page cites, so it sits
at a tier this repository accepts.

What is **still** not published is the community's stronger claim that
`weapsel = 2` means Whirlwind *alternates* between the two weapons on successive
hits. The guide says the mode can use either or both; it does not say the engine
alternates, and that is a different sentence.

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
  `breakpointNotes` is the precedent when the build pages arrive. **The empty
  table must not be filled with the old socket claim**: patch 2.4.3 refutes it,
  and Whirlwind takes attack speed from all equipment (§3.2.1).
- **Whether on-striking procs fire during a whirl.** Not established at any
  acceptable tier, and to be published as *not established* rather than resolved
  in either direction. See §3.2.1.
- **That `weapsel = 2` means Whirlwind *alternates* between the two weapons.**
  The mode itself is now sourced — see §3.5 — but "either or both" is not
  "alternates", and only the first is published.
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

---

# Part 2 — Build inventory

**Nothing in Part 1 was re-researched.** Part 1 is Tier 1 and settled; this part
asks a different question, which is what people actually play and how many pages
that is. Where a guide and the extraction disagree, the extraction wins and the
row says so.

## 8. Sources, and what could not be reached

The roster comes from **Maxroll's Barbarian overview and its eight endgame build
guides**, the same Tier 3 specialist the Assassin pass used, corroborated by
search for the families Maxroll does not cover.

**Source-freshness caveat, identical to the Assassin's.** All eight guides plus
the levelling guide carry `dateModified` of **2026-05-22** and are titled
"Season 14". None has been touched for Season 15. Patch 3.3's skill fixes are
all Warlock, so they remain substantively current, but their Season 14 framing
must not be copied onto a page here.

**Two sources could not be read, and no attempt was made to get around that.**
`icy-veins.com` returns 403 to a plain fetch and `diablobytes.com` serves a
Cloudflare interstitial. Working around bot detection is not something this
project does, so both are absent from the evidence below. Neither is load-bearing:
every roster decision rests on Maxroll plus Tier 1.

**Gold-seller contamination, as on the Assassin.** `rpgstash.com`, `items7.com`
and `mtmmo.com` rank well for "D2R Barbarian build" and appear throughout search
results. They are usable as weak evidence that a build is *talked about* and for
nothing else.

### 8.1 Source reliability: Maxroll's overview contradicts Maxroll's guides

Filed here rather than only under the build inventory, because it is a fact
about a **source** and not about a build. This site's Tier 3 policy treats a
specialist database as one thing; this is evidence that one of them is not
internally consistent, and that its overview and hub pages carry less weight
than the guides they link to.

Maxroll's **Barbarian overview page** states that Berserk's magic damage rises
"10% for each Skill Point allocated into **Howl**, and **Shout**".

The extraction says Howl and **Battle Orders**:

```
Berserk  calc1 = ln12 + (skill('Howl'.blvl) + skill('Battle Orders'.blvl)) * par8
         par8 = 10
```

and the generated graph agrees — `berserk <- battle-orders (damage), howl (damage)`.
Maxroll's own **Berserk build guide** also agrees: it maxes Howl and puts ten
points into Battle Orders, while giving Shout one. So the overview contradicts
the guide it links to, and Tier 1 sides with the guide.

This is not a trivia point. Shout is a skill a Barbarian otherwise gives one
point; Battle Orders is a skill he maxes anyway for the life. A reader who
believed the overview would spend twenty points in the wrong shout and lose the
synergy they were buying.

## 9. The eight guides, as point plans

Read off the guides rather than summarised, because the consolidation argument
is entirely about how much two plans overlap.

| Guide | Maxes | Ten points | Stated content |
| --- | --- | --- | --- |
| **Whirlwind** | Whirlwind, Blade Mastery, Battle Orders, **Find Potion**, Berserk | — | general; "slow against physical immunes" |
| **Frenzy** | Frenzy, Double Swing, Blade Mastery, Battle Orders, Berserk | — | fastest melee; the pro list literally says "**Uber Variant**" |
| **Berserk** | Berserk, Blade Mastery, Howl, Find Potion, **Find Item** | Battle Orders | **The Pit and Pindleskin**; "#1 Elite Hunter", "Atrocious Density Farmer" |
| **Gold Find** | **Battle Orders**, Berserk, Find Potion, Howl, Blade Mastery | — | **Travincal only**; the con list says "No Variety in Farming Locations" |
| **War Cry** | War Cry, Battle Cry, Taunt, Battle Orders, Howl | — | "The Most Magic Find Possible", "Incredible Survivability" |
| **Double Throw** | Throwing Mastery, Double Swing, Double Throw | Find Item, Battle Orders | ranged elite hunter; "Safe From Afar" |
| **Leap Attack** | Leap Attack, Leap, Axe Mastery, Battle Orders, Find Item | — | "Farms Any Area", "Easily Stacks Magic Find", "Weak AoE Potential" |
| **Werewolf** | Blade Mastery, Battle Orders, Shout, Natural Resistance, Increased Speed | — | single-target; damage is **Feral Rage from Wolfhowl**, an oskill |

### 9.1 Two things in that table that Tier 1 explains and the guides do not

**Why the Whirlwind build maxes Find Potion.** Nothing in Find Potion touches
Whirlwind. It is there for §3.3: Find Potion adds **+5% enemy damage taken per
hard point** to Grim Ward's debuff, and +1% find chance to the single point in
Find Item. Twenty points in a level-1 skill doubles what everything inside the
ward takes. The guide maxes it and does not say why; the column says why. This
is the single best corroboration Part 1 got, because it is a point plan built on
a relationship the graph deliberately draws no edge for.

**Why the Werewolf build maxes nothing offensive.** Its damage skill is not a
Barbarian skill. Every point goes to masteries and shouts because there is no
Barbarian attack on the bar at all.

## 10. Decisions

**Six pages, one consolidation, five refusals.**

| Family | Aliases | Identity | Decision |
| --- | --- | --- | --- |
| **Whirlwind Barbarian** | WW Barb, IK Barb, Immortal King Whirlwind | The spin; physical, no synergies in either direction | **CREATE** — flagship |
| **Frenzy Barbarian** | Frenzy Barb, dual-Grief Barb | Two weapons, a stack that builds on itself | **CREATE** — the Uber build, and the one page that must explain dual wield |
| **Berserk Barbarian** | Pit Zerker, Zerker, **Horker**, **GF Barb**, Gambler, Travincal Barb | 100% magic damage, Find Item, elite hunting | **CREATE** — absorbs Gold Find, see §10.1 |
| **War Cry Barbarian** | Singer | Kills with a shout; carries no weapon damage at all | **CREATE** — the only Barbarian who does not need a weapon |
| **Double Throw Barbarian** | Thrower, Throw Barb | The class's only ranged build; ammunition is the mechanic | **CREATE** — Throwing Mastery's no-consume is the whole story and no pre-2.4 guide has it |
| **Leap Attack Barbarian** | Leaper | Jumps onto each elite; 770% weapon damage plus its own physical table | **CREATE**, priority 6 |
| Werewolf Barbarian | Wolfbarb | Feral Rage from Wolfhowl; zero Barbarian attack skills | **REFUSE** — its only item is uncatalogued, see §10.3 |
| Gold Find Barbarian | — | — | **CONSOLIDATE** into Berserk Barbarian |
| Concentrate Barbarian | — | — | **REFUSE** — a component |
| Immortal King Whirlwind | — | — | **REFUSE** — a gear tier |
| PvP: BvB, BvC, PvP Singer | BvE | — | **REFUSE** — PvP, and the site has none |
| Elemental Throw Barbarian | — | — | **REFUSE** — forum theorycraft |
| "Barbarian Leveling" | — | — | **NOT A BUILD** — it is the journey, Phase 4 |

### 10.1 Why Gold Find is a variant and not a page

The two plans share **four of their five maxed skills**:

| | Berserk Barbarian | Gold Find Barbarian |
| --- | --- | --- |
| Maxed | Berserk, Blade Mastery, Howl, Find Potion, **Find Item** | Berserk, Blade Mastery, Howl, Find Potion, **Battle Orders** |
| The other one | Battle Orders at ten | Find Item at one |

Same damage skill, same mastery, same synergy pair, same corpse skill. The whole
difference is which of Find Item and Battle Orders gets the last twenty points,
and a gear axis that stacks **%Extra Gold From Monsters** where the other stacks
**%Magic Find**. Maxroll's own text calls it "also known as the GF Barb", and
the community calls the same character the **Horker**.

A page for it would be a page for **Travincal**, which is the failure mode this
inventory was told to avoid — and the guide's own con list agrees, reading "No
Variety in Farming Locations".

So it becomes a **`skillPackage` plus a gear tier** on the Berserk page: the
package moves the twenty points from Find Item to Battle Orders, the gear note
swaps the magic-find axis for the gold-find one, and Travincal joins that build's
`farming` list. `Horker`, `GF Barb`, `Gambler`, `Pit Zerker` and `Travincal Barb`
all become `NICKNAMES` entries resolving to `berserk-barbarian`.

One mechanic from that guide must survive the fold, because it is not obvious and
it is not a gear preference: **if the mercenary lands the killing blow, his gold
find and yours are added together**. That belongs in `mercenaryNotes`.

### 10.2 The refusals, with reasons

Werewolf Barbarian is the fifth and has §10.3 to itself, because it is refused
for a reason none of these four share.

- **Concentrate Barbarian.** Concentrate is the backup button on two other bars —
  the Berserk and Leap Attack guides each give it exactly one point — and the
  uninterruptible option a Hardcore character presses when Berserk's zero defence
  is unaffordable. It has no maintained current-patch guide; the sources are a
  2000s-era fan archive and a combined "Berserk / Concentrate / Whirlwind"
  article. It is a component, exactly as Charged Strike is on the javelin pages.
- **Immortal King Whirlwind / "IK Barb".** Maxroll's own overview says the set
  "is most frequently used for Whirlwind" and "gets out scaled by setups that
  focus on Uniques and Runewords". That is a description of a budget gear tier,
  which this site already models as a tier, and that is the whole reason for the
  refusal. Secondarily it cannot currently be *referenced*: **this site has no
  set registry** — no `Set` content type, no route, no catalogued pieces — so
  Immortal King has to be a free-text pick wherever it appears. See §11.1, and
  note the correction there: an earlier draft of this section said "the registry
  has no sets at all", which reads as a claim about the game and is false.
- **PvP — BvB, BvC, PvP Whirlwind, PvP Singer.** These are real and they are
  named as PvP. They are refused on two counts. First, **this site publishes no
  PvP content whatsoever** — the string does not appear in any of the forty-two
  build files — so the first PvP page would be opening a category rather than
  adding a build, and that is a decision above a class pass. Second, the sources
  are a 2000s fan archive, d2jsp forum threads and gold-seller blogs; none is
  maintained against the current patch.
- **Elemental Throw Barbarian.** One forum guide on diablo2.io. Theorycraft, not
  a maintained family.
- **"Barbarian Leveling" as a build page.** It is a route, and this site models
  routes as journeys. It becomes `barbarian-journey` in Phase 4. Worth noting
  now: it levels on **Double Swing and War Cry**, so the journey's early game is
  a build no endgame page describes.

### 10.3 Werewolf Barbarian, and why the most distinct family is refused

**Refused.** It is worth writing at length because the reason is not that the
build is weak — it is the most mechanically distinct family on the class.

Distinct: it is the only Barbarian that invests nothing in a Barbarian attack.
Its plan maxes Shout, Natural Resistance and Increased Speed, which no other
build maxes. The site has a precedent for exactly that shape — the Whirlwind
Assassin, created despite investing zero points in its own damage skill.

**Refused on cost, not on merit.** Its damage skill is Feral Rage, reached
through exactly one item: **Wolfhowl, which is not in the catalogue and has no
substitute.** Cataloguing a unique on this site is a Tier 1 decode performed in a
research run — see `docs/sources/README.md` on how the item numbers were
produced — not a line added to a file. Paying that price for the seventh page,
while six stronger ones are unwritten, is the wrong trade. If the catalogue ever
grows a Wolfhowl for another reason, this refusal is worth revisiting; nothing
else about the build has changed.

The modelling question it raised has been settled separately, and in its favour:
see §10.5.

### 10.4 The arithmetic, written out so it cannot drift

| | |
| --- | --- |
| Families examined | **13** |
| — folded into another page (Gold Find) | −1 |
| — refused (Werewolf, Concentrate, IK Whirlwind, PvP, Elemental Throw) | −5 |
| — not a build (Barbarian Leveling) | −1 |
| **Build pages the Barbarian gets** | **6** |
| Published so far | 0 |

In priority order: **Whirlwind, Frenzy, Berserk, War Cry, Double Throw, Leap
Attack.**

### 10.5 `primarySkill` is the skill the plan spends points in

Settled by the coordinator across two classes at once, because the Barbarian and
the Assassin raised the same question from opposite sides: the Werewolf
Barbarian's damage skill is a Druid's, and the Whirlwind Assassin's is a
Barbarian's.

> **`primarySkill` is the skill the plan spends points in, not the skill you
> press.** A skill granted by an item takes no points, so it is never the plan's
> primary; it belongs in the prose, the gear tiers and the summary.

The Assassin's page resolves to Claw Mastery — the skill that plan maxes first —
and a Wolfhowl Barbarian, if it is ever written, resolves to a mastery on the
same rule.

The reason this is a written rule rather than a habit is that nothing would have
caught it. `check-content.ts` validates `primarySkill` only as "exists in the
skill data", **globally rather than per class**, so an out-of-class primary would
have passed silently — and `combinedReceivers` in `lib/builds/packages.ts` feeds
`primarySkill` into the synergy receiver set, where a skill from another class
would claim synergies from a tree the character does not have.

## 11. What blocks Phase 3, and it is not the skills

**Not one Barbarian item is in the registry.** `content/items/uniques.ts` holds
fifty-two uniques and none of them is a Barbarian item. Comparable melee pages
reference twenty-one to twenty-seven distinct items each — Kicksin 21, Zealot 22,
Maul Druid 26, Fury Druid 27 — and only two `ItemRef` kinds are used anywhere on
the site, `unique` and `runeword`.

Counted across the eight guides, by how many of them use each:

Counted across the eight guides, by how many of them use each. The **status**
column is the coordinator's, after they took the catalogue and resolved each row
against `uniqueitems.json` and `setitems.json` at the pinned commit.

| Missing | Guides using it | Kind | Status |
| --- | --- | --- | --- |
| Gheed's Fortune | 8 of 8 | grand charm, level 62 | being catalogued |
| Verdungo's Hearty Cord | 7 | unique belt, Mithril Coil, level 63 | being catalogued |
| Guillaume's Face | 7 | **set item** — Orphan's Call, on a Winged Helm | **never catalogable**, see §11.1 |
| Immortal King | 6 | **set**, six pieces | **never catalogable**, see §11.1 |
| Chance Guards | 6 | unique gloves, Chain Gloves, level 15 | being catalogued |
| **Arreat's Face** | 6 | unique, Slayer Guard, level 42 | being catalogued |
| Metalgrid | 5 | unique amulet, level 81 | being catalogued |
| Goldwrap | 5 | unique belt, Heavy Belt, level 27 | being catalogued |
| Oath | 5 | runeword | resolved, §11.2 |
| Lawbringer | 4 | runeword | outstanding |
| Wisdom | 3 | runeword | outstanding |
| Wolfhowl | 1 | unique | outstanding — and it is why §10.3 refuses that build |

Already catalogued and usable: Atma's Scarab, Gore Rider, Highlord's Wrath,
String of Ears, Razortail, Death's Web, and the runewords Enigma, Grief,
Fortitude, Beast, Last Wish, Pride, Insight, Treachery, Call to Arms, Chains of
Honor and — added during this pass — **Fury**, which matters to the Whirlwind
page for a reason given in §11.3.

A `GearPick` accepts a free-text `label` as well as a `ref`, so the pages can be
authored around whatever remains. The cost of doing so is not cosmetic: a
labelled Arreat's Face sits as plain text beside a linked Vampire Gaze, and it
appears in no "builds that use this item" index.

### 11.1 The site has no set registry, and that is thirty-five sets wide

An earlier draft of this note said the registry "has no sets at all", which
reads as a claim about the game rather than about this repository. It is wrong
and it is worth correcting rather than quietly fixing: `setitems.json` at the
pinned commit carries **140 set items across 35 sets**, and Immortal King is six
of them — Detail, Forge, Pillar, Soul Cage, Stone Crusher and Will, the last of
which is a Barbarian helm.

What does not exist is **this site's** side: no `Set` content type, no route, no
page, and zero of the 140 catalogued. `ItemRef` already reserves `kind: "set"`
and `kind: "set-item"`, so the type system anticipated them and nothing has
filled it.

The consequence for this class is concrete and it is larger than Immortal King.
**Guillaume's Face is a set item too** — Orphan's Call, on a Winged Helm — which
is why it is absent from `uniqueitems.json` and always will be. Seven of the
eight Barbarian guides use it, generally worn alone for its Crushing Blow and
Deadly Strike rather than for the set bonus. Both it and IK have to be labelled
picks with a sentence saying they are set pieces worn on their own.

Recorded here as an outstanding limitation of the repository, not as a gap in
the game.

### 11.2 Oath takes axes and maces as well as swords

The coordinator asked whether Oath's `itype1 = "swor"` was swords-only or a
parent covering axes and maces. Neither: the row declares three types
explicitly, so no hierarchy has to be resolved.

```
Oath (Runeword91)   itype1 = swor   itype2 = axe   itype3 = mace
                    ShaelPulMalLum
```

For what it is worth to the gear tiers: **the Barbarian guides put it on swords
anyway** — Balrog Blade, Highland Blade and Cryptic Sword are the three bases
named — and the Frenzy guide says in as many words that it recommends Blade
Mastery *for the Oath*. So an axe or maul Oath is legal and nobody plays one,
and the pages should say the first without recommending the second.

### 11.3 Fury is the one class-scoped stat that lands on this class

Fury is `itype1 = "mele"`, so any Barbarian melee weapon takes it, and it carries
66% Open Wounds, 33% Deadly Strike and +40% Increased Attack Speed.

Its `+5 to Frenzy (Barbarian only)` line is a dead stat on every other class's
page and a live one here. That is the exact mirror of why the line sits on the
item's common-mistakes list everywhere else, and the Frenzy and Whirlwind pages
should say so from the other side rather than repeating the warning.

### 11.4 One naming defect, and the sweep that found no others

The table index spells the belt **Verdugo's Hearty Cord**; `allstrings-eng.json`
publishes **Verdungo's Hearty Cord**, with the extra `n`. Same identifier-versus-
shipped-name shape as `Pole Arm Mastery` in §2.1, and the site publishes the
shipped name.

The coordinator swept the existing catalogue for the same defect while
cataloguing: **all 52 published uniques match their shipped names, zero gaps.**
The problem was confined to skills.

## 12. Open questions the build cycle inherits

1. Whether a Barbarian attack-speed frame table can be sourced for a **named
   weapon**. Whirlwind and Frenzy both want one; §5 says why the class cannot
   have a single one.
2. ~~Whether `Build.primarySkill` may name another class's skill.~~ **Settled —
   see §10.5.** It may not, and it never needs to.
3. Whether the site ever grows a set registry. Thirty-five sets and 140 items
   exist in the extraction and none is catalogued; `ItemRef` already reserves
   two kinds for them. Immortal King is refused as a *page* regardless, but it
   and Guillaume's Face are real gear on this class and both must be free-text
   picks until that changes. See §11.1.
4. Whether the Berserk page's Gold Find package should carry Travincal in
   `farming` for the *core* build or only for the package. The package changes
   which area is worth running, and nothing in the build model expresses a
   farming entry that belongs to a package rather than a build.

## Sources

**Part 1** is Tier 1 throughout, from the pinned commit: `skills.json`,
`skilldesc.json`, `allstrings-eng.json`, `itemtypes.json`, `charstats.json` and
`base/skills.json`. The synergy table in §3.1 and the three failures in §2.2 are
the output of this repository's own `synergiesFor` run against those rows, not a
transcription. No guide was consulted for the foundation.

**Part 2** adds Maxroll's Barbarian overview and its eight endgame guides plus
the levelling guide, all stamped 2026-05-22, for what is *played* — never for a
number. Every mechanical figure quoted in Part 2 was re-derived from the
extraction, which is how §8.1 was caught.

**One weighting note for whoever researches the next class.** §8.1 found a
Maxroll *overview* page contradicting the Maxroll *guide* it links to, on a
number that decides twenty skill points. Both are the same Tier 3 source and
they are not equally reliable: the guides carry a maintainer, a changelog and a
`dateModified`, and the overview and hub pages do not. Where the two disagree,
prefer the guide — and re-derive it from the extraction anyway.

### A note on one thing that was *not* used

The scratchpad this pass ran in already contained fetched HTML from
`d2mods.info` knowledge-base articles that this pass did not download and cannot
account for. None of it was read and none of it informed a decision here.
Provenance is the whole of this repository's source policy, and content of
unknown origin has none.
