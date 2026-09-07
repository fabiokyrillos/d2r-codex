# Proposal 7 — the Lightning Trapsin's pt-BR shopping list still says Faster Cast Rate

**From** Agent A (Assassin), branch `claude/assassin-finish`
**Touches** `content/builds/pt-br.ts`, `lightning-trapsin` — **coordinator-owned**
**Severity** the highest of anything I have found on my own pages, because it is
the one field a reader acts on directly

You offered to scope a re-read of the Assassin's seven. The premise was wrong in
one direction and right in another, and this is what the right direction found.

## The defect

Cycle 3 retracted "trap laying runs on Faster Cast Rate" and moved it to attack
speed. §5 of `docs/research/07-assassin.md` is the longest section in that file
because of it. **The English was corrected. The Portuguese was not.**

In five gear tiers, the pt-BR weapon `lookFor` tells a Brazilian reader to shop
for the retracted stat, and drops the finding that replaced it:

| tier | en-US | pt-BR |
| --- | --- | --- |
| nightmare | `20% Increased Attack Speed` | `20% Faster Cast Rate` |
| early-hell | `20% Increased Attack Speed` | `20% Faster Cast Rate` |
| budget | `20% Increased Attack Speed` | `20% Faster Cast Rate` |
| optimized | `20% Increased Attack Speed` | `20% Faster Cast Rate` |
| bis | `20% Increased Attack Speed` | `20% Faster Cast Rate` |

All five also drop `"A Greater Talons or Runic Talons base"`, which is the base
speed advice — the thing cycle 3 established matters **more than the affix**.
And two `why` strings are truncated in a way that removes exactly that half:

- **early-hell** — en-US ends *"**Roll it on a fast base if you can** — Greater
  Talons and Runic Talons lay a trap three frames faster than a Suwayyah before
  any affix is counted."* The pt-BR stops at the previous sentence.
- **optimized** — en-US ends *"— and the base it rolled on is worth as much as
  the fourth affix, because base speed is what sets laying speed."* The pt-BR
  stops before it.

Scope, measured across all 48 builds in both locales: **five `lookFor` count
mismatches in the whole catalogue, and all five are this page's weapon slot.**
Five picks ask for Faster Cast Rate in pt-BR where en-US does not, and they are
the same five. Nothing else in the catalogue drifts this way.

## Why no gate caught it

Two near-misses, and both are instructive.

- `check:content` validates each `lookFor` **entry** against the 40-character
  badge limit and checks that `why` strings **differ** from their English. It
  does not compare array lengths, so a badge that was never translated is
  indistinguishable from one that was deliberately dropped.
- `trap-speed.test.ts` has a rule for exactly this claim —
  `trap-laying-on-cast-rate` — and it cannot fire here. The rule needs a laying
  verb near a cast-rate term (`LAYING_A_TRAP` and `CAST_RATE`), and a bare badge
  reading `20% de Faster Cast Rate` has no verb in it. **The badge asserts by
  placement rather than by sentence**: it is in the claw's shopping list, so it
  means "buy this on your claw", and no sentence rule can see that.

## The fix

Five `lookFor` arrays. The two five-entry tiers (nightmare, optimized, bis):

```
-      lookFor: ["+3 to Lightning Sentry", "+3 to Death Sentry", "+2 to Traps", "20% Faster Cast Rate"],
+      lookFor: ["Base Greater Talons ou Runic Talons", "+3 to Lightning Sentry", "+3 to Death Sentry", "+2 to Traps", "20% de Increased Attack Speed"],
```

The two four-entry tiers (early-hell, budget):

```
-      lookFor: ["+3 to Lightning Sentry", "+3 to Death Sentry", "20% Faster Cast Rate"],
+      lookFor: ["Base Greater Talons ou Runic Talons", "+3 to Lightning Sentry", "+3 to Death Sentry", "20% de Increased Attack Speed"],
```

Both new badges are inside the 40-character limit — 35 and 29.

And the two truncated `why` strings, each gaining the sentence its English has:

```
   early-hell:  … qualquer runeword desta página. **Faça numa base rápida se der** — Greater Talons e Runic Talons colocam uma armadilha três frames mais rápido que uma Suwayyah antes de contar qualquer afixo.

   optimized:   … e não existe runeword que ganhe dela — e a base em que ela saiu vale tanto quanto o quarto afixo, porque a velocidade base é o que define a velocidade de colocação.
```

Three frames is the figure §5 derives: two Runic Talons or Greater Talons at
−30 lay in 12 frames bare against a Suwayyah's 15.

## The rule shape this suggests, if it earns one

**`lookFor` arrays should have the same length in both locales.** It is a
one-line check over `getBuilds()` in the existing sweep, it would have caught
this the day it shipped, and it needs no allowlist — a badge list is data, not
prose, and there is no legitimate reason for one locale to carry fewer entries
than the other. I have not built it; the three files I was granted are spent.
