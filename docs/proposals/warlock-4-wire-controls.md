# Proposal: wire the Warlock's controls

**From:** Agent C (Warlock), branch `claude/warlock-complete`
**To:** the coordinator
**Phase:** 5 of 5 — `scripts/warlock-rules.ts` and `scripts/warlock.test.ts`, committed.

---

## A. One line in `package.json`, which is yours

```json
"test:warlock": "tsx scripts/warlock.test.ts",
```

and `test:warlock` into the `check` chain. It sits naturally beside
`test:necromancer`, `test:druid` and `test:assassin` — the other three
class-specific control suites — and it needs no build, so it belongs in `check`
rather than `check:built`.

`npm run test:warlock` currently reports **54 passed, 0 failed**.

---

## B. The ten controls, and where each came from

Six exist because the defect **actually shipped on these pages** and was caught
by a reviewer rather than by a gate. That is the honest provenance and it is
written into the file header.

| Rule | What it refuses | Origin |
| --- | --- | --- |
| `dlc-gate-missing` | a Warlock build whose `release` is not the expansion | the class is paid DLC |
| `base-game-availability-claimed` | prose saying the class needs no purchase | the mirror of the above, in words |
| `two-hander-exclusivity-overstated` | "no other class can do this", unqualified | **shipped**, and false over the Cleave page's own weapon |
| `grimoire-over-two-sockets` | a runeword too long for a Grimoire | every Grimoire base has `gemsockets = 2` |
| `demon-cap-wrong` | a demon count `petmax` cannot produce, or a cap raised by gear | both thresholds read `blvl` |
| `bound-demon-inside-the-cap` | Bind Demon's pet counted against the three | `pettype = binddemon`, a separate pool |
| `synergy-claimed-with-no-edge` | "X raises Y" where the graph draws nothing | **found a live defect while being written** |
| `sigil-death-threshold-scales` | the execute described as growing with level | both per-level parameters are zero |
| `pierce-element-swapped` | the skill pierce called magic, or the gear pierce called fire | the inversion is the class's most reversible fact |
| `miasma-chain-cast-rate-breakpoint` | an FCR breakpoint justified by Miasma Chain | that row sets `UseAttackRate` |

Nothing re-implements a general rule. Immunity arithmetic stays in
`immunity-claims.ts`, point budgets in `allocation-claims.ts`, synergy
*magnitudes* in `superlative-claims.ts`.

---

## C. Mutation proof, against the real files

Each control applied to the file it guards, gate run, file restored, gate run
again. Baseline on a clean tree is `EXIT=0`.

```
dlc-gate-missing                       mutated EXIT=1  restored EXIT=0  PROVED
base-game-availability-claimed         mutated EXIT=1  restored EXIT=0  PROVED
two-hander-exclusivity-overstated      mutated EXIT=1  restored EXIT=0  PROVED
grimoire-over-two-sockets              mutated EXIT=1  restored EXIT=0  PROVED
demon-cap-wrong                        mutated EXIT=1  restored EXIT=0  PROVED
bound-demon-inside-the-cap             mutated EXIT=1  restored EXIT=0  PROVED
synergy-claimed-with-no-edge           mutated EXIT=1  restored EXIT=0  PROVED
sigil-death-threshold-scales           mutated EXIT=1  restored EXIT=0  PROVED
pierce-element-swapped                 mutated EXIT=1  restored EXIT=0  PROVED
miasma-chain-cast-rate-breakpoint      mutated EXIT=1  restored EXIT=0  PROVED
```

Three of the mutations are the string that was **actually live** — the
two-hander superlative, and two of them restored from earlier commits.

Every planted sentence is also asserted with its correction, and the correction
asserted silent. A rule that refuses both the error and its fix is a rule the
next author deletes rather than satisfies, and four of mine did exactly that on
the first run.

---

## D. What writing the controls found

**Five of the ten rules were wrong when first written, and the test caught all
five.** They are worth listing because each is a way a control can look right
and be useless:

1. **`base-game-availability-claimed` did not fire on its own mutation.** The
   guard exempting corrected prose tested for `needs?` — and the error sentence
   is "needs *no* expansion". The guard silenced the exact defect the rule
   exists for. It is now built from the affirmation ("requires", "paid
   purchase") rather than from a word the error shares.
2. **`bound-demon-inside-the-cap` did not fire either**, for the same shape: its
   negation guard was a bare `\bnot\b`, and the error sentence ends "so a fourth
   demon is not possible". The negation now has to sit on the sharing verb.
3. **`synergy-claimed-with-no-edge` rejected its own correction.** "Neither
   feeds the other" contains the same verb the claim does.
4. **It then rejected three *live* sentences**, because a set-membership test
   cannot see a receiver named as a pronoun: "Blade Warp and Hex: Purge each
   raise **it** by 50% per level" names two sources and no receiver. The rule is
   now positional — source, verb, receiver — and a sentence with no receiver
   after the verb is not a claim it can check.
5. **`sigil-death-threshold-scales` missed a mutation in the skill's own
   bullet**, which calls it "the sigil" rather than by name. Keyed on the name,
   it was blind to the page most likely to get it wrong. It is now keyed on the
   effect — an execution threshold expressed as a share of life — and when I
   loosened it too far it immediately fired on Hex: Purge's true sentence about
   explosion chance, which is how the final shape was arrived at.

**And one live defect in the content, found by the rule rather than by reading.**
Death Mark's entry said it "feeds two other skills: Summon Goatman's Crushing
Blow, and Bind Demon's chance to capture". Both relationships are real —
`passivecalc12` reads `skill('Death Mark'.blvl)` — and neither is a synergy: the
parameter is described "% Chance Crushing blow syn", which is not the word the
extractor matches, so the graph draws no edge. The page now says two skills
*read its level*, which is accurate and distinguishable from a synergy. Fixed in
both locales in `a5b341e`.

---

## E. Also in this branch, from your last two messages

- **The backticks.** `RichText` is deliberately non-recursive: its bold token
  matches first and emits the contents verbatim, so a code span **inside** a bold
  run prints its own backticks. Four instances across two pages and both locales
  — two of which I had written that morning and which had not been built yet.
  Proved by `npm run build` then `npm run check:built` with nothing edited
  between: `test:markup` reports my four build pages and the journey clean, and
  the built HTML carries zero raw code spans on all ten.
- **The two-hander claim.** `weapons.json` carries eighteen `1or2handed` rows and
  every one is `type = swor` — no staff, mace or sceptre. So the two Apocalypse
  claims about a staff survive and now say why, and the two Cleave claims did
  not: **Dreadfang is a Legend Sword, which is on that list**, so the page was
  making the exclusivity claim over the one weapon where a Barbarian shares it.

**One thing left on the Barbarian page, not mine.** `test:markup` still fails on
`en-us` and `pt-br` `builds/barbarian/whirlwind-barbarian.html` with a literal
`` `oath` ``. Same mechanism, so the fix is the same: take the code span out of
the bold run it sits in.

---

## F. Verification

- `npm run test:warlock` — **54 passed, 0 failed**.
- All ten controls mutation-proved against the real files, table in §C.
- `npx eslint scripts/warlock-rules.ts scripts/warlock.test.ts` — clean.
- `npx tsc --noEmit` — **0 errors**, project-wide, now that a build has
  generated `.next/types`.
- `npm run check` — the single `every build file was found and read` line is
  gone since you registered the builds; the chain is green here.
