# Proposal 6 — the pt-BR half of the Dragon Tail immunity opening

**From** Agent A (Assassin), branch `claude/assassin-finish`
**Touches** `content/builds/pt-br.ts`, the `dragon-tail` `immunityPlan` — **coordinator-owned**
**Pairs with** the en-US rewording, committed on my branch

You offered to take my wording. I would write it differently, and the reason is
not rhythm — it is that a count in that sentence is the wrong instrument.

## What I changed, and why not the count

Yours: *"A build with a resisted damage type usually answers it by having another
one, and fifteen on this site carry a single entry in `damageTypes` and answer it
some other way."*

Mine: *"Two damage types on a build normally mean two answers: resist one and the
other still lands. This build lists two — physical and fire — and has one,
because the fire is computed from the physical damage the target actually
suffered."*

Three reasons, in order of weight.

1. **The count undercuts the sentence it sets up.** The paragraph exists so the
   next clause can land — *this build appears to have two and does not*. Telling
   the reader in the same breath that it is usual to have two **and** that
   fifteen builds do not leaves nothing for the contrast to push against.
2. **A number there is a maintenance liability, and this one already drifted.**
   The page's job is not to count `damageTypes`; it is to say that this build's
   second type is derived from its first. The general claim — two listed types
   normally means two independent ones — carries the argument without a figure
   that changes whenever a build lands.
3. **The right fix for a false site-scoped absolute is to stop making one.** Mine
   has no site scope and no exclusivity, so Rule C does not catch it and it needs
   no row in `SITE_SCOPED_CLAIMS`. A registered weaker absolute would have been
   a worse outcome than no absolute.

Verified after the edit: `check:content` drops from 13 unregistered claims to 12
(only the pt-BR mirror below remains), `tail-fire-independent-of-physical` stays
at 0, and `assassin.test.ts` is 190/190.

## The Portuguese

```
-      "**Imunidade a físico fecha esta build duas vezes, e é esse o fato que a página existe para publicar.** Toda outra build elemental deste site responde a um tipo de dano resistido tendo outro. Esta parece responder — ela causa físico e fogo — e não responde, porque **o fogo é calculado a partir do dano físico que o alvo de fato sofreu**. …
+      "**Imunidade a físico fecha esta build duas vezes, e é esse o fato que a página existe para publicar.** Dois tipos de dano numa build normalmente significam duas respostas: resista a um e o outro ainda entra. Esta build lista dois — físico e fogo — e tem um, porque **o fogo é calculado a partir do dano físico que o alvo de fato sofreu**. …
```

Only the second sentence changes; the third keeps its wording and its bold span,
so the `mechanics`-style parity the file relies on is untouched.

## On the count itself, since it is now moot but was checked

`main` at `45b182e` carries **fourteen** builds with a single non-physical
`damageTypes` entry, not fifteen — `abyss-warlock`, `apocalypse-warlock`,
`blizzard-sorceress`, `bone-spear-necromancer`, `fire-wall-sorceress`,
`fireball-meteor-sorceress`, `frost-nova-sorceress`, `frozen-orb-sorceress`,
`hammerdin`, `hydra-sorceress`, `lightning-fury-amazon`, `lightning-sorceress`,
`nova-sorceress`, `poison-javelin-amazon`.

`berserk-barbarian` is `damageTypes: ["magic"]` and would be the fifteenth, but
it exists only on `claude/barbarian-complete` and is not on `main` or any other
branch. So the figure was right for a corpus that includes Agent B's unlanded
work and wrong for the one the gate reads — which is the third time this run a
count has been correct against the wrong tree, and the reason I would rather the
sentence carried none.
