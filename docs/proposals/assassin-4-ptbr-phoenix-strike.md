# Proposal 4 — the pt-BR half of the Phoenix Strike immunity fix

**From** Agent A (Assassin), branch `claude/assassin-finish`
**Touches** `content/classes/skills-pt-br.ts`, the `"phoenix-strike"` entry — **coordinator-owned**
**Pairs with** the en-US fix, already committed on my branch

You asked me to fix both locales. The English half is mine and is done;
`content/classes/skills-pt-br.ts` is on my never-write list, so the Portuguese
half is here as an exact replacement rather than a commit. Two strings.

## What was wrong

`monstats.json` at the pinned commit has **exactly one** row immune to fire,
cold and lightning at once in Hell: `megademon6`, `Level(H) 84`, `ResFi(H) 145`,
`ResCo(H) 145`, `ResLi(H) 145`, `enabled 1`. It displays as **Pit Lord** — and
`megademon2` and `megademon5` display as Pit Lord too and are fire-immune only,
so the name does not distinguish them. `megademon1`/`4` are Balrogs and
`megademon3` a Venom Lord, all fire-immune only.

## `summary`

```
-      "Uma carga cujas três cargas são três elementos diferentes. O motivo de uma Assassin de Martial Arts não ter problema com imunidades.",
+      "Uma carga cujas três cargas são três elementos diferentes. O motivo de uma Assassin de Martial Arts quase nunca esbarrar num muro de imunidade.",
```

## `mechanics[0]`

```
-      "**Três cargas, três elementos.** A primeira libera um meteoro, a segunda raio encadeado e a terceira uma explosão de gelo — fogo, raio e frio de uma skill só, que é por que nada no jogo é imune a tudo isso.",
+      "**Três cargas, três elementos.** A primeira libera um meteoro, a segunda raio encadeado e a terceira uma explosão de gelo — fogo, raio e frio de uma skill só, então parar tudo isso exige três imunidades ao mesmo tempo. **Exatamente uma linha da extração tem as três**: um `megademon` de nível 84 no Hell carregando 145 de fogo, frio e raio. Ele aparece como *Pit Lord*, e outras duas linhas aparecem com esse mesmo nome e são imunes só a fogo — então o muro existe, é um monstro, e o nome dele não diz qual dos três você está olhando.",
```

The en-US counterparts, already on my branch, are the mirrors of these two.

## Gate note

`check:content` compares `mechanics` array **counts**, not contents, so the
English fix landing without the Portuguese does not fail anything —
`npm run check` is `EXIT=0` on my branch as committed. The divergence is
invisible to the gates, which is the reason this proposal exists rather than a
comment saying "pt-BR to follow".
