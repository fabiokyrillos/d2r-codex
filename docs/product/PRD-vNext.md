# PRD vNext — D2R Codex

**Escrito:** 2026-09-07 · **Revisado:** 2026-09-08 (revisão 2, após parecer independente)
**Baseline:** D2R Patch 3.3 / Ladder Season 15 (ver [`../research/00-game-state.md`](../research/00-game-state.md))
**Origem:** [auditoria de produto, UX e design de 2026-09-07](audits/2026-09-07-product-ux-audit.md) e [revisão adversarial de 2026-09-08](reviews/2026-09-08-prd-vnext-review.md), ambas aprovadas pelo proprietário com decisões registradas na seção 18.
**Status:** Aprovado para execução por fases. Este documento decide *o que* muda, *por quê* e *como se verifica*; os planos de implementação por fase são documentos separados.

> Convenções. Cada requisito tem um identificador estável (`R-<área>-<n>`) e pelo menos um critério de aceite verificável. "Deve" é obrigatório; "pode" é opcional. Referências a arquivos e linhas apontam para o código em `7e69fca` (os commits posteriores são só documentação). Onde há medição, o número aparece com data e origem; onde a medição ainda não existe, o item é marcado como **hipótese** ou **saída de spike**. O PRD define resultados e limites; mecanismos de implementação aparecem apenas como hipóteses a validar no plano da fase.

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
2. **Conteúdo confiável.** Nenhuma afirmação sobre o estado do próprio site é escrita à mão; contagens, cobertura e justificativas empíricas derivam dos dados e são remedidas quando os dados mudam. Confiança abaixo de "verificado" é rotulada.
3. **Progressão compreensível.** Tudo é apresentado a partir do estágio do jogador, sem inferir esse estágio: o site pergunta, não presume.
4. **Fidelidade estrutural ao D2R.** Posições, dependências e níveis das skills são os do jogo, extraídos dos dados do jogo.
5. **Identidade própria.** Tipografia, cor, moldura e ícones são do D2R Codex. Nenhum asset protegido da Blizzard.
6. **Excelente experiência bilíngue.** en-US e pt-BR com paridade funcional e estrutural; nomes de jogo em inglês por decisão (ADR 0003).
7. **Mobile como experiência completa.** Nada é "versão reduzida"; a árvore de skills continua sendo árvore em 320 px. (Compromisso condicionado ao protótipo da Fase 0B; ver R-TREE-1.)
8. **Funcionamento sem conta.** Preferências pessoais vivem no navegador (`localStorage`); não há autenticação, backend nem sincronização.
9. **Progressive enhancement proporcional.** Todo conteúdo existe no HTML estático e é alcançável sem JavaScript; JavaScript adiciona estado, preferência e conveniência. Não se constrói uma segunda implementação paralela só para o leitor sem JS.
10. **Qualidade antes de cobertura.** Uma build nova entra com os onze blocos e os seis tiers ou não entra.

### 1.6 Limites explícitos

- Sem recursos sociais, compartilhamento, contas, perfis, colaboração, comentários, avaliações públicas ou sincronização em nuvem (seção 3.2).
- Sem planner completo de skills/itens; sem trackers em tempo real (Terror Zone, Diablo Clone); sem drop calculator. Onde fizer sentido, o site linka para ferramentas externas.
- Sem assets do jogo (ícones, molduras, fundos, fontes) em nenhuma circunstância.
- Sem backend novo. O site continua estático.
- Sem modo claro.
- Sem instalação como app (manifest/PWA) no roadmap atual.

---

## 2. Estado atual

Contagens medidas em 2026-09-07 (auditoria) e 2026-09-08 (revisão) no repositório em `7e69fca` e em produção. Onde duas medições divergiram por método, o número é omitido e o requisito correspondente usa um predicado.

### 2.1 Já entregue

| Capacidade | Estado |
|---|---|
| Classes | 8 páginas com introdução, "melhor para", mecânicas centrais, atributos, três árvores, itens de classe e breakpoints |
| Builds | 53, todas com os 11 blocos e os 6 tiers em ordem canônica, `immunityPlan`, `hardcoreNotes`, `selfFoundNotes`, mercenário e farm; confiança: 46 verificadas, 4 fonte única (Warlock), 3 consenso da comunidade |
| Skills | 240 (30 por classe), uma página por skill com resumo, "como funciona", pré-requisitos, desbloqueios, sinergias nos dois sentidos, dano por nível (1 e 20) e "builds que usam" |
| Árvore de skills | Grade 3×6 com posições do jogo (`content/classes/skill-graph.ts`), conectores em SVG, painel lateral (≥1024 px) ou bottom sheet, `role=grid` com roving tabindex e invariante de alcançabilidade por setas (`lib/skill-tree-nav.ts`), `<noscript>` em lista; abaixo de 640 px a grade vira uma coluna e o trilho de nível (`w-9`, 36 px) e as células vazias saem do DOM |
| Evolução | 8 jornadas (6 a 8 etapas cada) com objetivo, skill points, stat points, ações, equipamento a caçar, "pronto quando" e plano de respec |
| Referência | 53 runewords agrupadas por tier de relevância, 33 runas com receita de upgrade, 65 itens únicos, 20 áreas de farm, 9 mecânicas, 4 mercenários, 16 tabelas de breakpoint, página de fontes com hierarquia e discordâncias |
| Busca | Ctrl/Cmd+K ou `/`, índice estático de 520 entradas por idioma, categorias, apelidos (shako, hoto, soj, javazon), remoção de acentos, navegação por teclado; busca por substring, sem tolerância a erro |
| Filtros | 5 grupos / 28 opções, OR dentro do grupo e AND entre grupos, URL sincronizada com histórico, poda de facetas não discriminantes, barra "Filtrando por", estado vazio, bottom sheet mobile com "Mostrar N builds" ao vivo; contagens calculadas uma vez no servidor |
| 404 | `app/not-found.tsx` com header (wordmark), CTAs para builds e home; sem busca; um único documento para os dois idiomas por decisão medida (ver 17.5) |
| Menu mobile | `<details>` nativo por decisão documentada (serve o leitor sem JS); fecha em navegação, Escape e interação externa |
| Idiomas | en-US e pt-BR com 1.002 URLs espelhadas, hreflang e x-default, troca preservando rota e query, dicionários sem chaves faltantes, 53/53 overlays de build |
| Técnica | Next 16 App Router totalmente estático (`dynamicParams = false`), 6 client components vigiados por teste de fronteira, ~45 scripts `test:`/`check:` (conteúdo, grafo, a11y, contraste, viewport em Chrome real), sem imagens, três fontes via `next/font`, sem `localStorage`, sem CSS de impressão |

### 2.2 Defeito atual (comprovado)

| # | Defeito | Onde |
|---|---|---|
| D1 | Nota "Cobertura" em `/classes` afirma que Assassin não tem builds, Barbarian só visão geral, Warlock só atributos; a página lista 7, 6 e 4 builds | dicionários `en-us.ts` / `pt-br.ts` |
| D2 | `/builds` renderiza o título "Classes aguardando guias de build" sobre uma lista vazia em todas as visitas | `app/[lang]/builds/page.tsx:121-137` (falta o guarda `.length > 0` de `leveling/page.tsx:146`) |
| D3 | Callout "Por que tão poucas builds?" incondicional, com texto de quando havia 2 builds | `app/[lang]/builds/page.tsx:117`, `builds.whyFewBody` |
| D4 | Mercenário › Gear na build renderiza `slug.replace(/-/g," ")` sem link e descarta `why` | `app/[lang]/builds/[classSlug]/[slug]/page.tsx:492`; `/mercenaries` faz certo em `page.tsx:186` |
| D5 | Contagens de faceta são globais e nunca se estreitam; combinações vazias são clicáveis | `components/builds/filterable-build-list.tsx:130-140` |
| D6 | Nenhum link para páginas de skill fora do painel da árvore (0 links `/skills/` na build); a tabela "Maximize nestas" não linka | página de build |
| D7 | Árvore vira lista de uma coluna e esconde os conectores abaixo de 640 px. O `role=grid` é inválido (fileiras de larguras diferentes) **em todas as larguras**, e por dois motivos independentes: abaixo de 640 px a célula vazia sai do DOM (`hidden sm:block`), e em qualquer largura ela é `aria-hidden="true"`, portanto nunca entra na árvore de acessibilidade. Corrigido na medição de 2026-09-08 (Fase 0B.1) — a redação anterior atribuía o defeito só à largura | `skill-tree-interactive.tsx` (célula vazia com `role="gridcell"` + `aria-hidden="true"` + `hidden sm:block`) |
| D8 | Setas do teclado na árvore escolhem o vizinho mais próximo e saltam de coluna e fileira (Ice Blast → direita cai em Shiver Armor), embora garantam alcançabilidade | `lib/skill-tree-nav.ts:44-56` |
| D9 | Barra de etapas do leveling transborda no desktop sem indicador | `leveling/[classSlug]/page.tsx` |
| D10 | String `hideFilters` declarada e nunca renderizada; contagem "1004 páginas" em `app/[lang]/layout.tsx:79` e `mobile-navigation.tsx:25` (sitemap tem 1.002); comentário "one of only two client components" em `search-dialog.tsx:18` (são seis) | idem |
| D11 | Cinco SVGs do starter do Next em `public/` sem referência; `resolveRef` fabrica links para `/items/sets|bases|charms/…` sem rota | `public/`, `lib/registry/resolve.ts:106-132` |
| D12 | Rótulos em inglês no pt-BR fora da política de nomes próprios: `home.headlineHighlight` ("best in slot"), `mercenaries.tierEndgame` ("endgame"), `farming.target*` (uniques/sets/bases/charms/jewels/keys), `sources.factPatch`, rótulos de slot "Amulet/Belt" na build | dicionário pt-BR |
| D13 | 404 sem busca | `app/not-found.tsx` |
| D14 | A justificativa empírica de `GOOD_AT_THRESHOLD = 4` foi medida sobre 29 builds e 232 notas; hoje há 53 builds. R-FILT-4 e R-FILT-5 dependem desse limiar | `lib/builds/filter.ts:86-95` |

Não são defeitos (registrado para evitar "correções" erradas): `builds.filters.resultsOne/Many` ("{count} build/builds"), `skills.effectChance` ("Chance") e `skills.effectMana` ("Mana") estão corretos no pt-BR; o menu mobile como `<details>` é decisão vigente; "1009 páginas" em `app/not-found.tsx:36` e `scripts/not-found.test.ts:25` é o registro de uma medição histórica e não deve ser reescrito.

### 2.3 Melhoria aprovada

Página de build com tiers compactos por padrão e preferência "Meu tier"; comparação entre tiers adjacentes; filtros redesenhados com contagens condicionais e ordenação; árvore de skills na Direção B (estrutura fiel, identidade própria) condicionada ao protótipo; descoberta e orientação (tiers clicáveis na home, sumário na página de classe, referência fora do "Menu ▾"); progresso persistido no leveling; filtros em runewords e itens; calculadora de breakpoint; dano por nível na página de skill; modo de consulta compacto. Detalhadas nas seções 6 a 9 e 13.

### 2.4 Possibilidade futura (fora do roadmap, sem iniciativa)

Folha de impressão (se um dia houver evidência de que o proprietário imprime; se existir, expande os seis tiers); página "o que mudou no patch"; filtro de farm por build e imunidade; árvore por etapa no leveling; favoritos locais. Instalação como app (manifest/PWA) foi removida do roadmap por decisão do proprietário e não é questão aberta.

### 2.5 Explicitamente fora de escopo

Ver seção 3.2. Em particular: og:image e previews sociais, compartilhamento de builds, contas, perfis, colaboração, comentários, sincronização, backend, réplica de assets do jogo, planner completo, trackers em tempo real, modo claro, PWA, JSON-LD, comparação de builds lado a lado, formulário GET paralelo para filtros avançados, "um idioma por rota" no 404.

---

## 3. Objetivos e não objetivos

### 3.1 Objetivos (mensuráveis; baselines na seção 12)

- **O1.** Chegar ao equipamento do tier relevante de qualquer build em no máximo 2 ações a partir da entrada da página, sem nenhum deslocamento automático que o jogador não pediu.
- **O2.** Ver o primeiro cartão de build em `/builds` a ≤ 300 px do topo no celular e ≤ 220 px no desktop, sem que nenhuma combinação de filtros com zero resultados seja clicável.
- **O3.** Manter a árvore de skills como grade 3×6 com conectores em todas as larguras a partir de 320 px, com ícone reconhecível por skill, contador de pontos, todos os nós alcançáveis por teclado e alvos de toque conforme R-A11Y-4 (≥ 24 px mínimo; ≥ 44 px para controles primários). Condicionado à aprovação do protótipo (R-TREE-0).
- **O4.** Zero afirmações estáticas sobre cobertura ou distribuição do próprio site; zero referências cruzadas sem link.
- **O5.** Paridade pt-BR como predicado: nenhuma chave faltante nos dois dicionários, nenhum overlay de build faltante, e nenhuma chave idêntica ao inglês fora da lista de termos mantidos do ADR 0003.
- **O6.** Toda página sem overflow horizontal em 320 px e todo controle novo com alvo ≥ 24×24 px (gate existente) e navegável por teclado.
- **O7.** Cada fase termina com pelo menos um gate automatizado novo que teria detectado a regressão que ela corrige.

### 3.2 Não objetivos

- Compartilhamento de qualquer tipo: og:image, previews para WhatsApp, Discord ou redes sociais, links "compartilhar", exportação para redes.
- Recursos sociais: comentários, curtidas, avaliações públicas, perfis, feed.
- Contas de usuário, autenticação, colaboração, múltiplos proprietários.
- Sincronização em nuvem de preferências ou entre dispositivos.
- Cópia literal não licenciada da interface ou dos assets do D2R (ícones, molduras, fundos, fontes, sons).
- Expansão de backend sem necessidade comprovada. Metadados básicos de SEO (título, descrição, canonical, hreflang, sitemap) continuam existindo por serem parte de uma página bem formada, não como investimento em aquisição; por isso JSON-LD/rich results também ficam fora.
- Métricas de crescimento, analytics de terceiros, funil.
- PWA/manifest no roadmap atual.

---

## 4. Modos de uso

Personas tratadas como modos de uso de uma mesma pessoa, não como segmentos de mercado.

| Modo | Contexto | O que precisa | Como o produto atende hoje | Lacuna |
|---|---|---|---|---|
| Iniciante | Primeiro personagem da temporada | Escolher classe, seguir evolução, saber o que vestir agora | Home em perguntas do jogador, "melhor para", leveling por etapa | Tiers da home não clicáveis; build de 32 mil px no celular |
| Retornante | Volta após um patch | Saber o que mudou e se o guia está atual | Data de verificação, alerta das oito classes, patch no rodapé | Sem página "o que mudou"; notas de cobertura contradizem o site |
| Experiente | Otimizando um personagem de nível 85+ | Tabelas, breakpoints, alternativas por slot, filtros de referência | Tiers Otimizado/BiS, breakpoints com prioridade, "builds que usam" | Sem filtro em runewords/itens; sem calculadora de breakpoint |
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
- **Sucesso:** primeiro cartão ≤ 300 px (celular) / ≤ 220 px (desktop); ordenação disponível e explicada; busca local removida ou integrada.

### J2. Escolher entre builds

- **Entrada:** listagem filtrada por classe.
- **Objetivo:** decidir entre 3 e 11 builds da classe.
- **Etapas:** ler frase-resumo, chips (elemento, orçamento, dificuldade), duas notas mais relevantes; abrir a build.
- **Atritos:** quatro pares de notas iguais em todos os cartões (20 pontos por linha).
- **Resultado:** cartão legível em 3 s.
- **Sucesso:** cartão com ≤ 2 notas por padrão (as mais altas ou as do foco escolhido) e uma linha "no seu estágio" quando a preferência existir.

### J3. Identificar o tier de equipamento adequado

- **Entrada:** home (cartões de tier), página de build.
- **Objetivo:** saber em qual dos seis tiers o personagem está, sem que o site presuma.
- **Etapas:** ler as seis perguntas ("Cheguei no Hell e estou morrendo") → escolher → a escolha fica salva e a interface a reflete.
- **Atritos:** cartões da home não clicáveis; na build, nada indica que existem tiers até o px 6.066 (390 px: seção Gear começa por volta de 11.416 px, pois termina em 27.731 px e mede 16.315 px; a seção Skills termina em 8.351 px).
- **Resultado:** a escolha é feita uma vez (home, listagem ou build) e reaplicada em todo lugar; os seis resumos de tier são visíveis logo no início da seção Gear.
- **Sucesso:** preferência `d2rc.tier` gravada em 1 ação; o seletor é encontrado no topo da build sem rolar mais de uma tela em 320×640 (aceite numérico em R-BUILD-1).

### J4. Alternar entre tiers

- **Entrada:** página de build.
- **Objetivo:** ir de Econômico para Otimizado e voltar sem perder o lugar.
- **Etapas:** seletor → o tier escolhido expande, os demais ficam compactos → ação explícita "Ir para o equipamento" leva à seção.
- **Atritos:** tiers empilhados (Gear de 16.315 px em 390 px, tiers de 2.191 a 3.421 px cada); âncoras sem estado.
- **Resultado:** troca de tier sem rolagem além de uma tela e sem deslocamento automático.
- **Sucesso:** rolagem entre dois tiers adjacentes ≤ 1 tela quando os demais estão compactos; selecionar um tier nunca altera `scrollY` (teste headless).

### J5. Entender upgrades e substituições

- **Entrada:** tier ativo.
- **Objetivo:** saber o que muda em relação ao tier anterior e o que consertar em seguida.
- **Etapas:** ler slots com marcação "novo / mantido / alternativa / removido" → ler "o que consertar em seguida".
- **Atritos:** a informação existe nas 53 builds, mas só em prosa e sem diferença marcada entre tiers.
- **Resultado:** diferença entre tiers adjacentes derivada dos dados, sem custo editorial.
- **Sucesso:** cada slot do tier ativo carrega um marcador derivado por comparação com o tier anterior; "o que consertar em seguida" permanece ao fim do tier.
  > **Refinamento contratual (proprietário, 2026-09-10, após a Fase 2).** Cada slot recebe um
  > marcador, mas **o estado majoritário de um tier pode ser declarado uma vez em vez de repetido
  > slot a slot**. O motivo é medido: "mantido" é 1.245 das 2.369 ocorrências classificadas e sobe
  > com o tier (443 de 519 em `bis`), e um selo em cada uma delas é um fundo, não um marcador —
  > em ambos os canais, porque repetir "Mantido" oito vezes num leitor de tela é o mesmo ruído. A
  > regra dispara acima de 70% e a frase carrega os dois números ("7 de 10 slots"). Medido depois
  > de implementado: **698 desenhados, 454 só no leitor de tela, 1.217 cobertos por 161 linhas de
  > maioria**.

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
- **Etapas:** escolher tree (aba no celular, se o protótipo confirmar) → varrer a grade → tocar/hover → painel.
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
- **Atritos:** contagens estáticas (D5); sem ordenação; densidade; limiar "boa para" medido sobre 29 builds (D14).
- **Resultado:** seção 7.
- **Sucesso:** zero combinações vazias clicáveis; ordenação com ≥ 4 critérios; URL restaurável; limiar remedido sobre 53.

### J11. Trocar idioma

- **Entrada:** header.
- **Objetivo:** ler a mesma página no outro idioma.
- **Estado:** fluida (preserva rota e query, cookie, hreflang).
- **Atritos:** rótulos residuais (D12).
- **Sucesso:** zero rótulos de UI em inglês fora da lista do ADR 0003; teste de dicionário com essa lista como única fonte.

### J12. Buscar informação durante uma sessão de jogo

- **Entrada:** Ctrl/Cmd+K, `/`, lupa no celular.
- **Objetivo:** resposta em dois toques.
- **Estado:** boa (520 entradas, categorias, teclado; 2 toques até um resultado).
- **Atritos:** sem tolerância a erro de digitação; busca local de builds concorrente.
- **Resultado:** uma busca só; erro de um caractere tolerado para nomes ≥ 5 letras.
- **Sucesso:** "blizard" encontra Blizzard; campo local removido ou delegando ao índice global.

---

## 6. Requisitos da página de build

### 6.1 Resultado desejado

Ao abrir qualquer build, o jogador vê em uma tela o que a build é e, logo abaixo do título, a pergunta "Onde você está?" com os seis tiers. Sem preferência, os seis tiers aparecem compactos (cabeçalho, faixa de nível, objetivo e uma linha por slot) e nenhum é pré-selecionado: o site não afirma nada sobre o jogador e não esconde nada. Escolher um tier grava a preferência, expande esse tier, atualiza o rótulo ("Meu tier: Econômico") e oferece a ação explícita "Ir para o equipamento". Nada desloca a página sem que o jogador peça. Os seis tiers continuam existindo no HTML, na ordem canônica, para leitura completa e para o leitor sem JavaScript, que os vê todos expandidos.

### 6.2 Alternativas comparadas

| Opção | Como funciona | Prós | Contras | Veredito |
|---|---|---|---|---|
| Tabs | Um tier visível por vez | Menor rolagem | Esconde os outros cinco; "o que consertar em seguida" perde o vizinho; semântica `tablist` mente para um accordion; sem JS precisa de fallback | Rejeitada |
| Seletor segmentado | Controle de seis posições | Compacto; sem JS funciona como seis âncoras | Sozinho não reduz rolagem | Adotado como controle de navegação |
| Accordion (`<details>`) | Todos os tiers no DOM, só o escolhido expandido | Reduz rolagem mantendo tudo; sem JS renderiza tudo aberto; estado nativo acessível | Precisa de resumo por tier fechado para não virar seis cabeçalhos iguais | Adotado como comportamento |
| Tier ativo com comparação adjacente | Tier expandido com marcação de diferença vs. anterior | Entrega "upgrades" sem custo editorial | Precisa de regra de comparação clara | Adotado |
| Navegação sticky | Barra que acompanha a rolagem | Já existe dentro da seção Gear | Custa altura em 320 px | Adotada só a partir de 640 px |
| Todos compactos por padrão | Sem preferência, seis resumos; nenhum pré-selecionado | Maior redução isolada de altura; não presume nem esconde | Primeira leitura completa exige expandir | **Adotado (decisão do proprietário)** |
| Combinação responsiva | Segmentado + accordion + comparação; chips roláveis no celular | Um modelo para todas as larguras | Mais estados a testar | **Recomendação** |

**Rejeitadas:** tabs puras; manter os seis tiers expandidos até a primeira escolha (mantinha 31.939 px em toda primeira visita); pré-selecionar um tier ("Econômico") sem preferência (afirma algo que o site não sabe); auto-scroll ao selecionar ou ao carregar (desorienta e conflita com âncoras).

### 6.3 Requisitos

- **R-BUILD-1 · Seletor de tier (navegação + preferência).** A página deve exibir, imediatamente após o bloco de título (breadcrumb, H1, subtítulo, chips) e antes de "Como se joga", um controle com os seis tiers, cada um com número, nome e faixa de nível. No HTML estático o controle é um grupo de seis links `#gear-<tier>` (navegação). Com JavaScript, o mesmo grupo passa a gravar a preferência (`R-PREF-1`) e a expandir o tier escolhido (`R-BUILD-2`). *Aceite:* o topo do controle fica a ≤ 560 px do topo do documento em 320×640 (teste de viewport, mesmo mecanismo que mede a primeira dobra em `/builds`); em 390, 768 e 1280 px o controle é alcançado em no máximo uma tela de rolagem; na jornada J3, o proprietário encontra o controle sem instrução em telefone e desktop.
- **R-BUILD-2 · Efeito da seleção.** Selecionar um tier deve: gravar `d2rc.tier`; expandir o tier escolhido e compactar os demais; atualizar o rótulo do controle ("Meu tier: Econômico · Níveis 75–85"); e exibir a ação explícita "Ir para o equipamento", que é um link para `#gear-<tier>`. A seleção **não** altera a posição de rolagem. Ao carregar com preferência e sem hash, o tier salvo é o expandido; com hash `#gear-<tier>`, o hash vence (o tier do hash expande) e o único deslocamento é o nativo do navegador para a âncora. *Aceite:* teste headless verifica que `scrollY` não muda ao selecionar; testes de HTML construído para os três casos (sem preferência, com preferência, com hash); "Ir para o equipamento" presente e apontando para o tier ativo.
- **R-BUILD-3 · Estado padrão (com JavaScript ativo).** O HTML base traz os seis tiers como `<details open>` (é o que o leitor sem JavaScript recebe; R-BUILD-12). Com JavaScript ativo e sem preferência, o enhancement remove `open` dos seis e apresenta os tiers compactos (R-BUILD-5), nenhum selecionado, com o controle mostrando "Onde você está?"; com preferência, um tier fica expandido (R-BUILD-2). Nenhum estágio é inferido de nada (nível, URL de origem, idioma) e nenhuma informação fica inacessível: todo tier pode ser expandido pelo `<summary>`. *Aceite (estado com JavaScript ativo, sem preferência, em teste headless):* as seis seções `#gear-*` estão presentes, cada uma como `<details>` sem `open`, com `<summary>` e resumo; a lista ordenada dos textos de `h2`/`h3` da página é igual à atual (snapshot); nenhum `aria-pressed="true"` no controle. O estado do HTML sem scripts é testado por R-BUILD-12, não por este requisito.
- **R-BUILD-4 · Navegação dentro da seção Gear.** A partir de 640 px, o controle é repetido de forma sticky abaixo do header dentro da seção Gear e reflete o tier em foco durante a rolagem; abaixo de 640 px não há barra sticky (os chips roláveis de R-BUILD-9 e o resumo compacto dos tiers cumprem o papel). *Aceite:* rolagem entre tiers adjacentes ≤ 1 tela em 390 px com os demais compactos; nenhum elemento sticky além do header abaixo de 640 px; estado ativo segue a rolagem a partir de 640 px.
  > **Refinamento contratual (proprietário, 2026-09-09, após a Fase 1).** O controle repetido dentro de Gear é um **espelho de navegação**: reflete o tier visível e navega por âncoras, mas **não grava a preferência, não altera `aria-pressed` e não expande nem compacta conteúdo acima da viewport**. Só o controle principal, no topo, grava. O motivo é medido: um controle que grava a meio da página reflui milhares de pixels acima da viewport, e o *scroll anchoring* do navegador então move `scrollY` sozinho — fazendo R-BUILD-2 falhar por comportamento correto do navegador, não por defeito do código. O espelho mantém alvo ≥ 24 px; o controle principal segue os ≥ 44 px de R-A11Y-4. Consequência assumida: a métrica "≤ 2 ações" de §12.2 vale a partir do controle principal.
- **R-BUILD-5 · Tiers compactos.** Um tier compacto é um `<details>` cujo `<summary>` traz número, nome, faixa de nível e objetivo em uma frase, seguido (ainda visível quando fechado) de uma linha por slot com a escolha principal e de "Expandir". Altura alvo ≤ 320 px em 390 px (**hipótese** a medir; baseline por tier expandido: 2.191 a 3.421 px). O conteúdo completo continua no DOM dentro do `<details>`. *Aceite:* medição por teste de viewport de cada um dos seis tiers compactos; sem JS, todos os `<details>` renderizam com `open`; nenhum conteúdo de tier fica fora do DOM.
- **R-BUILD-6 · Comparação adjacente.** No tier expandido, cada slot recebe um marcador derivado por comparação com o tier anterior: **novo** (escolha principal diferente), **mantido** (mesma referência), **alternativa** (a principal anterior aparece como alternativa aqui), **removido** (slot presente antes e ausente agora, listado ao fim). *(Após a Fase 2: "removido" é o **nome do slot** deixar de ter qualquer ocorrência, não uma ocorrência sumir — a diferença é `blade-fury/budget`, o único slot duplicado do catálogo. O bloco é **condicional**: 48 remoções em 30 de 265 renderizações, ausente das outras 235.)* A comparação usa `ref.slug` e, na ausência de `ref`, `label`. *(Corrigido após a Fase 2: a comparação usa `ref.kind + ref.slug`. Resultado idêntico hoje — nenhum slug aparece sob dois `kind` — mas é o que impede a primeira colisão futura.)* O tier Início não tem marcador. *Aceite:* função pura com testes unitários sobre as 53 builds; marcador com texto, não só cor; nenhum marcador em texto livre.
- **R-BUILD-7 · Upgrades.** "O que consertar em seguida" permanece ao fim do tier expandido e é repetido em forma curta no `<summary>` do tier compacto seguinte ("Próximo: Oculus, HotO, Nightwing"). *Aceite:* presente nos seis tiers; texto vem de `nextUpgrade`.
  > **Refinamento contratual (proprietário, 2026-09-10, após a Fase 2).** "Presente nos seis
  > tiers" é **insatisfazível em `bis`**: 45 das 53 builds não têm `nextUpgrade` ali, e as 45
  > lacunas do catálogo são **todas** em `bis`. `bis` é terminal — nunca recebe um "próximo"
  > derivado; onde o texto existe (8 builds, 6 com conselho real), continua a ser renderizado sob
  > a mensagem terminal. A repetição curta vai no bloco de preview, **fora do `<summary>`** (lá
  > viraria o nome acessível da divulgação), e **só no tier compacto seguinte ao expandido** — o
  > que é o que mantém a primeira visita idêntica à Fase 1 ao pixel. E a "forma curta" é o texto
  > completo com `line-clamp-2`: extrair nomes falha em 103 dos 265 textos, e truncar pela
  > primeira oração **inverte o conselho**.
- **R-BUILD-8 · Sumário da página.** Um sumário com as onze seções (e o tier ativo) fica disponível no topo em desktop e como botão "Seções" no celular. *Aceite:* cada seção alcançável em um toque; âncoras existentes preservadas; ao fechar a sheet de seções, o foco volta ao botão.
  > **Refinamento contratual (proprietário, 2026-09-10, após a Fase 2).** Abaixo de 640 px são
  > **dois** toques — abrir a sheet, tocar a entrada — que é o que a decisão do proprietário já
  > prevê ("uma interação **após abrir**"). Na página de classe continua **um**, porque lá o
  > sumário é sempre visível. O foco volta ao `<summary>` em Escape, fundo e no botão de fechar,
  > mas **não** ao ativar uma entrada: o navegador está a saltar para a seção pedida, e puxar o
  > foco de volta desfaria o salto.
- **R-BUILD-9 · Mobile.** Em <640 px o controle vira chips roláveis com fade e o tier ativo centralizado; o sumário vira sheet reutilizando o foco preso e o travamento de rolagem já existentes. *Aceite:* sem overflow; alvos ≥ 24 px (gate existente); Esc e fundo fecham a sheet; foco devolvido ao gatilho.
- **R-BUILD-10 · URLs, HTML estático e estabilidade visual.** As âncoras `#gear-<tier>` continuam válidas e idênticas nos dois idiomas; nenhum parâmetro de query é introduzido para tier; a página continua totalmente estática (`dynamicParams = false`). Ao carregar com preferência, o deslocamento cumulativo de layout (CLS) medido em teste headless é < 0,1, e nenhuma exceção nova é aberta no teste de fronteira cliente/servidor (se um script inline for necessário, ele entra na lista vigiada). O mecanismo (script antes da pintura, classe no `<html>`, ou outro) é hipótese de implementação do plano da fase, não requisito. *Aceite:* CLS < 0,1; teste de fronteira verde sem exceções novas; seis âncoras presentes em EN e PT.
- **R-BUILD-11 · Acessibilidade do controle e dos tiers.** O controle é um grupo de botões (com JS) ou links (sem JS) com `aria-pressed` no tier ativo, navegável por setas; não é `tablist` (os tiers não são painéis mutuamente exclusivos). Os tiers usam `<details>`/`<summary>`, cujo estado expandido é nativo. O marcador de comparação tem texto. Foco visível de 2 px como no resto do site. *Aceite:* teste de a11y construído verifica papéis, `aria-pressed`, nomes e ordem de foco; nenhum `role=tab` na página.
- **R-BUILD-12 · Sem JavaScript (HTML base).** O HTML servido traz os seis tiers como `<details open>` e, sem JS, eles permanecem abertos; o controle funciona como seis âncoras; não existe rótulo "Meu tier" nem promessa de persistência; nada fica inacessível. O estado compacto de R-BUILD-3 é resultado do enhancement, nunca do HTML servido. *Aceite (HTML construído, scripts removidos):* seis `<details open>`, seis âncoras, ausência de texto de preferência.
- **R-BUILD-13 · Links de skill.** Todo nome de skill em "Maximize nestas", "Um ponto cada" e "Pontos restantes" é link para a página da skill; os nós da árvore têm link direto no painel (já existe) e na versão sem JS. *Aceite:* 0 nomes de skill sem link nas 53 builds (teste de HTML construído).
- **R-BUILD-14 · Mercenário.** A seção usa o mesmo componente de referência do resto do site, com nome, qualidade e link, e exibe `why`, como `/mercenaries`. *Aceite:* teste de HTML construído procura por slugs com hífen removido; teste de dados garante que toda referência de mercenário resolve.
- **R-BUILD-15 · Modo de consulta compacto (P2).** Um interruptor "Compacto" (persistido, `d2rc.compact`) oculta a prosa ("Como se joga", parágrafos de "Como chegar lá"), mantém tabelas (skills, atributos, breakpoints, tier ativo, farm) e reduz espaçamentos. Serve à consulta com o jogo aberto. Não está acoplado a impressão: uma folha `@media print`, se um dia existir, é superfície separada e deve expandir os seis tiers (seção 2.4). *Aceite:* altura da build em 390 px com modo compacto e um tier expandido ≤ 60% da altura sem o modo (medida na mesma fase); sem JS o interruptor não existe e nada muda.

### 6.4 Preferências locais (transversal)

- **R-PREF-1 · Chave única de estágio.** Uma única preferência `d2rc.tier` (valores: os seis slugs canônicos de `PROGRESSION_TIERS`) é a fonte de verdade para "Meu tier" na build, "Onde você está" na listagem e nos cartões da home. Gravada em `localStorage`, lida por um único módulo cliente, com leitura protegida e sem efeito quando indisponível. *Aceite:* teste unitário do módulo; teste de fronteira cliente/servidor verde.
- **R-PREF-2 · Sem conta, sem rede.** Nenhuma preferência sai do navegador. *Aceite:* nenhuma chamada de rede originada por preferência (teste de rede em headless).
- **R-PREF-3 · Lista fechada de preferências.** `d2rc.tier`, `d2rc.compact` (booleano), `d2rc.leveling.<classe>` (etapa atual), `d2rc.level` (1–99, opcional; R-TREE-9). Redução de movimento não é preferência do site: usa `prefers-reduced-motion`. Cada preferência tem "limpar" na própria interface onde é gravada. *Aceite:* lista documentada no módulo; teste que falha se uma chave nova não estiver na lista.
- **R-PREF-4 · Contrato sem JavaScript das preferências.** Controles cuja única função é gravar ou refletir uma preferência (segmento "Onde você está" na listagem e na home, "Meu nível", "Compacto", marcação de etapa no leveling) não são renderizados sem JS. Onde o controle também navega (R-BUILD-1), a parte de navegação é renderizada sempre e a de preferência só com JS. *Aceite:* teste de HTML sem scripts: nenhum controle de preferência presente na listagem, na home e no leveling; seis âncoras presentes na build.

---

## 7. Requisitos dos filtros

### 7.1 Modelo de informação

Fonte de verdade única por dimensão:

| Dimensão | Tipo | Onde vive | Afeta contagem de resultados? | Sem JS |
|---|---|---|---|---|
| Classe, tipo de dano, dificuldade, orçamento, "boa para" | Filtro | URL (`?class=…`), como hoje | Sim | Classe: links `?class=`; demais: lista completa no HTML |
| Busca por nome/apelido | Filtro | Delegada ao índice global (`R-FILT-8`) | Sim, se mantida inline | Ausente |
| Ordenação | Visão | URL (`?sort=…`) | Não | Ordem "Recomendado" |
| "Onde você está" (tier) | Preferência (`d2rc.tier`) | `localStorage`; nunca na URL | **Não** | Ausente (R-PREF-4) |

Decisão: a preferência de tier **não filtra** (todas as 53 builds têm os seis tiers), então não altera a contagem nem a URL. Ela (a) disponibiliza a ordenação "Para o meu estágio" sem torná-la padrão, (b) mostra em cada cartão uma linha com os três itens principais do tier salvo, e (c) faz a build abrir com o tier salvo expandido (`R-BUILD-2`). O facet "Orçamento" continua sendo o custo de endgame, explícito e filtrável. Assim não há duas fontes de verdade: filtros na URL, preferência no navegador, ordenação na URL.

### 7.2 Requisitos

- **R-FILT-1 · Classe como controle primário.** Oito chips com glifo de classe e contagem discreta, uma linha em desktop e rolagem horizontal com fade no celular; seleção múltipla; sempre visível (não vai para a sheet). *Aceite:* primeira linha de chips ≤ 120 px abaixo do título em todas as larguras.
- **R-FILT-2 · "Onde você está".** Segmento de seis posições na segunda linha, com o mesmo estilo do controle da build mas o contrato de preferência de `R-PREF-4` (não renderiza sem JS); grava `d2rc.tier`; quando definido, cada cartão mostra "No seu estágio: Spirit · Oculus · Vipermagi" (três primeiras escolhas principais do tier). *Aceite:* linha do cartão derivada de `gearSets[tier].slots[].picks[0]`; sem efeito na contagem; ausente no HTML sem scripts.
  > **Medido na execução (Fase 3, 2026-09-11; decisões do coordenador pendentes de validação do
  > proprietário).** O segmento mostra a **forma curta** dos tiers em todas as larguras (a longa
  > fica no nome acessível e na legenda "Meu estágio: …" assim que há escolha): com as formas longas
  > a linha mede 1.381 px em pt-BR contra 1.216 px disponíveis a 1280, e quebraria em toda tela.
  > A frase que impede a preferência de ser lida como filtro aparece **só depois** de uma escolha.
  > A linha do cartão usa `resolveRef(...).name`, com `label` como recurso, e o segmento é o
  > **terceiro escritor** nominal de `d2rc.tier` (`components/builds/stage-picker.tsx`), sob a
  > mesma regra de resolução única de `lib/prefs.ts`.
  > **Decisão do proprietário D4 (fechamento, 2026-09-11).** Os nomes curtos no controle visual são
  > aceitos. O nome completo **deve** continuar disponível para tecnologia assistiva — hoje está: no
  > `sr-only` de cada chip (o nome acessível é o completo) e, visivelmente, na legenda "Meu estágio:
  > {tier}" assim que há escolha — e onde houver espaço suficiente. Mostrar a forma longa onde ela
  > couber (por medição, não por breakpoint) fica registrado como acompanhamento para a próxima
  > passagem de código sobre a listagem; nesta passagem de fechamento nenhum código mudou.
- **R-FILT-3 · Filtros avançados sob demanda.** Tipo de dano, dificuldade, orçamento e "boa para" ficam atrás de "Mais filtros (N)" (popover no desktop, a sheet atual no celular), com grupos colapsáveis e o primeiro aberto. *Aceite:* zero checkboxes visíveis por padrão fora da sheet/popover; badge com contagem de ativos (já existe).
- **R-FILT-4 · Contagens condicionais e estado vazio (um requisito, porque só fazem sentido juntos).** As contagens de cada opção refletem os outros filtros ativos (AND entre grupos, OR dentro do grupo, a própria opção excluída do cálculo do seu grupo), somando-se à poda de facetas não discriminantes que já existe. Opções com zero resultado ficam desabilitadas e mostram `0` visível (a informação "esta classe não tem build de frio" continua legível). O estado vazio, alcançável só por URL, mantém o texto atual e oferece "Remover último filtro", definido como desfazer a última decisão registrada no histórico (`pushState` de R-FILT-9), e lista até três builds próximas (mesma classe, ignorando o grupo que zerou). O callout "Por que tão poucas builds?" e o título "Classes aguardando" são removidos (D2, D3). *Aceite:* função pura `facetCounts(rows, state)` com testes; nenhuma combinação clicável leva a zero; snapshot do estado vazio; nenhuma seção sem conteúdo.
  > **Medido na execução (Fase 3, 2026-09-11; decisões do coordenador pendentes de validação do
  > proprietário).** "Nenhuma opção habilitada leva a zero" e "uma opção selecionada nunca fica
  > presa" colidem num único caso — `class=necromancer&damage=cold,fire`, com Cold a `0`:
  > desmarcar Fire deixaria só Cold e zeraria. A regra que ficou é pura e testada
  > (`toggleKeepingResults`): remover o **último valor que contribuía** num grupo leva junto os
  > irmãos já exibidos como `0`, e o grupo esvazia; adicionar nunca poda; de um estado já vazio
  > nada é podado. **"Remover último filtro"** desfaz a última decisão registrada **nesta sessão**
  > por este componente (`history.back()`), e só é oferecido quando o topo desse registro produziu
  > a URL atual — sob a regra acima isso só existe de vazio para vazio. Para a chegada por URL, o
  > estado vazio oferece **"Remover {grupo}"**, nomeando o(s) grupo(s) derivado(s) cuja remoção
  > devolve resultados (o primeiro sozinho, na ordem dos grupos, senão cumulativos), e as até
  > três builds próximas **rotuladas com o que ignoram**. Nada remove um parâmetro arbitrário.
- **R-FILT-5 · Ordenação.** Opções: **Recomendado** (padrão sempre; ordem editorial atual, explicada em um `?`: "builds de referência primeiro"), **Para o meu estágio** (disponível só com preferência; nunca padrão; critério editorial publicado com teste e explicado no `?`: para Início/Nightmare/Início do Hell prioriza dificuldade "iniciante" e orçamento baixo; para Econômico prioriza a nota de solo self-found; para Otimizado/BiS prioriza velocidade de limpeza), **Mais fáceis**, **Mais baratas**, **Nome A–Z**. Persistida na URL como `?sort=`. O critério de "Para o meu estágio" é **hipótese** (17.7) validada na sessão do proprietário ao fim da Fase 3. *Aceite:* testes da função de ordenação; `?` presente para Recomendado e Para o meu estágio; ordenação padrão inalterada com preferência definida.
  > **Decisão do proprietário D5 (fechamento, 2026-09-11).** "Para o meu estágio" permanece
  > **hipótese validada provisoriamente**, com o critério publicado em `lib/builds/sort.ts` e no
  > relatório da Fase 3 §5 (estágios iniciais: dificuldade, depois orçamento; Econômico: solo
  > self-found; Otimizado e BiS: velocidade de limpeza; empates na ordem "Recomendado"). O algoritmo
  > não foi alterado no fechamento. Continua a ser validado em sessão de jogo do proprietário.
- **R-FILT-6 · Chips aplicados inline.** Os filtros ativos aparecem como chips com ✕ na própria linha de controles, mais "Limpar tudo" quando ≥ 2 ativos. *Aceite:* linha única; remoção individual mantém o histórico como hoje.
- **R-FILT-7 · (incorporado em R-FILT-4).** Mantido o identificador para rastreabilidade; sem requisito separado. *Aceite:* o de R-FILT-4.
- **R-FILT-8 · Uma busca.** O campo "Nome, classe ou apelido" sai do bloco; a lupa/Ctrl K é a busca. Se for mantido um campo inline, ele deve consultar o mesmo índice e os mesmos apelidos da busca global. *Aceite:* um único índice de busca; teste que falha se houver dois caminhos de busca com resultados diferentes para "hdin".
  > **Decidido na execução (Fase 3, 2026-09-11).** O campo inline **saiu**; `q` deixou de existir
  > no estado e na URL (um `?q=` antigo é parâmetro desconhecido e abre a listagem inteira, sem
  > apagar os válidos). O gate afirma que nenhuma listagem carrega `input[type=search]`, que
  > nenhum componente de listagem importa o pontuador da busca, e que o índice global encontra
  > `hammerdin` para "hdin" — no **segundo** lugar: a substring do nome "FoHdin" pontua acima do
  > apelido. É fato do pontuador (6c), registrado para o proprietário, não desta fase.
  > **Decisão do proprietário D6 (fechamento, 2026-09-11).** "hdin" em segundo lugar é **dívida da
  > Fase 6c** (P2.6), não defeito da Fase 3: o pontuador não muda agora. Dívida registrada em §13 P2.6
  > e na Fase 6c (§14): um apelido exato deve pontuar acima de uma substring casual de outro nome.
- **R-FILT-9 · URL e histórico.** Semântica atual mantida (toggle = `pushState`, digitação = `replaceState` com debounce; parâmetros em inglês nos dois idiomas; parâmetros desconhecidos ignorados). *Aceite:* testes existentes de `filter.ts` continuam verdes; `sort` entra no `parseFilterState`.
- **R-FILT-10 · Persistência.** Nenhum filtro é persistido além da URL. A única persistência é a preferência de tier. *Aceite:* nenhuma chave nova em `localStorage` além das listadas em `R-PREF-3`.
- **R-FILT-11 · Desktop.** Duas linhas de controle (classe; estágio + mais filtros + ordenar + contador); grade começa ≤ 220 px abaixo do título. *Aceite:* medição no teste de viewport em 1280 px.
  > **Medido na execução (Fase 3, 2026-09-11):** +211 px a 1280 nos dois idiomas — cumprido; **a
  > medida de 211 px está aprovada pelo proprietário (2026-09-11), e a 1280 este aceite relativo é o
  > único contrato de posição do primeiro cartão** (§12.2). Para
  > cumprir este aceite e o de R-FILT-1 a **descrição visível saiu do topo de `/builds`** (com ela, a
  > grade ficava além dos 220 a 1280 e os chips além dos 120 a 320). **Decisão do proprietário D3
  > (fechamento, 2026-09-11): retirada aceita.** Confirmado em produção: título "Build guides" /
  > "Guias de build", contador "53 builds" e as duas linhas de controle identificam a função da
  > página; `<title>` "Builds · D2 Codex", `meta description`/`og:description` (o texto original,
  > inalterado), `og:title` e `canonical` absolutos permanecem corretos nos dois idiomas.
- **R-FILT-12 · Bottom sheet mobile.** Preservada como está (rascunho, "Mostrar N builds" ao vivo, foco preso, scroll travado, Esc/fundo cancelam), passando a conter só os filtros avançados. *Aceite:* testes existentes da sheet continuam verdes; contagens condicionais também dentro da sheet.
- **R-FILT-13 · Acessibilidade.** Chips são botões com `aria-pressed`; popover é `role=dialog` não modal com foco gerenciado e Esc; ordenação é `<select>` nativo; contador é `aria-live=polite` (já existe). *Aceite:* teste de a11y construído.
- **R-FILT-14 · Sem JavaScript (proporcional).** Os chips de classe são links para `?class=`; a listagem completa renderiza no servidor (já é assim); os filtros avançados não têm versão sem JS (a lista completa e a busca por classe bastam). *Aceite:* teste de HTML sem scripts consegue filtrar por classe via link; nenhum formulário paralelo.
  > **Medido na execução (Fase 3, 2026-09-11).** Os oito chips estão no HTML servido como
  > `a[data-class][href="/<locale>/builds?class=<slug>"]`, com slugs ingleses nos dois idiomas; com
  > JavaScript viram botões. Sem JavaScript, seguir `?class=sorceress` **não estreita a lista**: um
  > site estático não lê a query, e o gate afirma exatamente isso — a página que se abre carrega
  > todas as builds e os oito links. A listagem estática por classe continua sendo
  > `/classes/<slug>#builds`. Limitação registrada, não silenciada.
  > **Decisão do proprietário D7 (fechamento, 2026-09-11), implementada no produto (commit `c029dbd`).**
  > Sem JavaScript, **os chips de classe levam para `/<locale>/classes/<slug>#builds`**, onde existe a
  > listagem estática daquela classe. O `href` servido de cada chip é esse destino, no idioma da
  > página (`/en-us/…`, `/pt-br/…`); com JavaScript o mesmo `<a>` ganha `role="button"` e
  > `aria-pressed`, e um clique simples é interceptado para alternar a classe na URL da listagem
  > (seleção múltipla, `pushState`, Back/Forward e contagens como antes), enquanto Ctrl/Cmd/Shift/Alt
  > + clique, clique do meio, "abrir em nova aba" e "copiar link" seguem o `href` real. Nenhum
  > formulário paralelo, nenhuma filtragem dinâmica sem JavaScript; a página de classe continua sem
  > chips. *Aceite (substitui "consegue filtrar por classe via link"; a redação intermediária deste
  > fechamento, que documentava `?class=` como href servido, fica substituída por esta):* (1) o HTML
  > construído, sem scripts, contém os oito destinos `/<locale>/classes/<slug>#builds`; (2) cada destino
  > preserva o locale; (3) cada destino termina em `#builds`; (4) a página de classe correspondente
  > carrega `id="builds"`; (5) com JavaScript, o clique simples alterna o filtro sem navegar; (6)
  > Ctrl/Cmd+clique e abertura em nova aba mantêm a semântica nativa do link; (7) Enter e Espaço
  > alternam pelo teclado sem navegar; (8) nenhum link usa `?class=` como fallback. Gates:
  > `test:build-filters-html` (1–4 e 8, mais um clique real sem scripts que aterra na seção da classe
  > com só as builds dela) e `test:filters-desktop` (5–7). Mutations: remover a interceptação (54
  > falhas em `filters-desktop`) e devolver `?class=` ao `href` (17 falhas em `build-filters-html`).
- **R-FILT-15 · Página de classe.** Mesmo padrão, sem chips de classe; "Onde você está" presente; filtros avançados só sob demanda. *Aceite:* primeiro cartão ≤ 260 px abaixo de "Comece por aqui".
  > **Medido na execução (Fase 3, 2026-09-11).** A 768 e 1280 px: 165/153 (en-US) e 193/165
  > (pt-BR) — dentro dos 260. A 320 e 390 px: **394/371 (en-US) e 445/394 (pt-BR)**, e o número
  > não é alcançável por nenhum trabalho de filtro: em uma coluna o cartão de evolução ("Comece
  > por aqui" é a jornada, de propósito, e não é build) fica entre o cabeçalho e o primeiro
  > cartão de build e mede ~166 px sozinho, o que já dá ~238 px sem controle nenhum; a linha de
  > estágio de R-FILT-2 acrescenta 44 px. Mover esse cartão é decisão do proprietário; até lá o
  > gate segura 260 a partir de 768 e um teto de regressão de 468 (pior medição × 1,05) abaixo.
  > **Decisão do proprietário D2 (fechamento, 2026-09-11) — aceite reformulado.** O cartão de
  > evolução vem antes do primeiro cartão de build no celular **por decisão**: é conteúdo contextual
  > deliberado, e o aceite passa a medir a descoberta e o acesso às builds sem exigir a sua remoção.
  > *Aceite (substitui o anterior):* (a) a partir de 640 px, o primeiro cartão de build fica ≤ 260 px
  > abaixo de "Comece por aqui" (medido 165/153 en-US, 193/165 pt-BR); (b) abaixo de 640 px, o
  > cabeçalho "Comece por aqui", o controle de estágio, "Mais filtros", a ordenação, o cartão de
  > evolução e o primeiro cartão de build cabem numa única tela de 844 px a partir do cabeçalho
  > (medido: o primeiro cartão de build a 394/371 en-US e 445/394 pt-BR a 320/390), com o teto de
  > regressão de 468 px preservado no gate; (c) o primeiro cartão de build é sempre o primeiro
  > `a[data-card]` da seção e o cartão de evolução nunca é contado como build. A meta anterior de
  > 260 px em todas as larguras fica registrada acima como substituída.
- **R-FILT-16 · Cartão.** Duas notas por padrão (as duas mais altas, ou as escolhidas em "boa para"), chips de tag como texto discreto em uma linha, linha "No seu estágio" quando houver preferência. Padrão visual alinhado ao cartão de runeword (nome em Cinzel, metadados em texto, uma única borda). *Aceite:* altura do cartão em 390 px ≤ 80% da atual.
  > **Medido na execução (Fase 3, 2026-09-11).** Primeiro cartão a 390 px: **315 → 249 px** (en-US,
  > teto 252) e **386 → 272 px** (pt-BR, teto 309); mediana do catálogo 338 → 272 e 363 → 272.
  > Com "Boa para" ativo o cartão mostra **todos** os eixos escolhidos, na ordem de `RATING_AXES`.
- **R-FILT-17 · Limiar "Boa para" remedido.** Antes da Fase 3, a distribuição das notas das 53 builds nos oito eixos é medida por script a partir de `content/builds/`; a justificativa de `GOOD_AT_THRESHOLD` é reescrita a partir dessa medição; o valor muda apenas se a evidência justificar; e um gate passa a comparar a distribuição documentada com a recomputada, falhando quando o número de builds ou a distribuição mudar sem nova medição. *Aceite:* distribuição publicada (arquivo gerado, não prosa); gate verde; decisão registrada no plano da Fase 0A.

---

## 8. Requisitos da árvore de skills

Direção aprovada: **estrutura fiel ao D2R, com identidade própria do D2R Codex.** A interface original permanece como referência de organização e reconhecimento; nada dela é copiado como asset. O compromisso "árvore em 320 px" depende do protótipo da Fase 0B (R-TREE-0); até a aprovação, os números de largura de nó, vão, altura de fileira e abas são hipóteses.

### 8.1 O que já existe e é preservado

Posições (fileira/coluna) e pré-requisitos gerados dos dados do jogo (`content/classes/skill-graph.ts`, 240 nós, teste de deriva); grade 3×6 com células vazias preservadas a partir de 640 px; conectores em SVG com o caminho selecionado em ember; painel lateral a partir de 1024 px e bottom sheet abaixo (foco preso, scroll travado, retorno de foco); `role=grid` com roving tabindex, invariante "todo nó alcançável só com setas" e funções de navegação testadas; `<noscript>` em lista; um único componente servindo classe e build. Tudo isso é requisito de não regressão.

### 8.2 Protótipo (Fase 0B)

> **Q2 aprovada (proprietário, 2026-09-08) como direção estrutural, com condição de UAT físico.**
> A **variante F** do protótipo ([`prototypes/mobile-skill-tree/`](prototypes/mobile-skill-tree/README.md))
> é a **baseline** da Fase 4. Aprovados: grade 3×6 preservada; **conectores ortogonais**; trilho de
> nível **recuado na calha** do `Container`; **12 px** no estado normal; **uma árvore por aba abaixo
> de 640 px** e **três empilhadas a partir de 640 px**; **uma única legenda compartilhada**, que pode
> ser compacta ou recolhida mas **continua expansível e explica todos os símbolos**; todos os nós
> alcançáveis **apenas por setas**; foco visível; painel ou sheet com detalhes completos; nenhum asset
> do jogo; e ícones próprios para **240/240** skills no futuro (Q1).
>
> O compromisso §1.5 #7 e o objetivo O3 ficam **confirmados**: a árvore continua sendo árvore em
> 320 px, e não precisam ser renegociados.
>
> **A aprovação é da geometria e do comportamento, não da publicação.** A Fase 4 tem um portão de
> UAT físico descrito na própria fase (§14): nenhuma medição headless o substitui. Falhar nesse UAT
> autoriza ajustar dimensão, inset e comportamento **sem reabrir a direção estrutural**.

- **R-TREE-0 · Protótipo mobile aprovado antes de qualquer código de árvore.** Um HTML estático em `docs/` (sem código de produção) com as árvores Cold da Sorceress e Summoning do Necromancer (nomes mais longos: "Raise Skeletal Mage", "Skeleton Mastery", "Raise Skeleton"), em EN e PT, deve responder:
  1. Três colunas cabem nos **280 px** úteis de 320 px (`Container` com `px-5`)?
  2. Como acomodar o trilho de nível de 36 px: suprimido abaixo de 640 px com o nível no cabeçalho de fileira e no `aria-label`, ou mantido com nó mais estreito?
  3. Nomes em inglês (e rótulos de aba em português) continuam legíveis a distância normal de uso, sem zoom?
  4. Conectores permanecem compreensíveis com os vãos escolhidos, ou leem como ruído?
  5. Alvos de toque são adequados nos dois eixos (R-A11Y-4)?
  6. Todos os nós são alcançáveis por teclado com o comportamento de R-TREE-13?
  7. Abas por tree reduzem a altura sem perder contexto (baseline da seção de skills em 320 px: 3.511 px; em 390 px: 3.443 px)?
  8. Zoom de 200% e 400% funciona (reflow sem rolagem horizontal; nome ou alternativa acessível)?
  Mais: estados "bloqueada / disponível / investida / maximizada" distinguíveis a 36 px de ícone sem depender de cor.
  *Aprovação mínima (proprietário, em telefone real, 320 px, nos dois idiomas):* sem overflow involuntário; relações espaciais reconhecíveis (encontra Blizzard e o caminho de pré-requisito em ≤ 5 s sem tocar); nomes ou alternativas acessíveis (lê todos os nomes da árvore Summoning sem zoom, ou o `aria-label`/painel cobre o que truncar); todos os nós alcançáveis por teclado; toca 10 nós consecutivos sem erro de alvo; zero rolagem horizontal a 320 px e a 400%; aprovação visual explícita. Se reprovar, o compromisso 1.5 #7 e O3 são renegociados **antes** da Fase 1, não depois da Fase 4.
  *Saídas do protótipo (viram números de requisito):* largura do nó, vão, altura da fileira, destino do trilho, uso de abas e em que larguras, orçamento de altura por tree.

### 8.3 Requisitos estruturais

- **R-TREE-1 · Três árvores por classe, grade 3×6.** Cada tree renderiza 3 colunas × 6 fileiras (níveis 1/6/12/18/24/30) em **todas** as larguras a partir de 320 px, com as células vazias presentes no DOM **e nomeadas**. Corrigir o `role=grid` inválido de D7 exige as duas coisas: manter a célula vazia no DOM **e remover o `aria-hidden="true"` que hoje a tira da árvore de acessibilidade em qualquer largura, dando-lhe um nome acessível** — a chave `skills.emptyCell` ("No skill" / "Sem skill") já existe nos dois dicionários, sem uso, e é o nome previsto para isso. Só alargar a grade não corrige. O protótipo da Fase 0B.1 demonstrou o resultado: 18 gridcells, 3 por fileira, 8 células vazias nomeadas e nenhuma `aria-hidden`. A colapsagem para uma coluna é removida. Abaixo de 640 px, o trilho de nível é tratado conforme a saída do protótipo (hipótese inicial: suprimido, com o nível no cabeçalho de fileira e no `aria-label`). *Aceite:* teste de viewport em 320, 390, 640, 768, 1024, 1280 px afirma `gridTemplateColumns` com 3 faixas, 18 células por tree e sem overflow.
- **R-TREE-2 · Conectores sempre visíveis.** O SVG de dependências renderiza em todas as larguras, com traço sem escala e caminho do nó selecionado destacado. *Aceite:* SVG com `getClientRects().length > 0` em 320 px.
- **R-TREE-3 · Nó compacto responsivo.** O nó tem ícone, nome e contador de pontos no canto. **Números fixados pelo protótipo (variante F, aprovada em Q2):** em 280 px úteis, **nó de 88 px de largura, vão de 8 px** (3×88 + 2×8 = 280 exatos) e **fileira com piso de 74 px, elástica** — piso, nunca altura fixa, porque fileira fixa corta o nome com texto ampliado. Nome a **12 px** no estado normal. Limites que continuam valendo: nó ≥ 44 px nos dois eixos (F mede 88×74 a 100 % e 74,7×72 no tier de glifo); nome nunca omitido do `aria-label`; se o nome não for desenhado no nó, `title` e o painel carregam o nome completo. *Aceite:* medição em 320 px com estes números; teste de a11y confere `aria-label` = "Nome, nível N, Tree, estado, pontos".
- **R-TREE-4 · Nível necessário e bloqueio.** Cada nó exibe o nível de desbloqueio (pela fileira e no `aria-label`). Quando `d2rc.level` estiver definido (R-TREE-9), nós acima do nível ficam em estado **bloqueada**. *Aceite:* estado derivado de `requiredLevel`; sem `d2rc.level`, nenhum nó bloqueado.
- **R-TREE-5 · Estados visuais.** Quatro estados com forma e texto, não só cor: **bloqueada** (ícone esmaecido, cadeado no canto), **disponível** (moldura padrão), **investida** (moldura ember, contador "N"), **maximizada** (moldura ember cheia, contador "20", marca no canto). Em páginas de build, os papéis atuais (Maximizada/Utilidade/Pré-requisito/Obrigatória) mapeiam para investida/maximizada e continuam no painel. *Aceite:* snapshot de HTML por estado; contraste ≥ 4,5:1 para texto e ≥ 3:1 para a moldura (gate existente).
- **R-TREE-6 · Contador de pontos.** No canto de cada nó, os pontos-base; no cabeçalho de cada tree, "N de M pontos nesta árvore"; no cabeçalho da seção, o total (já existe "88 de 110"). Bônus de +skills aparece como "20 (+5)" apenas no painel, e apenas quando a build declarar bônus; caso contrário o site continua tratando só pontos-base, com a nota atual "Somente pontos duros". *Aceite:* somas conferem com `SkillAllocation` (teste de dados).
- **R-TREE-7 · Pré-requisitos e sinergias no painel.** O painel/sheet mostra: descrição, nível, pré-requisitos (links), desbloqueia (links), sinergias recebidas e dadas (links), pontos nesta build e link "Ver página completa". *Aceite:* mesmo conteúdo da página de skill em forma resumida; todos os nomes são links.
- **R-TREE-8 · Abas por tree no celular (confirmado em Q2).** Abaixo de 640 px a seção mostra um controle com as três trees e renderiza **uma por vez**; a partir de 640 px, as três **empilhadas** (tablet mantém visão completa). As trees não ativas ficam fora da árvore de acessibilidade e do Tab (`hidden`, não `aria-hidden` isolado). **Legenda: uma só, compartilhada pela seção** — nunca uma por tree. Pode iniciar compacta ou recolhida, mas **continua expansível e explica todos os símbolos**. Baseline: 3.511 px de seção em 320 px. **Orçamento aprovado: ≤ 900 px por seção com uma tree em 320 px** (F mede 829,5 px na Cold e 877,7 px na Summoning, com a grade em 484 px). *Aceite:* troca de tree sem navegação e com foco preservado; nenhum elemento focável dentro de tree inativa; uma única legenda por seção, expansível e completa; sem JS, as três renderizam empilhadas; altura por tree dentro do orçamento.
- **R-TREE-9 · Nível de personagem (opcional).** Um campo "Meu nível" (1–99, `d2rc.level`, R-PREF-3/4) que só marca bloqueio; sem valor, nada fica bloqueado. *Aceite:* não altera nenhum dado; testes por estado; ausente sem JS.
- **R-TREE-10 · Uso em build e leveling.** Na build, o componente recebe alocações (já faz). No leveling, cada etapa pode renderizar a árvore da tree relevante com os pontos daquela etapa (dados já existem em `skillPoints`), em modo compacto (P3). *Aceite:* pelo menos a jornada da Sorceress renderiza a árvore por etapa sem custo editorial novo.

### 8.4 Interação

- **R-TREE-11 · Hover no desktop.** Com `(hover: hover)`, hover mostra o painel em modo prévia sem mudar a seleção (já existe); o caminho de pré-requisito acende no hover. *Aceite:* sem hover em touch (gate `matchMedia`).
- **R-TREE-12 · Toque e clique.** Toque seleciona e abre o sheet (<1024 px) ou atualiza o painel; segundo toque no mesmo nó não fecha; fechar pelo botão, Esc ou fundo. *Aceite:* gate de alvo de toque com os números aprovados no protótipo.
- **R-TREE-13 · Teclado.** Todos os nós de cada tree são alcançáveis a partir do primeiro usando apenas setas (invariante atual, preservado); o movimento é espacialmente previsível: esquerda/direita percorrem a fileira, cima/baixo percorrem a coluna, pulando células vazias; quando não há nó na direção exata, o fallback é definido e documentado (próximo nó na mesma direção na fileira/coluna vizinha mais próxima, e continuação para a fileira vizinha na borda, para não romper a alcançabilidade); Home/End vão ao primeiro/último nó ocupado; Enter/Espaço abre; Esc fecha e devolve o foco; Tab sai da tree. *Aceite:* teste que, para as 24 árvores das 8 classes, todo nó é alcançável a partir do primeiro só com setas, Home e End; casos de previsibilidade em pelo menos três classes (Sorceress, Necromancer, Warlock), incluindo "Ice Blast → baixo = Glacial Spike" e o fallback documentado para "Ice Blast → direita".
- **R-TREE-14 · Leitor de tela.** `role=grid` mantido; cada célula anuncia nome, nível, tree, estado e pontos; conectores são decorativos (`aria-hidden`); o painel é `role=region` com nome; `aria-live=polite` só na seleção confirmada (Enter/Espaço/clique), nunca na mudança de foco; o sheet é `role=dialog`. *Aceite:* teste de composição de `aria-label` estendido aos estados; teste de que mover o foco não altera a região `aria-live`.
- **R-TREE-15 · Zoom, reflow e texto ampliado.** Em 320 px CSS efetivos (equivalente a 400 % de zoom em 1280 px, critério WCAG 1.4.10) a grade continua 3×6 sem rolagem horizontal. Para **texto ampliado** (corpo escalado, que é diferente de zoom de página), vale a **estratégia B, aprovada em Q2**: preservar grade, posições, conectores, pontos e estados, e **substituir o nome dentro do nó por ícone/glifo quando ele não couber de forma legível**. Regras invariantes: **nunca partir palavras em fragmentos de uma ou duas letras**; `aria-label` e `title` mantêm o nome completo **sempre**, inclusive no modo glifo; **foco ou seleção mostra imediatamente o nome completo**; o painel/sheet contém todos os detalhes; a árvore nunca vira lista. **A troca para o modo glifo deve ser determinada por capacidade real de layout, não por um breakpoint arbitrário sem teste** — o limiar de 13em do protótipo é uma medição, não um contrato. A alternativa de fazer a fileira crescer indefinidamente com o nome a 12 px ("estratégia A") está **rejeitada**: medida a 200 % ela parte 3 nomes onde a variante E a 11 px partia 2. *Aceite:* teste de viewport em 320 px; a 200 % de texto, **zero palavras partidas e zero fragmentos de ≤ 2 letras**; `aria-label` e `title` com o nome completo em ambos os tiers; foco revela o nome.
- **R-TREE-16 · Sem JavaScript.** A grade 3×6, os conectores e os nós são HTML/SVG estático com links; apenas seleção, painel, estados dependentes de preferência e abas dependem de JS. *Aceite:* teste de HTML sem scripts encontra a grade e 30 links por classe.
- **R-TREE-17 · Desempenho (resultado, não mecanismo).** A página de classe não pode ficar perceptivelmente mais lenta: o HTML por página de classe permanece dentro do teto proposto pelo spike da Fase 0B (saída declarada de R-TREE-19: número, baseline de 312 KB decodificados, método de medição e justificativa), sem imagens raster que impeçam recolorir por CSS e sem aumento do JS de cliente além do necessário para estados. Sprite SVG, `<symbol>/<use>`, teto por classe e formato de arquivo são hipóteses do spike. *Aceite:* medição do HTML por página de classe, pelo método declarado no spike, ≤ teto aprovado; ícones tematizáveis por CSS (cor do elemento e estados) em teste de contraste.

### 8.5 Ícones: proveniência, licença e cobertura

> **Q1 decidida (proprietário, 2026-09-08): opção (A), conjunto próprio completo.** Os 240 ícones
> serão desenhados para o D2R Codex, com identidade própria. Nenhum conjunto externo é adotado.
> Base da decisão: o spike ([`spikes/2026-09-08-skill-icon-assets.md`](spikes/2026-09-08-skill-icon-assets.md))
> mediu que o melhor candidato externo cobre **47,7 %** das skills sem mapeamento forçado, com
> lacunas concentradas nas auras do Paladin; completar as lacunas com desenho próprio produziria
> duas mãos visuais na mesma grade, que é exatamente a opção (C) já recusada. Consequências
> registradas: **cobertura final obrigatória de 240/240**; **nenhuma mistura progressiva no
> resultado final** (a troca é completa, de uma vez); os **placeholders atuais podem continuar até
> a substituição completa**; **nenhum asset do jogo em nenhuma hipótese**. A **Fase 5 continua não
> iniciada** e a produção dos ícones exige **plano próprio posterior** — decidir a origem não
> autoriza começar a desenhar.

- **R-TREE-18 · Um ícone por skill, cobertura completa e consistente.** 240 ícones, um por skill, com uma única mão visual. Nenhum subconjunto ("30 skills", "53 principais") é aprovado como cobertura final; até a troca completa, o sigilo atual por tipo+elemento continua como placeholder declarado. A troca para o conjunto final é completa, de uma vez, nunca progressiva. *Aceite:* manifesto `skill → ícone` com `origin` (`own` | `licensed` | `placeholder`), `license` e `author` quando `licensed`; teste que lista skills em `placeholder` (permitido até a Fase 5; bloqueante ao fim dela); atribuições geradas do manifesto na página de fontes.
- **R-TREE-19 · Spike de assets (Fase 0B) e matriz.** *Cumprido em 2026-09-08; relatório, matriz e artefato lado a lado em [`spikes/`](spikes/2026-09-08-skill-icon-assets.md). O teto de HTML por página de classe que ele entrega é **368.640 bytes (360 KiB)** por documento, valendo para os 16 documentos de página de classe, e é o número que R-TREE-17 cita.* Antes de decidir a origem dos ícones, um spike deve determinar: número total de skills exibidas (240, mais eventuais variantes); cobertura por classe; cobertura do(s) conjunto(s) candidato(s) skill a skill; licença e atribuição; lacunas; consistência visual (uma mão só?); formatos e custo de tematização por CSS; custo de produzir um conjunto próprio completo. A decisão (Q1) é do proprietário, informada por um artefato lado a lado (por exemplo, as 30 skills da Sorceress e as 30 do Necromancer mapeadas contra o candidato).

| Categoria | Exemplos | Pode usar? | Condição |
|---|---|---|---|
| Assets originais do projeto | SVGs desenhados para o Codex, sigilos atuais | Sim | Fonte no repositório, autoria registrada |
| Assets sob licença livre com atribuição | Conjuntos CC BY | Sim, após o spike confirmar cobertura e licença | Licença e autor registrados por ícone; atribuição na página de fontes; sem ícones que reproduzam a arte da Blizzard |
| Assets de domínio público / CC0 | Ícones CC0 | Sim, após o spike | Registro de origem |
| Assets que exigem confirmação de licença | Conjuntos "livres" sem licença explícita, ícones de fóruns | Não até confirmar | Se a licença não for localizada, não usar |
| Assets do jogo ou derivados | Ícones, molduras, fundos, fontes, sprites extraídos do D2/D2R, recolorizações, traçados vetoriais por cima da arte | **Nunca** | Direito autoral e trade dress da Blizzard; a licença de uso pessoal do Legal FAQ é revogável e não cobre este site |
| Placeholders temporários | Sigilo por tipo+elemento (atual) | Sim | Só até a troca completa; listado pelo teste |

Critérios para **não** usar um asset: origem desconhecida; licença não localizada ou incompatível com uso público; semelhança que possa ser confundida com a arte oficial; dependência de um serviço externo em tempo de execução; quebra da mão visual única.

*Saídas declaradas do spike (consumidas por R-TREE-17, R-TREE-18 e pelo aceite da Fase 4):*
- cobertura por candidato, licença, atribuição, lacunas, consistência e custo de conjunto próprio (as oito respostas acima), com o artefato lado a lado;
- **proposta de teto de HTML por página de classe**, acompanhada de: baseline utilizado (312 KB decodificados em `/en-us/classes/sorceress`, medido em 2026-09-07; remedido no spike com a mesma unidade), método de medição (tamanho do documento HTML construído por página de classe, decodificado, medido pelo mesmo script que alimentará o gate), justificativa do teto (custo estimado dos 30 ícones por classe no formato proposto mais margem, comparado ao baseline), e o número e a unidade em forma diretamente consumível pelo gate de R-TREE-17. O spike propõe o orçamento; não implementa otimização nem código de produção.

*Aceite de R-TREE-19:* relatório do spike em `docs/` com as oito respostas, o artefato lado a lado e a proposta de teto com baseline, método e justificativa; Q1 respondida antes do início da Fase 5; R-TREE-17 e a Fase 4 citam esse teto pelo número.

### 8.6 Alternativas para mobile (comparadas)

| Alternativa | Prós | Contras | Veredito |
|---|---|---|---|
| Árvore reduzida responsiva (nó compacto, 3 colunas em 280 px) | Preserva posição e conectores; sem gesto novo; compatível com no-JS | Nome pequeno; ícone é o que salva a leitura | **Ponto de partida do protótipo** |
| Viewport horizontal controlado (grade em largura fixa com rolagem lateral) | Nó grande | Rolagem lateral em página vertical é frágil; esconde metade da árvore | Rejeitada |
| Zoom/pan acessível | Fidelidade de tamanho | Gestos conflitam com rolagem; difícil no teclado; custo alto | Rejeitada |
| Visão geral + detalhe (miniatura + zona ampliada) | Elegante | Dois estados a manter; ainda não cabe sem nó compacto | Rejeitada como base; pode ser adorno futuro |
| Árvore por aba | Corta a altura em 3 | Sozinha não resolve a largura | **Ponto de partida como complemento** (R-TREE-8) |

Nenhuma alternativa que transforme a árvore em lista é aceita.

---

## 9. Conteúdo e correções editoriais

### 9.1 Correções rápidas (Fase 0A)

| Item | Defeito | Correção | Aceite |
|---|---|---|---|
| E1 | D1 nota de cobertura em `/classes` | Derivar a nota dos dados (classes com builds, com leveling, com skills) ou remover; se derivada, o texto é gerado por contagem, nunca escrito à mão | Teste de conteúdo falha se qualquer string do dicionário contiver contagens ou nomes de classe como "cobertura" |
| E2 | D2 título órfão | Guarda `.length > 0` como em `leveling/page.tsx:146` | Teste de HTML construído: nenhuma `<Section>` sem filhos |
| E3 | D3 "Por que tão poucas builds?" | Remover o callout e as chaves `whyFewTitle/whyFewBody` | Chaves ausentes nos dois dicionários |
| E4 | D4 slugs do mercenário | Componente de referência + `why` | Teste de HTML procura `[a-z]+ [a-z]+` em `.font-medium` da seção; teste de dados resolve todas as refs |
| E5 | D6 skills sem link | Linkar nomes nas tabelas de skills da build | 0 nomes de skill sem link (teste) |
| E6a | D10 strings e contagens correntes erradas | Remover `hideFilters`; corrigir "1004" em `layout.tsx:79` e `mobile-navigation.tsx:25` (derivar do sitemap onde exibido); corrigir "one of only two client components" em `search-dialog.tsx:18` e frases equivalentes em README | `grep` no teste de higiene |
| E6b | não mexer | "1009" em `not-found.tsx:36` e `not-found.test.ts:25` é medição histórica; o `<details>` do menu é decisão vigente. Registrado aqui para que ninguém "corrija" | Nota no plano da fase |
| E7 | D11 SVGs órfãos e rotas fabricadas | Remover os cinco SVGs; `resolveRef` não produz href para kinds sem rota e o componente de referência renderiza texto sem link | Teste que falha se `resolveRef` produzir href para rota inexistente |
| E8 | D12 rótulos pt-BR | Traduzir só as chaves listadas em D12; a lista de termos mantidos vive uma única vez no ADR 0003 e é a referência do teste; `resultsOne/Many`, `effectChance`, `effectMana` não mudam | Teste de dicionário com a lista do ADR 0003 como única fonte |
| E9 | D14 limiar "Boa para" | R-FILT-17: medir a distribuição sobre 53 builds, documentar, mudar só com evidência, criar gate contra nova defasagem | Distribuição gerada e gate verde |

### 9.2 Fluxo editorial contínuo (sem posição no roadmap; não bloqueia UX)

- Aprofundar as builds com menos de 10 alternativas na seção Gear (Tesladin, Melee Sorceress, Freezing Arrow, Holy Fire, Poison Javelin, Exploding Arrow, Zealot, Smiter, Avenger) e os tiers Início de Paladin/Sorceress/Amazon (4–5 slots contra 10 em Barbarian/Assassin). Ritmo sugerido: uma build por semana. Não é questão do proprietário; é rotina.
- Página "O que mudou no 3.3" consolidando as mudanças já citadas espalhadas (P3).

### 9.3 Mudanças estruturais de conteúdo (Fase 6c)

- Página de skill com dano por nível 1–30 e anterior/próximo na tree (dados já no grafo).

---

## 10. Requisitos bilíngues

- **R-I18N-1 · Paridade funcional.** Todo controle novo (seletor de tier, chips, ordenação, sheet, árvore) existe nos dois idiomas com as mesmas capacidades. *Aceite:* testes de HTML construído rodam nas duas rotas.
- **R-I18N-2 · Paridade estrutural.** Mesmas seções, mesma ordem, mesmas âncoras (`#gear-budget` é igual nos dois idiomas); slugs e parâmetros de URL em inglês. *Aceite:* comparação de esqueleto de headings entre `/en-us/x` e `/pt-br/x` no teste de crawl.
- **R-I18N-3 · Nada de slug como texto.** Nenhuma superfície renderiza `slug` ou `slug.replace`; toda referência passa por `resolveRef` e um componente de link. *Aceite:* teste de higiene proíbe `.slug.replace(` e `.slug}` em JSX de apresentação.
- **R-I18N-4 · Rótulos responsivos.** Rótulos que encurtam em larguras estreitas (tiers no chip, "Mais filtros", abas de tree) têm forma curta e longa nos dois dicionários, e a forma longa vai para `aria-label`. *Aceite:* chaves `*.short` pareadas; teste de dicionário.
- **R-I18N-5 · Pluralização.** Contagens usam formas singular/plural nos dois idiomas; "1 build" / "2 builds" em ambos porque "build" é termo mantido (as chaves `resultsOne/Many` já estão corretas). *Aceite:* teste de dicionário com exemplos 0/1/2.
- **R-I18N-6 · Nomes oficiais vs. traduções.** Mantém ADR 0003: skills, itens, runewords, áreas, classes, dificuldades e termos de comunidade em inglês; rótulos de interface, slots de equipamento e categorias em português. A lista canônica de termos invariantes vive **uma única vez**, em `docs/adr/0003`, e é lida pelo teste. *Aceite:* o teste de dicionário compara chaves idênticas EN/PT contra a lista do ADR 0003 e falha para novas coincidências.
- **R-I18N-7 · Alternância preservando contexto.** Continua preservando rota e query; passa a preservar hash (`#gear-budget`); a preferência de tier é por navegador, não por idioma. *Aceite:* teste do `locale-switcher` com hash.
- **R-I18N-8 · Critérios de revisão.** Toda mudança de dicionário entra com os dois idiomas no mesmo commit; toda build ou skill nova entra com overlay pt-BR; `check:content` continua bloqueante; o proprietário lê a página pt-BR em 390 px antes de fechar a fase. *Aceite:* nenhum commit de fase altera `en-us.ts` sem alterar `pt-br.ts` (verificado no `git log` da fase); `check:content` e o teste de dicionário verdes; o plano de cada fase tem um item de checklist "leitura pt-BR em 390 px" marcado antes do fechamento.

---

## 11. Acessibilidade e responsividade

- **R-A11Y-1 · Teclado.** Todo controle interativo é alcançável por Tab na ordem visual e operável por Enter/Espaço; setas para grupos compostos (segmentado, grade). *Gate:* teste de a11y construído lista elementos interativos sem `tabindex` válido.
- **R-A11Y-2 · Foco.** Anel de 2 px `ember` com offset, em todos os controles novos; foco devolvido ao gatilho ao fechar sheet/popover. *Gate:* teste de sheet existente estendido.
- **R-A11Y-3 · Leitor de tela.** Nomes acessíveis compostos (nó da árvore, chip, tier); `aria-live=polite` para contadores e seleção confirmada; `aria-pressed`/`aria-expanded` corretos; nenhum `role=tab` onde não há painéis exclusivos. *Gate:* teste de composição de `aria-label`.
- **R-A11Y-4 · Touch.** Alvos ≥ 24×24 px (mínimo, gate existente) e ≥ 44 px nos dois eixos para controles primários (chips de classe, seletor de tier, nós da árvore). A tensão entre altura da fileira e alvo de 44 px é resolvida no protótipo (R-TREE-0). *Gate:* viewport test.
- **R-A11Y-5 · Contraste.** Texto ≥ 4,5:1, texto grande e bordas de estado ≥ 3:1; estados nunca só por cor. *Gate:* `scripts/contrast.test.ts` estendido aos tokens novos.
- **R-A11Y-6 · Redução de movimento.** Transições de tier, sheet e caminho da árvore respeitam `prefers-reduced-motion` (sem animação, só troca de estado). *Gate:* verificação de presença (o teste procura a media query junto de cada transição declarada; não verifica o conteúdo da regra).
- **R-A11Y-7 · Zoom 200%.** Nenhum overflow horizontal e nenhum conteúdo cortado em 1280 px com zoom 200% (equivalente a 640 px). *Gate:* viewport test em 640 px.
- **R-A11Y-8 · 320 px e orçamento vertical.** Nenhuma página com overflow; árvore 3×6; header intacto (57 px; orçamento de ~22 px registrado na memória do projeto). Abaixo de 640 px nenhum elemento sticky além do header; se um dia houver, header + sticky ≤ 112 px. *Gate:* viewport test existente + casos novos.
- **R-A11Y-9 · Modais e sheets.** `role=dialog aria-modal`, foco preso, scroll travado com contagem, Esc e fundo fecham, foco devolvido; reutilizar os utilitários existentes. *Gate:* testes existentes reutilizados para cada sheet nova.
- **R-A11Y-10 · Hover com alternativa.** Toda informação exibida por hover existe por clique/toque e por teclado. *Gate:* revisão por checklist na fase; teste de `matchMedia`.
- **R-A11Y-11 · Árvores complexas.** `role=grid` válido (fileiras de mesma largura), roving tabindex, alcançabilidade total por setas, SSR com links. *Gate:* `test:nav`, `test:tree`, `test:a11y`.
- **R-A11Y-12 · Progressive enhancement proporcional.** Toda página renderiza conteúdo completo sem JS; controles de preferência só aparecem com JS (R-PREF-4); navegação por âncora e filtro por classe funcionam como links; nenhuma implementação paralela para o leitor sem JS além disso. *Gate:* teste de HTML sem scripts por página-tipo.

---

## 12. Métricas de sucesso

Métricas de qualidade, medidas pelos gates ou por sessão de teste do proprietário. Sem analytics. Baselines: auditoria (2026-09-07) e revisão (2026-09-08), em produção, `/en-us/builds/sorceress/blizzard-sorceress` e `/en-us/classes/sorceress`.

### 12.1 Página de build (390×844)

| Bloco | Baseline | Fase 1 (tiers compactos, sem preferência) | Fase 1 (um tier expandido, pior caso Budget) | Transversal (**sem preferência**, seis tiers compactos, após as reduções das Fases 1, 4 e 6d, com modo compacto ativo) |
|---|---|---|---|---|
| Página inteira | 31.939 px | ≈ 17.500 px (31.939 − 16.315 + 6 × 320 = 17.544) | ≤ 21.000 px (31.939 − 16.315 + 5 × 320 + 3.355 = 20.579) | ≤ 12.000 px, condicionado: Fase 4 reduz Skills (5.912 → orçamento do protótipo, hipótese ≈ 2.100) e o modo compacto (6d) remove a prosa (≈ 2.440); sem modo compacto a expectativa é ≈ 13.700 px. **Não se aplica ao estado com um tier expandido**, que soma o tier ativo (2.191–3.421 px) a esses valores |
| Seção Gear | 16.315 px | ≤ 1.920 px (6 × 320) | ≤ 4.955 px | idem |
| Tier expandido | 2.191 / 2.434 / 2.226 / 3.355 / 3.421 / 2.688 px | — | inalterado | inalterado |
| Tier compacto | — | ≤ 320 px cada (hipótese; medir os seis) | idem | idem |
| Seção Skills | 5.912 px | inalterada | inalterada | orçamento do protótipo |
| Prosa de topo | 2.440 px | inalterada | inalterada | oculta no modo compacto |

Os 320 px por tier compacto são hipótese; se a medição da Fase 1 der outro número, a meta de página é recalculada com a mesma aritmética, escrita no plano da fase.

### 12.2 Demais métricas

| Métrica | Baseline | Meta | Como medir |
|---|---|---|---|
| Ações para chegar ao equipamento do tier desejado | Sem controle: só rolagem (Gear começa em ≈ 11.416 px em 390 px: 27.731 − 16.315) | ≤ 2 ações (selecionar tier → "Ir para o equipamento"), ou 1 com preferência gravada | Teste headless conta cliques |
| Deslocamento automático ao selecionar tier | n/a | 0 px | Teste headless compara `scrollY` |
| Distância de rolagem entre tiers adjacentes | ≈ 2.191–3.421 px por tier em 390 px | ≤ 1 tela com os demais compactos | Viewport test |
| Tempo para localizar o equipamento do próprio tier (sessão do proprietário) | Não medido | ≤ 10 s em telefone, sem instrução | Sessão J3/J4 |
| Px até o primeiro cartão em `/builds` | 490 (320 px), 442 (390), 771 (768), ≈ 640 (1280) | ≤ 300 / ≤ 300 / ≤ 360 / ≤ 220 | Viewport test |
| *↳ medido após a Fase 3 (2026-09-11, `7ba8a05`, topo do documento → topo do primeiro cartão)* | 490/443/772/644 (en) · 519/472/847/703 (pt) | **401/401/428/336 (en) · 401/401/456/336 (pt)** — **nenhuma das quatro metas absolutas é atingida** *(errata do fechamento: a redação anterior desta célula dizia "só 1280 e 768 (en) abaixo da meta", o que é falso — 428 > 360 e 336 > 220)*; a 320/390 o cabeçalho (57) + `py-10` + eyebrow + título terminam em 216 px e R-FILT-2 acrescenta 44 px de linha de estágio, logo 300 exigiria remover o eyebrow ou a linha: decisão do proprietário | `test:filters-fold` (teto de regressão = medido × 1,05; a meta do PRD é impressa ao lado) |
| *↳ **decisão do proprietário D1 (fechamento, 2026-09-11)*** | — | **A meta absoluta em 320 e 390 px passa a ser ≤ 420 px** (medido 401; a meta anterior de 300 fica registrada acima como substituída). Na primeira redação deste fechamento, 768 e 1280 ficaram sem decisão e o gate guardava tetos medidos (422/422/479/353) com o rótulo "PRD target 300" — ambos substituídos pela linha seguinte | — |
| *↳ **contratos definitivos (proprietário, 2026-09-11, segunda passagem de fechamento)*** | — | **320 e 390 px: primeiro cartão ≤ 420 px** (medido 401/401). **768 px: ≤ 480 px** (medido 428 en / 456 pt). **1280 px: o contrato é exclusivamente relativo** — início da grade ≤ 220 px após o título (R-FILT-11); **a medida atual de 211 px está aprovada** e nenhum número absoluto é exigido nessa largura (medido 336, só como registro). As metas anteriores (300/300/360/220) ficam nesta tabela como **substituídas por decisão**, não como pendências | `test:filters-fold` (`FIRST_CARD_CEILING` 420/420/480; a 1280 só o aceite relativo de R-FILT-11; nenhum rótulo de meta substituída) |
| Combinações de filtro vazias clicáveis | Todas (contagens globais) | 0 | Teste de `facetCounts` |
| Limiar "Boa para" | Justificado sobre 29 builds | Justificado sobre 53, com gate | R-FILT-17 |
| Tempo para identificar uma skill na árvore (320 px) | Não medível: árvore é lista | ≤ 5 s para achar Blizzard e seu caminho | Protótipo + sessão |
| Altura da seção de skills na classe (320 px) | 3.511 px | Orçamento aprovado no protótipo | Viewport test |
| Tarefas concluídas em sessão (J1–J12) | Não medido | 12/12 em desktop e celular, nos dois idiomas | Checklist ao fim das Fases 3 e 5 |
| Páginas sem overflow em 320 px | 100% (gate) | 100% | `test:viewport` |
| Cobertura bilíngue | Nenhuma chave faltante; 53/53 overlays; chaves idênticas EN/PT fora da lista do ADR: as de D12 | Predicados: nenhuma faltante; nenhuma idêntica fora da lista | `check:content`, teste de dicionário |
| Afirmações estáticas sobre o próprio site | 4 (D1, D2, D3, D14) | 0 | Testes de conteúdo e gate do limiar |
| Referências cruzadas sem link | Mercenário em 53 builds; skills nas tabelas | 0 | Teste de HTML construído |
| Alcançabilidade por teclado na árvore | Garantida hoje (vizinho mais próximo) | Garantida com navegação previsível, 24/24 árvores | `test:nav` |
| Regressões detectadas automaticamente | ~45 scripts; nenhum mede altura de primeira dobra, altura de tier ou estados da árvore | +1 gate por fase (O7) | Lista na fase |
| HTML por página de classe | 312 KB decodificados | ≤ teto do spike 0B | Medição no build |

Estado atual que não é métrica (registrado em 2.1): busca chega a um resultado em 2 toques.

---

## 13. Priorização

Reavaliada após a revisão independente. Regras: remover o resolvido; não promover preferência visual a P0; separar correção comprovada de redesenho; produto pessoal; minimizar manutenção futura.

### P0 — contradizem o site ou bloqueiam uma fase

**P0.1 Notas de cobertura e listagem (D1, D2, D3)**
- Problema: o site afirma sobre si mesmo coisas falsas na primeira página de decisão e na listagem principal.
- Evidência: textos capturados em EN e PT; `builds/page.tsx:117-137`; dicionários.
- Requisitos: E1, E2, E3, R-FILT-4, R-I18N-6.
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

**P0.3 Limiar "Boa para" remedido (D14)**
- Problema: a evidência que sustenta `GOOD_AT_THRESHOLD = 4` foi medida sobre 29 builds; há 53. R-FILT-4 e R-FILT-5 dependem dele.
- Evidência: `lib/builds/filter.ts:86-95`.
- Requisitos: E9, R-FILT-17.
- Impacto: alto (bloqueia a Fase 3 e é uma afirmação sobre os dados escrita à mão). Esforço: pequeno (script sobre `content/builds/`). Risco: o limiar pode mudar e alterar as facetas. Dependências: nenhuma.
- Aceite: distribuição gerada; decisão registrada; gate que falha em nova defasagem.
- Testes: gate de distribuição.

**P0.4 Protótipo da árvore mobile (R-TREE-0)**
- Problema: a hipótese mais cara do documento (nó compacto legível em 280 px com trilho, abas e conectores) sustenta um princípio (1.5 #7) e um objetivo (O3), e três fases dependem dela.
- Evidência: 3.511 px de seção em 320 px; 280 px úteis; trilho de 36 px; fileira de 88 px hoje.
- Requisitos: R-TREE-0.
- Impacto: alto. Esforço: pequeno (HTML estático em `docs/`). Risco: reprovar e obrigar a renegociar 1.5 #7. Dependências: nenhuma.
- Aceite: critérios de R-TREE-0; aprovação do proprietário (Q2).
- Testes: nenhum de produção; medições registradas no relatório do protótipo.

**P0.5 Spike de assets de ícones (R-TREE-19)**
- Problema: a origem e a cobertura dos 240 ícones não são conhecidas; consistência completa é a exigência.
- Requisitos: R-TREE-18, R-TREE-19.
- Impacto: define a Fase 5. Esforço: pequeno/médio (mapeamento de duas classes contra candidatos). Risco: nenhum candidato cobrir 240 com uma mão só, o que leva a conjunto próprio. Dependências: nenhuma.
- Aceite: relatório do spike com as oito respostas, o artefato e a proposta de teto de HTML por página de classe (baseline, método, justificativa); Q1 respondível.

### P1 — maior impacto

**P1.1 Tiers compactos e preferência "Meu tier"** — R-BUILD-1…5, 9–12; R-PREF-1…4. Evidência: 12.1. Esforço: médio. Risco: CLS ao aplicar preferência (R-BUILD-10); hipótese dos 320 px por tier. Dependências: Fase 0A. Aceite: 12.1 coluna "Fase 1"; ≤ 2 ações; 0 px de deslocamento automático; topo do controle ≤ 560 px em 320×640. Testes: viewport (altura por tier e da página), HTML sem scripts, snapshot por estado, CLS headless, `scrollY` na seleção.

**P1.2 Comparação adjacente, upgrades e sumário** — R-BUILD-6, 7, 8. Esforço: pequeno/médio. Risco: regra de comparação mal calibrada (mitigado por testes sobre as 53 builds). Dependências: P1.1. Aceite: marcador em todos os slots; sumário em um toque.

**P1.3 Descoberta e orientação** — `R-NAV-1…4` (seção 13.1). Esforço: pequeno. Dependências: R-PREF-1. Aceite: por requisito.

**P1.4 Redesign dos filtros** — R-FILT-1…17 (sem formulário GET). Evidência: 490/770 px até o primeiro cartão; contagens estáticas. Esforço: médio. Risco: regressão na sheet (mitigado por reutilização e testes existentes). Dependências: P0.3, P1.1. Aceite: métricas de `/builds`; 0 combinações vazias. Testes: `facetCounts`, `sort`, viewport, sheet, HTML sem scripts (chips como links).

**P1.5 Árvore de skills — etapa estrutural** — R-TREE-1…17 (exceto ícones), com os números aprovados no protótipo. Esforço: médio. Risco: legibilidade (mitigado pelo protótipo). Dependências: P0.4 aprovado. Aceite: grade 3×6 em 320 px; alcançabilidade 24/24; estados; painel. Testes: viewport por largura, `test:nav` reescrito, a11y, HTML sem scripts.

**P1.6 Progresso persistido no leveling** — `R-LEVEL-1…2` (seção 13.1). Esforço: pequeno/médio. Dependências: R-PREF-3/4. Aceite: por requisito.

### 13.1 Requisitos de navegação e leveling

- **R-NAV-1 · Tiers da home clicáveis.** Cada um dos seis cartões de tier da home é um link para `/builds`; com JS, o clique também grava `d2rc.tier`. *Aceite:* href em cada cartão; teste de que o clique grava a preferência; sem JS, o link funciona sem preferência.
- **R-NAV-2 · CTA de classe.** "Começar um personagem" leva à escolha de classe (`/leveling` ou seletor), não à Sorceress. *Aceite:* href ≠ `/leveling/sorceress`; crawl.
- **R-NAV-3 · Sumário na página de classe.** Sumário sticky ou abas com Builds / Mecânicas / Atributos / Skills / Breakpoints. *Aceite:* "Skill trees" alcançável em um toque a partir do topo; âncoras existentes preservadas.
  > **Refinamento contratual (proprietário, 2026-09-10, passe corretivo da Fase 2).** "Alcançável
  > em um toque" inclui **onde se aterra**. Medido na build publicada, um carregamento que já traz
  > `#skills` aterrava a 208 px (320), 190 (390) e 482–572 (768 e 1280) contra as 104/144 px que a
  > folha de estilos promete — porque `#builds` é uma `FilterableBuildList` cujo HTML estático é o
  > *fallback* do Suspense, e o painel de filtros chega com a hidratação, **acima** de todas as
  > outras âncoras da página. O aceite passa a exigir a **posição absoluta**, não a resolução da
  > âncora: o cabeçalho de `#skills` visível abaixo do header e a menos de 2 px da marca. Comparar o
  > clique com o carregamento direto não serve de aceite — os dois podem errar igual.
- **R-NAV-4 · Referência descoberta.** Cinco cartões (Runas, Itens, Breakpoints, Mercenários, Mecânicas) na home e rótulo "Referência ▾" no header em vez de "Menu". *Aceite:* cinco cartões com href; rótulo nos dois dicionários.
  > **Refinamento contratual (proprietário, 2026-09-10, após a Fase 2).** O rótulo é
  > **condicional à largura**, que é o que a própria decisão condiciona ao dizer "quando esse for
  > o agrupamento": abaixo de 900 px a nav primária não está na linha, então aquele `<details>` é
  > a **única** via para Classes, Builds, Leveling e Farming, e chamá-lo "Referência" arquivaria a
  > navegação primária sob "Referência" em todo telefone. Fica `nav.menu` abaixo de 900 px e
  > `nav.reference` a partir daí; `nav.menu` **não** é apagado e o ADR 0003 não muda. O
  > `aria-label` do landmark continua "Menu" em todas as larguras, porque é um atributo e um
  > atributo não tem largura a que responder.
  >
  > **Correção (2026-09-10, passe corretivo).** O degrau é `56.25rem`, não `900px`. São o mesmo
  > número no tamanho de texto padrão; são números diferentes para quem ampliou o texto, e em
  > pixels o rótulo continuava a ser promovido onde a linha ampliada já não tinha espaço para ele.
  > Medido contra `0b5a2bc` com a própria definição de tamanho de texto do Chrome, custava +45 px
  > (en) / +50 (pt) a 960 px e 150 %, e +61 / +66 a 1280 px e 200 %, sempre numa página que já
  > rolava lateralmente. A 320 e 390 px custava **zero** nos dois SHAs, a 100 %, 150 % e 200 % —
  > ali a palavra é `sr-only` e `sm` é `40rem`. Em rem o degrau acompanha o leitor: 900 px a
  > 100 %, 1350 a 150 %, 1800 a 200 %, e a palavra só aparece onde a linha ainda cabe.
- **R-LEVEL-1 · Progresso persistido.** Marcação de etapa atual por classe (`d2rc.leveling.<classe>`), badge "você está na etapa N" e retorno à etapa ao abrir; controle ausente sem JS (R-PREF-4). *Aceite:* ao reabrir, a etapa marcada está em foco; HTML sem scripts sem o controle.
- **R-LEVEL-2 · Barra de etapas.** Indicador de rolagem no desktop; etapa atual centralizada no celular. *Aceite:* viewport test em 1280 px mostra o indicador quando há overflow.

### P2 — melhorias importantes

**P2.1 Ícones por skill** (R-TREE-18, 19; após Q1) — esforço definido pelo spike; troca completa de uma vez.
**P2.2 Página de skill: dano 1–30, anterior/próximo** — pequeno.
**P2.3 Filtros em runewords e itens** (base, sockets, classe, slot; mesmo padrão de chips) — pequeno/médio.
**P2.4 Calculadora de breakpoint** ("tenho X% → frame; próximo em Y%") em `/breakpoints` e no bloco da build — pequeno/médio.
**P2.5 Modo de consulta compacto** (R-BUILD-15) — médio; impressão desacoplada.
**P2.6 Busca: tolerância a erro e uma só busca** (R-FILT-8; distância de edição 1 para termos ≥ 5 letras) — pequeno. *Dívida registrada no fechamento da Fase 3 (D6, 2026-09-11):* a busca única já existe (o campo inline saiu); falta o pontuador preferir um apelido exato a uma substring casual de outro nome — hoje "hdin" traz FoHdin antes de Hammerdin (nome-substring 250 > apelido 120 em `lib/search/scoring.ts`).
**P2.7 Higiene** (E6a, E7) — pequeno; vai na Fase 0A.
**P2.8 Aprofundamento editorial** — fluxo contínuo (9.2).

### P3 — o que sobra

**P3.2 Favoritos locais** (estrela em build/runeword; `localStorage`; custo marginal de uma chave após R-PREF) — pequeno.
**P3.3 Página "O que mudou no 3.3"** — editorial.
**P3.5 Farm por build e imunidade + Terror Zones documentadas** — médio.
**P3.6 Árvore por etapa no leveling** (R-TREE-10) — pequeno após P1.5.

**Removidos (não adiados):** P2.9 (404: header já entregue; "um idioma por rota" refutado por medição; busca no 404 não é iniciativa), P3.1 comparação de builds, P3.4 PWA, P3.7 JSON-LD, P3.8 rótulo de confiança no cartão, formulário GET de filtros avançados, folha de impressão acoplada ao modo compacto. Justificativas na seção 19.

---

## 14. Fases

Cada unidade entrega melhoria perceptível, cabe em ~2 semanas e termina com pelo menos um gate novo.

> **Estado em 2026-09-08.** **Fase 0A** executada, publicada e validada em produção (commit `71aa6dd`).
> **Fase 0B** executada; Q1 e Q2 decididas. **As Fases 1, 4 e 5 não foram iniciadas.** Decidir Q1 não
> autoriza desenhar ícones; aprovar Q2 não autoriza publicar a árvore sem o UAT físico da Fase 4.
> O próximo trabalho previsto é **planejar a Fase 1** (tiers compactos e preferência "Meu tier").
>
> **Estado em 2026-09-11.** **Fases 1, 2 e 3** executadas e publicadas (relatórios em `plans/`).
> **As Fases 4 e 5 não foram iniciadas.** A Fase 3 deixa ao proprietário a validação da hipótese
> "Para o meu estágio" e três decisões de conteúdo/layout medidas (O2 a 320/390, R-FILT-15 abaixo
> de 640 px, a descrição da listagem fora do cabeçalho visível).
>
> **Fechamento da Fase 3 (2026-09-11, mais tarde).** **Fase 3 concluída**: aprovada pelo
> proprietário com as decisões D1–D7 (registradas nos requisitos R-FILT-2, 5, 8, 11, 14 e 15, em
> §12.2 e em §18) e fechada com UAT visual da produção nos dois idiomas em 320/390/768/1280 sem
> defeito BLOCKER ou HIGH (relatório §13). Na primeira passagem de fechamento ficaram por decidir as
> metas absolutas de O2 a 768 e 1280, e D7 tinha sido registrada só em documento.
>
> **Segunda passagem de fechamento (2026-09-11).** **D7 existe no produto** — os chips de classe
> servidos levam a `/<locale>/classes/<slug>#builds` e continuam a alternar o filtro com JavaScript
> (R-FILT-14, commit `c029dbd`) — e as métricas responsivas fecharam por decisão do proprietário
> (320/390 ≤ 420 px; 768 ≤ 480 px; 1280 só o contrato relativo de 220 px, com 211 aprovados; §12.2).
> Produção serve `15846f3` (deployment `6396670505`) e a verificação pública de D7 passou 54/54 nos
> dois idiomas (relatório §14.5): **a Fase 3 está definitivamente concluída.** **A Fase 4 não começou.**

### Fase 0A — Correções comprovadas

- **Objetivo:** remover tudo o que contradiz o site e a única referência quebrada; remedir o limiar.
- **Escopo:** P0.1, P0.2, P0.3, E5, E6a, E7, E8 (com E6b como nota de "não mexer").
- **Fora:** qualquer mudança de layout.
- **Dependências:** nenhuma.
- **Riscos:** esquecer o pt-BR (mitigado por `check:content`); "corrigir" o que não é defeito (mitigado por E6b e 2.2).
- **Aceite:** afirmações estáticas = 0; referências sem link = 0; dicionários sem `whyFew*`; distribuição do limiar gerada e gate verde.
- **Testes novos:** conteúdo (strings de cobertura), HTML (seções vazias, slugs, skills sem link), higiene (`slug.replace`), refs de mercenário, gate de distribuição.
- **Entregável visível:** `/classes`, `/builds` e todas as builds sem textos falsos; mercenário com links.
- **Condição para avançar:** `npm run verify` verde com os gates novos.

### Fase 0B — Spikes de árvore e assets

- **Objetivo:** responder as duas perguntas mais caras antes de qualquer código de árvore.
- **Escopo:** P0.4 protótipo (R-TREE-0) e P0.5 spike de assets (R-TREE-19), ambos como artefatos em `docs/`.
- **Fora:** código de produção.
- **Dependências:** nenhuma (pode correr em paralelo com 0A).
- **Riscos:** protótipo reprovar (renegociação de 1.5 #7 antes da Fase 1); nenhum conjunto cobrir 240 skills (leva a conjunto próprio).
- **Aceite:** critérios de R-TREE-0 marcados pelo proprietário; relatório do spike com as oito respostas e a proposta de teto de HTML por página de classe (baseline, método, justificativa); números de nó/vão/fileira/abas/orçamento fixados; Q1 e Q2 respondíveis.
- **Testes novos:** nenhum de produção; medições registradas.
- **Entregável visível:** protótipo navegável em telefone; artefato lado a lado dos ícones.
- **Condição para avançar:** Q2 aprovada (Fase 4 destravada); Q1 decidida (Fase 5 destravada).

### Fase 1 — Tiers compactos e preferência

- **Objetivo:** primeira visita sem 32 mil px; tier escolhido em ≤ 2 ações; nenhum deslocamento automático.
- **Escopo:** P1.1 (R-BUILD-1…5, 9–12; R-PREF-1…4).
- **Fora:** comparação, sumário, filtros, árvore, modo compacto.
- **Dependências:** Fase 0A.
- **Riscos:** CLS; hipótese dos 320 px por tier; conflito hash/preferência (regra em R-BUILD-2).
- **Aceite:** 12.1 coluna "Fase 1" com a aritmética recalculada a partir das medições reais; ≤ 2 ações; `scrollY` inalterado na seleção; topo do controle ≤ 560 px em 320×640; sem JS, seis `<details open>` e seis âncoras.
- **Testes novos:** viewport de altura por tier e da página; HTML sem scripts; snapshot por estado de preferência; CLS headless; `scrollY` na seleção.
- **Entregável visível:** build abre com "Onde você está?" e seis resumos; escolher expande um tier e oferece "Ir para o equipamento".
- **Condição para avançar:** sessão do proprietário em celular e desktop nos dois idiomas com J3 e J4 concluídas.

### Fase 2 — Comparação e orientação na build

- **Objetivo:** upgrades legíveis e navegação pela página e pelo site.
- **Escopo:** P1.2 (R-BUILD-6, 7, 8) e P1.3 (R-NAV-1…4).
- **Fora:** filtros, árvore.
- **Dependências:** Fase 1 (forma dos dados de tier e módulo de preferências).
- **Riscos:** regra de comparação; dispersão entre páginas (escopo fechado em seis requisitos).
- **Aceite:** marcadores em todos os slots das 53 builds; "Seções" em um toque; seis cartões de tier com href; CTA de classe; "Skill trees" em um toque na classe; referência na home e no header.
  > **Medido na execução (2026-09-10):** o primeiro tier é isento por R-BUILD-6, então o número
  > alcançável é **2.369 de 2.659** ocorrências de slot — todas classificadas. Desenhadas: 698;
  > só no leitor de tela: 454; cobertas por uma das 161 linhas de maioria: 1.217.
- **Testes novos:** `compareTiers` sobre as 53 builds; crawl de links; HTML.
- **Entregável visível:** marcadores novo/mantido/alternativa/removido; sumário; home com tiers clicáveis e referência.
- **Condição para avançar:** J5 concluída na sessão do proprietário.

### Fase 3 — Redesign dos filtros

- **Objetivo:** primeira build na primeira dobra e zero combinações vazias.
- **Escopo:** P1.4 (R-FILT-1…17); cartão; página de classe; ordenação; busca única (tolerância a erro pode ficar para 6c).
- **Fora:** filtros de runewords/itens.
- **Dependências:** Fase 0A (limiar) e Fase 1 (preferência).
- **Riscos:** regressão na sheet; hipótese "Para o meu estágio".
- **Aceite:** px até o primeiro cartão em 4 larguras; 0 combinações vazias; ordenação padrão inalterada com preferência; testes da sheet verdes.
- **Testes novos:** `facetCounts`, `sort`, viewport, HTML sem scripts (chips como links).
- **Entregável visível:** `/builds` e páginas de classe com chips, "Onde você está", "Mais filtros", ordenação, contagens vivas.
- **Condição para avançar:** J1, J2, J10 concluídas na sessão do proprietário.

### Fase 4 — Árvore estrutural (após aprovação do protótipo)

- **Objetivo:** árvore 3×6 com conectores, contador, estados e teclado previsível em todas as larguras.
- **Escopo:** P1.5 (R-TREE-1…17), com o sigilo atual como placeholder declarado.
- **Fora:** ícones por skill; árvore no leveling.
- **Dependências:** Q2 aprovada (Fase 0B) — **aprovada em 2026-09-08 como direção estrutural, com condição de UAT físico antes da publicação**.
- **Riscos:** regressão de teclado (mitigado pelo teste de alcançabilidade 24/24); peso do HTML.
- **Aceite:** R-TREE-1…17 com os números do protótipo; HTML por classe ≤ teto do spike.
- **Portao de publicação — UAT físico obrigatório.** A geometria está aprovada para planejar e implementar, mas **a Fase 4 não pode ser publicada** antes de um teste em telefone real que confirme: dez nós consecutivos tocados sem erro de alvo; troca entre as três árvores; abertura e fechamento do painel; retorno de foco; rolagem sem acionamentos acidentais; trilho não prejudicado por tela curva ou safe area; leitura dos nomes no estado normal; identificação da skill selecionada no modo glifo; uso em en-US e pt-BR; em pelo menos 320 px e 390 px ou dispositivos equivalentes. **Nenhuma medição headless substitui este teste.** Falha nele autoriza ajustar dimensão, inset e comportamento **sem reabrir a direção estrutural**.
- **Testes novos:** viewport por largura (3 colunas, 18 células, SVG visível), `test:nav` reescrito com alcançabilidade 24/24 e casos de três classes, a11y por estado, HTML sem scripts.
- **Entregável visível:** árvore como árvore no celular, abas por tree (se aprovadas), pontos e estados.
- **Condição para avançar:** J6, J7 concluídas em 320 px e desktop.

### Fase 5 — Ícones e acabamento (após spike de assets)

- **Objetivo:** reconhecimento por ícone com uma única mão visual.
- **Escopo:** P2.1 (R-TREE-18, 19): manifesto, troca completa de uma vez, moldura e estados finais, nível de personagem (R-TREE-9).
- **Fora:** qualquer asset do jogo; cobertura parcial.
- **Dependências:** Fase 4; Q1 decidida.
- **Riscos:** licença; consistência (mitigada pela regra de conjunto único).
- **Aceite:** 240/240 com `origin` ≠ `placeholder` e registro de origem; teste de manifesto sem faltas; contraste; atribuições geradas.
- **Testes novos:** manifesto de ícones; tamanho do HTML por classe; contraste dos estados.
- **Entregável visível:** árvore com ícone por skill nas 8 classes.
- **Condição para avançar:** proprietário reconhece ≥ 20 skills da própria classe principal pelo ícone sem ler o nome.

### Fase 6 — Refinamento visual sistêmico (quatro entregas independentes)

- **6a Leveling:** R-LEVEL-1…2 (P1.6). Aceite: etapa em foco ao reabrir; indicador de rolagem. Testes: HTML por estado; viewport.
- **6b Referência:** P2.3 filtros em runewords/itens; P2.4 calculadora de breakpoint. Aceite: chips de base/sockets/classe/slot; calculadora com testes.
- **6c Skill e busca:** P2.2 dano 1–30 e anterior/próximo; P2.6 tolerância a erro e busca única. Aceite: ≥ 7 pontos de dano; "blizard" encontra Blizzard; **"hdin" traz Hammerdin em primeiro** (dívida D6 da Fase 3: apelido exato acima de substring casual).
- **6d Acabamento:** padrão de cartão (runeword como referência), blocos de referência da home, modo compacto (P2.5). Aceite: 12.1 coluna transversal medida; altura compacta ≤ 60%.
- Cada entrega é visível por si; nenhuma depende das irmãs; dependências: Fases 1–3 (componentes e preferências).

### Fluxo editorial contínuo (sem fase)

- P2.8 aprofundamento das builds mais rasas; P3.3 página de patch quando houver conteúdo. Não bloqueia nenhuma fase e não depende de decisão do proprietário.

### Fase 7 — Aberta

- P3.2 favoritos, P3.5 farm por build, P3.6 árvore no leveling. Regra de entrada: só entra o que o proprietário sentir falta em sessão de jogo.

Dependências: 0A → 1 → 2 → 3; 0B → 4 → 5; 6a–6d dependem de 1–3; nenhuma circular.

---

## 15. Questões em aberto

Somente decisões que dependem do proprietário e que o documento não pode resolver sozinho.

**~~Q1 · Estratégia e origem final dos ícones~~ — DECIDIDA em 2026-09-08. Não está mais aberta.**
- Decisão do proprietário: **(A) conjunto próprio completo e consistente para as 240 skills.**
- Motivos registrados: o melhor conjunto externo cobre só 47,7 %; as lacunas são importantes, sobretudo nas auras do Paladin; completá-las produziria mistura de estilos; consistência importa mais que reaproveitar parcialmente um conjunto externo; identidade própria do D2R Codex; nenhum asset do jogo copiado; o resultado final tem de cobrir 240/240.
- Consequências registradas no bloco no início de §8.5. **Decidir a origem não autoriza produzir os ícones:** a Fase 5 continua não iniciada e o desenho dos 240 exige plano próprio posterior.
- Evidência: [`spikes/2026-09-08-skill-icon-assets.md`](spikes/2026-09-08-skill-icon-assets.md).

**~~Q2 · Aprovação visual e comportamental do protótipo mobile da árvore~~ — APROVADA em 2026-09-08 como direção estrutural, com condição de UAT físico. Não está mais aberta.**
- **Decisão:** variante **F** como baseline da Fase 4. As decisões aprovadas estão no bloco no início de §8.2; os números viraram requisito em R-TREE-3 (nó 88 px, vão 8 px, fileira com piso de 74 px), R-TREE-8 (abas <640 px, empilhadas ≥640 px, uma legenda, ≤ 900 px por seção) e R-TREE-15 (estratégia B para texto ampliado).
- **Condição:** a Fase 4 **não pode ser publicada** sem o UAT físico em telefone real descrito em §14. Falhar nele ajusta dimensão, inset e comportamento, **sem reabrir a direção estrutural**.
- **Histórico da decisão (mantido para quem for implementar):**
- Contexto: R-TREE-0 lista as oito perguntas e os critérios mínimos; abas só abaixo de 640 px é o ponto de partida, não contrato.
- Opções: aprovar (fixa nó, vão, fileira, trilho, abas e orçamento); aprovar com ajustes; reprovar (renegociar 1.5 #7 e O3 antes da Fase 1).
- **Estado em 2026-09-08:** o proprietário avaliou a primeira rodada e **não aprovou**. A direção da variante E foi considerada promissora e claramente melhor que a lista atual. Confirmados como direção inicial: conectores **ortogonais**; o contraste de moldura já aprovado; **abas abaixo de 640 px com três árvores empilhadas a partir de 640 px**; e fonte normal de **12 px** (11 px era legível, mas pequeno). Pendências que motivaram a segunda rodada: nomes quebrando em colunas de uma ou duas letras com texto a 200 %; trilho colado à borda (pede um pequeno inset, sem migrar para a variante C); legenda de 116 px repetida por tree (pede uma legenda única compartilhada). Uma **variante F** foi construída para responder a isso.
- **Pendência que nenhuma medição headless resolve:** alvo de toque com **polegar real**. Continua explicitamente em aberto.
- Impacto: destrava a Fase 4 e define os números de R-TREE-1, 3, 8, 15, 17.
- Quando: após a avaliação da variante F em telefone real, nos dois idiomas.

Resolvidas neste PRD (não estão abertas): tiers na primeira visita (todos compactos, nenhum pré-selecionado); rolagem (nunca automática na seleção); abas em tablet (não; saída do protótipo confirma); PWA (removido do roadmap); aprofundamento editorial (fluxo contínuo); compartilhamento (fora de escopo).

---

## 16. Rastreabilidade

| Achado | Requisito | Prioridade | Fase | Critério de aceite |
|---|---|---|---|---|
| Nota de cobertura contraditória em `/classes` (D1) | E1, R-I18N-6 | P0.1 | 0A | 0 strings estáticas de cobertura |
| Título órfão "Classes aguardando" (D2) | E2, R-FILT-4 | P0.1 | 0A | Nenhuma seção sem filhos |
| "Por que tão poucas builds?" (D3) | E3 | P0.1 | 0A | Chaves removidas |
| Slugs no mercenário (D4) | E4, R-BUILD-14 | P0.2 | 0A | 53/53 refs resolvidas com link e `why` |
| Skills sem link na build (D6) | E5, R-BUILD-13 | P1 (incluído em 0A por ser pequeno) | 0A | 0 nomes sem link |
| Strings mortas e contagens correntes (D10) | E6a | P2.7 | 0A | `test:hygiene` |
| SVGs órfãos e rotas fabricadas (D11) | E7 | P2.7 | 0A | `resolveRef` sem href para rota inexistente |
| Rótulos pt-BR residuais (D12) | E8, R-I18N-5, 6 | P2.7 | 0A | Lista do ADR 0003 no teste |
| Limiar "Boa para" sobre 29 builds (D14) | E9, R-FILT-17 | P0.3 | 0A | Distribuição gerada; gate |
| Árvore em lista <640 px; `role=grid` inválido (D7) | R-TREE-0, 1, 2, 3, 8 | P0.4 / P1.5 | 0B / 4 | Protótipo aprovado; 3 colunas, 18 células e SVG em 320 px |
| Ícones: glifo por tipo, não por skill | R-TREE-18, 19 | P0.5 / P2.1 | 0B / 5 | Spike; manifesto 240/240 |
| Build de 31.939 px, tiers empilhados | R-BUILD-1…5, 9–12, R-PREF-1…4 | P1.1 | 1 | 12.1 coluna "Fase 1"; ≤ 2 ações; 0 px automático; ≤ 560 px |
| Sem "o que muda" entre tiers | R-BUILD-6, 7 | P1.2 | 2 | Marcador em todos os slots |
| Build sem sumário | R-BUILD-8 | P1.2 | 2 | Seções em um toque |
| Tiers da home não clicáveis; CTA vai à Sorceress | R-NAV-1, 2 | P1.3 | 2 | href em cada cartão; CTA ≠ Sorceress |
| Página de classe sem sumário | R-NAV-3 | P1.3 | 2 | Um toque até "Skill trees" |
| Referência escondida em "Menu ▾" | R-NAV-4 | P1.3 | 2 | Cinco cartões; "Referência ▾" |
| 28 caixas antes do primeiro cartão | R-FILT-1, 3, 11, 15 | P1.4 | 3 | Px até o primeiro cartão |
| Contagens de faceta estáticas (D5) | R-FILT-4 | P1.4 | 3 | 0 combinações vazias clicáveis |
| Sem ordenação | R-FILT-5 | P1.4 | 3 | ≥ 4 critérios; `?sort=`; padrão inalterado |
| Duas buscas sem relação | R-FILT-8 | P1.4 | 3 | Um índice |
| Cartão com 4 pares de notas | R-FILT-16 | P1.4 | 3 | Altura ≤ 80% |
| Sheet mobile (preservar) | R-FILT-12 | P1.4 | 3 | Testes existentes verdes |
| Setas do teclado imprecisas (D8) | R-TREE-13 | P1.5 | 4 | Alcançabilidade 24/24 + previsibilidade em 3 classes |
| Sem contador de pontos por tree; sem estados | R-TREE-5, 6 | P1.5 | 4 | Somas conferem; snapshots |
| Leveling sem progresso; barra corta (D9) | R-LEVEL-1, 2 | P1.6 | 6a | Etapa em foco ao reabrir; indicador |
| Runewords/itens sem filtro | P2.3 | P2 | 6b | Chips |
| Breakpoints estáticos | P2.4 | P2 | 6b | Calculadora |
| Skill: dano só em 1 e 20; sem anterior/próximo | P2.2 | P2 | 6c | ≥ 7 pontos; navegação |
| Busca sem tolerância a erro | P2.6 | P2 | 6c | "blizard" encontra |
| Sem modo de consulta compacto | R-BUILD-15 | P2.5 | 6d | Altura ≤ 60%; sem JS nada muda |
| Profundidade desigual entre builds | 9.2 | P2.8 | contínuo | ≥ 10 alternativas por build |
| Sem favoritos | P3.2 | P3 | 7 | `localStorage` |
| Sem "o que mudou no patch" | P3.3 | P3 | contínuo | Página |
| Farm sem filtro por build/imunidade | P3.5 | P3 | 7 | Filtro |
| Árvore por etapa no leveling | R-TREE-10 | P3.6 | 7 | Pelo menos a jornada da Sorceress renderiza a árvore da tree relevante por etapa, com os pontos daquela etapa, sem custo editorial novo |
| 404 sem busca (D13) | — | Limitação conhecida (17.5) | — | Sem iniciativa |
| 404 com um documento para os dois idiomas / `<html lang>` | — | Limitação conhecida (17.5) | — | Decisão medida; sem iniciativa |
| Índice de skills por classe (`/classes/x/skills` 404) | — | Recusado (17.6) | — | Árvore e busca cobrem o acesso |
| Sem og:image / preview social | — | Fora de escopo | — | Decisão do proprietário (3.2) |
| Filtros por ladder/hardcore | — | Recusado (`REFUSED_FILTERS`) | — | Mantido |
| Réplica literal da interface (Direção A) | R-TREE-19 | Rejeitado como execução; referência visual | — | Nenhum asset do jogo |

---

## 17. Apêndice

### 17.1 Rotas auditadas (produção, 2026-09-07 e 2026-09-08)

`/`, `/en-us`, `/pt-br`, `/en-us/classes`, `/pt-br/classes`, `/en-us/classes/sorceress`, `/pt-br/classes/sorceress`, `/en-us/classes/necromancer`, `/en-us/classes/warlock`, `/en-us/classes/sorceress/skills/blizzard`, `/pt-br/classes/sorceress/skills/blizzard`, `/en-us/builds` (+ `?damage=cold`, `?class=necromancer&damage=cold`), `/pt-br/builds`, `/en-us/builds/sorceress/blizzard-sorceress`, `/pt-br/builds/sorceress/blizzard-sorceress`, `/en-us/builds/paladin/hammerdin`, `/en-us/builds/warlock/abyss-warlock`, `/en-us/builds/barbarian/leap-attack-barbarian`, `/en-us/builds/necromancer/summoner-necromancer`, `/en-us/leveling`, `/en-us/leveling/sorceress`, `/pt-br/leveling/sorceress`, `/en-us/leveling/warlock`, `/en-us/farming`, `/en-us/farming/ancient-tunnels`, `/en-us/runewords`, `/en-us/runewords/spirit`, `/en-us/runes`, `/en-us/runes/jah`, `/en-us/items`, `/en-us/items/harlequin-crest`, `/en-us/breakpoints`, `/en-us/mercenaries`, `/en-us/mechanics`, `/en-us/about/sources`, 404 em `/en-us/this-does-not-exist`, `/pt-br/nada`, `/en-us/classes/sorceress/skills`; `/sitemap.xml` (1.002 URLs), `/robots.txt`.

### 17.2 Viewports

1280×800, 1280×900, 1024×800, 768×1024, 640×900, 390×844, 320×640. Sem overflow horizontal em nenhum; header de 57 px em 320 px; largura útil de conteúdo em 320 px: 280 px.

### 17.3 Referências externas

Ver a seção "Referências externas" do [relatório completo](audits/2026-09-07-product-ux-audit.md): Maxroll (build guides, planner, breakpoints), Icy Veins, d2runewizard (runewords, calculadora, integração), diablo2.io (facetas, áreas por imunidade), Arreat Summit, D2 Planner (screenshots como fundo), ecossistema pt-BR (inexistente de forma estruturada), Legal FAQ e diretrizes de marca da Blizzard, estado do jogo (RotW 11/02/2026, Patch 3.3 18/08/2026, S15 21/08/2026). Fatos e opiniões estão marcados lá.

### 17.4 Evidências

Capturas e textos coletados na auditoria (pasta temporária, não versionados): `home-desktop.png`, `class-sorc-skilltree.png`, `class-sorc-skill-selected.png`, `builds-top.png`, `builds-empty.png`, `build-y540/1500/6040.png`, `search-bliz.png`, `ref-*.png`, `m/home-320.png`, `m/builds-sheet-390-selected.png`, `m/class-skill-tapped-390.png`, `m/class-skills-390.png`, `m/build-gear-390.png`, `m/build-skills-390.png`, `m/build-skills-320.png`, `m/build-merc-390.png`, `m/builds-768.png`. Medições da revisão de 2026-09-08 (alturas por bloco, largura útil, trilho, fileira) estão em [`reviews/2026-09-08-prd-vnext-review.md`](reviews/2026-09-08-prd-vnext-review.md) §3 (B1, B2, H2, H3). Achados de código estão na seção "Auditoria técnica" da auditoria, com caminho e linha.

### 17.5 Limitações conhecidas e da auditoria

- **404:** um único documento serve os dois idiomas e o `<html lang>` não reflete a rota. `app/not-found.tsx` documenta a medição que motivou a decisão: ler cookies/headers no not-found raiz transformou todas as páginas pré-renderizadas em renderizações sob demanda, `[lang]/not-found.tsx` nunca é alcançado sob `dynamicParams = false`, e um catch-all piorou. Limitação conhecida, sem iniciativa. O 404 também não tem busca; sem iniciativa.
- Transferência comprimida das páginas não pôde ser medida (transferSize = 0 no headless); apenas o HTML decodificado (61–560 KB).
- Sem teste com outros usuários; as jornadas foram percorridas pelo auditor e as métricas de tarefa ficam para as sessões do proprietário.
- A busca em pt-BR foi testada com poucos termos; "gelo" ficou inconclusivo.
- Contagens de chaves de dicionário variaram com o método (881 a 922) entre medições; por isso o PRD usa predicados.
- A disposição 3×6 do jogo foi confirmada pelo grafo do repositório e pelas capturas, não por wiki.
- Não foi executado `npm run verify` nem build local em nenhuma das duas revisões; os achados de código são por leitura.

### 17.6 Decisões descartadas

- og:image, previews sociais, compartilhamento, contas, perfis, colaboração, comentários, sincronização, JSON-LD (decisão do proprietário; aquisição fora de escopo).
- PWA/manifest (removido do roadmap; não é questão aberta).
- Comparação de duas builds lado a lado (valor baixo para quem escreveu as 53 builds; superfície nova em 320 px).
- Rótulo de confiança no cartão da listagem (valor ≈ zero para o leitor único).
- "Um idioma por rota" no 404 (refutado por medição registrada em `app/not-found.tsx`).
- Índice de skills por classe em `/classes/<classe>/skills` (árvore e busca já dão acesso; uma terceira porta para o mesmo conteúdo).
- Formulário GET paralelo para filtros avançados sem JS (segunda implementação para um leitor que este site pessoal quase não tem).
- Folha de impressão acoplada ao modo compacto (superfícies e públicos diferentes; impressão fica como possibilidade futura, e se existir expande os seis tiers).
- Direção A (réplica literal): risco legal e de acessibilidade; identidade. Direção C absorvida como primeiro passo de B.
- Tabs puras na página de build; manter tudo expandido até a primeira escolha; pré-selecionar um tier; auto-scroll ao selecionar ou carregar.
- Viewport horizontal, zoom/pan e visão geral + detalhe para a árvore no celular; qualquer alternativa que a transforme em lista.
- Planner completo, trackers em tempo real, drop calculator, modo claro, anúncios, catálogo de itens "para completar", tier list, filtros por ladder/hardcore.

### 17.7 Fato, opinião visual e hipótese

- **Fatos** (comprovados em produção ou no código): D1–D14; alturas por bloco (12.1); largura útil de 280 px; trilho de 36 px; fileira de 88 px; contagens de conteúdo; comportamento dos filtros, da busca, do teclado, das sheets, do menu e da troca de idioma; posições da árvore derivadas dos dados; ausência de `localStorage`, `@media print`, JSON-LD; invariante de alcançabilidade no módulo de navegação.
- **Opiniões visuais** (justificadas, discutíveis): densidade dos filtros como formulário; quatro pares de notas por cartão; blocos de referência da home sem moldura; selo "alvl 85" repetido; cartão de runeword como melhor padrão; glifo genérico por tipo.
- **Hipóteses** (a validar): 320 px por tier compacto; nó compacto legível em 280 px com trilho suprimido; abas por tree só abaixo de 640 px; orçamento de altura por tree; "Para o meu estágio" como ordenação útil; que a percepção de "build de segunda" vem da contagem de alternativas; mecanismos de implementação listados como hipóteses em R-BUILD-10, R-TREE-8 e R-TREE-17.

---

## 18. Histórico

| Data | Evento | Referência |
|---|---|---|
| 2026-09-07 | Auditoria read-only de produto, UX e design em produção e no repositório (`7e69fca`) | [`audits/2026-09-07-product-ux-audit.md`](audits/2026-09-07-product-ux-audit.md) |
| 2026-09-07 | Aprovação do proprietário com retirada definitiva de compartilhamento e recursos sociais; PRD v1 escrito | commit `e5ebde4` |
| 2026-09-08 | Revisão adversarial independente do PRD: 25 findings (3 BLOCKER, 7 HIGH, 10 MEDIUM, 5 LOW), 12 contradições, 6 requisitos prematuros, 10 ausentes, 10 a remover, 11 unidades de fase propostas | [`reviews/2026-09-08-prd-vnext-review.md`](reviews/2026-09-08-prd-vnext-review.md), commit `6b3c38d` |
| 2026-09-08 | Decisões do proprietário: seis tiers compactos por padrão sem pré-seleção nem inferência; seleção nunca rola a página (ação explícita "Ir para o equipamento"); árvore por aba abaixo de 640 px como ponto de partida sujeito ao protótipo; nenhum subconjunto de ícones aprovado (spike antes de Q1); PWA removido; aprofundamento editorial como fluxo contínuo; compartilhamento continua fora | esta revisão (seção 19) |
| 2026-09-08 | PRD revisão 2 (este documento) | commit posterior a `6b3c38d` |
| 2026-09-08 | **Fase 0A executada, publicada e validada em produção.** Nove defeitos corrigidos com teste vermelho antes, verde depois e mutation por item; `GOOD_AT_THRESHOLD` remedido sobre 53 builds (424 notas) e **mantido em 4**; cinco gates novos. Aprovada pelo proprietário | commit `71aa6dd`, deployment `6335127988`; [`../adr/0004-good-at-threshold.md`](../adr/0004-good-at-threshold.md) |
| 2026-09-08 | **Fase 0B executada.** Protótipo da árvore mobile e spike de ícones entregues como artefatos em `docs/` | [`prototypes/mobile-skill-tree/`](prototypes/mobile-skill-tree/README.md), [`spikes/2026-09-08-skill-icon-assets.md`](spikes/2026-09-08-skill-icon-assets.md) |
| 2026-09-08 | **Q1 decidida pelo proprietário: (A) conjunto próprio completo**, 240/240, sem mistura progressiva no resultado final; placeholders seguem até a troca completa; Fase 5 **não** iniciada e produção dos ícones exige plano próprio | §8.5 e §15 |
| 2026-09-08 | **Q2 não aprovada; segunda rodada do protótipo (variante F).** Confirmados: conectores ortogonais, contraste de moldura, abas <640 px, 12 px. A corrigir: quebra de nomes a 200 %, inset do trilho, legenda única | §15 Q2; [`prototypes/mobile-skill-tree/`](prototypes/mobile-skill-tree/README.md) |
| 2026-09-08 | **Q2 aprovada como direção estrutural, com condição de UAT físico.** Variante F vira baseline da Fase 4; grade 3×6, conectores ortogonais, trilho recuado na calha, 12 px, abas <640 px e empilhadas ≥640 px, uma legenda compartilhada expansível, alcançabilidade só por setas. Estratégia B aprovada para texto ampliado; estratégia A (fileira crescendo) rejeitada. §1.5 #7 e O3 confirmados | §8.2, §8.3 R-TREE-3/8/15, §14 Fase 4, §15 |
| 2026-09-08 | **Correção factual de duas afirmações sobre a árvore**, descobertas pela medição da Fase 0B.1: "Corpse Explosion" é da tree Poison and Bone, não Summoning (`skill-graph.ts`); e alargar a grade **não** corrige sozinho o `role=grid` inválido, porque a célula vazia é `aria-hidden="true"` em qualquer largura | §2.2 D7, §8.2 R-TREE-0, §8.3 R-TREE-1; errata em [`reviews/`](reviews/2026-09-08-prd-vnext-review.md) |
| 2026-09-09 | **Fase 1 executada.** Tiers compactos e preferência `d2rc.tier`. A hipótese de ≤ 320 px por tier compacto foi **refutada por medição** (real: 251–420 px, conforme os slots e a largura) e §12.1 recalculada com números medidos, como o próprio §12.1 manda. Seção Gear da build de referência: 16.458 → 2.034 px (−87,6%); primeira visita 32.574 → 18.344 px (−43,7%). Controle dentro do alvo de 560 px em 104 das 106 páginas, duas a 575 px em pt-BR, nenhuma acima do teto de 640 px | [`plans/phase-1-report.md`](plans/phase-1-report.md) |
| 2026-09-09 | **Refinamento contratual de R-BUILD-4** aprovado pelo proprietário: o controle repetido dentro de Gear é espelho de navegação e não grava a preferência | §6.3 R-BUILD-4 |
| 2026-09-10 | **Fase 2 executada.** Comparação adjacente, upgrades, sumário da build, descoberta e o fragmento na troca de idioma. `compactGear` fica **idêntico ao pixel** (2.034 en / 2.146 pt), portanto a afirmação publicada de 87,6% da Fase 1 não foi tocada; só `openGear` e `openPage` se moveram, pelo crescimento medido. As 45 lacunas de `nextUpgrade` são **todas** em `bis`, o que a decisão de BiS terminal cobre inteiramente — nenhum dado alterado, nenhum conteúdo inventado | [`plans/phase-2-report.md`](plans/phase-2-report.md) |
| 2026-09-10 | **Refinamentos contratuais de J5, R-BUILD-6, R-BUILD-7, R-BUILD-8 e R-NAV-4** registados nos próprios requisitos: estado majoritário dito uma vez; identidade por `ref.kind + ref.slug`; `bis` terminal e a repetição só no tier seguinte ao expandido; dois toques na build abaixo de 640 px e um na classe; rótulo do header condicional à largura | §5 J5, §6.3, §13.1 |
| 2026-09-10 | **Quatro gates que não podiam falhar**, encontrados por 43 mutations e corrigidos: uma regex apanhada por `peer-open:hidden`; a regressão do sumário invisível sem asserção de navegador; a regra de escritor único de `d2rc.tier` nunca escrita; e um gate satisfeito pelo próprio comentário de aviso | [`plans/phase-2-report.md`](plans/phase-2-report.md) §6 |
| 2026-09-10 | **Passe corretivo da Fase 2.** Dois achados registados como "fora de escopo" reavaliados por medição. A âncora `#skills` **era** defeito desta fase, e a causa registada estava errada: o salto do fragmento é uma animação cujo destino fica fixado a 311 ms e a hidratação faz `#builds` crescer a 332 ms, de modo que o leitor aterrava 86–428 px abaixo do cabeçalho — a árvore de skills está *dentro* de `#skills` e não podia ser a causa. Corrigido com realinhamento após estabilização na própria integração sumário/âncora, sem tocar na árvore. O transbordo do header a texto ampliado é **pré-existente e idêntico ao pixel** a 320 e 390 px nos dois SHAs, mas R-NAV-4 piorava-o em duas das quinze combinações largura×tamanho de texto por idioma; corrigido trocando o degrau do rótulo de `900px` para `56.25rem` | [`plans/phase-2-report.md`](plans/phase-2-report.md) §10 |
| 2026-09-11 | **Fase 3 executada.** Filtros redesenhados: oito chips de classe com glifo e contagem condicional (links no HTML servido, botões com JS), "Onde você está" como preferência que nunca filtra, filtros avançados atrás de "Mais filtros (N)" — popover não modal a partir de 640 px, a sheet existente abaixo, só com os quatro grupos avançados —, contagens condicionais com zero visível e desabilitado, ordenação em `?sort=` (cinco critérios; "Recomendado" inalterado com preferência), chips aplicados inline, uma só busca (o campo inline saiu), estado vazio só por URL com "Remover {grupo}" e três builds próximas rotuladas, cartão compacto (315 → 249 px a 390). Primeiro cartão 490/443/772/644 → 401/401/428/336 px. Duas metas não alcançadas por aritmética do conteúdo, registradas nos requisitos: O2 a 320/390 e R-FILT-15 abaixo de 640. **Publicada e validada em produção:** commit `505310e`, deployment `6388024744`, smoke público 58/58 nos dois idiomas; **fechamento definitivo** com D7 no produto em `15846f3` (deployment `6396670505`, verificação pública 54/54) | [`plans/phase-3-filters-plan.md`](plans/phase-3-filters-plan.md), [`plans/phase-3-report.md`](plans/phase-3-report.md) §12.1 |
| 2026-09-11 | **Notas de execução nos requisitos R-FILT-2, 4, 8, 14, 15 e 16** (regra do toggle que nunca zera; "Remover último filtro" só de vazio para vazio e "Remover {grupo}" para a chegada por URL; `q` extinto; `?class=` estático não estreita; formas curtas dos tiers no segmento; todos os eixos escolhidos no cartão) — decisões do coordenador dentro do PRD, **pendentes da validação do proprietário** na sessão J1/J2/J10, junto com a hipótese "Para o meu estágio" | §7.2, §12.2 |
| 2026-09-11 | **Fase 3 aprovada e concluída (fechamento).** Decisões do proprietário: **D1** meta absoluta do primeiro cartão em 320/390 px passa a ≤ 420 (medido 401; gates medidos preservados; 768/1280 continuam sem decisão); **D2** o cartão de evolução precede o primeiro cartão de build no celular por decisão — R-FILT-15 reformulado para medir descoberta e acesso numa tela; **D3** retirada da descrição visível de `/builds` aceita (metadata inalterada, confirmada em produção); **D4** nomes curtos dos tiers aceitos, nome completo para tecnologia assistiva mantido e "onde houver espaço" como acompanhamento; **D5** "Para o meu estágio" hipótese validada provisoriamente, algoritmo intocado; **D6** "hdin" em segundo lugar é dívida da Fase 6c (P2.6); **D7** sem JavaScript a listagem por classe é `/classes/<slug>#builds` e `/builds` serve a lista completa — R-FILT-14 reescrito para o comportamento real, sem infraestrutura nova. **A Fase 4 não começou** | §7.2 (R-FILT-2, 5, 8, 11, 14, 15), §12.2, §13 P2.6, §14 |
| 2026-09-11 | **UAT visual read-only da produção (fechamento).** 64 combinações (2 idiomas × 320/390/768/1280 × listagem, ordenação, filtros abertos, sheet, preferência, estado vazio, página de classe, texto a 200 %): sem sobreposição, corte, chip inalcançável, fade sobre chip pressionada, sheet fora da tela ou foco invisível; console limpo. Achados MEDIUM/LOW registrados para outras passagens: a 200 % de texto a 320/390 os cartões medem 408–434 px (antes da Fase 3 mediam 353–436 e a página já rolava por causa do header — pré-existente, reduzido); "Spirit · Spirit" na linha de estágio quando a build veste duas Spirits; o contador quebra para segunda linha a 1280 em pt-BR com estágio gravado; o rodapé da sheet quebra em duas linhas a 320. **Errata:** a nota de §12.2 dizia que 768 (en) e 1280 cumpriam a meta absoluta — nenhuma das quatro cumpre | [`plans/phase-3-report.md`](plans/phase-3-report.md) §13 |
| 2026-09-11 | **Segunda passagem de fechamento: D7 implementada e métricas responsivas fechadas.** O proprietário recusou a primeira leitura de D7 (registrar `?class=` como fallback): os chips de classe servidos passam a apontar para `/<locale>/classes/<slug>#builds`, permanecem `<a>` depois da hidratação com `role=button`/`aria-pressed`, interceptam só o clique simples (alternância na URL) e deixam Ctrl/Cmd/Shift/Alt, clique do meio, nova aba e copiar link ao navegador; a página de classe continua sem chips. Gates: HTML construído sem scripts (oito destinos, locale, `#builds`, `id="builds"` na página de classe, zero `?class=`, clique real sem scripts aterrando na seção da classe) e navegador (clique simples sem navegar, cliques modificados não interceptados, Enter/Espaço). Mutations: sem interceptação → 54 falhas em `filters-desktop`; `?class=` de volta → 17 em `build-filters-html`. Contratos definitivos de posição do primeiro cartão: 320/390 ≤ 420 px, 768 ≤ 480 px, 1280 exclusivamente relativo (≤ 220 px após o título; 211 aprovado); metas anteriores registradas como substituídas; o gate deixa de imprimir metas substituídas | R-FILT-14, §12.2, §14; [`plans/phase-3-report.md`](plans/phase-3-report.md) §14 |
| 2026-09-10 | **Uma emulação de texto a 150 % quase inverteu uma conclusão.** `documentElement.style.fontSize` escala `rem` mas não as consultas de média em `rem`, e mediu a linha do header 68 px mais larga do que o Chrome a desenha — o suficiente para reportar como "transbordo criado pela Fase 2" uma largura que cabe nos dois SHAs. `Page.setTextScale`, que é a definição de tamanho de texto do próprio browser, foi acrescentado ao harness | `scripts/headless.ts`; [`plans/phase-2-report.md`](plans/phase-2-report.md) §10.6 |

---

## 19. Disposição dos 25 findings da revisão independente

Legenda: **incorporado** (o PRD mudou como proposto), **hipótese/spike** (convertido em pergunta de protótipo ou spike), **removido** (saiu do escopo), **rejeitado** (com justificativa e evidência).

| # | Sev. | Finding | Disposição | Onde no PRD |
|---|---|---|---|---|
| B1 | BLOCKER | Meta de altura da Fase 1 (≤ 12.000 px) aritmeticamente inatingível | **Incorporado.** Baselines separados por bloco; meta da Fase 1 ≈ 17.500 px (tiers compactos por padrão) e ≤ 21.000 px com um tier expandido, com a aritmética escrita; ≤ 12.000 px é meta transversal condicionada às Fases 4 e 6d, com a origem de cada redução nomeada | 12.1; Fase 1 |
| B2 | BLOCKER | R-BUILD-1 exige "acima da dobra" e "na região de Resumo" ao mesmo tempo | **Incorporado.** Posição única (após o bloco de título, antes de "Como se joga"); aceite numérico (topo ≤ 560 px em 320×640) mais validação pela jornada J3 | R-BUILD-1, J3 |
| B3 | BLOCKER | Contrato sem JS contraditório entre R-BUILD-12, R-FILT-2 e R-A11Y-12 | **Incorporado.** Navegação (seis âncoras, sempre no HTML) separada de preferência (só com JS) em `R-PREF-4`; R-FILT-2 compartilha estilo, não contrato; nenhum controle promete persistência sem JS | R-PREF-4, R-BUILD-1, 12, R-FILT-2, R-A11Y-12 |
| H1 | HIGH | D13 parcialmente incorreto (404 já tem header); P2.9 pede "um idioma por rota", refutado por medição | **Incorporado com decisão adicional do proprietário.** D13 reescrito como "404 sem busca"; P2.9 removido inteiramente (nem busca no 404 é iniciativa); limitação bilíngue/`<html lang>` registrada em 17.5 com a medição; "um idioma por rota" em 17.6 | D13, 17.5, 17.6, 13 |
| H2 | HIGH | R-TREE-3 usa 288 px (reais: 280) e ignora o trilho de 36 px | **Incorporado + hipótese.** 280 px em todo o documento; trilho tratado como pergunta 2 do protótipo (hipótese inicial: suprimido abaixo de 640 px); largura do nó, vão e formato passam a ser saídas do protótipo | R-TREE-0, 1, 3; 17.2 |
| H3 | HIGH | R-TREE-8 cita baseline do regime errado (~1.500 px; real 3.511 px) e a meta de 600 px não fecha com fileira de 88 px | **Incorporado + hipótese.** Baseline 3.511 px (320 px) / 3.443 px (390 px); altura da fileira e orçamento por tree são saídas do protótipo (pergunta 7), com o limite de nó ≥ 44 px nos dois eixos | R-TREE-0, 3, 8; 12.2 |
| H4 | HIGH | R-TREE-13 remove o invariante de alcançabilidade por setas sem substituto | **Incorporado.** Alcançabilidade preservada como requisito e como teste sobre as 24 árvores; navegação previsível com fallback definido; casos em três classes | R-TREE-13, R-A11Y-11 |
| H5 | HIGH | E8 contradiz R-I18N-5; `resultsOne/Many`, `effectChance`, `effectMana` já corretos | **Incorporado.** D12 e E8 podados; as três chaves registradas como "não são defeitos"; lista de termos mantidos vive uma vez no ADR 0003 | 2.2, E8, R-I18N-5, 6 |
| H6 | HIGH | D10 chama de desatualizado o `<details>` do menu (decisão vigente); esconde D14 (limiar sobre 29 builds); "1009" é medição histórica | **Incorporado.** D10 podado; E6 dividido em E6a (higiene), E6b (não mexer) e E9/R-FILT-17 (limiar remedido, P0.3, bloqueia a Fase 3); menu descrito como `<details>` deliberado que fecha em navegação, Escape e interação externa | 2.1, 2.2, E6a/b, E9, R-FILT-17, P0.3 |
| H7 | HIGH | R-BUILD-3 com aceite não verificável ("idêntico exceto pelo controle") | **Incorporado.** Aceite executável: seis `#gear-*` como `<details>` fechados com resumo; lista de headings igual à atual; nenhum `aria-pressed="true"`; com a decisão "todos compactos", o requisito mudou de conteúdo | R-BUILD-3 |
| M1 | MEDIUM | O PRD escreve à mão contagens sobre o site (902 chaves, 40 scripts) | **Incorporado.** Contagens datadas ou substituídas por predicados; divergência de método (881–922) registrada; "~45 scripts" datado | 2.1, O5, 12.2, 17.5 |
| M2 | MEDIUM | Desabilitar opções em zero pode silenciar informação útil; não especificado junto com "remover último filtro" | **Incorporado.** R-FILT-4 unifica contagens condicionais, `0` visível em opção desabilitada, estado vazio só por URL e "Remover último filtro" definido como o último `pushState` | R-FILT-4 (R-FILT-7 absorvido) |
| M3 | MEDIUM | "Para o meu estágio" indefinido demais para ser padrão | **Incorporado.** "Recomendado" continua padrão sempre; "Para o meu estágio" disponível com preferência, critério publicado com teste e `?`, marcado como hipótese validada na sessão da Fase 3 | R-FILT-5, 7.1, 17.7 |
| M4 | MEDIUM | 6.1 promete impressão e leitura completa; R-BUILD-5 (`hidden`) e R-BUILD-15 (impressão do tier ativo) tiram as duas | **Incorporado.** `<details>` em vez de `hidden`; impressão desacoplada do modo compacto e movida para possibilidade futura (se existir, expande os seis tiers) | 6.1, R-BUILD-5, 15, 2.4 |
| M5 | MEDIUM | R-BUILD-10 prescreve mecanismo (script inline antes da pintura) | **Incorporado.** Só o resultado (CLS < 0,1) e a restrição (nenhuma exceção nova ao teste de fronteira); mecanismo vira hipótese do plano | R-BUILD-10 |
| M6 | MEDIUM | R-TREE-17 mistura orçamentos não medidos (40 KB, 15%) com regra de identidade | **Incorporado.** Resultado (HTML dentro do teto definido pelo spike; ícones tematizáveis por CSS); sprite, teto por classe, formato e proibição de raster reclassificados como hipóteses do spike, por decisão do proprietário | R-TREE-17, 17.7 |
| M7 | MEDIUM | Sticky "em todas as larguras" sem orçamento vertical em 320 px | **Incorporado.** Sticky só a partir de 640 px; abaixo, chips roláveis; orçamento combinado ≤ 112 px registrado em R-A11Y-8 para o caso de um dia existir | R-BUILD-4, R-A11Y-8 |
| M8 | MEDIUM | Fase 5 grande demais | **Incorporado.** Roadmap reestruturado em 0A, 0B, 1, 2, 3, 4, 5, 6a–6d, fluxo editorial contínuo e Fase 7 aberta | 14 |
| M9 | MEDIUM | Quatro linhas da rastreabilidade apontam para baldes (P1.5, P1.6) | **Incorporado.** `R-NAV-1…4` e `R-LEVEL-1…2` criados com aceite; matriz reapontada | 13.1, 16 |
| M10 | MEDIUM | Achado perdido: índice de skills por classe (404) | **Incorporado como recusa registrada.** Árvore e busca cobrem o acesso; rota não será criada | 17.6, 16 |
| L1 | LOW | "Busca em 2 toques" listada como métrica é estado atual | **Incorporado.** Movida para 2.1/J12; fora da tabela de metas | 2.1, 12.2 |
| L2 | LOW | `d2rc.level` fora da lista de R-PREF-3 | **Incorporado.** Adicionada | R-PREF-3 |
| L3 | LOW | Instalação como app aparece três vezes | **Removido.** PWA saiu do roadmap por decisão do proprietário; consta só em 1.6, 2.4, 3.2 e 17.6 como fora do roadmap | 1.6, 2.4, 3.2, 17.6 |
| L4 | LOW | Gate de R-A11Y-6 é um `grep` | **Incorporado.** Redação diz que é verificação de presença | R-A11Y-6 |
| L5 | LOW | O3 subdeclara R-A11Y-4 (44 px) | **Incorporado.** O3 cita R-A11Y-4 com os dois limiares | O3 |

**Contradições C1–C12:** todas resolvidas pelas disposições acima (C1→B3, C2→B2, C3→B1, C4→H5, C5→H6, C6→H1, C7→H2, C8→H3, C9→M4, C10→H4, C11→M1, C12→L2).

**Requisitos prematuros (§5 da revisão):** R-BUILD-10 (mecanismo removido), R-TREE-17 (orçamentos viram spike), R-BUILD-11 (`aria-pressed` escolhido; `tablist` descartado), R-BUILD-5 (`<details>` escolhido), R-FILT-2 (mesmo estilo, contratos distintos), R-TREE-8 (resultado declarado; custo medido no protótipo). Por decisão do proprietário, também reclassificados como hipóteses: sprite SVG obrigatório, teto de 40 KB, proibição absoluta de raster, aumento máximo de 15% do HTML, scripts inline, `hidden` como sinônimo de acessível, e componentes/arquivos prescritos (o PRD passa a nomear resultados e, quando cita um arquivo, é como localização de evidência, não como prescrição).

**Requisitos ausentes (§6 da revisão):** A1→R-FILT-17/E9; A2 e A3→R-TREE-0 (perguntas 2 e 7) e R-TREE-1/3; A4→R-TREE-13; A5→R-A11Y-8; A6→R-NAV/R-LEVEL; A7→17.6; A8→2.4 e R-BUILD-15 (impressão futura expande os seis); A9→R-TREE-0 (oito perguntas do proprietário mais os critérios da revisão); A10→R-FILT-4.

**Itens a remover (§8 da revisão):** todos removidos (P2.9 nas duas partes, D10 parte `<details>`, D10/E8 chaves já corretas, E6 parte "1009", P3.7 JSON-LD, P3.1 comparação, P3.4 PWA, P3.8 rótulo no cartão, formulário GET de R-FILT-14, impressão acoplada). P3.2 favoritos mantido conforme a correção da própria revisão (custo marginal de uma chave).

**Recomendações de Q1–Q5 (§11 da revisão):** Q1 permanece aberta até o spike (a recomendação "conjunto CC BY" não é decisão; nenhum subconjunto é cobertura final); Q2 resolvida pela terceira opção (todos compactos); Q3 vira saída do protótipo (Q2 desta versão); Q4 e Q5 removidas. Dez das onze unidades de fase propostas foram adotadas ou subdivididas; a única diferença é que 1a/1b da revisão viraram Fases 1 e 2 deste documento, e o protótipo/spike ganharam a Fase 0B própria.
