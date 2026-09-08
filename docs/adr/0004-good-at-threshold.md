# ADR 0004 — "Good at" is four out of five, and the evidence is generated

**Status:** Accepted
**Date:** 2026-09-08

<!-- THRESHOLD: 4 -->

## Context

`lib/builds/filter.ts` exposes a `goodAt` facet: a build is tagged on one of the
eight rating axes when its rating clears `GOOD_AT_THRESHOLD`. Two requirements
in the vNext PRD read that constant — R-FILT-4 (conditional facet counts, where
the threshold decides which options are even reachable) and R-FILT-5 (the "Good
at" sort criterion) — so it is an input to the filter redesign, not a detail.

The constant was set to 4 and justified in a comment with a distribution:

> Across the 29 published builds and eight axes — 232 ratings — 47.4% sit at 4
> or above… At 5 only, twelve of the 29 builds carry no tag at all.

That was measured, and it was true. The catalogue has since reached **53**
builds, and nothing failed, because the evidence for a constant lived in prose.
Editing "29" to "53" would have produced a sentence that reads as current and
was never measured — the exact failure mode the project's own rule against
hand-written claims about data exists to prevent.

## Decision

**The threshold stays at 4**, and the evidence for it is now generated.

`scripts/rating-distribution.ts` measures the distribution from
`content/builds/` and writes `docs/measurements/rating-distribution.json`.
`scripts/rating-distribution.test.ts` recomputes it, compares against the
committed file, and fails when the two differ — so adding a build or changing a
rating makes the gate red until someone regenerates the artefact and looks at
the new numbers. The same gate holds the constant in the code, the threshold
recorded in this file and the numbers quoted in `filter.ts` to one another.

## Why four, on the current measurement

Measured over 53 builds and eight axes — 424 ratings.

| Threshold | Ratings that qualify | Share | Tags per build (of 8) | Builds with no tag |
|---|---|---|---|---|
| 3 or above | 344 | 81.1% | 6.49 | 0 of 53 |
| **4 or above** | **194** | **45.8%** | **3.66** | **1 of 53** |
| 5 only | 55 | 13.0% | 1.04 | 21 of 53 |

**The scale names it.** `ratingLabels` in `lib/labels.ts` maps the five values to
Poor / Weak / Average / Good / Excellent. Four *is* "Good", so the threshold is
not a judgement layered on the data — it is the point where the site's own
vocabulary starts saying the word the filter is labelled with. That argument
does not depend on the catalogue's size and has not changed.

**The distribution still agrees.** At 4 or above, 45.8% of ratings qualify and
the average build carries 3.66 of the eight tags. At 3 or above, four ratings in
five qualify and the average build carries 6.49 of 8 — selecting almost
everything is not filtering. At 5 only, 21 of the 53 builds carry no tag at all
and can never be reached through this group.

**Nearly doubling the catalogue moved nothing.** Against the 29-build
measurement the figures are: 47.4% → 45.8% of ratings; 3.8 → 3.66 tags per
build; one build untagged, then and now; 80.6% → 81.1% at the looser threshold;
and the share of builds left untagged at 5 held at roughly two in five (12 of
29, 21 of 53). The catalogue grew by 24 builds and every number stayed within
about a point and a half. That is the strongest thing the new measurement says:
the threshold was not fitted to a small sample.

**Per axis, the split is wider than "roughly half".** The old comment claimed
each axis divides the catalogue roughly in half. In aggregate that holds; per
axis it does not, and the artefact says so:

| Axis | Builds tagged at 4+ | Share of 53 |
|---|---|---|
| survivability | 35 | 66% |
| clearSpeed | 31 | 58% |
| terrorZones | 31 | 58% |
| bossing | 27 | 51% |
| players8 | 24 | 45% |
| soloSelfFound | 23 | 43% |
| magicFind | 16 | 30% |
| ubers | 7 | 13% |

The median axis splits near half; `ubers` selects one build in eight. That is a
fact about the catalogue — few builds do Uber Tristram well — rather than a
problem with the threshold, and it is the reason R-FILT-4 requires a disabled
option to keep showing its `0` instead of disappearing: "almost nothing here is
good at Ubers" is information the reader wants.

## Alternatives considered

- **Move to 3.** Rejected on the numbers: 81.1% of ratings qualify, so nearly
  every build carries nearly every tag and the facet stops discriminating.
- **Move to 5.** Rejected on reachability: 21 builds would be unreachable
  through the group, and a facet that hides two in five of the catalogue is
  worse than no facet.
- **A per-axis threshold.** Rejected. It would make `ubers` behave like the
  others by lowering its bar, which means calling a build good at Ubers because
  it is above average among builds that are bad at Ubers. One rule, every
  build, no editorial override.
- **Rewrite the comment with today's numbers and keep it in prose.** Rejected;
  that is the defect, not the fix.

## Consequences

- R-FILT-4 and R-FILT-5 keep the input they were specified against. Nothing
  downstream of the threshold changes in this phase.
- `docs/measurements/rating-distribution.json` is generated, never edited. It
  lives in `docs/` rather than in `content/` or `lib/` because nothing imports
  it: it is evidence for a decision, not runtime data. The alternative — putting
  it beside `filter.ts` — would have implied the code reads it, and the code
  reads only the constant.
- Adding a build now fails `npm run test:rating-distribution` until the artefact
  is regenerated. That is deliberate friction: it forces whoever grows the
  catalogue to look at what the growth did to the distribution, which is exactly
  what did not happen between 29 builds and 53.
- The gate compares text, so a hand-edited artefact fails as loudly as a stale
  one.

## What would change this decision

A measurement in which 4 stops halving the catalogue — say the share at 4 or
above drifting above two thirds or below a quarter, or more than a handful of
builds ending up with no tag at all. The procedure is fixed: regenerate,
read the table, and argue the change here before touching the constant.
