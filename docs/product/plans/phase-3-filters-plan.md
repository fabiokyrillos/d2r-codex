# Plano da Fase 3 — Redesign dos filtros

**Data:** 2026-09-10 · **Baseline:** `a0258b9` (= `origin/main`, worktree limpo) · **PRD:** [`../PRD-vNext.md`](../PRD-vNext.md) §7 (R-FILT-1…17), §12.2, §14 Fase 3
**Escopo:** R-FILT-1…16 e consumo de R-FILT-17; cartão compacto; página de classe; ordenação; busca única.
**Fora:** Fases 4 e 5; sticky bar do leveling; correções da Fase 2; filtros de runewords/itens (6b); tolerância a erro na busca (6c).

> **Para agentes:** este plano é executado por três frentes paralelas com propriedade de arquivos disjunta (§9), sob um coordenador que integra e valida. Os contratos de §4 e §5 são fixos antes de qualquer edição. RED → GREEN em todo contrato; mutations reais em §11.

---

## 1. Resumo executivo

Os filtros hoje são um formulário de 28 caixas antes do primeiro cartão. A Fase 3 os substitui por
**dois controles primários sempre visíveis** (classes como chips com glifo; "Onde você está" como
preferência), **filtros avançados sob demanda** (popover no desktop, a sheet existente no celular),
**contagens condicionais** que impedem qualquer combinação vazia por clique, **ordenação na URL**,
**uma única busca** (a global) e um **cartão compacto**. O estado continua na URL; a preferência
continua em `d2rc.tier`; o HTML estático continua a carregar a lista completa e ganha os chips de
classe como links.

## 2. Verificação do baseline

- `HEAD` = `origin/main` = `a0258b997781baddfb469fdd724c52a538115f1d`; branch `main`; `git status` limpo.
- R-FILT-17 **já resolvido na Fase 0A** (`docs/adr/0004-good-at-threshold.md`, `docs/measurements/rating-distribution.json`, gate `test:rating-distribution`, limiar mantido em 4 sobre 53 builds / 424 notas). Consumido como está; nenhuma remedição.
- Next 16.3.3; `useSearchParams` em rota pré-renderizada renderiza no cliente até o `Suspense` mais próximo, e `window.history.pushState/replaceState` integram-se ao router (docs instaladas: `use-search-params.md`, `04-linking-and-navigating.md` §"Native History API"). É o mecanismo já em uso e permanece.

## 3. O estado atual, medido (build local de `a0258b9`, Chrome headless)

Distância do **topo do documento** ao topo do primeiro cartão (é assim que o PRD §12.2 mediu: os
números batem ao pixel com os baselines publicados), e do topo do `h1`:

| Largura | en-US abs | en-US a partir do h1 | pt-BR abs | bloco de controles | cartão (1º) | cartão mediana |
|---|---|---|---|---|---|---|
| 320 | **490** | +365 | 519 | 88 (sheet fechada) | 406 | 429 |
| 390 | **443** | +318 | 472 | 70 | 315 | 338 |
| 768 | **772** | +647 | 847 | 450 (29 caixas) | 273 | 273 |
| 1280 | **644** | +519 | 703 | 322 (29 caixas) | 273 | 273 |

Página de classe (Sorceress), do cabeçalho "Comece por aqui" ao primeiro cartão: 349/308/386/386 px
(320/390/768/1280, en-US); 400/331/432/476 em pt-BR. Meta R-FILT-15: ≤ 260.

Estados medidos e sem overflow em nenhuma largura: padrão, `?class=sorceress`,
`?class=sorceress,paladin`, preferência `d2rc.tier=budget` (hoje sem efeito na listagem), URL
vazia (`?class=necromancer&damage=cold`), sheet aberta.

**O que a aritmética já diz antes de desenhar.** O `h1` está a 125 px do topo (header 57 + `py-10`
+ eyebrow). Com o bloco de título atual (descrição em `text-lg`, `pb-8`, `mt-8`) os controles só
podem começar a 386 px em 320 px — acima do teto de 300 px que O2 fixa para o primeiro cartão
*antes de existir qualquer controle*. E a Fase 3 **acrescenta** uma linha no celular (o segmento
"Onde você está", 44 px por R-A11Y-4, mais legenda). Consequência: em 320/390 o primeiro cartão
não pode ficar ≤ 300 px absolutos com o bloco de título e o eyebrow atuais. O que este plano faz:
compacta o bloco de título da listagem (descrição em `text-sm`, sem o `pb-8`/`mt-8` duplos),
mede o resultado, gate-a o que foi medido e **reporta a diferença para O2 como decisão do
proprietário** (remover a descrição ou o eyebrow da listagem), sem reescrever o PRD. Os aceites
relativos ao título (R-FILT-1 ≤ 120 px, R-FILT-11 ≤ 220 px, R-FILT-15 ≤ 260 px) são atingíveis e
são gate.

## 4. Decisões do coordenador (dentro do PRD; registradas para o relatório)

1. **Uma busca (R-FILT-8): o campo inline sai.** A busca é a global (Ctrl/Cmd+K, `/`, lupa), que já
   conhece "hdin" pela tabela de apelidos. `q` deixa de existir no estado e na URL (um `?q=` antigo
   passa a ser parâmetro desconhecido e é ignorado sem apagar os válidos). `lib/builds/query-draft.ts`,
   `scripts/query-draft.test.ts`, `test:search-draft` e a seção "Search" de `build-filters.test.ts`
   saem com o campo. Gate novo: nenhum `input[type=search]` nas listagens; "hdin" resolve para
   `hammerdin` pelo índice global — um só caminho.
2. **Nenhuma opção habilitada leva a zero, e nenhuma selecionada fica presa** (R-FILT-4 + M2).
   As duas regras colidem num único caso: `damage=cold,fire` + `class=necromancer` (cold contribui
   0). Desmarcar `fire` deixaria só `cold` → zero. Regra adotada, pura e testada:
   `toggleKeepingResults` — ao remover o **último valor que contribuía** num grupo, os irmãos com
   contagem contextual 0 (já exibidos como `0`, já sem contribuição) são removidos junto, e o grupo
   fica vazio. Adicionar nunca leva a zero (só opções com contagem > 0 são habilitadas). A partir de
   um estado já vazio (URL) nada é podado: o estado vazio é honesto.
3. **"Remover último filtro"** = desfazer a última decisão registrada **nesta sessão** por este
   componente (`pushState`), via `history.back()`, oferecido **só** quando o topo do registro produziu
   a URL atual. Sob a decisão 2 isso só é alcançável de um estado vazio para outro vazio (URL antiga
   → desmarcar algo → aplicar), e é exatamente aí que faz sentido. Para a chegada por URL (o caso
   comum), o estado vazio oferece **"Remover {grupo}"** nomeando o grupo derivado que zerou (regra em
   §5.4) e as até três builds próximas **rotuladas com o que ignoram**. Nada remove um parâmetro
   arbitrário.
4. **Sem JS, `?class=` não estreita a lista** — um site estático não lê a query. Os chips são links
   `?class=<slug>` no HTML servido como o PRD manda (com JS o clique vira toggle); o gate afirma os
   oito links, os slugs ingleses nos dois idiomas, a lista completa e a ausência de qualquer controle
   avançado. A listagem estática por classe continua sendo `/classes/<slug>#builds`. Registrado como
   limitação, não silenciado.
5. **"Para o meu estágio"** (hipótese, R-FILT-5) — critério determinístico: `starter`/`nightmare`/
   `early-hell` → dificuldade (`beginner` < `moderate` < `advanced` < `expert`), depois orçamento
   (`low` < … < `extreme`); `budget` → nota `soloSelfFound` decrescente; `optimized`/`bis` → nota
   `clearSpeed` decrescente. Empate em todos: ordem "Recomendado". Só é aceito em `?sort=` quando há
   preferência; sem ela, `sort=stage` é valor desconhecido → "Recomendado" (a lista de valores
   permitidos de `sort` é passada ao parser como a de qualquer grupo).
6. **Ordenação entra no histórico como decisão** (`pushState`), como um toggle. A preferência de
   estágio nunca entra na URL nem no histórico.
7. **Cartão:** as duas notas mais altas (empate pela ordem de `RATING_AXES`); com "Boa para" ativo,
   os eixos escolhidos (todos, na ordem de `RATING_AXES`). Tags viram uma linha de texto discreto
   (elemento · dificuldade · orçamento). A linha "No seu estágio" só existe com preferência e usa
   `gearSets[tier].slots[0..2].picks[0]` resolvido por `resolveRef` (nome), com `label` como fallback.
8. **Fallback do Suspense passa a carregar os chips de classe** (links) além da lista, para que o
   HTML estático cumpra R-FILT-14 e o crescimento na hidratação caia (hoje 86–428 px; a lista de
   `AnchorRealign` da classe continua a existir).
9. **Terceiro escritor de `d2rc.tier`:** `components/builds/stage-picker.tsx` entra na allowlist
   nominal de `test:hygiene` com a referência R-FILT-2/R-PREF-1. A regra de resolução continua uma
   (em `lib/prefs.ts`). Nenhuma chave nova (R-FILT-10; `IMPLEMENTED_PREF_KEYS` inalterado).
10. **"Classes aguardando" sai** (R-FILT-4/D2): a seção, o cálculo `undocumented` e a chave
    `awaitingTitle` nos dois dicionários.

## 5. Contratos compartilhados (fixos antes das edições)

### 5.1 Modelo — `lib/builds/filter.ts`

```ts
export interface BuildRow {
  slug: string; name: string; classSlug: string;
  damageTypes: string[]; difficulty: string; budget: string;
  goodAt: string[];                       // eixos ≥ GOOD_AT_THRESHOLD
  ratings: Record<RatingAxis, number>;    // os 8 eixos (ordenação)
  stagePicks: Record<ProgressionTier, string[]>; // até 3 nomes por tier (linha do cartão)
}
export const FILTER_GROUPS = ["class","damage","difficulty","budget","goodAt"] as const;
export const ADVANCED_GROUPS = ["damage","difficulty","budget","goodAt"] as const; // popover/sheet
export const SORT_KEYS = ["recommended","stage","easiest","cheapest","name"] as const;
export type SortKey = (typeof SORT_KEYS)[number];
export const DEFAULT_SORT: SortKey = "recommended";
export interface BuildFilterState { class: string[]; damage: string[]; difficulty: string[]; budget: string[]; goodAt: string[]; sort: SortKey }
export const EMPTY_FILTER_STATE: BuildFilterState;            // sort: "recommended"
export function isEmptyState(s): boolean;                      // ignora sort
export function activeCount(s): number;                        // ignora sort
export function advancedCount(s): number;                      // só ADVANCED_GROUPS (badge "Mais filtros (N)")
export type OptionSets = Partial<Record<FilterGroup, readonly string[]>> & { sort?: readonly SortKey[] };
export function parseFilterState(params, options: OptionSets): BuildFilterState; // sort fora de options.sort → DEFAULT_SORT
export function serializeFilterState(s): URLSearchParams;      // omite sort quando DEFAULT_SORT; QUERY_KEYS.sort = "sort"
export function filterQueryString(s): string;
export function matchesFilters(row, s): boolean; export function filterBuilds(rows, s): BuildRow[];
export function toggleValue(s, group, value, allowed): BuildFilterState;           // como hoje
export function toggleKeepingResults(s, group, value, allowed, rows): BuildFilterState; // decisão 2
export function facetCounts(rows, s): Record<FilterGroup, Record<string, number>>;   // AND entre grupos, OR dentro, grupo próprio excluído
export function optionsFor / narrowingOptionsFor / isDiscriminating / shouldOfferFilters // como hoje
```

### 5.2 Ordenação — `lib/builds/sort.ts`

```ts
export function sortBuilds(rows: readonly BuildRow[], sort: SortKey, tier: ProgressionTier | null, locale: string): BuildRow[];
// "recommended": ordem de entrada. "stage" sem tier → ordem de entrada. Estável; empates → ordem de entrada.
export function stageRank(row: BuildRow, tier: ProgressionTier): number[]; // exposto para teste
export function availableSorts(hasTier: boolean): readonly SortKey[];        // sem "stage" quando !hasTier
```

### 5.3 Sheet — `lib/builds/filter-sheet.ts`

`cloneFilterState`, `toggleDraftValue(draft, group, value, allowed, rows)` (usa `toggleKeepingResults`),
`clearFilterDraft` (esvazia só `ADVANCED_GROUPS`; classe e sort ficam), `applyFilterDraft` (round-trip
pela URL), `sheetFilterCount` = `advancedCount`.

### 5.4 Estado vazio — `lib/builds/empty-state.ts`

```ts
export interface Decision { from: string; to: string }   // query strings ("?a=b" ou "")
export function undoAvailable(log: readonly Decision[], current: string): boolean; // log.at(-1)?.to === current
export function zeroingGroup(rows, s): FilterGroup | null;
// entre os grupos com seleção, exceto "class", na ordem FILTER_GROUPS, o primeiro cuja remoção
// sozinha devolve > 0 resultados; se nenhum, o primeiro cuja remoção junto com os anteriores devolve > 0; senão null.
export function nearBuilds(rows, s): { ignoring: FilterGroup; values: string[]; rows: BuildRow[] } | null;
// até 3, na ordem "Recomendado", do estado sem o grupo `ignoring` (classe mantida quando selecionada)
```

### 5.5 DOM (o que os gates de navegador procuram — estável nos dois idiomas)

| Peça | Seletor |
|---|---|
| raiz do painel (hidratado) | `[data-filters][data-filters-ready]` |
| linha de classes | `[data-class-chips]`; chip: `a[data-class]` (estático) / `button[data-class][aria-pressed]` (hidratado); contagem `[data-count]` |
| segmento de estágio | `[data-stage-picker] button[data-tier][aria-pressed]`; limpar `button[data-clear-tier]`; legenda `#stage-legend` |
| "Mais filtros (N)" | `button[data-more-filters][aria-expanded][aria-controls]`; badge `[data-badge]` |
| popover (≥ 640) | `[role="dialog"][data-popover]` (sem `aria-modal`) |
| sheet (< 640) | `[role="dialog"][aria-modal="true"]`; `[data-apply]`, `[data-cancel]`, `[data-close]`, `[data-clear]` |
| grupo avançado | `details[data-group="damage"]` (primeiro `open`); opção `input[type=checkbox][data-group][data-value]` (+ `disabled` em zero não selecionado); contagem `[data-count]` |
| ordenação | `select[data-sort]`; ajuda `button[data-sort-help][aria-expanded]` + `[data-sort-note]` |
| contador | `[data-results][aria-live="polite"]` |
| chips aplicados | `[data-applied] button[data-group][data-value]`; `button[data-clear-all]` (≥ 2 ativos) |
| estado vazio | `[data-empty]`; `button[data-remove-last]`; `button[data-remove-group][data-group]`; `[data-near] a[href]` |
| cartão | `a[data-card][href]`; notas `[data-rating-axis]`; linha de estágio `[data-stage-line]`; tags `[data-tags]` |

Parâmetros de URL: `class, damage, difficulty, budget, goodAt, sort` — ingleses nos dois idiomas.

### 5.6 Dicionários (chaves novas em `builds.filters`, nos dois idiomas no mesmo commit)

`classesLabel`, `stageLegend`, `stageMine` ("Meu estágio: {tier}"), `stageClear`, `stageClearLabel`,
`stageHelp`, `moreFilters`, `moreFiltersOpen` (aria), `sortLabel`, `sortRecommended`, `sortStage`,
`sortEasiest`, `sortCheapest`, `sortName`, `sortHelpLabel`, `sortHelpRecommended`, `sortHelpStage`,
`stageLine` ("No seu estágio:"), `removeLast`, `removeGroup` ("Remover {group}"), `nearTitle`
("Builds próximas, ignorando {group}"), `zeroOption` (aria: "{label}: nenhuma build com os filtros
atuais"). Removidas: `searchLabel`, `searchPlaceholder`, `searchChipPrefix`, `awaitingTitle`.
Ficam: `regionLabel`, `resultsOne/Many`, `activeLabel`, `removeOne`, `clearAll`, `emptyTitle/Body`,
`showFilters`, `sheet*`, `showResults*`, `group*`, `goodAtNote`.

## 6. Arquitetura

- `FilterableBuildList` (servidor) monta `rows` (com `ratings` e `stagePicks`), as opções por grupo
  (com rótulo e, para classe, o glifo), as strings, e renderiza
  `<Suspense fallback={<StaticListing/>}><BuildFilters/></Suspense>`. O fallback é o HTML estático:
  chips de classe como links (só no catálogo) + lista completa.
- `BuildFilters` (cliente) lê a URL por `useSearchParams` (como hoje), escreve por `pushState`,
  calcula `facetCounts`, ordena, e provê `ListingContext { focusAxes, tier }` para os cartões.
- Cartão (`BuildCard`, servidor) contém duas ilhas mínimas: `CardRatings` (lê `focusAxes`) e
  `StageLine` (lê `tier`). Ambas rendem o mesmo no servidor e na primeira hidratação (sem preferência
  e sem foco), sem mismatch.
- `StagePicker` (cliente; escritor permitido) grava `d2rc.tier` e informa `BuildFilters`, que
  re-renderiza cartões, habilita "Para o meu estágio" e **nada mais** (contagens e resultados
  intocados — gate).
- `FilterPopover` (≥ 640): `role="dialog"` não modal, foco no primeiro grupo ao abrir, Esc e
  clique fora fecham e devolvem o foco ao gatilho; aplica ao vivo (um `pushState` por toque).
- `MobileFilterSheet` (< 640): preservada — rascunho, "Mostrar N builds", foco preso, scroll
  travado, Esc/fundo cancelam — passa a conter só `ADVANCED_GROUPS`, com contagens condicionais
  do rascunho e opções em zero desabilitadas.
- `FilterGroups` (compartilhado por popover e sheet): `<details>` por grupo, primeiro aberto;
  linha = `<label>` com checkbox (28 px), rótulo, contagem; `disabled` + `0` visível quando a
  contagem é 0 e a opção não está selecionada.

## 7. Direção visual (skill `frontend-design`, dentro do design system)

- **Hierarquia por peso, não por caixa.** Chips de classe = controle primário: `rounded-md`,
  fundo `surface-raised`, borda transparente; glifo (SVG geométrico próprio, `currentColor`, mesma
  mão de `skill-sigil.tsx`), nome em `text-sm`, contagem em `font-mono text-xs text-ink-subtle`.
  Pressed: borda `ember`, fundo `ember-dim/10`, glifo e nome em `ember-bright`. Zero: opacidade 50%
  + `disabled`, contagem `0` visível. Foco: anel de 2 px `ember` (global). ≥ 44 px nos dois eixos.
- **Estágio = mesmo chip da build** (número mono em ember, nome Cinzel), para que o leitor
  reconheça o controle que já usou na build; legenda em `text-sm`; "Limpar" discreto.
- **Disclosure silencioso.** "Mais filtros (N)" é um botão de texto com badge; sort é `<select>`
  nativo estilizado como texto; contador em `text-ink-subtle`. Uma única hairline (`border-b`)
  separa controles de resultados.
- **Mobile:** ambas as linhas de chips rolam com fade de 12 px (máscara só quando há overflow
  real, `contain: paint`), chip ativo centralizado; nada é truncado sem `aria-label`.
- **Cartão** alinhado ao de runeword: nome em Cinzel `text-lg`, uma borda, tags como texto,
  duas notas em pips, linha de estágio em `text-xs`. Sem badges com borda dentro do cartão.
- **Movimento:** nenhum novo; `prefers-reduced-motion` respeitado onde já há transição de cor.

## 8. Dimensões e aceite numérico (gate em `test:viewport` e no gate novo de dobra)

| Métrica | Baseline | Meta PRD | Gate |
|---|---|---|---|
| chips de classe abaixo do `h1` (borda inferior do h1 → topo dos chips) | — | ≤ 120 px em 320/390/768/1280 | ≤ 120 |
| grade abaixo do `h1` a 1280 | +519 | ≤ 220 | ≤ 220 |
| 1º cartão da classe abaixo de "Comece por aqui" | 308–476 | ≤ 260 | ≤ 260 |
| 1º cartão, absoluto, 320/390/768/1280 | 490/443/772/644 | ≤ 300/300/360/220 | **medido e publicado**; teto de regressão = medido + 5 % |
| altura do cartão a 390 (en/pt, padrão) | 315 / 386 | ≤ 80 % (252 / 309) | ≤ 252 / ≤ 309 |
| combinações vazias por controle habilitado | todas | 0 | `facetCounts` + navegador |
| alvos: chips de classe e de estágio | — | ≥ 44×44 | viewport |
| alvos: linhas do popover/sheet | 28 px | ≥ 24 | viewport |
| overflow horizontal | 0 | 0 | viewport (todas as larguras, estados novos) |

## 9. Propriedade de arquivos

| Frente | Cria | Modifica | Não toca |
|---|---|---|---|
| **1 · Modelo** | `lib/builds/sort.ts`, `lib/builds/empty-state.ts`, `scripts/facet-counts.test.ts`, `scripts/build-sort.test.ts` | `lib/builds/filter.ts`, `lib/builds/filter-sheet.ts`, `lib/builds/rows.ts`, `scripts/build-filters.test.ts` | componentes, páginas, dicionários |
| **2 · Visual** | `components/builds/{class-glyph,class-chip,static-listing,build-card,card-ratings,stage-line,stage-picker,filter-popover,filter-groups,listing-context}.tsx` | `components/builds/{build-filters,filterable-build-list,mobile-filter-sheet}.tsx`, `app/[lang]/builds/page.tsx`, `app/[lang]/classes/[slug]/page.tsx`, `app/globals.css`, `lib/i18n/dictionaries/{en-us,pt-br}.ts` | `lib/builds/*`, `scripts/*` |
| **3 · Mobile/A11y/Resiliência** | `scripts/filters-desktop.test.ts`, `scripts/filters-fold.test.ts` | `scripts/{mobile-filter-sheet,build-filters-html,viewport,hygiene,search-aliases}.test.ts`, `package.json` (scripts), `scripts/client-boundary.test.ts` se necessário | `lib/`, `components/`, `app/` |
| **Coordenador** | `docs/product/plans/phase-3-{filters-plan,report}.md`, capturas | `docs/product/PRD-vNext.md` (§18 e notas), remoção de `lib/builds/query-draft.ts` + `scripts/query-draft.test.ts` | — |

## 10. Tarefas (cada uma: teste vermelho → implementação → verde → commit)

**Frente 1.** T1 `BuildRow` + `rows.ts` (`ratings`, `stagePicks`; remove `summary/className/aliases`). T2 `sort` no estado, parse/serialize, `QUERY_KEYS.sort`, `availableSorts`. T3 `facetCounts` (+ controles: exclusão do próprio grupo quebrada; contagens estáticas). T4 `toggleKeepingResults`. T5 `sort.ts` (5 ordenações, empates, "Recomendado" inalterado com preferência; controle: Recomendado mudando com preferência). T6 `empty-state.ts`. T7 `filter-sheet.ts` ajustado. T8 poda das seções de busca em `build-filters.test.ts`.

**Frente 2.** T9 `class-glyph` + `class-chip`. T10 `static-listing` + `filterable-build-list` (fallback com links). T11 `build-filters` (duas linhas; chips; contagens; aplicados; sort + `?`; contador). T12 `stage-picker` + `listing-context` + `stage-line`. T13 `filter-groups` + `filter-popover`. T14 `mobile-filter-sheet` (só avançados; rascunho com contagens). T15 estado vazio. T16 `build-card` + `card-ratings` + páginas + cabeçalho compacto. T17 dicionários + `globals.css`.

**Frente 3.** T18 `build-filters-html` (links estáticos, ausência de controles). T19 `mobile-filter-sheet` reescrito para o DOM novo (rascunho/apply/cancel/contagens/zero/foco/scroll/Back-Forward/uma entrada). T20 `filters-desktop` (popover; toggle → pushState; Back/Forward; sort; preferência não filtra; "stage" indisponível sem preferência; teclado; sem JS; `localStorage` só `d2rc.tier`; busca única; texto 200 %; reduced motion; classe). T21 `filters-fold` (§8) + `viewport` adaptado. T22 `hygiene` (allowlist), `search-aliases` ("hdin"), `package.json`.

## 11. Mutations (cada uma aplicada, medida, revertida com `git checkout --`, worktree confirmado)

| # | Mutação | Gate que tem de ficar vermelho |
|---|---|---|
| M1 | `facetCounts` deixa de excluir o próprio grupo | `test:facet-counts` |
| M2 | `filterBuilds` passa a excluir builds fora do tier preferido | `test:filters-desktop` (preferência não filtra) |
| M3 | contagens estáticas (`optionsFor` no lugar de `facetCounts`) | `test:facet-counts` + `test:filters-desktop` |
| M4 | "Recomendado" reordena com preferência | `test:build-sort` |
| M5 | estado memoizado na primeira renderização (Back/Forward ignorado) | `test:filters-desktop` / `test:mobile-filter-sheet` |
| M6 | toggle da sheet escreve `pushState` imediatamente | `test:mobile-filter-sheet` |
| M7 | cartão antigo restaurado (quatro notas + badges) | `test:filters-fold` (altura ≤ 80 %) |
| M8 | `toggleKeepingResults` vira `toggleValue` | `test:build-filters` |
| M9 | opção em zero deixa de ser `disabled` | `test:filters-desktop` |
| M10 | chips de classe removidos do fallback | `test:build-filters-html` |

## 12. Commits (pequenos, atômicos, na ordem de integração)

1. modelo: linhas, sort, facetas, toggle guardado, estado vazio + testes puros (RED registrado antes)
2. remoção da busca inline (arquivo, teste, script) + dicionários
3. componentes: glifos, chips, fallback estático, cartão
4. componentes: painel, estágio, popover, sheet, estado vazio
5. páginas + CSS + dicionários
6. gates de navegador e de HTML; `package.json`
7. mutations registradas; plano/relatório; PRD §18

## 13. Publicação

`npm run predeploy` com `NEXT_PUBLIC_SITE_URL=https://d2r-codex.vercel.app` (log com `EXIT=` lido de
volta); `git diff --check`; worktree limpo; push normal para `main`; esperar o deployment do SHA
pela API do GitHub; smoke público nos dois idiomas (filtros, sort, URLs, páginas de classe, ausência
de `localhost`).

## 14. Riscos

- A sheet: mitigado por manter `MobileFilterSheet` e seus testes, trocando só o conteúdo.
- Crescimento na hidratação: reduzido pelo fallback com chips; medido e publicado.
- pt-BR mais largo em todos os rótulos ("Início do Hell", "Mais filtros"): medido nas quatro larguras.
- O2 em 320/390: insatisfazível com o cabeçalho atual (§3); reportado, não silenciado.
