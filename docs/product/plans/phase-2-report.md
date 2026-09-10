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

> **Errata (passe corretivo, 2026-09-10).** A atribuição está errada e a conclusão também. Não é a
> árvore: a árvore está *dentro* de `#skills`, onde crescer não mexe no topo da própria seção. O que
> cresce é `#builds`, cujo HTML estático é o *fallback* do Suspense da `FilterableBuildList`. E não
> é pré-existente no sentido que importa: a Fase 2 é que pôs um sumário a apontar para ali. Medido,
> corrigido e testado em §10.

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
- ~~**A âncora `#skills` da página de classe corre com a hidratação** (§4). Fase 4.~~
  **Corrigido no passe corretivo, e a causa não era a que está escrita** — §10.1–10.4.
- **A 200% de texto a 320 px a página transborda lateralmente** (scrollWidth 552 contra 320). Apagar
  todos os marcadores deixa-a em 552: a causa é a linha do header, não esta fase. A 100% a mesma página
  mede exatamente 320.
  **Confirmado contra uma build real de `0b5a2bc`**, ao pixel, a 320 e 390 px, a 100/150/200 % — mas
  R-NAV-4 **piorava** o transbordo em duas larguras maiores, e essa parte foi corrigida. §10.5–10.6.
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

---

## 10. Passe corretivo — a âncora `#skills` e o header a texto ampliado

Dois achados da §7 foram reavaliados porque ambos tocam funcionalidade entregue nesta fase. Um
**era** defeito da Fase 2 e está corrigido. O outro é pré-existente e continua a existir, mas a
Fase 2 **piorava-o** em duas das quinze combinações largura×tamanho-de-texto medidas por idioma, e
essa parte está corrigida.

As entradas da §7 e o parágrafo da §4 ficam onde estão, com errata: apagar o que foi registado seria
apagar o registo de ter atribuído a causa errada.

### 10.1 `#skills`: o controlo, antes

96 leituras — três classes (Sorceress, Necromancer, Warlock), quatro larguras, dois idiomas, quatro
caminhos de chegada — todas depois de a página assentar, com rolagem **e** altura do documento
paradas, que é a única forma de não ler o retângulo que a seção está a deixar.

O contrato de aterragem não é um número escrito à mão: é o `scroll-margin-top` da própria `<Section>`
(96 px, de `scroll-mt-24`) mais o `scroll-padding-top` do `<html>` (8 px abaixo de 640 px, 48 a
partir daí). **104 px abaixo de `sm`, 144 px a partir dele.**

| largura | contrato | carregamento com `#skills` | clique no sumário | soft nav | sem JS |
|---|---|---|---|---|---|
| 320 | 104 | **208** (+104) | 104 | 104 | 104 |
| 390 | 104 | **190** (+86) | 104 | 104 | 104 |
| 768 | 144 | **482–528** (+338…+384) | 144 | 144 | 144 |
| 1280 | 144 | **482–572** (+338…+428) | 144 | 144 | 144 |

Os dois caminhos **não** erravam igual, e é isso que torna a asserção possível: o clique e a
navegação soft aterravam no contrato **ao pixel**, em 24 de 24 casos do gate — que confirma o alvo
com `elementFromPoint` antes de premir. (A única leitura discrepante das 96 do varrimento foi um
clique que falhou o link, num varrimento que ainda não fazia essa confirmação.) Comparar um caminho
com o outro nunca teria provado nada; o que se afirma é a posição absoluta.

O erro é sempre **exatamente** o que a seção `#builds` cresce, e o crescimento é sempre dela: o bloco
que muda de altura é `builds#2` na Sorceress e na Necromancer e `builds#3` no Warlock, que tem um
bloco a mais acima (o aviso de DLC). `#builds` é uma `FilterableBuildList` e o HTML estático dela é o
*fallback* do Suspense: a lista simples, sem painel de filtros. O painel chega com a hidratação —
**acima** de todas as outras âncoras da página.

**A árvore de skills não é a causa.** A §4 atribuía-lhe o crescimento, e não pode ser: a árvore está
*dentro* de `#skills`, onde crescer não move o topo da própria seção. Nenhuma alteração de Fase 4 foi
necessária, e nenhuma foi feita.

### 10.2 A causa, quadro a quadro

Um carregamento de `/en-us/classes/sorceress#skills` a 390 px, amostrado a cada 25 ms desde antes do
primeiro script da página:

```
   56ms  DOMContentLoaded         y=0      doc=13301   #skills a 6019
  311ms  o salto começa           y=9                  animação: scroll-behavior é smooth
  332ms  a hidratação troca o     y=39     doc=13387   #skills passa a 6105  (+86)
         fallback pelo painel
 1658ms  a animação chega         y=5915               #skills a 190, não a 104
```

O destino da animação é calculado **uma vez**, a 311 ms, sobre o layout de então. A 332 ms o
documento cresce 86 px acima da âncora e o destino já não é revisto. A 1658 ms o leitor aterra 86 px
abaixo do cabeçalho que pediu.

Isto invalidou a primeira correção escrita — um `ResizeObserver` que corrigia o crescimento. Não
fazia nada, e com razão: a 332 ms a seção está 6.066 px abaixo da dobra, e corrigir ali é ou um
no-op ou um salto para onde ninguém está a olhar. **O único instante em que "isto está no sítio
errado?" tem resposta é depois de a rolagem parar.**

### 10.3 A correção

`components/game/anchor-realign.tsx`, renderizado ao lado do `<SectionNav>` da página de classe.
Não desenha nada.

Espera com um laço de quadros — o Chrome não dispara evento nenhum quando uma rolagem suave termina,
e o documento também não anuncia que parou de crescer — até rolagem e altura estarem ambas paradas
250 ms. Aí, e só aí, mede: se a seção assentou **abaixo** da marca que a folha de estilos lhe dá e
ainda está no ecrã, rola uma vez, sem animação, até à marca. A marca é lida da página
(`scroll-margin-top` + `scroll-padding-top`), nunca reescrita ali.

Não é movimento automático: tem de haver fragmento, o fragmento tem de nomear um elemento, e
qualquer roda, toque, tecla ou pressão termina a vigilância antes — `pointerdown` incluído, porque
arrastar a barra de rolagem não produz nenhum dos outros três. Há um limite exterior de 8 s, após o
qual a página fica como está em vez de ser movida tarde: um separador em segundo plano não recebe
quadros, e "decorrido" ali pode ser minutos.

**Porquê ali e não na lista.** A lista não é desta fase. E o *fallback* dela é o que um leitor sem
JavaScript recebe para sempre: reservar ali a altura do painel dava-lhe uma caixa vazia permanente
para pagar um painel que nunca chega.

### 10.4 `#skills`: depois

O mesmo varrimento na build corrigida, agora com cinco caminhos de chegada: **120 de 120** no
contrato, sem uma única exceção.

| largura | contrato | carregamento | clique antes da hidratação | clique | soft nav | sem JS |
|---|---|---|---|---|---|---|
| 320 | 104 | 104 | 104 | 104 | 104 | 104 |
| 390 | 104 | 104 | 104 | 104 | 104 | 104 |
| 768 | 144 | 144 | 144 | 144 | 144 | 144 |
| 1280 | 144 | 144 | 144 | 144 | 144 | 144 |

O caminho sem JavaScript nunca esteve errado e continua igual — o realinhamento é uma ilha cliente que
não desenha nada e, sem script, não corre. A navegação soft também nunca esteve errada, e agora
sabe-se porquê: ali o painel de filtros já está montado antes de a âncora ser aplicada, e o
crescimento medido é **zero**. O `early` — premir o link antes de a hidratação acabar — é o caso que a
primeira versão deste componente não cobria.

Tempos, medidos nas 120 leituras: o crescimento que causa o defeito termina **178–282 ms** depois do
início da navegação num carregamento direto; numa navegação soft já aconteceu antes de a âncora ser
aplicada, e o crescimento medido é **zero**. A animação do salto chega por volta de 1,7 s a 390 px
(§10.2), e a correção acontece 250 ms depois de tudo parar.

**Uma medição foi descartada, e vale a pena dizer porquê.** As duas primeiras corridas deste
varrimento deram 116 de 120 e 119 de 120: leituras isoladas com a seção no seu deslocamento total,
como se a página nunca tivesse rolado. A terceira, com as duas causas abaixo corrigidas, deu
**120 de 120**. Nenhuma reproduziu — cinco repetições do pior caso deram
144 px, cinco vezes — e a diferença estava no relógio, não na página: as falhas assentaram **1,3 s
mais cedo** do que as corridas boas. Sob carga o Chrome pode começar o salto do fragmento com mais de
um segundo de atraso, e até lá `scrollY` não se mexeu e a altura do documento já estabilizou, de modo
que uma espera que só procura sossego conclui **antes de a coisa medida ter começado**. A segunda
causa foi minha: o próprio auxiliar de clique rolava o alvo para o centro do ecrã, o que tirava
`scrollY` de zero e desarmava essa guarda.

As duas foram corrigidas — no gate, exigindo que o salto tenha acontecido antes de contar sossego; no
varrimento, além disso, só rolando para o alvo quando ele está mesmo fora do ecrã. Sem a primeira, o
gate herdaria a mesma intermitência, e uma falha intermitente num gate de aterragem seria lida como o
defeito a voltar.

### 10.5 O header a texto ampliado: `0b5a2bc` contra `9a4aaa4`

Construção real dos dois SHAs — `git worktree` em `0b5a2bc`, `npm run build`, `next start` —, o mesmo
Chrome, as mesmas fontes, as mesmas páginas, e o **tamanho de texto do próprio Chrome**
(`Page.setFontSizes`), não um `style.fontSize` no `<html>`.

`scrollWidth` do documento contra `clientWidth`, na home e numa página de classe, en-US e pt-BR:

| largura | texto | `0b5a2bc` | `9a4aaa4` | diferença |
|---|---|---|---|---|
| 320 | 100 % | 320 (cabe) | 320 (cabe) | **0** |
| 320 | 150 % | 415 (+95) | 415 (+95) | **0** |
| 320 | 200 % | 552 (+232) | 552 (+232) | **0** |
| 390 | 100 % | 390 (cabe) | 390 (cabe) | **0** |
| 390 | 150 % | 415 (+25) | 415 (+25) | **0** |
| 390 | 200 % | 552 (+162) | 552 (+162) | **0** |
| 900 | 100 % e 150 % | cabe | cabe | **0** |
| 900 | 200 % | 1192 (+292) | 1192 (+292) | **0** |
| 960 | 100 % | cabe | cabe | **0** |
| 960 | 150 % | 1194 (+234) | **1239** (+279) | **+45** en / **+50** pt |
| 960 | 200 % | 1192 (+232) | 1192 (+232) | **0** |
| 1280 | 100 % e 150 % | cabe | cabe | **0** |
| 1280 | 200 % | 1562 (+282) | **1623** (+343) | **+61** en / **+66** pt |

Respostas diretas às quatro perguntas:

1. **O transbordo existia antes?** Sim. A 320 e 390 px, a 150 % e 200 % de texto, **idêntico ao
   pixel** nos dois SHAs. A 100 % de texto nenhuma página transborda, em nenhuma largura, em nenhum
   dos SHAs.
2. **A troca para "Reference/Referência" criou ou aumentou o transbordo?** A 320 e 390 px, **nem
   uma coisa nem outra: custa exatamente 0 px**, porque abaixo de `sm` a palavra é `sr-only`, e `sm`
   é `40rem` — 640 px a 100 %, 960 a 150 %, 1280 a 200 %. **Criou zero** em qualquer largura: não há
   combinação em que o SHA antigo coubesse e o novo não. **Aumentou** um transbordo já existente em
   **duas das quinze** combinações largura×tamanho por idioma — 960 px a 150 % e 1280 px a 200 % —
   o que dá **16 das 120 leituras** (quatro páginas × cinco larguras × três tamanhos × dois idiomas).
   Verificado por comparação exaustiva das 120: **nenhuma** onde o antigo coubesse e o novo não, e o
   número de controlos que exigem rolagem horizontal idêntico nas 120.
3. **Qual é a largura excedente em cada SHA?** A tabela acima, coluna a coluna.
4. **Algum controlo fica inacessível?** **Não.** `unreachable = 0` em todas as combinações dos dois
   SHAs, e o número de controlos do header que exigem rolagem horizontal é **igual nos dois** em
   todas elas (0, 11, 12, 13 ou 14, conforme largura e tamanho do texto). O que a Fase 2 mudou foi a
   largura excedente, não o alcance de nada.

O elemento que define `scrollWidth` é a linha do header — `header > div > div` — em todas as
combinações que transbordam a 320 e 390 px; os elementos concretos que passam da borda são o
agrupamento de busca + idioma e, por ser o último da linha, o `<details>` do menu. Numa página de
build a `tier-chips` e numa de classe a tabela de breakpoints chegam mais à direita, mas ambas vivem
dentro de um `overflow-x-auto` e não alargam o documento.

### 10.6 A correção do header, e a medição que quase a escreveu ao contrário

`min-[900px]` é uma consulta em **pixels**, e por isso o rótulo continuava a ser promovido em
larguras onde a linha ampliada já não tinha espaço para ele. `min-[56.25rem]` é o **mesmo 900 px** no
tamanho de texto padrão e um número diferente para quem ampliou o texto — 1350 px a 150 %, 1800 a
200 % — de modo que a palavra só aparece onde a linha ainda cabe. Duas classes; a nav primária
(`min-[900px]:flex`) não foi tocada, porque não é de R-NAV-4.

Nada some e nada reverte em silêncio: o gatilho, os dez links e o rótulo `nav.reference` estão
exatamente como estavam em todas as larguras que um leitor com texto padrão vê. O que substitui a
palavra quando o texto é grande é `nav.menu`, que nunca é falso — este `<details>` contém os dez
links em todas as larguras, e o `aria-label` do landmark sempre disse isso. Dois gates independentes
apanham uma reversão silenciosa: o nome acessível por largura, em `nav-discovery`, e o controlo do
`viewport` que exige que trocar a palavra mude a largura do gatilho **nalgum** ponto do varrimento.

**A primeira medição estava errada e teria escrito este relatório ao contrário.** Emular 150 % de
texto com `document.documentElement.style.fontSize = '24px'` escala os comprimentos em `rem` mas
deixa em paz a consulta de média em `rem` — e mediu esta linha **68 px mais larga** do que o browser
a desenha, porque o agrupamento de busca + idioma não escala igual. Com essa emulação, 1280 px a
150 % aparecia como *transbordo criado pela Fase 2* (0 → 27 px), o que não é verdade: com a
definição real do Chrome cabe nos dois SHAs. `Page.setTextScale` foi acrescentado a
`scripts/headless.ts` por causa disto, e o comentário lá diz porquê.

### 10.7 RED antes de GREEN

| gate | antes da correção | depois |
|---|---|---|
| `test:nav-discovery` | **437 passaram, 20 falharam** (aterragens, por 86–428 px) | **461, 0** |
| `test:viewport` | **846 passaram, 4 falharam** (960/150 % e 1280/200 %, nos dois idiomas) | **850, 0** |

O RED do `nav-discovery` só ficou honesto à segunda. Escrito sem um documento em branco entre casos,
falhava apenas na primeira largura do varrimento e passava nas outras três — porque ir de
`…/sorceress` para `…/sorceress#skills` é navegação **no mesmo documento**: nada recarrega e nada
re-hidrata, e a seção aterra certa. Está no comentário do gate, com os números que provariam o
contrário.

As quatro falhas do `viewport` trazem os números exatos que o controlo entre SHAs mediu à parte —
+45/+50/+61/+66, contra larguras base de 1194/1170/1562/1531. O gate reconstrói dentro da própria
página o header que `0b5a2bc` publicava (uma palavra visível, `nav.menu`) e compara as duas larguras
de documento; a coincidência ao pixel com uma build real do commit antigo é o que diz que nenhum dos
dois métodos está a medir outra coisa.

### 10.8 Mutations

Cada uma foi aplicada sobre os commits já feitos, medida, e revertida com `git checkout --` — nunca
reescrita de memória. A Fase 1 perdeu correções duas vezes por reverter à mão; aqui cada reversão foi
confirmada com `git diff --quiet` antes de a seguinte começar, e a árvore no fim é a mesma de antes.

| mutation | gate | resultado |
|---|---|---|
| **M1** o `<AnchorRealign />` deixa de ser renderizado na página de classe | `test:nav-discovery` | **442 passaram, 19 falharam** |
| **M2** o realinhamento em si vira no-op (`return` no topo de `align`) | `test:nav-discovery` | **438 passaram, 23 falharam** |
| **M3** o degrau do rótulo volta a `min-[900px]` | `test:viewport` | **846 passaram, 4 falharam** |

M1 e M2 falham em números diferentes — 19 e 23 das 24 aterragens — porque o defeito é uma race: em
quatro ou cinco casos a animação do salto começa depois de a hidratação já ter crescido a página, e
aterra certo por acaso. **Depois da correção são 24 de 24, em corridas independentes.** O que a
correção compra não é só a média; é o determinismo. As quatro falhas de M3 são exatamente as quatro do
RED, com os mesmos números.

Uma quarta corrida **não conta como mutation apanhada**: a primeira tentativa de M3 rebentou em
`assertFreshBuild()` porque editei um comentário de componente entre o build e o gate. Build velho,
não defeito detectado. Foi repetida limpa, e é a repetição que está na tabela.

### 10.9 Um gate intermitente, encontrado pelo próprio predeploy

O primeiro `predeploy` completo falhou numa asserção de `test:locale-switch` e passou na repetição:
`#skills` numa página de build a aterrar a 1733 px onde o contrato diz 1741 — oito pixels. Dez
carregamentos diretos do mesmo URL deram 1741 ao pixel, dez vezes; não era a página.

`settledScrollY` aceitava **duas** amostras iguais a 180 ms de distância. Uma rolagem suave é
suavizada: nos últimos quadros anda menos de um pixel, e duas leituras podem arredondar para o mesmo
inteiro enquanto a animação ainda não acabou. Os oito pixels são a cauda da curva.

Exigir três amostras **sozinho piorou** — e essa é a metade mais útil. Sossego não é chegada: antes
de o browser começar o salto, `scrollY` não se mexeu e a altura já estabilizou, portanto qualquer
número de amostras iguais é satisfeito por uma página que ainda não andou — e alargar a janela de
sossego torna isso *mais* provável, não menos. Pedir três transformou uma falha intermitente noutra,
com `scrollY 0` e o alvo 13.215 px abaixo.

Ficaram as duas: três amostras, e quem acabou de mandar a página para um fragmento diz que o fez,
para a espera não chamar aterragem a zero. **Três corridas seguidas, 242 asserções, zero falhas.** É a
mesma classe de erro de medição do §10.4, desta vez num gate da Fase 2, e era o que estava entre este
passe e uma publicação verde.

### 10.10 O que continua registado e não corrigido

- A barra `sticky top-14` do leveling, 10 px acima do teto de R-A11Y-8 a 320 px, **permanece por
  corrigir por instrução explícita** do proprietário nesta continuação.
- O transbordo lateral a 150 % e 200 % de texto a 320 e 390 px **continua**: é a linha do header,
  medida idêntica nos dois SHAs, e corrigi-la é recompor essa linha — trabalho de outra fase, com o
  seu próprio orçamento de larguras.
- `TIER_CEILING` continua a não significar nada a 200 % de texto.
- Os gates "sem JS" que voltam a ligar o script antes de `evaluate` continuam por investigar. O
  controlo desta passagem contornou o problema com um proxy que neutraliza cada `<script>` servido —
  uma página realmente sem JavaScript, sem desligar `Runtime.evaluate`. O método fica registado aqui
  caso valha a pena adotá-lo nos gates.
