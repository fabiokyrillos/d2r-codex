# Plano da Fase 4 — Árvore estrutural

**Data:** 2026-09-11 · **Baseline:** `436dc88` (= `origin/main`, worktree limpo) · **PRD:** [`../PRD-vNext.md`](../PRD-vNext.md) §8 (R-TREE-1…17), §6.4 (R-PREF-3/4), §11, §12.2, §14 Fase 4
**Protótipo aprovado:** [`../prototypes/mobile-skill-tree/`](../prototypes/mobile-skill-tree/README.md), variante F (§11) · **Teto de HTML:** [`../spikes/2026-09-08-skill-icon-assets.md`](../spikes/2026-09-08-skill-icon-assets.md) §11.5
**Escopo:** R-TREE-1…17 com os números da variante F; R-TREE-9 (`d2rc.level`) por decisão D1; a metade "classe e build" de R-TREE-10 por decisão D2; sigilo atual como placeholder declarado.
**Fora:** ícones por skill (Fase 5); árvore por etapa no leveling (metade adiada de R-TREE-10, iniciativa P3.6/Fase 7); filtros da Fase 3; sticky bar do leveling; backend, analytics, contas, compartilhamento.

> **Para agentes:** três frentes paralelas com propriedade de arquivos disjunta (§10), num único worktree, sob um coordenador que integra, faz todos os commits, corre `typecheck`/`lint`/`build` e os gates de navegador. Os contratos de §5 são fixos antes de qualquer edição e ficam em código no commit 1 (tipos, stubs tipados, chaves de dicionário). RED → GREEN em todo contrato; mutations reais em §12. **Nenhum agente faz commit, build ou `git checkout`.** A fase **para** no portão de UAT físico (§15): sem push, sem deploy.

---

## 1. Resumo executivo

Hoje a árvore vira uma lista de uma coluna abaixo de 640 px, esconde os conectores, mantém as
células vazias `aria-hidden` em toda largura (o `role=grid` é inválido no desktop também — 30
`gridcell` na árvore de acessibilidade em vez de 54), e as setas saltam de fileira e coluna
(D7, D8). A Fase 4 entrega a árvore que o protótipo F mediu: **grade 3×6 em todas as larguras a
partir de 320 px**, nó de 88 × 74 px com nome a 12 px, fileira elástica com piso, trilho de nível
recuado na calha, **conectores ortogonais exatos** desenhados na própria grade CSS, **uma árvore
por aba abaixo de 640 px** e três empilhadas a partir daí, **uma legenda por seção**, quatro
estados (bloqueada / disponível / investida / maximizada), contador de pontos no nó, painel ou
sheet com pré-requisitos, desbloqueios e sinergias **como links**, "Meu nível" (`d2rc.level`),
teclado espacial com fallback documentado, e o **HTML sem JavaScript com a grade, os conectores e
30 links por classe** — sem `<noscript>` paralelo.

A mudança arquitetural que paga tudo isso: a grade passa a ser **renderizada pela ilha cliente a
partir de dados compactos** (SSR pelo React, links reais no HTML servido), em vez de o servidor
pré-renderizar 30 tiles e 30 painéis como elementos React e entregá-los como props. Hoje isso custa
**~67 KB de marcação + ~100 KB de carga RSC por página de classe**; medido em `436dc88`, o pior
documento (`/pt-br/classes/sorceress`) está em **348.313 bytes — acima do alerta de 348.160 e a
20.327 bytes do teto de 368.640**. Com a árvore a partir de dados, a estimativa é **−100 a −120 KB**
por documento (§3.4), e o gate de R-TREE-17 passa a existir.

## 2. Verificação do baseline

| Invariante | Estado |
|---|---|
| branch / `HEAD` / `origin/main` | `main` / `436dc8801551fef761180af2ef421e4ce3feb280` / idêntico |
| worktree | limpo |
| produção | `https://d2r-codex.vercel.app` responde (Fase 3 concluída em `15846f3`) |
| Next.js instalado | 16.3.3 (`node_modules/next/dist/docs/` lidos: `server-and-client-boundary.md`, `preventing-flash-before-hydration.md`, `05-server-and-client-components.md`, `use-client.md`) |
| Fases 4 e 5 | não iniciadas |
| build limpo de `436dc88` | `rm -rf .next && npm run build` → `EXIT=0` (lido do log) |

## 3. O estado atual, medido (build local de `436dc88`, Chrome headless pelo driver do repositório)

### 3.1 Geometria e acessibilidade

| Página | 320 | 390 | 640 | 768 | 1024 | 1280 |
|---|---|---|---|---|---|---|
| seção `#skills`, classe Sorceress (en) | **3.511** | 3.443 | 2.173 | 2.173 | 2.127 | 2.127 |
| idem, Necromancer (pt) | **3.761** | 3.648 | 2.309 | 2.241 | 2.195 | 2.195 |
| seção `#skills`, build Blizzard (en) | 6.218 | 5.864 | 3.496 | 3.400 | 3.254 | 3.254 |
| colunas da grade (`gridTemplateColumns`) | **1** | **1** | 3 | 3 | 3 | 3 |
| altura da grade por tree | 954 | 954 | 568 | 568 | 568 | 568 |
| nó (menor) | 280 × 70,5 | 350 × 70,5 | 170,7 × 88 | 213,3 × 88 | 184 × 88 | 184 × 88 |
| SVG de conectores visível | **não** | **não** | sim | sim | sim | sim |
| `gridcell` no DOM / `aria-hidden` | 18 / **8** por tree, em toda largura |
| `gridcell` na árvore de acessibilidade (1280) | **30 de 54** — as 24 vazias nunca entram |
| nome acessível (amostra) | `Ice Bolt, level 1, Cold Spells.` |
| texto a 200 %, 320 px | 0 palavras partidas (a lista de uma coluna tem 280 px por nó) |
| `scrollWidth` a 200 % de texto | **552** em toda página — é a linha do header (Fase 2 §10.10), pré-existente |

Baselines do PRD confirmados: 3.511 px (320) e 3.443 px (390) para a seção da classe; o gate de
altura desta fase mede a **seção com uma tree ativa** contra o orçamento de **≤ 900 px a 320 px**
(R-TREE-8) — não o documento, porque o header já transborda a texto ampliado.

### 3.2 O HTML das 16 páginas de classe (bytes do arquivo, sem compressão, §1.2 do spike)

| Documento | bytes | KiB | | Documento | bytes | KiB |
|---|---|---|---|---|---|---|
| **pt-br/sorceress** | **348.313** | 340,1 | | pt-br/druid | 303.137 | 296,0 |
| en-us/sorceress | 345.014 | 336,9 | | en-us/paladin | 301.557 | 294,5 |
| pt-br/assassin | 317.948 | 310,5 | | en-us/druid | 300.926 | 293,9 |
| en-us/assassin | 314.580 | 307,2 | | pt-br/warlock | 299.428 | 292,4 |
| pt-br/amazon | 306.594 | 299,4 | | en-us/warlock | 296.357 | 289,4 |
| en-us/amazon | 304.240 | 297,1 | | pt-br/necromancer | 289.051 | 282,3 |
| pt-br/paladin | 303.796 | 296,7 | | pt-br/barbarian | 287.070 | 280,3 |
| | | | | en-us/necromancer | 285.651 | 279,0 |
| | | | | en-us/barbarian | 284.548 | 277,9 |

O spike mediu 322.576 bytes para o pior documento em `8fb88c2`; as Fases 1–3 acrescentaram
~26 KB à página de classe (sumário, chips, seletor de estágio, popover). **Teto: 368.640. Alerta:
348.160. Folga hoje: 20.327 bytes no pior caso — e o pior caso já está 153 bytes acima do alerta.**

### 3.3 O que a árvore custa hoje, por página de classe (Sorceress pt-BR)

| Parte | bytes | onde |
|---|---|---|
| marcação da seção `#skills` | **67.218** | HTML |
| — 30 tiles (`<button data-slug>`) | 32.900 | HTML |
| — 3 × `<noscript>` (lista com resumo por skill) | 15.456 | HTML |
| — 3 SVG de conectores | 4.770 | HTML |
| trechos RSC que carregam a árvore (tiles como elementos, 30 painéis, `<noscript>` serializado, arestas, strings) | ~125.000 (limite superior: os mesmos chunks carregam outros trechos da página) | `<script>` embutido |
| fator de duplicação do sigilo | **3×** (57 ocorrências do path de "spell" para 19 skills) | confirma o spike §11.3 |

### 3.4 A aritmética do orçamento

Com a grade e o painel renderizados pela ilha a partir de **dados**:

- marcação: 30 nós (~550 B: sigilo ~250, nome, nível, contador) ≈ 16,5 KB + 24 células vazias ≈ 2 KB
  + trilho ≈ 1 KB + conectores (≈ 8–9 arestas × até 3 peças SVG × ~110 B) ≈ 3 KB por tree
  + abas, legenda, painel vazio ≈ 3 KB → **≈ 30 KB** (hoje 67 KB);
- RSC: só as **props** da ilha — 30 nós × ~450 B (slug, nome, href, posição, nível, tipo, elemento,
  resumo ~200 B, pré-requisitos, desbloqueios, sinergias, pontos, papel) ≈ 13,5 KB + strings ≈ 2 KB,
  escapados em JSON ≈ **18 KB** (hoje ~100 KB). A saída SSR de um componente cliente **não** vai para
  a carga RSC (`server-and-client-boundary.md`: "the server graph … serializes the props passed to
  them"), que é o que elimina a duplicação medida pelo spike;
- o `<noscript>` deixa de existir: os 30 links passam a ser os próprios nós (R-TREE-16).

Estimativa: **pt-br/sorceress 348 KB → ≈ 230 KB.** O gate de R-TREE-17 (§9, `test:class-html-size`)
mede os 16 documentos contra 368.640 e imprime o alerta a 348.160; **a regra de parada desta fase
é: se qualquer documento medir acima do alerta depois da integração, a execução para e o número vai
ao relatório antes de qualquer outro passo.** O JS de cliente cresce pelo código da grade (uma ilha em
vez de três; medido e publicado no relatório), sem imagem raster e com sigilos por `currentColor`.

## 4. Decisões do coordenador (dentro do PRD; registradas para o relatório)

1. **A grade é renderizada pela ilha cliente a partir de dados compactos** (`SkillTreesData`, §5.1),
   e o servidor deixa de pré-renderizar tiles e painéis como elementos. Motivo: §3.3–3.4 — é a única
   forma de cumprir R-TREE-17 numa página que já está acima do alerta. O HTML servido continua sendo
   a grade completa com links (SSR do React), o que é o que R-TREE-16 pede.
2. **O nó é um `<a href>` para a página da skill, enriquecido em `role="button"` depois da
   hidratação** — o mesmo padrão que a decisão D7 da Fase 3 pôs nos chips de classe. Sem JS, tocar num
   nó abre a página da skill (a função essencial); com JS, o clique simples é interceptado e
   seleciona; Ctrl/Cmd/Shift/Alt + clique, clique do meio e "abrir em nova aba" seguem o link. O
   `<noscript>` sai: era a única cópia dos 30 links e custava ~15 KB × 2 por classe.
3. **Conectores como peças SVG colocadas na própria grade CSS** (§5.4): um `<div aria-hidden>`
   sobreposto à grade com `grid-template-rows: subgrid` recebe, por aresta, até três `<svg>` com
   `<line>` em percentagem, posicionados por `grid-row`/`grid-column`, margens negativas iguais ao
   vão e `vector-effect="non-scaling-stroke"`. A geometria sai das posições reais dos nós
   (fileira/coluna do grafo), é exata em qualquer largura e **em qualquer altura de fileira** —
   inclusive quando o texto ampliado faz uma fileira crescer —, sem uma linha de JavaScript e sem
   coordenada específica de uma árvore. Um único SVG com `viewBox="0 0 3 6"` (o de hoje) erra até
   ±3 px já a 100 % por causa dos vãos, e mais quando uma fileira cresce; um SVG que dependesse de
   medição em JS falharia R-TREE-16. `@supports not (grid-template-rows: subgrid)` cai para a mesma
   `repeat(6, minmax(var(--tree-row), auto))` da grade (exata enquanto nenhuma fileira cresce).
4. **Trilho de nível dentro da grade, na calha:** as seis células do trilho são itens do mesmo
   `<div aria-hidden>` dos conectores, em `grid-column: 1` com `margin-left: calc(-1 * (14px + 2px))`
   — 14 px de largura terminando 2 px antes da grade: x = 4…18 a 320 px, exatamente F. A altura de
   cada célula é a da fileira (é um item da fileira), então o trilho acompanha a fileira elástica sem
   `syncRail`.
5. **Abas abaixo de `sm` (40rem), empilhadas a partir daí — decidido por `matchMedia("(width < 40rem)")`,
   a mesma consulta em `rem` do `sm:` do Tailwind** (Fase 2 §10.6: consultas em `rem` acompanham o
   texto ampliado). O controle é servido como três `<a href="#<tree>">` (nav de saltos, útil sem JS e
   escondida a partir de `sm` por CSS) e enriquecido em `role="tablist"` / `role="tab"` com
   `aria-selected`, `aria-controls` e ativação automática por setas — aqui **há** painéis mutuamente
   exclusivos, que é exatamente o caso em que R-A11Y-3 admite `tab`. A partir de `sm` não há
   `tablist` nem `tabpanel`: as três trees são `<section aria-label>` como hoje.
6. **Estado antes da pintura sem script inline e sem `<noscript>`:** abaixo de `sm`, e **só com
   scripting ligado** — `@media (width < 40rem) and (scripting: enabled)` — a CSS esconde, até a ilha
   montar (`[data-trees]:not([data-trees-ready])`), toda tree que não é a padrão; quando a URL traz
   um fragmento de tree (`/classes/sorceress#lightning-spells`, a URL publicada por
   `routes.skillTree`), `:has([data-tree]:target)` esconde as outras duas em vez da padrão. Depois de
   montar, a ilha assume com o atributo `hidden` real e inicializa `activeTree` pelo fragmento
   (ouvindo `hashchange`). Sem scripting a consulta é falsa e as três trees ficam empilhadas — sem
   `<noscript><style>` (não conformante no `<body>`) e sem script inline (a lista vigiada de
   `client-boundary` continua com um único). Medido em Chrome pelo driver do repositório
   (2026-09-11): a 320 com scripts só a padrão é visível; com `#c` só a alvo; com
   `Emulation.setScriptExecutionDisabled` a consulta devolve `false` e as três são visíveis; a 800
   nada é escondido. **A árvore padrão é decidida no servidor:** na página de classe, a primeira;
   na build, a que tem mais pontos (empate → a primeira).
7. **Dois estados de seleção:** `selected` (confirmada por Enter/Espaço/clique/toque) e `preview`
   (hover com `(hover: hover)`, ou foco por seta). O painel mostra `preview ?? selected`; a região
   `aria-live` só é escrita na confirmação; sair do hover ou do foco restaura a seleção. Touch nunca
   produz `preview`. Segundo toque no nó já selecionado mantém a sheet aberta (não é toggle).
8. **Setas: estritas primeiro, fallback documentado depois** (R-TREE-13 e o brief do proprietário):
   esquerda/direita percorrem a fileira e, na borda, **continuam para a fileira vizinha** (direita →
   primeiro nó ocupado da fileira seguinte; esquerda → último da anterior); cima/baixo percorrem a
   **coluna** e, sem nó na coluna naquela direção, vão ao nó de coluna mais próxima da fileira mais
   próxima naquela direção (empate → coluna de índice menor). Casos nomeados: Ice Blast → baixo =
   **Glacial Spike** (mesma coluna, duas fileiras abaixo); Ice Blast → direita = **Shiver Armor**
   (nada à direita na fileira 2; continuação para o primeiro ocupado da fileira 3). O protótipo (§6)
   registrou que a política estrita pura devolveria "nada" aqui; o proprietário pediu o fallback
   documentado, e é isso que o teste afirma e o legenda explica.
9. **Modo glifo por capacidade real** (R-TREE-15): a ilha mede, depois de `document.fonts.ready`,
   num `ResizeObserver` da grade visível e ao trocar de tree, se **alguma palavra de algum nome
   quebra** (uma `Range` por palavra com `getClientRects()` em mais de uma linha) ou se um nome é
   cortado (`scrollWidth > clientWidth`); se sim, `data-glyph` na seção esconde os nomes. **A medição
   corre sempre num estado-sonda independente do resultado:** a ilha põe `data-measuring` na seção,
   a CSS força os nomes visíveis sob esse atributo, a leitura acontece de forma síncrona (o
   `getClientRects` força o layout, nada é pintado) e o atributo sai antes de o frame acabar. Sem
   isso o mecanismo oscila — esconder os nomes encolhe as fileiras, o observer dispara, a medição
   sobre nomes escondidos devolve zero quebras, os nomes voltam, as fileiras crescem… (revisão,
   HIGH-4). Com a sonda a função é determinística em largura e tamanho de texto, o estado só muda
   quando o resultado muda, e o observer converge. **Sem JS**, um piso em CSS — `@media (width <
   13em)` — esconde os nomes (o `em` de uma media query é o corpo padrão do navegador, que é o que o
   texto ampliado muda); o piso é **escopado a `[data-trees]:not([data-trees-ready])`**, para que, com
   JavaScript, só a medição decida e a faixa de nome exista sempre que o nome não está no nó. Os 13em
   são o número medido do protótipo, escritos uma vez em `app/globals.css` como piso de segurança e
   **não** como contrato: o gate afirma o invariante (em todo nó, ou o nome está visível no nó, ou
   `[data-glyph]` está posto e o foco revela o nome na faixa; zero palavras partidas, zero fragmentos
   ≤ 2 letras; `aria-label` e `title` com o nome), não o limiar nem o atributo.
10. **A faixa de nome só existe em modo glifo.** A 100 % o nome está no nó; a faixa custaria 28 px do
    orçamento de 900 px. O orçamento é fechado bloco a bloco em §8, com três decisões que a revisão
    (HIGH-3) obrigou a escrever: (a) o parágrafo `theme` da tree — que o protótipo **não** tinha e que
    mede até 257 caracteres (≈ 137 px a 320 na Summoning pt-BR) — fica **abaixo de `sm` num
    `<details data-tree-theme>` servido fechado** (34 px) e a partir de `sm` continua o parágrafo de
    hoje (`hidden sm:block`; só um dos dois está exposto em cada largura); (b) `treeHint` passa a
    `sr-only` (continua em `aria-describedby`; a legenda ganha a linha `legendKeyboard`, visível sob
    demanda); (c) "Meu nível" é **uma linha de 44 px** (rótulo, `input` de 3 caracteres, "Limpar"),
    com `levelHelp` em `aria-describedby` sr-only, colocada **depois da legenda, ao fim da seção** —
    ao lado da legenda que explica "bloqueada", e fora do caminho de tudo o que está acima, o que é
    também o que mantém em zero o CLS de uma chegada por `#skills` (revisão, MED-7: o controle só
    existe depois da hidratação, e inserir 44 px acima da grade dentro da viewport é um shift real).
    O controle de trees abaixo de `sm` é uma **grade de três colunas iguais** com o nome a quebrar
    dentro da aba (min-height 44 px), não uma linha que quebra em duas: "Poison and Bone Spells"
    custava 92 px como linha; medido no gate como aba.
11. **Uma ilha por seção, um painel por seção.** Hoje são três ilhas e três painéis ancorados. Uma
    seção com uma ilha dá uma sheet, uma região live, uma legenda e o painel do desktop ao lado das
    três trees (`lg:grid-cols-[minmax(0,1fr)_20rem]`), e as sinergias entre trees resolvem no mesmo
    payload.
12. **`d2rc.level` entra em `IMPLEMENTED_PREF_KEYS`** com `readLevel`/`writeLevel`/`clearLevel` em
    `lib/prefs.ts`, validação "inteiro entre 1 e 99", leitura protegida que nunca apaga, e um único
    escritor (`components/game/skill-level-control.tsx`, allowlist em `test:hygiene`). Sincronização:
    `writeLevel`/`clearLevel` despacham `d2rc:level` em `window`; a ilha ouve esse evento e `storage`.
    Nenhuma chave nova; nada muda em filtros, conteúdo ou alocações.
13. **O papel editorial fica no painel; o nome acessível anuncia o estado visual.** As oito
    classificações atuais (`maxed`, `invested`, `one-point`, `prerequisite`, `synergy`, `utility`,
    `flex`, `unused`) continuam a existir como `role`/rótulo no painel e no nome acessível **só como
    pontos** — o estado anunciado é um dos quatro: bloqueada / disponível / investida / maximizada
    (R-TREE-14: "nome, nível, tree, estado, pontos"). "Bloqueada" vence sobre "investida" quando
    `d2rc.level` está abaixo do nível da skill; o contador continua a mostrar os pontos. **Mudança
    de produto consciente, registrada (revisão, MED-6):** hoje uma alocação `flex` tem moldura
    própria e o nome acessível diz "optional"; com os quatro estados de R-TREE-5, Resist Lightning
    do Hammerdin (flex, 20 pontos) passa a ler "maximizada" no nó. Para que "opcional" não deixe de
    ser distinguível por forma, a pílula do contador de uma alocação `flex` é **tracejada**
    (`data-role="flex"`), a legenda ganha a linha `legendOptional`, e o papel continua no painel e na
    tabela "Pontos restantes". O cabeçalho da seção continua a somar só os obrigatórios
    (`legendMandatory`) mais "e N opcionais" (`legendFlex`), e o contador por tree soma todos os
    pontos-base — os dois números são publicados lado a lado, como hoje.
14. **O cartão "Como ler esta árvore" da página de build vira a legenda única da seção** (um
    `<details>` servido fechado, com os quatro estados no `<summary>`); o total "N de M pontos duros
    obrigatórios" sobe para o cabeçalho da seção como manda R-TREE-6. O `<h3>` com o texto
    `skills.legendTitle` continua a existir dentro do `<summary>` para que `heading-snapshot.json` não
    mude.
15. **O caminho de pré-requisito inteiro acende, não só as arestas adjacentes** (revisão, LOW-11;
    PRD R-TREE-11 "o caminho de pré-requisito acende"): `relatedEdges(slug, edges)` em
    `lib/skill-tree-geometry.ts` devolve o fecho de ancestrais (toda aresta num caminho de uma raiz
    até o nó mostrado), e é isso que recebe `data-related`. É o que responde ao aceite "encontra
    Blizzard e o caminho até ela em ≤ 5 s".
16. **`aria-expanded="true"` acompanha a seleção confirmada**, nunca a prévia (revisão, LOW-5): o
    atributo diz "os detalhes desta skill são os que estão no painel por escolha do leitor"; a prévia
    de hover ou foco não muda nenhum atributo ARIA.
17. **O que o leitor sem JavaScript perde, dito (revisão, LOW-9):** o `<noscript>` de hoje trazia o
    resumo de cada skill e a nota editorial da build; a grade servida traz nome, nível, estado, pontos
    e o link para a página da skill, onde o resumo está. R-TREE-16 sanciona ("apenas seleção, painel
    … dependem de JS"); R-A11Y-12 pede que fique registrado. Vai ao relatório.

## 5. Contratos compartilhados (fixos antes das edições; em código no commit 1)

### 5.1 Dados — `lib/skill-tree-data.ts` (servidor; importa registro e grafo; **nunca** importado por ilha)

```ts
import type { AllocationRole, Element, SkillKind } from "@/lib/types";

export type NodeState = "locked" | "available" | "invested" | "maxed";

export interface TreeNodeData {
  slug: string; name: string; href: string;          // href já com locale: routes(locale).skill(cls, slug)
  row: 1 | 2 | 3 | 4 | 5 | 6; column: 1 | 2 | 3; level: number;
  kind: SkillKind; element?: Element;
  summary: string;                                     // skill.summary, renderizado pela ilha via RichText
  points: number; maxLevel: number;                    // pontos-base; 0 fora de build
  pointsLabel: string;                                 // "20 points" / "não usada" — já formatado (formatPoints)
  role?: AllocationRole; roleLabel?: string; note?: string;
  prerequisites: string[]; unlocks: string[];          // slugs, na ordem do grafo
  synergiesIn: { slug: string; kinds: string; bonus?: string }[];  // kinds já rotulado (synergyKinds)
  synergiesOut: { slug: string; kinds: string }[];
  missileIn: { slug: string; label: string }[];        // missileSynergies do nó, rotulados por missileSynergyLine (Meteor, FoH, Immolation Arrow)
  missileOut: { slug: string; label: string }[];       // missileSynergyReceivers — o painel lista os dois sob os mesmos títulos, com o rótulo
}
export interface TreeData {
  slug: string; name: string; theme: string;
  points: number; maxPoints: number;                   // soma dos pontos-base; 10 × maxLevel
  pointsLabel: string;                                 // "47 de 200 pontos nesta árvore" (só em build; "" fora)
  rows: { level: number; cells: (TreeNodeData | null)[] }[];   // sempre 6 fileiras × 3 células
  edges: { from: string; to: string }[];               // pré-requisito → dependente, ambos desta tree
}
export interface SkillTreesData {
  classSlug: string; locale: string;
  trees: TreeData[];                                   // na ordem de `cls.trees`
  defaultTree: string;                                 // decisão 6
  inBuild: boolean;
  totalLabel?: string;                                 // "88 de 110 pontos duros obrigatórios" (build)
  strings: SkillTreesStrings;                          // §5.6
}
export function buildSkillTreesData(locale: Locale, classSlug: Slug, t: Dictionary, allocations?: readonly SkillAllocation[]): SkillTreesData;
export function nodeState(node: Pick<TreeNodeData, "points" | "maxLevel" | "level">, level: number | null): NodeState;  // puro, client-safe também (re-exportado de lib/skill-tree-state.ts)
export function nodeAriaLabel(node: Pick<TreeNodeData,"name"|"level"|"pointsLabel">, tree: string, state: NodeState, strings: Pick<SkillTreesStrings,"ariaNode"|"ariaNodeBuild"|"stateLocked"|"stateAvailable"|"stateInvested"|"stateMaxed">, inBuild: boolean): string;
```

`nodeState`: `level !== null && node.level > level` → `locked`; senão `points >= maxLevel` → `maxed`;
`points > 0` → `invested`; senão `available`. `nodeAriaLabel`: `"{skill}, level {level}, {tree}, {state}."`
fora de build e `"{skill}, level {level}, {tree}, {state}, {points}."` em build, com `{points}` já
formatado ("20 points" / "not used"). Sem placeholder por preencher, sem palavra repetida.

### 5.2 Navegação — `lib/skill-tree-nav.ts` (client-safe, sem dependências)

Assinaturas mantidas (`Cell`, `Grid`, `COLUMNS`, `at`, `firstCell`, `nextHorizontal`,
`nextVertical`, `edgeCell`), semântica da decisão 8, mais:

```ts
export function reachableByArrows(grid: Grid): { reachable: number; total: number; unreachable: Cell[] };  // BFS a partir de firstCell só com as quatro setas
```

### 5.3 Estado de interação — `lib/skill-tree-state.ts` (client-safe, puro)

```ts
export interface TreeUiState { activeTree: string; selected: string | null; preview: string | null; sheetOpen: boolean; announce: string | null }
export type TreeEvent =
  | { type: "hover-in"; slug: string } | { type: "hover-out" }
  | { type: "focus"; slug: string } | { type: "blur" }
  | { type: "activate"; slug: string; name: string; state: NodeState }   // Enter/Espaço/clique/toque
  | { type: "escape" } | { type: "close" } | { type: "switch-tree"; tree: string };
export interface TreeUiContext { hoverCapable: boolean; wide: boolean /* ≥ lg: painel ancorado */ }
export function reduce(state: TreeUiState, event: TreeEvent, ctx: TreeUiContext): TreeUiState;
export function shownSlug(state: TreeUiState): string | null;   // preview ?? selected
export { nodeState } from "./skill-tree-data-pure";               // ver nota
```

Regras: `hover-in` só altera `preview` e só com `hoverCapable`; `hover-out`/`blur` limpam `preview`;
`focus` põe `preview`; `activate` põe `selected`, limpa `preview`, abre a sheet se `!wide`, escreve
`announce` ("{name} selected. {state}."); `activate` no já selecionado não fecha nada; `escape` e
`close` limpam `selected` e fecham a sheet e **não** limpam `activeTree`; `switch-tree` só muda
`activeTree`. `announce` é consumido pela ilha (escrito na região live e zerado).

> `nodeState` e `nodeAriaLabel` são puros e client-safe; vivem em `lib/skill-tree-data-pure.ts`
> (sem imports) e são re-exportados por `lib/skill-tree-data.ts` para o servidor. A ilha importa só o
> `-pure`. É o que mantém `client-boundary.test.ts` verde: o registro nunca entra no bundle.

### 5.4 Geometria — `lib/skill-tree-geometry.ts` (client-safe, puro)

```ts
export type Piece =
  | { kind: "v-cell"; row: number; col: number }                       // do fundo do nó A ao fim do vão abaixo (altura = vão)
  | { kind: "v-span"; fromRow: number; toRow: number; col: number; bottomGap: boolean }  // atravessa fileiras intermediárias; margem −vão em cima sempre; em baixo só quando o destino está na mesma coluna (`bottomGap`), porque num desvio o vão de baixo pertence ao `jog`
  | { kind: "h-cell"; row: number; col: number; toRight: boolean }      // da borda do nó ao fim do vão lateral (largura = vão)
  | { kind: "h-span"; row: number; fromCol: number; toCol: number }     // atravessa colunas intermediárias, margens −vão
  | { kind: "jog"; row: number; fromCol: number; toCol: number };       // no vão abaixo de `row`: vertical do topo ao meio em fromCol, horizontal até toCol, vertical do meio ao fundo
export function edgePieces(from: { row: number; column: number }, to: { row: number; column: number }): Piece[];
export function relatedEdges(slug: string | null, edges: readonly { from: string; to: string }[]): Set<string>;  // decisão 15: chaves "<from>><to>" de toda aresta no fecho de ancestrais do nó (pré-requisitos, recursivamente); vazio para null
```

Roteamento (decisão 3): mesma coluna → `v-cell` (adjacentes) ou `v-span` (`fromRow+1 … toRow−1`,
`bottomGap: true`); mesma fileira → `h-cell` (adjacentes) ou `h-span` — nas duas direções, porque o
grafo tem `raise-skeleton (1,3) → skeleton-mastery (1,1)`; fileira e coluna diferentes → nada
quando as fileiras são adjacentes (o `jog` sozinho liga o fundo de A ao topo de B), senão `v-span`
(`fromRow+1 … toRow−1`, `bottomGap: false`) na coluna de origem e depois `jog` no vão acima do
destino. Medido no grafo: nenhuma aresta atravessa verticalmente uma célula ocupada; a única
aresta horizontal atravessa uma célula vazia; se um dia atravessar um nó, a peça fica atrás dele
(fundo opaco, `z-index`). Colocação em CSS (dona: frente 1): `v-cell` = `grid-area: r/c; align-self:end; height:var(--tree-gap); margin-bottom:calc(-1*var(--tree-gap)); justify-self:center; width:2px`;
`v-span` = `grid-row: a/b+1; grid-column:c; align-self:stretch; margin:calc(-1*var(--tree-gap)) 0; justify-self:center; width:2px`;
`jog` = `grid-row:r; grid-column:min/max+1; align-self:end; height:var(--tree-gap); margin-bottom:calc(-1*var(--tree-gap)); margin-inline: calc((100% - (n-1)*var(--tree-gap)) / (2*n))` com `n` colunas atravessadas, e três `<line>` em percentagem (`M0,0 V50% H100% V100%`, espelhado quando o destino está à esquerda).
Cada peça carrega `data-edge="<from>><to>"`; a ilha marca `data-related` nas peças cuja aresta toca `shownSlug`.

**Forma da peça — medida num protótipo descartável (scratchpad, driver do repositório, 2026-09-11).**
A peça é um `<span data-edge>` vazio (item da grade, sem tamanho intrínseco) com o `<svg>` dentro
em `position:absolute; inset:0`. **Não** pode ser o `<svg>` o item da grade: um SVG sem `viewBox`
traz 150 px de altura intrínseca e `width="100%"` resolve contra a área e não contra a área menos as
margens — medido, isso inflava as fileiras 2–4 para **134 px** e fazia o documento transbordar
**24 px** a 320. Com o `<span>`: grade de **484 px** (6 × 74 + 5 × 8, exatamente F), trilho em
x = 4…19, **0 px** de transbordo, e as oito arestas reais da Cold Spells começam no fundo de A e
terminam no topo de B (±1 px) nas seis larguras — **inclusive com a fileira 4 crescida a 123 px**
(nome longo forçado), que é o caso que um único SVG `viewBox="0 0 3 6"` não consegue.

### 5.5 DOM (o que os gates procuram — estável nos dois idiomas)

| Peça | Seletor / atributo |
|---|---|
| raiz da seção (ilha) | `[data-trees]`; depois de montar `[data-trees][data-trees-ready]`; modo glifo `[data-glyph]` |
| controle de trees | servido `nav[data-tree-tabs] a[href="#<tree>"][data-tree-tab]`; enriquecido `[role="tablist"] a[role="tab"][aria-selected][aria-controls]`; escondido ≥ `sm` por CSS |
| tree | `[data-tree="<slug>"]` com `id="<slug>"` (URL publicada `#cold-spells` mantida); abaixo de `sm` e montada: `role="tabpanel"` + `aria-labelledby`; inativa: atributo `hidden`; pré-hidratação escondida por `@media (width < 40rem) and (scripting: enabled)` com `:has([data-tree]:target)` (decisão 6) |
| cabeçalho da tree | `[data-tree] > h3` = `tree.name` em **toda** largura (fica no DOM sob `hidden`; é o que `heading-snapshot.json` pina); em build, `[data-tree-points]` com `treePoints`; o `theme` em `p.hidden.sm:block` **e** `details[data-tree-theme].sm:hidden` servido fechado (decisão 10); **nenhum** `h2`/`h3` em abas, legenda (além do `h3` = `legendTitle`), controle de nível ou painel (o painel usa `h4`) |
| grade | `[role="grid"][aria-label][aria-describedby]` com `grid-template-columns` de 3 faixas em toda largura |
| fileira | `[role="row"][aria-label="Level N"]` (`display: contents`) |
| célula ocupada | `[role="gridcell"] > a[data-node="<slug>"][href][title="<nome>"][aria-label][data-state]`; hidratada: `role="button"`, `aria-expanded`, `aria-controls`, `tabindex` roving; `data-locked` quando bloqueada |
| célula vazia | `[role="gridcell"][aria-label="<skills.emptyCell>"]:empty`, **nunca** `aria-hidden` |
| trilho + conectores | `[data-tree-overlay][aria-hidden="true"]` — **primeiro** filho da grade, `pointer-events: none`, `z-index: 0` (os nós são `position: relative; z-index: 1` com fundo opaco); trilho `[data-rail-level]`; peças `span[data-edge] > svg`, `[data-related]` nas do fecho de ancestrais |
| controle de trees (forma) | grade de 3 colunas iguais abaixo de `sm`; cada aba ≥ 44 × 44 px, nome em `font-display text-sm` a quebrar dentro da aba, pontos `[data-tab-points]` em `font-mono text-xs` (build) |
| "Meu nível" (posição) | depois de `details[data-legend]`, último bloco da seção; uma linha de 44 px; `levelHelp` em `aria-describedby` sr-only |
| nome | `.tree-name[lang="en"]` (dentro do nó); faixa `[data-namebar][aria-hidden="true"]` (só `[data-glyph]`) |
| contador | `[data-points]` no nó (só em build) |
| "Meu nível" | `form[data-level] input[type="number"][min="1"][max="99"]`, `button[data-clear-level]`; **ausente sem JS** |
| legenda | um `details[data-legend]` por seção, `summary` com `h3` `skills.legendTitle` e quatro `[data-swatch]` |
| painel (≥ lg) | `[data-panel][role="region"][aria-label]` (`aria-live` **não** é o painel) |
| sheet (< lg) | `[role="dialog"][aria-modal="true"][data-sheet]`, `button[data-close-sheet]`, fundo `[data-scrim]` |
| região live | `[data-live][role="status"][aria-live="polite"]` sr-only, escrita só em `activate` |
| painel — conteúdo | `[data-panel-name]`, `[data-panel-level]`, `[data-panel-state]`, `[data-panel-points]`, `[data-panel-role]`, listas `[data-panel-prereqs] a[href]`, `[data-panel-unlocks] a[href]`, `[data-panel-synergies-in] a[href]`, `[data-panel-synergies-out] a[href]`, `a[data-panel-full][href]` |

Ids de tree e âncoras `#<tree>` nunca são escritos à mão em dois lugares: vêm de `cls.trees`.

### 5.6 Dicionários (chaves novas em `skills.*`, nos dois idiomas, no mesmo commit; nenhuma coincidência EN/PT nova)

| Chave | en-US | pt-BR |
|---|---|---|
| `ariaNode` | `{skill}, level {level}, {tree}, {state}.` | `{skill}, nível {level}, {tree}, {state}.` |
| `ariaNodeBuild` | `{skill}, level {level}, {tree}, {state}, {points}.` | `{skill}, nível {level}, {tree}, {state}, {points}.` |
| `stateLocked` | `Locked` | `Bloqueada` |
| `stateAvailable` | `Available` | `Disponível` |
| `announceSelected` | `{skill} selected. {state}.` | `{skill} selecionada. {state}.` |
| `treesLabel` | `Trees` | `Árvores` |
| `treePoints` | `{points} of {max} points in this tree` | `{points} de {max} pontos nesta árvore` |
| `treePointsShort` | `{points}/{max}` | `{points}/{max}` *(sem letras: fora da regra do ADR 0003)* |
| `levelLabel` | `My level` | `Meu nível` |
| `levelHelp` | `Only marks what is still locked. It changes nothing else.` | `Só marca o que ainda está bloqueado. Não altera mais nada.` |
| `levelClear` | `Clear` | `Limpar` |
| `levelClearLabel` | `Clear my level` | `Limpar meu nível` |
| `levelInvalid` | `A whole number from 1 to 99.` | `Um número inteiro de 1 a 99.` |
| `legendLocked` | `Locked: dashed frame and a padlock — above your level.` | `Bloqueada: moldura tracejada e cadeado — acima do seu nível.` |
| `legendAvailable` | `Available: plain frame.` | `Disponível: moldura simples.` |
| `legendInvested` | `Invested: ember frame and the points in the corner.` | `Investida: moldura ember e os pontos no canto.` |
| `legendMaxed` | `Maxed: ember frame, inner ring and a star.` | `Maximizada: moldura ember, anel interno e uma estrela.` |
| `legendOptional` | `Optional: the points pill is dashed — this build leaves the choice to you.` | `Opcional: a pílula dos pontos é tracejada — esta build deixa a escolha com você.` |
| `treeThemeSummary` | `About this tree` | `Sobre esta árvore` |
| `legendConnector` | `A line links a prerequisite to the skill that needs it; it lights up on the selected skill.` | `Uma linha liga o pré-requisito à skill que o exige; acende na skill selecionada.` |
| `legendKeyboard` | `Arrows move along the row and the column; at an edge they continue into the next row. Home and End go to the first and last skill.` | `As setas percorrem a fileira e a coluna; na borda, continuam para a fileira vizinha. Home e End vão à primeira e à última skill.` |
| `unlocksNone` | `Nothing requires this skill.` | `Nenhuma skill exige esta.` |
| `synergiesNone` | `No synergies.` | `Sem sinergias.` |
| `feedsTitle` | *(existe)* | *(existe)* |
| `panelPoints` | `Points in this build: {points}` | `Pontos nesta build: {points}` |
| `placeholderNote` | `The mark is a placeholder by type and element until the icon set arrives.` | `O símbolo é um placeholder por tipo e elemento até chegar o conjunto de ícones.` |

Reusadas sem mudança: `treeLabel`, `treeHint`, `rowLabel`, `emptyCell` (**ligada agora**), `panelHeading`,
`panelEmpty`, `closePanel`, `fullPage`, `points`, `noPoints`, `stateMaxed`, `stateInvested`, os oito
`state*` de papel, `legendTitle`, `legendHardPoints`, `legendMandatory`, `legendFlex`,
`prerequisitesTitle`, `prerequisitesNone`, `unlocksTitle`, `synergiesTitle`, `feedsTitle`, `unlocksValue`.
Removidas: `ariaNoBuild`, `ariaBuild`, `ariaBuildUnused`, os oito `class*` (substituídos por §5.1) —
`test:dictionary` e `test:a11y` acompanham.

### 5.7 Preferência — `lib/prefs.ts`

```ts
export const IMPLEMENTED_PREF_KEYS = ["d2rc.tier", "d2rc.level"] as const;
export const LEVEL_KEY = "d2rc.level";
export const LEVEL_EVENT = "d2rc:level";
export function isLevel(v: unknown): v is number;           // inteiro 1..99 (aceita string numérica exata "18", rejeita "18.5", " 18", "", "0", "100")
export function readLevel(): number | null;                 // nunca lança, nunca escreve, nunca apaga
export function writeLevel(level: number): boolean;         // grava String(level); despacha LEVEL_EVENT
export function clearLevel(): boolean;                      // removeItem; despacha LEVEL_EVENT
```

### 5.8 Estilo (tokens em `app/globals.css`, consumidos pela frente 1)

`--tree-gap: 8px`, `--tree-row: 74px` (piso; `grid-template-rows: repeat(6, minmax(var(--tree-row), auto))`),
`--tree-rail-w: 14px`, `--tree-name-size: .75rem`. Moldura disponível `ink-subtle` (3,99:1), bloqueada
tracejada `ink-subtle` + cadeado + sigilo a 45 % + nome `ink-muted`, investida `2px ember` + pílula
redonda (`abyss` sobre `ember`, 5,87:1), maximizada `2px ember` + anel interno + pílula chanfrada com
estrela; conectores `ink-subtle` sobre `abyss` (4,19:1), `ember` quando relacionados; fundo opaco em
todos os estados; `motion-safe:transition-colors` e `prefers-reduced-motion` zerando durações.

## 6. Arquitetura

```
app/[lang]/classes/[slug]/page.tsx · app/[lang]/builds/[classSlug]/[slug]/page.tsx   (Server)
└─ <SkillTreesSection classSlug allocations?>                                      (Server, components/game/skill-tree-section.tsx)
   ├─ data = buildSkillTreesData(locale, classSlug, t, allocations)                 lib/skill-tree-data.ts
   ├─ cabeçalho: total "N de M pontos duros obrigatórios" (build)                    (Server)
   └─ <SkillTrees data>                                                             ('use client', components/game/skill-trees.tsx)
      ├─ <SkillTreeTabs>            <a href="#tree"> → role=tab abaixo de sm         skill-tree-tabs.tsx
      ├─ <SkillTreeGrid> ×3         h3, theme, grade 3×6, trilho, conectores, nós <a>, faixa   skill-tree-grid.tsx
      ├─ <SkillTreeLegend>          um <details> por seção                            skill-tree-legend.tsx
      ├─ <SkillLevelControl>        só depois de montar (R-PREF-4); último bloco      skill-level-control.tsx
      ├─ <SkillTreePanel>           região ancorada (≥ lg) / corpo da sheet          skill-tree-panel.tsx
      └─ sheet (< lg) + scrim + região live                                          skill-trees.tsx
```

- **Primeiro render do cliente idêntico ao do servidor** (links, sem tabs, sem nível, sem `hidden`);
  um `useLayoutEffect` liga `enhanced`, lê `matchMedia`, `readLevel()` e marca `data-trees-ready`.
  É o padrão de `tier-selector.tsx` e `class-chip.tsx`.
- **Nenhum `<Link>` do Next** nos nós nem nas abas: `<a>` cru, para que o clique interceptado e o
  fragmento `#<tree>` nunca passem pelo router (`test:hygiene` já proíbe `<Link>` com fragmento nos
  componentes de tier; a regra é estendida aos arquivos desta fase).
- **A ilha não importa `lib/i18n`, `lib/registry` nem `content/`**: tudo chega em `SkillTreesData`.
  `RichText` e `SkillSigil` são puros e entram no bundle.
- `lockScroll`/`trapTarget` reutilizados para a sheet, como hoje.

## 7. Direção visual (skill `frontend-design`, dentro do design system)

Nó `stack`: linha 1 sigilo (20 px) à esquerda e contador à direita; linha 2 nome a 12 px, até duas
linhas, `overflow-wrap: break-word` + `hyphens: auto` + `lang="en"`; `padding: 6px 5px`; fundo
`surface`, selecionado `surface-raised`; alvo ≥ 88 × 74 a 320 px e ≥ 44 × 44 em toda largura. Cadeado
e estrela são geometria própria (SVG inline de ~120 B, `currentColor`). Abas com `min-height: 44px`,
nome da tree em `font-display`, pontos em `font-mono`. Legenda: `<summary>` em uma linha com os quatro
quadradinhos; corpo em `text-sm`. Sem movimento novo além de `transition-colors`.

## 8. Dimensões e aceite numérico (gates: `test:tree-browser`, `test:class-html-size`, `test:viewport`)

| Métrica | Baseline | Meta PRD / F | Gate |
|---|---|---|---|
| colunas da grade a 320/390/640/768/1024/1280 | 1/1/3/3/3/3 | 3 em todas | 3 faixas |
| células por tree no DOM / na árvore de acessibilidade | 18 / 10 | 18 / 18 | 18 e 0 `aria-hidden` |
| nó a 320 px | 280 × 70,5 | 88 × 74 | ≥ 88 × 74 (±0,5) |
| nó em toda largura | — | ≥ 44 × 44 | ≥ 44 nos dois eixos |
| grade por tree a 320 px, 100 % | 954 | 484 | ≤ 490 |
| seção com uma tree a 320 px (Cold / Summoning) | 3.511 / 3.761 (empilhadas) | 829,5 / 877,7 em F; **≤ 900** | ≤ 900, nos dois idiomas, com "Meu nível" e legenda fechada; caixa medida definida abaixo |
| conectores visíveis a 320 px | 0 | todos | cada `svg[data-edge]` com `getClientRects().length > 0` e tocando os dois nós (±1 px) a 320/390/640/1280 e a 150 % de texto |
| palavras partidas / fragmentos ≤ 2 letras a 200 % de texto, 320 e 390 | 0 (lista) | 0 / 0 | 0 / 0, com JS e sem JS |
| overflow horizontal da seção | 0 | 0 | `section.scrollWidth ≤ clientWidth` em toda largura e a 200 % de texto |
| HTML por documento de classe (16) | 348.313 máx. | ≤ 368.640 | ≤ 368.640; alerta impresso ≥ 348.160 |
| árvores alcançáveis só com setas | 24/24 (vizinho mais próximo) | 24/24 | `reachableByArrows` nas 24 |
| chaves em `localStorage` ao fim de cada sessão de gate | `{d2rc.tier}` | `⊆ {d2rc.tier, d2rc.level}` | igualdade de conjunto |
| CLS numa chegada por `#skills` a 320/390 (classe e build), depois da hidratação | não medido | < 0,1 | `layout-shift` bufferizado, como `build-cls.test.ts` |
| JS de cliente (soma dos chunks referenciados por uma página de classe) | medido no baseline | publicado, sem teto duro (R-TREE-17: "não aumente além do necessário") | delta impresso no relatório |

### 8.1 A caixa medida pelo orçamento de 900 px (revisão, MED-4)

- **Página de classe:** a `<section id="skills">` inteira — é a caixa que o PRD e o protótipo medem.
- **Página de build:** do topo da `<section id="skills">` ao fundo de `[data-trees]` — o cabeçalho da
  seção (título, `skillsDescription`, total) mais tudo o que a árvore acrescenta. As tabelas
  "Maximize nestas", "Um ponto cada", "Pontos restantes" e os pacotes que vêm depois são conteúdo
  pré-existente da build (o baseline mede 6.218 px de seção a 320) e ficam fora da caixa; a seção
  inteira é publicada ao lado, não asserida.

### 8.2 A conta, bloco a bloco, a 320 px (estimativa a confirmar pelo gate C2; a tabela final vai ao relatório)

| Bloco | Classe, Summoning pt-BR | Build, Summoner pt-BR | Origem |
|---|---|---|---|
| cabeçalho da seção (`h2` + `mb-4`; build: + `skillsDescription` ≈ 60 + total 24) | 44 | ≈ 128 | `Section` |
| controle de trees (grade 3 col., nomes a quebrar) + `mt-3` | ≈ 60–75 + 12 | idem | decisão 10 |
| `h3` da tree + `mt-1` (+ `treePoints` em build) | 32 | 52 | §5.5 |
| `details[data-tree-theme]` fechado + `mt-2` | 34 + 8 | 34 + 8 | decisão 10 |
| grade 3×6 (6 × 74 + 5 × 8) + `mt-3` | 484 + 12 | 484 + 12 | F |
| `details[data-legend]` fechado + `mt-3` | 34 + 12 | 34 + 12 | F |
| "Meu nível" (uma linha) + `mt-3` | 44 + 12 | 44 + 12 | decisão 10 |
| **total** | **≈ 790–805** | **≈ 880–895** | |

O protótipo F media 829,5/877,7 com um cabeçalho de seção de 123,5 (título, subtítulo e total), a
faixa de nome (28) e um controle de duas linhas (92) — esta composição troca isso por um cabeçalho
menor, sem faixa a 100 %, com o controle em grade e com dois blocos que F não tinha (`theme`
recolhido, "Meu nível"). **Regra de parada:** se o gate medir > 900 em qualquer uma das quatro
combinações (Cold/Summoning × en/pt) na classe, ou na caixa da build, a execução para e o número vai
ao proprietário com a decomposição real — não se aperta nada além do que está aqui.

> **A regra disparou, e foi decidida (2026-09-12).** O gate C2 mediu a caixa da build em **903–992 px**
> nas seis combinações (Blizzard, Summoner, Abyss × en/pt), com as quatro combinações da classe em
> 778–807. A decomposição real foi ao proprietário no relatório (§4, §6), nada foi apertado, e a
> **decisão D3** fixou o contrato definitivo da caixa da build em **≤ 1.050 px**, preservando a
> descrição da seção, os pontos nas abas e o total. O gate deixou de ser catraca provisória e passou
> a afirmar o contrato (`BUILD_BUDGET = 1050` em `scripts/skill-tree-browser.test.ts`).

## 9. Testes, por requisito (novos em **negrito**; todos com controle anti-vacuidade)

| # | Req. | Arquivo | Asserção | Cadeia |
|---|---|---|---|---|
| C1 | R-TREE-1 | **`scripts/skill-tree-a11y.test.ts`** (reescrito) | por classe e idioma: 3 `role=grid`, 18 `role=row`, 54 `gridcell`, **0** `gridcell[aria-hidden]`, 24 vazias com `aria-label` = `skills.emptyCell` do idioma, 30 `a[data-node][href]` com o locale da página; `title` = nome; `aria-label` composto por `nodeAriaLabel` (§5.1) para os 30 nós — no HTML servido só existem `available`/`invested`/`maxed` (build), porque `locked` depende de preferência e é afirmado no navegador por C8; `[data-tree] > h3` = nome da tree; um `h3` na legenda com exatamente `legendTitle` | `check:built` |
| C2 | R-TREE-1/2/3/8 | **`scripts/skill-tree-browser.test.ts`** (novo; Sorceress, Necromancer, Warlock × 2 idiomas; builds `blizzard-sorceress`, `summoner-necromancer`, `abyss-warlock`) | `gridTemplateColumns` 3 faixas nas seis larguras; 18 células; nó ≥ 88 × 74 a 320 e ≥ 44 em toda largura; abas ≥ 44 × 44; grade ≤ 490 a 320; conectores visíveis e tocando os nós (a 320/390/640/1280 e a 150 % de texto); **caixa de §8.1 ≤ 900 a 320 com uma tree, decomposição por bloco impressa**; abaixo de `sm` 3 `role=tab`, uma tree visível, as outras `hidden` sem focável; a partir de `sm` 3 trees visíveis e nenhum `tablist`; carregar com `#lightning-spells` a 390 mostra a Lightning; `layout-shift` bufferizado < 0,1 numa chegada por `#skills` a 320/390 | `check:built` |
| C3 | R-TREE-8 | idem | trocar de tree por clique e por seta: `location` inalterada, `activeElement` continua na aba, o `tabindex="0"` da tree ativa está no primeiro nó ocupado; uma legenda por seção (`details[data-legend]` = 1) | idem |
| C4 | R-TREE-13 | **`scripts/skill-tree-nav.test.ts`** (reescrito, puro) | `reachableByArrows` 24/24 (e com Home/End); Sorceress: Ice Blast ↓ = `glacial-spike`, Ice Blast → = `shiver-armor` (fallback documentado), Glacial Spike ↑ = `ice-blast`; Necromancer summoning e Warlock: ≥ 3 casos cada derivados do grafo e escritos por slug; `nextVertical` nunca muda de coluna quando há nó na coluna; `nextHorizontal` nunca muda de fileira quando há nó na fileira; **controle anti-vacuidade:** uma grade sintética com um nó isolado sob uma política estrita sem continuação faz `reachableByArrows` devolver `< total` (revisão, MED-1: nas 24 árvores reais a alcançabilidade é verdadeira por construção com a continuação horizontal, e a contagem sozinha não pega um mutante); o relatório publica quantos movimentos verticais mudam de destino entre a política atual e a nova (computado pela revisão: 218) | `check` |
| C5 | R-TREE-13 | `skill-tree-browser` | no navegador: Tab entra numa parada por tree visível; setas seguem C4 em dois casos por classe; Home/End; Enter abre (sheet < lg, painel ≥ lg); Esc fecha e devolve o foco ao nó; Tab sai da grade | `check:built` |
| C6 | R-TREE-11/12 | idem | com `(hover: hover)` (viewport desktop): hover mostra prévia no painel e marca `data-related` nas peças da aresta, `selected` inalterado, sair restaura; com emulação touch (`mobile: true`): pointer não altera o painel; toque seleciona e abre a sheet; segundo toque no mesmo nó mantém a sheet; botão, Esc e scrim fecham; foco volta ao nó | idem |
| C7 | R-TREE-14 | idem | `[data-live]` inalterada após 4 setas e após hover; muda no Enter com `announceSelected`; painel `role=region` nomeado; sheet `role=dialog aria-modal`; peças e trilho `aria-hidden`; nome acessível dos 30 nós conforme §5.1; `axNodes()`: 54 `gridcell` por página de classe | idem |
| C8 | R-TREE-4/5/9 | idem + **`scripts/prefs.test.ts`** (estendido) | sem `d2rc.level`: 0 `[data-locked]`; `writeLevel(18)` pela UI → `[data-locked]` = nº de nós com `level > 18` na classe (derivado do grafo), `[data-points]` **inalterados** em toda a build, `localStorage` só ganha `d2rc.level`; alterar para 30 sem recarregar → recontado; "Limpar" → 0 e chave removida; valor inválido gravado à mão → ignorado e mantido; sem JS: nenhum `form[data-level]`; puro: `isLevel` 6 válidos + 10 inválidos, `readLevel` nunca apaga | `check:built` / `check` |
| C9 | R-TREE-6 | **`scripts/skill-tree.test.ts`** (estendido, puro) | `buildSkillTreesData` nas 8 classes × 2 idiomas × (sem build, cada build da classe): 6 fileiras × 3 células, 10 nós por tree, `points` = soma das alocações da tree, `maxPoints` = 10 × 20, `edges` só intra-tree, `unlocks` = `dependents`, `synergiesIn/Out` = grafo nos dois sentidos, `defaultTree` = tree com mais pontos (classe: primeira), `href` com locale, 0 `+skills` inventados (`pointsLabel` só de pontos-base) | `check` |
| C10 | R-TREE-7 | `skill-tree-browser` | ao selecionar um nó com pré-requisitos, sinergias e desbloqueios (Blizzard; Raise Skeletal Mage): `[data-panel-prereqs] a`, `[data-panel-unlocks] a`, `[data-panel-synergies-in] a`, `[data-panel-synergies-out] a` todos `a[href^="/<locale>/classes/"]`, nomes iguais aos do grafo, `a[data-panel-full]` para a página da skill; `[data-panel-role]` presente em build; RichText no resumo | `check:built` |
| C11 | R-TREE-15 | idem | `setTextScale(200)` a 320 e 390, com JS: 0 palavras partidas e 0 fragmentos (medição por `Range`, em estado-sonda **não** é o que se mede — mede-se o que está pintado), `title` e `aria-label` com o nome nos 30 nós, e o **invariante** de todo nó: nome visível no nó **ou** `[data-glyph]` posto com a faixa de nome mostrando o nome do nó focado; a 150 % os nomes continuam no nó (F: 0 quebras a 150 %); sem JS a 200 %: 0 palavras partidas pelo piso CSS; 320 px CSS (= 400 %): 3 colunas, 0 overflow; 640 px (= 200 % de zoom): 3 trees empilhadas; controle: o observer converge (o número de mutações de `data-glyph` numa sessão é ≤ 1 por mudança de largura/texto) | idem |
| C12 | R-TREE-16 | **`scripts/skill-tree-a11y.test.ts`** (HTML sem scripts) + `skill-tree-browser` (`setScriptsEnabled(false)`) | arquivo: 30 `a[data-node][href]`, 54 `gridcell`, `[data-edge]` ≥ 8 por tree, `nav[data-tree-tabs]` com 3 links `#<tree>`, nenhum `<noscript>`, nenhum `role=tab`, nenhum `role=dialog`, nenhum `form[data-level]`, nenhum `<script>` inline novo; navegador sem scripts a 320: `matchMedia("(scripting: enabled)")` falso, 3 trees visíveis, um clique num nó **navega** para a página da skill; com scripts a 320 antes de montar: uma tree visível (controle da CSS de pré-hidratação) | ambos |
| C12b | HIGH-1 da revisão | `scripts/raw-markup.test.ts` (bloco "Uber Tristram" reescrito) + `skill-tree-browser` | a nota editorial que começa por `**` chega à carga RSC como **string** (dado da ilha) e, no navegador, selecionar esse nó na build pt-BR renderiza `<strong>` no painel `[data-panel-note]` e nenhum `**` literal; controle: uma string com `**` fora do `RichText` seria apanhada | `check:built` |
| C12c | HIGH-2 da revisão | `scripts/build-tier-state.test.ts` | a asserção "no tab semantics anywhere" passa a ser escopada ao controle de tier (`#gear` e o seletor), porque abaixo de `sm` a seção de skills tem um `tablist` legítimo (R-A11Y-3: painéis exclusivos) | `check:built` |
| C13 | R-TREE-17 | **`scripts/class-html-size.test.ts`** (novo) | 16 documentos ≤ 368.640 (`statSync`, `buildRoot()`, `assertFreshBuild()`); imprime cada um; alerta ≥ 348.160 como aviso, não falha; controle: um limite sintético de 1 byte falha | `check:built` |
| C14 | R-A11Y-5 | `scripts/contrast.test.ts` (reescrito: lê `skill-tree-grid.tsx` com `existsSync` + `check`, nunca `readFileSync` no topo do módulo, para ficar RED e não crashar contra o baseline — revisão, LOW-1; `TILE_STATES` → os quatro `NodeState`) | os pares de §5.8 ≥ 4,5:1 (texto) e ≥ 3:1 (moldura, conector, pílula) | `check:built` |
| C15 | R-A11Y-6 | `skill-tree-browser` | `setReducedMotion(true)`: `transitionDuration` computada `0s` no nó e na peça | idem |
| C16 | R-A11Y-9 | `scripts/sheet.test.ts` (atualizado; mesma regra de `existsSync`) | fonte e HTML da sheet nova: `trapTarget`, foco inicial no fechar, `lockScroll`, sem `dialog` no HTML | idem |
| C6b | R-TREE-11 (revisão, LOW-7) | `skill-tree-browser` | controle na própria sessão: sob emulação móvel `matchMedia("(hover: hover)").matches === false`, e no desktop `true`, antes de afirmar qualquer comportamento de hover ou toque | idem |
| C17 | R-PREF-3/4 | `scripts/prefs.test.ts`, `scripts/hygiene.test.ts` | `IMPLEMENTED_PREF_KEYS` = `[tier, level]`; único importador de `writeLevel`/`clearLevel` é `skill-level-control.tsx`; nenhum `<Link>` com fragmento em `skill-tree-tabs.tsx`/`skill-tree-grid.tsx`; nenhum `scrollIntoView` na ilha | `check` |
| C18 | fronteira | `scripts/client-boundary.test.ts` | ilhas: `skill-tree-interactive` sai, `skill-trees` entra; nenhum script inline novo; nenhuma string do corpus nos chunks | `check:built` |
| C19 | R-I18N-1/2 | todos | todo gate percorre `LOCALES`; `test:crawl` e `test:structure` inalterados e verdes (heading snapshot intacto) | — |
| C20 | R-TREE-18 | `skill-tree-a11y` | `[data-placeholder]` no sigilo e `skills.placeholderNote` na legenda — o placeholder está declarado; nenhum `<img>`, nenhum asset externo | `check:built` |
| C21 | §5.3 | **`scripts/skill-tree-state.test.ts`** (novo, puro) | as regras de §5.3, uma por asserção, mais os controles: hover **não** muda `selected`; touch não gera `preview`; segundo `activate` não fecha; `escape` limpa | `check` |
| C22 | §5.4 | **`scripts/skill-tree-geometry.test.ts`** (novo, puro) | `edgePieces` para os três casos (mesma coluna, mesma fileira, diagonal) em ambas as direções horizontais; para as 24 árvores: toda aresta gera ≥ 1 peça, nenhuma peça fora da grade, `jog` sempre no vão acima do destino | `check` |

Ordem no `check:built`: os que leem arquivo (`a11y`, `class-html-size`) cedo; `skill-tree-browser` junto de
`viewport`. Cada script novo entra em `package.json` como `test:*` autônomo no commit 1 e é
**encadeado no commit que o deixa verde** (regra das Fases 1–3).

## 10. Propriedade de arquivos

| Frente | Cria | Modifica | Não toca |
|---|---|---|---|
| **1 · Estrutura e geometria** (Agente 1) | `lib/skill-tree-geometry.ts`, `components/game/skill-tree-grid.tsx`, `components/game/skill-tree-tabs.tsx`, `components/game/skill-tree-legend.tsx`, `components/game/skill-tree-section.tsx`, `scripts/skill-tree-geometry.test.ts` | `app/globals.css` (bloco `/* skill tree */`), `components/game/index.tsx` (exports) | ilha, painel, nível, dados, nav, estado, páginas, dicionários, gates de navegador |
| **2 · Estado e conteúdo** (Agente 2) | `lib/skill-tree-data.ts`, `lib/skill-tree-data-pure.ts`, `components/game/skill-trees.tsx`, `components/game/skill-tree-panel.tsx`, `components/game/skill-level-control.tsx` | `lib/prefs.ts`, `lib/skills.ts` (só remoção de `skillAriaLabel`/`SkillAriaStrings`), `app/[lang]/classes/[slug]/page.tsx`, `app/[lang]/builds/[classSlug]/[slug]/page.tsx`, `scripts/skill-tree.test.ts`, `scripts/prefs.test.ts` | CSS, grade, abas, legenda, nav, estado, gates de navegador |
| **3 · Interação e qualidade** (Agente 3) | `lib/skill-tree-state.ts`, `components/game/use-name-fit.ts` (hook: mede nomes partidos/cortados em estado-sonda e devolve `boolean`), `scripts/skill-tree-state.test.ts`, `scripts/skill-tree-browser.test.ts`, `scripts/class-html-size.test.ts` | `lib/skill-tree-nav.ts`, `scripts/skill-tree-nav.test.ts`, `scripts/skill-tree-a11y.test.ts`, `scripts/viewport.test.ts`, `scripts/contrast.test.ts`, `scripts/sheet.test.ts`, `scripts/client-boundary.test.ts`, `scripts/hygiene.test.ts`, `scripts/raw-markup.test.ts` (bloco "Uber Tristram", HIGH-1), `scripts/build-tier-state.test.ts` (escopo de "no tab semantics", HIGH-2), `scripts/locale-switch.test.ts` (só o comentário das linhas ~616-617 que atribui à "Phase 4" a corrida de `#skills` — a árvore passa a ter altura final no SSR; LOW-8) | componentes, `lib/prefs.ts`, dados, páginas, CSS, dicionários |
| **Coordenador** | `docs/product/plans/phase-4-{tree-structure-plan,report}.md`, `phase-4-visual/` | `docs/product/PRD-vNext.md` (D1, D2, §18), `lib/i18n/dictionaries/{en-us,pt-br}.ts` (§5.6, commit 1), `package.json` (entradas `test:*` e cadeias), remoção de `components/game/skill-tree.tsx` e `skill-tree-interactive.tsx` | — |

**Contratos de coordenação:**
1. O commit 1 traz os tipos de §5.1–5.4 e §5.7 como **stubs tipados** com zeros válidos por tipo, as
   chaves de §5.6 nos dois dicionários e as entradas `test:*` autônomas; nenhum agente edita
   `package.json` nem dicionários.
2. A grade (frente 1) é **apresentacional**: recebe `tree: TreeData`, `level`, `focusCell`,
   `shownSlug`, `selectedSlug`, `enhanced`, `glyph`, `inBuild`, `strings` e callbacks
   `onNodeFocus/onNodeKeyDown/onNodeActivate/onNodeHoverIn/onNodeHoverOut`; não lê `matchMedia`,
   não decide estado. A ilha (frente 2) decide tudo e chama `reduce` (frente 3).
3. `use-name-fit.ts` (frente 3) exporta `useNameFit(gridRef, deps): boolean`; a ilha (frente 2) chama
   e propaga `glyph` às grades; a grade (frente 1) só aplica `data-glyph` e a faixa de nome.
4. `nodeState`/`nodeAriaLabel` vivem em `lib/skill-tree-data-pure.ts` (frente 2) e são a única
   fonte da composição do nome — a grade os chama; o gate C1 os recompõe a partir do dicionário.
5. Ids de tree = `tree.slug`; `aria-controls` das abas = esse id; `#<slug>` continua URL publicada.
6. Dois lados do vão mudam juntos: `--tree-gap` em CSS e a constante que `edgePieces` documenta são
   o mesmo 8 px, e o gate de geometria no navegador (C2) é o que os mantém iguais.
7. Nenhum agente corre `npm run build`, `check:built` completo ou `git`. Gates de navegador em RED
   correm contra o build baseline de `436dc88` já em `.next` com
   `D2R_BUILD_ROOT=D:/Projetos/GitHub/d2r-codex/.next/server/app` (pula o teste de frescor; o
   servidor `next start` serve o build antigo, que é o RED desejado). O coordenador reconstrói **uma
   vez**, na integração, e corre todos os gates.
8. Um worktree só, propriedade estrita, o coordenador serializa builds e gates — como nas Fases 1–3
   (dois builds no mesmo checkout se invalidam; a memória do projeto registra o custo dos worktrees
   com junction de `node_modules`).

## 11. Tarefas (cada uma: teste vermelho → implementação → verde; sem commit pelo agente)

**Frente 1.** T1 `edgePieces` + teste (RED: stub devolve `[]`). T2 `skill-tree-grid.tsx`: grade 3×6
com `grid-area` explícita por célula, 24 vazias nomeadas, nós `<a>` com `data-*`, `title`, `lang="en"`,
sigilo `[data-placeholder]`, contador, cadeado/estrela, roving `tabindex` conforme `focusCell`,
`role="button"`/`aria-expanded`/`aria-controls` só com `enhanced`; overlay `aria-hidden` com trilho e
peças; faixa de nome. T3 `skill-tree-tabs.tsx` (links → tabs). T4 `skill-tree-legend.tsx`. T5
`skill-tree-section.tsx` (servidor: dados, total, ilha). T6 CSS: tokens, grade,
nó por estado, trilho, peças, jog, abas escondidas ≥ `sm`, pré-hidratação abaixo de `sm` com `(scripting: enabled)` e `:has(:target)`, piso `@media (width < 13em)` escopado a `:not([data-trees-ready])`, estado-sonda `[data-measuring]`, reduced motion, subgrid + `@supports`. T7 exports em `index.tsx`.

**Frente 2.** T8 `lib/prefs.ts` nível (RED em `prefs.test.ts`). T9 `skill-tree-data-pure.ts` +
`skill-tree-data.ts` (RED em `skill-tree.test.ts`). T10 `skill-tree-panel.tsx`. T11
`skill-level-control.tsx`. T12 `skill-trees.tsx`: estado (`reduce`), `enhanced`/`narrow`/`wide` por
`matchMedia` com listeners, `hidden` das trees inativas, foco por tree, `data-trees-ready`,
`useNameFit`, região live, sheet com `lockScroll`/`trapTarget`, retorno de foco, Escape global,
`storage`/`d2rc:level`. T13 páginas: substituir os três `<SkillTree>` por `<SkillTreesSection>`;
build: remover o cartão da legenda antigo, manter os `h3`. T14 remover `skillAriaLabel` de
`lib/skills.ts`.

**Frente 3.** T15 `lib/skill-tree-nav.ts` (RED: casos nomeados falham contra o vizinho-mais-próximo
atual). T16 `lib/skill-tree-state.ts` + teste. T17 `use-name-fit.ts`. T18 `skill-tree-a11y.test.ts`
reescrito (RED contra o build baseline: 24 `aria-hidden`, 0 `a[data-node]`). T19
`skill-tree-browser.test.ts` (RED contra o baseline: 1 coluna, sem conectores, sem tabs, sem nível).
T20 `class-html-size.test.ts` (RED: 348.313 imprime alerta; passa no teto — registrar como "verde no
baseline, com alerta"). T21 `viewport.test.ts` (páginas de classe e build de referência nas larguras
novas, alvos ≥ 44 nos nós, ≥ 24 nas abas… e a asserção de que a seção não transborda a 200 %),
`contrast.test.ts`, `sheet.test.ts`, `client-boundary.test.ts`, `hygiene.test.ts`.

## 12. Mutations (cada uma aplicada sobre estado commitado, medida, revertida com `git checkout -- <arquivo>`, árvore confirmada por `git status --porcelain` vazio e `git diff --stat` vazio)

| # | Mutação | Gate que tem de ficar vermelho |
|---|---|---|
| M1 | grade volta a `grid-template-columns: 1fr` abaixo de `sm` | `skill-tree-browser` (3 faixas a 320/390) |
| M2 | célula vazia ganha `aria-hidden="true"` | `skill-tree-a11y` (0 `aria-hidden`; `axNodes` 54) |
| M3 | peças de conector `display:none` abaixo de `sm` | `skill-tree-browser` (`getClientRects` a 320) |
| M4 | tree inativa recebe `aria-hidden` em vez de `hidden` | `skill-tree-browser` (focável dentro de tree inativa) |
| M5 | `grid-template-rows: repeat(6, var(--tree-row))` (altura rígida) | `skill-tree-browser` (nome cortado a 150 %: `scrollHeight > clientHeight`) |
| M6 | `nodeState` devolve `locked` quando `level === null` | `skill-tree-browser` C8 (0 bloqueados sem preferência) + `skill-tree.test` |
| M7 | `writeLevel` zera os pontos dos nós acima do nível (altera `points` no render) | C8 (`[data-points]` inalterados) |
| M8 | `hover-in` escreve `selected` | `skill-tree-state.test` + C6 |
| M9 | handler de hover ignora `(hover: hover)` | C6 (emulação touch recebe prévia) |
| M10 | `focus` escreve `announce` | C7 (região live muda com setas) + `skill-tree-state.test` |
| M11 | `nextHorizontal` deixa de continuar na borda **e** `nextVertical` deixa de procurar coluna vizinha | `skill-tree-nav.test`: o caso nomeado "Ice Blast → direita = shiver-armor" fica vermelho, **e** o controle da grade sintética com nó isolado devolve `< total` (nas 24 árvores reais a contagem continua 24/24 mesmo sob esta mutação — revisão, MED-1 — por isso a contagem sozinha não é o gate) |
| M12 | modo glifo remove o `title` do nó | C11 (`title` = nome) |
| M13 | pré-requisito do painel vira `<span>` | C10 (`a[href]` obrigatório) |
| M14 | teto de `class-html-size` posto em 1 byte | `class-html-size` (controle anti-vacuidade) |
| M15 | a condição `and (scripting: enabled)` sai da consulta de pré-hidratação | C12 (sem scripts a 320: uma só tree visível) |
| M16 | `defaultTree` sempre a primeira também em build | `skill-tree.test` (Blizzard → cold; Fire Ball → fire) |
| M17 | `edgePieces` põe o `jog` no vão abaixo da origem | `skill-tree-geometry.test` + C2 (peça não toca o destino) |
| M18 | `activate` no nó já selecionado fecha a sheet (toggle) | `skill-tree-state.test` + C6 |
| M19 | `form[data-level]` renderizado no SSR | C12 (ausente sem JS) |
| M20 | `role="tablist"` mantido a partir de `sm` | C2 (nenhum `tablist` a 640+) |
| M21 | `details[data-legend]` servido `open` | C2 (orçamento) + C1 |
| M22 | célula vazia sem `aria-label` | C1 (24 vazias nomeadas) + C7 (`axNodes` 54) |
| M23 | `isLevel(100)` devolve `true` | `prefs.test` |
| M24 | `href` do painel sem o prefixo de locale | C10 |
| M25 | `data-related` não marcado no hover/foco | C6 |
| M26 | painel sem `role="region"` | C7 |
| M27 | medição do modo glifo sem estado-sonda (mede os nomes já escondidos) | C11 (controle de convergência: mais de uma mutação de `data-glyph` por mudança) |

## 13. Commits (pequenos, atômicos, só locais, na ordem de integração; feitos pelo coordenador)

0. **plano** — este documento, as notas D1/D2 no PRD, a memória do baseline. *("Phase 4, commit 0")*
1. **contratos e testes vermelhos** — tipos, stubs tipados, chaves de dicionário, `package.json`
   (entradas autônomas), os testes puros novos e os gates reescritos, cada um com o RED registrado
   no log contra o baseline.
2. **geometria, navegação e estado** — `skill-tree-geometry.ts`, `skill-tree-nav.ts`,
   `skill-tree-state.ts`; `test:tree-geometry`, `test:nav`, `test:tree-state` → `check`.
3. **preferência e dados** — `lib/prefs.ts`, `skill-tree-data*.ts`; `test:prefs`, `test:tree` → `check`.
4. **a árvore** — componentes, páginas, CSS, remoção de `skill-tree.tsx`/`skill-tree-interactive.tsx`;
   build; `test:a11y`, `test:tree-browser`, `test:class-html-size`, `test:sheet`, `test:client`,
   `test:hygiene`, `test:contrast`, `test:viewport` verdes → `check:built`.
5. **gates calibrados e mutations** — ajustes de gate no build integrado; as 27 mutations com o log.
6. **o registro** — relatório factual, PRD (R-TREE-1…17 medidos, D1/D2, §12.2, §14, §18), evidência
   visual em `phase-4-visual/`.
7. *(parada)* — servidor de UAT; nada mais é commitado até a aprovação do proprietário.

## 14. Riscos

| Risco | Mitigação |
|---|---|
| Orçamento de HTML (pior caso já acima do alerta) | decisão 1; `class-html-size` no `check:built`; regra de parada em §3.4 |
| Seção > 900 px a 320 no Necromancer (abas em duas linhas + "Meu nível") | decisão 10 (faixa só em glifo), legenda fechada, nível inline com o cabeçalho; medido em C2 nos dois idiomas; se passar, a execução para e o número vai ao proprietário |
| `subgrid` ausente num navegador antigo | `@supports` com o mesmo `repeat(6, minmax(...))` — exato enquanto nenhuma fileira cresce |
| CLS ao esconder trees na hidratação | decisão 6 (CSS antes da pintura com `(scripting: enabled)`); C2 mede `layout-shift` em `#skills`; `test:build-cls` continua verde |
| `role=tab` inválido a partir de `sm` | roles só abaixo de `sm` e só depois de montar; C2 afirma ausência de `tablist` a 640+ |
| `<a role="button">` e Espaço | keydown de Espaço tratado como na D7; C5 |
| Mismatch de hidratação | primeiro render idêntico ao SSR; `drainConsole()` vazio em todo gate |
| Revert de mutation apagar trabalho | só sobre estado commitado; reversão por arquivo; árvore confirmada (Fase 2 §15) |
| `D2R_BUILD_ROOT` esquecido no ambiente | cada gate em shell próprio; `env | grep D2R_` conferido depois |
| pt-BR mais largo em abas e legenda | medido nas seis larguras; nomes de tree são invariantes (ADR 0003) |

## 15. Portão de UAT físico (obrigatório; a fase para aqui)

Depois de `lint`, `typecheck`, `build`, `check`, `check:built`, `predeploy` com
`NEXT_PUBLIC_SITE_URL=https://d2r-codex.vercel.app` (com `EXIT=` lido do log) e `git diff --check`
verdes: um único `next start` da build de produção **em `0.0.0.0`, numa porta livre conhecida, em
processo oculto**, HTTP 200 confirmado pelo IPv4 da rede local; PID, porta e comando de encerramento
no relatório; URLs diretas em pt-BR e en-US para `/classes/sorceress`, `/classes/necromancer` e
`/builds/sorceress/blizzard-sorceress`; a lista de verificação do PRD §14 (dez nós consecutivos,
troca de trees, sheet abre e fecha, retorno do foco, rolagem sem toques acidentais, safe area,
nomes no estado normal, seleção no modo glifo, os dois idiomas, ≈320 e ≈390 px). **Sem push, sem
deploy, sem marcar a fase como concluída, sem encerrar o servidor** até a aprovação explícita.

> **Cumprido e aprovado (2026-09-12).** A execução parou aqui em `3dadc34` com o servidor em
> `0.0.0.0:3400` (relatório §12). O proprietário testou em telefone real, no mesmo Wi-Fi, Sorceress,
> Necromancer e Blizzard Sorceress, e **aprovou os dez itens** (dez toques consecutivos, troca de
> trees, sheet, rolagem, safe area, nomes, grade 3×6 com texto ampliado, modo glifo, os dois idiomas,
> contadores e total, "Meu nível" 18 com persistência e "Limpar"). A publicação segue no relatório §13.

## 16. Decisões do proprietário registradas nesta fase

- **D1 — R-TREE-9 entra na Fase 4.** "Meu nível" e `d2rc.level` são implementados agora, porque os
  estados bloqueados de R-TREE-4/5 dependem deles. A Fase 5 deixa de listar R-TREE-9 e fica só com os
  ícones próprios e o acabamento correspondente.
- **D2 — R-TREE-10 é dividido.** Nesta fase: árvore estrutural nas páginas de classe e árvore com
  alocações nas páginas de build. Fora desta fase: árvore em cada etapa do leveling, adiada para a
  iniciativa já prevista (P3.6, Fase 7). Esta fase **não** alega ter implementado essa metade.
- **D3 — a caixa de altura da página de build (2026-09-12, depois do UAT físico).** Medida em
  903–992 px a 320 px contra a estimativa de 880–895 (§8.2), a caixa da build ganha contrato
  definitivo de **≤ 1.050 px**; descrição da seção, pontos nas abas e total da seção preservados. As
  páginas de classe continuam em ≤ 900 (medidas 778–807).

## 17. Disposição da revisão adversarial deste plano (2026-09-11)

Revisão somente leitura, requisito por requisito, sobre a primeira versão deste documento, no
vocabulário de severidade das revisões anteriores. Veredito: **pronto com correções** — 0 BLOCKER,
4 HIGH, 7 MEDIUM, 11 LOW. Todos os HIGH e MEDIUM estão incorporados acima; os LOW também, exceto
onde dito.

| # | Sev. | Achado | Disposição |
|---|---|---|---|
| H1 | HIGH | `raw-markup.test.ts:223-241` procura a nota "A variante para Uber Tristram" **na carga RSC** dentro de um `strong` serializado; com a decisão 1 a nota viaja como string e o gate fica vermelho sem dono | **Corrigido.** C12b; arquivo atribuído à frente 3; a asserção passa a ser "string no payload + `<strong>` renderizado pela ilha no navegador" |
| H2 | HIGH | `build-tier-state.test.ts:132,257` exige zero `role=tab`/`tablist` **na página inteira**, a 390, numa build com árvore | **Corrigido.** C12c; asserção escopada ao controle de tier; R-A11Y-3 admite `tab` com painéis exclusivos |
| H3 | HIGH | O orçamento ≤ 900 não fechava: o `theme` da tree (≈ 137 px a 320 na Summoning pt-BR) e a altura real de "Meu nível" (80–100 px) estavam fora da conta; "inline com o cabeçalho" contradizia §6 | **Corrigido.** Decisão 10 reescrita: `theme` em `<details>` fechado abaixo de `sm`, `treeHint` sr-only, "Meu nível" numa linha de 44 px ao fim da seção, controle de trees em grade de 3 colunas; §8.1 define a caixa medida (MED-4); §8.2 publica a conta bloco a bloco e a regra de parada |
| H4 | HIGH | O modo glifo oscilava (medir depois de esconder os nomes devolve zero quebras) e o piso CSS de 13em impedia `[data-glyph]` e a faixa de nome com JS | **Corrigido.** Decisão 9: medição em estado-sonda (`data-measuring`), piso escopado a `:not([data-trees-ready])`, C11 afirma o invariante e a convergência; M27 |
| M1 | MEDIUM | M11 não deixava a alcançabilidade abaixo de 24/24 (a continuação horizontal torna-a verdadeira por construção) | **Corrigido.** C4 ganha um controle com grade sintética; M11 reescrita; o relatório publica os 218 movimentos verticais que mudam de destino |
| M2 | MEDIUM | Overlay sem `pointer-events: none` engoliria os toques | **Corrigido.** §5.5: primeiro filho, `pointer-events: none`, `z-index` |
| M3 | MEDIUM | Fragmento `#<tree>` abaixo de `sm` caía numa tree escondida | **Corrigido.** Decisão 6: `:has([data-tree]:target)` na CSS e `activeTree` inicializado pelo hash |
| M4 | MEDIUM | "Seção ≤ 900" nas builds media as tabelas pré-existentes | **Corrigido.** §8.1 |
| M5 | MEDIUM | O `<h3>` por tree não estava no contrato e o `heading-snapshot.json` depende dele | **Corrigido.** §5.5 (linha "cabeçalho da tree") |
| M6 | MEDIUM | "Opcional" deixava de ser distinguível no nó | **Corrigido.** Decisão 13: pílula tracejada para `flex`, `legendOptional`, mudança registrada |
| M7 | MEDIUM | "Zero CLS numa chegada por `#skills`" não era medido; o controle de nível inserido acima da grade seria um shift real | **Corrigido.** Controle ao fim da seção; C2 mede `layout-shift` em `#skills` |
| L1 | LOW | `contrast`/`sheet` fazem `readFileSync` do componente no topo — crashariam em vez de ficar RED | **Corrigido.** C14/C16 |
| L2 | LOW | C1 pedia os quatro estados no HTML servido; `locked` não existe no SSR | **Corrigido.** C1 |
| L3 | LOW | `missileSynergies` ausentes do painel | **Corrigido.** §5.1 `missileIn/Out` |
| L4 | LOW | `<style>` em `<noscript>` no `<body>` é não conformante | **Corrigido.** Decisão 6: `@media … and (scripting: enabled)`, medido sob `Emulation.setScriptExecutionDisabled` |
| L5 | LOW | `aria-expanded` deveria seguir `selected`, não `preview` | **Corrigido.** Decisão 16 |
| L6 | LOW | JS de cliente sem teto | **Incorporado como publicação** (§8): delta impresso, sem teto duro — R-TREE-17 pede "não além do necessário", e um número fixo seria uma hipótese |
| L7 | LOW | C6 assumia `(hover: hover)` falso sob emulação móvel sem o controle | **Corrigido.** C6b |
| L8 | LOW | `locale-switch.test.ts:616-617` atribui à "Phase 4" a corrida de `#skills` | **Corrigido.** Frente 3 atualiza o comentário; a corrida era do `#builds` (Fase 2 §10) |
| L9 | LOW | O leitor sem JS perde o resumo por skill do `<noscript>` | **Registrado.** Decisão 17 |
| L10 | LOW | T21 aceitava ≥ 24 px nas abas; §7 promete 44 | **Corrigido.** 44 × 44 em C2 |
| L11 | LOW | Só as arestas adjacentes acendiam | **Corrigido.** Decisão 15, `relatedEdges` |

Lacunas de mutation apontadas pela revisão → M18–M27. **Confirmado pela revisão, sem alteração:**
§3.3 byte a byte no `.next`; a afirmação de §3.4 sobre a carga RSC (`server-and-client-boundary.md`);
as props estimadas em 19–22 KB e a marcação em 35–40 KB (a conclusão de ≈ 230 KB mantém-se); a
decisão 8 contra o grafo real; o mecanismo de subgrid e as margens; `(width < 40rem)` = `sm`;
`em` em media query acompanha `Page.setFontSizes`; papéis ARIA; a enumeração dinâmica de ilhas em
`client-boundary` (com o aviso de que `CORPUS_MARKERS` inclui `requiredLevel` e `hitShift` — nenhum
arquivo da ilha pode escrevê-los; §5.1 usa `level`); perfis de storage isolados por `Page`; os gates
não afetados (`build-cls`, `nav-discovery`, `build-tier-heights`, `build-filters-html`, `crawl`,
`build-page`, `page-structure`).
