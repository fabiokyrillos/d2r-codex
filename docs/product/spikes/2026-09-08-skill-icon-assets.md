# Spike 0B.2 — cobertura, origem e licença dos ícones de skill

**Data:** 2026-09-08 · **Requisito:** R-TREE-19 (PRD vNext §8.5) · **Fase:** 0B, item P0.5
**Consumido por:** R-TREE-17 (teto de HTML), R-TREE-18 (manifesto e cobertura), aceite da Fase 4, decisão **Q1** (§15)

**Artefatos deste spike**

| Arquivo | O que é |
|---|---|
| `docs/product/spikes/2026-09-08-skill-icon-assets.md` | este relatório: as oito respostas, o orçamento e as perguntas de Q1 |
| `docs/product/spikes/2026-09-08-skill-icon-matrix.csv` | matriz skill a skill (130 linhas), com posição, ícone candidato, autor e veredito |
| `docs/product/spikes/2026-09-08-skill-icon-inventory.csv` | inventário numérico das 240 skills por classe, tree, tipo e elemento |
| `docs/product/spikes/2026-09-08-skill-icon-comparison.html` | artefato lado a lado, autocontido, com SVG desenhado para este spike |

**O que este spike não faz.** Não decide Q1. Não implementa otimização. Não cria manifesto de
produção. Não baixa nem versiona nenhum asset de terceiro. Não fixa formato de arquivo nem
sprite `<symbol>/<use>` — o PRD reclassificou isso como hipótese (§17.7) e aqui continua hipótese.
Nenhum arquivo fora de `docs/product/spikes/` foi alterado.

---

## Sumário para quem só vai ler uma coisa

1. As 240 skills existem, foram contadas do grafo gerado, e **não há variantes**: um ícone por skill,
   240 ícones, sem exceção.
2. O melhor candidato externo do mercado — **game-icons.net**, 4.239 arquivos, CC BY 3.0 — tem
   licença limpa e verificável, permite modificar e redistribuir, e **não cobre 240 skills de D2 com
   uma mão visual única**. Nas 130 skills mapeadas em detalhe, 38 (29,2 %) não têm ícone nenhum e as
   92 que têm exigem **7 autores diferentes**.
3. A árvore que mais estressa o mapeamento não é o Warlock (nomes inventados em 2026, previsível);
   são as **20 auras do Paladin**, das quais 9 não têm candidato, e as **10 masteries do Barbarian**,
   onde a arma se desenha e a maestria não.
4. **Ninguém "fica parado" de graça:** a opção (D), glifos por categoria, é literalmente o estado de
   hoje — quatro formas distintas desenham as 30 skills da Sorceress na página construída.
5. O baseline de HTML foi remedido e bate: **319.282 bytes = 311,8 KiB** em
   `/en-us/classes/sorceress`. A pior página hoje é `/pt-br/classes/sorceress`, com 322.576 bytes.
6. Achado novo e decisivo para o orçamento: **a geometria de cada ícone é paga 3× por página de
   classe** — uma vez na marcação e duas na carga RSC embutida no mesmo documento. Isso foi medido,
   não estimado.
7. **Teto proposto: 368.640 bytes (360 KiB) por documento HTML de página de classe, em qualquer
   locale.** Com esse teto e a duplicação de 3×, um conjunto próprio desenhado para 36–44 px cabe com
   folga; o game-icons.net embutido na mediana **não cabe**.
8. **Recomendação: (A), conjunto próprio completo** — mas veja §11, incluindo o que enfraquece a
   recomendação, e §12, com as perguntas que só o proprietário responde.

---

## 1. Método

Tudo aqui é reproduzível. Os comandos rodaram no worktree `phase-0b2`, sobre o commit `8fb88c2`.

### 1.1 Inventário

Lido diretamente das duas fontes de verdade, sem números de memória:

- `content/classes/skill-graph.ts` (`SKILL_GRAPH`) — classe, tree, página, fila, coluna, nível de
  desbloqueio, teto de pontos e pré-requisitos. Arquivo gerado de `blizzhackers/d2data`, commit
  `fc469993502d0498809b9fc1af140ee2a9eb8902`, patch 3.3.
- `content/classes/index.ts` (`allSkills`, `allSkillTrees`) — nome, tipo (`kind`) e elemento.

Script de contagem: `inventory.ts` no diretório de trabalho da sessão. Ele importa os dois módulos
por caminho absoluto (ambos só usam `import type` para o alias `@/`, que o `tsx` apaga), cruza as
duas listas e emite `inventory.json` e `inventory-summary.txt`.

### 1.2 Medição de HTML

1. `export NEXT_PRIVATE_OUTPUT_TRACE_ROOT=D:/Projetos && npm run build` (saiu com `EXIT=0`).
2. O documento pré-renderizado de cada página de classe fica em
   `.next/server/app/<locale>/classes/<classe>.html`.
3. **O tamanho do arquivo em bytes é o número "HTML decodificado"** — é o documento sem compressão,
   exatamente o que o navegador precisa parsear. KiB = bytes ÷ 1024.

Esse é o mesmo diretório que `scripts/raw-markup.test.ts`, `scripts/skill-tree-a11y.test.ts` e
`scripts/crawl.test.ts` já leem, através de `scripts/build-freshness.ts` (`buildRoot()` /
`assertFreshBuild()`). Um gate futuro de R-TREE-17 reusa esse helper e não inventa método novo.

### 1.3 Pesquisa de licença

Cada conjunto foi verificado na **fonte oficial** (site ou repositório do próprio conjunto), nunca
em blog ou agregador. As URLs e a data de consulta estão em §13. Onde a licença dos assets difere da
licença do código, as duas estão registradas separadamente.

---

## 2. Resposta 1 — número total de skills exibidas, e variantes

**240 skills.** Contado, não citado.

| Escopo | Contagem |
|---|---|
| Nós em `SKILL_GRAPH` | **240** |
| Skills autoradas em `allSkills` | **240** |
| Skills autoradas sem nó no grafo | 0 |
| Nós no grafo sem skill autorada | 0 |
| Trees (`allSkillTrees`) | 24 |
| Nomes de exibição distintos | **240** (nenhuma colisão entre classes) |
| Teto de pontos duros (`maxLevel`) | 20 para todas as 240 |

**Variantes: nenhuma.** Um ícone por skill cobre tudo o que o site desenha hoje e tudo o que a
Fase 4 pede:

- os quatro estados de R-TREE-5 (bloqueada / disponível / investida / maximizada) são **moldura e
  contador**, não arte diferente — o artefato lado a lado demonstra os quatro com o mesmo glifo;
- o elemento é **cor por CSS** (`currentColor` + `text-el-*`), não um segundo arquivo;
- pt-BR e en-US usam os mesmos ícones, porque nomes de jogo ficam em inglês (ADR 0003);
- a página de build e a página de classe compartilham o mesmo componente de árvore.

**O que muda de verdade é o tamanho de renderização, e isso é um requisito de desenho, não uma
variante.** Hoje `SkillSigil` é chamado com `size` **14, 16, 18 e 20** px
(`app/[lang]/classes/[slug]/skills/[skillSlug]/page.tsx`, `components/game/skill-packages.tsx`,
`components/game/skill-tree.tsx`), e a Fase 4 acrescenta o nó de **36–44 px**. Um único desenho tem
de ser legível dos 14 aos 44 px. Guarde esse número: ele é o argumento mais forte contra silhuetas
detalhadas desenhadas para 512 px.

---

## 3. Resposta 2 — cobertura por classe

Perfeitamente regular. Cada classe tem 30 skills, cada tree tem 10, e cada tree ocupa 10 das 18
células da grade 3×6.

| Classe | Skills | Trees | Skills por tree | Células ocupadas |
|---|---|---|---|---|
| amazon | 30 | bow-and-crossbow, javelin-and-spear, passive-and-magic | 10 / 10 / 10 | 30 de 54 |
| assassin | 30 | martial-arts, shadow-disciplines, traps | 10 / 10 / 10 | 30 de 54 |
| barbarian | 30 | barbarian-combat-skills, combat-masteries, warcries | 10 / 10 / 10 | 30 de 54 |
| druid | 30 | druid-summoning, elemental, shape-shifting | 10 / 10 / 10 | 30 de 54 |
| necromancer | 30 | curses, poison-and-bone, summoning | 10 / 10 / 10 | 30 de 54 |
| paladin | 30 | combat-skills, defensive-auras, offensive-auras | 10 / 10 / 10 | 30 de 54 |
| sorceress | 30 | cold-spells, fire-spells, lightning-spells | 10 / 10 / 10 | 30 de 54 |
| warlock | 30 | chaos, demon, eldritch | 10 / 10 / 10 | 30 de 54 |
| **total** | **240** | **24** | — | **240 de 432** |

Distribuição por tipo e elemento (o que o placeholder atual usa para escolher forma e cor):

| `kind` | Skills | | `element` | Skills |
|---|---|---|---|---|
| attack | 60 | | none | 111 |
| spell | 60 | | fire | 33 |
| summon | 34 | | physical | 25 |
| passive | 30 | | magic | 24 |
| aura | 20 | | lightning | 20 |
| buff | 19 | | cold | 19 |
| curse | 15 | | poison | 8 |
| shapeshift | 2 | | | |

Esses números explicam por que (D) não resolve nada: **8 formas para 240 skills**, e as duas maiores
famílias sozinhas cobrem metade do jogo.

---

## 4. Candidatos comparados

| | O que é | Fonte oficial | Veredito deste spike |
|---|---|---|---|
| **A** | Conjunto próprio completo, 240 desenhos | — | Viável; único que garante cobertura e mão única |
| **B** | Conjunto CC BY completo (game-icons.net) | https://game-icons.net | Licença limpa; **cobertura insuficiente e mão múltipla** |
| **C** | Licenciado como base + próprios por cima | — | Já eliminado pela preferência declarada do proprietário; e (B) o produz sozinho, por causa das lacunas |
| **D** | Glifos próprios por categoria | `components/game/skill-sigil.tsx` | **É o estado atual**, não uma etapa: ficar parado |

### 4.1 Candidatos externos considerados e por que caíram

| Conjunto | Ícones | Licença dos assets | Por que não é candidato viável |
|---|---|---|---|
| **game-icons.net** | 4.239 arquivos (4.180 ícones + 59 badges) | CC BY 3.0, alguns CC0 | **Único candidato sério.** Analisado em detalhe abaixo |
| **RPG Awesome** | 496 classes de ícone | Fonte sob SIL OFL 1.1 | Entregue **só como webfont**; usar como SVG inline exige extrair glifos da fonte, o que é obra derivada de fonte OFL (renomeação obrigatória, redistribuição sob OFL). Não tem `skeleton` nem `golem`. Metade do tamanho do game-icons |
| **Font Awesome Free** | ~2.000 | Ícones CC BY 4.0; fontes OFL 1.1; código MIT | Vocabulário de interface, não de fantasia. Cobertura de D2 próxima de zero |
| **Lucide** | ~1.600 | ISC (repositório inteiro) | Ícones de interface de traço fino, 24×24 com `stroke-width` fixo. Não tem assunto de fantasia |
| **Tabler Icons** | 6.100+ | MIT | Idem — conjunto de interface |
| **The Noun Project** | milhões | **por ícone**, mista (CC BY ou paga) | Não é "um conjunto": é um mercado de autores. Adotá-lo é adotar dezenas de mãos e dezenas de linhas de atribuição. Contradiz R-TREE-18 na origem |
| **OpenGameArt (pacote original de Lorc)** | 789 | CC BY 3.0 | É o ancestral do game-icons.net e está contido nele, em bitmap de 400 px. Sem vantagem sobre (B) |

**Nenhum conjunto extraído de Diablo II ou D2R foi considerado.** Recolorização, traçado vetorial
por cima da arte e reprodução por semelhança estão proibidos por §8.5 e §1.6 e não foram avaliados.

### 4.2 Anatomia do candidato (B) — game-icons.net

Contado a partir da árvore oficial do repositório
(`https://api.github.com/repos/game-icons/icons/git/trees/master?recursive=1`, SHA
`82d948812bfe3f269ef8f731dcdb07b08160edc4`, listagem não truncada, consultada em 2026-09-08).
**Nada foi baixado além da listagem: nomes, autores e tamanhos.**

| | |
|---|---|
| Arquivos `.svg` no repositório | **4.239** |
| Pastas | 37 — 36 de autor + `badges` |
| Contribuintes nomeados no `license.txt` | 35 |
| Tamanho total | 6.985.185 B |
| Tamanho médio por arquivo | 1.648 B |
| Mediana | **1.415 B** |
| p90 | 2.992 B |
| Mínimo / máximo | 151 B / 29.212 B |

Os cinco maiores autores:

| Autor | Ícones | Média por arquivo | Mediana | p90 |
|---|---|---|---|---|
| Delapouite | 2.022 | 1.627 B | 1.421 B | 2.996 B |
| Lorc | 1.429 | 1.683 B | 1.471 B | 2.948 B |
| Skoll | 172 | 1.260 B | 1.067 B | 2.286 B |
| Caro Asercion | 127 | 1.438 B | 1.345 B | 2.530 B |
| Viscious Speed (CC0) | 121 | 3.416 B | 2.333 B | 6.383 B |

Note a cauda: Felbrigg tem 5 ícones de **296 B** de média e Cathelineau tem 29 de **2.857 B**. São
dez vezes de diferença em densidade de traço. Isso não é ruído estatístico; é o que "mão visual"
significa medido em bytes.

---

## 5. Resposta 4 — licença e atribuição

### 5.1 game-icons.net (candidato B)

| Item | Registro |
|---|---|
| **Licença dos assets** | Creative Commons **Attribution 3.0 Unported (CC BY 3.0)**; alguns ícones em **CC0** |
| **URL da licença** | https://creativecommons.org/licenses/by/3.0/ (URL canônica declarada na própria página) |
| **Onde o conjunto declara** | https://game-icons.net/about.html · https://game-icons.net/faq.html · https://raw.githubusercontent.com/game-icons/icons/master/license.txt |
| **Autores** | 35 contribuintes nomeados no `license.txt`, um por pasta do repositório. Os maiores: Delapouite (2.022), Lorc (1.429), Skoll (172), Caro Asercion (127), Viscious Speed (121, **CC0**), sbed (95). Zeromancer também é **CC0** |
| **Atribuição exigida** | Sim, **por ícone**. O `license.txt` pede: *"Please, include a mention 'Icons made by {author}' in your derivative work."* A página About dá a forma completa: *"Icons made by {author}. Available on https://game-icons.net"*. A CC BY 3.0 acrescenta duas obrigações que o texto do conjunto omite: **link para a licença** e **indicar se houve modificação** |
| **Onde a atribuição tem de aparecer** | Em um lugar razoável para o meio. Para um site: uma página de créditos. No Codex isso é `app/[lang]/about/sources/page.tsx`, gerada do manifesto, como R-TREE-18 já exige |
| **Modificação permitida?** | **Sim.** "Adapt — remix, transform, and build upon the material for any purpose, even commercially." Recolorir, redesenhar e combinar são permitidos, **desde que a modificação seja declarada** |
| **Redistribuição permitida?** | **Sim.** "Share — copy and redistribute the material in any medium or format for any purpose, even commercially." Hospedar os arquivos no próprio site é explicitamente coberto |
| **Revogável?** | **Não.** "The licensor cannot revoke these freedoms as long as you follow the license terms." É o oposto da licença do Legal FAQ da Blizzard, que é revogável |
| **Licença do código × dos assets** | **Diferentes, e uma delas não foi localizada.** O `license.txt` cobre **apenas os ícones** ("Icons provided under..."). O repositório também contém `colorize-svgs.sh`, `rasterize-svgs.sh`, `check-svgs.sh`, `Gruntfile`-equivalentes e documentação, e **nenhuma licença é declarada para esses arquivos**. Para o uso pretendido (só os SVGs) isso é irrelevante, mas fica registrado: **licença do código não localizada** |

**Uma inconsistência de atribuição que um manifesto tem de resolver.** O repositório tem 36 pastas de
autor e o `license.txt` nomeia 35 contribuintes. As duas listas não fecham. A consequência prática é
direta: **o autor de cada ícone tem de ser lido da pasta do arquivo, nunca da lista em prosa.** Se a
Fase 5 gerar as atribuições da lista do site, uma delas vai sair errada.

**Um risco de conteúdo que a licença não cobre.** O conjunto contém ícones cujo *assunto* é
propriedade de terceiros. Uma varredura por nome encontrou, entre outros: `lorc/diablo-skull`,
`lorc/harry-potter-skull`, `delapouite/death-star`, `delapouite/thor-hammer`,
`delapouite/holy-hand-grenade`, `delapouite/mighty-boosh`, `delapouite/hobbit-door`,
`delapouite/hobbit-dwelling`, `delapouite/sonic-shoes`. A própria página About declara que o traço é
inspirado nos HUDs de *Team Fortress 2* e *Dungeon Keeper 2*. Nada disso invalida a CC BY — mas a CC
BY **não garante** que o licenciante tinha direito sobre o assunto licenciado (as licenças CC não dão
garantia). Num site de fãs de Diablo, adotar um conjunto que contém um arquivo chamado
`diablo-skull` é exatamente a "semelhança que possa ser confundida com a arte oficial" que §8.5 lista
como critério para **não** usar um asset. Adoção em bloco está fora; adoção com curadoria por ícone é
possível, e é trabalho de curadoria, não de licença.

### 5.2 Os outros conjuntos (registro de licença)

| Conjunto | Assets | Código | Fonte |
|---|---|---|---|
| **RPG Awesome** | Fonte: **SIL OFL 1.1** (http://scripts.sil.org/OFL; texto oficial atual em https://openfontlicense.org/open-font-license-official-text/) | CSS e SASS: **MIT**. Documentação: **CC BY 3.0** | `README.md` do repositório oficial |
| **Font Awesome Free** | Ícones: **CC BY 4.0**. Fontes: **OFL 1.1** | Código: **MIT** | `LICENSE.txt` do repositório oficial |
| **Lucide** | **ISC**, cobrindo o repositório inteiro | idem | `LICENSE` do repositório oficial |
| **Tabler Icons** | **MIT** | idem | metadados do repositório oficial |
| **The Noun Project** | **por ícone**: CC BY ou royalty-free paga | n/a | modelo do serviço |

A OFL 1.1 merece um parágrafo porque é o caso em que "livre" não significa "livre para isto". Ela
permite usar, modificar e redistribuir, mas impõe **Reserved Font Name** (uma versão modificada tem
de ser renomeada) e proíbe vender a fonte isoladamente. Extrair 240 glifos de uma fonte OFL para
servi-los como SVG inline é redistribuição de dados de fonte derivados, e arrasta essas obrigações
para dentro do projeto. Não vale a pena por 496 ícones que nem têm `skeleton`.

**Nenhuma licença ficou "não localizada" entre os conjuntos avaliados**, com a única exceção
registrada acima: a licença do **código** do repositório game-icons/icons.

---

## 6. Resposta 3 — cobertura skill a skill do candidato (B)

Matriz completa em `2026-09-08-skill-icon-matrix.csv`: 130 linhas, com classe, tree, fila, coluna,
nível, tipo, elemento, ícone candidato, autor, veredito e justificativa. Toda linha foi conferida por
script contra o grafo gerado (posição, nível, tipo e elemento) e **todo ícone citado foi conferido
contra a listagem oficial do repositório** — 92 citações, 92 existem, 0 problemas.

Escopo da matriz: as **30 da Sorceress**, as **30 do Necromancer** (as duas que R-TREE-19 nomeia) e
**70 amostras** das outras seis classes, escolhidas por estressarem o mapeamento (§6.2).

### 6.1 Resultado

| Veredito | Total (130) | Sorceress (30) | Necromancer (30) | Amostras (70) |
|---|---|---|---|---|
| **direto** — o ícone é a skill | 27 (20,8 %) | 14 | 5 | 8 |
| **aceitável** — lê a skill sem constranger | 35 (26,9 %) | 11 | 10 | 14 |
| **forçado** — só funciona com legenda | 30 (23,1 %) | 5 | 10 | 15 |
| **ausente** — não existe candidato | 38 (29,2 %) | **0** | 5 | 33 |
| **cobertura sem constrangimento** (direto + aceitável) | **62 (47,7 %)** | 25 (83,3 %) | 15 (50,0 %) | 22 (31,4 %) |

Por classe avaliada:

| Classe | direto | aceitável | forçado | ausente |
|---|---|---|---|---|
| sorceress (30) | 14 | 11 | 5 | 0 |
| necromancer (30) | 5 | 10 | 10 | 5 |
| paladin (20 auras) | 2 | 5 | 4 | **9** |
| barbarian (10 masteries) | 0 | 0 | 5 | 5 |
| amazon (10 passivas) | 1 | 3 | 2 | 4 |
| assassin (10 martial arts) | 1 | 2 | 3 | 4 |
| druid (10 summoning) | 2 | 4 | 1 | 3 |
| warlock (10 chaos) | 2 | 0 | 0 | **8** |

**O teste que R-TREE-19 nomeia explicitamente — o ícone distingue Blizzard de Ice Blast? — passa
para (B):** `lorc/snowing` e `lorc/ice-bomb` são distinguíveis. Também passa para (A), como o
artefato lado a lado mostra. **Falha para (D)**, o estado atual, onde as duas são a mesma estrela de
quatro pontas azul.

### 6.2 Por que estas amostras, e o que elas mostram

| Amostra | Por que estressa o mapeamento | O que apareceu |
|---|---|---|
| **Paladin, 20 auras** | Auras são estados contínuos e abstratos — o pior caso possível para ícone | 9 de 20 sem candidato nenhum: Defiance, Cleansing, Vigor, Redemption, Salvation, Holy Freeze, Holy Shock, Fanaticism, Conviction |
| **Barbarian, 10 masteries** | Seis masteries de arma são o mesmo conceito repetido; a arma se desenha, a maestria não | 5 forçadas (a arma sem a maestria) e 5 ausentes; `polearm` não existe no conjunto |
| **Amazon, passivas** | Dodge, Avoid e Evade são sinônimos mecânicos que precisam de três ícones distintos | `felbrigg/dodge` e `delapouite/avoidance` existem — **de dois autores diferentes** — e Evade não existe |
| **Assassin, martial arts** | Quatro skills "Dragon*" e finalizadores de carga na mesma grade | Dragon Talon, Dragon Flight, Claws of Thunder e Phoenix Strike ausentes; `phoenix` não existe no conjunto |
| **Druid, summoning** | Três lobos e um urso disputando o mesmo assunto visual | Spirit Wolf e Dire Wolf ficam lado a lado com o mesmo tema; três "vinhas" e só duas imagens |
| **Warlock, chaos** | As 30 skills do Warlock são nomes criados para *Reign of the Warlock* (2026) | 8 de 10 ausentes; `sigil`, `miasma`, `abyss`, `apocalypse` e `entropy` não existem no conjunto |

O Warlock era esperado. **O Paladin não era**, e é o achado que mais deveria pesar em Q1: a classe
mais jogada de D2 tem duas árvores inteiras de auras, e um conjunto de 4.239 ícones de fantasia
cobre menos da metade delas.

### 6.3 Colisões: o mesmo arquivo para duas skills

Três arquivos apareceram como melhor candidato de **duas** skills diferentes:

| Arquivo | Skills |
|---|---|
| `lorc/ice-shield` | Frozen Armor (Sorceress) · Resist Cold (Paladin) |
| `lorc/ice-spear` | Glacial Spike (Sorceress) · Blades of Ice (Assassin) |
| `lorc/fire-ring` | Ring of Fire (Warlock) · Holy Fire (Paladin) |

Em 130 skills isso já acontece três vezes. Em 240, com a mesma taxa, seriam cinco ou seis pares
idênticos na mesma árvore de navegação — precisamente o defeito que a auditoria §2.6 aponta hoje.

---

## 7. Resposta 5 — lacunas

**38 das 130 skills avaliadas não têm ícone candidato**, e a distribuição das lacunas é o que
importa mais do que o total. Não são casos exóticos espalhados; são **famílias inteiras de
mecânica**:

| Família | Exemplos ausentes | Por quê |
|---|---|---|
| Auras do Paladin | Defiance, Cleansing, Vigor, Redemption, Salvation, Fanaticism, Conviction, Holy Freeze, Holy Shock | Estados contínuos abstratos não têm imagem convencional |
| Masteries | Polearm Mastery; e "mastery" como conceito não existe em nenhum lugar do conjunto | A maestria não é um objeto |
| Passivas de esquiva | Critical Strike, Penetrate, Evade, Decoy | Estatísticas, não coisas |
| Golems | Blood Golem, Fire Golem, Raise Skeletal Mage | Há cinco golems no conjunto (ice, rock, metal, head, robot) e nenhum deles é de sangue nem de fogo |
| Curses abstratas | Decrepify | Nada nos 4.239 arquivos expressa decrepitude |
| Léxico do Warlock | Sigil:*, Miasma*, Abyss, Apocalypse, Enhanced Entropy | Nomes de 2026; nenhum conjunto anterior podia tê-los |

Duas consequências:

1. **Toda lacuna vira desenho próprio.** Ou seja: adotar (B) integralmente **produz (C)** — duas
   mãos visuais na mesma grade — que é exatamente a opção que a preferência declarada do proprietário
   já eliminou.
2. **A classe nova é o pior caso permanente.** O Warlock chegou em fevereiro de 2026 com 30 nomes
   novos. Uma classe futura chegará igual. Sob (B), cada classe nova é um novo lote de lacunas; sob
   (A), é um lote de desenhos — que é o mesmo trabalho, mas sem quebrar a mão visual.

---

## 8. Resposta 6 — consistência visual: uma mão só?

**Não, e o número é objetivo.** Mapear as 130 skills avaliadas exige **7 autores**:

| Autor | Ícones citados | Ícones no conjunto | Média por arquivo |
|---|---|---|---|
| Lorc | 61 | 1.429 | 1.683 B |
| Delapouite | 20 | 2.022 | 1.627 B |
| Skoll | 5 | 172 | 1.260 B |
| Sbed | 3 | 95 | **694 B** |
| Willdabeast | 1 | 7 | 1.615 B |
| Felbrigg | 1 | 5 | **296 B** |
| Cathelineau | 1 | 29 | **2.857 B** |

A média por arquivo é um proxy grosseiro mas útil de densidade de traço: **Felbrigg desenha com um
décimo dos bytes de Cathelineau.** Colocar os dois lado a lado na mesma grade de 3×6 é visível.

**Restringir a um autor não resolve.** Se o conjunto for limitado a Lorc — o maior acervo de assunto
de fantasia, 1.429 ícones — **31 dos 92 ícones citados (33,7 %) desaparecem**, incluindo:

- **Raise Skeleton** e **Revive** (Skoll) — duas das skills mais reconhecíveis do Necromancer;
- **Iron Golem** e **Clay Golem** (Delapouite);
- **Dim Vision** (Skoll);
- **Chain Lightning** (Willdabeast) — o único acerto exato de nome em toda a árvore de raio;
- **Dodge** (Felbrigg) e **Avoid** (Delapouite) — o par que já era problemático;
- **Poison Nova** e **Poison Explosion** (Sbed).

Ou seja: **a escolha em (B) é entre cobertura e consistência, e não é possível ter as duas.** É a
mesma escolha que a revisão independente já dizia que o proprietário tinha rejeitado ao declarar que
"consistência completa importa mais que ter poucos ícones perfeitos".

---

## 9. Resposta 7 — formatos e custo de tematização por CSS

| | (A) próprio | (B) game-icons.net | (D) atual |
|---|---|---|---|
| Formato de origem | SVG autorado | SVG, um arquivo por ícone | SVG inline em TSX |
| `viewBox` | escolhido por nós (24×24 hoje) | 512×512 no conjunto | 24×24 |
| Cor de origem | `currentColor` desde o início | **branco sobre preto**, com um `<path>` de fundo | `currentColor` |
| Custo para tematizar por CSS | **zero** | **uma reescrita por arquivo**: remover o retângulo de fundo, trocar `fill` fixo por `currentColor`, normalizar o `viewBox` | zero |
| Isso é permitido? | — | **Sim** — CC BY 3.0 permite adaptar. Mas a modificação **tem de ser declarada** na atribuição | — |
| Estados sem depender de cor | moldura + contador (demonstrado no artefato) | idem | idem |
| Imagem raster | proibida por R-TREE-17 (impede recolorir) | o conjunto oferece PNG; **não usar** | — |

Duas observações que valem para qualquer candidato:

1. **`currentColor` é inegociável.** As seis cores de elemento e os quatro estados são CSS. Qualquer
   formato que fixe cor no arquivo (PNG, WebP, SVG com `fill` literal) quebra R-TREE-17 e o gate de
   contraste. O artefato lado a lado tem uma seção demonstrando o mesmo glifo nas seis cores.
2. **Reescrever 240 arquivos de terceiro para `currentColor` não é barato nem invisível.** É um passo
   mecânico, mas produz 240 obras derivadas, cada uma exigindo a nota "modificado" na atribuição — e
   é exatamente onde o custo de (B) para de ser "240 mapeamentos" e vira "240 mapeamentos + 240
   reescritas + 38 desenhos próprios".

---

## 10. Resposta 8 — custo de produzir um conjunto próprio completo (A)

Medido, não estimado no vazio: os **dez glifos que desenhei para o artefato lado a lado** (Blizzard,
Ice Blast, Frozen Orb, Glacial Spike, Frost Nova, Frozen Armor, Raise Skeleton, Iron Golem, Corpse
Explosion, Teleport) têm de **147 a 454 bytes** de conteúdo SVG, média **254 B**. O sigilo atual tem
média de 94 B de conteúdo. Um conjunto próprio, portanto, custa cerca de **2,7× o peso do
placeholder**, não 15× como o conjunto externo (§11.3).

| Dimensão | Estimativa | Base |
|---|---|---|
| Peso de arquivo | ~250 B de conteúdo SVG por glifo, ~400 B no pior caso | 10 desenhos medidos neste spike |
| Vocabulário visual | ~30 primitivas reutilizáveis (estilhaço, chama, crânio, aura, moldura, seta, contador) cobrem quase tudo; 240 glifos são combinações delas | as 8 famílias de `kind` e os 7 elementos já classificam as 240 |
| Ritmo realista | 8–12 glifos por sessão de desenho depois que o vocabulário estiver fixo | os 10 deste artefato saíram em uma sessão, já com a grade e a espessura definidas |
| Sessões | ~24 a 30 | 240 ÷ 8–10 |
| Manutenção | 30 glifos por classe nova | o Warlock provou que isso acontece |
| Obrigação legal | nenhuma | autoria do projeto |
| Risco de mão múltipla | nenhum | um autor, uma grade, uma espessura |

O trabalho não é pequeno. Mas **três coisas o reduzem em relação ao que o PRD supunha**:

1. A parte cara já está feita — posições, grafo, teclado, sheet, estados.
2. O nome fica sempre em texto ao lado. O glifo acelera o reconhecimento; não precisa carregá-lo
   sozinho. Isso permite desenhos simples e legíveis a 14 px, que é o tamanho mínimo real (§2).
3. **38 dos 130 mapeamentos de (B) já teriam de ser desenhados de qualquer forma.** Extrapolando a
   proporção, (B) não elimina o trabalho de desenho — reduz-o e o mistura com trabalho de curadoria,
   reescrita e atribuição.

---

## 11. Orçamento de HTML por página de classe

Esta é a saída declarada de R-TREE-19 que R-TREE-17 consome pelo número.

### 11.1 Baseline remedido

O baseline de 312 KB decodificados citado na auditoria de 2026-09-07 **foi reproduzido**:

| Documento | Bytes | KiB |
|---|---|---|
| **`/en-us/classes/sorceress`** (rota de referência) | **319.282** | **311,8** |
| `/pt-br/classes/sorceress` (**pior página hoje**) | 322.576 | 315,0 |
| `/en-us/classes/assassin` | 296.796 | 289,8 |
| `/en-us/classes/paladin` | 284.380 | 277,7 |
| `/en-us/classes/amazon` | 284.827 | 278,2 |
| `/en-us/classes/warlock` | 283.301 | 276,7 |
| `/en-us/classes/druid` | 281.709 | 275,1 |
| `/en-us/classes/necromancer` | 275.886 | 269,4 |
| `/en-us/classes/barbarian` (**menor**) | 268.124 | 261,8 |

As oito páginas pt-BR ficam de 2.200 a 3.300 bytes acima das equivalentes en-US.

**O teto precisa valer para os 16 documentos, não só para a rota de referência.** A auditoria mediu
uma; o gate mede todas, e a pior é pt-BR.

### 11.2 HTML, CSS, JS e assets separados

Composição de `/en-us/classes/sorceress.html` (319.282 B):

| Parte | Bytes | KiB | Observação |
|---|---|---|---|
| `<script>` embutido (carga RSC) | 199.916 | 195,2 | 20 tags; é 62,6 % do documento |
| Marcação fora de script/style | 119.366 | 116,6 | o HTML que o leitor vê |
| `<style>` embutido | 0 | 0 | nenhum |
| `<svg>` inline na marcação | 12.524 | 12,2 | 33 elementos, dos quais 30 são sigilos |

Recursos externos referenciados pelo mesmo documento (não contam para o teto, mas fazem parte da
contabilidade que R-TREE-19 pede):

| Recurso | Arquivos | Bytes | KiB |
|---|---|---|---|
| CSS | 2 | 53.318 | 52,1 |
| JS | 9 | 611.986 | 597,6 |
| Fontes (woff2) | 6 (o build tem 15) | 229.812 | 224,4 |
| Assets em `public/` | 5 | 3.314 | 3,2 |
| Imagens raster | **0** | 0 | 0 — o site não tem `<img>` |

Sidecar `.rsc` (navegação client-side, não é o primeiro documento): 148.731 a 177.242 B por classe.

### 11.3 O achado que muda o cálculo: a geometria é paga 3×

O documento de classe contém **30 sigilos na marcação** e **60 cópias serializadas na carga RSC**
embutida no mesmo arquivo — a árvore é uma ilha client-side, e o elemento SVG atravessa a fronteira
servidor→cliente como prop.

Medido de forma independente da carga: contando as ocorrências de cada string de `d` de caminho no
documento inteiro (o dado de caminho é byte-idêntico na marcação e no JSON escapado), e dividindo
pelo número de skills daquele tipo na página:

- 33 pares (classe, tipo) medidos nas 8 páginas de classe;
- **32 deles deram exatamente 3,00**;
- um outlier em 2,89 (Barbarian/attack: 26 ocorrências para 9 skills).

**Fator de duplicação = 3.** Cada byte de geometria de ícone é pago três vezes por página de classe.

Custo atual do placeholder, para comparação:

| | Sorceress | Faixa nas 8 classes |
|---|---|---|
| Sigilos na marcação | 30, 7.754 B, média 258 B por elemento | 7.646–8.217 B |
| Conteúdo interno (só a geometria) | média **94 B** (mín. 64, máx. 138) | — |
| Invólucro `<svg …>` | média 164 B | — |
| Formas distintas na página | **4** (para 30 skills) | 4–6 (amazon 4, paladin 4, assassin 5, barbarian 5, druid 6, necromancer 6, warlock 6) |
| Custo total do ícone no documento | ~28,1 KiB, 9,0 % do documento | 9,0–11,1 % |

### 11.4 Custo estimado dos 30 ícones por página, por candidato

Modelo: `delta = (conteúdo por ícone − 94 B) × 30 skills × 3 cópias`.

| Candidato | Conteúdo por ícone | Delta por página | `/pt-br/classes/sorceress` passa a |
|---|---|---|---|
| (D) placeholder atual | 94 B | 0 | 315,0 KiB |
| **(A) conjunto próprio, medido** | **254 B** | +14.400 B (**14,1 KiB**) | **329,1 KiB** |
| (A) conjunto próprio, pior caso | 400 B | +27.540 B (26,9 KiB) | 341,9 KiB |
| **(B) game-icons.net, mediana** | ~1.235 B¹ | +102.690 B (**100,3 KiB**) | **415,3 KiB** |
| (B) game-icons.net, p90 | ~2.812 B¹ | +244.620 B (238,9 KiB) | 553,9 KiB |

¹ arquivo mediano de 1.415 B / p90 de 2.992 B menos ~180 B de invólucro do repositório. É estimativa,
declarada como tal: nenhum arquivo foi baixado.

### 11.5 Teto proposto

> ### **368.640 bytes (360 KiB) por documento HTML de página de classe**
>
> **Unidade:** bytes do arquivo, sem compressão.
> **Alvo:** todos os documentos `.next/server/app/<locale>/classes/<classe>.html` — hoje 16
> (8 classes × 2 locales).
> **Alerta (não falha):** 348.160 bytes (340 KiB).

**Aritmética da justificativa:**

```
322.576  pior documento hoje (/pt-br/classes/sorceress)
+ 27.540  conjunto próprio no pior caso (400 B por ícone × 30 × 3)
= 350.116  (341,9 KiB)
+ 18.524  margem para crescimento editorial (5,3 % — o Sorceress já é o maior por ter
          mais referências cruzadas de build, e ganha mais a cada build nova)
= 368.640  (360,0 KiB)
```

**Como o gate mede** (mesmo método desta medição, sem variação):

1. `npm run build`;
2. `assertFreshBuild()` de `scripts/build-freshness.ts` — o helper que já protege três gates de ler
   um build velho;
3. para cada `<locale>/classes/<classe>.html` sob `buildRoot()`, comparar `statSync(path).size` com
   368.640;
4. falhar nomeando o documento, o valor e a folga.

**O que este teto discrimina, e é bom que discrimine.** Com o fator de duplicação de 3 medido hoje, a
folga de 46.064 bytes acima do pior documento equivale a **512 bytes de conteúdo a mais por ícone**.
Ou seja:

- **(A) cabe com folga** — os desenhos medidos usam 254 B, e mesmo o pior deles (454 B) passa.
- **(B) embutido não cabe** — a mediana do conjunto externo pede ~1.235 B.
- Se um mecanismo futuro eliminar a duplicação (uma cópia por página em vez de três), a folga passa a
  **1.536 bytes por ícone** e (B) passaria na mediana, mas continuaria estourando no p90.

Isso é uma descrição do orçamento, **não uma recomendação de mecanismo**. Sprite,
`<symbol>/<use>`, mover a árvore para fora da ilha client-side e qualquer outra forma de matar a
duplicação continuam **hipóteses** a serem validadas no plano da Fase 4, exatamente como o PRD
determina. O que o spike entrega é o número, a unidade e o método.

---

## 12. Riscos

| Risco | Candidato | Gravidade | Mitigação |
|---|---|---|---|
| Cobertura insuficiente força desenho próprio parcial, produzindo duas mãos visuais — isto é, (C) | B | **alta** | Nenhuma dentro de (B). É estrutural |
| Mistura de 7 autores com densidades de traço de 296 B a 2.857 B | B | **alta** | Restringir a um autor custa 33,7 % dos ícones |
| Ícones cujo assunto é IP de terceiros (`diablo-skull`, `harry-potter-skull`, `death-star`) | B | **alta** num site de fãs de Diablo | Curadoria por ícone; a licença não resolve isso |
| Atribuição errada por ler o autor da lista em prosa em vez da pasta | B | média | Manifesto gera a atribuição do caminho do arquivo |
| Obrigação de declarar modificação em 240 arquivos reescritos para `currentColor` | B | média | Campo `modified` no manifesto |
| Legibilidade a 14 px de silhuetas desenhadas para 512 px | B | média | Só se descobre desenhando; risco real |
| Estouro do teto de HTML | B | **alta** (415,3 KiB na mediana contra teto de 360) | Nenhuma sem mudar o mecanismo de entrega |
| Volume de trabalho: 240 desenhos | A | média | Vocabulário compartilhado; ritmo medido de 8–12 por sessão |
| Classe nova = 30 glifos novos | A | média | Sob (B) a classe nova é 30 lacunas, que é pior |
| Qualidade de desenho inconsistente ao longo de 24–30 sessões | A | média | Grade, espessura e primitivas fixadas antes de começar; é a mesma disciplina de qualquer sistema de ícones |
| Continuar em (D) | D | **alta** | Nenhuma: é o defeito da auditoria §2.6, permanente |

---

## 13. Recomendação

**Recomendo (A): conjunto próprio completo, 240 desenhos, troca completa de uma vez.**

**O que sustenta a recomendação:**

1. **É o único candidato que satisfaz R-TREE-18 como escrito.** 240 de 240, uma mão visual. (B) não
   chega lá: 29,2 % das skills avaliadas não têm ícone, e as que têm exigem 7 autores.
2. **(B) produz (C).** Toda lacuna vira desenho próprio dentro do conjunto licenciado. A opção que a
   preferência declarada do proprietário eliminou é o destino natural de (B), não uma escolha
   separada.
3. **O orçamento de HTML separa os dois com margem grande.** (A) medido: +14,1 KiB por página. (B) na
   mediana: +100,3 KiB, que estoura o teto proposto em 55 KiB.
4. **O tamanho real é 14 px, não 512 px.** `SkillSigil` já é chamado com 14, 16, 18 e 20 px. Um
   conjunto desenhado para ícone de inventário em 512 px não foi feito para esse problema; um
   conjunto próprio é.
5. **A recomendação da revisão independente (B) foi feita sem proveniência concreta**, e ela mesma
   dizia isso: *"a decisão depende de proveniência concreta e não deve ser tomada no papel"*, com o
   gate de mapear as 30 da Sorceress. As 30 da Sorceress passaram (25 de 30 sem constrangimento). Foi
   o resto que reprovou.
6. **Custo zero de licença, atribuição e curadoria** — e nenhuma dependência de decisões de terceiros
   sobre o que hospedam.

**O que enfraquece a recomendação:**

1. **240 desenhos são 240 desenhos.** É a maior peça de trabalho manual do roadmap inteiro, feita por
   uma pessoa, e a estimativa de 8–12 glifos por sessão vem de **uma** sessão de dez glifos, não de
   vinte e cinco.
2. **A Sorceress — a classe da qual o proprietário mais entende — foi a que (B) cobriu melhor
   (83,3 %).** Se a decisão for tomada olhando só a Sorceress, (B) parece boa. É o resto que decide.
3. **Qualidade de desenho ao longo de 24–30 sessões é um risco real.** O conjunto externo tem
   qualidade profissional consistente dentro de cada autor; um conjunto próprio tem a qualidade que
   tiver.
4. **A amostra são 130 de 240 skills (54,2 %).** As outras 110 não foram mapeadas. A amostra foi
   escolhida deliberadamente para incluir o melhor caso e o pior, mas continua sendo amostra.
5. **Um híbrido honesto não foi avaliado:** conjunto próprio para tudo, usando ícones CC BY apenas
   como *referência de desenho* (o que é livre e não gera obrigação porque nada é copiado). Isso não
   é (C) nem (B); é (A) com pesquisa visual, e pode reduzir bastante o esforço de concepção. Não foi
   medido aqui.

---

## 14. Perguntas concretas para Q1

O spike não decide. Estas são as perguntas cujas respostas fecham Q1:

**Q1.a — Cobertura vale mais que consistência, ou o contrário, agora que os dois números existem?**
(B) entrega 47,7 % de cobertura sem constrangimento com 7 mãos visuais. (A) entrega 100 % com uma
mão, ao custo de 240 desenhos. A preferência já declarada ("consistência completa importa mais")
aponta para (A); confirma?

**Q1.b — Olhando o artefato lado a lado, os dez desenhos próprios são bons o bastante?**
Abra `2026-09-08-skill-icon-comparison.html` e, ao lado, os links do candidato (B) na seção 5. A
pergunta não é "são bonitos"; é: **a 36 px, você distingue Blizzard de Ice Blast sem ler o nome?**
Se a resposta for sim para os desenhos deste spike, (A) está provada em miniatura.

**Q1.c — 240 desenhos em ~25 sessões é aceitável para você, sozinho?**
Se não for, a conversa muda: a alternativa não é (B), é adiar a Fase 5 e manter o placeholder
declarado por mais tempo — o que R-TREE-18 já permite explicitamente até o fim da Fase 5.

**Q1.d — O conjunto ter um arquivo chamado `diablo-skull` incomoda?**
Se sim, (B) já está fora por §8.5 e nem é preciso discutir cobertura. Se não, ainda é preciso decidir
quem faz a curadoria dos ~4.239 arquivos para garantir que nenhum ícone adotado reproduza arte
protegida.

**Q1.e — Se (A) for escolhida, o teto de 360 KiB fica como está?**
O teto foi dimensionado para (A) com folga (329,1 KiB no caso medido, 341,9 no pior caso). Aprovar o
número aqui destrava R-TREE-17 e o gate da Fase 4. Se preferir um teto mais apertado — 350 KiB, por
exemplo — a folga por ícone cai de 512 B para 398 B, o que ainda cabe nos desenhos medidos (média de
254 B), mas elimina a margem editorial e reprova o pior deles (454 B).

**Q1.f — Vale medir o híbrido de §13 (própria com referência visual externa) antes de decidir?**
É uma sessão de trabalho a mais e pode encurtar a concepção dos 240. Ou é ruído e a decisão sai
agora.

---

## 15. Fontes consultadas

Todas verificadas em **2026-09-08** pelo navegador headless do projeto.

| Fonte | URL | O que foi extraído |
|---|---|---|
| game-icons.net — About | https://game-icons.net/about.html | Licença CC BY 3.0; forma de atribuição; lista de autores com contagem; declaração de que o traço é inspirado em TF2/Dungeon Keeper 2 |
| game-icons.net — F.A.Q. | https://game-icons.net/faq.html | "CC-BY license (or even Public Domain for some of them)" |
| game-icons/icons — repositório | https://github.com/game-icons/icons | Estrutura de pastas por autor; `license.txt`; scripts shell sem licença declarada |
| game-icons/icons — `license.txt` | https://raw.githubusercontent.com/game-icons/icons/master/license.txt | Texto de licença autoritativo; 35 contribuintes; Viscious Speed e Zeromancer em CC0; frase de atribuição exigida |
| game-icons/icons — árvore | `https://api.github.com/repos/game-icons/icons/git/trees/master?recursive=1` (SHA `82d948812bfe3f269ef8f731dcdb07b08160edc4`) | 4.239 arquivos SVG, autor e tamanho de cada um. Listagem não truncada |
| Creative Commons — CC BY 3.0 | https://creativecommons.org/licenses/by/3.0/ | Share, Adapt, Attribution, irrevogabilidade; URL canônica |
| RPG Awesome | https://github.com/nagoshiashumari/Rpg-Awesome · `README.md` | Fonte OFL 1.1; CSS/SASS MIT; documentação CC BY 3.0; 496 classes de ícone; entrega só como webfont |
| SIL Open Font License 1.1 | https://openfontlicense.org/open-font-license-official-text/ | Cláusulas Reserved Font Name e "sold by itself" |
| Font Awesome Free | https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/LICENSE.txt | Ícones CC BY 4.0, fontes OFL 1.1, código MIT |
| Lucide | https://raw.githubusercontent.com/lucide-icons/lucide/main/LICENSE | ISC |
| Tabler Icons | `https://api.github.com/repos/tabler/tabler-icons` | MIT; 6.100+ ícones |

Referências internas: PRD vNext §1.5 #5, §1.6, §8.5 (R-TREE-17, 18, 19), §12.2, §13 P0.5, §14 Fase
0B e Fase 5, §15 Q1, §17.7 · revisão de 2026-09-08 §11 (Q1) e M6 · auditoria de 2026-09-07 §2.6, §4
e "Medições".

---

## 16. Limitações deste spike

1. **130 de 240 skills mapeadas** (54,2 %). As 110 restantes não foram avaliadas. A amostra inclui as
   duas árvores que R-TREE-19 nomeia e as seis famílias que mais estressam o mapeamento, mas
   continua sendo amostra.
2. **Nenhum arquivo de terceiro foi baixado nem inspecionado visualmente.** A avaliação do candidato
   (B) é por nome, autor, metadados e tamanho. "Plausibilidade" mede a distância entre o nome do
   ícone e a mecânica da skill, não a qualidade do desenho. Um juízo visual definitivo exige abrir
   os links do artefato lado a lado.
3. **O conteúdo por ícone de (B) (~1.235 B na mediana) é estimativa**, derivada do tamanho do arquivo
   menos um invólucro estimado em ~180 B.
4. **O fator de duplicação de 3 é uma propriedade da implementação atual**, não uma lei. Se a árvore
   deixar de ser ilha client-side, ou se o ícone parar de atravessar a fronteira como elemento, o
   fator muda e o orçamento por ícone muda com ele. O teto em bytes por documento continua válido de
   qualquer forma — é isso que o torna um bom gate.
5. **A estimativa de ritmo de desenho (8–12 glifos por sessão) vem de uma única sessão de dez.**
6. **Legibilidade a 14 px não foi testada em telefone real.** O artefato mostra 36 e 44 px. Os
   tamanhos de 14–20 px que o site já usa hoje merecem uma passada na aprovação de Q1.
