# Protótipo da árvore de skills no celular — Fase 0B.1

**Status:** evidência para **Q2**. Não é aprovação, não é implementação.
**Data:** 2026-09-08 · **Escopo:** R-TREE-0 (PRD vNext §8.2) e §10 da revisão de 2026-09-08.

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
└── screenshots/    12 capturas, geradas pelo mesmo driver que mediu
```

Abra `index.html` no navegador — funciona por `file://`, sem servidor e sem
rede. A barra **Protótipo — controles**, no topo, troca variante, idioma,
classe, layout, conectores, pontos, "meu nível", disposição do nó, altura de
fileira, política das setas e redução de movimento. Cada escolha entra na URL,
então qualquer estado é compartilhável.

Parâmetros úteis (todos opcionais):

| Parâmetro | Valores | O que faz |
|---|---|---|
| `v` | `a` `b` `c` `d` `e` | variante de trilho de nível (§3) |
| `lang` | `pt-br` `en-us` | idioma da interface |
| `class` | `sorceress` `necromancer` | classe |
| `tree` | slug da tree | tree ativa em modo abas |
| `mode` | `tabs` `stacked` | uma tree por vez, ou as três empilhadas |
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
`index.html?v=e&lang=pt-br&class=necromancer&tree=summoning&mode=tabs&points=1`

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
