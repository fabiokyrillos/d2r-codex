# Fase 4 — relatório factual (parada no portão de UAT físico)

**Data:** 2026-09-11 · **Baseline:** `436dc88` (= `origin/main`, produção) · **Plano:** [`phase-4-tree-structure-plan.md`](phase-4-tree-structure-plan.md) · **Evidência visual:** [`phase-4-visual/`](phase-4-visual/README.md)
**Estado:** **implementada e validada localmente; não publicada.** Nada foi enviado (`push`), mesclado ou
implantado. A fase **não está concluída**: o PRD exige um UAT em telefone real antes de qualquer
publicação (§14 "Portão de publicação"), e é nesse portão que esta execução parou — com um servidor de
produção local ligado na rede, as URLs e a lista de dez itens em §12.
**Escopo:** R-TREE-1…17 com as decisões D1 (R-TREE-9 entra) e D2 (R-TREE-10 dividido: classe e build
agora, leveling adiado para P3.6). **Fora:** os 240 ícones (Fase 5), a árvore por etapa do leveling, os
filtros da Fase 3 e a sticky bar do leveling, backend, contas, compartilhamento.

Este documento publica o que foi medido, incluindo o que contraria a estimativa do plano — o
orçamento de altura da página de build (§6) — e o que a revisão integrada e os gates encontraram no
artefato antes de ele ser considerado pronto para o telefone (§9). Todos os números vêm dos gates da
fase, num Chrome real pelo driver do próprio repositório, contra o build de produção local de `865bb3a`.

---

## 1. O que mudou para quem usa o site

- **A árvore é uma árvore em qualquer largura.** A 320 px a página de classe mostrava três listas de
  uma coluna (280 × 70,5 px por skill, sem conectores, 3.511 px de seção); agora mostra uma grade
  3×6 real por tree — nós de 88 × 74 px, vão de 8 px, o trilho de níveis 1/6/12/18/24/30 na
  margem, e os conectores desenhados entre os nós em todas as larguras, com o caminho de
  pré-requisito inteiro aceso ao passar o mouse, focar ou selecionar.
- **No celular, uma tree por vez.** Abaixo de 640 px há um controle com as três trees (links de
  fragmento sem JavaScript, abas com setas com JavaScript); só a ativa está na página, na ordem de
  Tab e na árvore de acessibilidade. A partir de 640 px as três ficam empilhadas. Sem JavaScript, as
  três empilhadas, com conectores e os 30 links.
- **Quatro estados por forma e texto:** disponível (moldura), investida (moldura ember e a pílula
  dos pontos), maximizada (pílula chanfrada com ✦), bloqueada (moldura tracejada, cadeado, sigilo
  esmaecido) — e bloqueada só existe quando o leitor diz o seu nível.
- **"Meu nível"** (1–99) no fim da seção: grava uma chave (`d2rc.level`), marca como bloqueado o que
  está acima do nível e nada mais — nenhum ponto, filtro ou conteúdo muda; "Limpar" apaga a chave;
  outra aba do navegador acompanha.
- **Selecionar uma skill** abre uma sheet no celular (fechar pelo botão, Esc ou fundo; o foco volta
  ao nó) ou preenche o painel ao lado no desktop, com resumo, nível, pré-requisitos, desbloqueia,
  sinergias recebidas e dadas (todos links reais, no idioma da página), pontos nesta build, papel
  editorial e "Ver página completa". Um segundo toque no mesmo nó não fecha nada.
- **Teclado:** setas espaciais — Ice Blast ↓ é Glacial Spike, → é Shiver Armor —, Home/End, Enter e
  Espaço abrem, Esc fecha, Tab sai da grade; as 24 árvores inteiras alcançáveis só com setas.
- **Leitor de tela:** `role=grid` com as 54 células (as 24 vazias anunciam "Sem skill" em vez de
  sumir), cada nó "Nome, nível N, tree, estado[, pontos]", conectores decorativos, painel como região
  nomeada, sheet como diálogo, anúncio só na seleção confirmada.
- **Texto ampliado:** a 200 % em 320 px a grade continua 3×6, sem rolagem horizontal na seção e sem
  palavra partida; quando um nome não cabe, o nó passa a mostrar o sigilo e a **faixa de nome** acima
  da grade lê o nome completo do nó focado ou selecionado.
- **A página de classe ficou 100 KB mais leve** (pior documento 348.313 → 248.110 bytes): a árvore é
  renderizada de dados, não de elementos serializados três vezes.

## 2. Antes e depois

| Métrica | Baseline (`436dc88`) | Fase 4 (`865bb3a`) | Onde |
|---|---|---|---|
| Colunas da grade a 320/390/640/768/1024/1280 | 1/1/3/3/3/3 | **3 em todas** | C2 |
| `gridcell` no DOM / na árvore de acessibilidade, por classe | 54 / 30 (24 vazias `aria-hidden`) | **54 / 54**, 24 vazias nomeadas `skills.emptyCell` | C1, C7 |
| Nó a 320 px | 280 × 70,5 | **≥ 88 × 74** (fileira elástica: 83 na Summoning por "Raise Skeletal Mage") | C2 |
| Nó em toda largura | — | ≥ 44 × 44 nos dois eixos | C2 |
| Grade por tree a 320 px, 100 % | 954 | **484** (493/495 na Necromancer, uma fileira elástica) | C2 |
| Seção com uma tree a 320 px — classe | 3.511 (Cold en) / 3.761 (Summoning pt) | **778 / 798 (Cold en/pt), 787 / 807 (Summoning en/pt)** — ≤ 900 | C2, §6 |
| Caixa §8.1 da build a 320 px | n/a | **903–992** (§6; acima da estimativa de 880–895 do plano — decisão do proprietário) | C2, §6 |
| Conectores visíveis a 320 px | 0 | **todos**: 192 verificações de "cada aresta toca os dois nós a ±1 px" a 320/390/640/1280 e a 150 % | C2 |
| Palavras partidas / fragmentos ≤ 2 letras a 200 %, 320 e 390 | (lista: 0/0, sem grade) | **0 / 0**, com e sem JS, e a 100 % nas 8 classes × 2 idiomas | C11, C2a, C12 |
| Overflow horizontal da seção | 0 | **0** em toda largura, a 150 % e a 200 % | C2, C11, `test:viewport` |
| HTML do pior documento de classe | 348.313 (pt-br/sorceress; acima do alerta de 348.160) | **248.110** (pt-br/sorceress, build do `predeploy` com a URL de produção; 120.530 abaixo do teto de 368.640; 0 documentos em alerta) | `test:class-html-size`, §5 |
| JS de cliente da página de classe (chunks referenciados, decodificados) | 632.031 B (10 chunks, produção) | **652.669 B** (11 chunks): a camada interativa de 10.406 B dá lugar à ilha (29.623 + 1.322 B) — **+20.638 B**, o custo de renderizar a grade de dados no cliente | §5 |
| Árvores alcançáveis só com setas | 24/24 (vizinho mais próximo) | **24/24** (linha/coluna estritas + continuação documentada; 218 dos 480 movimentos verticais mudam) | `test:nav` |
| Chaves em `localStorage` ao fim de cada gate | `{d2rc.tier}` | `⊆ {d2rc.tier, d2rc.level}` — "a memória ganhou só `d2rc.level = "18"`" | C8 |
| CLS numa chegada por `#skills` a 320/390, classe e build, nos dois idiomas | não medido | **0** (limite 0,1), 8 combinações | CLS |
| Altura da seção antes e depois da hidratação (classe e build, 320/390/1280 e 320 a 200 %) | não medido (a hidratação crescia a seção: uma âncora abaixo dela pousava 56 px atrasada) | **igual a ±1 px** nas 16 combinações | C2b |
| Estado bloqueado com `d2rc.level = 18` na Blizzard | n/a | exatamente os 10 nós acima de 18; `[data-points]` inalterados; 30 sem nível | C8 |

## 3. R-TREE-1…17, com evidência

| Req. | Resultado | Evidência |
|---|---|---|
| R-TREE-1 grade 3×6, células vazias no DOM e na árvore de acessibilidade | ✅ | C1: 3 `grid`, 18 `row`, 54 `gridcell`, 0 `aria-hidden`, 24 vazias nomeadas, por classe e idioma; C7: `axNodes` 54/18/3; C2: 3 faixas em toda largura |
| R-TREE-2 conectores sempre visíveis, traço sem escala, caminho aceso | ✅ | peças `<span data-edge><svg><line vector-effect="non-scaling-stroke">` na sobreposição `aria-hidden`; C2: cada aresta toca origem e destino a ±1 px em quatro larguras e a 150 %; C6: `data-related` = fecho de ancestrais no hover, foco e seleção |
| R-TREE-3 nó compacto: 88 px, vão 8, fileira com piso 74, ≥ 44 × 44, nome a 12 px | ✅ | C2 (`≥ 87,5 × 73,5` a 320; `≥ 44` em toda largura); M5 (fileira rígida) fica vermelha em três detectores; `--tree-name-size: .75rem` |
| R-TREE-4 nível necessário e bloqueio | ✅ | trilho por fileira + `aria-label` "nível N"; C8: sem preferência 0 bloqueados; com 18, exatamente os nós com `requiredLevel > 18`, links intactos |
| R-TREE-5 quatro estados por forma e texto | ✅ | `data-state` + molduras/pílula/cadeado (`scripts/contrast.test.ts`: os pares ≥ 4,5:1 / ≥ 3:1); estado no `aria-label` e na faixa; "opcional" pela pílula tracejada (decisão 13) |
| R-TREE-6 contador de pontos (nó, tree, seção) | ✅ | C1 em build: `[data-points]` nos 30 nós = pontos-base ("—" sem pontos, ✦ só na maximizada), `[data-tree-points]` "N de M pontos nesta árvore", `[data-trees-total]` "N de M pontos duros obrigatórios [e mais K opcionais]" |
| R-TREE-7 painel: descrição, nível, pré-requisitos, desbloqueia, sinergias, pontos, papel, página completa — tudo link | ✅ | C10: listas com `a[href]` no idioma da página para Blizzard e Raise Skeletal Mage; M13 (pré-requisito em `<span>`) vermelha; RichText na nota (`test:markup`) |
| R-TREE-8 abas < 640, empilhadas ≥ 640, uma legenda, trees inativas `hidden`, ≤ 900 px | ✅ classe / ⚠ build | C3: troca sem navegação, foco na aba, 0 focáveis na tree inativa; C2: uma legenda, `tablist` só < 640; §6: classe 778–807 ≤ 900; **build 903–992 — decisão pendente (§4)** |
| R-TREE-9 "Meu nível" | ✅ | C8 + `test:prefs` (126): 1–99, uma chave, "Limpar" remove, valor inválido gravado à mão ignorado e mantido, sincroniza por `storage` e `d2rc:level`; ausente sem JS (C1, C12) |
| R-TREE-10 classe e build (D2) | ✅ | classe: `available` nos 30; build: alocações reais (C1 recompõe estado e pontos do registro); leveling **não** alegado |
| R-TREE-11 hover no desktop | ✅ | C6: com `(hover: hover)` a prévia muda o painel sem mudar a seleção e sair restaura; sob toque emulado (`(hover: hover)` falso) os mesmos eventos não mudam nada |
| R-TREE-12 toque e clique | ✅ | C6b: toque seleciona e abre a sheet, o link não é seguido, foco no botão de fechar, segundo toque mantém, fechar por botão/Esc/fundo devolve o foco ao nó; ≥ 1024 o painel ancorado |
| R-TREE-13 teclado | ✅ | C5: Tab chega a um nó por tree visível e sai; ↓ Ice Blast = Glacial Spike, → = Shiver Armor, ↑ Shiver Armor = Frozen Armor, ← = Ice Bolt, End = Cold Mastery, Home = Ice Bolt; roving `tabindex`; `test:nav` 564 |
| R-TREE-14 leitor de tela | ✅ | C1/C7: `aria-label` composto do dicionário nos 30 nós, região live vazia até a seleção e inalterada após setas e hover, painel `region` nomeado, sheet `dialog` modal, conectores `aria-hidden` |
| R-TREE-15 zoom, reflow e texto ampliado | ✅ | C11: a 200 % (320 e 390) 3×6, 0 partidas, 0 fragmentos, 0 cortados, `title`/`aria-label` com o nome nos 10 visíveis, faixa com o nome ao focar; observador converge (≤ 1 mudança de `data-glyph`); C2a: a 100 % nenhuma classe em glifo; sem JS a 200 %: 0 partidas |
| R-TREE-16 sem JavaScript | ✅ | C12: `(scripting: enabled)` falso, ilha não montada, três trees visíveis, 3 links de fragmento sem `role`, 0 `form[data-level]`, 3 faixas, 30 links; clicar num nó navega para a página da skill |
| R-TREE-17 desempenho | ✅ | 16 documentos ≤ 368.640 (§5), nenhum em alerta; JS +20.638 B publicado; nenhum elemento React no payload da ilha (`scripts/client-boundary.test.ts`) |
| R-TREE-18 placeholders (parcial, por decisão) | ✅ | `[data-placeholder="type-element"]` no sigilo dos 30 nós, `skills.placeholderNote` na legenda, nenhum `<img>` nem asset externo (C20) |

## 4. As decisões do proprietário, e uma que fica com ele

- **D1 — R-TREE-9 entra na Fase 4.** Registrada no PRD (R-TREE-9, §14, §18). Implementada: os
  estados bloqueados de R-TREE-4/5 dependem de `d2rc.level`, que existe agora.
- **D2 — R-TREE-10 dividido.** Registrada no PRD (R-TREE-10, P3.6, §14, §18). Implementada a metade
  "classe e build"; a árvore por etapa do leveling não é alegada em lugar nenhum.
- **D3 (pendente) — a caixa de altura da página de build a 320 px.** O plano definiu a caixa da build
  como "do topo da seção ao fundo de `[data-trees]`" (§8.1) e estimou 880–895 px; o gate mediu
  **903–992 px** nas seis combinações (Blizzard, Summoner, Abyss × en/pt), com todas as páginas de
  classe dentro dos 900 (778–807). A regra de parada do plano (§8.2) diz que o número vai ao
  proprietário e que nada é apertado além do que o plano prescreve — e é o que este relatório faz. A
  decomposição está em §6: o que excede é o cabeçalho da build (título + `skillsDescription` + total:
  150 px en / 193 px pt, contra 128 estimados) e as abas com pontos (60 px). O gate segura a caixa da
  build em **1.050 px provisórios** (uma catraca contra crescimento, rotulada como tal no próprio
  gate) e mantém os 900 duros para a classe. Opções para o proprietário: (a) aceitar a caixa da
  build como medida e fixar o número no PRD; (b) tirar a descrição do cabeçalho da build (−60 a −80
  px); (c) tirar os pontos das abas (−16 px) ou o total do cabeçalho (−24 a −48 px). Nenhuma foi
  aplicada.

## 5. Os 16 documentos e o teto (R-TREE-17)

Teto do spike: **368.640 bytes** decodificados por documento de classe; alerta a 348.160. Medido no
build do `predeploy` de `865bb3a` (com `NEXT_PUBLIC_SITE_URL` de produção — o mesmo build que o
servidor de UAT serve) com o método do spike (`statSync().size` do
`.next/server/app/<locale>/classes/<classe>.html`):

| Classe | en-US | pt-BR |
|---|---|---|
| amazon | 204.258 | 205.931 |
| assassin | 212.051 | 214.629 |
| barbarian | 182.091 | 183.826 |
| druid | 200.579 | 202.652 |
| necromancer | 184.752 | 187.159 |
| paladin | 197.186 | 198.745 |
| sorceress | 245.841 | **248.110** (pior) |
| warlock | 198.991 | 201.335 |

Baseline do pior documento: 348.313 (pt-br/sorceress, medido antes de qualquer código). A queda de
100.203 bytes vem de a árvore deixar de ir três vezes ao documento (marcação, payload RSC e props de
elemento da camada interativa) e ir uma: os dados compactos da ilha. Entre builds o número oscila
por dezenas de bytes (o spike já o registrava); o build sem a URL de produção mediu 247.950. O JS de
cliente da página de classe sobe 20.638 bytes decodificados (652.669 contra 632.031 em produção): a
ilha de 29.623 B substitui a camada de 10.406 B e ganha a grade, o teclado, a sheet e a medição de
glifo.

## 6. O orçamento de altura, bloco a bloco, a 320 px (plano §8.2, medido por C2)

| Página | Caixa | Cabeçalho | Abas | Tree visível | Legenda | Nível |
|---|---|---|---|---|---|---|
| Sorceress en / pt | **778 / 798** | 44 | 44 | 564 | 46 / 66 | 44 |
| Necromancer en / pt | **787 / 807** | 44 | 44 | 573 | 46 / 66 | 44 |
| Warlock en / pt | **778 / 798** | 44 | 44 | 564 | 46 / 66 | 44 |
| Blizzard (build) en / pt | **918 / 981** | 150 / 193 | 60 | 582 | 46 / 66 | 44 |
| Summoner (build) en / pt | **949 / 992** | 170 / 193 | 60 | 593 | 46 / 66 | 44 |
| Abyss (build) en / pt | **903 / 966** | 150 / 193 | 45 | 582 | 46 / 66 | 44 |

As margens (`mt-3` das abas, da tree, da legenda e do nível) completam a soma. A Summoning mede 573
porque "Raise Skeletal Mage" ocupa três linhas a 12 px e a fileira cresce 9 px — é o piso elástico de
R-TREE-3 funcionando, não um defeito. As abas medem 44 na classe porque o rótulo segue a largura
(12 px a 320, 14 px de 373 em diante): com 14 px a 320, "Summoning" (88 px) partia em "SUMMONIN / G"
dentro de uma aba de 80 px úteis — foi assim na primeira captura visual, e é o que a medição das
palavras das 24 trees no próprio Chrome corrigiu.

## 7. Validação

**Vermelho antes do código** (logs guardados fora do repositório, ao lado dos logs da fase):
`test:a11y` reescrito 696 falhas de 1.249 contra o build do baseline; `test:tree-browser` 892 de
1.895; `test:viewport` 72 falhas; `test:nav` 34 de 564; `test:tree-state` 26 de 58; `test:tree` 477 de
1.498; `test:prefs` 20 falhas; `test:tree-geometry` 19 de 32 contra o stub do commit 1; o painel 30 de
38. Durante a integração: a verificação do slot do nível 22 falhas de 1.477; C2b (altura antes e
depois da hidratação) 36 falhas na primeira execução; `test:locale-switch` 8 falhas (a deriva de 56 px).

**Verde no artefato integrado** (`865bb3a`): `npm run check` (conteúdo, grafo, `test:tree` 1.500,
`test:nav` 564, `test:tree-geometry` 32, `test:tree-state` 58, `test:prefs` 126, `test:hygiene`,
dicionário, lint, typecheck) e `npm run check:built` completo — `test:a11y` 1.477, `test:class-html-size`
22, `test:markup` 40, `test:viewport` 1.171, `test:locale-switch` 242, `test:tree-browser` **2.759**,
mais os gates das fases anteriores (§10 traz a tabela do último `predeploy`).

**O gate de navegador da árvore** (`scripts/skill-tree-browser.test.ts`), seção a seção: controles
(os medidores falham quando devem); C2/C3 geometria em seis larguras e dois idiomas, incluindo
conectores e nomes a 150 %; C2a as oito classes a 320 e 100 %; C2b a altura da seção com os chunks
bloqueados na rede contra a altura hidratada (320/390/1280 e 320 a 200 %); C3 troca de tree; C5/C7
teclado num DOM real no desktop e no telefone, árvore de acessibilidade; C6/C6b hover com
`(hover: hover)` e nada sob toque (`Emulation.setTouchEmulationEnabled` — a única forma de virar a
consulta); C8 "Meu nível"; C10/C12b o painel; C11 texto a 200 %; C12 sem JavaScript e a
pré-hidratação; C15 movimento reduzido; CLS numa chegada por `#skills`.

**Evidência visual:** dez capturas em [`phase-4-visual/`](phase-4-visual/README.md) — 320/390/768/1280,
os dois idiomas, classe e build, sheet aberta, painel do desktop com o caminho aceso, nível 18 gravado,
texto a 200 % em modo glifo, sem JavaScript. Receita: o driver do repositório abre o `next start` do
build, emula a largura (e o toque abaixo de 768), espera `[data-trees-ready]`, executa a interação da
captura, mede a seção e o transbordo do documento, e captura a viewport ou a seção inteira.

## 8. Mutations: 27 aplicadas sobre `865bb3a`, 27 vermelhas pela razão esperada, 27 revertidas com `git checkout --` e árvore confirmada limpa

Protocolo (plano §12): cada mutação é aplicada por substituição exata sobre o estado commitado, o
build é refeito quando a mutação toca `app/`, `components/` ou `lib/`, o gate nomeado corre, o
arquivo é revertido com `git checkout -- <arquivo>` e `git status --porcelain` (rastreados) e
`git diff --stat` são confirmados vazios antes da próxima. Logs por mutação ao lado dos logs da fase
(`d2r-codex-phase4-mut-<M>-<gate>.log`). Os quinze controles obrigatórios do proprietário são M1–M15.

| # | Mutação | Gate vermelho | Por quê (a razão esperada, lida no log) |
|---|---|---|---|
| M1 | grade a uma coluna abaixo de `sm` | `test:tree-browser` 110/2759 | nós de 81,5 px em vez de ≥ 88; arestas deixam de tocar os nós |
| M2 | célula vazia `aria-hidden` | `test:a11y` 22/1477 | "0 gridcells aria-hidden (R-TREE-1)" |
| M3 | peças `display:none` abaixo de `sm` | `test:tree-browser` 168/2759 | "all 8 edges painted — 0/8" a 320 e a 150 % |
| M4 | tree inativa `aria-hidden` em vez de `hidden` | `test:tree-browser` 129/3047 | três trees visíveis, caixa de 1.930 px, focáveis na inativa |
| M5 | fileira rígida (`repeat(6, var(--tree-row))`) | `test:tree-browser` 16/2759 | "no node content overflows its box (M5) — 7/8 overflowing" a 150 % |
| M6 | `nodeState` bloqueia com nível nulo | `test:tree` 5/1500 + `test:tree-browser` 15/2759 | "no points and no level: available — locked"; C8 bloqueados sem preferência |
| M7 | preferência zera os pontos dos nós bloqueados | `test:tree-browser` 2/2759 | "every [data-points] is unchanged (the preference changes no data)" |
| M8 | `hover-in` escreve `selected` | `test:tree-state` 4/58 + `test:tree-browser` 8/2759 | "hover sets no aria-expanded — blizzard" |
| M9 | hover ignora `(hover: hover)` | `test:tree-browser` 2/2759 | "touch: a pointer move over Blizzard changes nothing" — ver a nota abaixo |
| M10 | foco escreve `announce` | `test:tree-state` 4/58 + `test:tree-browser` 8/2759 | "the live region … empty before any selection — fire-bolt" |
| M11 | sem continuação na borda **e** sem coluna vizinha | `test:nav` 52/564 | "ice-blast right = shiver-armor — got nothing"; o controle do nó isolado lê 1/2 |
| M12 | modo glifo remove o `title` | `test:tree-browser` 12/2759 | "title and aria-label keep the name — 0/10" a 200 % |
| M13 | pré-requisito do painel em `<span>` | `test:tree-browser` 24/2759 | "[data-panel-prereqs] lists 2 links" |
| M14 | teto de HTML em 1 byte | `test:class-html-size` 18/22 | "en-us/amazon: 204,188 bytes, ceiling 1, over by 204,187" — ver a nota abaixo |
| M15 | `(scripting: enabled)` fora da consulta de pré-hidratação | `test:tree-browser` 3/2759 | "no-JS @320: all three trees are visible, stacked — cold-spells" |
| M16 | `defaultTree` sempre a primeira em build | `test:tree` 71/1500 | "strafe-amazon: defaultTree is bow-and-crossbow — javelin-and-spear" |
| M17 | `jog` no vão abaixo da origem | `test:tree-geometry` 3/32 | "diagonal, non-adjacent → jog in row toRow−1" |
| M18 | `activate` no nó selecionado fecha a sheet | `test:tree-state` 3/58 + `test:tree-browser` 2/2759 | "a second tap … keeps the sheet open (no toggle) — sheet:false" |
| M19 | `form[data-level]` renderizado no servidor | `test:a11y` 44/1477 + `test:tree-browser` 18/2759 | "no form[data-level] (R-PREF-4)"; C2b "no control" no render servido |
| M20 | `tablist` mantido a partir de `sm` | `test:tree-browser` 48/2759 | "no tablist, no tab, no tabpanel from sm up — 3 tabs" a 640/768/1024/1280 |
| M21 | legenda servida `open` | `test:a11y` 22/1477 + `test:tree-browser` 84/2759 | "served closed"; caixa de 1.146 px |
| M22 | célula vazia sem `aria-label` | `test:a11y` 66/1477 | 24 vazias nomeadas ausentes |
| M23 | `isLevel(100)` verdadeiro | `test:prefs` 7 falhas | "stores nothing — 2 writes" (100 gravado) |
| M24 | `href` do painel sem prefixo de locale | `test:tree-browser` 17/2759 | "every prereqs link starts with /en-us/classes/ — Frost Nova→/classes/…" |
| M25 | `data-related` nunca marcado | `test:tree-browser` 2/2759 | "the whole prerequisite chain lights up" |
| M26 | painel sem `role="region"` | `test:tree-browser` 56/2759 | "the docked panel is a named region — null" a 1024/1280 |
| M27 | medição do glifo sem estado-sonda | `test:tree-browser` 40/2750 | mede os nomes já escondidos: a 150 % "zero broken words … (names mode)" falha, o glifo nunca entra |

Duas notas de honestidade sobre a execução:

- **M9 foi aplicada duas vezes.** A primeira forma trocou só o contexto do redutor
  (`hoverCapable: true`) e o gate ficou **verde** (2.759/2.759): o handler `onNodeHoverIn` tem a
  sua própria guarda `matchMedia("(hover: hover)")`, e uma guarda sozinha não é observável quando
  a outra continua lá — é a defesa em profundidade que a revisão apontou (G5). A mutação que modela
  o defeito "toque recebe hover" é a que retira as duas guardas; foi essa que ficou vermelha pela
  razão esperada. A primeira execução fica registrada no log como "NOT CAUGHT".
- **M14 foi executada duas vezes.** Na primeira, o gate ficou vermelho pela razão **errada** — a
  guarda de build obsoleto (`The build is stale: skill-tree-panel.tsx changed 282s after it was
  written`, o `mtime` da reversão de M13). Refeito sobre um build limpo, ficou vermelho pelo teto
  (18 de 22, cada documento "over by" o seu tamanho).

## 9. Achados — o que a integração encontrou, o que foi corrigido e o que fica

### 9.1 Corrigidos antes deste relatório

- **HIGH (gate `test:locale-switch`, 8 falhas):** o controle "Meu nível" era inserido depois da
  hidratação e empurrava 56 px tudo abaixo da seção — quem chegava por `#gear-budget` numa build
  pousava 56 px atrasado (o caso passava 68/68 antes da fase). Correção: o servidor entrega um
  **esqueleto inerte** do controle (`SkillLevelSkeleton`, `aria-hidden`, sem `form`/`input`/`button`,
  visível só sob `(scripting: enabled)`), com a forma exata do controle em qualquer largura e escala
  de texto; a seção mede o mesmo antes e depois (C2b, 16 combinações). O `min-height` fixo que foi a
  primeira tentativa reservava 44 px onde o controle de um leitor a 200 % mede 192 ou 248.
- **Revisão integrada (agente, sem BLOCKER/HIGH):** M1 — Enter era engolido no `keydown`, e
  Ctrl/Cmd/Shift+Enter não abriam a página em nova aba: Enter passa a ser a ativação do próprio
  link, interceptada uma vez e só quando simples (a regra de `class-chip.tsx`); M2 — o Esc global
  limpava a seleção e puxava o foco de outros controles (busca, navegação móvel, campo de nível):
  com o painel ancorado só age com o foco dentro da seção e fora do campo de nível, e nunca depois
  de outro componente o consumir; a sheet mantém o alcance global. LOW corrigidos: prop `level` e
  argumento `via` mortos; `data-row`/`data-col` (~700 B por documento) removidos; o `id` do `h3` de
  cada tree agora nomeia a região da tree (`role="region"`/`tabpanel`, decisão 5); um só `fill`;
  `aria-controls` aponta para o que está exposto (painel de `lg`, sheet enquanto aberta, nada
  abaixo); tecla rejeitada no campo de nível não acusa "inválido" num campo que mostra um número
  válido, e a mensagem entra no `aria-describedby` enquanto inválida; caneta faz hover
  (`pointerType !== "touch"`); margem igual em todas as trees abaixo de `sm`; dois comentários que
  descreviam código que não existia.
- **Gate de navegador, primeira execução integrada (100 falhas de 2.551), triagem:** reais — a
  pílula do contador (altura fixa de 18 px) transbordava o nó a 150 % e a 200 % nas builds (linha
  superior passa a `flex-wrap`, pílula com piso em vez de altura); os nomes das abas transbordavam
  a seção a 200 % e, medido depois nas 24 trees, partiam a 100 % em 320 px (`wrap-anywhere` +
  hifenização em inglês como último recurso, rótulo a 12 px em 320 e uma coluna abaixo de 13,5em);
  o piso CSS de glifo (13em) discordava da medição a 320/150 % (todas as classes têm uma palavra de
  nove letras que a 18 px mede 80 px num nó de 78) — piso a 13,5em, e a pré-hidratação passa a
  mostrar também a faixa e o sigilo de 36 px, para que a altura antes da ilha seja a de depois; a
  grade da Necromancer mede 493/495 e não 484 (fileira elástica, aceito e documentado: ≤ 500).
  Defeitos do gate — corrigidos, nunca relaxados sem motivo escrito: as peças e as abas eram lidas
  com deslocamentos do corpo da grade aplicados à seção (todas as verificações de conectores
  falhavam contra uma página correta; controle sintético adicionado); "≥ 8 peças por grade" era
  um chute (Combat Masteries tem duas arestas; agora é a contagem exata de `edgePieces` sobre
  `treeEdges` mais "cada aresta desenhada"); a legenda não deve explicar "pontos duros" onde não há
  contador (classe); o contador lê "—" sem pontos e a estrela é decoração; React ignora um
  `pointerover` cujo `relatedTarget` é um nó dele (o `body` sob o App Router é) — os eventos
  sintéticos entram de fora (`relatedTarget: null`); `(hover: hover)` não é emulável por
  `setEmulatedMedia`, só por emulação de toque; as linhas da página (tabelas) contavam como `row`
  da grade; abaixo de `sm` o Tab passa pela aba e pelo `summary` do tema antes do nó; a faixa lê
  "Nome · Nível · Estado[ · pontos]"; a 150 % o modo é o que a medição diz e o gate afirma o
  invariante (nada partido, nada cortado, nome no nó ou na faixa); C2b bloqueava também o CSS
  (`*.js` apenas); `test:markup` assumia que a nota editorial só existia no payload da ilha — a
  tabela "Pontos restantes" a renderiza como `<strong>` desde antes; a chegada por `#skills` no
  gate de CLS lia a seção antes de a rolagem suave começar (espera três leituras iguais de
  `scrollY`, como o gate de idioma).

### 9.2 Residuais, registrados

- **D3 (§4):** a caixa da build a 320 px acima de 900.
- **Faixa entre o piso e a sonda:** o piso CSS (13,5em) é por largura em `em`; a sonda é por
  conteúdo. Onde discordam — 390 px a 150 % (Warlock em glifo, Sorceress não) — a altura antes da
  ilha difere da altura depois pela faixa e pelas linhas dos nomes. Só a partir de 150 % de texto,
  só para quem chega por uma âncora abaixo da seção.
- **Transbordo do documento a 320 px e 200 %:** 232 px, do header, igual ao baseline (`docScrollW`
  552). A seção não transborda. Anterior à fase, fora dela.
- **Código morto fora do escopo declarado:** `tileState`/`TILE_STATES`/`layoutTree(...).state` em
  `lib/skills.ts` só vivem para `scripts/skill-tree.test.ts`; o plano limitou `lib/skills.ts` à
  remoção de `skillAriaLabel`.
- **Pontos cegos dos gates (revisão):** clique/Enter modificados não são exercidos; Esc fora da
  árvore e com outro overlay aberto não é exercido; mudanças de ambiente depois da carga (cruzar
  `sm`/`lg`, `hashchange`, `StorageEvent`) não são exercidas; um laptop híbrido emitindo
  `pointerType: "touch"` sob `(hover: hover)` não é simulado; a memória de foco por tree não é
  afirmada; a volta do Tab dentro da sheet só é lida no código-fonte.
- **Comportamentos deliberados que podem surpreender:** uma seleção feita no telefone reabre a
  sheet se a janela alargar além de `lg` e voltar a estreitar; sem JavaScript não há painel, logo o
  resumo da skill fica na página da skill; selecionar o mesmo nó duas vezes não repete o anúncio
  (texto idêntico); as sinergias são resolvidas por classe (uma aresta de míssil entre classes,
  Inferno → Flame Wave, foi filtrada); a aba "pressionada" antes da hidratação é a tree padrão do
  servidor, mesmo quando a URL nomeia outra (a CSS mostra a certa; o estilo da aba chega com a
  ilha); em motores antigos sem `:has()`, `(scripting: enabled)` ou consultas de intervalo, as três
  trees aparecem até a ilha montar; `display: contents` nas fileiras expõe `role=row` no Chrome ≥ 89
  e Safari ≥ 16.4, e só o Chrome é medido.
- **Do plano, sem mudança:** 218 dos 480 movimentos verticais mudam em relação ao vizinho mais
  próximo (decisão 8, medida); a hifenização do nome das abas depende do dicionário do navegador
  (no Chrome headless não hifeniza; `wrap-anywhere` é o último recurso e a 100 % não é alcançado).

## 10. Gates

`NEXT_PUBLIC_SITE_URL=https://d2r-codex.vercel.app npm run predeploy` sobre `.next` apagado, `EXIT=0`
lido do log (`d2r-codex-phase4-predeploy.log`, 2026-09-12 00:38): `build` → `check` → `check:built` →
`check:site-url` ("SITE_URL is publishable"). Também `git diff --check` limpo, `typecheck` e `lint`
(um aviso pré-existente em `scripts/leveling-rules.ts:156`, fora da fase).

| Gate | Resultado | Gate | Resultado |
|---|---|---|---|
| `check:content` + `check:graph-drift` | verdes | `test:a11y` | 1.477 |
| `test:prefs` | 126 | `test:class-html-size` | 22 |
| `test:graph` / `test:class-trees` | 177 / 14 | `test:markup` | 40 |
| `test:necromancer` / `test:druid` / `test:assassin` / `test:barbarian` / `test:warlock` | 256 / 44 / 190 / 78 / 54 | `test:page` / `test:build-page` | 180 / 1.406 |
| `test:synergy-owner` / `test:attributes` / `test:damage` | 16 / 14 / 99 | `test:build-tiers-html` / `test:build-markers-html` / `test:build-toc-html` | 18 / 48 / 42 |
| `test:search` / `test:superlatives` / `test:build-claims` | 190 / 30 / 28 | `test:structure` / `test:build-filters-html` | 12 / 315 |
| `test:allocations` / `test:immunity` / `test:freeze` | 107 / 61 / 32 | `test:mobile-filter-sheet` / `test:filters-desktop` / `test:filters-fold` | 292 / 452 / 110 |
| `test:availability` / `test:leveling` / `test:trap-speed` | 40 / 45 / 111 | `test:mobile-navigation` / `test:locale-switch` / `test:nav-discovery` | 74 / 242 / 461 |
| `test:diminishing-claims` / `test:build-filters` / `test:facet-counts` | 87 / 228 / 38 | `test:viewport` | 1.171 |
| `test:build-sort` / `test:empty-state` / `test:compare-tiers` | 60 / 45 / 76 | `test:build-tier-state` / `test:build-cls` / `test:build-tier-heights` | 141 / 15 / 204 |
| `test:dictionary` / `test:ref-routes` / `test:rating-distribution` | 42 / 44 / 16 | `test:tunnels` / `test:items` / `test:crawl` / `test:not-found` | 45 / 66 / 55 (1.004 páginas) / 272 |
| `test:tree` / `test:tree-geometry` / `test:tree-state` / `test:nav` | 1.500 / 32 / 58 / 564 | `test:synergy` / `test:contrast` / `test:sheet` | 31 / 138 / 210 |
| `test:hygiene` / `lint` / `typecheck` | 46 / 0 erros / 0 erros | `test:tree-browser` / `test:client` | **2.759** / 21 |

Três execuções anteriores do `predeploy` não chegaram ao fim, e ficam registradas: a primeira e a
terceira pararam no **controle** do gate `test:build-cls` ("a deliberately shifting page scores above
the limit — scored 0"): um documento em branco, um deslocamento plantado 500 ms depois, e o Chrome
não reporta deslocamento nos primeiros ~500 ms de um documento (medido: 450 ms dá 0, 500 ms dá
0,229) — ao fim de um `check:built` inteiro, com uma dúzia de gates de navegador atrás, a janela
esticou e o controle certificou zero sobre um observador correto. O controle (o mesmo em
`skill-tree-browser`) passa a esperar um segundo e a repetir o deslocamento até três vezes; três
execuções isoladas e a quarta cadeia inteira verdes. A segunda parou em `test:sheet`: a expressão
regular que confere o tratamento de Esc no código-fonte não admitia a cláusula `|| event.defaultPrevented`
que a revisão (M2) acrescentou — alargada.

## 11. Commits (locais, nenhum enviado)

| Commit | Conteúdo |
|---|---|
| `ef4a97a` Phase 4, commit 0 | o plano, a revisão que ele sobreviveu, o baseline remedido, D1/D2 no PRD |
| `58747df` Phase 4, commit 1 | os contratos em código: tipos, stubs tipados, chaves de dicionário, entradas de `package.json` |
| `5ccaeeb` Phase 4, commit 2 | geometria, navegação e estado — três bibliotecas puras, vermelhas primeiro; `test:tree-geometry` e `test:tree-state` em `check` |
| `0f278b7` Phase 4, commit 3 | `d2rc.level` em `lib/prefs.ts`; o payload por classe (`skill-tree-data*.ts`); allowlist do escritor no `test:hygiene` |
| `865bb3a` Phase 4, commit 4 | a árvore: componentes, páginas, CSS, remoção de `skill-tree.tsx`/`skill-tree-interactive.tsx`, `skillAriaLabel` e onze chaves; os gates reescritos e os novos; `check:built` encadeado |
| `86b4b68` Phase 4, commit 5 | duas calibrações de gate que a cadeia inteira do `predeploy` pediu: o controle de deslocamento (`build-cls`, `skill-tree-browser`) e a expressão do Esc em `sheet.test.ts` (§10) |
| commit 6 | este relatório, as notas medidas no PRD (R-TREE-1…17, §12.2, §14, §18), a evidência visual e o registro das mutations (§8) |

Arquivos alterados pela fase (commits 2–6, sobre `58747df`): `app/globals.css`, as duas páginas
(`classes/[slug]`, `builds/[classSlug]/[slug]`), `components/game/{skill-trees,skill-tree-grid,
skill-tree-tabs,skill-tree-legend,skill-tree-panel,skill-level-control,skill-tree-section,use-name-fit,index}`,
`components/builds/mobile-filter-sheet.tsx` (um comentário), `lib/{prefs,skills,skill-tree-data,
skill-tree-data-pure,skill-tree-geometry,skill-tree-nav,skill-tree-state}`, os dois dicionários,
`package.json`, `scripts/{headless,build-cls.test,build-tier-state.test,class-html-size.test,
client-boundary.test,contrast.test,hygiene.test,locale-switch.test,prefs.test,raw-markup.test,
sheet.test,skill-tree.test,skill-tree-a11y.test,skill-tree-browser.test,skill-tree-geometry.test,
skill-tree-nav.test,skill-tree-state.test,viewport.test}`, `docs/product/PRD-vNext.md`, e os
apagados `components/game/skill-tree.tsx` e `skill-tree-interactive.tsx`.

## 12. Parada: servidor de UAT, URLs e a lista do telefone

**Nada foi enviado, mesclado ou implantado.** `git status` limpo depois do último commit; `origin/main`
continua em `436dc88`; produção continua a servir a Fase 3. A fase não está marcada como concluída.

**Servidor de UAT** (o build do `predeploy`, `next start`, não é servidor de desenvolvimento):
processo `node.exe` **PID 16436**, iniciado escondido (`Start-Process -WindowStyle Hidden`), ligado a
`0.0.0.0:3400`; as seis URLs abaixo respondem **HTTP 200** pelo endereço da rede local
(`192.168.68.110`, Ethernet; a regra de firewall "Node.js JavaScript Runtime" para
`C:\Program Files\nodejs\node.exe` já existia, perfil Public). É o único processo residual da execução.
Para encerrar depois do UAT: `Stop-Process -Id 16436`.

| Página | pt-BR | en-US |
|---|---|---|
| Sorceress (classe) | http://192.168.68.110:3400/pt-br/classes/sorceress | http://192.168.68.110:3400/en-us/classes/sorceress |
| Necromancer (classe) | http://192.168.68.110:3400/pt-br/classes/necromancer | http://192.168.68.110:3400/en-us/classes/necromancer |
| Blizzard (build com árvore alocada) | http://192.168.68.110:3400/pt-br/builds/sorceress/blizzard-sorceress | http://192.168.68.110:3400/en-us/builds/sorceress/blizzard-sorceress |

**Os dez itens do telefone** (PRD §14, "Portão de publicação"), em ~320 px e ~390 px ou dois
aparelhos, nos dois idiomas:

1. Tocar dez nós consecutivos da Cold Spells sem errar o alvo (cada toque abre a sheet da skill
   certa; fechar e tocar o seguinte).
2. Trocar entre as três trees pelas abas — a página não navega, o foco fica na aba, só uma tree
   aparece.
3. Abrir e fechar a sheet pelo botão, pelo fundo e (com teclado ligado) por Esc.
4. Ao fechar, o foco volta ao nó que abriu (o anel de foco aparece nele).
5. Rolar a página sobre a grade sem abrir nenhum nó por acidente.
6. Safe area e bordas curvas: o trilho de níveis (1/6/12/18/24/30) e a primeira coluna não ficam
   escondidos nem cortados.
7. Ler os nomes das dez skills da tree no estado normal (texto padrão do aparelho).
8. Com o texto ampliado do aparelho (Configurações → Acessibilidade → Tamanho do texto, o maior), a
   grade continua 3×6 sem rolagem horizontal; tocar uma skill em modo glifo e identificar o nome
   pela faixa acima da grade e pela sheet.
9. Repetir 1–8 em pt-BR e en-US (a chave `PT`/`EN` no header).
10. Na build Blizzard: os contadores (✦20, 1, —) e "88 de 110 pontos duros obrigatórios"; em "Meu
    nível", gravar 18 e ver os nós acima de 18 bloqueados; "Limpar" desbloqueia; recarregar mantém.

**Reprovação em qualquer item** autoriza ajustar dimensão, inset e comportamento sem reabrir a
direção estrutural (PRD §14). **Aprovação explícita** é o que destrava o push.
