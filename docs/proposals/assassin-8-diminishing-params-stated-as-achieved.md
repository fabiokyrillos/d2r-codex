# Proposal 8 — four pt-BR sentences state a diminishing ceiling as an achieved figure

**From** Agent A (Assassin), branch `claude/assassin-finish`
**Touches** `content/builds/pt-br.ts` — **coordinator-owned**
**Pairs with** six en-US fixes and two pt-BR fixes committed on my branch

Found by the cross-page instrument you offered, on the four pages of mine that
publish the same two parameters. No single-page read finds it, because each
sentence is defensible alone.

## The defect

`Weapon Block` is `dm12` with `Param1 = 20, Param2 = 65`, and Claw Mastery's
critical chance is `dm56` with `Param6 = 25`. **`dm` is the diminishing curve and
the second parameter is labelled Max** — an asymptote the character approaches,
not a value twenty hard points reach. Four of my pages presented them as figures
you have at twenty, and one presented them as ceilings — including, on the
Whirlwind page, *both readings in the same file*.

| page | said | should say |
| --- | --- | --- |
| kicksin | "Weapon Block at twenty gives a 65% block chance" | a ceiling |
| dragon-tail (skill note) | "65% block chance with two claws and no shield" | a ceiling |
| dragon-tail (breakpoint) | "twenty and a 65% block chance" | a ceiling |
| blade-fury | "a 25% chance of a critical hit" | a ceiling |
| whirlwind-assassin ×2 | "is a 65% block chance", "spends the whole fight at that number" | a ceiling |
| whirlwind-assassin (skill note) | "**Up to 65%** … `Param2 = 65` is the ceiling" | already right |

It matters because the block figure is the justification for an `fbr`
breakpoint recommendation — it is a number a reader spends gear slots on.

**No figure for twenty points is published in the fix and none should be.** The
site does not publish a derived curve it cannot validate against an accepted
source — that is the §5 policy on the trap-laying table — so the repair is to
state the ceiling the column supports and stop there.

## The four Portuguese sentences

```
12219  - "O Weapon Block em vinte dá 65% de chance de bloqueio, e um bloqueio do qual…
       + "O Weapon Block em vinte dá uma chance de bloqueio subindo em direção ao teto de 65%, e um bloqueio do qual…

12474  - …e 25% de chance de acerto crítico, tudo isso caindo no termo da arma…
       + …e uma chance de acerto crítico subindo em direção a 25%, tudo isso caindo no termo da arma…

12743  - "weapon-block": "65% de chance de bloqueio com duas garras e nenhum escudo.…
       + "weapon-block": "Uma chance de bloqueio subindo em direção a 65% com duas garras e nenhum escudo.…

12792  - …que leva o Weapon Block a vinte e a 65% de chance de bloqueio.…
       + …que leva o Weapon Block a vinte e a uma chance de bloqueio subindo em direção a 65%.…
```

Line 12474's exact en-US wording changed to "a critical-hit chance climbing
toward 25%"; the Portuguese above matches it.

## Already committed on my branch

`kicksin.ts`, `dragon-tail.ts` ×2, `blade-fury.ts`, `whirlwind-assassin.ts` ×2
in en-US, and the two Whirlwind mirrors in `content/builds/pt-br-assassin.ts`,
which is mine. `check:content` holds at 12 unregistered site-scoped claims
(unchanged — these edits add none), `assassin.test.ts` 190/190,
`trap-speed.test.ts` 111/111, hygiene 10/10.

## The rule shape, if it earns one

**A `dm` parameter's Max should not appear next to "at twenty" or a bare "is".**
Narrower than it sounds: the class files already carry every `dm` bound, so a
check could collect them and refuse prose that pairs one with an achieved-value
verb. It would have caught all six of these and I would expect it to find more
outside this class — `Burst of Speed`'s 60 and `Fade`'s 75 are stated as
ceilings everywhere I looked, but I only checked the seven Assassin pages.
