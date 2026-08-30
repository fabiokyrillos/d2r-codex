# ADR 0002 — Six gear tiers, not eleven

**Status:** Accepted
**Date:** 2026-08-30

## Context

The product brief lists eleven possible gear-progression stages: Starting Gear,
Early Normal, Late Normal, Early Nightmare, Late Nightmare, Early Hell, Post
Hell, Budget Endgame, Intermediate Endgame, High End, Best in Slot.

Gear progression is the site's central feature. Getting the granularity wrong
makes it either useless (too coarse) or unreadable (too fine).

## Decision

Six tiers: `starter`, `nightmare`, `early-hell`, `budget`, `optimized`, `bis`.

Each carries a level band, a difficulty context, and — the important part — the
**reader's question at that point**, stored in `lib/labels.ts`:

| Tier | The question it answers |
| --- | --- |
| Starter | "I just made this character. What do I wear?" |
| Nightmare | "I'm in Nightmare and things are getting harder." |
| Early Hell | "I've reached Hell and I'm dying. What now?" |
| Budget | "I can farm Hell. What's my next real upgrade?" |
| Optimized | "I have good gear. How do I make it great?" |
| Best in Slot | "What does the finished character look like?" |

## Why

**Eleven tiers is not eleven decisions.** Early Normal and Late Normal have the
same answer for almost every build: wear whatever you find, make Stealth at 17.
Splitting them produces two near-identical tables and teaches the reader to skim.

**Readers self-locate by problem, not by level.** Nobody thinks "I am in Late
Nightmare". They think "I keep dying in Hell Act 2". Framing each tier as the
question it answers is what makes the page findable — and it is why `question`
is a first-class field on the tier metadata rather than a UI string.

**Six fits on a screen.** The tier navigation has to be scannable at a glance.
Eleven items either wrap awkwardly or become a scrolling list, and either way the
reader loses the sense that this is a short, ordered journey.

**Comparability across builds matters more than precision within one.** A fixed
six-tier schema means the Budget tier of any two builds can be compared directly.
Per-build custom tiers would make the site's most useful cross-build question —
"which build is strongest on a small budget?" — impossible to answer.

## Consequences

- `Build.gearSets` is validated to be in tier order with no duplicates.
- A build marked `complete: true` with fewer than six tiers produces a warning
  from `npm run check:content`.
- Nuance that would have justified a finer tier lives in `GearSet.levelRange`,
  `GearSet.notes`, and per-pick `alternatives` instead — which is a better place
  for it, because it stays attached to the specific item rather than fragmenting
  the whole table.
- `GearSet.nextUpgrade` carries the forward pointer. This is what makes the page
  answer "what do I do next" rather than just "what is good" — every tier ends by
  naming the thing to chase.

## What would change this decision

If a build genuinely needs a seventh distinct stage — a plausible case is a
transitional respec build with a completely different loadout — the right fix is
a separate build entry, not a seventh tier. The tier list is a shared schema and
should stay stable.
