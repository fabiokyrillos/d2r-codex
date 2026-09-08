# PRD vNext — D2R Codex

**Escrito:** 2026-09-07
**Baseline:** D2R Patch 3.3 / Ladder Season 15 (ver [`../research/00-game-state.md`](../research/00-game-state.md))
**Origem:** [auditoria de produto, UX e design de 2026-09-07](audits/2026-09-07-product-ux-audit.md), aprovada pelo proprietário com uma alteração de escopo (seção 3).
**Status:** Aprovado para execução por fases. Este documento decide *o que* muda e *por quê*; os planos de implementação por fase são documentos separados.

> Convenções. Cada requisito tem um identificador estável (`R-<área>-<n>`) e pelo menos um critério de aceite verificável. "Deve" é obrigatório; "pode" é opcional. Referências a arquivos e linhas apontam para o estado do repositório em `7e69fca`. Onde a auditoria mediu algo, o número aparece como baseline; onde não mediu, a meta é marcada como estimativa.

---

## 1. Visão do produto

### 1.1 Problema

Os guias de Diablo II: Resurrected disponíveis abrem na lista de equipamento best-in-slot que o jogador não tem, tratam a árvore de skills como prosa, e são escritos para leitura fora do jogo. O jogador que está no meio de uma sessão, com um personagem de nível 47 e um inventário concreto, precisa de uma resposta para "o que eu faço agora?" em poucos toques, em qualquer tela, no idioma dele.

### 1.2 Público principal

O proprietário do site, jogando D2R em desktop e consultando no celular durante a sessão, em português ou inglês. O site é público, mas é um produto pessoal e opinionado: não há múltiplos proprietários, não há comunidade a atender, e a qualidade da consulta vale mais que qualquer métrica de crescimento.

### 1.3 Proposta de valor

Toda build documentada em seis tiers de equipamento com "o que consertar em seguida", uma árvore de skills que lê como a do jogo, guias de evolução por etapa e uma base de referência verificada e interligada, tudo em en-US e pt-BR, em páginas estáticas que abrem em menos de um segundo.

### 1.4 Diferencial em relação aos outros sites de D2R

Observado na pesquisa de referências da auditoria (Maxroll, Icy Veins, d2runewizard, diablo2.io, D2 Planner):

- Ninguém organiza equipamento por "onde você está" com seis tiers e próximo passo; Maxroll usa quatro variantes, Icy Veins uma lista única.
- Ninguém trata solo self-found e Hardcore como seções estruturadas por build.
- Ninguém oferece pt-BR; não existe site pt-BR estruturado e atual.
- Ninguém tem uma árvore de skills responsiva com posições reais, teclado e leitor de tela; o D2 Planner usa screenshots do jogo como fundo.
- O Codex documenta a confiança de cada afirmação e as discordâncias entre fontes.

### 1.5 Princípios do produto

1. **Consulta rápida durante o jogo.** A informação que importa agora fica a no máximo dois toques da entrada da página.
2. **Conteúdo confiável.** Nenhuma afirmação sobre o estado do próprio site é escrita à mão; contagens e cobertura derivam dos dados. Confiança abaixo de "verificado" é rotulada.
3. **Progressão compreensível.** Tudo é apresentado a partir do estágio do jogador, não do teto.
4. **Fidelidade estrutural ao D2R.** Posições, dependências e níveis das skills são os do jogo, extraídos dos dados do jogo.
5. **Identidade própria.** Tipografia, cor, moldura e ícones são do D2R Codex. Nenhum asset protegido da Blizzard.
6. **Excelente experiência bilíngue.** en-US e pt-BR com paridade funcional e estrutural; nomes de jogo em inglês por decisão (ADR 0003).
7. **Mobile como experiência completa.** Nada é "versão reduzida"; a árvore de skills continua sendo árvore em 320 px.
8. **Funcionamento sem conta.** Preferências pessoais vivem no navegador (`localStorage`); não há autenticação, backend nem sincronização.
9. **Progressive enhancement.** Todo conteúdo existe no HTML estático e funciona sem JavaScript; JavaScript adiciona estado, preferência e conveniência.
10. **Qualidade antes de cobertura.** Uma build nova entra com os onze blocos e os seis tiers ou não entra.

### 1.6 Limites explícitos

- Sem recursos sociais, compartilhamento, contas, perfis, colaboração, comentários, avaliações públicas ou sincronização em nuvem (seção 3.2).
- Sem planner completo de skills/itens; sem trackers em tempo real (Terror Zone, Diablo Clone); sem drop calculator. Onde fizer sentido, o site linka para ferramentas externas.
- Sem assets do jogo (ícones, molduras, fundos, fontes) em nenhuma circunstância.
- Sem backend novo. O site continua estático.
- Sem modo claro.

---

## 2. Estado atual

Contagens confirmadas no repositório em `7e69fca` e em produção em 2026-09-07.

### 2.1 Já entregue

| Capacidade | Estado |
|---|---|
| Classes | 8 páginas (Sorceress, Amazon, Assassin, Barbarian, Druid, Necromancer, Paladin, Warlock) com introdução, "melhor para", mecânicas centrais, atributos, três árvores, itens de classe e breakpoints |
| Builds | 53, todas com os 11 blocos e os 6 tiers em ordem canônica, `immunityPlan`, `hardcoreNotes`, `selfFoundNotes`, mercenário e farm; confiança: 46 verificadas, 4 fonte única (Warlock), 3 consenso da comunidade |
| Skills | 240 (30 por classe), uma página por skill com resumo, "como funciona", pré-requisitos, desbloqueios, sinergias nos dois sentidos, dano por nível (1 e 20) e "builds que usam" |
| Árvore de skills | Grade 3×6 com posições do jogo (`content/classes/skill-graph.ts`), conectores em SVG, painel lateral (≥1024 px) ou bottom sheet, `role=grid` com roving tabindex, `<noscript>` em lista |
| Evolução | 8 jornadas (6 a 8 etapas cada) com objetivo, skill points, stat points, ações, equipamento a caçar, "pronto quando" e plano de respec |
| Referência | 53 runewords agrupadas por tier de relevância, 33 runas com receita de upgrade, 65 itens únicos, 20 áreas de farm, 9 mecânicas, 4 mercenários, 16 tabelas de breakpoint, página de fontes com hierarquia e discordâncias |
| Busca | Ctrl/Cmd+K ou `/`, índice estático de 520 entradas por idioma, categorias, apelidos (shako, hoto, soj, javazon), remoção de acentos, navegação por teclado |
| Filtros | 5 grupos / 28 opções, OR dentro do grupo e AND entre grupos, URL sincronizada com histórico, barra "Filtrando por", estado vazio, bottom sheet mobile com "Mostrar N builds" ao vivo |
| Idiomas | en-US e pt-BR com 1.002 URLs espelhadas, hreflang e x-default, troca preservando rota e query, dicionários de 902 chaves sem faltas, 53/53 overlays de build |
| Técnica | Next 16 App Router totalmente estático, 6 client components vigiados por teste de fronteira, 40 scripts de teste (conteúdo, grafo, a11y, contraste, viewport em Chrome real), sem imagens, três fontes via `next/font` |

### 2.2 Defeito atual (comprovado)

| # | Defeito | Onde |
|---|---|---|
| D1 | Nota "Cobertura" em `/classes` afirma que Assassin não tem builds, Barbarian só visão geral, Warlock só atributos; a página lista 7, 6 e 4 builds | dicionários `en-us.ts` / `pt-br.ts` |
| D2 | `/builds` renderiza o título "Classes aguardando guias de build" sobre uma lista vazia em todas as visitas | `app/[lang]/builds/page.tsx:121-137` (falta o guarda `.length > 0` de `leveling/page.tsx:146`) |
| D3 | Callout "Por que tão poucas builds?" incondicional, com texto de quando havia 2 builds | `app/[lang]/builds/page.tsx:117`, `builds.whyFewBody` |
| D4 | Mercenário › Gear na build renderiza `slug.replace(/-/g," ")` sem link e descarta `why` | `app/[lang]/builds/[classSlug]/[slug]/page.tsx:492`; `/mercenaries` faz certo em `page.tsx:186` |
| D5 | Contagens de faceta são globais e nunca se estreitam; combinações vazias são clicáveis | `components/builds/filterable-build-list.tsx:130-140` |
| D6 | Nenhum link para páginas de skill fora do painel da árvore (0 links `/skills/` na build); a tabela "Maximize nestas" não linka | página de build |
| D7 | Árvore vira lista de uma coluna e esconde os conectores abaixo de 640 px | `skill-tree-interactive.tsx` (`hidden sm:block`) |
| D8 | Setas do teclado na árvore saltam de coluna e fileira (Ice Blast → direita cai em Shiver Armor) | `lib/skill-tree-nav.ts` |
| D9 | Barra de etapas do leveling transborda no desktop sem indicador | `leveling/[classSlug]/page.tsx` |
| D10 | String `hideFilters` declarada e nunca renderizada; contagens desatualizadas em comentários e README ("29 builds", "1004/1009 páginas", "dois client components", "menu `<details>`") | `lib/builds/filter.ts:87-98`, `README.md:315-318`, `layout.tsx:81`, `not-found.tsx:36`, `mobile-navigation.tsx:25` |
| D11 | Cinco SVGs do starter do Next em `public/` sem referência; `resolveRef` fabrica links para `/items/sets|bases|charms/…` sem rota | `public/`, `lib/registry/resolve.ts:106-132` |
| D12 | Rótulos residuais em inglês no pt-BR fora da política de nomes próprios (`home.headlineHighlight`, `mercenaries.tierEndgame`, `farming.target*`, `skills.effectChance`, `skills.effectMana`, `builds.filters.resultsOne/Many`, slots "Amulet/Belt/Charms") | dicionário pt-BR |
| D13 | 404 sem header, sem busca e com os dois idiomas empilhados | `app/not-found.tsx` (decisão documentada; revisitar) |

### 2.3 Melhoria aprovada

Página de build com "Meu tier"; filtros redesenhados; árvore de skills na Direção B; descoberta e orientação (tiers clicáveis na home, sumário na página de classe, referência fora do "Menu ▾"); progresso persistido no leveling; filtros em runewords e itens; calculadora de breakpoint; dano por nível na página de skill; modo de consulta compacto. Detalhadas nas seções 6 a 9 e 13.

### 2.4 Possibilidade futura

Comparação de duas builds lado a lado (local, sem conta); favoritos locais; página "o que mudou no patch"; instalação como app (manifest) para a consulta no celular; aprofundamento editorial das builds mais rasas; filtro de farm por build e imunidade.

### 2.5 Explicitamente fora de escopo

Ver seção 3.2. Em particular: og:image e previews sociais, compartilhamento de builds, contas, perfis, colaboração, comentários, sincronização, backend, réplica de assets do jogo, planner completo, trackers em tempo real, modo claro.

---

## 3. Objetivos e não objetivos

### 3.1 Objetivos (mensuráveis; baselines na seção 12)

- **O1.** Chegar ao tier relevante de qualquer build em no máximo 2 ações a partir da entrada da página, com rolagem ≤ 1 tela no celular.
- **O2.** Ver o primeiro cartão de build em `/builds` a ≤ 300 px do topo no celular e ≤ 220 px no desktop, sem que nenhuma combinação de filtros com zero resultados seja clicável.
- **O3.** Manter a árvore de skills como grade 3×6 com conectores em todas as larguras a partir de 320 px, com ícone reconhecível por skill e contador de pontos.
- **O4.** Zero afirmações estáticas sobre cobertura do próprio site; zero referências cruzadas sem link.
- **O5.** Paridade pt-BR: 100% das chaves de dicionário e overlays, e zero slugs ou rótulos em inglês fora da política de nomes próprios.
- **O6.** Toda página sem overflow horizontal em 320 px e todo controle novo com alvo ≥ 24×24 px (gate existente) e navegável por teclado.
- **O7.** Cada fase termina com pelo menos um gate automatizado novo que teria detectado a regressão que ela corrige.

### 3.2 Não objetivos

- Compartilhamento de qualquer tipo: og:image, previews para WhatsApp, Discord ou redes sociais, links "compartilhar", exportação para redes.
- Recursos sociais: comentários, curtidas, avaliações públicas, perfis, feed.
- Contas de usuário, autenticação, colaboração, múltiplos proprietários.
- Sincronização em nuvem de preferências ou entre dispositivos.
- Cópia literal não licenciada da interface ou dos assets do D2R (ícones, molduras, fundos, fontes, sons).
- Expansão de backend sem necessidade comprovada. Metadados básicos de SEO (título, descrição, canonical, hreflang, sitemap) continuam existindo por serem parte de uma página bem formada, não como investimento em aquisição.
- Métricas de crescimento, analytics de terceiros, funil.

---

## 4. Modos de uso

Personas tratadas como modos de uso de uma mesma pessoa, não como segmentos de mercado.

| Modo | Contexto | O que precisa | Como o produto atende hoje | Lacuna |
|---|---|---|---|---|
| Iniciante | Primeiro personagem da temporada | Escolher classe, seguir evolução, saber o que vestir agora | Home em perguntas do jogador, "melhor para", leveling por etapa | Tiers da home não clicáveis; build de 32 mil px no celular |
| Retornante | Volta após um patch | Saber o que mudou e se o guia está atual | Data de verificação, alerta das oito classes, patch no rodapé | Sem página "o que mudou"; notas de cobertura contradizem o site |
| Experiente | Otimizando um personagem de nível 85+ | Tabelas, breakpoints, alternativas por slot, filtros de referência | Tiers Otimizado/BiS, breakpoints com prioridade, "builds que usam" | Sem filtro em runewords/itens; sem calculadora de breakpoint; sem comparação |
| Consulta durante o jogo | Segunda tela ou celular, jogo aberto | Dois toques até a resposta; leitura em coluna estreita | Busca global, página de skill compacta, sheet de skills | Build sem "meu tier"; árvore vira lista; sem modo compacto |
| Preparação fora do jogo | Planejando respec ou próximo upgrade | Ler a build inteira, comparar tiers, ler mecânicas | Onze blocos, "o que consertar em seguida", mecânicas | Sem comparação entre tiers adjacentes; sem progresso no leveling |
| Desktop | 1280 px+ | Densidade, painel lateral, teclado | Painel sticky da árvore, atalhos de busca | Setas da árvore imprecisas; página de classe sem sumário |
| Celular | 320 a 430 px | Sem overflow, alvos ≥ 24 px, sheets | Header de 57 px, sheets com foco preso, sem overflow | Árvore em lista; 490 px de filtros antes da primeira build |
| Português | pt-BR | Tudo traduzido, nomes de jogo em inglês | 53/53 overlays, dicionário completo | Rótulos residuais (D12) |
| Inglês | en-US | Idem | Idem | — |

---

## 5. Jornadas prioritárias

Cada jornada: ponto de entrada, objetivo, etapas desejadas, atritos atuais (com evidência), resultado desejado, critério de sucesso.

### J1. Encontrar uma build

- **Entrada:** home, `/builds`, busca, página de classe.
- **Objetivo:** localizar a build certa para a classe e o estágio.
- **Etapas desejadas:** escolher classe (chip) → ver cartões → abrir.
- **Atritos:** 28 caixas antes do primeiro cartão (490 px em 320, 770 px em 768); sem ordenação; ordem inexplicada; duas buscas sem relação.
- **Resultado:** cartões visíveis na primeira dobra com classe escolhida em um toque.
- **Sucesso:** primeiro cartão ≤ 300 px (celular) / ≤ 220 px (desktop); ordenação disponível; busca local removida ou integrada.

### J2. Escolher entre builds

- **Entrada:** listagem filtrada por classe.
- **Objetivo:** decidir entre 3 e 11 builds da classe.
- **Etapas:** ler frase-resumo, chips (elemento, orçamento, dificuldade), duas notas mais relevantes; abrir a build; se necessário, comparar.
- **Atritos:** quatro pares de notas iguais em todos os cartões (20 pontos por linha); sem comparação.
- **Resultado:** cartão legível em 3 s; comparação de duas builds como possibilidade futura (P3).
- **Sucesso:** cartão com ≤ 2 notas por padrão (as mais altas ou as do foco escolhido) e uma linha "no seu estágio" quando a preferência existir.

### J3. Identificar o tier de equipamento adequado

- **Entrada:** home (cartões de tier), página de build.
- **Objetivo:** saber em qual dos seis tiers o personagem está.
- **Etapas:** ler as seis perguntas ("Cheguei no Hell e estou morrendo") → escolher → a escolha fica salva.
- **Atritos:** cartões da home não clicáveis; na build, nada indica que existem tiers até o px 6.066.
- **Resultado:** a escolha é feita uma vez (home, listagem ou build) e reaplicada em todo lugar.
- **Sucesso:** preferência `d2rc.tier` gravada em 1 ação; visível no topo da build.

### J4. Alternar entre tiers

- **Entrada:** página de build.
- **Objetivo:** ir de Econômico para Otimizado e voltar sem perder o lugar.
- **Etapas:** controle segmentado sticky → o tier ativo expande, os demais ficam compactos.
- **Atritos:** tiers empilhados (Gear de 6.066 a 16.357 px); âncoras sem estado; 32 mil px no celular.
- **Resultado:** troca de tier sem rolagem além de uma tela.
- **Sucesso:** rolagem entre dois tiers adjacentes ≤ 1 tela; controle sticky visível dentro da seção Gear em todas as larguras.

### J5. Entender upgrades e substituições

- **Entrada:** tier ativo.
- **Objetivo:** saber o que muda em relação ao tier anterior e o que consertar em seguida.
- **Etapas:** ler slots com marcação "novo / mantido / alternativa" → ler "o que consertar em seguida".
- **Atritos:** a informação existe nas 53 builds, mas só em prosa e sem diferença marcada entre tiers.
- **Resultado:** diferença entre tiers adjacentes derivada dos dados, sem custo editorial.
- **Sucesso:** cada slot do tier ativo carrega um marcador derivado por comparação com o tier anterior; "o que consertar em seguida" permanece ao fim do tier.

### J6. Consultar skills e pré-requisitos

- **Entrada:** busca, árvore, tabela "Maximize nestas".
- **Objetivo:** ver o que a skill faz, o que exige e quanto investir.
- **Etapas:** buscar ou tocar no nó → painel/sheet → "ver página completa".
- **Atritos:** tabela de skills sem link (D6); dano só em nível 1 e 20; sem anterior/próximo.
- **Resultado:** toda menção a skill é link; página de skill mostra dano por nível 1–30.
- **Sucesso:** 0 nomes de skill sem link em páginas de build e leveling; tabela de dano com ≥ 7 pontos (1/5/10/15/20/25/30).

### J7. Navegar pela árvore de skills

- **Entrada:** página de classe, build, leveling.
- **Objetivo:** ler a árvore como no jogo: posição, seta, ícone, pontos.
- **Etapas:** escolher tree (aba no celular) → varrer a grade → tocar/hover → painel.
- **Atritos:** lista em <640 px (D7); glifo por tipo, não por skill; setas imprecisas (D8); sem contador por tree.
- **Resultado:** grade 3×6 com conectores em 320 px, ícone por skill, contador de pontos, estados.
- **Sucesso:** critérios da seção 8.

### J8. Seguir leveling

- **Entrada:** home ("Começar um personagem"), classe, build ("Passo a passo completo").
- **Objetivo:** seguir etapa a etapa ao longo de dias.
- **Etapas:** abrir guia → marcar etapa atual → voltar amanhã e cair na etapa.
- **Atritos:** sem memória de etapa; barra de etapas corta no desktop (D9); CTA da home vai direto à Sorceress.
- **Resultado:** etapa atual persistida; CTA leva à escolha de classe.
- **Sucesso:** ao reabrir, a etapa marcada está em foco; barra com indicador de rolagem.

### J9. Encontrar mercenário e equipamentos

- **Entrada:** seção Mercenário da build; `/mercenaries`.
- **Objetivo:** saber qual contratar, quando, e o que vestir por tier.
- **Atritos:** slugs crus sem link (D4); `why` descartado.
- **Resultado:** itens do mercenário com nome, link, qualidade e porquê, como em `/mercenaries`.
- **Sucesso:** 53/53 builds com referências resolvidas (teste de dados).

### J10. Filtrar e ordenar builds

- **Entrada:** `/builds`, página de classe.
- **Objetivo:** reduzir 53 a poucas builds por critérios que importam.
- **Atritos:** contagens estáticas (D5); sem ordenação; densidade.
- **Resultado:** seção 7.
- **Sucesso:** zero combinações vazias clicáveis; ordenação com ≥ 4 critérios; URL restaurável.

### J11. Trocar idioma

- **Entrada:** header.
- **Objetivo:** ler a mesma página no outro idioma.
- **Estado:** fluida (preserva rota e query, cookie, hreflang).
- **Atritos:** rótulos residuais (D12).
- **Sucesso:** zero rótulos de slot ou de UI em inglês fora da política; teste de dicionário com lista de exceções explícita.

### J12. Buscar informação durante uma sessão de jogo

- **Entrada:** Ctrl/Cmd+K, `/`, lupa no celular.
- **Objetivo:** resposta em dois toques.
- **Estado:** boa (520 entradas, categorias, teclado).
- **Atritos:** sem tolerância a erro de digitação; busca local de builds concorrente; 404 sem busca.
- **Resultado:** uma busca só; erro de um caractere tolerado para nomes ≥ 5 letras.
- **Sucesso:** "blizard" encontra Blizzard; campo local removido ou delegando ao índice global.

---

## 6. Requisitos da página de build

### 6.1 Resultado desejado

Ao abrir qualquer build, o jogador vê em uma tela: o que a build é, em qual tier ele está (ou a pergunta para escolher), e um caminho de um toque até o equipamento desse tier. Os seis tiers continuam existindo no HTML, na ordem canônica, para leitura completa, impressão e no-JS.

### 6.2 Alternativas comparadas

| Opção | Como funciona | Prós | Contras | Veredito |
|---|---|---|---|---|
| Tabs | Um tier visível por vez | Menor rolagem | Esconde os outros cinco; "o que consertar em seguida" perde o vizinho; sem JS precisa de fallback; leitura completa exige seis cliques | Rejeitada como modelo único |
| Seletor segmentado | Controle de seis posições que rola/ativa | Compacto, cabe sticky, funciona como âncora sem JS | Sozinho não reduz rolagem | Adotado como controle |
| Accordion | Todos os tiers presentes, só o ativo expandido | Reduz rolagem mantendo tudo no DOM; no-JS pode renderizar tudo aberto | Seis cabeçalhos iguais confundem se não houver resumo | Adotado como comportamento, com resumo por tier fechado |
| Tier ativo com comparação adjacente | Tier ativo expandido com marcação de diferença vs. anterior | Entrega "upgrades" sem custo editorial | Precisa de regra de comparação clara | Adotado |
| Navegação sticky | Barra que acompanha a rolagem | Já existe dentro da seção Gear | Só aparece a partir de 6.066 px | Adotada, elevada ao cabeçalho da página |
| Combinação responsiva | Segmentado sticky + accordion com resumos + comparação adjacente; no celular o segmentado vira chips roláveis | Cobre desktop e celular com um só modelo | Mais estados a testar | **Recomendação** |

**Rejeitadas:** tabs puras (escondem contexto e quebram no-JS); mostrar só o tier salvo (o jogador perde o "próximo tier" e a leitura completa); auto-scroll ao carregar (desorienta e conflita com âncoras).

### 6.3 Requisitos

- **R-BUILD-1 · Seletor "Meu tier".** A página deve exibir, acima da dobra (na região de "Resumo"), um controle segmentado com os seis tiers, cada um com número, nome e faixa de nível. Selecionar um tier grava a preferência (`R-PREF-1`), ativa o tier na seção Gear e rola até ele. *Aceite:* em 320, 390, 768 e 1280 px o controle é visível sem rolar; um toque grava e rola; teste de viewport mede a posição.
- **R-BUILD-2 · Entrada direta.** Ao carregar com preferência gravada e sem hash na URL, o tier salvo é o ativo na seção Gear (expandido) e o cabeçalho mostra "Meu tier: Econômico · Ir para o equipamento". Não há rolagem automática. Com hash `#gear-<tier>`, o hash vence e o tier do hash fica ativo. *Aceite:* testes de HTML construído para os três casos (sem preferência, com preferência, com hash).
- **R-BUILD-3 · Estado padrão.** Sem preferência, todos os seis tiers renderizam expandidos como hoje, e o seletor mostra a pergunta "Onde você está?" no lugar do valor. A primeira seleção passa a valer para o site inteiro. *Aceite:* snapshot do HTML sem preferência é idêntico ao atual exceto pelo controle novo.
- **R-BUILD-4 · Navegação entre tiers.** Dentro da seção Gear, o seletor é sticky abaixo do header em todas as larguras e reflete o tier em foco durante a rolagem (`IntersectionObserver`). Trocar de tier ativa o novo e compacta o anterior. *Aceite:* rolagem entre tiers adjacentes ≤ 1 tela em 390 px; estado ativo segue a rolagem.
- **R-BUILD-5 · Tiers compactos.** Um tier não ativo renderiza como cabeçalho (número, nome, faixa de nível, objetivo em uma frase) mais uma lista de uma linha por slot (slot: escolha principal), com "Expandir". Altura alvo ≤ 320 px em 390 px. *Aceite:* medição por teste de viewport; conteúdo completo continua no DOM (`hidden`/`<details>`), acessível e indexável.
- **R-BUILD-6 · Comparação adjacente.** No tier ativo, cada slot recebe um marcador derivado por comparação com o tier anterior: **novo** (escolha principal diferente), **mantido** (mesma referência), **alternativa** (a principal anterior aparece como alternativa aqui), **removido** (slot presente antes e ausente agora, listado ao fim). A comparação usa `ref.slug` e, na ausência de `ref`, `label`. O tier Início não tem marcador. *Aceite:* função pura com testes unitários sobre as 53 builds; nenhum marcador em texto livre.
- **R-BUILD-7 · Upgrades.** "O que consertar em seguida" permanece ao fim do tier ativo e é repetido em forma curta no cabeçalho do tier compacto seguinte ("Próximo: Oculus, HotO, Nightwing"). *Aceite:* presente nos seis tiers; texto vem de `nextUpgrade`.
- **R-BUILD-8 · Sumário da página.** Um sumário com as onze seções (e o tier ativo) fica disponível no topo em desktop (coluna lateral ou linha de âncoras) e como botão "Seções" no celular. *Aceite:* cada seção alcançável em um toque; âncoras existentes preservadas.
- **R-BUILD-9 · Mobile.** Em <640 px o seletor vira chips roláveis com fade e o tier ativo centralizado; o sumário vira sheet reutilizando `mobile-filter-sheet`/`focus-trap`/`scroll-lock`. *Aceite:* sem overflow; alvos ≥ 24 px (gate existente); Esc e fundo fecham a sheet.
- **R-BUILD-10 · URLs e HTML estático.** As âncoras `#gear-<tier>` continuam válidas; nenhum parâmetro de query é introduzido para tier; a página continua totalmente estática (`dynamicParams = false`); o estado ativo é aplicado no cliente sem layout shift perceptível (os tiers compactos são o estado inicial quando há preferência, aplicado antes da pintura via script inline mínimo ou classe no `<html>`). *Aceite:* CLS medido em teste headless < 0,1 ao carregar com preferência.
- **R-BUILD-11 · Acessibilidade.** O seletor é `role=tablist`-like ou grupo de botões com `aria-pressed`, navegável por setas; tiers compactos usam `<details>`/`<summary>` ou botão com `aria-expanded`; o marcador de comparação tem texto (não só cor); foco visível 2 px como o resto do site. *Aceite:* teste de a11y construído verifica papéis, nomes e ordem de foco.
- **R-BUILD-12 · Sem JavaScript.** Sem JS, os seis tiers renderizam expandidos, o seletor funciona como âncoras e nada fica inacessível. *Aceite:* teste de HTML construído com scripts removidos.
- **R-BUILD-13 · Links de skill.** Todo nome de skill em "Maximize nestas", "Um ponto cada" e "Pontos restantes" é link para a página da skill; os nós da árvore têm link direto no painel (já existe) e no `<noscript>`. *Aceite:* 0 nomes de skill sem link nas 53 builds (teste de HTML construído).
- **R-BUILD-14 · Mercenário.** A seção usa `<ItemRefLink>` com nome, qualidade e link, e exibe `why`, como `/mercenaries`. *Aceite:* teste de HTML construído procura por slugs com hífen removido; teste de dados garante que toda referência de mercenário resolve.
- **R-BUILD-15 · Modo de consulta compacto (P2).** Um interruptor "Compacto" (persistido, `R-PREF-3`) oculta a prosa ("Como se joga", parágrafos de "Como chegar lá"), mantém tabelas (skills, atributos, breakpoints, tier ativo, farm) e reduz espaçamentos; a mesma folha serve como `@media print`. *Aceite:* altura da build em 390 px com modo compacto e tier ativo ≤ 1/3 da atual; impressão sem header, filtros ou sheets.

### 6.4 Preferências locais (transversal)

- **R-PREF-1 · Chave única de estágio.** Uma única preferência `d2rc.tier` (valores: os seis slugs canônicos de `PROGRESSION_TIERS`) é a fonte de verdade para "Meu tier" na build, "Onde você está" na listagem e nos cartões da home. Gravada em `localStorage`, lida por um único módulo cliente (`lib/prefs.ts`), com leitura protegida por `try/catch` e sem efeito quando indisponível. *Aceite:* teste unitário do módulo; teste de fronteira cliente/servidor continua verde.
- **R-PREF-2 · Sem conta, sem rede.** Nenhuma preferência sai do navegador. *Aceite:* nenhuma chamada de rede originada por preferência (teste de rede em headless).
- **R-PREF-3 · Outras preferências.** `d2rc.compact` (booleano), `d2rc.leveling.<classe>` (etapa atual), `d2rc.reduceMotion` não existe (usa `prefers-reduced-motion`). Cada uma tem "limpar" na própria interface onde é gravada. *Aceite:* lista de chaves documentada no módulo; teste que falha se uma chave nova não estiver na lista.

---

## 7. Requisitos dos filtros

### 7.1 Modelo de informação

Fonte de verdade única por dimensão:

| Dimensão | Tipo | Onde vive | Afeta contagem de resultados? |
|---|---|---|---|
| Classe, tipo de dano, dificuldade, orçamento, "boa para" | Filtro | URL (`?class=…`), como hoje | Sim |
| Busca por nome/apelido | Filtro | Delegada ao índice global (`R-FILT-8`) | Sim, se mantida inline |
| Ordenação | Visão | URL (`?sort=…`) | Não |
| "Onde você está" (tier) | Preferência (`d2rc.tier`) | `localStorage`; nunca na URL | **Não** |

Decisão: a preferência de tier **não filtra** (todas as 53 builds têm os seis tiers), então não altera a contagem nem a URL. Ela (a) ativa a ordenação "Para o meu estágio", (b) mostra em cada cartão uma linha com os três itens principais do tier salvo, e (c) faz a build abrir no tier salvo (`R-BUILD-2`). O facet "Orçamento" continua sendo o custo de endgame, explícito e filtrável. Assim não há duas fontes de verdade: filtros na URL, preferência no navegador, ordenação na URL com um valor que depende da preferência.

### 7.2 Requisitos

- **R-FILT-1 · Classe como controle primário.** Oito chips com glifo de classe e contagem discreta, uma linha em desktop e rolagem horizontal com fade no celular; seleção múltipla; sempre visível (não vai para a sheet). *Aceite:* primeira linha de chips ≤ 120 px abaixo do título em todas as larguras.
- **R-FILT-2 · "Onde você está".** Segmento de seis posições (mesmo componente do `R-BUILD-1`) na segunda linha; grava `d2rc.tier`; quando definido, cada cartão mostra "No seu estágio: Spirit · Oculus · Vipermagi" (três primeiras escolhas principais do tier) e a ordenação padrão passa a "Para o meu estágio". *Aceite:* linha do cartão derivada de `gearSets[tier].slots[].picks[0]`; sem efeito na contagem; no-JS não renderiza o controle (é preferência).
- **R-FILT-3 · Filtros avançados sob demanda.** Tipo de dano, dificuldade, orçamento e "boa para" ficam atrás de "Mais filtros (N)" (popover no desktop, a sheet atual no celular), com grupos colapsáveis e o primeiro aberto. *Aceite:* zero checkboxes visíveis por padrão fora da sheet/popover; badge com contagem de ativos (já existe).
- **R-FILT-4 · Contagens condicionais.** As contagens de cada opção refletem os outros filtros ativos (AND entre grupos, OR dentro do grupo, a própria opção excluída do cálculo do seu grupo). Opções com zero resultado ficam desabilitadas e mostram 0. Sem JS, mostram as contagens globais atuais. *Aceite:* função pura `facetCounts(rows, state)` com testes; nenhuma combinação clicável leva a zero.
- **R-FILT-5 · Ordenação.** Opções: Recomendado (ordem editorial atual), Para o meu estágio (só com preferência; critério documentado em `lib/builds/sort.ts`: para Início/Nightmare/Início do Hell prioriza `difficulty` beginner e `budget` baixo; para Econômico prioriza `soloSelfFound`; para Otimizado/BiS prioriza `clearSpeed`), Mais fáceis, Mais baratas, Nome A–Z. Persistida na URL como `?sort=`. *Aceite:* testes da função de ordenação; a ordem "Recomendado" é explicada em um `?` ("ordem editorial: builds de referência primeiro").
- **R-FILT-6 · Chips aplicados inline.** Os filtros ativos aparecem como chips com ✕ na própria linha de controles (não em barra separada), mais "Limpar tudo" quando ≥ 2 ativos. *Aceite:* linha única; remoção individual mantém o histórico como hoje.
- **R-FILT-7 · Estado vazio.** Mantém o texto atual, adiciona "Remover último filtro" (desfaz a última decisão) e lista até três builds próximas (mesma classe, ignorando o grupo que zerou). Remove o callout "Por que tão poucas builds?" e o título "Classes aguardando" (D2, D3). *Aceite:* snapshot do estado vazio; nenhum título sem conteúdo.
- **R-FILT-8 · Uma busca.** O campo "Nome, classe ou apelido" sai do bloco; a lupa/Ctrl K é a busca. Se for mantido um campo inline, ele deve consultar o mesmo índice e os mesmos apelidos da busca global. *Aceite:* um único índice de busca; teste que falha se houver dois caminhos de busca com resultados diferentes para "hdin".
- **R-FILT-9 · URL e histórico.** Semântica atual mantida (toggle = `pushState`, digitação = `replaceState` com debounce; parâmetros em inglês nos dois idiomas; parâmetros desconhecidos ignorados). *Aceite:* testes existentes de `filter.ts` continuam verdes; `sort` entra no `parseFilterState`.
- **R-FILT-10 · Persistência.** Nenhum filtro é persistido além da URL. A única persistência é a preferência de tier. *Aceite:* nenhuma chave nova em `localStorage` além das listadas em `R-PREF-3`.
- **R-FILT-11 · Desktop.** Duas linhas de controle (classe; estágio + mais filtros + ordenar + contador); grade começa ≤ 220 px abaixo do título. *Aceite:* medição no teste de viewport em 1280 px.
- **R-FILT-12 · Bottom sheet mobile.** Preservada como está (rascunho, "Mostrar N builds" ao vivo, foco preso, scroll travado, Esc/fundo cancelam), passando a conter só os filtros avançados. *Aceite:* testes existentes de `mobile-filter-sheet` continuam verdes; contagens condicionais também dentro da sheet.
- **R-FILT-13 · Acessibilidade.** Chips são botões com `aria-pressed`; popover é `role=dialog` não modal com foco gerenciado e Esc; ordenação é `<select>` nativo; contador é `aria-live=polite` (já existe). *Aceite:* teste de a11y construído.
- **R-FILT-14 · Sem JavaScript.** Os chips de classe são links para `?class=` (como hoje os checkboxes funcionam via cliente, este é um ganho); a listagem completa renderiza no servidor (já é assim); filtros avançados aparecem como formulário GET dentro de `<details>`. *Aceite:* teste de HTML sem scripts consegue filtrar por classe via link.
- **R-FILT-15 · Página de classe.** Mesmo componente, sem chips de classe; "Onde você está" presente; filtros avançados só sob demanda. *Aceite:* primeiro cartão ≤ 260 px abaixo de "Comece por aqui".
- **R-FILT-16 · Cartão.** Duas notas por padrão (as duas mais altas, ou as escolhidas em "boa para"), chips de tag como texto discreto em uma linha, linha "No seu estágio" quando houver preferência. Padrão visual alinhado ao cartão de runeword (nome em Cinzel, metadados em texto, uma única borda). *Aceite:* altura do cartão em 390 px ≤ 80% da atual.

---

## 8. Requisitos da árvore de skills

Direção aprovada: **estrutura fiel ao D2R, com identidade própria do D2R Codex.** A interface original permanece como referência de organização e reconhecimento; nada dela é copiado como asset.

### 8.1 O que já existe e é preservado

Posições (fileira/coluna) e pré-requisitos gerados dos dados do jogo (`content/classes/skill-graph.ts`, 240 nós, teste de deriva); grade 3×6 com células vazias preservadas; conectores em SVG com o caminho selecionado em ember; painel lateral a partir de 1024 px e bottom sheet abaixo; `role=grid` com roving tabindex e funções de navegação testadas; `<noscript>` em lista; um único componente servindo classe e build. Tudo isso é requisito de não regressão.

### 8.2 Requisitos estruturais

- **R-TREE-1 · Três árvores por classe, grade 3×6.** Cada tree renderiza exatamente 3 colunas × 6 fileiras (níveis 1/6/12/18/24/30) em **todas** as larguras a partir de 320 px. A colapsagem para uma coluna é removida. *Aceite:* teste de viewport em 320, 390, 640, 768, 1024, 1280 px afirma `gridTemplateColumns` com 3 faixas e sem overflow.
- **R-TREE-2 · Conectores sempre visíveis.** O SVG de dependências renderiza em todas as larguras, com traço sem escala e caminho do nó selecionado destacado. *Aceite:* SVG com `getClientRects().length > 0` em 320 px.
- **R-TREE-3 · Nó compacto responsivo.** O nó tem ícone (36 px em <640 px, 44 px acima), nome (duas linhas máx., 11–12 px em <640 px) e contador de pontos no canto; largura mínima 84 px para que 3 colunas + 2 vãos caibam em 288 px úteis. Nome nunca é omitido; se truncar, `title`/`aria-label` carregam o nome completo. *Aceite:* medição em 320 px; teste de a11y confere `aria-label` = "Nome, nível N, Tree, estado, pontos".
- **R-TREE-4 · Nível necessário e bloqueio.** Cada nó exibe o nível de desbloqueio (já implícito pela fileira; explícito no `aria-label` e no painel). Quando um nível de personagem estiver definido (opcional, `R-TREE-9`), nós acima do nível ficam em estado **bloqueada**. *Aceite:* estado derivado de `requiredLevel`.
- **R-TREE-5 · Estados visuais.** Quatro estados com forma e texto, não só cor: **bloqueada** (ícone esmaecido, cadeado no canto), **disponível** (moldura padrão), **investida** (moldura ember, contador "N"), **maximizada** (moldura ember cheia, contador "20", marca no canto). Em páginas de build, os papéis atuais (Maximizada/Utilidade/Pré-requisito/Obrigatória) mapeiam para investida/maximizada e continuam no painel. *Aceite:* snapshot de HTML por estado; contraste ≥ 4,5:1 para texto e ≥ 3:1 para a moldura (gate de contraste existente).
- **R-TREE-6 · Contador de pontos.** No canto de cada nó, os pontos-base; no cabeçalho de cada tree, "N de M pontos nesta árvore"; no cabeçalho da seção, o total (já existe "88 de 110"). Quando aplicável, bônus de +skills aparece como "20 (+5)" apenas no painel, nunca no nó, e apenas se a build declarar `flexPoints`/bônus; caso contrário o site continua tratando só pontos-base, com a nota atual "Somente pontos duros". *Aceite:* somas conferem com `SkillAllocation` (teste de dados).
- **R-TREE-7 · Pré-requisitos e sinergias no painel.** O painel/sheet mostra: descrição, nível, pré-requisitos (links), desbloqueia (links), sinergias recebidas e dadas (links), pontos nesta build e link "Ver página completa". *Aceite:* mesmo conteúdo da página de skill em forma resumida; todos os nomes são links.
- **R-TREE-8 · Uma tree por vez no celular.** Em <640 px a seção mostra um controle segmentado com as três trees e renderiza uma por vez (as outras permanecem no DOM, ocultas), reduzindo a altura de ~1.500 px para ~500 px. Acima de 640 px, as três empilhadas como hoje (ou lado a lado a partir de 1280 px, se couber). *Aceite:* altura da seção em 390 px ≤ 600 px por tree; troca de tree preserva o foco; sem JS, as três renderizam empilhadas.
- **R-TREE-9 · Nível de personagem (opcional).** Um campo "Meu nível" (1–99, persistido em `d2rc.level`) que só marca bloqueio; sem valor, nada fica bloqueado. *Aceite:* não altera nenhum dado; testes por estado.
- **R-TREE-10 · Uso em build e leveling.** Na build, o componente recebe alocações (já faz). No leveling, cada etapa pode renderizar a árvore da tree relevante com os pontos daquela etapa (dados já existem em `skillPoints`), em modo compacto. *Aceite:* pelo menos a jornada da Sorceress renderiza a árvore por etapa sem custo editorial novo.

### 8.3 Interação

- **R-TREE-11 · Hover no desktop.** Com `(hover: hover)`, hover mostra o painel em modo prévia sem mudar a seleção (já existe); o caminho de pré-requisito acende no hover. *Aceite:* sem hover em touch (gate `matchMedia`).
- **R-TREE-12 · Toque e clique.** Toque seleciona e abre o sheet (<1024 px) ou atualiza o painel; segundo toque no mesmo nó não fecha (evita toque acidental); fechar pelo botão, Esc ou fundo. Alvo ≥ 44 px onde o nó permitir, nunca < 24 px. *Aceite:* gate de alvo de toque.
- **R-TREE-13 · Teclado.** Setas movem estritamente pela grade: esquerda/direita na mesma fileira, cima/baixo na mesma coluna, pulando células vazias e parando na borda; Home/End; Enter/Espaço abre; Esc fecha e devolve o foco; Tab sai da tree. A navegação atual "vizinho mais próximo" é substituída. *Aceite:* testes de `lib/skill-tree-nav.ts` reescritos com a matriz da Sorceress (Ice Blast → direita = nada; Ice Blast → baixo = Glacial Spike).
- **R-TREE-14 · Leitor de tela.** `role=grid` mantido; cada célula anuncia nome, nível, tree, estado e pontos; conectores são decorativos (`aria-hidden`); o painel é `role=region` com `aria-live=polite` no desktop e `role=dialog` no sheet. *Aceite:* teste de composição de `aria-label` existente estendido aos estados.
- **R-TREE-15 · Zoom.** Em zoom de 200% (viewport efetivo de 640 px em 1280), a grade continua 3×6 sem overflow; em 400% (320 px efetivo), idem com nó compacto. *Aceite:* teste de viewport em 320 px cobre o caso.
- **R-TREE-16 · Sem JavaScript.** O `<noscript>` atual é substituído por renderização server-side da grade com links: a grade 3×6, os conectores e os nós são HTML/SVG estático; apenas seleção, painel e estados dinâmicos dependem de JS. *Aceite:* teste de HTML sem scripts encontra a grade e 30 links.
- **R-TREE-17 · Desempenho.** Ícones em um único sprite SVG por classe (`<symbol>` + `<use>`), ≤ 40 KB por classe, embutido apenas nas páginas daquela classe; sem imagens raster; nenhum aumento do JS de cliente além do necessário para estados. *Aceite:* medição do tamanho do HTML por página de classe (baseline 312 KB) com aumento ≤ 15%.

### 8.4 Ícones: proveniência e licença

- **R-TREE-18 · Um ícone por skill.** 240 ícones, um por skill, em SVG monocromático com a cor do elemento aplicada por CSS, dentro de uma moldura própria. Fallback: o sigilo atual por tipo+elemento até que o ícone da skill exista. *Aceite:* manifesto `content/classes/skill-icons.ts` com `skill → símbolo`, e um teste que lista skills sem ícone próprio (permitido durante as fases 3–4, bloqueante ao fim da fase 4).
- **R-TREE-19 · Matriz de assets.**

| Categoria | Exemplos | Pode usar? | Condição |
|---|---|---|---|
| Assets originais do projeto | SVGs desenhados para o Codex, sigilos atuais | Sim | Fonte no repositório, autoria registrada |
| Assets sob licença livre com atribuição | Conjuntos de ícones CC BY (por exemplo game-icons.net, CC BY 3.0) | Sim, com confirmação | Licença e autor registrados por ícone em `skill-icons.ts`; atribuição na página de fontes; sem ícones que reproduzam a arte da Blizzard |
| Assets de domínio público / CC0 | Ícones CC0 | Sim | Registro de origem |
| Assets que exigem confirmação de licença | Conjuntos "livres" sem licença explícita, ícones de fóruns | Não até confirmar | Se a licença não for localizada, não usar |
| Assets do jogo ou derivados | Ícones, molduras, fundos, fontes, sprites extraídos do D2/D2R, recolorizações, traçados vetoriais por cima da arte | **Nunca** | Direito autoral e trade dress da Blizzard; a licença de uso pessoal do Legal FAQ é revogável e não cobre este site |
| Placeholders temporários | Sigilo por tipo+elemento (atual) | Sim | Só até o ícone próprio existir; listado pelo teste |

Critérios para **não** usar um asset: origem desconhecida; licença não localizada ou incompatível com uso público; semelhança que possa ser confundida com a arte oficial; dependência de um serviço externo em tempo de execução.

*Aceite de R-TREE-19:* todo ícone em `skill-icons.ts` carrega `origin` (`own` | `licensed` | `placeholder`) e, quando `licensed`, `license` e `author`; um teste falha para qualquer ícone sem esses campos ou com `origin` fora da lista; a página de fontes lista as atribuições geradas a partir do manifesto; nenhum arquivo em `public/` ou no sprite tem nome, hash ou dimensão que corresponda a assets do jogo (revisão manual registrada no plano da fase 4).

### 8.5 Alternativas para mobile (comparadas)

| Alternativa | Prós | Contras | Veredito |
|---|---|---|---|
| Árvore reduzida responsiva (nó compacto, 3 colunas em 288 px) | Preserva posição e conectores; sem gesto novo; compatível com no-JS | Nome pequeno; ícone é o que salva a leitura | **Recomendada** (com `R-TREE-8`) |
| Viewport horizontal controlado (grade em largura fixa com rolagem lateral) | Nó grande | Rolagem lateral em página vertical é frágil; esconde metade da árvore | Rejeitada |
| Zoom/pan acessível | Fidelidade de tamanho | Gestos conflitam com rolagem; difícil no teclado; custo alto | Rejeitada |
| Visão geral + detalhe (miniatura + zona ampliada) | Elegante | Dois estados a manter; ainda não cabe sem nó compacto | Rejeitada como base; pode ser adorno futuro |
| Árvore por aba | Corta a altura em 3 | Sozinha não resolve a largura | Adotada como complemento (`R-TREE-8`) |

**Validação da recomendação:** antes da fase 3, um protótipo estático (HTML na pasta de docs, sem código de produção) com a árvore Cold da Sorceress em 320 px, avaliado pelo proprietário em um telefone real; critério: identificar Blizzard, Glacial Spike e o caminho entre eles em ≤ 5 s sem tocar; nome legível a 30 cm.

---

## 9. Conteúdo e correções editoriais

### 9.1 Correções rápidas (fase 0)

| Item | Defeito | Correção | Aceite |
|---|---|---|---|
| E1 | D1 nota de cobertura em `/classes` | Derivar a nota dos dados (classes com builds, com leveling, com skills) ou remover; se derivada, o texto é gerado por contagem, nunca escrito à mão | Teste de conteúdo falha se qualquer string do dicionário contiver contagens ou nomes de classe como "cobertura" |
| E2 | D2 título órfão | Guarda `.length > 0` como em `leveling/page.tsx:146` | Teste de HTML construído: nenhuma `<Section>` sem filhos |
| E3 | D3 "Por que tão poucas builds?" | Remover o callout e as chaves `whyFewTitle/whyFewBody` | Chaves ausentes nos dois dicionários |
| E4 | D4 slugs do mercenário | `<ItemRefLink refItem={g.ref} />` + `why` | Teste de HTML procura `[a-z]+ [a-z]+` em `.font-medium` da seção; teste de dados resolve todas as refs |
| E5 | D6 skills sem link | Linkar nomes nas tabelas de skills da build | 0 nomes de skill sem link (teste) |
| E6 | D10 strings e contagens mortas | Remover `hideFilters`; atualizar comentários e README; gerar contagens de páginas a partir do sitemap onde forem exibidas | `grep` no teste de higiene |
| E7 | D11 SVGs órfãos e rotas fabricadas | Remover os cinco SVGs; `resolveRef` retorna `href: undefined` para kinds sem rota e `ItemRefLink` renderiza texto sem link | Teste que falha se `resolveRef` produzir href para rota inexistente |
| E8 | D12 rótulos pt-BR | Traduzir as chaves listadas; adicionar "Amuleto/Cinto/Amuletos (charms)" conforme ADR 0003 (charm é termo de jogo: manter "Charms") | Lista de exceções explícita no teste de dicionário |

### 9.2 Mudanças estruturais de conteúdo (fases 5–6)

- Página de skill com dano por nível 1–30 e anterior/próximo na tree (dados já no grafo).
- Aprofundar as builds com menos de 10 alternativas na seção Gear (Tesladin, Melee Sorceress, Freezing Arrow, Holy Fire, Poison Javelin, Exploding Arrow, Zealot, Smiter, Avenger) e os tiers Início de Paladin/Sorceress/Amazon (4–5 slots contra 10 em Barbarian/Assassin). Editorial, incremental, sem bloquear fases.
- Página "O que mudou no 3.3" consolidando as mudanças já citadas espalhadas (Sunder Charm nível 75, Terror Zones, Warlock).
- Mostrar o rótulo de confiança já existente ("fonte única", "consenso") no cartão da listagem, não só na página.

---

## 10. Requisitos bilíngues

- **R-I18N-1 · Paridade funcional.** Todo controle novo (seletor de tier, chips, ordenação, sheet, árvore) existe nos dois idiomas com as mesmas capacidades. *Aceite:* testes de HTML construído rodam nas duas rotas.
- **R-I18N-2 · Paridade estrutural.** Mesmas seções, mesma ordem, mesmas âncoras (`#gear-budget` é igual nos dois idiomas); slugs e parâmetros de URL em inglês. *Aceite:* comparação de esqueleto de headings entre `/en-us/x` e `/pt-br/x` no teste de crawl.
- **R-I18N-3 · Nada de slug como texto.** Nenhuma superfície renderiza `slug` ou `slug.replace`; toda referência passa por `resolveRef` e um componente de link. *Aceite:* teste de higiene proíbe `.slug.replace(` e `.slug}` em JSX de apresentação.
- **R-I18N-4 · Rótulos responsivos.** Rótulos que encurtam em larguras estreitas (tiers no chip, "Mais filtros") têm forma curta e longa nos dois dicionários, e a forma longa vai para `aria-label`. *Aceite:* chaves `*.short` pareadas; teste de dicionário.
- **R-I18N-5 · Pluralização.** Contagens usam formas singular/plural nos dois idiomas (`resultsOne/Many` traduzidas; "1 build", "2 builds" em ambos, pois "build" é termo mantido). *Aceite:* teste de dicionário com exemplos 0/1/2.
- **R-I18N-6 · Nomes oficiais vs. traduções.** Mantém ADR 0003: skills, itens, runewords, áreas, classes e dificuldades em inglês; rótulos de interface, slots de equipamento e categorias em português. Lista canônica de termos invariantes em `docs/adr/0003` referenciada pelo teste. *Aceite:* o teste de dicionário compara chaves idênticas EN/PT contra a lista de exceções e falha para novas coincidências.
- **R-I18N-7 · Alternância preservando contexto.** Continua preservando rota e query; passa a preservar hash (`#gear-budget`) e a preferência de tier (que é por navegador, não por idioma). *Aceite:* teste do `locale-switcher` com hash.
- **R-I18N-8 · Critérios de revisão.** Toda mudança de dicionário entra com os dois idiomas no mesmo commit; toda build ou skill nova entra com overlay pt-BR; `check:content` continua bloqueante; um revisor (o proprietário) lê a página pt-BR em 390 px antes de fechar a fase. *Aceite:* nenhum commit de fase altera `en-us.ts` sem alterar `pt-br.ts` (verificado no `git log` da fase); `check:content` e o teste de dicionário verdes; o plano de cada fase tem um item de checklist "leitura pt-BR em 390 px" marcado antes do fechamento.

---

## 11. Acessibilidade e responsividade

Requisitos verificáveis, todos com gate automatizado onde indicado.

- **R-A11Y-1 · Teclado.** Todo controle interativo é alcançável por Tab na ordem visual e operável por Enter/Espaço; setas para grupos compostos (segmentado, grade). *Gate:* teste de a11y construído lista elementos interativos sem `tabindex` válido.
- **R-A11Y-2 · Foco.** Anel de 2 px `ember` com offset, em todos os controles novos; foco devolvido ao gatilho ao fechar sheet/popover. *Gate:* teste de sheet existente estendido.
- **R-A11Y-3 · Leitor de tela.** Nomes acessíveis compostos (nó da árvore, chip, tier); `aria-live=polite` para contadores; `aria-pressed`/`aria-expanded` corretos. *Gate:* teste de composição de `aria-label`.
- **R-A11Y-4 · Touch.** Alvos ≥ 24×24 px (mínimo, gate existente) e ≥ 44 px para controles primários (chips de classe, seletor de tier, nós da árvore quando couber). *Gate:* viewport test.
- **R-A11Y-5 · Contraste.** Texto ≥ 4,5:1, texto grande e bordas de estado ≥ 3:1; estados nunca só por cor. *Gate:* `scripts/contrast.test.ts` estendido aos tokens novos.
- **R-A11Y-6 · Redução de movimento.** Transições de tier, sheet e caminho da árvore respeitam `prefers-reduced-motion` (sem animação, só troca de estado). *Gate:* teste de CSS procura `@media (prefers-reduced-motion)` para cada transição declarada.
- **R-A11Y-7 · Zoom 200%.** Nenhum overflow horizontal e nenhum conteúdo cortado em 1280 px com zoom 200% (equivalente a 640 px). *Gate:* viewport test em 640 px.
- **R-A11Y-8 · 320 px.** Nenhuma página com overflow; árvore 3×6; header intacto (orçamento de ~22 px registrado na memória do projeto). *Gate:* viewport test existente + casos novos.
- **R-A11Y-9 · Modais e sheets.** `role=dialog aria-modal`, foco preso, scroll travado com contagem, Esc e fundo fecham, foco devolvido; reutilizar `focus-trap` e `scroll-lock`. *Gate:* testes existentes reutilizados para cada sheet nova.
- **R-A11Y-10 · Hover com alternativa.** Toda informação exibida por hover existe por clique/toque e por teclado. *Gate:* revisão por checklist na fase; teste de `matchMedia`.
- **R-A11Y-11 · Árvores complexas.** `role=grid` com roving tabindex, navegação estrita por fileira/coluna, `<noscript>`/SSR com links. *Gate:* `test:nav`, `test:tree`, `test:a11y`.
- **R-A11Y-12 · Progressive enhancement.** Toda página renderiza conteúdo completo sem JS; controles de preferência (tier, nível, compacto) só aparecem com JS; filtros por classe funcionam como links. *Gate:* teste de HTML sem scripts por página-tipo.

---

## 12. Métricas de sucesso

Métricas de qualidade, medidas pelos gates ou por sessão de teste do proprietário. Sem analytics.

| Métrica | Baseline (auditoria 2026-09-07) | Meta | Como medir |
|---|---|---|---|
| Ações para chegar ao tier desejado na build | Sem controle: só rolagem (Gear começa em 6.066 px; tier Econômico em ~9.200 px) | ≤ 2 ações (abrir build → tocar tier) ou 1 com preferência | Teste headless conta cliques e mede `scrollY` |
| Distância de rolagem entre tiers adjacentes | ~1.700 px por tier no desktop; ~2.800 px em 390 px | ≤ 1 tela | Viewport test |
| Altura da página de build (390 px) | 31.939 px | ≤ 12.000 px com tier ativo e demais compactos (estimativa) | Viewport test |
| Px até o primeiro cartão em `/builds` | 490 (320 px), 442 (390), 771 (768), ~640 (1280) | ≤ 300 / ≤ 300 / ≤ 360 / ≤ 220 | Viewport test |
| Combinações de filtro vazias clicáveis | Todas (contagens globais) | 0 | Teste de `facetCounts` |
| Tempo para localizar uma build pela busca | 2 toques (Ctrl K + digitar) — já bom | Manter; tolerar 1 erro de digitação | `test:search` com casos "blizard", "hamerdin" |
| Tempo para identificar uma skill na árvore (320 px) | Não medível: árvore é lista | ≤ 5 s para achar Blizzard e seu caminho (teste com o proprietário) | Protótipo + sessão |
| Tarefas concluídas em sessão de teste (J1–J12) | Não medido | 12/12 em desktop e celular, nos dois idiomas | Checklist ao fim das fases 2 e 4 |
| Páginas sem overflow em 320 px | 100% (gate) | 100% | `test:viewport` |
| Cobertura bilíngue | 902/902 chaves; 53/53 overlays; 104 chaves idênticas (maioria por política) | 902+/902+; 53/53; 0 idênticas fora da lista de exceções | `check:content`, teste de dicionário |
| Afirmações estáticas de cobertura | 3 (D1, D2, D3) | 0 | Teste de conteúdo |
| Referências cruzadas sem link | Mercenário em 53 builds; skills nas tabelas | 0 | Teste de HTML construído |
| Acessibilidade | Foco 2 px, skip link, roving tabindex, sheets com trap: ok; setas da árvore imprecisas | Todos os gates da seção 11 verdes | `check:built` |
| Consistência dos dados | 53/53 completas; 4 builds sem breakpoints por decisão; comentários com "29 builds" | 0 contagens escritas à mão | `test:hygiene` |
| Regressões detectadas automaticamente | 40 scripts; nenhum mede altura de primeira dobra ou estados da árvore | +1 gate por fase (O7) | Lista na fase |
| HTML por página de classe | 312 KB | ≤ 360 KB com sprite de ícones | Medição no build |

---

## 13. Priorização

Reavaliada após a remoção de compartilhamento. Dois P0, não três.

### P0 — contradizem ou quebram a experiência

**P0.1 Notas de cobertura e listagem (D1, D2, D3)**
- Problema: o site afirma sobre si mesmo coisas falsas na primeira página de decisão e na listagem principal.
- Evidência: textos capturados em EN e PT; `builds/page.tsx:117-137`; dicionários.
- Requisitos: E1, E2, E3, R-I18N-6.
- Impacto: alto (confiança). Esforço: pequeno. Risco: nenhum. Dependências: nenhuma.
- Aceite: nenhuma frase estática sobre cobertura; nenhuma seção sem filhos; chaves removidas.
- Testes: teste de conteúdo para strings de cobertura; teste de HTML para seções vazias.

**P0.2 Equipamento do mercenário (D4)**
- Problema: única referência cruzada do site sem nome resolvido nem link, na página mais importante.
- Evidência: `page.tsx:492` vs. `mercenaries/page.tsx:186`; captura `build-merc-390.png`.
- Requisitos: E4, R-BUILD-14, R-I18N-3.
- Impacto: alto. Esforço: pequeno. Risco: nenhum. Dependências: nenhuma.
- Aceite: 53/53 builds com refs resolvidas e `why` visível.
- Testes: teste de dados de refs; teste de HTML; teste de higiene contra `slug.replace`.

### P1 — maior impacto

**P1.1 "Meu tier" e tiers compactos na build** — R-BUILD-1…12, R-PREF-1…3. Evidência: 18.931/31.939 px; Gear de 6.066 a 16.357 px. Esforço: médio. Risco: layout shift ao aplicar preferência (mitigado por R-BUILD-10); esconder demais (mitigado por R-BUILD-3). Dependências: módulo de preferências. Aceite: métricas 1–3 da seção 12. Testes: viewport (altura, rolagem), HTML sem scripts, snapshot por estado, CLS headless.

**P1.2 Comparação adjacente e upgrades** — R-BUILD-6, 7. Esforço: pequeno/médio. Risco: regra de comparação mal calibrada (mitigado por testes sobre as 53 builds). Dependência: P1.1. Aceite: marcador em todos os slots; sem texto livre.

**P1.3 Redesign dos filtros** — R-FILT-1…16. Evidência: 490/770 px até o primeiro cartão; contagens estáticas. Esforço: médio. Risco: regressão na sheet (mitigado por reutilização e testes existentes); no-JS (R-FILT-14). Dependências: P1.1 (mesmo componente segmentado e preferência). Aceite: métricas 4–5. Testes: `facetCounts`, `sort`, viewport, sheet, HTML sem scripts.

**P1.4 Árvore de skills — etapa estrutural** — R-TREE-1…17 (exceto ícones). Evidência: lista em <640 px; setas imprecisas; sem contador. Esforço: médio. Risco: legibilidade do nó compacto (mitigado pelo protótipo validado, seção 8.5). Dependências: nenhuma de código; protótipo aprovado. Aceite: grade 3×6 em 320 px; teclado estrito; estados; sprite. Testes: viewport por largura, `test:nav` reescrito, a11y, HTML sem scripts.

**P1.5 Descoberta e orientação** — tiers da home clicáveis (gravam `d2rc.tier` e vão para `/builds`), "Começar um personagem" leva à escolha de classe, sumário/abas na página de classe, referência (Runas, Itens, Breakpoints, Mercenários, Mecânicas) como cartões na home e rótulo "Referência ▾" no header. Esforço: pequeno. Dependências: R-PREF-1. Aceite: cada cartão de tier tem href; "Skill trees" alcançável em um toque na classe; cinco cartões de referência na home. Testes: crawl de links; HTML.

**P1.6 Progresso persistido no leveling** — `d2rc.leveling.<classe>`, checkbox por etapa, "você está na etapa N", retorno à etapa ao abrir; barra de etapas com indicador de rolagem (D9). Esforço: pequeno/médio. Dependências: R-PREF-3. Aceite: ao reabrir, a etapa marcada está em foco; sem JS, nada muda. Testes: HTML por estado; viewport para a barra.

### P2 — melhorias importantes

**P2.1 Ícones por skill** (R-TREE-18, 19) — esforço grande por volume (240), incremental; começa pelas 53 skills principais das builds. Aceite: manifesto sem faltas ao fim da fase 4.
**P2.2 Página de skill: dano 1–30, anterior/próximo** — pequeno.
**P2.3 Filtros em runewords e itens** (base, sockets, classe, slot; mesmo padrão de chips) — pequeno/médio.
**P2.4 Calculadora de breakpoint** ("tenho X% → frame; próximo em Y%") em `/breakpoints` e no bloco da build — pequeno/médio.
**P2.5 Modo de consulta compacto + impressão** (R-BUILD-15) — médio.
**P2.6 Busca: tolerância a erro e uma só busca** (R-FILT-8; distância de edição 1 para termos ≥ 5 letras) — pequeno.
**P2.7 pt-BR residuais e higiene** (E6, E7, E8) — pequeno.
**P2.8 Aprofundamento editorial das builds mais rasas** — editorial, contínuo.
**P2.9 404 com header e busca, um idioma por rota** (D13) — pequeno; exige revisitar a decisão documentada em `not-found.tsx` à luz do `dynamicParams = false` (memória do projeto registra o caminho).

### P3 — refinamentos e apostas futuras

**P3.1 Comparação de duas builds** (local, via query `?vs=`; resumo, orçamento por tier, imunidades, breakpoints) — médio.
**P3.2 Favoritos locais** (estrela em build/runeword; lista em "Minhas builds"; `localStorage`) — pequeno; só depois de P1.1.
**P3.3 Página "O que mudou no 3.3"** — editorial.
**P3.4 Manifest e ícones para instalar como app** no celular (uso pessoal durante o jogo; sem backend) — pequeno; questão Q4.
**P3.5 Farm por build e imunidade + Terror Zones documentadas** — médio.
**P3.6 Árvore por etapa no leveling** (R-TREE-10) — pequeno após P1.4.
**P3.7 JSON-LD básico** (BreadcrumbList) — pequeno; SEO básico, não social.
**P3.8 Rótulo de confiança no cartão da listagem** — pequeno.

---

## 14. Fases recomendadas

Cada fase entrega melhoria perceptível e termina com pelo menos um gate novo.

### Fase 0 — Correções editoriais e mercenário

- **Objetivo:** remover tudo o que contradiz o site e a única referência quebrada.
- **Escopo:** P0.1, P0.2, E5 (links de skill nas tabelas), E6, E7, E8.
- **Fora:** qualquer mudança de layout.
- **Dependências:** nenhuma.
- **Riscos:** nenhum funcional; risco de esquecer o pt-BR (mitigado por `check:content`).
- **Aceite:** métricas "afirmações estáticas = 0" e "referências sem link = 0"; dicionários sem `whyFew*`; README atualizado.
- **Testes novos:** conteúdo (strings de cobertura), HTML (seções vazias, slugs, skills sem link), higiene (`slug.replace`), refs de mercenário.
- **Entregável visível:** `/classes`, `/builds` e todas as builds sem textos falsos; mercenário com links.
- **Condição para avançar:** `npm run verify` verde com os gates novos.

### Fase 1 — Experiência de tier na página de build

- **Objetivo:** chegar ao tier certo em ≤ 2 ações e reduzir a rolagem.
- **Escopo:** P1.1, P1.2, R-PREF-1…3, sumário da página (R-BUILD-8), tiers clicáveis na home e CTA de classe (parte de P1.5, porque usam a mesma preferência).
- **Fora:** filtros, árvore, modo compacto.
- **Dependências:** fase 0.
- **Riscos:** layout shift; esconder conteúdo; conflito entre hash e preferência (regra em R-BUILD-2).
- **Aceite:** métricas 1–3 da seção 12; R-BUILD-1…12 verdes; no-JS idêntico ao atual mais o controle.
- **Testes novos:** viewport de altura/rolagem por tier; HTML sem scripts; snapshot por estado de preferência; CLS headless; testes de `compareTiers`.
- **Entregável visível:** build abre com "Meu tier", tier ativo expandido, demais compactos com resumo, marcadores de upgrade.
- **Condição para avançar:** sessão do proprietário em celular e desktop nos dois idiomas com J3, J4, J5 concluídas.

### Fase 2 — Simplificação e redesign dos filtros

- **Objetivo:** primeira build na primeira dobra e zero combinações vazias.
- **Escopo:** P1.3 completo; cartão (R-FILT-16); página de classe (R-FILT-15); ordenação; busca única (P2.6 parte "uma busca"; tolerância a erro pode ficar para a fase 5).
- **Fora:** filtros de runewords/itens.
- **Dependências:** fase 1 (segmentado e preferência).
- **Riscos:** regressão na sheet; no-JS.
- **Aceite:** métricas 4–5; R-FILT-1…16.
- **Testes novos:** `facetCounts`, `sort`, viewport (px até o primeiro cartão em 4 larguras), HTML sem scripts (chips como links), sheet reutilizada.
- **Entregável visível:** `/builds` e páginas de classe com chips, "Onde você está", "Mais filtros", ordenação, contagens vivas.
- **Condição para avançar:** J1, J2, J10 concluídas na sessão do proprietário.

### Fase 3 — Skill tree fiel, etapa estrutural

- **Objetivo:** árvore 3×6 com conectores, contador, estados e teclado estrito em todas as larguras.
- **Escopo:** P1.4 (R-TREE-1…17), com o sigilo atual como ícone provisório; protótipo validado antes de codificar (seção 8.5).
- **Fora:** ícones por skill; árvore no leveling.
- **Dependências:** protótipo aprovado; nenhuma de código.
- **Riscos:** legibilidade em 320 px; regressão de teclado; peso do HTML.
- **Aceite:** R-TREE-1…17; HTML por classe ≤ 360 KB.
- **Testes novos:** viewport por largura (3 colunas, SVG visível), `test:nav` reescrito, a11y por estado, HTML sem scripts com grade e links.
- **Entregável visível:** árvore como árvore no celular, abas por tree, pontos e estados.
- **Condição para avançar:** J6, J7 concluídas em 320 px e desktop.

### Fase 4 — Ícones e acabamento visual da skill tree

- **Objetivo:** reconhecimento por ícone e moldura própria.
- **Escopo:** P2.1 (manifesto, sprite por classe, fallback), R-TREE-18, 19; primeiro as 53 skills principais, depois o restante; moldura e estados finais; nível de personagem opcional (R-TREE-9).
- **Fora:** qualquer asset do jogo.
- **Dependências:** fase 3; decisão Q1.
- **Riscos:** licença de conjunto externo; consistência visual entre ícones de origens diferentes (mitigado por regra: um único conjunto ou só próprios).
- **Aceite:** 240/240 com ícone próprio ou licenciado e registro de origem; teste de manifesto sem faltas; contraste.
- **Testes novos:** manifesto de ícones; tamanho do sprite; contraste dos estados.
- **Entregável visível:** árvore com ícone por skill nas 8 classes.
- **Condição para avançar:** proprietário reconhece ≥ 20 skills da própria classe principal pelo ícone sem ler o nome.

### Fase 5 — Refinamento visual sistêmico das demais páginas

- **Objetivo:** consistência e orientação no resto do site.
- **Escopo:** restante de P1.5 (sumário na classe, referência na home/header), P1.6 (progresso no leveling e barra), P2.2 (skill: dano 1–30, anterior/próximo), P2.3 (filtros de runewords/itens com o padrão da fase 2), P2.4 (calculadora), P2.5 (modo compacto + impressão), P2.6 (tolerância a erro), P2.9 (404), cartão de runeword como padrão de cartão, tratamento dos blocos de referência da home.
- **Fora:** conteúdo novo.
- **Dependências:** fases 1–2 (componentes e preferências).
- **Riscos:** dispersão; a fase deve ser cortada em entregas por página se passar de duas semanas.
- **Aceite:** cada item com seu critério da seção 13; 12/12 jornadas concluídas.
- **Testes novos:** viewport para barra de etapas; HTML sem scripts para leveling; testes da calculadora; snapshot de impressão.
- **Entregável visível:** home, classe, leveling, skill, runewords, itens, breakpoints e 404 alinhados.
- **Condição para avançar:** checklist J1–J12 nos dois idiomas.

### Fase 6 — Oportunidades futuras aprovadas

- **Objetivo:** apostas de valor pessoal sem backend.
- **Escopo:** P3.1 comparação, P3.2 favoritos locais, P3.3 página de patch, P3.4 instalação como app (se Q4 = sim), P3.5 farm por build, P3.6 árvore no leveling, P3.7 JSON-LD básico, P3.8 confiança no cartão, P2.8 aprofundamento editorial.
- **Fora:** tudo da seção 3.2.
- **Dependências:** fases anteriores.
- **Riscos:** crescer sem uso real; cada item entra só se o proprietário sentir falta dele em sessão de jogo.
- **Aceite e testes:** por item, definidos ao planejar.
- **Entregável visível:** por item.
- **Condição para avançar:** não se aplica; fase aberta.

---

## 15. Questões em aberto

Só decisões que dependem do proprietário. As demais estão resolvidas neste PRD.

**Q1 · Origem dos ícones de skill (fase 4).**
- Contexto: 240 ícones. Desenhar todos é o caminho de maior identidade e maior esforço; um conjunto CC BY (ex.: game-icons.net) com atribuição cobre a maioria com esforço menor e identidade parcial; misturar os dois exige regra visual.
- Opções: (a) só próprios; (b) só conjunto licenciado com atribuição; (c) conjunto licenciado como base e próprios para as 53 skills principais.
- Recomendação: (c).
- Impacto: define esforço da fase 4 e a página de fontes (atribuição).
- Quando: antes do início da fase 4.

**Q2 · Tier ativo quando não há preferência (fase 1).**
- Contexto: R-BUILD-3 propõe manter os seis tiers expandidos até a primeira escolha.
- Opções: (a) tudo expandido até escolher; (b) "Econômico" como padrão já compactando os demais.
- Recomendação: (a), porque não esconde nada de quem nunca escolheu e o custo é uma decisão de um toque.
- Impacto: primeira impressão de quem não conhece o controle.
- Quando: antes da fase 1.

**Q3 · Uma tree por vez no celular também em tablet? (fase 3).**
- Contexto: R-TREE-8 aplica abas abaixo de 640 px; em 640–1023 px as três empilhadas cabem, mas somam ~1.500 px.
- Opções: (a) abas só em <640 px; (b) abas em <1024 px.
- Recomendação: (a); tablet mantém visão completa.
- Impacto: altura da página de classe em tablet.
- Quando: no protótipo da fase 3.

**Q4 · Instalação como app no celular (fase 6).**
- Contexto: um `manifest` e ícones permitem abrir o site como app durante o jogo; não envolve backend nem conta, mas é uma superfície nova para manter (ícones, cor, nome).
- Opções: sim / não.
- Recomendação: sim, depois da fase 5.
- Impacto: pequeno.
- Quando: ao planejar a fase 6.

**Q5 · Aprofundamento editorial das builds mais rasas (fase 6).**
- Contexto: 9 builds com < 10 alternativas e tiers Início com 4–5 slots; é trabalho de escrita e verificação.
- Opções: (a) incluir como fluxo contínuo desde a fase 0, uma build por semana; (b) só depois da fase 5.
- Recomendação: (a), porque não depende de código e é o que mais eleva a percepção de "esta build é de segunda".
- Impacto: tempo do proprietário.
- Quando: a qualquer momento.

---

## 16. Rastreabilidade

| Achado da auditoria | Requisito | Prioridade | Fase | Critério de aceite |
|---|---|---|---|---|
| Nota de cobertura contraditória em `/classes` (D1) | E1, R-I18N-6 | P0 | 0 | 0 strings estáticas de cobertura |
| Título órfão "Classes aguardando" (D2) | E2, R-FILT-7 | P0 | 0 | Nenhuma seção sem filhos |
| "Por que tão poucas builds?" (D3) | E3 | P0 | 0 | Chaves removidas |
| Slugs no mercenário (D4) | E4, R-BUILD-14 | P0 | 0 | 53/53 refs resolvidas com link e `why` |
| Skills sem link na build (D6) | E5, R-BUILD-13 | P1 (incluído na fase 0 por ser pequeno) | 0 | 0 nomes sem link |
| Strings mortas e contagens (D10) | E6 | P2 | 0 | `test:hygiene` |
| SVGs órfãos e rotas fabricadas (D11) | E7 | P2 | 0 | `resolveRef` sem href para rota inexistente |
| Rótulos pt-BR residuais (D12) | E8, R-I18N-5, 6 | P2 | 0 | Lista de exceções no teste |
| Build de 18.931/31.939 px, tiers empilhados | R-BUILD-1…12, R-PREF-1 | P1 | 1 | Métricas 1–3 |
| Sem "o que muda" entre tiers | R-BUILD-6, 7 | P1 | 1 | Marcador em todos os slots |
| Tiers da home não clicáveis; CTA vai à Sorceress | P1.5 (parte) | P1 | 1 | href em cada cartão; CTA leva à escolha de classe |
| 28 caixas antes do primeiro cartão | R-FILT-1, 3, 11, 15 | P1 | 2 | Px até o primeiro cartão |
| Contagens de faceta estáticas (D5) | R-FILT-4 | P1 | 2 | 0 combinações vazias clicáveis |
| Sem ordenação | R-FILT-5 | P1 | 2 | ≥ 4 critérios; `?sort=` |
| Duas buscas sem relação | R-FILT-8 | P1 | 2 | Um índice |
| Cartão com 4 pares de notas | R-FILT-16 | P1 | 2 | Altura ≤ 80% |
| Sheet mobile (preservar) | R-FILT-12 | P1 | 2 | Testes existentes verdes |
| Árvore vira lista em <640 px (D7) | R-TREE-1, 2, 3, 8 | P1 | 3 | 3 colunas e SVG em 320 px |
| Setas do teclado imprecisas (D8) | R-TREE-13 | P1 | 3 | `test:nav` com matriz |
| Sem contador de pontos por tree; sem estados | R-TREE-5, 6 | P1 | 3 | Somas conferem; snapshots |
| Glifo por tipo, não por skill | R-TREE-18, 19 | P2 | 4 | Manifesto 240/240 |
| Página de classe sem sumário; Skill trees a 3.600 px | P1.5 | P1 | 5 | Um toque até "Skill trees" |
| Referência escondida em "Menu ▾" | P1.5 | P1 | 5 | Cinco cartões na home; "Referência ▾" |
| Leveling sem progresso; barra corta (D9) | P1.6 | P1 | 5 | Etapa em foco ao reabrir; indicador |
| Skill: dano só em 1 e 20; sem anterior/próximo | P2.2 | P2 | 5 | ≥ 7 pontos; navegação |
| Runewords/itens sem filtro | P2.3 | P2 | 5 | Chips de base/sockets/classe/slot |
| Breakpoints estáticos | P2.4 | P2 | 5 | Calculadora |
| Sem modo de consulta/impressão | R-BUILD-15, P2.5 | P2 | 5 | Altura ≤ 1/3; impressão limpa |
| Busca sem tolerância a erro | P2.6 | P2 | 5 | "blizard" encontra |
| 404 bilíngue sem header (D13) | P2.9 | P2 | 5 | Header, busca, um idioma |
| Profundidade desigual entre builds | P2.8, Q5 | P2 | 6 | ≥ 10 alternativas por build |
| Sem comparação de builds | P3.1 | P3 | 6 | `?vs=` local |
| Sem favoritos | P3.2 | P3 | 6 | `localStorage` |
| Sem "o que mudou no patch" | P3.3 | P3 | 6 | Página |
| Sem instalação como app | P3.4, Q4 | P3 | 6 | Manifest |
| Farm sem filtro por build/imunidade | P3.5 | P3 | 6 | Filtro |
| Sem JSON-LD | P3.7 | P3 | 6 | BreadcrumbList |
| Sem og:image / preview social | — | Fora de escopo | — | Decisão do proprietário (seção 3.2) |
| Filtros por ladder/hardcore | — | Recusado (`REFUSED_FILTERS`) | — | Mantido |
| Réplica literal da interface (Direção A) | R-TREE-19 | Rejeitado como execução; referência visual | — | Nenhum asset do jogo |

---

## 17. Apêndice

### 17.1 Rotas auditadas (produção, 2026-09-07)

`/`, `/en-us`, `/pt-br`, `/en-us/classes`, `/pt-br/classes`, `/en-us/classes/sorceress`, `/pt-br/classes/sorceress`, `/en-us/classes/necromancer`, `/en-us/classes/warlock`, `/en-us/classes/sorceress/skills/blizzard`, `/pt-br/classes/sorceress/skills/blizzard`, `/en-us/builds` (+ `?damage=cold`, `?class=necromancer&damage=cold`), `/pt-br/builds`, `/en-us/builds/sorceress/blizzard-sorceress`, `/pt-br/builds/sorceress/blizzard-sorceress`, `/en-us/builds/paladin/hammerdin`, `/en-us/builds/warlock/abyss-warlock`, `/en-us/builds/barbarian/leap-attack-barbarian`, `/en-us/builds/necromancer/summoner-necromancer`, `/en-us/leveling`, `/en-us/leveling/sorceress`, `/pt-br/leveling/sorceress`, `/en-us/leveling/warlock`, `/en-us/farming`, `/en-us/farming/ancient-tunnels`, `/en-us/runewords`, `/en-us/runewords/spirit`, `/en-us/runes`, `/en-us/runes/jah`, `/en-us/items`, `/en-us/items/harlequin-crest`, `/en-us/breakpoints`, `/en-us/mercenaries`, `/en-us/mechanics`, `/en-us/about/sources`, 404 em `/en-us/this-does-not-exist`, `/pt-br/nada`, `/en-us/classes/sorceress/skills`; `/sitemap.xml` (1.002 URLs), `/robots.txt`.

### 17.2 Viewports

1280×800, 1280×900, 1024×800, 768×1024, 640×900, 390×844, 320×640. Sem overflow horizontal em nenhum; header de 57 px em 320 px.

### 17.3 Referências externas

Ver a seção "Referências externas" do [relatório completo](audits/2026-09-07-product-ux-audit.md): Maxroll (build guides, planner, breakpoints), Icy Veins, d2runewizard (runewords, calculadora, integração), diablo2.io (facetas, áreas por imunidade), Arreat Summit, D2 Planner (screenshots como fundo), ecossistema pt-BR (inexistente de forma estruturada), Legal FAQ e diretrizes de marca da Blizzard, estado do jogo (RotW 11/02/2026, Patch 3.3 18/08/2026, S15 21/08/2026). Fatos e opiniões estão marcados lá.

### 17.4 Evidências

Capturas e textos coletados na sessão de auditoria (pasta temporária, não versionados): `home-desktop.png`, `class-sorc-skilltree.png`, `class-sorc-skill-selected.png`, `builds-top.png`, `builds-empty.png`, `build-y540/1500/6040.png`, `search-bliz.png`, `ref-*.png`, `m/home-320.png`, `m/builds-sheet-390-selected.png`, `m/class-skill-tapped-390.png`, `m/class-skills-390.png`, `m/build-gear-390.png`, `m/build-skills-390.png`, `m/build-skills-320.png`, `m/build-merc-390.png`, `m/builds-768.png`. Medições numéricas estão na seção "Medições" do relatório. Achados de código estão na seção "Auditoria técnica" do relatório, com caminho e linha.

### 17.5 Limitações da auditoria

- Transferência comprimida das páginas não pôde ser medida (transferSize = 0 no headless); apenas o HTML decodificado (61–560 KB).
- Sem teste com outros usuários; as jornadas foram percorridas pelo auditor e as métricas de tarefa ficam para as sessões do proprietário.
- A busca em pt-BR foi testada com poucos termos ("frio", "evolu"); "gelo" ficou inconclusivo por captura durante o carregamento do índice.
- A disposição 3×6 do jogo foi confirmada pelo grafo do repositório e pelas capturas, não por wiki (diablowiki bloqueado).
- Sites de referência com Cloudflare (Icy Veins, diablo2.io) foram lidos via arquivo.
- Não foi executado `npm run verify` nem build local; os achados de código são por leitura.

### 17.6 Decisões descartadas

- og:image, previews sociais, compartilhamento, contas, perfis, colaboração, comentários, sincronização (decisão do proprietário).
- Direção A (réplica literal): risco legal e de acessibilidade; identidade.
- Direção C como alternativa: absorvida como primeiro sprint de B.
- Tabs puras na página de build; mostrar só o tier salvo; auto-scroll ao carregar.
- Viewport horizontal, zoom/pan e visão geral + detalhe para a árvore no celular.
- Planner completo, trackers em tempo real, drop calculator, modo claro, anúncios, catálogo de itens "para completar", tier list, filtros por ladder/hardcore.

### 17.7 Fato, opinião visual e hipótese

- **Fatos** (comprovados em produção ou no código): D1–D13; alturas e distâncias medidas; contagens de conteúdo; comportamento dos filtros, da busca, do teclado, das sheets e da troca de idioma; posições da árvore derivadas dos dados; ausência de `localStorage`, `@media print`, JSON-LD.
- **Opiniões visuais** (justificadas, discutíveis): densidade dos filtros como formulário; quatro pares de notas por cartão; blocos de referência da home sem moldura; selo "alvl 85" repetido; cartão de runeword como melhor padrão; glifo genérico por tipo.
- **Hipóteses** (a validar nas sessões do proprietário): que o nó compacto de 84 px é legível a 30 cm; que "Para o meu estágio" é a ordenação mais útil; que tiers compactos com resumo bastam para leitura completa; que a percepção de "build de segunda" vem da contagem de alternativas.
