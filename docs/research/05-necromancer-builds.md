# Necromancer builds and levelling (research and execution record)

**Executed 2026-09-03.** Scope: the three approved builds, the Summoner
levelling journey, six authorised dependency pages, the aliases, and the
corrections the summons research forced on the three mechanics articles the
foundation pass shipped. No new builds, no item pages beyond the six.

The foundation pass ([`04-necromancer-foundation.md`](04-necromancer-foundation.md))
listed five questions about summons it could not answer and gated the pages so
neither answer could be published. **Four are answered here from the pinned
tables, and the fifth is half-answered.** That is what unblocked this pass, and
it is why several of its gates change shape rather than merely gaining entries.

## What the tables settled

Everything in this section is `blizzhackers/d2data` at commit `fc46999` — the
same pin the skill graph comes from — read this pass rather than in the
foundation pass, which had not decoded `monstats.json`.

### 1. Summons do not take the difficulty resistance penalty

The decisive evidence is a shape rather than a value. `monstats.json` carries a
**separate resistance column per difficulty** for every monster, and for every
Necromancer minion the three values are identical:

| Minion | Physical | Magic | Fire | Lightning | Cold | Poison |
| --- | --- | --- | --- | --- | --- | --- |
| Skeleton | 0 | 0 | 0 | 0 | 0 | 0 |
| Skeletal mage | 0 | 0 | 0 | 0 | 0 | 0 |
| Clay Golem | 25 | 0 | 0 | 20 | 50 | 0 |
| Blood Golem | 0 | 20 | 0 | 0 | 0 | 20 |
| Iron Golem | 0 | 0 | 0 | 50 | 0 | 100 |
| Fire Golem | 0 | 0 | 100 | 0 | 0 | 0 |

Normal, Nightmare and Hell, in every row. The −40 / −100 is a property of the
**player character**; a minion is a monster, and monsters do not have it.

This is the single fact that reshaped the point plan. Summon Resist is not
compensating for anything — it is a straight addition on a curve that runs 20%
toward 75% and flattens after the first point. So it is a one-point skill on
every build here, and the usual argument for twenty ("you need it to survive the
Hell penalty") is not an argument about anything that exists.

**The mercenary does take it**, in full, and the two are constantly confused.
`checkSummonPenaltyClaims` polices both halves: no page may claim the army takes
it, and the minions article must state the correction rather than leaving a
reader with the community claim.

### 2. Life, damage and defence per difficulty

Also `monstats.json`, and published as the base table it is:

| Minion | Life (N / NM / H) | Melee damage | Defence |
| --- | --- | --- | --- |
| Skeleton | 21 / 30 / 42 | 1–2 throughout | 5 / 5 / 6 |
| Skeletal mage | 61 / 88 / 123 | 1–2 throughout | 24 / 26 / 28 |
| Clay Golem | 100 / 175 / 275 | 2–5 / 2–6 / 3–7 | 100 |
| Blood Golem | 201 / 388 / 637 | 7–20 / 11–28 / 12–33 | 120 |
| Iron Golem | 306 / 595 / 980 | 7–19 / 11–30 / 12–33 | 140 |
| Fire Golem | 313 / 613 / 1013 | 10–27 / 15–39 / 18–47 | 200 |

**Published as a base, not as a finished number, and deliberately without a
formula.** Skill level, Skeleton Mastery, Golem Mastery and Battle Orders all
build on top of these, and how they compose is engine behaviour read from the
reference implementation of the legacy engine. Multiplying it out on the page
would present a reconstruction of the pre-Resurrected engine as though it were a
documented interface of the current build. What the table does establish is the
shape — a mage starts at roughly three times a skeleton's life, a golem at five
to fifteen times, and each roughly doubles from Normal to Hell while the
monsters around them grow far faster.

The skeletal mage's melee column being 1–2 is worth stating rather than burying:
a mage's damage is the elemental missile, rolled from the skill, which is why a
mage army answers physical immunity and a skeleton army cannot.

### 3. Iron Golem persistence, and the four ways it is lost

Persists between games in the expansion, stored with the character and rebuilt
on entering the next one. Destroyed by: the golem dying, the character dying,
any other golem being summoned, and a respec that removes the skill. The item is
consumed at cast in every case and never returned.

Four of the five outcomes destroy the item and one of them is dying, which is
not under the player's control. So the recommendation is **cheap and
replaceable**, and `NEVER_FEED_TO_A_GOLEM` names the ten runewords guides reach
for instead. The foundation pass's gate — *no page may recommend one at all* —
becomes *no page may point one at an expensive item, and a page whose plan
allocates the skill must enumerate every way it is lost*.

### 4. The Skill Shrine

Answered by the snapshot rather than by a new column: minion stats are written
at creation and never recalculated, so a minion raised inside the shrine's
window keeps the higher values after it expires. An army already standing gains
nothing. The play is to unsummon and rebuild inside the window.

### 5. The Ubers — half answered, and the half that is not

`monstats.json` carries a **`primeevil`** flag, and the engine uses it to raise
the damage those monsters deal to a player's pets specifically. Fifteen monsters
have it: Andariel, Duriel, Mephisto, Diablo, Baal, their clone and Uber forms,
and the three Colossal Ancients.

**The multiplier is not established here and no number is published.** A figure
invented to fill that gap would be the most quotable sentence on the page and
the least supported. The flag is stated, the direction is stated, and the
arithmetic is left out.

Uber Tristram itself is not researched, and three of the fifteen stand in that
one room. So **no Necromancer page on this site rates itself as an Uber
specialist or publishes a strategy for that fight** — not the Iron Maiden plan,
not Life Tap, not a Crushing Blow or revive plan. All three builds carry an
Ubers rating of 1 and prose saying the rating means "unverified" rather than
"measured".

## What the tables settled about the curses article

Two claims removed rather than added.

**Curse Resistance exists and nothing populates it.** `itemstatcost.json` has
`curse_resistance` at stat id 109 — so the mechanism is real. But no row in
`properties.json` writes to it, and `monprop.json` is thirteen rows for the
whole game, granting extra fire damage, crushing blow, faster cast, knockback,
thorns and fade to a handful of monsters and curse resistance to none. The
article no longer says curses are generally weaker against bosses; it says the
mechanism exists, that nothing carries it on this baseline, and how it was
checked.

**The one-fifth rule was too broadly stated.** It applies to the three curses
that lower a resistance, and only against a target already immune to the
resistance being lowered. Terror on a fire immune lasts exactly as long as
Terror on anything else. Lower Resist on a monster immune to fire but not cold
is cut against one and full against the other — one cast, two outcomes.

## The Corpse Explosion gate was written the wrong way round

The foundation pass could not establish whether the fire half takes fire-skill
modifiers, so it forbade the page from mentioning them. That is safe and it is
also wrong, because **one of the three is now answerable**: Corpse Explosion's
`EType` is `fire` in the game's own row, so an item granting `+to Fire Skills`
raises its effective level exactly as `+Necromancer Skills` does — and what the
effective level buys here is **radius**, since Param1 and Param2 (the 70% and
the 120%) are flat.

A ban on the words bans the correct sentence with the incorrect one, and the
page ends up silent about a real interaction because a neighbouring one is
unresolved. So the ban is replaced by three requirements — the page must
distinguish **skill level** from **radius** from **damage percentage** — plus
the original prohibition, narrowed to the two modifiers that genuinely remain
unestablished. Fire Mastery is now a simpler case than it looked: it is a
Sorceress passive, and a Necromancer cannot have one, so it is not a modifier
that applies to this skill on this class whatever the pipeline does.

## The six dependency pages, and one real disagreement

Decoded from `runes.json`, `uniqueitems.json`, `weapons.json`, `armor.json` and
`itemtypes.json` at the same pin, and composed the way
[`../sources/README.md`](../sources/README.md) says a runeword is composed: the
runeword's own properties plus each rune's mod for that item type.

Two item-type facts decided placement, and neither is visible in a database
listing:

- **A Necromancer shrunken head is a shield.** `head` (Voodoo Heads) has
  `Equiv1 = shld`, so Splendor, Rhyme and Spirit all fit one — and a head
  carries +Necromancer skills of its own before the runeword adds anything.
- **Most normal wands cannot hold White.** `gemsockets` is 1 on the plain Wand,
  the Yew Wand and the exceptional Burnt Wand. Bone Wand and Grim Wand are the
  two normal bases that reach 2, which is why a level-35 runeword is routinely
  made in a base that drops in Act 1.

### Death's Web, where the extraction and every database disagree

The pinned tables give it five properties:

```
allskills    2 2                     +2 to All Skills
pierce-pois  40 50                   -40-50% to Enemy Poison Resistance
heal-kill    7 12                    +7-12 Life after each Kill
mana-kill    7 12                    +7-12 Mana after each Kill
skilltab     par=7  1 2              +1-2 to Poison and Bone Skills
```

Community databases list two further things: `+1-2 To All Skills` as a range,
and `+40-50% To Poison Skill Damage`. **Neither is in the extraction.**

The site publishes the extraction, as it does everywhere the two disagree, and
the item's own page states the difference rather than leaving a reader to
discover it. Pinned in both directions — `SKILL_TAB_CONTROLS` holds the tab line
and `DEATHS_WEB_ABSENT_LINES` fails if either absent line reappears — because a
poison build's gear advice turns on which is true, and "correcting" it back from
a database is the quiet failure.

Two names were checked and one was wrong. The table spells it `Deaths's Web`;
the public name is **Death's Web**. The same check gave **Darkforge Spawn**
rather than the "Darkforce" that circulates — that item is referenced in prose
and deliberately not catalogued.

## Three more column semantics, calibrated against old content

The Amazon pass recorded why Thunderstroke shipped its proc line backwards: none
of the four items the decoder was calibrated against carried a cast-on-striking
line, so the column's argument order was never exercised. The six entities added
here exercise three more, so each got a control set — and each set contains
entities **published before this pass**, so no rule is agreeing with the entry
added beside it.

| Column | Semantics | Calibrated on |
| --- | --- | --- |
| `charged` | min is the charge count, max is the skill level | Andariel's Visage, Arachnid Mesh |
| `skilltab` | `par` is a **tree** index, and those indices overlap the skill ids | Thunderstroke, whose +2-4 also proves min/max is a level range |
| rune composition | a runeword's block is its own properties **plus** each rune's mod | Faith, whose +330% is +280% plus Ohm's fifty |

The `skilltab` rule needed a third failure mode the others do not have.
**Arm of King Leoric carries two of them**, naming two different trees, and
publishing only one leaves `+2 to Summoning Skills` — which reads as a complete
item line. `skilltab-collapsed` exists for exactly that, and its mutation is the
one in `check-content.test.ts` with no visible symptom.

## The builds, and what each declines to say

| Build | Mandatory | Flex | Shape |
| --- | --- | --- | --- |
| `summoner-necromancer` | 68 | 6 allocated, ~36 described | Stops where it genuinely stops |
| `poison-nova-necromancer` | 94 | ~16 described | Three poison skills, Corpse Explosion, full curse chain |
| `bone-spear-necromancer` | 105 | 5 allocated | Lands on 110 honestly |

**The Summoner's plan stops at 68 on purpose.** The core is 65 and Decrepify's
chain is three more; everything past that is a real choice between five
destinations and no strongest one. Inventing an allocation to reach 110 would
publish one reader's taste as the plan, so `flexPoints` names the destinations
and what each buys instead.

Three things the pages decline to claim, each because the evidence is not there:

- **Revive is one point or none.** Three minutes flat, no refresh, no Summon
  Resist, and three prerequisite points to reach. It is a burst of bodies, not
  an army, and it is not this build's answer to a fight it has no verified
  answer for.
- **Lower Resist is not in the Summoner plan.** Six curse points to improve half
  of one skill, on a build whose damage is physical.
- **No Uber rating means anything on these pages.** See above.

`poison-nova-necromancer` is the page where a widely repeated sentence is
wrong. Poison Nova's `ELen` is 50 frames with no per-level term — two seconds at
every level — and poison does not stack: a stronger application replaces the one
running and a weaker one does nothing. **Casting again is coverage and renewal,
never addition.** A reader who believes spam adds damage skips Corpse Explosion,
which is the only answer the build has to the ten catalogued areas that record
poison immunity.

`bone-spear-necromancer` carries Bone Spirit rather than ceding it a page: both
receive damage from Teeth, Bone Wall, Bone Prison and each other, so the hundred
points that max one max the other. Its argument is a count — one of twenty areas
records magic immunity — so `EXPECTED_IMMUNITY_CENSUS` gained `magic: 1` and
adding a magic-immune area now fails a check.

## What the rules caught in this pass's own work

Worth recording, because a gate that never fires on its author is a gate nobody
has tested.

| Rule | What it caught |
| --- | --- |
| `checkUnlockLevelClaims` | A Summoner sentence naming Decrepify beside Lower Resist's level 30 |
| `checkChainClaims` | The journey offering **Bone Prison** to a Summoner as a Bone Armor synergy — it also requires Bone Spear, which a Summoner does not have |
| `test:markup` | Two prose fields rendered without RichText: a build's `respecAt` and a journey's respec `why`. The eighteen earlier builds and three earlier journeys author both without emphasis, so the gap was invisible until a page needed it |
| `checkIronGolemAdvice` | Its own detector behaving differently per locale — it matched "build" but not "built", so an English page escaped a rule its Portuguese twin tripped on "construiu" |
| `checkUnlockLevelClaims` (again) | Its own Portuguese half being inert: `\bdestrava\b` does not match "destravado", the participle every Portuguese sentence uses |

Two rules had to be narrowed rather than tightened, and both narrowings are
proven by controls:

- **A sentence about hard points is not an unlock claim.** "Corpse Explosion at
  level 20" is twenty points, and without requiring an unlock verb the rule
  reads it as a claim about level 20.
- **`sentencesOf` had to learn markdown.** A bold lead-in ends
  `…level 24.** Halving a boss's…` — a full stop followed by asterisks rather
  than whitespace — so whole paragraphs were staying one "sentence" and rules
  that reason about two terms appearing together fired on terms a reader would
  never connect.

## Decisions taken

| Decision | Reason |
| --- | --- |
| Three builds, fourteen aliases | Fishymancer, Summonmancer, Skeletonmancer, Skelemancer and Skeleton Summoner are one character. Same decision as Javazon and Bowazon, same reason |
| Bone Spirit and Teeth are components, not builds | Both are twenty-point skills inside the Bone Spear plan; a page for either publishes the same hundred points twice |
| Trang-Oul's is an equipment variant | It changes what you wear, not the point plan or the way the build is played. Named on the Poison Nova page; no page of its own |
| "ce", "osso", "veneno", "exercito", "esqueletos" rejected as aliases | Each names a family rather than a page. "ce" is two letters and a substring of dozens of names |
| Summoner's plan stops at 68 + 6 | See above |
| Corpse Explosion is core on the Poison Nova page | A single-element build in a game where ten of twenty areas resist that element needs a second damage type, not a luxury |
| Bone Armor gets one hard point on the Bone Spear page | Its synergies are Bone Wall and Bone Prison, both already maxed for the damage |
| No item page beyond the six | Marrowwalk, Boneflame, Darkforge Spawn, Ume's Lament and Trang-Oul's Avatar are referenced in prose. The crawl asserts none of them is a route |
| No redirects | Nothing was renamed and nothing was removed. Every URL that existed before this pass still resolves to the same page, and every alias is a search term rather than a path |

## Outstanding

- **The Prime Evil damage multiplier against pets.** Flag is Tier 1; the number
  is not established.
- **Uber Tristram**, entirely. Three of the fifteen Prime Evils are in that room
  and no page here claims a plan for it.
- **Whether `+% Fire Skill Damage` reaches Corpse Explosion's fire half.** Still
  not asserted in either direction; `+to Fire Skills` is now answered.
- **How the layers above the minion base table compose.** Published
  qualitatively rather than as a formula, for the reason given above.
- **A reproducible item generator**, unchanged from the Amazon pass: the six
  entities here were decoded from Tier 1 and then transcribed, and nothing in
  this repository re-derives them. `scripts/item-rules.ts` now pins twenty-six
  controls across four column semantics rather than nine across three, which
  narrows the exposure without removing it.

## Related research

- [`00-game-state.md`](00-game-state.md) — version baseline and class coverage.
- [`04-necromancer-foundation.md`](04-necromancer-foundation.md) — the trees,
  the thirty skills, the parameter-ownership bug and the five open questions
  this pass answered four of.
- [`03-amazon-builds.md`](03-amazon-builds.md) — the alias decision and the
  first pass to take item numbers from Tier 1.
