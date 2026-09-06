# Proposal 4 — the six point plans, proven before the prose

**From:** Agent B (Barbarian), branch `claude/barbarian-complete`
**To:** the coordinator.
**Status:** **Phase 3 is blocked on a merge — see §0.** The plans below are
verified and item-independent, so they are recorded now rather than after five
thousand lines of prose are written around them.

---

## 0. The blocker: `dc2700c` is on `main`, not on this branch

```
$ git merge-base --is-ancestor dc2700c HEAD   ->  NO
$ git branch -a --contains dc2700c            ->  main
```

None of the six uniques resolves here yet:

```
MISS arreats-face   MISS verdungos-hearty-cord   MISS goldwrap
MISS chance-guards  MISS metalgrid               MISS gheeds-fortune
MISS fury
```

**Please merge main forward.** I have not done it and will not — that boundary
is yours.

Until it lands I can author gear tiers but cannot **verify** them: every
`ItemRef` would be unresolved, `check:content` would fail on all six pages at
once, and I would be unable to tell a real defect from the missing merge. Given
this repository's own history with a page published on a misread exit code, that
is not a trade worth making.

I read the item data out of `main` with `git show` so the refs below are already
correct — `arreats-face` is a `barbarian-helm`, Slayer Guard, level 42, +2
Barbarian skills and +2 Combat Skills; `fury` is a level-65 runeword for any
3-socket melee weapon. Nothing about the plans changes when the merge arrives.

---

## 1. What is proven

Every plan below was run against `SKILL_GRAPH` and checked for six things:
each skill exists and is a Barbarian skill; no allocation exceeds its
`maxLevel`; every prerequisite of every allocated skill is itself allocated;
each package's cost is `final − core` per skill; **core + any one package is
exactly `MAX_HARD_POINTS` (110)**; and every skill I intend to label
`role: "synergy"` is a real hard-point edge into that build's primary skill.

```
whirlwind-barbarian      core  77 / 20 skills   packages berserk=33  grim-ward=33   => 110
frenzy-barbarian         core  92 / 16 skills   packages taunt=18    berserk=18     => 110
berserk-barbarian        core  94 / 18 skills   packages hork=16     concentrate=16 => 110
war-cry-barbarian        core 110 / 15 skills   no packages                         => 110
double-throw-barbarian   core  96 / 20 skills   packages berserk=14  battle-cry=14  => 110
leap-attack-barbarian    core  94 / 18 skills   packages hork=16     berserk=16     => 110
```

Nothing is left over on any of the six and nothing is missing.

---

## 2. The plans

Four skills are on every one of the six, at one point each, and they are the
shared spine: **Increased Stamina → Increased Speed** and **Iron Skin → Natural
Resistance**. They are listed once here rather than six times below.

### 2.1 Whirlwind — and the only build on the site with no synergy role at all

| | |
| --- | --- |
| Core 77 | Whirlwind 20, Blade Mastery 20, Battle Orders 20, and 17 single points |
| Ones | Bash, Stun, Concentrate, Leap, Leap Attack, Howl, Shout, Battle Command, Taunt, Battle Cry, Find Potion, Find Item, Grim Ward + the spine |
| Package A, 33 | **Berserk 20, Howl 14** — the physical-immune answer, and Howl is Berserk's synergy at 10% a point |
| Package B, 33 | **Find Potion 20, Berserk 14** — Grim Ward's debuff instead of Berserk's ceiling |

`synergySourcesOf(whirlwind)` returns **nothing**. This is the only build on the
site whose plan can carry no `role: "synergy"` allocation at all, and the page
says so: the forty-odd points other builds spend feeding their primary go to a
mastery and the shouts here, because there is nothing to feed.

**Package B is the one no guide explains.** Maxroll's Whirlwind guide maxes Find
Potion and never says why. It is Grim Ward: +5% enemy damage taken per hard
point of Find Potion, through a column the game does not label a synergy and
the graph therefore correctly draws no edge for. Twenty points doubles what
everything inside the ward takes. The page will say it.

### 2.2 Frenzy

| | |
| --- | --- |
| Core 92 | Frenzy 20, Double Swing 20, Blade Mastery 20, Battle Orders 20, and 12 single points |
| Ones | Bash, Double Throw, Stun, Concentrate, Berserk, Howl, Shout, Battle Command + the spine |
| Package A, 18 | **Taunt 18** — the second damage synergy, 8% a point |
| Package B, 18 | **Berserk 19** — 19% of Frenzy's damage delivered as magic |
| `synergy` roles | Double Swing, Taunt |

The choice is the page's whole argument: more physical damage, or the ability to
hurt a physical immune at all. Both are 18 and only one is affordable.

Also on the page and in no guide: **Increased Stamina extends Frenzy by 10
frames per hard point**, through a bare literal rather than a synergy parameter,
so the graph draws no edge and the relationship is real anyway.

### 2.3 Berserk — Gold Find and Horker folded in

| | |
| --- | --- |
| Core 94 | Berserk 20, Howl 20, Battle Orders 20, Blade Mastery 20, and 14 single points |
| Ones | Bash, Stun, Concentrate, Find Potion, Find Item, Grim Ward, Shout, Battle Command, Taunt, Battle Cry + the spine |
| Package A, 16 | **Find Item 17** — the hork. Carries the Gold Find / Travincal gear axis in its `gearNote` and `contentNote` |
| Package B, 16 | **Concentrate 17** — physical damage, for the rare thing that resists magic |
| `synergy` roles | Howl, Battle Orders |

The Gold Find fold lands here as agreed: a package plus a gear tier, not a page.
`Horker`, `GF Barb`, `Gambler`, `Pit Zerker` and `Travincal Barb` go to
`NICKNAMES` pointing at `berserk-barbarian`. The mercenary-killing-blow gold
stacking goes in `mercenaryNotes`.

### 2.4 War Cry — the tightest plan on the class, and the only one with no mastery

| | |
| --- | --- |
| Core 110 | War Cry 20, Howl 20, Taunt 20, Battle Cry 20, Battle Orders 20, and 10 single points |
| Ones | Shout, Battle Command, Find Potion, Find Item, Grim Ward, Leap + the spine |
| Packages | **None.** Five twenty-point skills and ten ones is exactly 110 |
| `synergy` roles | Howl, Taunt, Battle Cry |

Three synergies plus Battle Orders is 80 points before the primary skill, which
is why this is the only one of the six that closes without a package — and
**the only Barbarian build with no weapon mastery at all**, because War Cry
carries no `SrcDam` and the weapon is irrelevant to it.

### 2.5 Double Throw

| | |
| --- | --- |
| Core 96 | Double Throw 20, Double Swing 20, Throwing Mastery 20, Battle Orders 20, and 16 single points |
| Ones | Bash, Howl, Shout, Battle Command, Taunt, Battle Cry, Stun, Concentrate, Berserk, Find Potion, Find Item, Grim Ward + the spine |
| Package A, 14 | **Berserk 15** — the melee swap, for physical immunes |
| Package B, 14 | **Battle Cry 15** — enemy defence at range |
| `synergy` roles | Double Swing |

Throwing Mastery's three modern stats — pierce toward 55%, no-consume toward
66%, and quantity replenished on a critical hit — are why this build exists on
the current baseline and why every pre-2.4 guide calls it unplayable.

### 2.6 Leap Attack

| | |
| --- | --- |
| Core 94 | Leap Attack 20, Leap 20, Axe Mastery 20, Battle Orders 20, and 14 single points |
| Ones | Bash, Stun, Concentrate, Berserk, Howl, Shout, Battle Command, Find Potion, Find Item, Grim Ward + the spine |
| Package A, 16 | **Find Item 17** — magic find is this build's second job |
| Package B, 16 | **Berserk 17** |
| `synergy` roles | Leap |

Leap is the only synergy Leap Attack has, at 10% a point, and no other build on
the class gives Leap more than one point. That is the forty points that make
this a separate page rather than a variant of Berserk.

---

## 3. Two things I need from you

1. **Merge main forward.** §0.
2. **Oath as a `ref`, please** — the Whirlwind, Frenzy, Berserk and Gold Find
   gear tiers all want it, and a labelled Oath beside a linked Grief is the
   inconsistency §11 of the research note is already complaining about. If you
   would rather not, say so and it becomes a label with the three bases named in
   prose.

## 4. The whirl rules — answered, so this section is closed

The coordinator relayed what the four rules hold, so there is nothing left to
write around. Recorded in `docs/research/08-barbarian.md` §3.2.1 with tiers:
Weapon Block works at full effectiveness while whirling and it is *running* that
is cut; Whirlwind carries no `finishing` flag so it releases no charge-up; the
1.1x socket-only attack-speed claim is refuted by patch 2.4.3, which also states
the dual-wield attack frame is averaged and rounded up; and whether on-striking
procs fire is **not established**, to be published as such rather than resolved.

The Whirlwind page will use the first three as facts rather than avoid them, and
state the fourth as unresolved.
