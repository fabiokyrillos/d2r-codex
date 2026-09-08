# Protótipo da árvore de skills no celular — Fase 0B.1

**Status:** **Q2 aprovada em 2026-09-08** como direção estrutural, com condição de UAT físico.
A **variante F é a baseline da Fase 4**; a variante E fica preservada como termo de comparação.
Continua sendo um protótipo descartável: não é implementação, e a geometria só vai a público depois
do UAT em telefone real descrito no PRD §14 (Fase 4). Ver PRD §8.2, §8.3 R-TREE-3/8/15 e §15.
**Data:** 2026-09-08 · **Escopo:** R-TREE-0 (PRD vNext §8.2) e §10 da revisão de 2026-09-08.

> **Iteração de 2026-09-08 (tarde): variante F.** O proprietário aprovou a
> direção de E e apontou seis ajustes, um deles bloqueante — a captura `10`
> mostrava nomes partidos em colunas de uma ou duas letras com o texto a 200%.
> A variante **F** responde a todos. As seções **§1 a §10 abaixo continuam
> valendo para A–E e não foram reescritas**; a variante F, os números novos e
> a comparação E × F estão em **[§11](#11-variante-f--a-resposta-ao-feedback-sobre-e)**.
> A recomendação corrente é **F**; E continua selecionável (`?v=e`) para a
> comparação lado a lado.

Este protótipo existe para responder, com medição, as dez perguntas de R-TREE-0
antes de a Fase 4 escrever qualquer linha de código de árvore. Ele é
**descartável**: HTML/CSS/JS inline num arquivo só, sem nenhuma importação da
aplicação e sem nenhum arquivo `.ts`, `.tsx` ou `.css` solto — um arquivo desses
nesta pasta entraria no `tsconfig.json` e no eslint do repositório.

Os **dados são reais**: posições (`row`/`column`), níveis (`requiredLevel`) e
pré-requisitos vêm de `content/classes/skill-graph.ts`; as alocações de pontos
vêm de `content/builds/blizzard-sorceress.ts` e
`content/builds/summoner-necromancer.ts`. Nada foi inventado. Os sigilos são
geometria própria, no mesmo idioma visual de `components/game/skill-sigil.tsx`.
**Nenhum asset do jogo, nenhuma arte da Blizzard, nenhum traçado sobre arte
protegida.**

---

## 1. Como abrir

```
docs/product/prototypes/mobile-skill-tree/
├── index.html      o protótipo inteiro (abrir com duplo clique)
├── README.md       este relatório
└── screenshots/    21 capturas, geradas pelo mesmo driver que mediu
                    (01–12: variantes A–E · 13–21: E × F)
```

Abra `index.html` no navegador — funciona por `file://`, sem servidor e sem
rede. A barra **Protótipo — controles**, no topo, troca variante, idioma,
classe, layout, conectores, pontos, "meu nível", disposição do nó, altura de
fileira, política das setas e redução de movimento. Cada escolha entra na URL,
então qualquer estado é compartilhável.

Parâmetros úteis (todos opcionais):

| Parâmetro | Valores | O que faz |
|---|---|---|
| `v` | `a` `b` `c` `d` `e` `f` | variante (§3 para A–E, §11 para F) |
| `lang` | `pt-br` `en-us` | idioma da interface |
| `class` | `sorceress` `necromancer` | classe |
| `tree` | slug da tree | tree ativa em modo abas |
| `mode` | `auto` `tabs` `stacked` | `auto` = abas < 640 px, empilhadas ≥ 640 px (padrão de F) |
| `big` | `glyph` `grow` `cap` | estratégia de texto ampliado da variante F (§11.4) |
| `conn` | `straight` `ortho` | conectores retos ou ortogonais |
| `points` | `1` `0` | com ou sem os pontos da build |
| `level` | `0`…`99` | "meu nível" — acima dele o nó fica bloqueado |
| `rows` | `auto` `fixed` | fileira que cresce com o texto, ou fixa |
| `nav` | `strict` `current` | setas estritas ou o algoritmo de produção |
| `node` | `stack` `inline` | sigilo acima do nome, ou flutuado ao lado |
| `motion` | `auto` `reduce` | força a redução de movimento |
| `nofont` | `1` | simula abrir offline, sem Inter/Cinzel |
| `chrome` | `0` | esconde a barra de controles (para captura) |

Exemplo — o estado recomendado, em português, na Summoning:
`index.html?v=f&lang=pt-br&class=necromancer&tree=summoning&mode=auto&conn=ortho&points=1`

`window.__setTextScale(200)` no console simula **texto ampliado** (corpo da
raiz a 32 px). Redimensionar a janela simula **zoom de página**. São coisas
diferentes e o protótipo mede as duas separadamente (§11.4).

`window.__measure()` no console devolve, em JSON, tudo que este relatório
mede. Foi assim que os números abaixo foram colhidos.

### Como as medições foram feitas

Um script de scratchpad dirigiu o Chrome pelo **mesmo driver CDP que o
repositório já usa** (`scripts/headless.ts`, importado, não copiado), fixou
cada viewport com `Emulation.setDeviceMetricsOverride`, esperou
`document.fonts.ready` e chamou `window.__measure()`. As capturas saíram de
`Page.captureScreenshot` na mesma passagem, então imagem e número vêm do mesmo
layout. O script não está versionado (é temporário e viveria em `scripts/`, que
esta fase não pode tocar).

Total: **200 configurações** na malha principal, **120** na varredura de altura
de fileira, **16** de zoom, **60** de fonte, **40** toques reais.

---

## 2. Capturas

| Arquivo | O que mostra |
|---|---|
| `01-320-ptbr-cold-E.png` | Cold Spells, pt-BR, 320 px — a variante recomendada |
| `02-320-enus-summoning-E.png` | Summoning, en-US, 320 px — os nomes mais longos |
| `03-320-enus-summoning-A.png` | A: trilho suprimido, nível em cabeçalho de fileira |
| `04-320-enus-summoning-B.png` | B: trilho de 36 px de produção mantido |
| `05-320-enus-summoning-C.png` | C: trilho fino de 20 px dentro da grade |
| `06-320-ptbr-cold-E-nivel18.png` | Estados **bloqueada** e **disponível** (nível 18, sem build) |
| `07-320-enus-cold-E-ortogonal.png` | Conectores ortogonais, Blizzard Sorceress inteira |
| `08-390-ptbr-summoning-E.png` | Summoning, pt-BR, 390 px |
| `09-390-enus-cold-E.png` | Cold, en-US, 390 px |
| `10-320-ptbr-summoning-E-texto200.png` | Texto a 200% (raiz de 32 px) em 320 px |
| `11-768-enus-cold-E-empilhadas.png` | Tablet, três trees empilhadas |
| `12-1280-ptbr-cold-E-painel.png` | Desktop, painel lateral ancorado |

Da variante F (§11), sempre com a legenda no estado estável (fechada):

| Arquivo | O que mostra |
|---|---|
| `13-320-ptbr-summoning-E-normal.png` | **E**, 320 px, texto normal — par de comparação |
| `14-320-ptbr-summoning-F-normal.png` | **F**, mesmo enquadramento: nome a 12 px, conectores ortogonais, trilho recuado, legenda única |
| `15-320-ptbr-summoning-E-texto200.png` | **E** a 200% de texto — o defeito: `Skeleto/n/Master/y`, `Raise Skeleto/n`, `Summ/on Resist` |
| `16-320-ptbr-summoning-F-texto200.png` | **F** a 200%, mesmo enquadramento: nó por sigilo, zero palavras partidas, a árvore inteira numa tela |
| `17-320-enus-summoning-F-normal.png` | F em inglês (par de `14`) |
| `18-390-ptbr-summoning-F.png` | F a 390 px |
| `19-320-ptbr-summoning-F-selecionada-texto200.png` | F a 200% com "Raise Skeletal Mage" selecionada — o sheet carrega o nome completo |
| `20-320-enus-cold-F-ortogonal.png` | F com Blizzard selecionada: caminho de pré-requisito em ember, conectores ortogonais |
| `21-640-ptbr-cold-F-empilhadas.png` | F a 640 px: três trees empilhadas e **uma** legenda |

---

## 3. As variantes construídas

Todas compartilham a mesma grade 3×6, os mesmos dados, os mesmos estados e o
mesmo teclado. Elas diferem **apenas no destino do trilho de nível** — que é
exatamente a pergunta 2 e o finding **H2**.

| | Trilho de nível | Nível visível? | Nó a 320 px | Fileira | Grade por tree |
|---|---|---|---|---|---|
| **A** | suprimido; faixa de cabeçalho por fileira (hipótese do PRD) | sim, na faixa | **88 px** | 60 px | **586 px** |
| **B** | mantido a 36 px (`w-9`, o de produção) | sim, no trilho | **73,3 px** | 72 px | **472 px** |
| **C** | trilho fino de 20 px dentro da grade | sim, no trilho | **80 px** | 72 px | **472 px** |
| **D** | nenhum (piso teórico) | **não** — só no `aria-label` e no painel | **88 px** | 60 px | **400 px** |
| **E** | trilho de 20 px **na calha do `Container`** | sim, no trilho | **88 px** | 60 px | **400 px** |

**A alternativa "visão geral 3×6 + detalhe separado" não é uma variante.** Ela
já é o comportamento base das cinco: abaixo de 1024 px o detalhe abre em bottom
sheet, acima disso num painel ancorado. Separá-la produziria a mesma tela.

**E é uma proposta do protótipo, não do PRD.** O `Container` aplica `px-5`
(20 px de cada lado) e essa calha está vazia. O trilho sai do fluxo
(`position:absolute; left:calc(-1 * var(--pad-x))`) e ocupa a calha; a grade
fica com os 280 px inteiros. As alturas das fileiras são copiadas por JS
(`syncRail`), e a conferência mediu alinhamento exato: cada célula do trilho
começa e termina no mesmo pixel da fileira correspondente.

### Duas escolhas ortogonais, medidas junto

**Disposição do nó.** `stack` (sigilo e contador numa linha, nome abaixo) versus
`inline` (sigilo flutuado à esquerda, contador à direita, nome escorrendo em
volta). `inline` economiza 4–15 px por fileira e **foi rejeitada**: com o sigilo
flutuado a primeira linha fica com ~10 px úteis e o navegador **parte a palavra
ao meio** — "Ice Bolt" renderiza como `Ic / e / Bolt`, "Blizzard" como
`Blizzar / d`. Medido com `Range.getClientRects()` por palavra: **104
ocorrências** em 24 medições na variante C. Com `stack`: **zero**, em todas as
240 medições.

**Altura da fileira.** `fixed` (valor exato) versus `auto`
(`minmax(--row-h, auto)` — o valor vira piso). Em tamanho de texto normal as
duas dão exatamente o mesmo resultado; sob texto ampliado, `fixed` corta e
`auto` cresce (§5, pergunta 8). **`auto` é o padrão recomendado.**

---

## 4. Tabela de medições

Viewport × variante × modo. Idioma **não** altera a geometria da grade: os
nomes de skill e de tree ficam em inglês nos dois idiomas (ADR 0003), então só
cabeçalhos, legenda e dica mudam de altura. Onde o idioma muda algo, está dito.

Todas as linhas: **overflow horizontal = 0**, **cortes de nome = 0**,
**palavras partidas = 0**, **1 Tab stop por tree visível**, **0 elementos
focáveis dentro de tree inativa**, **alcançabilidade por teclado = 100%**.

### 320 px (largura útil medida: **280 px**)

| Var | Modo | Nó | Fileira | Grade/tree | Abas | Seção total |
|---|---|---|---|---|---|---|
| A | abas | 88 × 60 | 60 | 586 | 44–92 | 953,5 – **1.025,5** |
| B | abas | 73,3 × 72 | 72 | 472 | 44–92 | 839,5 – **911,5** |
| C | abas | 80 × 72 | 72 | 472 | 44–92 | 839,5 – **911,5** |
| D | abas | 88 × 60 | 60 | 400 | 44–92 | 767,5 – **839,5** |
| **E** | **abas** | **88 × 60** | **60** | **400** | 44–92 | **791,5 – 839,5** |
| A | empilhadas | 88 × 60 | 60 | 586 ×3 | — | **2.517,5** |
| B | empilhadas | 73,3 × 72 | 72 | 472 ×3 | — | **2.175,5** |
| C | empilhadas | 80 × 72 | 72 | 472 ×3 | — | **2.175,5** |
| D | empilhadas | 88 × 60 | 60 | 400 ×3 | — | **1.959,5** |
| **E** | **empilhadas** | **88 × 60** | **60** | **400 ×3** | — | **1.959,5** |

O intervalo na coluna "Seção" é Sorceress (abas em uma linha) → Necromancer
(abas em duas linhas, por causa de "Poison and Bone Spells").

### 390 px (largura útil: 350 px)

| Var | Modo | Nó | Grade/tree | Seção |
|---|---|---|---|---|
| A | abas | 111,3 × 60 | 586 | 962,5 |
| B | abas | 96,7 × 72 | 472 | 848,5 |
| C | abas | 103,3 × 72 | 472 | 848,5 |
| **E** | **abas** | **111,3 × 60** | **400** | **776,5** |
| **E** | **empilhadas** | **111,3 × 60** | **400 ×3** | **1.896,5 – 1.914,5** |

### 640 / 768 / 1280 px

| Viewport | Útil | Nó (E) | Grade/tree | Seção (empilhadas) |
|---|---|---|---|---|
| 640 | 576 | 186,7 × 60 | 400 | 1.827,5 |
| 768 | 704 | 229,3 × 60 | 400 | 1.827,5 |
| 1280 | 960 (grade 1fr + painel de 20rem) | 200 × 60 | 400 | 1.827,5 |

A 1280 px o painel lateral ancorado entra e a grade divide a largura com ele;
o nó cai de 229 para 200 px e nada mais muda.

### Decomposição da seção (E, 320 px, abas, Necromancer)

| Bloco | Altura |
|---|---|
| Cabeçalho da seção (título, subtítulo, total) | 123,5 |
| Controle de abas (duas linhas) | 92 |
| Cabeçalho da tree (`h2`) | 20 |
| "N de M pontos nesta árvore" | 15 |
| Dica de teclado | 15 |
| **Grade 3×6** | **400** |
| Legenda de estados | 116 |
| **Total** | **839,5** |

A grade é 6 × 60 + 5 × 8 = 400 px, exatos. Tudo o mais é cromo, e o cromo é
maior que 50% da seção — é aí que estão as reduções fáceis se o orçamento
apertar (a legenda de 116 px, por exemplo, pode ser um `<details>` fechado).

---

## 5. As dez perguntas, respondidas com número

**1. Três colunas cabem nos 280 px úteis de 320 px?**
**Sim.** A largura útil medida é **280,0 px** (`Container` com `px-5`), como o
finding H2 diz — não 288. Com vão de 8 px e sem trilho no fluxo, o nó fica em
**88,0 px** exatos: (280 − 16) / 3. Zero overflow horizontal em 200
configurações.

**2. O que fazer com o trilho de nível de 36 px?**
Nenhuma das duas opções que o PRD ofereceu é a melhor. A aritmética de H2 se
confirmou exatamente:

| Cenário | Cálculo | Nó | Custo |
|---|---|---|---|
| Trilho mantido a 36 px (**B**) | (280 − 44 − 16) / 3 | **73,3 px** | nome cai para 3 linhas → fileira de 72 px |
| Trilho suprimido, faixa de fileira (**A**) | (280 − 16) / 3 | **88,0 px** | **+186 px por tree** de faixas, e os conectores cruzam os filetes |
| Trilho fino de 20 px no fluxo (**C**) | (280 − 24 − 16) / 3 | **80,0 px** | 3 linhas → fileira de 72 px |
| Trilho de 20 px **na calha** (**E**) | (280 − 16) / 3 | **88,0 px** | **nenhum** |

**Recomendação: E.** O nível continua visível, o nó fica com os 88 px, e a
seção é 186 px mais curta que a hipótese A.

Por que 80 px já custa 12 px de altura: a diferença inteira é **um nome**.
"Raise Skeletal Mage" ocupa duas linhas em 88 px (largura interna 78 px) e três
em 80 px (largura interna 70 px), porque "Raise Skeletal" mede ~72 px a 11 px.
Todo o orçamento vertical da árvore está pendurado nesse limiar.

**3. Os nomes continuam legíveis nos dois idiomas, sem zoom?**
**Sim, e o idioma não altera nada.** Nomes de skill e de tree ficam em inglês em
pt-BR (ADR 0003) — o protótipo confirma que só rótulos de interface traduzem.
Em **240 medições** (5 variantes × 6 árvores × 2 idiomas × 2 estados de nível):
zero nome cortado, zero palavra partida, com o nome a **11 px**
(`0.6875rem`, o mesmo corpo que produção usa em rótulos pequenos).

Corpo do nome, altura natural máxima do nó a 320 px:

| Corpo | A / D / E (nó 88) | B (nó 73,3) | C (nó 80) |
|---|---|---|---|
| 10 px | 60 | 72 | 72 |
| **11 px** | **60** | 72 | 72 |
| 12 px | 74 | 74 | 74 |

**11 px é grátis em relação a 10 px** e é o que o protótipo usa. 12 px custa
14 px por fileira (84 px por tree) na variante recomendada.

Aberto offline, sem Inter nem Cinzel (`?nofont=1`), **os números são
idênticos** nas cinco variantes e nas seis árvores. A conclusão não depende da
fonte carregar.

**4. Os conectores continuam compreensíveis?**
**Sim, com uma condição e uma preferência.**
- *Condição:* o nó precisa de fundo opaco em **todos** os estados. Na primeira
  versão o estado bloqueado tinha fundo transparente e a linha atravessava o
  nome ("Blizzard" cortado por um traço vertical). Corrigido.
- *Preferência:* na variante A os filetes das faixas de fileira cruzam as linhas
  verticais e o conjunto lê como ruído (comparar `03` com `02`). Sem faixas, as
  linhas ficam limpas.
- Retos (fidelidade a produção) e **ortogonais** foram medidos lado a lado. Os
  ortogonais (captura `07`) leem melhor a 320 px porque nunca entram no corpo do
  nó em diagonal. **Recomendo ortogonais** — é mudança de geração de caminho,
  não de arquitetura.
- Os conectores são `aria-hidden`, desenhados em SVG absoluto sobre a grade,
  com `vector-effect="non-scaling-stroke"`, e existem em todas as larguras
  (R-TREE-2). Summoning desenha 9 arestas, Cold desenha 8.
- Contraste do traço (`--ink-subtle` sobre `--abyss`): **4,19:1** — acima dos
  3:1 de WCAG 1.4.11.

**5. Os alvos de toque atingem os limites?**
**Sim, com folga.** O nó mede **88 × 60 px** — ≥ 44 px nos dois eixos
(R-A11Y-4). As abas medem no mínimo **65 × 44 px**. Verificação de toque real
(cliques CDP no centro de cada nó, com Escape entre eles): **40 de 40 acertos**,
em Cold e Summoning, a 320 e 390 px. Sondagem adicional a 6 px de cada canto de
cada nó: **40 de 40**.

**6. Todos os nós são alcançáveis por teclado?**
**Sim — e o protótipo respondeu mais do que a pergunta.** Ver §6.

**7. Uma árvore por aba reduz a altura sem perder contexto?**
**Reduz muito.** Baseline de produção: **3.511 px a 320 px** e **3.443 px a
390 px**.

| | 320 px | vs baseline | 390 px | vs baseline |
|---|---|---|---|---|
| Produção hoje (lista de uma coluna) | 3.511 | — | 3.443 | — |
| **E, três trees empilhadas** | **1.959,5** | **−44%** | 1.914,5 | **−44%** |
| **E, uma tree por aba** | **839,5** | **−76%** | 776,5 | **−77%** |

Ou seja: **a grade compacta sozinha já corta 44%**; as abas cortam mais 57% em
cima disso. As abas valem, mas não são o que salva a largura — são um ganho
vertical adicional.

*Contexto perdido:* as duas trees inativas somem da tela. O controle de abas
mantém o contexto mostrando os três nomes **e** os pontos investidos em cada uma
("47/200", "23/200", "4/200"), então o leitor vê onde a build gastou pontos sem
trocar de aba.

*Custo medido do controle:* **44 px** quando os três nomes cabem numa linha
(Sorceress em qualquer largura; Necromancer a partir de 390 px) e **92 px**
quando quebra em duas (Necromancer a 320 px, por "Poison and Bone Spells"). Esse
é o único lugar onde 320 px difere de 390 px.

**8. Zoom de 200% e 400% continuam utilizáveis?**
Duas coisas diferentes, medidas separadamente.

*Reflow (WCAG 1.4.10, o que R-TREE-15 pede):* em **320 px CSS efetivos** —
equivalente a 400% de zoom em 1280 px — a grade continua 3×6, **sem rolagem
horizontal**, sem corte. Passa nas cinco variantes.

*Texto ampliado (WCAG 1.4.4):* aqui a resposta depende da altura de fileira.

| Fileira | Raiz | Corte de nome | Overflow horizontal | Seção |
|---|---|---|---|---|
| `fixed` | 16 px | 0 | 0 | 839,5 |
| `fixed` | 24 px (150%) | **9 nós** | 0 | 1.032,2 |
| `fixed` | 32 px (200%) | **10 nós** | 0 | 1.452,9 |
| **`auto`** | 16 px | 0 | 0 | 839,5 |
| **`auto`** | 24 px (150%) | **0** | 0 | 1.120,5 |
| **`auto`** | 32 px (200%) | **0** | 0 | 1.731,1 |

Com fileira fixa o texto ampliado é cortado a partir de ~150%. Com
`minmax(--row-h, auto)` a fileira cresce e **nada é cortado até 200%**, ao custo
de 891 px de altura. **A altura de fileira tem que ser um piso, não um valor.**

Dois defeitos reais foram encontrados por essa medição e corrigidos no
protótipo:
- a legenda em duas colunas fixas estourava **28 px** além da viewport a 200%
  de texto (`repeat(auto-fit, minmax(112px,1fr))` resolve);
- a 200% "Skeleton" fica mais largo que o nó e era cortado na horizontal.
  `overflow-wrap: break-word` (não `anywhere` — `anywhere` parte "Blizzard" em
  "Blizzar/d" quando a primeira linha é estreita) mais `hyphens: auto` resolve.
  Isso exigiu `lang="en"` no elemento do nome, o que também é a marcação
  **correta**: são palavras inglesas dentro de um documento `pt-BR`, e o leitor
  de tela precisa disso para pronunciar.

**9. Que largura de nó, altura de fileira e vão funcionam?**
**Nó 88 × 60 px, vão 8 px, fileira 60 px como piso.** Hoje a fileira é 88 px e o
vão 8 px; o vão não precisa mudar. A fileira cai 28 px.

**10. Qual a altura final por tree?**
**Grade: 400 px.** Bloco de tree completo (cabeçalho + contador + dica + grade +
legenda): **598 px a 320 px**, 583 px a 390 px. Seção inteira com uma tree:
**791,5–839,5 px a 320 px**; com as três empilhadas: **1.959,5 px**.

---

## 6. Teclado: o protótipo respondeu H4 e encontrou um conflito no PRD

A navegação de produção (`lib/skill-tree-nav.ts`) foi **portada literalmente**
para o protótipo, e depois comparada com a política estrita que R-TREE-13 pede.
A prova rodou sobre os grafos reais das **24 árvores das 8 classes**, com busca
em largura a partir do primeiro nó.

| Política | Árvores 100% alcançáveis (com Home/End) | Sem Home/End |
|---|---|---|
| Atual (produção) | **24 / 24** | **24 / 24** |
| Estrita pura (para na borda) | **24 / 24** | **24 / 24** |
| Estrita + fallback do R-TREE-13 | **24 / 24** | **24 / 24** |

**A navegação estrita preserva a alcançabilidade total.** O PRD não precisa
escolher entre previsibilidade e alcançabilidade — as duas valem ao mesmo tempo,
nas 24 árvores, e mesmo sem Home/End. Isso fecha **H4** com prova, não com
opinião.

E os casos de previsibilidade que o PRD nomeia:

| | Ice Blast → baixo | Ice Blast → direita |
|---|---|---|
| Atual (produção) | `shiver-armor` ✗ | `shiver-armor` ✗ |
| **Estrita pura** | **`glacial-spike`** ✓ | **nada** ✓ |
| Estrita + fallback do R-TREE-13 | `glacial-spike` ✓ | `shiver-armor` ✗ |

**O fallback que R-TREE-13 descreve no próprio texto quebra o critério de
aceite que R-TREE-13 pede duas linhas depois.** A cláusula "quando não há nó na
direção exata, o fallback é… próximo nó na fileira/coluna vizinha mais próxima"
faz `Ice Blast → direita` cair em Shiver Armor, que é exatamente o
comportamento que o aceite chama de errado ("Ice Blast → direita = nada"). E o
fallback existe para proteger a alcançabilidade, que a medição mostra não
precisar de proteção. **Recomendação: remover a cláusula de fallback de
R-TREE-13.**

O protótipo usa a política estrita por padrão (`?nav=current` mostra a de
hoje). Conferido no DOM real, não só no algoritmo: BFS disparando eventos de
teclado de verdade alcançou 10 de 10 nós em todas as trees testadas.

Também conferido no navegador: Home → primeiro nó ocupado, End → último;
Enter/Espaço abre o sheet (`role=dialog aria-modal=true`), o foco entra nele, o
scroll do corpo trava, Esc fecha, **o foco volta ao nó de origem**; um único
`tabindex=0` por tree.

---

## 7. Acessibilidade

### O que passou

- **`role=grid` válido.** Todas as seis fileiras expõem **exatamente três
  `gridcell`**, incluindo as vazias, que carregam nome acessível ("Sem skill" /
  "No skill"). Verificado na árvore de acessibilidade do navegador.
- **Nome acessível composto**, conforme R-TREE-3: `"Skeleton Mastery, Nível 1,
  Summoning Spells, 20 de 20, Maximizada."`
- **Trees inativas com `hidden`, não `aria-hidden`.** Medição:
  `focusableInHidden = 0` em todas as 200 configurações — nenhum elemento
  focável dentro de tree inativa, que é o aceite que a revisão pede.
- **`aria-live=polite` só na seleção confirmada.** Mover o foco com as setas
  **não** altera a região live (medido: texto idêntico antes e depois de quatro
  movimentos de seta). Clique e Enter anunciam `"Blood Golem selecionada.
  Investida."`
- **Toque:** 40/40 acertos reais; nó 88 × 60; abas ≥ 65 × 44.
- **Redução de movimento:** `transition-duration` medido em **0,15 s** no modo
  normal e **0 s** com `prefers-reduced-motion: reduce` (ou com o botão
  "Reduzido").
- **Hover só com `(hover: hover)`:** no navegador emulando toque,
  `matchMedia('(hover: hover)')` devolve `false` e o handler não é registrado.
- **`lang="en"` nos nomes de skill** dentro do documento `pt-BR`.
- **Conectores e trilho `aria-hidden`** — o nível já está no nome acessível de
  cada nó, e repetir seria dizer duas vezes.
- **Estados sem depender de cor:** disponível (moldura sólida), bloqueada
  (moldura **tracejada** + cadeado + sigilo a 45%), investida (moldura de 2 px +
  contador em pílula **redonda**), maximizada (moldura de 2 px + anel interno +
  contador em pílula **chanfrada** com estrela). Forma e texto, não só cor.

### O que falhou, e o que foi corrigido

| Achado | Medição | Correção aplicada |
|---|---|---|
| Nome do nó bloqueado em `--ink-subtle` | **3,99:1** sobre `--surface` — abaixo dos 4,5:1 de R-A11Y-5 | trocado para `--ink-muted` (**7,32:1**); o estado continua carregado pela moldura tracejada, pelo cadeado e pelo sigilo apagado |
| Moldura do nó em `--border` | **1,33:1** sobre `--surface` — muito abaixo dos 3:1 que R-TREE-5 pede para a moldura, que é o que identifica o nó no estado "disponível" | trocado para `--ink-subtle` (**3,99:1**), o token mais escuro do sistema que passa — o mesmo que produção já escolheu para os conectores, pelo mesmo motivo. `--border-strong` também reprova (1,63:1) |
| Legenda em duas colunas fixas | estourava **28 px** a 200% de texto | `repeat(auto-fit, minmax(112px, 1fr))` |
| Nome cortado na horizontal a 200% | "Skeleton" mais largo que o nó | `overflow-wrap: break-word` + `hyphens: auto` + `lang="en"` |
| Conector atravessando o nome | nó bloqueado tinha fundo transparente | fundo opaco em todos os estados |

Contrastes finais medidos (razão WCAG, calculada sobre os tokens de
`app/globals.css`):

| Par | Razão | Exigência |
|---|---|---|
| Nome (`--ink`) sobre nó (`--surface`) | 15,58:1 | ≥ 4,5 ✓ |
| Nome bloqueado (`--ink-muted`) sobre `--surface` | 7,32:1 | ≥ 4,5 ✓ |
| Nível do trilho (`--ink-muted`) sobre `--abyss` | 7,69:1 | ≥ 4,5 ✓ |
| Moldura disponível (`--ink-subtle`) sobre `--surface` | 3,99:1 | ≥ 3 ✓ |
| Moldura investida/maximizada (`--ember`) sobre `--surface` | 5,58:1 | ≥ 3 ✓ |
| Conector (`--ink-subtle`) sobre `--abyss` | 4,19:1 | ≥ 3 ✓ |
| Número do contador (`--abyss`) sobre `--ember` | 5,87:1 | ≥ 4,5 ✓ |
| Sigilo de frio (`--el-cold`) sobre `--surface` | 8,50:1 | ≥ 3 ✓ |

### Um defeito de produção que a auditoria e a revisão não pegaram

A revisão (§7) diz que trazer a grade 3×6 para 320 px corrige "de graça" o
`role=grid` inválido, porque hoje as células vazias são `hidden sm:block`.
**Isso está incompleto.** Em `components/game/skill-tree-interactive.tsx` a
célula vazia é renderizada com **`role="gridcell"` e `aria-hidden="true"`** ao
mesmo tempo — então ela sai da árvore de acessibilidade **em todas as larguras**,
inclusive acima de 640 px, e as fileiras já ficam com uma, duas ou três células
conforme a tree. Largura não é a causa; o `aria-hidden` é.

A correção é dar nome acessível à célula vazia, e a chave já existe e **nunca
foi usada**: `emptyCell` ("No skill" / "Sem skill") está declarada em
`lib/i18n/dictionaries/en-us.ts:655` e `pt-br.ts:659` e não aparece em nenhum
componente. O protótipo usa exatamente essa solução.

---

## 8. Problemas encontrados

1. **A disposição "sigilo flutuado" parte palavras.** Rejeitada com medição
   (§3). Custou 15 px por fileira preservar a leitura, e vale.
2. **A faixa de cabeçalho por fileira (hipótese A do PRD) custa 186 px por
   tree** e sujar os conectores. É a única hipótese do PRD que o protótipo
   reprova de forma clara.
3. **A cláusula de fallback de R-TREE-13 contradiz o próprio critério de aceite
   de R-TREE-13** (§6).
4. **A célula vazia de produção é `aria-hidden` em toda largura** (§7).
5. **O contraste da moldura padrão não atinge 3:1** com os tokens atuais (§7).
   Corrigir é trocar um token, mas muda o visual de 30 nós por página — o
   proprietário precisa olhar.
6. **O controle de abas quebra em duas linhas a 320 px no Necromancer**, por
   "Poison and Bone Spells" (92 px em vez de 44 px). Não é defeito; é o preço de
   não abreviar nome de tree. Abreviar seria mudança de conteúdo.
7. **"Corpse Explosion" não é da Summoning.** O PRD (§8.2) e a revisão (§10)
   listam "Raise Skeletal Mage", "Corpse Explosion" e "Skeleton Mastery" como os
   nomes longos da Summoning. `skill-graph.ts:1116` põe Corpse Explosion em
   **Poison and Bone**. O protótipo mede as seis árvores das duas classes, então
   o caso está coberto de qualquer forma — mas a citação do PRD deve ser
   corrigida.
8. **O protótipo monta a grade por JavaScript.** R-TREE-16 exige HTML estático
   em produção. A geometria medida aqui não depende disso (é CSS Grid puro), mas
   o protótipo **não** é evidência sobre o caminho sem JS.
9. **O trilho da variante E encosta na borda da tela a 320 px** (x = 0 a 20 px).
   Legível no headless; precisa de confirmação em telefone real com tela curva.
10. **Não há teste com usuário.** As afirmações sobre "achar Blizzard em ≤ 5 s"
    e "ler todos os nomes à distância normal" são medidas de geometria e
    contraste, não de percepção. **Só o proprietário fecha esses dois.**

---

## 9. Recomendação

> **Superada em parte por §11.** Esta seção registra a recomendação de E, feita
> antes do feedback do proprietário. Os números marcados abaixo mudaram em F:
> corpo do nome (11 → **12 px**), altura da fileira (60 → **74 px**), grade
> (400 → **484 px**), inset do trilho, legenda e conectores. O resto continua
> valendo. Os números correntes estão em **§11.2**.

**Aprovar a variante E, com disposição empilhada do nó, fileira `auto` de piso
60 px e setas estritas.** Abaixo de 640 px, uma tree por aba.

### Números que viram requisito

| Saída do protótipo | Valor | Consome |
|---|---|---|
| Largura do nó a 320 px | **88 px** — (280 − 2 × 8) / 3 | R-TREE-3 |
| Vão | **8 px**, nos dois eixos (inalterado) | R-TREE-3 |
| Altura da fileira | **60 px como piso**, `minmax(60px, auto)` | R-TREE-3, R-TREE-8 |
| Alvo de toque resultante | 88 × 60 px | R-A11Y-4 |
| Corpo do nome | **11 px** (`0.6875rem`) | R-TREE-3 |
| Destino do trilho | **mantido, 20 px, na calha do `Container`**, fora do fluxo, `aria-hidden` | R-TREE-1 (H2) |
| Abas | **abaixo de 640 px**, uma tree por vez; 640 px e acima, três empilhadas | R-TREE-8, Q3 |
| Custo do controle de abas | 44 px (uma linha) / 92 px (duas, Necromancer a 320 px) | R-TREE-8 |
| Orçamento de altura da grade | **400 px por tree** | R-TREE-8, §12.2 |
| Orçamento do bloco de tree | **598 px** (cabeçalho + contador + dica + grade + legenda) | R-TREE-8 |
| Orçamento da seção, uma tree | **≤ 840 px a 320 px** (era 3.511 px: **−76%**) | R-TREE-8, §12.2 |
| Orçamento da seção, três empilhadas | **≤ 1.960 px a 320 px** | R-TREE-8 |
| Conectores | ortogonais, `aria-hidden`, `--ink-subtle`, `non-scaling-stroke` | R-TREE-2 |
| Setas | **estritas, param na borda, sem fallback** | R-TREE-13 (H4) |
| Célula vazia | `role=gridcell` **com** nome acessível (`emptyCell`), nunca `aria-hidden` | R-TREE-14, R-A11Y-11 |
| Moldura do nó disponível | `--ink-subtle` (3,99:1); `--border` reprova em 1,33:1 | R-TREE-5, R-A11Y-5 |
| Nome do nó bloqueado | `--ink-muted` (7,32:1); `--ink-subtle` reprova em 3,99:1 | R-TREE-5, R-A11Y-5 |

Se a seção de skills da página de build (baseline 5.912 px, §12.1) seguir a
mesma proporção, a hipótese de "≈ 2.100 px" do PRD é conservadora: com abas o
número medido aqui é **840 px por seção de tree única**.

### Trade-offs explícitos

- **E vale a pena?** Contra **D** (sem trilho nenhum) E não custa nada: mesma
  largura, mesma altura, e o nível fica visível. Contra **C** (trilho fino no
  fluxo) E ganha 8 px de nó e 72 px de altura por tree. O único custo de E é
  arquitetural: o trilho sai do fluxo e depende de JS para copiar as alturas
  quando a fileira cresce. **Se essa dependência for indesejada, C é a
  alternativa sem JS** — a preço de 216 px em três trees e de "Raise Skeletal
  Mage" em três linhas.
- **Abas cortam contexto.** Duas trees somem da tela. Mitigado pelo contador por
  aba. Quem quiser as três de uma vez tem 1.960 px em vez de 840 px.
- **A moldura mais clara muda o visual.** Passar de `--border` para
  `--ink-subtle` deixa 30 molduras por página bem mais visíveis. É o preço dos
  3:1. Se o proprietário achar ruidoso, a alternativa é aceitar que a moldura
  seja decorativa e que o nome carregue a identificação — mas então R-TREE-5
  precisa dizer isso, em vez de exigir 3:1.
- **Conectores ortogonais afastam-se de produção.** Leem melhor a 320 px e
  pior a fidelidade com o desenho atual. É preferência, não medição.
- **O protótipo não prova o caminho sem JS.** R-TREE-16 continua sendo trabalho
  da Fase 4.

---

## 10. O que ainda depende do proprietário — perguntas para Q2

Estas são de percepção ou de gosto; nenhuma medição as decide.

1. **Em telefone real, à distância normal de uso, você lê os dez nomes da
   Summoning sem zoom?** O nome está a 11 px em nó de 88 px (captura `02`). Se
   não, 12 px custa +84 px por tree e é a troca a fazer.
2. **Você acha Blizzard e o caminho de pré-requisito até ela em ≤ 5 s, sem
   tocar?** Captura `07` (Cold Spells inteira, conectores ortogonais).
3. **Toca dez nós consecutivos sem errar o alvo?** O headless acertou 40/40; o
   polegar é outro instrumento.
4. **O trilho de nível encostado na borda esquerda incomoda?** (variante E, a
   320 px o número fica de 0 a 20 px.) Se incomodar, C é a alternativa e custa
   72 px de altura por tree.
5. **Conectores retos ou ortogonais?** Compare `02` (retos) com `07`
   (ortogonais).
6. **A moldura mais clara (`--ink-subtle`, exigida pelos 3:1) parece ruidosa?**
   Se sim, precisamos decidir se a moldura é informação ou decoração — e
   R-TREE-5 muda conforme a resposta.
7. **A legenda de 116 px por tree vale o espaço, ou vira `<details>` fechado?**
   Em três trees empilhadas são 348 px.
8. **Abas abaixo de 640 px, e três empilhadas de 640 px para cima — confirma?**
   (Isto é Q3; a medição sustenta: a 640 px as três somam 1.827 px, tolerável.)
9. **Você prefere isto à lista de hoje?** Pergunta literal de §10 da revisão.

Enquanto essas nove não forem respondidas em aparelho real, **Q2 continua
aberta**. Este documento é evidência e recomendação, não decisão.

*As respostas 4, 5, 7 e a parte de corpo de texto da 1 foram dadas pelo
proprietário e viraram a variante F (§11). As demais — inclusive a 3, toque
com polegar real — continuam abertas.*

---

## 11. Variante F — a resposta ao feedback sobre E

A direção de E foi aprovada. O proprietário apontou seis ajustes e um
bloqueante. **A variante F é E mais esses sete pontos, e nada além disso.**
E continua no protótipo, intacta e selecionável (`?v=e`), porque a decisão é
uma comparação lado a lado.

### 11.1 O que mudou, item a item do feedback

| Feedback | O que F faz | Medido |
|---|---|---|
| **Conectores ortogonais** | padrão de F (`conn=ortho`). O roteador ganhou dois casos que não existiam: **mesma fileira** liga borda a borda (antes descia até o meio e voltava, atravessando o corpo dos dois nós) e **mesma coluna** liga fundo a topo em linha reta | 8 arestas na Cold, 9 na Summoning, em todas as larguras |
| **Contraste da moldura fica** | `--ink-subtle` (3,99:1) preservado, sem alteração | inalterado |
| **Abas < 640 px, empilhadas ≥ 640 px** | `mode=auto` é o padrão de F: a decisão passa a ser por medição de largura, não por parâmetro, e a passagem por 640 px remonta a seção | abas a 320 e 390; empilhadas a 640 |
| **Fonte normal 12 px** | `--name-fs: .75rem` | nó cresce de 60 para **74 px** de piso; grade de 400 para **484 px** |
| **Trilho com um pequeno inset** | continua na calha, fora do fluxo, mas recuado: `left: calc(-1*--pad-x + 4px)`, largura `--pad-x − 6px` | E: x = **0 … 20**. F: x = **4 … 18**, com 2 px de respiro antes da grade (x = 20). **Não** migrou para C |
| **Uma legenda compartilhada** | uma só por seção, num `<details>` cujo resumo já mostra os quatro quadradinhos; abre no primeiro carregamento e **fecha sozinha na primeira seleção confirmada** | 320 px: **116 → 34 px**. 640 px empilhadas: **3 × 78 = 234 → 34 px** |
| **Nomes partidos a 200% (bloqueante)** | degrau de glifo acima de um limiar de escala de texto; nome completo vai para a faixa de nome, o `aria-label`, o `title` e o painel | **2 e 6 palavras partidas → 0**; §11.4 |

Duas peças novas que o feedback pediu de forma indireta:

- **Faixa de nome** (`.namebar`), acima da grade, altura mínima fixa: mostra o
  nome completo, o nível, o estado e os pontos do nó **em foco ou selecionado**.
  É `aria-hidden` de propósito — o leitor de tela já recebe tudo isso no
  `aria-label` do nó, e escrever aqui a cada movimento de seta violaria
  "`aria-live` só na seleção confirmada" (R-TREE-14, medido: a região live não
  muda com quatro setas; muda no Enter).
  Custo: **28 px** a 100%, 42 px a 150%, 56–72 px a 200%.
- O movimento por setas atualiza a faixa **explicitamente**, sem depender do
  evento `focus` — num navegador sem foco de janela `.focus()` move o
  `activeElement` mas não dispara `focus`, e a medição ficaria cega.

### 11.2 Tabela E × F — 320 px, uma tree por aba, pt-BR

Legenda no estado estável (fechada) em F; em E a legenda é a mesma de sempre.
Onde há dois números, são **Sorceress Cold / Necromancer Summoning**.

| | E · 100% | **F · 100%** | E · 150% | **F · 150%** | E · 200% | **F · 200%** |
|---|---|---|---|---|---|---|
| Nó (menor) | 88 × 60 | **88 × 74** | 88 × 70,6 | **88 × 74,2** | 88 × 83,8 | **74,7 × 72** |
| Nó (maior altura) | 60 / 60 | 74 / 74,2 | 71,6 / 91,4 | 75,2 / 96,8 | 116,2 / **142,6** | **72 / 72** |
| Grade 3×6 | 400 / 400 | 484 / 484,2 | 467,6 / 488,4 | 489,1 / 511,7 | 599,1 / 678,3 | **472 / 472** |
| Seção inteira | 791,5 / 839,5 | 829,5 / 877,7 | 1.072,8 / 1.120,5 | **1.029,8 / 1.079,4** | 1.576 / 1.731,1 | **1.416,3 / 1.517,6** |
| **Palavras partidas** | 0 | 0 | 0 | 0 | **2 / 6** | **0 / 0** |
| **Fragmentos de 1–2 letras** | 0 | 0 | 0 | 0 | **2 / 6** | **0 / 0** |
| Corpo do nome | 11 px | **12 px** | 16,5 px | 18 px | 22 px | 24 px (fora da caixa) |
| Nome desenhado no nó | sim | sim | sim | sim | sim, **partido** | **não** — faixa + painel |
| Legenda (nº × altura) | 1 × 116 | **1 × 34** | 1 × 170 | **1 × 55,5** | 1 × 305 | **1 × 93** |
| Faixa de nome | — | 28 | — | 42 | — | 72,4 |
| Trilho (x mín … máx) | 20 px, **0 … 20** | 14 px, **4 … 18** | 0 … 20 | 4 … 18 | 0 … 20 | 34 px, 4 … 38 |
| Overflow horizontal | 0 | 0 | 0 | 0 | 0 | 0 |
| Alvo de toque (mín) | 88 × 60 | 88 × 74 | 88 × 70,6 | 88 × 74,2 | 88 × 83,8 | 74,7 × 72 |
| Tab stops por tree | 1 | 1 | 1 | 1 | 1 | 1 |
| Focáveis em tree inativa | 0 | 0 | 0 | 0 | 0 | 0 |

**O que F custa e o que F compra.** A 100% F é **38 px mais alta** que E
(829,5 vs 791,5). Os três termos grandes: **+84 px** de grade pelo corpo de
12 px, **+28 px** de faixa de nome, **−82 px** de legenda; os 8 px restantes
são margem do bloco de legenda, que mudou de lugar. A partir de 150% F já é
**mais curta** que E (−43 px na Cold, −41 na Summoning), e a 200% é
**−160 px** (Cold) e **−214 px** (Summoning) — além de ser a única das duas
sem palavra partida.

**Números atualizados** — o que muda na tabela "Números que viram requisito"
de §9 se F for aprovada. Tudo o mais de §9 permanece.

| Saída | §9 (E) | **§11 (F)** | Consome |
|---|---|---|---|
| Corpo do nome | 11 px | **12 px** (`0.75rem`) | R-TREE-3 |
| Altura da fileira (piso) | 60 px | **74 px**, `minmax(74px, auto)` | R-TREE-3, R-TREE-8 |
| Largura do nó a 320 px | 88 px | **88 px** (inalterada) | R-TREE-3 |
| Alvo de toque resultante | 88 × 60 | **88 × 74** | R-A11Y-4 |
| Grade por tree | 400 px | **484 px** | R-TREE-8, §12.2 |
| Seção, uma tree, 320 px | ≤ 840 px | **≤ 878 px** (era 3.511: **−75%**) | R-TREE-8, §12.2 |
| Seção, três empilhadas, 320 px | ≤ 1.960 px | não medida em F (F usa abas < 640 px) | R-TREE-8 |
| Trilho | 20 px na calha, x = 0 … 20 | **14 px na calha, recuado 4 px, x = 4 … 18** | R-TREE-1 |
| Conectores | ortogonais | **ortogonais**, com casos de mesma fileira e mesma coluna | R-TREE-2 |
| Legenda | 116 px por tree | **uma por seção**, 34 px fechada | R-TREE-8 |
| Abas | < 640 px | **< 640 px, decidido por medição de largura** | R-TREE-8, Q3 |
| Texto ampliado | fileira `auto` | fileira `auto` **mais** degrau de glifo acima do limiar (hipótese, §11.4) | R-TREE-15, R-A11Y-7 |

### 11.3 E × F nas outras larguras

**390 px, uma tree por aba, pt-BR:**

| | E · 100% | F · 100% | E · 200% | F · 200% |
|---|---|---|---|---|
| Nó | 111,3 × 60 | 111,3 × 74 | 111,3 × 83,8 (máx 116,2) | 98 × 72 |
| Grade | 400 | 484 | 566,7 / 599,1 | 472 |
| Seção | 758,5 / 776,5 | 811,5 / 829,5 | 1.413,3 / 1.445,7 | **1.217 / 1.327,3** |
| Palavras partidas | 0 | 0 | **0** | 0 |

**640 px, três trees empilhadas, pt-BR** (a direção que o proprietário
confirmou; `mode=auto` entra em empilhadas sozinho a partir daqui):

| | E · 100% | F · 100% | E · 200% | F · 200% |
|---|---|---|---|---|
| Nó | 186,7 × 60 | 186,7 × 74 | 186,7 × 60 (máx 83,8 / 89,8) | 186,7 × 74 (máx 88,6 / 94,6) |
| Grade por tree | 400 | 484 | 417 / 473,1 | 484 / 525,2 |
| **Legendas** | **3 × 78 = 234** | **1 × 34** | **3 × 180 = 540** | **1 × 44** |
| Seção (três trees) | 1.827,5 | 1.963,5 | 2.439,9 / 2.536 | **2.342,2 / 2.410** |
| Tab stops | 3 (um por tree) | 3 | 3 | 3 |

A 640 px o degrau de glifo **não** dispara a 200% (a largura por corpo de texto
é 20em, bem acima do limiar), e nada parte: o nó tem 177 px internos e a
palavra mais larga do corpo mede 125,7 px.

Honestidade sobre o balanço a 640 px: **F é mais alta que E a 100% e a 150%**
(+136 px e +54 px), porque o corpo de 12 px paga três grades em vez de uma e a
legenda única só devolve 200 px. F só passa à frente a 200% (−98 px na Cold,
−126 px na Summoning). Nas larguras de celular, que são as que motivaram a
fase, F ganha a partir de 150%.

### 11.4 Texto ampliado a 200% — três estratégias medidas

Primeiro, a distinção que o requisito confunde e que esta medição separa:

| | O que é | O que muda | Como foi simulado | Critério |
|---|---|---|---|---|
| **Zoom de página** | 400% de zoom em 1.280 px | a **largura CSS** do viewport cai para 320 px; o corpo do texto continua 16 px | `Emulation.setDeviceMetricsOverride` / redimensionamento | WCAG 1.4.10 (Reflow) |
| **Texto ampliado** | corpo padrão do navegador/SO a 200% | o **corpo da raiz** vai a 32 px; a largura não muda | `window.__setTextScale(200)` | WCAG 1.4.4 |

São coisas diferentes. **Zoom de página passa em tudo**: 320 px CSS efetivos
(= 400% em 1.280) e 640 px CSS efetivos (= 200% em 1.280) foram medidos nas
duas variantes, nos dois idiomas, nas duas árvores, e o overflow horizontal é
**0 px** em todas as 72 combinações. É o texto ampliado que quebra o nome — e
era ele que a captura `10` mostrava.

**Por que o nome quebra.** O nó é dimensionado em px (a grade é px), mas o nome
escala com a raiz. A 320 px a largura interna do nó é **78 px**, fixa. A
palavra mais larga do corpo cresce:

| Escala do texto | Palavra mais larga (Cold / Summoning) | Cabe em 78 px? | Palavras partidas |
|---|---|---|---|
| 100% | 46,2 / 50,1 px | sim | 0 |
| 125% | 57,7 / 62,6 px | sim | 0 |
| 150% | 69,3 / 75,2 px | sim (folga 2,8 px) | 0 |
| **175%** | **80,5 / 87,7 px** | **não** | 2 / 5 |
| **200%** | **92,3 / 100,2 px** | **não** | 3 / 6 |

O ponto de ruptura a 320 px está entre **150% e 175%**. Não é opinião: a
coluna "cabe" e a coluna "palavras partidas" concordam em todas as linhas.

**As três estratégias, a 200% de texto, 320 px, pt-BR** (Cold / Summoning):

| | **A** — nome a 12 px, fileira elástica | **B** — nó por sigilo, nome no painel | **Controle** — corpo travado em 15 px |
|---|---|---|---|
| Parâmetro | `big=grow` | `big=glyph` (padrão de F) | `big=cap` |
| Nó | 88 × 88,6 (máx **117,4 / 152,2**) | **74,7 × 72** (uniforme) | 88 × 74 (máx 74 / 91) |
| Grade | 647,2 / 739,5 | **472 / 472** | 484 / 501 |
| Seção | 1.492,4 / 1.660,8 | **1.416,3 / 1.517,6** | 1.312,9 / 1.405,9 |
| Overflow horizontal | 0 | 0 | 0 |
| Nome cortado na caixa | 0 | 0 | 0 |
| **Palavras partidas** | **3 / 6** | **0** | 0 |
| **Fragmentos de 1–2 letras** | **3 / 6** | **0** | 0 |
| Exemplos | `Blizzard [7/1]`, `Chilling [7/1]`, `Mastery [5/2]`, `Skeleton [6/2]` | — | — |
| Nome visível no nó | sim, **partido** | não (faixa + `aria-label` + `title` + painel) | sim |
| Texto chega a 200%? | sim | sim | **não — para em 125%** |

**A é reprovada.** Ela é exatamente o que a captura `10` mostra, um degrau
pior: com o corpo a 12 px em vez de 11 px, a Cold passa de 2 para **3**
palavras partidas e a Summoning fica nas mesmas **6**, com fragmentos de uma e
duas letras (`Blizzar/d`, `Skeleto/n`, `Master/y`). Nenhum corte de caixa,
nenhum overflow — e ainda assim ilegível. E custa a fileira mais alta das
três: até **152,2 px** num nó de 88 px de largura.

**O controle é reprovado por princípio, não por número.** Travar o corpo em
15 px produz a seção mais curta e zero quebras, mas impede o texto de chegar
aos 200% que a WCAG 1.4.4 exige. Está no protótipo (`big=cap`) só para dizer,
com número, o que se ganharia — e que não vale.

**Recomendação: B.** É a única que resolve o bloqueante sem regressão de
acessibilidade, e ainda é 76 px (Cold) e 143 px (Summoning) mais curta que A.
O que ela custa, dito sem enfeite: **acima do limiar o nome não está desenhado
no nó.** Quem usa texto a 200% precisa focar ou tocar cada nó para lê-lo. Em
troca, a árvore inteira da Summoning cabe numa tela de 320 px (captura `16`,
contra três telas em `15`), a posição espacial e os conectores continuam
inteiros, e o nome nunca sai do `aria-label`, do `title`, da faixa de nome nem
do painel (captura `19`).

**O limiar e o que ele custa.** O degrau consulta "quantos corpos de texto
cabem na largura da tela" (largura ÷ corpo da raiz), com limiar em **13em**:

| | 100% | 150% | 175% | 200% | Degrau a 200% |
|---|---|---|---|---|---|
| 320 px | 20,0em | 13,33em | 11,43em | 10,0em | glifo (nome não caberia: 100,2 px em 78) |
| 375 px | 23,44em | 15,63em | 13,39em | 11,72em | glifo (nome não caberia: 100,2 px em 96) |
| 390 px | 24,38em | 16,25em | 13,93em | 12,19em | glifo — **e aqui é conservador** |
| 640 px | 40,0em | 26,67em | 22,86em | 20,0em | nomes |

A 390 px e 200% o nome ainda **caberia**: 100,2 px numa caixa de 101 px. É
uma folga de **0,8 px** — uma fonte diferente, um renderizador diferente ou
uma letra a mais e ela some. A 375 px, largura de aparelho corrente, a mesma
conta **falha** (100,2 px em 96). O limiar de 13em cobre 375 px ao preço de
esconder o nome a 390 px onde ele passaria raspando. **Isso é uma escolha, e
é ajustável**: 11,5em manteria o nome a 390 px e continuaria protegendo 375 px,
com 1 px de margem. Não recomendo, mas o número está aqui.

**Sobre o mecanismo — e este é o ponto que não deve virar contrato.** O
protótipo decide o degrau em **JavaScript** (`applyTier`), e isso é uma
limitação da bancada, não uma proposta. Dentro de uma `@media`, `em` vale o
corpo **padrão do navegador** — que é justamente o que muda quando o usuário
aumenta o texto no Android, no iOS ou no Chrome, e por isso
`@media (max-width:13em)` seria o mecanismo certo num aparelho real. Só que a
simulação de texto ampliado usada aqui (`html{font-size:32px}`) **por
definição não move a media query**, e sem JS a medição ficaria cega. O
protótipo consulta as duas coisas: a media query de verdade **e** a razão
largura ÷ corpo da raiz. Numa implementação, `@media` ou uma container query
em `em` fazem o mesmo sem JS. **O limiar, a unidade e a forma de consultar são
hipóteses do protótipo; a Fase 4 escolhe.**

### 11.5 Matriz de validação

Malha completa: **320×640 · 390×844 · 640×900** × **texto 100 / 150 / 200%** ×
**E e F** × **en-US e pt-BR** × **Sorceress Cold e Necromancer Summoning** =
**72 combinações**, mais 6 de estratégia de texto ampliado (§11.4) e 40 de
ajuste de limiar (4 larguras × 5 escalas × 2 árvores).

| Verificação | Como foi medida | E | **F** |
|---|---|---|---|
| Overflow horizontal | `scrollWidth − clientWidth`, mais varredura de todo elemento que ultrapassa a viewport | 0 px, 0 culpados | **0 px, 0 culpados** |
| Nome cortado na caixa | `scrollHeight` do botão contra `clientHeight` | 0 | **0** |
| **Palavra partida** | `Range.getClientRects()` por palavra | 0 a 100/150%; **2 e 6 a 200%** | **0 em todas as 36** |
| **Fragmento de 1–2 letras** | contagem de caracteres por linha, `Range` por caractere | 0; **2 e 6 a 200%** | **0 em todas as 36** |
| Alcançabilidade (algoritmo) | BFS sobre o grafo, setas + Home/End, nas três trees da classe | 100% nas 36 linhas | **100% nas 36 linhas** |
| Alcançabilidade (DOM real) | BFS disparando eventos de teclado de verdade nos botões | ver §6 (medido na passagem de E) | **10/10 nos dois trees, a 100% e a 200% de texto** |
| Tab stops por tree visível | `[tabindex="0"]` dentro de `.tree:not([hidden])` | 1 (3 em empilhadas, um por tree) | **1 (3 em empilhadas)** |
| Focáveis em tree inativa | `checkVisibility()` em `button`/`a` dentro de `.tree[hidden]` | 0 | **0** |
| Foco visível | `:focus-visible` → anel de 2 px `--ember` com offset | presente | **presente, inalterado** |
| Conectores legíveis | arestas desenhadas e `viewBox` do SVG | 8 (Cold) / 9 (Summoning) | **8 / 9 em todas as larguras e escalas** |
| Alvo de toque ≥ 44 px nos dois eixos | menor retângulo de nó e de aba | nó ≥ 88 × 60; abas ≥ 44 de altura | **nó ≥ 74,7 × 72; abas ≥ 44 (66,3 a 200%)** |
| `aria-label` com o nome completo | prefixo do rótulo == texto do nome, **e** `title` == nome | sim, 100% | **sim, 100% — inclusive em modo glifo** |
| `role=grid` válido | `gridcell` por fileira, célula vazia nomeada, sem `aria-hidden` | 6 fileiras × **3** células; 8 vazias nomeadas; 0 `aria-hidden` | **idem** |
| `aria-live` só na seleção | texto da região antes/depois de quatro setas, e depois de Enter | não muda com setas; muda no Enter | **idem** |
| Sheet | `role`, `aria-modal`, trava de scroll, retorno de foco | dialog / true / `position:fixed` / volta ao gatilho | **idem** |
| Redução de movimento | `transitionDuration` computado | 0,15 s → **0 s** | **idem** |
| Hover só com `(hover: hover)` | `matchMedia` sob emulação de toque | `false`, handler não registrado | **idem** |
| Zoom de página 200% (= 640 px CSS) | viewport de 640 px | grade 3×6, 0 overflow | **grade 3×6, 0 overflow, três trees empilhadas** |
| Zoom de página 400% (= 320 px CSS) | viewport de 320 px | grade 3×6, 0 overflow | **grade 3×6, 0 overflow** |
| Trilho longe da borda | retângulo do trilho | x = **0 … 20** | **x = 4 … 18** |
| Legenda | número de instâncias × altura | 1 × 116 (abas) · **3 × 78** (empilhadas) | **1 × 34 nas duas** |

**O que falhou:** nada em F, nas 72 combinações. **O que falhou em E:** o
único item, e é o bloqueante — palavras partidas a 200% de texto (2 na Cold, 6
na Summoning, com fragmentos de uma e duas letras). Tudo o mais que E passava,
F passa.

Dois falsos positivos foram corrigidos na própria instrumentação, e é justo
registrá-los porque teriam virado número errado no relatório:

1. **Conectores contados como 0.** As arestas são desenhadas dentro de um
   `requestAnimationFrame`; medir logo depois de remontar a seção contava zero.
   `__measure()` agora força o redesenho antes de contar.
2. **Nome "cortado na horizontal" em modo glifo.** O nome fora da caixa é
   `position:absolute` com 1 px, então `scrollWidth > clientWidth` sempre.
   Os dez nós apareciam como cortados. A métrica passou a ignorar o nome fora
   da caixa e a contá-lo à parte (`names.off`).

### 11.6 O que continua sendo hipótese — e não deve virar contrato

Nada em §11 é mecanismo obrigatório. Em particular:

- **O limiar de 13em, a unidade `em` e a consulta em JS.** São do protótipo.
  A grandeza medida ("quantos corpos de texto cabem na largura") é o que
  importa; media query, container query ou medição em JS são caminhos, e a
  Fase 4 escolhe com R-TREE-16 (sem JS) na mão. **O protótipo não é evidência
  sobre o caminho sem JS** — ele monta a grade em JavaScript, e isso não mudou.
- **Esconder o nome acima do limiar.** É a estratégia recomendada, medida
  contra duas alternativas. Não é a única possível: um nó mais largo com duas
  colunas em vez de três, um nome abreviado com `title`, ou um zoom próprio da
  árvore não foram construídos.
- **A faixa de nome.** É uma peça nova, não pedida por nenhum requisito. Ela
  resolve "foco ou seleção mostra o nome completo" a um custo de 28 px, mas o
  desenho (posição acima da grade, `aria-hidden`, conteúdo) é proposta.
- **O fechamento automático da legenda na primeira seleção.** É uma heurística
  de "primeiro contato", não um padrão conhecido. Pode irritar.
- **`--pad-x` crescendo com o texto em modo glifo** (20 → 40 px a 200%) para o
  trilho continuar cabendo. Afasta a calha do `Container` de produção, que é
  fixa em `px-5`. É solução de protótipo.
- **O roteador ortogonal.** F acrescentou os casos de mesma fileira e mesma
  coluna. Isso vale também para E quando `conn=ortho` é escolhido — a captura
  `07` foi feita com o roteador antigo e mostra o traçado anterior.

### 11.7 Pendências para o proprietário — Q2

Estas continuam abertas depois de F.

1. **Toque com polegar real — PENDENTE, e a medição headless não substitui.**
   O protótipo mediu geometria: nó de 88 × 74 px a 100% e 74,7 × 72 px a 200%,
   ambos acima de 44 px nos dois eixos. **Isso não é um teste de toque.**
   Ninguém tocou nesta árvore com um polegar. Os 40/40 acertos do relatório de
   E foram cliques sintéticos no centro e nos cantos de cada nó — provam que o
   alvo existe onde se pensa que existe, não que o polegar o acerta. **Q2
   continua bloqueada por isto.** O critério da revisão — "toca 10 nós
   consecutivos sem erro de alvo" — segue **não verificado**.
2. **A 200% de texto, você aceita perder o nome no nó?** É o coração da
   estratégia B. Compare `15` (E: nomes presentes e partidos) com `16` (F:
   sigilo, sem nome) e `19` (o nome completo no sheet). Se a resposta for não,
   a alternativa medida é A — e A tem 3 e 6 palavras partidas.
3. **O nó de 12 px vale 84 px de grade por tree?** F é 38 px mais alta que E a
   100%. A 150% e acima F já é mais curta. Compare `13` com `14`.
4. **O trilho recuado (x = 4 … 18) resolveu?** Em tela curva, 4 px pode ainda
   ser pouco. O inset é um número num só lugar.
5. **Legenda fechada depois do primeiro contato — bom ou irritante?** Fechada
   ela custa 34 px; aberta, 128 px.
6. **A 390 px e 200%, você prefere o nome raspando por 0,8 px ou o sigilo?**
   É a única largura onde o limiar de 13em é conservador (§11.4).
7. **Encontra Blizzard e o caminho até ela em ≤ 5 s?** Captura `20`, agora com
   o roteador ortogonal corrigido e o caminho em ember.
8. **Prefere isto à lista de hoje?** A pergunta literal da revisão, ainda sem
   resposta em aparelho real.

**Q2 continua aberta.** F fecha o bloqueante que E tinha e responde os seis
ajustes; não substitui o telefone.
