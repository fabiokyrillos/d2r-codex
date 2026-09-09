# Fase 1 — relatório factual

**Data:** 2026-09-09 · **Baseline:** `2873b61` · **Plano:** [`phase-1-tier-preference-plan.md`](phase-1-tier-preference-plan.md)
**Escopo:** R-BUILD-1…5, 9–12; R-PREF-1…4. **As Fases 2, 3, 4 e 5 não foram iniciadas.**

Este documento publica o que foi medido, incluindo onde a medição contraria o PRD. Todos os números vêm dos gates da fase, rodando num Chrome real pelo driver do próprio repositório, contra o build de produção local.

---

## 1. Posição do controle — as 53 builds × 2 idiomas

Medido em **320×640**, com o controle renderizado (não o fim do bloco de título), em todas as **106** páginas de build:

| | |
|---|---|
| dentro do alvo de **560 px** | **104** |
| entre **561 e 640 px** | **2** |
| acima do teto de **640 px** | **0** |
| **maior posição observada** | **575 px** |

As duas que excedem o alvo, ambas a **575 px**, ambas em pt-BR:

- `/pt-br/builds/assassin/lightning-trapsin`
- `/pt-br/builds/assassin/whirlwind-assassin`

São as duas builds cujo bloco de título já media 583 px em pt-BR **antes de o controle existir**. As alavancas seguras aplicadas (`mt-8` → `mt-6` acima do controle) recuperaram 8 px; o resto é o subtítulo, que é conteúdo editorial e não foi tocado. Pela decisão do proprietário (§16.3 do plano) o gate fica **verde** e as duas são publicadas como excedentes do alvo, não arquivadas numa lista de exceção. Nenhuma página se aproxima do teto de 640 px.

---

## 2. Altura dos tiers compactos, por quantidade de slots

Medido a 390 px, en-US, `blizzard-sorceress` (a build que o PRD §12 nomeia como baseline):

| Slots | Altura do tier compacto |
|---|---|
| 7 | 251 px |
| 8 | 271 px |
| 10 | 311 px |

Em pt-BR, a mesma build: 302 px (7 slots), 283 px (8), 323 px (10).

Pior caso do catálogo medido, `phoenix-strike` a **320 px** em pt-BR: **361–420 px** por tier. Nenhum tier de nenhuma build medida passa de **420 px**.

**A hipótese de ≤ 320 px por tier compacto do PRD está refutada por medição**, e o gate agora usa um teto de 460 px por tier e um teto para os seis juntos, ambos calibrados ~10% acima do pior medido. A fórmula fechada que o plano carregava (`f(N,G) = 118,5 + 22N + 19,25(G−2)`) também foi descartada: ela erra por 4–12% a 390 px e erra *de espécie* a 320 px, onde as próprias linhas do preview quebram — o que nenhuma função de contagem de slots enxerga.

---

## 3. Altura total dos seis tiers compactos

| Build | @390 en | @390 pt | @320 en | @320 pt |
|---|---|---|---|---|
| blizzard-sorceress | 1.726 | 1.837 | 1.902 | 1.999 |
| tesladin (mais raso) | 1.466 | 1.558 | 1.566 | 1.664 |
| leap-attack-barbarian | 1.885 | 2.015 | 2.080 | 2.158 |
| blade-fury (11 slots) | 1.803 | 1.959 | 1.998 | 2.140 |
| whirlwind-assassin | 1.860 | 1.971 | 2.036 | 2.172 |
| fire-trapsin | 1.865 | 2.014 | 2.022 | 2.176 |
| **phoenix-strike (pior)** | 2.018 | **2.129** | 2.213 | **2.349** |

---

## 4. Página e seção Gear — sem preferência e com um tier expandido

390 px. "Um tier expandido" usa `optimized`, o maior tier medido nesta build.

| Build | Página compacta | Gear compacto | Página, um aberto | Gear, um aberto |
|---|---|---|---|---|
| **blizzard-sorceress en** | **18.344** | **2.034** | **21.582** | **5.272** |
| blizzard-sorceress pt | 19.141 | 2.146 | 22.601 | 5.606 |
| tesladin en | 19.911 | 1.777 | 21.921 | 3.787 |
| leap-attack-barbarian en | 26.727 | 2.194 | 28.503 | 3.970 |
| phoenix-strike en | 29.935 | 2.328 | 32.841 | 5.235 |
| fire-trapsin en | 31.164 | 2.174 | 33.101 | 4.112 |
| whirlwind-assassin en | 30.599 | 2.170 | 32.776 | 4.347 |
| blade-fury en | 30.640 | 2.112 | 33.048 | 4.520 |
| blade-fury pt | 31.843 | 2.269 | 34.374 | 4.800 |
| phoenix-strike pt | 31.327 | 2.440 | 34.267 | 5.380 |
| fire-trapsin pt | 32.449 | 2.324 | 34.442 | 4.318 |
| whirlwind-assassin pt | 32.170 | 2.281 | 34.449 | 4.560 |
| leap-attack-barbarian pt | 27.465 | 2.324 | 29.252 | 4.111 |
| tesladin pt | 20.268 | 1.869 | 22.313 | 3.914 |

### Redução na build de referência (en-US, 390 px)

| | Antes (`2873b61`) | Depois | Redução |
|---|---|---|---|
| Seção Gear | 16.458 px | **2.034 px** | **87,6%** |
| Primeira visita (página inteira) | 32.574 px | **18.344 px** | **43,7%** |

---

## 5. Diferença contra as projeções do PRD, e de quem é a redução

| Métrica (en-US, 390 px, build de referência) | PRD §12.1 | Medido | Diferença |
|---|---|---|---|
| Gear, seis compactos | ≤ 1.920 | 2.034 | **+114** |
| Gear, um tier expandido | ≤ 4.955 | 5.272 | **+317** |
| Página, seis compactos | ≈ 17.500 | 18.344 | **+844** |
| Página, um tier expandido | ≤ 21.000 | 21.582 | **+582** |

**Que parte da redução pertence de fato à Fase 1.** A seção Gear caiu de 16.458 px para 2.034 px: **14.424 px, inteiramente desta fase**. A página caiu 14.230 px, praticamente o mesmo número, porque **fora do Gear esta fase não reduziu nada** — e não deveria: o conteúdo não-Gear da build de referência são 16.116 px de prosa, atributos, breakpoints, mercenário, farm e a seção de skills, e as duas reduções previstas ali pertencem à **Fase 4** (árvore de skills, 5.912 px hoje) e à **Fase 6d** (modo compacto, ~2.440 px de prosa). Nenhuma foi iniciada.

Os 844 px pelos quais a página passa da projeção do PRD decompõem-se em: **~114 px dentro do Gear**, que é o preço de um resumo legível (a linha de objetivo e o padding que R-BUILD-5 exige), e **o restante fora do Gear**, que é deriva de baseline — a página cresceu 635 px entre a medição do PRD (2026-09-07, em produção) e `2873b61`, e a derivação do PRD deixava 421 px de folga contra o teto de 21.000.

**As metas recalculadas do plano prevalecem sobre a hipótese anterior** (decisão do proprietário, §16.2), e são asseridas pelo gate, não apenas publicadas.

---

## 6. Comportamento

### Sem JavaScript
Os seis tiers vêm `<details open>`, com as seis âncoras `#gear-<tier>` idênticas nos dois idiomas, o conteúdo completo de cada tier no DOM, e **nenhuma promessa de preferência** — nem rótulo "Meu tier", nem "Ir para o equipamento", nem "Limpar". O controle é seis links. A afordância de cada tier lê "Recolher", porque os seis estão abertos.

### Com JavaScript, sem preferência
Os seis ficam compactos antes da primeira pintura. Nenhum `aria-pressed="true"`. A URL não muda, nada é escrito, `scrollY` não muda, e os seis previews ficam visíveis com uma linha por slot. O rótulo pergunta "Onde você está?".

### Com preferência
Um tier expandido, `aria-pressed` nele, rótulo "Meu tier: X · Níveis a–b", a ação "Ir para o equipamento" apontando para ele, e "Limpar" disponível. Carregar com preferência **não rola a página**.

### Preferência inválida ou armazenamento bloqueado
Idênticos ao estado sem preferência. Um valor corrompido é **ignorado e mantido**, nunca apagado. Com `localStorage` lançando na leitura da própria propriedade — a situação de quem bloqueia dados de site — a página enriquece normalmente e **não registra um único erro no console**.

### Hash
Um hash válido expande aquele tier e **não sobrescreve a preferência**: `aria-pressed` continua no tier preferido e `aria-current="location"` marca o que está na tela. Um hash inválido degrada para o estado sem preferência sem quebrar nada. Um fragmento que não nomeia um tier — inclusive o Voltar — **não mexe em nada**.

### Rolagem
Só três coisas movem a página: ativar "Ir para o equipamento", abrir uma URL com `#gear-<tier>`, e ativar uma âncora de tier. Selecionar um tier **nunca** muda `scrollY`, medido com a página no topo e rolada. Abrir um `<summary>` acima da viewport preserva a posição visual do que está sendo lido.

### O espelho dentro de Gear
Navega e reflete; **não grava a preferência, não altera `aria-pressed`**. Alvo ≥ 24 px, enquanto o controle principal tem ≥ 44 px nos dois eixos. **Apenas o controle principal grava a preferência** — verificado por gate e por mutation.

### Persistência
`d2rc.tier` sobrevive à troca de build, de classe e de idioma. A troca de idioma é exercida pelo controle real do header, não por navegação de URL — plantar um `localStorage.clear()` no switcher deixava a versão anterior do teste verde.

---

## 7. Acessibilidade

- `role="group"` com `aria-labelledby`; **nenhum `role="tab"` na página**.
- Os seis controles carregam `aria-pressed`; cinco `false`.
- `aria-current="location"` no tier visível.
- Roving tabindex: uma parada de Tab no grupo, setas dentro dele, Home/End, Enter/Espaço. Foco move com `preventScroll`.
- Região `sr-only` `role="status"` escrita **só na seleção confirmada** — nunca no carregamento, nunca ao mover o foco.
- Os seis nomes de tier continuam expostos **como heading** na árvore de acessibilidade, apesar de estarem dentro de `<summary>` (verificado com `Accessibility.getFullAXTree`).
- Alvos: controle principal ≥ 44 px nos dois eixos a 320 e 390 px; espelho ≥ 24 px.
- Abaixo de 640 px o header é o único elemento sticky. De 640 px para cima, header + espelho somam **106 px**, dentro do teto de 112 px.
- `prefers-reduced-motion: reduce` desliga o `scroll-behavior: smooth`, que estava sem guarda antes desta fase.
- Zero overflow horizontal em 320, 360, 375, 390, **640**, 768, 1280 e 1440 px.

---

## 8. Testes

| Gate | Asserções | Estado |
|---|---|---|
| `test:prefs` (puro, em `check`) | 75 | verde |
| `test:build-tiers-html` (53 × 2 páginas) | 18 | verde |
| `test:build-tier-state` (navegador) | 141 | verde |
| `test:build-cls` (navegador) | 15 | verde |
| `test:build-tier-heights` (navegador) | 88 | verde |

**RED antes de GREEN.** O commit 2 registrou **73 asserções falhando** nos quatro gates novos, cada uma nomeando um comportamento da Fase 1 que ainda não existia, com o `typecheck` verde para que falhassem por comportamento e não por compilação.

**Mutations: 13, todas vermelhas onde deviam.** Tiers servidos fechados; corpo de tier removido do DOM; uma única página corrompida (prova que a varredura cobre as 53); wrapper por tier removido (o irmão geral do `peer-*`); classe `group` removida (a afordância congelada); script inline não declarado; valor inválido aceito; hash deixando de vencer; `clearTier` virando no-op; script de boot divergindo do módulo; seleção chamando `scrollIntoView`; troca de idioma apagando a preferência; espelho virando seletor; e o `hashchange` colapsando sob o leitor.

**Três mutations ficaram verdes na primeira execução**, e cada uma expôs um gate que não fazia o seu trabalho: o corpo de um tier podia ser esvaziado sem que nada notasse (a forma exata do defeito D7), a lista vigiada de scripts inline ignorava `D2R_BUILD_ROOT` e portanto não podia ser testada, e "a preferência sobrevive à troca de idioma" navegava por URL em vez de usar o switcher.

---

## 9. Achados corrigidos durante a fase

Três rodadas de revisão adversarial do plano (2 BLOCKER, 10 HIGH, 21 menores) e uma da implementação (3 BLOCKER, 3 HIGH). Os que importam para quem ler o código depois:

- **`peer-*` do Tailwind compila com irmão geral (`~`), não adjacente.** Sem um wrapper por tier, abrir um tier esconderia o preview de todos os posteriores — com todos os gates verdes.
- **`group-open:` exige a classe `group` num ancestral.** Sem ela a afordância congela em "Expandir", inclusive sobre os seis tiers abertos da página sem JS.
- **`scroll-margin` aplica-se ao alvo do fragmento e não é herdado.** Com `scroll-mt-16` no wrapper e o `id` no `<details>`, todo tier aterrissava atrás do header. Duas asserções verdes cobriam isso, porque mediam as parcelas em vez do pouso.
- **Um `hashchange` para um fragmento que não é tier colapsava o que o leitor estava lendo**, deslocando-o em até 3.825 px no Voltar. As linhas 15 e 16 da tabela de estados não tinham teste.
- **O corte do `scroll-padding-top` global quebrava o "pular para o conteúdo"** em ~1.000 páginas.
- **A linha de ação montava depois do script de boot**, empurrando o alvo do hash 32 px para baixo.
- **A linha de chips fazia o documento passar de 320 px** (`documentElement.scrollWidth` = 568) mesmo com tudo clipado, até `contain: paint`.

---

## 10. Fora de escopo, registrado

- **R-BUILD-6, 7, 8** (comparação, "próximo" no resumo, sumário) — Fase 2.
- **R-BUILD-7 contra os dados:** 45 das 53 builds não têm `nextUpgrade` no tier `bis` (273 de 318 tiers têm; as 45 lacunas são todas em `bis`). Nenhum conteúdo foi inventado e nenhum dado foi alterado. Entregue à Fase 2 com o número.
- **R-I18N-7** (troca de idioma preservar o hash) — defeito real em `locale-switcher.tsx:94`, que monta o `href` sem fragmento. O header **não foi alterado** nesta execução. A Fase 1 prova apenas que `d2rc.tier` sobrevive à troca.
- **`d2rc.compact`, `d2rc.leveling.<classe>`, `d2rc.level`** — documentadas na lista fechada de `lib/prefs.ts`, **não implementadas**.
- Filtros, árvore de skills, ícones, leveling, home, modo compacto, impressão, backend, cookies — nada tocado.

**As Fases 2, 3, 4 e 5 não foram iniciadas.**
