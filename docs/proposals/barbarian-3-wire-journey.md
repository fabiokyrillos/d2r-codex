# Proposal 3 — wiring the Barbarian journey

**From:** Agent B (Barbarian), branch `claude/barbarian-complete`
**To:** the coordinator. Two files, four lines, nothing else.

---

## The edits

### 1. `content/progression/index.ts`

```ts
import { barbarianJourney } from "./barbarian-journey";
// ...
export const journeys: ProgressionJourney[] = [ /* ... */ , barbarianJourney];
```

### 2. `content/progression/pt-br.ts`

```ts
import { barbarianJourneyPtBr } from "./pt-br-barbarian";

export const journeysPtBr: Overlay<JourneyCopy> = {
  // ...
  barbarian: barbarianJourneyPtBr,
};
```

That is the whole wiring. `getJourneys` keys the overlay by `classSlug`, so the
key must be exactly `barbarian`.

---

## What was verified before asking

Each of these was run against the shipped code rather than reasoned about.

| Check | Result |
| --- | --- |
| `checkJourney` on the en-US journey | **0 problems** |
| `checkJourney` on the pt-BR journey, merged exactly as `journeysFor` merges it | **0 problems** |
| Every `ItemRef` resolves through the registry | **14 of 14** — 12 runewords, 2 uniques |
| pt-BR array parity across all six stages | `skillPoints`, `statPoints`, `actions` and `gearTargets` identical in length; every required `StageCopy` field present |
| The point ledger | closes exactly at all six checkpoints, see below |

### The ledger, so a reviewer does not have to add it up

`level - 1` from levelling, plus 4 per difficulty from quests.

| Checkpoint | Available | Spent |
| --- | --- | --- |
| L13, Normal, Den of Evil | 12 + 1 = 13 | 13 |
| L20, Normal, + Radament | 19 + 2 = 21 | 21 |
| L30, Normal quests done | 29 + 4 = 33 | 33 |
| **L40, Nightmare quests done — the respec** | 39 + 8 = 47 | **47 back, 47 spent** |
| L55, Nightmare | 54 + 8 = 62 | 62 |
| L75, Hell quests done | 74 + 12 = 86 | 86 |

The respec opening is `20 + 6 + 11 + 5 + 3 + 2 = 47`, and the pre-respec ledger
is `13 + 8 + 12 + 14 = 47`. The last 24 to level 99 are left to the build pages.

---

## Two things worth your eye

**The route's respec reason is not the usual one.** Every other journey on this
site respecs because the levelling *damage skill* is not the endgame one. This
one respecs because the levelling **weapon** is not the endgame weapon: a mastery
is gated on an item type, there are six, and twenty points in the wrong one is
worth nothing. The route takes Mace Mastery at level 3 specifically because
`blun`'s equivalence chain reaches `rod` — so it covers the scepter Akara sells
— and undoes the guess once, at the level where the weapon is known.

That is the "masteries compatible with the weapons actually available at each
stage" requirement answered from `itemtypes.json` rather than from a guide, and
it is checkable: Steel's own registry entry excludes scepters, which is why the
level-13 runeword has to go in a flail if the level-3 mastery is to survive.

**The route does not serve the Singer, and says so.** The main specialist guide
respecs into War Cry at 31 because War Cry needs no weapon. That is true, and
this route still declines it: War Cry's synergies are Howl, Taunt and Battle Cry,
and **five of the six published builds keep none of them**. Berserk is the other
weapon-independent answer — 100% magic damage, so physical immunes are a slower
fight rather than a wall — and it is maxed on three of the six with synergies
(Howl, Battle Orders) that every build wants anyway. The final stage names War
Cry as the one destination this route does not serve and tells that reader to
respec in Nightmare instead.

---

## One correction made during authoring, recorded because it was nearly published

The Hell farming step originally read "the Pit and Pindleskin, **both area level
85**". The site's own farming data says the Pit is 85 and **Pindleskin is 83**.
Both locales now name both numbers. Nothing caught this — `leveling-rules.ts`
checks point arithmetic and runeword levels, not area levels — so it is worth
knowing that a journey can still assert a wrong area level with every gate green.

If a rule is ever wanted for it, the shape already exists: `build-claims.ts`
derives area facts from the data the prose is quoting, and a journey action
naming an area and a level is the same shape.
