# Fase 2 — relatório factual

**Data:** 2026-09-10 · **Baseline:** `0b5a2bc` · **Plano:** [`phase-2-comparison-orientation-plan.md`](phase-2-comparison-orientation-plan.md)
**Escopo:** R-BUILD-6, R-BUILD-7, R-BUILD-8; R-NAV-1…4; R-I18N-7. **As Fases 3, 4 e 5 não foram iniciadas.**

Este documento publica o que foi medido, incluindo onde a medição contrariou o plano — e nesta fase ela
o contrariou sete vezes. Todos os números vêm dos gates da fase, num Chrome real pelo driver do próprio
repositório, contra o build de produção local.

---

## 1. A comparação, sobre as 53 builds

| | |
|---|---|
| tiers | **318** (53 × 6, nenhuma build incompleta) |
| ocorrências de slot | **2.659** · em `starter`, sem marcador: **290** |
| classificadas | **2.369** = 2.659 − 290, exatamente |
| **novo** | **999** |
| **mantido** | **1.245** |
| **alternativa** | **125** (33 por pick secundário, 92 por `alternatives[]` aninhada) |
| **removido** | **48**, em **30** pares (build, tier) |

`999 + 1.245 + 125 = 2.369`. Nenhum slot escapa da classificação e nenhum tier sai sem marcador.

Por tier de destino:

| | nightmare | early-hell | budget | optimized | bis |
|---|---|---|---|---|---|
| novo | 329 | 279 | 220 | 109 | 62 |
| mantido | 32 | 145 | 252 | 373 | 443 |
| alternativa | 15 | 18 | 41 | 37 | 14 |
| removido | 8 | 36 | 3 | 1 | 0 |

**O plano publicava `budget 2 / optimized 2` nessa última linha.** O real é `budget 3 / optimized 1`: a
única remoção suprimida é `blade-fury budget→optimized`, cujo tier de **destino** é `optimized`, e a
subtração tinha sido feita na coluna errada. Os totais não mudam.

### 1.1 O que se vê, e o que se ouve

| | |
|---|---|
| classificadas | 2.369 |
| **desenhadas** como micro-rótulo | **698** |
| só no leitor de tela ("Mantido") | **454** |
| cobertas por uma linha de maioria | **1.217** |
| linhas de maioria | **161** (97 "mantido", 64 "novo") |
| menor maioria | **3 de 4** — nenhuma frase "1 de 1 slots" |

O plano projetava "1.124 desenhados", que é `999 + 125` — o número **antes** da regra de maioria.

### 1.2 Identidade

`ref.kind + ref.slug`, com `label` normalizado só quando não há `ref`. Medido: **0 divergências** de
marcador entre `getBuilds("en-us")` e `getBuilds("pt-br")` nas 53 builds. A identidade por `label`
diverge **1** vez (`hammerdin/bis/gloves#0`, cujo overlay pt-BR nomeia um item diferente do `ref`, e
que nunca é exibido). 2.685 picks de topo têm `ref`, 834 não; nenhum não tem nem um nem outro; nenhum
slug aparece sob dois `kind`.

### 1.3 A duplicata, e a regra de remoção

`blade-fury/budget` é o **único** (build, tier) do catálogo com slot duplicado: `weapon` ×2, a segunda
ocorrência sendo a décima primeira entrada, depois de `amulet`. É de facto uma entrada de `weaponSwap`
autorada dentro de `slots`, e some em `optimized` — onde o conteúdo continua, no `weaponSwap`.

**O guarda que o plano trazia para isso suprimia zero.** A regra de identidade é `ref` primeiro, então
ele comparava `label:"weapon switch: call to arms and a spirit shield"` com `runeword:call-to-arms`:
strings diferentes **por construção**. Guarda e identidade eram mutuamente exclusivos, e a mutation que
deveria prová-lo era indetectável, porque apagar um no-op não muda saída nenhuma.

A regra que ficou é estrutural: **uma remoção é publicada quando o nome do slot deixa de ter qualquer
ocorrência no tier atual** — que é o que "removido" significa para o leitor. Dispara **uma vez**, na
única build que precisa: 48 remoções em 30 pares, contra 49 em 31 da regra ingênua. E apagá-la muda a
saída, portanto a mutation fica vermelha.

### 1.4 O que os quatro estados não dizem

- **"Mudou de lugar": 17 ocorrências**, sob a definição publicada (a identidade era principal da chave
  K em N; em N+1 não é principal de K; e é principal de outra chave). A investigação reportou 77 e a
  revisão 32, ambas sem método declarado — três números que mediam coisas diferentes. Este publica o
  seu com a definição ao lado. Não vira um quinto marcador: isso quebraria R-BUILD-6.
- **`sockets` e `lookFor` mudados sob "mantido":** 125 + 75 casos, inerentes à redação de R-BUILD-6.

---

## 2. `nextUpgrade` e o BiS terminal

| | |
|---|---|
| tiers com `nextUpgrade` | **273** · sem: **45** |
| **lacunas fora de `bis`** | **ZERO** |
| tiers-fonte da repetição (`starter`…`optimized`) | **265 de 265** têm |

A decisão de BiS terminal cobre exatamente o conjunto das lacunas. **Nenhum dado foi alterado e nenhum
conteúdo foi inventado.**

**Oito builds têm `nextUpgrade` em `bis`, todas começando por "Nothing." / "Nada." — e seis carregam
uma frase real depois disso**, incluindo `blizzard-sorceress` e `hammerdin`, as duas que o PRD nomeia
como baseline. Uma regra que substituísse `bis` por uma string fixa apagaria conteúdo autorado de seis
builds. O que ficou: `bis` nunca recebe um "próximo" derivado nem a afordância ember; o cabeçalho passa
a ser a mensagem terminal; onde o texto existe, continua a ser renderizado sob ela. Em `dragon-tail` e
`whirlwind-assassin` o leitor lê "Configuração final" seguido de "Nada." — redundante, verdadeiro, e
está nas capturas para o proprietário decidir se quer outra coisa.

### 2.1 A forma curta não pode ser derivada

Medido sobre os 265 textos-fonte: extrair nomes de catálogo falha em **103 (38,9%)** — são os tiers
cujo próximo passo não é um item. Truncar pela primeira oração **inverte o conselho** (`"Mosaic — but
only if you can make one"` vira `"Mosaic"`, falso na Ladder); pela primeira frase é no-op para 179 de
273 e descarta a metade qualificadora nos outros 94. Ficou `line-clamp-2` sobre o texto **completo**: o
corte é do navegador, o texto inteiro fica no DOM, no Ctrl+F e no leitor de tela.

---

## 3. Altura

### 3.1 O custo da linha "Próximo:", medido antes de escrever o componente

7 builds × 2 idiomas × {390, 320}, com o texto real de cada tier: **+46 a +47 px por tier**, uniforme
nas 140 células. Pior tier absoluto com a linha: **467 px** (pt-BR `blade-fury/budget` a 320 px).

Como a linha aparece **só no tier compacto seguinte ao expandido**, sem preferência **nenhum tier
cresce**.

### 3.2 As oito constantes de aceite — duas moveram, seis não

| | Fase 1 | Fase 2 | teto | |
|---|---|---|---|---|
| `compactGear` (en) | 2.034 | **2.034** | 2.100 | inalterado, ao pixel |
| `compactPage` (en) | 18.344 | 18.430 | 18.500 | +86, o gatilho do sumário |
| `openGear` (en) | 5.272 | 5.397 | **5.400 → 5.530** | +125 |
| `openPage` (en) | 21.582 | 21.793 | **21.750 → 21.970** | +211 |
| `compactGear` (pt) | 2.146 | **2.146** | 2.220 | inalterado |
| `openGear` (pt) | 5.606 | 5.730 | **5.750 → 5.880** | |
| `openPage` (pt) | 22.601 | 22.811 | **22.800 → 23.020** | |

`compactGear` é **idêntico ao pixel** nos dois idiomas: os marcadores e a linha vivem dentro de um tier
**aberto**, e o desenho de §3.8.1 garante que uma primeira visita não abre nenhum. Por isso
`MIN_GEAR_REDUCTION` — a afirmação **publicada** da Fase 1, os 87,6% de redução da seção Gear — **não
foi tocada nem negociada**.

As duas que moveram subiram exatamente o crescimento medido, preservando a folga que já carregavam.
`openGear` foi elevada apesar de ainda passar: 5.397 contra 5.400 são **três pixels**, e um gate com
três pixels de margem é uma moeda ao ar, não um gate.

Constante nova: **`TIER_CEILING_WITH_NEXT = 510`**, aplicada só ao tier que carrega a linha —
`TIER_CEILING = 460` continua a guardar os outros cinco. 467 × 1,1 ≈ 514 → 510, que é 9,2% contra os
9,5% que o próprio arquivo documenta para `TIER_CEILING`. **A regra que o plano trazia ("medido,
arredondado à dezena") daria 470 — três pixels de folga** e a mesma intermitência; a política do
arquivo prevaleceu sobre a regra escrita antes da medição.

### 3.3 Onde o gatilho do sumário aterra

53 builds × 2 idiomas a 320×640:

| | mín | mediana | máx | além da dobra de 640 |
|---|---|---|---|---|
| as 106 | 593 | 659 | **777** | **84** |
| en-US | 593 | 659 | 748 | 40 |
| pt-BR | 593 | 681 | **777** | 44 |

**A contingência do plano foi avaliada e não resolve.** Ela dizia: se exceder 640 px, o sumário vira
uma linha dentro do bloco do controle. Medido, aí ele aterra a **~693 px** — ainda abaixo da dobra. E a
única posição que o poria na primeira tela é **acima** do controle de tier, que leva as duas piores
páginas a **667 px**, através do teto duro de 640.

**Não existe posição que ponha o controle de tier e o gatilho do sumário na primeira tela nessas
páginas.** É uma impossibilidade medida. O que ficou é a metade deliberada da troca: o controle de
tier está na primeira tela em **todas** as 106; o sumário fica no máximo **137 px** depois dela. O gate
publica a distribuição e assere um teto de regressão de **850 px**. **Item explícito da sessão de UAT.**

---

## 4. Comportamento

### O sumário
Um `<details>` com as onze seções, **servido fechado em todas as larguras**, revelado a partir de
640 px por `::details-content { content-visibility: visible }` sob `@supports`. Abaixo de 640 px é uma
bottom sheet com `role="dialog"`, scrim, foco preso, scroll travado, Escape e fundo fechando, e foco de
volta ao `<summary>`. Sem JS: fechado, e abre nativamente ao toque.

**A primeira versão servia-o aberto e fechava-o por JS abaixo de 640 px** — e isso quebrava as âncoras:
o colapso corre depois da hidratação, que é depois de o navegador ter começado uma rolagem suave de
~1,6 s para o fragmento. Medido: `[data-sections]` ia de 162 px a 38 px, o documento encolhia
**exatamente 124 px**, e `#gear-budget` aterrava a **−52 px, atrás do header fixo**, a 390 px. Agora a
altura não depende de o JavaScript ter corrido: constante ao longo de 109 quadros a 390 px e 112 a
1280 px, e a âncora aterra a 72 px e 112 px.

Piso de suporte declarado: `::details-content` é Chrome 131+, Safari 18.4+, Firefox 139+. Abaixo disso
o leitor de desktop recebe uma divulgação fechada que funciona — um clique a mais, nada inacessível.

**A página de classe não usa esse componente.** Cinco entradas cabem numa linha mesmo a 320 px, não há
tier para refletir, e uma divulgação seriam **duas** interações contra a decisão do proprietário de
"uma interação a partir do topo". Recebe um `<nav>` renderizado no servidor, idêntico com e sem
JavaScript e sem piso de navegador.

### A troca de idioma
Preserva rota, query **e fragmento**. Query-only continua em `router.push`, byte a byte como antes; com
fragmento faz navegação dura, porque a documentação do Next 16 não diz o que `router.push` com
fragmento faz quanto a rolagem, `history.pushState` não dispara `hashchange`, e o script de boot inline
**não corre** numa navegação soft.

Limitações declaradas: cliques com modificador continuam a abrir o caminho puro (deliberado, para que
uma aba nova continue uma aba nova); sem JavaScript o `<a href>` é o caminho puro e o fragmento
perde-se, o que R-A11Y-12 permite; e uma troca com fragmento é agora um recarregamento completo.

**A página de classe corre uma race que não é do switcher.** `#skills` lá aterra a 144 px logo após o
salto e a **572 px (pt-BR) / 482 px (en-US)** depois de a árvore de skills hidratar e crescer o
documento acima dele. Ambas as leituras são de página assente. Um carregamento direto, sem switcher
nenhum, reproduz as duas. É defeito pré-existente da árvore — **Fase 4** — e o gate imprime o desvio em
vez de o asserir, para não fixar uma moeda ao ar nem culpar o switcher.

### Descoberta
Os seis cartões de tier da home são links inteiros para `/builds` (sem parâmetro de query), gravando
`d2rc.tier` num handler de clique e nunca no render. O CTA e o bloco de destaque de leveling apontam
para `/leveling`, não para a Sorceress. Cinco cartões de referência novos. O rótulo do header é
**condicional à largura**: `nav.menu` abaixo de 900 px, onde aquele `<details>` é a **única** navegação
do site, e `nav.reference` a partir daí. O `aria-label` do landmark continua "Menu" em todas as
larguras, porque é um atributo e um atributo não tem largura a que responder.

Medido: a palavra custa **+31 px (en) / +34 px (pt)**, não os +38/+45 estimados; a 900 px sobram 12 px
(en) e 25 px (pt). Abaixo de `sm` a palavra é `sr-only` e custa **zero**.

---

## 5. Gates

| Gate | Asserções | |
|---|---|---|
| `test:compare-tiers` (puro) | **76** | novo |
| `test:build-markers-html` | **48** | novo |
| `test:build-toc-html` | **42** | novo |
| `test:nav-discovery` | **239** | novo |
| `test:locale-switch` | **242** | novo |
| `test:viewport` | **741** | +138 |
| `test:build-tier-heights` | **272** | +C13b, +C14b |
| `test:build-tier-state` | 141 | inalterado |
| `test:hygiene` | 31 | +allowlist |
| `test:crawl` | 55 sobre 1.004 páginas | inalterado |

**RED antes de GREEN.** O commit 2 registrou **15 passando e 60 falhando** em `compare-tiers`, contra um
stub tipado, para que as falhas fossem de comportamento e não de compilação.

`npm run check` e `npm run check:built` verdes de ponta a ponta.

---

## 6. Mutations: 43 corridas, 38 apanhadas, e **quatro gates que não podiam falhar**

As quatro que escaparam não eram mutations em falta — eram gates incapazes de ficar vermelhos. Todas
corrigidas e provadas com a mutation a reincidir:

1. **Uma regex apanhada por uma substring da própria classe que excluía.** O gate dos marcadores
   verificava que a linha "Próximo:" nasce escondida com `/\bhidden\b/` sobre a string de classes — e
   **`peer-open:hidden` satisfaz isso**. Mostrar a linha em todos os tiers compactos passava a exit 0.
2. **A regressão do sumário invisível não tinha asserção de navegador.** Era o defeito mais caro da
   fase — um sumário que renderiza invisível em todas as páginas com todos os gates verdes — e ficava
   guardado só por um casamento de texto sobre `app/globals.css`. O mesmo defeito expresso pelo
   **componente** passava em dois gates. Agora `checkVisibility()` corre sobre o painel e cada link a
   640/768/1280 nos dois idiomas, com anti-vacuidade dos dois lados.
3. **A regra de escritor único nunca foi escrita.** §8.2 assenta em `d2rc.tier` ter um só escritor; o
   sumário podia importar e chamar `writeTier` com `test:hygiene` e `test:prefs` verdes.
4. **Um gate era satisfeito pelo próprio comentário de aviso.** `build-filters.test.ts` afirma que o
   switcher lê a query de `location` casando `/location\.search/` no arquivo **cru**. Desestruture
   `globalThis.location` — exatamente o defeito que ele guarda — e as únicas ocorrências restantes
   estão em comentários, **incluindo o comentário escrito para avisar da armadilha**.

Nenhum arquivo de código mudou por causa das quatro: são correções de gate.

**Ainda em aberto, registrado e não corrigido:** apagar o efeito de fecho na mudança de rota é
invisível, porque dois outros caminhos cobrem todos os casos que o gate exercita — o descoberto é
Voltar/Avançar com o menu aberto.

---

## 7. Achados registrados e **não** corrigidos

- **`leveling/[classSlug]/page.tsx:105` é `sticky top-14` em todas as larguras** e mede 57 + 65 = 122 px
  a 320 px, 10 px acima do teto de R-A11Y-8. Mesmo defeito que a Fase 1 corrigiu no gear; fora do
  escopo.
- **A âncora `#skills` da página de classe corre com a hidratação** (§4). Fase 4.
- **A 200% de texto a 320 px a página transborda lateralmente** (scrollWidth 552 contra 320). Apagar
  todos os marcadores deixa-a em 552: a causa é a linha do header, não esta fase. A 100% a mesma página
  mede exatamente 320.
- **`TIER_CEILING` não significa nada a 200% de texto**, onde os tiers compactos medem 923–1.068 px.
- **`Emulation.setScriptExecutionDisabled(false)` depois do load deixa os scripts diferidos correrem**,
  e vários gates "sem JS" deste repositório desligam o script, navegam e **religam-no para chamar
  `evaluate`**. Podem estar a descrever uma página cujos scripts correram tarde. Não investigado.
- **47 px (celular) / 87 px (desktop) de espaço morto** abaixo do header em toda âncora de seção,
  porque `<Section>` carrega `scroll-mt-24` (96 px) contra os 64 px do contrato dos tiers. Medido,
  publicado, não alterado — e `<Section className="scroll-mt-16">` **é um no-op**: o computado continua
  96 px, porque `cn()` é um `join` simples e utilitários de mesma especificidade decidem-se pela ordem
  na folha. Quem "consertar" isso por `className` publica um verde que não faz nada.

---

## 8. Correções ao PRD

Feitas no mesmo commit deste relatório, como entradas novas em §18 e notas nos requisitos, sem
reescrever texto vigente:

| | |
|---|---|
| R-BUILD-6 | a comparação usa `ref.kind + ref.slug`, não `ref.slug` |
| R-BUILD-7 | "presente nos seis tiers" é insatisfazível em `bis` para 45 de 53; contrato terminal |
| R-BUILD-7 | a repetição vai no bloco de preview, fora do `<summary>`, e só no tier seguinte ao expandido |
| R-BUILD-6 / §14 | marcadores: 2.369 classificados de 2.659; 698 desenhados; 161 linhas de maioria |
| R-BUILD-6 | o bloco de removidos é **condicional** — 48 remoções em 30 de 265 renderizações |
| **J5** | *"cada slot do tier ativo carrega um marcador"* → cada slot recebe um marcador; **o estado majoritário do tier pode ser declarado uma vez em vez de repetido por slot** |
| R-BUILD-8 / R-NAV-3 | "um toque": na build abaixo de 640 px são dois (abrir a sheet, tocar o link), como a decisão 4 do proprietário já prevê; na classe continua um |
| R-NAV-4 | o rótulo é condicional à largura, como a própria decisão do proprietário condiciona |

---

## 9. Fora de escopo, registrado

Filtros, `GOOD_AT_THRESHOLD`, ordenação, árvore de skills, ícones, leveling, favoritos, modo compacto,
impressão, comparação entre builds, compartilhamento, conta, backend — **nada tocado**. Nenhum conteúdo
editorial foi alterado; nenhuma URL, rota ou entrada de sitemap mudou; as seis âncoras `#gear-<tier>` e
os sete ids de seção existentes continuam a existir.

**As Fases 3, 4 e 5 não foram iniciadas.**
