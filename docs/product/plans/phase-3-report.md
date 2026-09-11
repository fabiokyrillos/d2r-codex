# Fase 3 — relatório factual

**Data:** 2026-09-11 · **Baseline:** `a0258b9` · **Plano:** [`phase-3-filters-plan.md`](phase-3-filters-plan.md) · **Evidência visual:** [`phase-3-visual/`](phase-3-visual/README.md)
**Estado:** **concluída** — aprovada pelo proprietário em 2026-09-11 com as decisões D1–D7 e fechada com a UAT de §13. Produção: `505310e` (deployment `6388024744`). **A Fase 4 não começou.**
**Escopo:** R-FILT-1…16, consumo de R-FILT-17, cartão, página de classe, ordenação, busca única. **As Fases 4 e 5 não foram iniciadas.** A sticky bar do leveling e as correções da Fase 2 não foram tocadas.

Este documento publica o que foi medido, incluindo onde a medição contraria o PRD — e aqui ela o
contraria em duas metas, ambas por aritmética do conteúdo, ambas registradas no próprio requisito
como decisão do proprietário. Todos os números vêm dos gates da fase, num Chrome real pelo driver do
próprio repositório, contra o build de produção local.

---

## 1. O que mudou para quem usa o site

- **A classe é o primeiro controle e está sempre à vista:** oito chips com um glifo geométrico
  próprio e a contagem **condicional** ao lado — com Frio marcado, Barbarian, Necromancer e Warlock
  leem `0`, ficam desabilitados e continuam legíveis. Seleção múltipla; no celular, a linha rola com
  fade nas bordas e a chip pressionada é centralizada.
- **"Onde você está?"** é uma preferência, no chip que o leitor já conhece da página de build.
  Escolher um estágio grava `d2rc.tier` e faz exatamente duas coisas: habilita a ordenação **"Para
  o meu estágio"** e põe em cada cartão a linha **"No seu estágio: Spirit · Oculus · Vipermagi"**.
  Nunca esconde uma build, nunca muda uma contagem, nunca entra na URL. A frase que diz isso
  aparece no momento em que a pergunta surge — depois de escolher.
- **Os filtros avançados saíram da primeira dobra:** "Mais filtros (N)" abre um popover não modal
  no desktop e a sheet que já existia no celular — rascunho, "Mostrar N builds" ao vivo, uma entrada
  de histórico ao aplicar, Escape/fundo cancelam. Grupos colapsáveis, o primeiro aberto; contagens
  condicionais também dentro do rascunho; opção em zero desabilitada com o `0` visível; opção
  marcada nunca desabilitada.
- **Ordenação na URL** (`?sort=`): Recomendado (padrão, sempre), Para o meu estágio, Mais fáceis,
  Mais baratas, Nome A–Z, com um `?` que explica Recomendado e Para o meu estágio em uma frase cada.
- **Uma busca só.** O campo "Nome, classe ou apelido" saiu; a lupa/Ctrl K é a busca.
- **Chips aplicados na própria linha de controles**, com ✕ e "Limpar tudo" a partir de dois filtros.
- **Estado vazio só por URL**, com "Remover {grupo}" nomeando o que zerou, "Limpar tudo" e até três
  builds próximas **rotuladas com o que ignoram**; "Remover último filtro" quando há de fato uma
  decisão desta sessão a desfazer.
- **Cartão compacto:** duas notas (as duas mais altas, ou os eixos escolhidos em "Boa para"), tags
  como uma linha de texto, uma borda, a linha de estágio quando há preferência.
- **Página de classe** com o mesmo padrão, sem chips de classe.
- A seção "Classes aguardando guias de build" e a descrição visível do topo de `/builds` saíram (a
  meta description é a mesma).

## 2. Antes e depois

Topo do documento → topo do primeiro cartão (a definição do PRD §12.2; os números de baseline
batem ao pixel com os publicados lá):

| Largura | antes en / pt | depois en / pt | meta PRD (O2) | redução |
|---|---|---|---|---|
| 320 | 490 / 519 | **401 / 401** | ≤ 300 | −18 % / −23 % |
| 390 | 443 / 472 | **401 / 401** | ≤ 300 | −9 % / −15 % |
| 768 | 772 / 847 | **428 / 456** | ≤ 360 | −45 % / −46 % |
| 1280 | 644 / 703 | **336 / 336** | ≤ 220 | −48 % / −52 % |

Os aceites **relativos ao título**, que são os de R-FILT-1, 11 e 15, todos medidos e verdes:

| Métrica | antes | depois | meta |
|---|---|---|---|
| chips de classe abaixo da borda inferior do `h1` (320/390/768/1280, en e pt) | — | **29 px** em todas | ≤ 120 |
| grade abaixo do topo do `h1` a 1280 | +519 | **+211** | ≤ 220 |
| classe, "Comece por aqui" → 1º cartão de build a 768/1280 | 386/386 (en) · 432/476 (pt) | **165/153 (en) · 193/165 (pt)** | ≤ 260 |
| classe, idem a 320/390 | 349/308 (en) · 400/331 (pt) | **394/371 (en) · 445/394 (pt)** | ≤ 260 — **não alcançável** (§9) |
| cartão a 390, 1º do catálogo | 315 (en) · 386 (pt) | **249 · 272** | ≤ 252 · ≤ 309 (80 %) |
| cartão a 390, mediana do catálogo | 338 · 363 | **272 · 272** | — |
| caixas de seleção visíveis por padrão | 29 (≥ 640) | **0** | 0 |
| combinações vazias alcançáveis por controle habilitado | todas | **0** (263 estados amostrados, 4.683 cliques de adição, 1.258 de remoção; e no navegador) | 0 |
| overflow horizontal | 0 | **0** em 48 combinações de idioma × largura × estado | 0 |
| chaves novas em `localStorage` | 0 | **0** (`d2rc.tier` continua a única) | 0 |

**Onde a Fase 3 não chega, e por quê.** O2 pede o primeiro cartão a ≤ 300 px absolutos no celular.
Header (57) + `py-10` + eyebrow + título terminam a **216 px** a 320 px antes de qualquer controle;
R-FILT-1 exige a linha de classes aí, R-FILT-2 exige uma linha de estágio de 44 px (R-A11Y-4) mais
legenda, e R-FILT-11 uma linha de ferramentas. A soma dá 401. Chegar a 300 exige tirar o eyebrow
ou a linha de estágio do celular: **decisão do proprietário**, registrada em §12.2 do PRD, não
defeito do código. O gate segura o medido × 1,05 e imprime a meta ao lado em toda execução.

## 3. R-FILT-1…17, com evidência

| Req. | Estado | Evidência |
|---|---|---|
| R-FILT-1 chips de classe | ✅ | 8 chips, glifo, contagem, múltipla seleção, rolagem+fade; 29 px abaixo do título — `test:filters-fold`, `test:filters-desktop`, `test:build-filters-html` |
| R-FILT-2 "Onde você está" | ✅ (forma curta dos tiers — nota no PRD) | grava só `d2rc.tier`; URL, histórico, resultados e todas as `[data-count]` inalterados (snapshot antes/depois); linha em todos os cartões; ausente sem JS — `test:filters-desktop`, `test:build-filters-html`, `test:prefs` |
| R-FILT-3 avançados sob demanda | ✅ | 0 caixas visíveis fora de um diálogo em todas as larguras; `details` por grupo, primeiro aberto; badge — `test:filters-fold`, `test:filters-desktop` |
| R-FILT-4 contagens e estado vazio | ✅ (regra do toggle e "Remover {grupo}" — nota no PRD) | `facetCounts` (38), `toggleKeepingResults` (em `build-filters`, 228), `empty-state` (45); no navegador: zero desabilitado e visível, vazio só por URL, "Remover {grupo}" devolve resultados, ≤ 3 próximas da mesma classe, "Remover último filtro" só após decisão desta sessão |
| R-FILT-5 ordenação | ✅ | `build-sort` (60): cinco ordens, estáveis, Recomendado idêntico com e sem tier (controle M4); `?sort=` na URL; `?` presente; `stage` retido sem preferência — `test:filters-desktop` |
| R-FILT-6 chips aplicados | ✅ | `[data-applied]` na linha de controles; ✕ remove um (um `pushState`); "Limpar tudo" só com ≥ 2 |
| R-FILT-7 | absorvido em 4 | — |
| R-FILT-8 uma busca | ✅ | campo removido; `q` extinto; nenhum `input[type=search]` nas listagens; nenhum componente de listagem importa o pontuador; "hdin" → `hammerdin` pelo índice global (2º lugar; §9) — `test:search` |
| R-FILT-9 URL e histórico | ✅ | toggle/sort/apply/remover/limpar = um `pushState` cada; nada digita (não há campo); nomes ingleses nos dois idiomas; desconhecidos ignorados sem apagar válidos; Back/Forward restauram URL, controles e lista (M5) — `build-filters`, `filters-desktop`, `mobile-filter-sheet` |
| R-FILT-10 persistência | ✅ | `Object.keys(localStorage) ⊆ {d2rc.tier}` ao fim de cada sessão de gate; `IMPLEMENTED_PREF_KEYS` inalterado |
| R-FILT-11 desktop | ✅ | duas linhas; grade a +211 px do título a 1280 |
| R-FILT-12 sheet | ✅ | preservada, só grupos avançados, rascunho com contagens vivas, uma entrada ao aplicar, foco preso, scroll travado, Esc/fundo cancelam, foco de volta — `test:mobile-filter-sheet` (290) |
| R-FILT-13 acessibilidade | ✅ | chips `button[aria-pressed]`; popover `role=dialog` sem `aria-modal`, foco gerido, Escape devolve ao gatilho; ordenação `<select>` nativo; contador `aria-live=polite`; picker com roving tabindex e `role=status` só na escolha |
| R-FILT-14 sem JS | ✅ com limitação registrada | oito `a[data-class][href=?class=…]` no HTML servido, lista completa, nenhum formulário/caixa/select/diálogo; `?class=` estático não estreita (nota no PRD) — `test:build-filters-html` (305) |
| R-FILT-15 página de classe | ✅ a 768/1280; **não alcançável** a 320/390 | 153–193 px / 371–445 px (§9) |
| R-FILT-16 cartão | ✅ | 249/272 px a 390 (tetos 252/309); duas notas ou os eixos escolhidos; tags em texto |
| R-FILT-17 limiar | consumido | ADR 0004; `test:rating-distribution` verde; limiar 4 sobre 53 builds |

## 4. Facetas

`facetCounts(rows, state)`: para cada grupo G, o contexto são as linhas que satisfazem as seleções
de **todos os outros grupos** (AND); a contagem de um valor v em G é quantas linhas do contexto
carregam v (OR dentro de G, porque a própria seleção de G é ignorada). Toda opção presente nas
linhas tem entrada, com `0` permitido. Poda de facetas não discriminantes mantida como estava.

`toggleKeepingResults`: adicionar nunca poda (só opções com contagem > 0 estão habilitadas, e uma
adição por controle obsoleto é honrada); remover o último valor que contribuía num grupo cujos
irmãos marcados estão todos em `0` esvazia o grupo; de um estado já vazio nada é podado. É a única
forma de toggle nas três superfícies (chips, popover, sheet).

Invariante afirmado sobre 263 estados amostrados (vazio, cada classe, cada dano, pares
classe×dano, 200 pseudo-aleatórios): toda opção com contagem > 0 leva a > 0 resultados; toda
remoção a partir de um estado com resultados leva a > 0 resultados.

## 5. Ordenações

| `?sort=` | Critério | Empate |
|---|---|---|
| `recommended` (padrão, omitido) | ordem de entrada — a editorial do catálogo; **não** muda com preferência | — |
| `stage` (só com `d2rc.tier`) | `starter`/`nightmare`/`early-hell`: dificuldade (`beginner`<`moderate`<`advanced`<`expert`), depois orçamento (`low`<…<`extreme`); `budget`: `soloSelfFound` decrescente; `optimized`/`bis`: `clearSpeed` decrescente | ordem de entrada |
| `easiest` | dificuldade crescente | ordem de entrada |
| `cheapest` | orçamento crescente | ordem de entrada |
| `name` | `Intl.Collator(locale, {sensitivity:"base"})` | ordem de entrada |

Estável por construção (o comparador desempata pelo índice de entrada). `?sort=stage` sem
preferência é valor desconhecido → Recomendado, sem gravar nada. **"Para o meu estágio" continua
hipótese de produto** até a sessão do proprietário.

## 6. A busca

O campo inline saiu (decisão registrada em R-FILT-8). Sem um segundo caminho não há divergência a
medir; o que o gate afirma é que não existe segundo caminho (nenhum `input[type=search]` nas
listagens, nenhum import do pontuador em `components/builds/`) e que o índice global resolve "hdin".
Fato encontrado pelo gate: **FoHdin pontua acima de Hammerdin** para "hdin" (substring do nome 250 >
apelido 120). É do pontuador (6c) e fica registrado para o proprietário.

## 7. Validação

- **Desktop (1280, popover também a 768):** `test:filters-desktop`, 430 asserções × 2 idiomas.
- **Mobile (320/360/375/390):** `test:mobile-filter-sheet`, 290; `test:filters-fold`, 112;
  `test:viewport`, 905 (+55) com as superfícies novas: filtrado, vazio por combinação derivada dos
  dados, sheet aberta, popover aberto, preferência gravada.
- **A11y:** roles/aria acima; alvos ≥ 44 px em chips de classe e de estágio, ≥ 24 px nas linhas dos
  grupos; teclado (Tab, Enter/Espaço, Escape devolve o foco); `prefers-reduced-motion` emulado;
  texto a 200 % a 1280 sem transbordo do documento fora do header (que já transbordava antes, §9).
- **Sem JS:** HTML servido lido com scripts removidos (305) e navegação real com script desligado.
- **Bilíngue:** todo gate corre nos dois idiomas; pt-BR é o caso mais largo em todos os rótulos.
- **Hidratação:** zero erro e zero aviso no console em 48 combinações (`phase-3-visual/index.txt`).

## 8. Mutations: 10 aplicadas, 10 vermelhas, 10 revertidas com `git checkout --` e árvore confirmada

| # | Mutação | Gate | Resultado |
|---|---|---|---|
| M1 | `facetCounts` deixa de excluir o próprio grupo | `facet-counts` | 30 ok / **8 FAIL** |
| M2 | resultados filtrados pelo tier preferido | `filters-desktop` | 416 / **14 FAIL** ("the results did not move") |
| M3 | contagens estáticas (`facetCounts(rows, EMPTY)`) | `filters-desktop` | 408 / **20 FAIL** |
| M4 | Recomendado reordena com preferência | `build-sort` | 57 / **3 FAIL** |
| M5 | estado lido uma vez de `location` (Back/Forward ignorados) | `filters-desktop` | 346 / **84 FAIL** |
| M6 | toque na sheet aplica imediatamente | `mobile-filter-sheet` | 222 / **68 FAIL** |
| M7 | cartão com as oito notas (orçamento de altura) | `filters-fold` | 110 / **2 FAIL** (441 px > 252) |
| M8 | `toggleKeepingResults` vira `toggleValue` | `build-filters` | 225 / **3 FAIL** |
| M9 | opção em zero deixa de ser `disabled` (grupos e chips) | `filters-desktop` | 421 / **9 FAIL** |
| M10 | chips removidos do fallback estático | `build-filters-html` | 297 / **8 FAIL** |

Uma primeira forma de M10 (`{false && …}`) não compilou e **não conta**: um build vermelho não é
um gate a apanhar nada; a forma que conta remove os chips com o tipo intacto.

## 9. Ressalvas honestas

1. **O2 a 320/390 e R-FILT-15 abaixo de 640 px não são alcançados**, por aritmética do conteúdo
   (§2 e a nota em R-FILT-15). Gates seguram o medido × 1,05; decisão do proprietário.
2. **A descrição visível de `/builds` saiu** (meta inalterada). Com ela, R-FILT-1 e R-FILT-11 não
   fecham. Reversível passando `description` de volta; para o proprietário decidir.
3. **Os tiers no segmento usam a forma curta em todas as larguras** (NM, Hell, BiS…), com a longa no
   nome acessível e na legenda; a longa não cabe na linha a 1280 em pt-BR.
4. **"Para o meu estágio"** é hipótese até a sessão J1/J2/J10; o critério está publicado em §5.
5. **"hdin"** encontra Hammerdin em segundo lugar; é do pontuador (6c).
6. **Sem JS, `?class=` não estreita a lista** — um site estático não lê a query; os links existem e
   levam a uma página inteira; `/classes/<slug>#builds` é a listagem estática por classe.
7. **Os cartões cruzam para o cliente como uma promessa** (`use(data)`): partilhados entre o
   fallback do Suspense e os filhos como prop simples, o React Flight escreve uma referência de
   caminho para a mesma linha e toda página de classe ficava no fallback para sempre, sem erro.
   Medido, documentado em `filterable-build-list.tsx`; renderizar os cartões duas vezes custaria
   +150 KB de HTML no catálogo.
8. **O header a texto ampliado continua a transbordar** a 150/200 % em larguras estreitas — o gate
   mede o documento sem o header, como registra a Fase 2 §10.10; não é desta fase.
9. **`history.length` tem teto de 50 por aba no Chrome**; os gates navegam por `location.replace`
   depois da primeira carga para que "exatamente uma entrada" continue a significar isso.

## 10. Gates

Puros (`npm run check`): `build-filters` 228, `facet-counts` 38 (novo), `build-sort` 60 (novo),
`empty-state` 45 (novo), `prefs` 75, `hygiene` 35 (allowlist com três escritores), `search` 190
(seção "uma busca"), `dictionary` 42, mais os existentes; `typecheck` e `lint` verdes (o único
aviso é pré-existente em `scripts/leveling-rules.ts`).

Construídos (`npm run check:built`, 28 gates, `EXIT=0`): `build-filters-html` 305,
`mobile-filter-sheet` 290, `filters-desktop` 430 (novo), `filters-fold` 112 (novo), `viewport` 905,
`nav-discovery` 461, `locale-switch` 242, `build-tier-state` 141, `build-cls` 15,
`build-tier-heights` 272, `crawl` 55 sobre 1.004 páginas, `client` 12, e os demais inalterados.

`test:search-draft` e `scripts/query-draft.test.ts` saíram com o campo que testavam.

## 11. Commits

| SHA | |
|---|---|
| `aa198dc` | commit 0: o plano e a baseline medida |
| `d58bbd7` | commit 1: testes vermelhos de facetas, ordenação, toggle guardado e estado vazio |
| `41f65ff` | commit 2: o modelo |
| `a11b283` | commit 3: os gates, vermelhos contra a listagem que substituem |
| `0e1336d` | commit 4: `setReducedMotion` no harness |
| `7ba8a05` | commit 5: o redesign |
| `0333f09` | commit 6: gates calibrados no build integrado |
| `8ebd7ec` | commit 7: estágio guardado centralizado ao chegar |
| *(este)* | commit 8: o registro — plano corrigido, PRD, este relatório, evidência visual |

## 12. Publicação

Procedimento: `npm run predeploy` com `NEXT_PUBLIC_SITE_URL=https://d2r-codex.vercel.app`, com o
`EXIT=` lido de volta do log; `git diff --check`; árvore limpa; `git push` normal para `main`;
espera pelo deployment do SHA exato pela API de deployments do GitHub; smoke público nos dois
idiomas (chips, popover/sheet, `?class=`, `?sort=`, URL vazia, página de classe, ausência de
`localhost` no HTML servido). O SHA publicado, o deployment e o resultado do smoke ficam no
registro de publicação que sucede este relatório (§12.1), escrito só depois de a produção servir o
SHA — nunca antes.

### 12.1 Registro de publicação (2026-09-11)

- `npm run predeploy` com `NEXT_PUBLIC_SITE_URL=https://d2r-codex.vercel.app`: **`EXIT=0`**, 70
  scripts, 0 linhas `FAIL`, `check:site-url` em modo `production (strict)` verde; `git diff --check`
  limpo; árvore limpa.
- **SHA publicado: `505310e0a81ba891e47a8f1be214e30808f2c802`** (`git push origin main`,
  `a0258b9..505310e`, nove commits).
- **Deployment (GitHub deployments API): `6388024744`**, ambiente `Production`, `state=success`
  para exatamente esse SHA, `2026-09-11T06:49:28Z`.
- **Smoke público** (`https://d2r-codex.vercel.app`, Chrome headless, nos dois idiomas): **58 de 58**
  — HTML servido com os oito links `?class=`, sem caixa de busca, sem `localhost`, canonical
  absoluto, 53 links de build; hidratação; chip → `?class=sorceress` em uma entrada; popover não
  modal com zeros desabilitados (`magic,poison` com Sorceress) e Escape devolvendo o foco;
  `?sort=name` com cartões em ordem alfabética; Back e Forward; estágio gravando só `d2rc.tier` e
  a linha em todos os cartões; URL vazia com "Remover {grupo}" e builds próximas; página de classe
  sem chips e com estágio; zero erro/aviso de console; a sheet a 390 modal, com rascunho e um
  `pushState` ao aplicar; sem overflow.
- Este registro é o commit seguinte a `505310e` e não altera o site construído.

## 13. Fechamento (2026-09-11): decisões do proprietário, UAT da produção, achados

Passagem documental e de UAT, **sem alteração de código**: nenhum defeito BLOCKER ou HIGH
introduzido pela Fase 3 foi encontrado, e o proprietário decidiu as três pendências de §9 mais
quatro pontos de leitura. Baseline da passagem: `main` = `origin/main` = `1e85e9b`, árvore limpa,
produção em `505310e`.

### 13.1 As decisões, e onde ficaram registradas

| | Decisão | Registro |
|---|---|---|
| **D1** | Primeiro cartão de `/builds` a 401 px no celular **aceito**; a meta absoluta em 320 e 390 px passa a **≤ 420 px**; os gates medidos ficam (`REGRESSION_CEILING` 422/422/479/353). **768 e 1280 continuam sem decisão** (medido 428/456 e 336 contra 360 e 220; a 1280 o aceite relativo de R-FILT-11 está cumprido com +211) | PRD §12.2, linha D1 |
| **D2** | Na página de classe, o cartão de evolução vem antes do primeiro cartão de build no celular **por decisão**; R-FILT-15 reformulado: ≤ 260 px a partir de 640, uma tela (844 px) abaixo, cartão de evolução nunca contado como build, teto 468 preservado | PRD R-FILT-15 |
| **D3** | Descrição visível de `/builds` **retirada, aceito**. Confirmado em produção nos dois idiomas: `h1` "Build guides"/"Guias de build", contador "53 builds" e as duas linhas de controle; `<title>` "Builds · D2 Codex", `meta description` e `og:description` com o texto original, `og:title`, `canonical` absoluto | PRD R-FILT-11 |
| **D4** | Nomes curtos dos tiers no controle **aceitos**; o completo continua no `sr-only` de cada chip e na legenda "Meu estágio: {tier}". Mostrar a forma longa "onde houver espaço" fica como acompanhamento de código | PRD R-FILT-2 |
| **D5** | "Para o meu estágio" **hipótese validada provisoriamente**; algoritmo intocado | PRD R-FILT-5 |
| **D6** | "hdin" em segundo lugar é **dívida da Fase 6c** (P2.6): apelido exato deve pontuar acima de substring casual | PRD R-FILT-8, §13 P2.6, §14 6c |
| **D7** | Sem JavaScript a listagem por classe é `/classes/<slug>#builds`; `/builds` serve a lista completa e os chips servidos são links `?class=<slug>` que só estreitam com JavaScript. R-FILT-14 reescrito para o comportamento real; **nenhuma** filtragem dinâmica ou infraestrutura sem JavaScript foi criada. Os `href` dos chips servidos **não foram alterados** nesta passagem (continuam `?class=<slug>`) — se o proprietário quiser que apontem para a página de classe sem JavaScript, é uma alteração de código e de gate para a próxima passagem | PRD R-FILT-14 |

As metas substituídas (300 px absolutos no celular; 260 px em todas as larguras na classe; "filtrar
por classe via link" sem JavaScript) ficam registradas no PRD, ao lado das medições, como
substituídas por decisão — não apagadas.

### 13.2 UAT visual read-only da produção

Método: Chrome headless (`--headless=new`) contra `https://d2r-codex.vercel.app`, **64
combinações** — en-US e pt-BR × 320/390/768/1280 × oito estados: listagem, `?sort=name`, filtros
avançados abertos (popover ≥ 640, sheet abaixo, com `?class=sorceress,druid`), preferência gravada
com `?sort=stage`, estado vazio (`?class=necromancer&damage=cold`), página de classe com preferência
e, a 200 % de texto (definição de tamanho de texto do Chrome, `Page.setFontSizes`), a listagem
filtrada e a página de classe. Cada combinação: captura de tela mais medição — overflow do
documento, popover e sheet dentro da viewport e botão "Mostrar N" visível, chips alcançáveis por
rolagem, chip pressionada fora da faixa do fade (12 px), alvos ≥ 44 px, texto cortado dentro de
controle ou cartão, cartões sobrepostos, anel de foco (`:focus-visible`, `outline` sólido de 2 px
ember) e console.

Resultado: **64/64 hidrataram**; **0** sobreposições, **0** chips inalcançáveis, **0** chips
pressionadas sob o fade, **0** alvos < 44 px, **0** popovers ou sheets fora da tela, **0** focos
invisíveis, **0** mensagens de console. Os únicos sinais programáticos: o rótulo "Ordenar"/"Sort",
que é `sr-only` abaixo de 640 px por desenho (o heurístico de corte lê `overflow: hidden` de 1 px),
e o overflow do documento a **200 % de texto** em 320/390/1280, tratado em 13.3. Leitura visual
das capturas em pt-BR a 320/390: quebras de linha, nunca palavras cortadas.

### 13.3 Achados — nenhum BLOCKER ou HIGH; MEDIUM/LOW registrados para outras passagens

| Sev. | Achado | Medição | Destino |
|---|---|---|---|
| MEDIUM | A **200 % de texto** a 320/390 os cartões medem 408 px (en) / 433–434 px (pt) e a linha de ferramentas 331–339 px, além da viewport; a 1280 só o header transborda | **Pré-existente e reduzido**: em `a0258b9`, no mesmo Chrome, a mesma página sem o header já media 426 (en) / 467 (pt) a 320 e os cartões chegavam a 353/436; o `scrollWidth` do documento é **552 nos dois SHAs**, imposto pela linha do header (Fase 2 §10.10). Grid de uma coluna com faixa `auto` cresce até o `min-content` do cartão a 200 % | passagem que recompuser o layout estreito a texto ampliado (o header), fora do escopo desta fase |
| LOW | Linha de estágio "**Spirit · Spirit** · Skin of the Vipermagi" quando a build veste Spirit na arma e no escudo (Fire Ball Meteor, Frozen Orb, Hydra em `early-hell`) | fiel aos dados (`picks[0]` dos três primeiros slots); lê-se como repetição | acompanhamento de conteúdo/UI: prefixar o slot ou agregar ("Spirit ×2") |
| LOW | A 1280 em pt-BR com estágio gravado, o contador "53 builds" quebra para uma segunda linha da linha 2 | sem corte nem sobreposição | polimento na próxima passagem sobre a listagem |
| LOW | A 320 o rodapé da sheet quebra "Limpar filtros" e "Mostrar N builds" em duas linhas; a linha de ferramentas põe o contador numa segunda linha | tudo visível e dentro da tela; comportamento herdado do rodapé anterior | polimento |
| LOW | `test:filters-fold` imprime "PRD target 300" a 320/390, meta substituída por D1 (≤ 420); o comentário do gate diz "three of the four targets are not reached" quando nenhuma das quatro é | rótulo/comentário, sem efeito no veredito | próxima passagem de código (rótulo e comentário) |
| — | **Errata deste relatório e do PRD:** a nota de §12.2 dizia "só 1280 e 768 (en) abaixo da meta"; nenhuma das quatro metas absolutas foi atingida (428/456 > 360; 336 > 220) | corrigida no PRD nesta passagem | — |

Nenhum destes é regressão introduzida pela Fase 3 com impacto HIGH; nenhum código foi alterado.

### 13.4 Estado

`main` = `origin/main` no commit deste fechamento (docs apenas; a implementação em produção
continua `505310e`). Fase 3 **concluída**. **Fase 4 não iniciada.**
