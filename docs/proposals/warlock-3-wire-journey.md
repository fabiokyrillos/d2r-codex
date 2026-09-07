# Proposal: wire the Warlock journey

**From:** Agent C (Warlock), branch `claude/warlock-complete`
**To:** the coordinator
**Phase:** 4 of 5 — the levelling journey, committed.

Six stages, level 1 to 99, EN-US and PT-BR. The two source defects from your
last message are fixed and committed ahead of this in `2bf0f5e`, so the Cleave
merge is unblocked.

---

## A. Registration

### A1. `content/progression/index.ts`

```ts
import { warlockJourney } from "./warlock-journey";
export const journeys: ProgressionJourney[] = [ ..., warlockJourney ];
```

### A2. `content/progression/pt-br.ts`

`content/progression/pt-br-warlock.ts` exports `warlockJourneyPtBr:
Overlay<JourneyCopy>` keyed by the class slug `warlock`, matching the shape of
`journeysPtBr`. Spread it in there, or in `lib/registry/overlays.ts` — same call
as last time and for the same reason.

---

## B. Two runeword refs my branch cannot resolve

`vigilance` and `oath`, both in the `war-hell` stage. You confirmed both are on
`main`; my branch predates them, so my local validator reports them unresolved
exactly as it did for the builds. `checkJourney` skips a runeword it cannot
resolve rather than failing, so the levelling gate passes either way — but
`check:content`'s reference resolution will want them, and it will have them
after the merge.

Every other ref in the journey resolves against the catalogue as my branch has
it: `stealth`, `leaf`, `insight`, `spirit`, `lore`, `rhyme`, `splendor`,
`lionheart`, `coven`, `tal`, `harlequin-crest`.

---

## C. A catalogue gap the journey walks straight into

**Rhyme and Splendor are listed for `["shield", "paladin-shield",
"necromancer-head"]` and not for `grimoire`.** The journey puts Rhyme in a
Grimoire at level 29 and offers Splendor at 37, because those are the only
two-rune options a levelling Warlock has before Vigilance at 53 — and a Grimoire
has exactly two sockets, so nothing else fits at all.

The game data says they belong there, and the argument is the site's own
existing entry rather than my reading of a column:

```
runes.json      Rhyme     itype1 = shld
                Splendor  itype1 = shld
itemtypes.json  Grimoire  Equiv1 = shld
                Head      Equiv1 = shld     (the Necromancer shrunken head)
```

A Grimoire and a shrunken head are `shld`-equivalent by the same column, and
**both entries already carry `necromancer-head`**. So `grimoire` is missing from
those two by oversight, not by rule — the site has already accepted the exact
mechanism that puts them there.

If you would rather not touch those entries, tell me and the two journey steps
become "any two-socket Grimoire with resistances" instead. It is one sentence
either way, and I would rather ask than have a reader click through to an item
page that disagrees with the step that sent them there.

---

## D. Aliases, as you asked

For `lib/search/index.ts`'s `ALIASES`, presented as search terms rather than
claimed names:

| Build | Aliases |
| --- | --- |
| `apocalypse-warlock` | Fire Warlock, Chaos Warlock, Apoc Warlock |
| `abyss-warlock` | Void Warlock, Miasma Warlock, Magic Warlock |
| `cleave-warlock` | Melee Warlock, Weapon Warlock, Hex Warlock |
| `blood-boil-warlock` | Demon Warlock, Demonologist |

There is no community corpus for this class, so none of these is attested. They
are what a reader would plausibly type.

---

## E. What the journey argues, and the arithmetic behind it

**One route, four builds, and two of them need no respec at all.** That is the
finding the page is built on and it is exact rather than rhetorical:

| | Points at the branch | Respec |
| --- | --- | --- |
| Abyss | the route *is* the core, 83 of 110 | none |
| Apocalypse | keep spending into fire from 30; 60 in the fire chain, 40 already in miasma, 3 in the sigils | none |
| Cleave | nothing in the Eldritch tree is on the route | one, at 30 |
| Blood Boil | shares only the Goatman | one, at 30 |

Akara gives a full respec per difficulty, so every Warlock finishes with at
least two tokens spare. **One point in Summon Goatman is the only point the
route spends that no finished build keeps** — one of 110, and one of the seven
the Abyss fire package leaves over.

The route is Miasma Bolt into Miasma Chain for the same reason the Abyss page
exists: magic immunity is recorded in one of the eighteen catalogued areas and
fire in twelve, and a levelling character owns no sunder charm and no pierce.

**Your two constraints are both load-bearing rather than mentioned.** The
class's own uniques start at `Measured Wrath` at level 52 and the three Ars
grimoires are 73, 78 and 80, so the whole route runs on vendor staves, generic
Grimoires and Countess runes — stated in the overview and again at the stage
where the first one becomes wearable. And the levitation rule earns its keep at
three separate stages rather than being noted once: a two-handed staff and a
Grimoire together from level 1, **Leaf at 19 for +3 to Fire Skills with the
off-hand still free**, and Spirit in a one-handed sword at 25 where the
hand count is explicitly the thing that does *not* matter.

---

## F. Verification

- **`checkJourney` against the real rules module: zero problems.** That covers
  `points-exceed-what-the-level-holds`, `quest-points-invented`,
  `skill-named-before-its-level`, `runeword-named-before-its-level`,
  `arithmetic-does-not-add-up` and `respec-total-impossible`.
- **Every stated total is inside its own bound**, checked against
  `pointsAvailable(level, difficulty)`: 12 at level 11 (bound 14), 21 at 20
  (23), 32 at 30 (33), 54 at 48 (55), 80 at 70 (81).
- **Every runeword step's `atLevel` is at or above the runeword's requirement**
  — Stealth 17, Leaf 19, Spirit 25, Lore 27, Insight 27, Rhyme 29, Splendor 37,
  Lionheart 41, Oath 49, Coven 51, Vigilance 53.
- **Every quest that is credited with a skill point is one of the three that
  give one.** Lam Esen's Tome is named twice and both times as stat points.
- **pt-BR: 161 strings compared, zero identical to the source**, every array
  length matched, every stage present and no orphans — and `83 + 20 = 103`
  closes in both locales, which is the one sum the rule reads language-agnostic.
- `npx eslint` clean on both files; zero TypeScript errors in either.
- The superlative gate now passes across **1296 Warlock strings** after
  `2bf0f5e`, and the ranking it derives is `50%, 35%, 24%, 15%, 10%, 5%` — the
  one superlative left standing is Eldritch Blast's, which names the 50%.

Phase 5 — `scripts/warlock-rules.ts` and `scripts/warlock.test.ts` — is next
unless you want something else first.
