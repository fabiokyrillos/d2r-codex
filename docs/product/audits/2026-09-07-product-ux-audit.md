> **Registro de revisão do proprietário (2026-09-07).** Este relatório é preservado integralmente como evidência. Após a leitura, o proprietário aprovou as recomendações com uma alteração de escopo: **compartilhamento e recursos sociais estão fora do produto** (og:image, previews para WhatsApp/Discord/redes, compartilhamento de builds, perfis, contas, colaboração, sincronização). Onde este relatório trata a ausência de `og:image` como P0 (item B0.3) ou cita compartilhamento como valor, essa parte foi descartada. O documento vigente é o [PRD vNext](../PRD-vNext.md).

# Auditoria de produto, UX e design — D2R Codex

Data: 2026-09-07 · Produto: https://d2r-codex.vercel.app · Repositório: `D:\Projetos\GitHub\d2r-codex` @ `7e69fca` (main = origin/main, worktree limpo)
Modo: somente leitura. Nenhum arquivo do repositório, commit, deploy ou configuração foi alterado.

Legenda de classificação usada em todo o documento:

- **[DEFEITO]** comportamento comprovado que contraria o que a própria página promete ou que quebra uma jornada.
- **[USABILIDADE]** funciona, mas custa esforço, tempo ou confiança ao usuário.
- **[OPINIÃO VISUAL]** julgamento de design; explico o porquê, mas é discutível.
- **[HIPÓTESE]** suspeita plausível ainda não verificada com usuários ou dados.
- **[OPORTUNIDADE]** algo que não existe e que atenderia a uma necessidade real de jogador.

---

## 1. Resumo executivo

### Estado geral

O D2R Codex já é um produto editorial sério, não um protótipo. A tese ("todo guia começa no best in slot; este começa onde você está") é verdadeira no conteúdo: as 53 builds têm os mesmos 11 blocos (como se joga, resumo, forças/fraquezas, como chegar lá, skills, atributos, breakpoints, imunidades, seis tiers de equipamento, mercenário, onde farmar) e notas de solo self-found e Hardcore. A base de referência (53 runewords, 34 runas, 66 itens, 21 áreas, 10 mecânicas, breakpoints com tabelas do Warlock) é interligada nos dois sentidos, e o pt-BR é uma tradução real, não um fallback.

O que ainda não acompanha o conteúdo é a **camada de apresentação e de orientação**: páginas de build de 19 mil px no desktop e 32 mil px no celular sem nenhuma forma de "ir direto ao meu tier"; árvores de skills que só existem como árvore acima de 1024 px; filtros que ocupam a primeira dobra inteira; e uma série de textos de rodapé e notas que ficaram para trás quando o conteúdo cresceu ("por que tão poucas builds?", "classes aguardando guias", "cinco classes documentadas"). O produto está tecnicamente correto e conteudisticamente forte, mas ainda não oferece a sensação de ferramenta de consulta rápida que um jogador quer ter aberta na segunda tela.

### Maiores qualidades (preservar)

1. **Modelo mental de progressão em seis tiers**, com "o que consertar em seguida" ao fim de cada tier. É a diferenciação real frente a Maxroll e Icy Veins e aparece consistentemente nas 53 builds.
2. **Honestidade editorial**: confiança rotulada ("Fonte única", "Não verificado"), discordâncias documentadas na página de fontes, dados de área extraídos de levels.txt, alerta explícito de que guias com sete classes estão desatualizados.
3. **Grafo de conteúdo**: build → item/runeword → "builds que usam" → área de farm → "builds que farmam aqui". A página de runeword lista "quem usa" gerada dos dados; a área de farm lista builds.
4. **Identidade visual coerente**: Cinzel para títulos, Inter para texto, mono para números; paleta abyss/ember; hierarquia de texto boa; contraste adequado no corpo. Não parece template.
5. **Fundamentos técnicos**: estático, sem imagens pesadas, carregamento de 100 a 200 ms com cache morno, hreflang e canonical corretos, troca de idioma preservando a rota, busca com 520 entradas por idioma, foco visível em todos os controles, skip link funcional, roving tabindex na árvore.
6. **pt-BR de qualidade**: terminologia do jogo mantida em inglês onde a comunidade usa (Spirit, Teleport, Hell), texto traduzido com naturalidade, filtros e chips traduzidos.

### Cinco maiores problemas

1. **[USABILIDADE] A página de build não permite "cair" no tier certo.** Os seis tiers são empilhados (a seção Gear vai do px 6.066 ao 16.357 no desktop; 32 mil px no celular). A navegação por tier é só um conjunto de âncoras dentro de uma barra sticky, sem estado, sem memória, sem versão mobile visível no topo. A promessa da home ("você acha o que corresponde ao que realmente tem") depende de rolar.
2. **[DEFEITO] Textos de cobertura contradizem o site.** `/classes` diz "cinco classes totalmente documentadas… Assassin sem builds… Barbarian só visão geral… Warlock só atributos", enquanto a mesma página lista 7, 6 e 4 builds e guias de evolução para elas. `/builds` termina com "Por que tão poucas builds?" e um título órfão "Classes aguardando guias de build" sem nada abaixo (em EN e PT). Isso corrói exatamente a confiança que a página de fontes constrói.
3. **[DEFEITO] Equipamento do mercenário na build mostra slugs crus.** Em todas as builds inspecionadas, a seção Mercenário renderiza "insight", "infinity", "treachery", "vampire gaze" em minúsculas e sem link, ao lado de "Andariel's Visage" com nome resolvido. A página `/mercenaries` renderiza corretamente, então é um problema apenas do bloco na build.
4. **[USABILIDADE] A árvore de skills deixa de ser árvore no celular.** Abaixo de 640 px (todo telefone) ela vira uma lista de uma coluna agrupada por "Level 6 / Level 12", sem conectores nem posição; o painel de detalhes vira uma gaveta inferior (bem feita, com foco preso e scroll travado). Em tablet a grade 3×6 e os conectores sobrevivem. Como a maior parte da consulta "durante o jogo" acontece no celular, o componente perde a função de mapa justamente onde é mais consultado. As posições dos nós, por outro lado, já são as do jogo (linha/coluna extraídas dos arquivos de dados), o que torna a evolução muito mais barata do que parece.
5. **[DEFEITO] Sem imagem de compartilhamento.** `twitter:card=summary_large_image` está declarado, mas não existe `og:image` (nem `/opengraph-image`, que retorna 404). Todo link compartilhado no Discord, WhatsApp ou Reddit aparece sem preview. Para um site que depende de boca a boca em comunidades, isso é a porta de aquisição fechada.

### Maior oportunidade de diferenciação

**Transformar a página de build em um "companheiro de sessão"**: o jogador escolhe nível e tier uma vez (persistido), e a build passa a mostrar apenas o que importa para ele agora, com um modo compacto para segunda tela ou celular. Nenhum concorrente faz isso; Maxroll e Icy Veins mostram tudo para todos. O conteúdo em seis tiers já existe; falta a interface que o entregue como progressão em vez de como documento.

---

## 2. Diagnóstico por página

### 2.1 Home (`/en-us`, `/pt-br`)

- **Objetivo**: explicar a tese, levar a uma classe ou às builds.
- **Funciona**: manifesto claro em duas frases; os seis tiers apresentados como perguntas do jogador ("Cheguei no Hell e estou morrendo. E agora?"), que é a melhor peça de copy do site; grade de classes com contagem de builds; nota de precisão que já filtra guias desatualizados; rodapé com patch e data de verificação.
- **Não funciona**:
  - [USABILIDADE] Os seis cartões de tier são estáticos. O usuário lê "04 Econômico — consigo farmar o Hell" e não pode clicar; a promessa "você acha o que corresponde ao que tem" não tem caminho.
  - [USABILIDADE] "Começar um personagem" leva direto a `/leveling/sorceress`, sem escolher classe. Um jogador de Paladin clica e cai na Sorceress.
  - [OPINIÃO VISUAL] Abaixo das classes, os três blocos (Evolução, Farm, Runewords) são texto sem moldura sobre fundo preto; parecem rodapé antes do rodapé. Faltam Runas, Itens, Breakpoints e Mercenários, que só existem no menu "Menu ▾".
  - [OPINIÃO VISUAL] Área visual vazia entre o herói e "Progressão": o herói ocupa metade da largura e nada acontece à direita em 1280 px.
- **Evidência**: capturas `home-desktop.png`, `home-320.png`; links da home (todos os cartões de tier sem href).
- **Recomendação**: tornar os tiers clicáveis para `/builds?tier=…` (ou para um seletor de nível), trocar "Começar um personagem" por um seletor de classe (ou levar a `/leveling`), e dar aos blocos de referência o mesmo tratamento de cartão das classes.
- **Prioridade**: P1 (tiers clicáveis, CTA), P2 (referência).

### 2.2 Classes (`/classes`)

- **Objetivo**: escolher uma classe.
- **Funciona**: "Melhor para", facilidade para iniciantes, contagem de builds e link de evolução em cada cartão; alerta do Warlock/DLC.
- **Não funciona**: [DEFEITO] a nota "Cobertura" (EN e PT) afirma que Assassin não tem builds nem evolução, Barbarian só tem visão geral e Warlock só atributos, contradizendo a própria página e a sitemap (Assassin 7 builds, Barbarian 6, Warlock 4, todos com leveling). Um leitor cuidadoso conclui que o site está desatualizado ou que não sabe o que tem.
- **Evidência**: texto capturado de `/en-us/classes` e `/pt-br/classes`.
- **Recomendação**: gerar a nota de cobertura a partir dos dados ou removê-la.
- **Prioridade**: P0 (é uma frase, mas mina a confiança na primeira página de decisão).

### 2.3 Página de classe (`/classes/sorceress` e similares)

- **Objetivo**: entender a classe, escolher build, ver árvore de skills e breakpoints.
- **Funciona**: texto de introdução excelente; "Mecânicas centrais" com o que guias genéricos erram (mastery não quebra imunidade; duas animações de cast); atributos com ganho por ponto; filtros locais com contagem; três árvores; tabelas de breakpoints comentadas.
- **Não funciona**:
  - [USABILIDADE] A página tem 7.400 px (Warlock) a 8.000+ px (Sorceress) sem sumário nem navegação interna; "Skill trees" começa em 3.600 px. Quem chega procurando a árvore não a vê.
  - [USABILIDADE] Os mesmos 5 grupos de filtros do `/builds` são repetidos na página de classe (menos o grupo Classe), ocupando ~350 px antes dos cartões, para filtrar 3 a 11 builds. Para a Necromancer (3 builds), o filtro é maior que o resultado.
  - [USABILIDADE] Não existe página índice de skills da classe (`/classes/sorceress/skills` retorna 404); as skills só são alcançáveis pela árvore ou pela busca.
  - [OPINIÃO VISUAL] O cartão "Leveling" tem o mesmo peso dos cartões de build; deveria ser o primeiro passo destacado ("Comece por aqui" já é o título da seção).
- **Evidência**: `class-sorc.png`, `class-sorc-skilltree.png`, mapa de h2 (Start here @563 · Skill trees @3622 · Breakpoints @5900).
- **Recomendação**: sumário sticky (ou abas) com Builds / Mecânicas / Atributos / Skills / Breakpoints; reduzir filtros na página de classe a chips de uma linha (Dano, Dificuldade, Orçamento) com "mais filtros"; criar índice de skills por árvore.
- **Prioridade**: P1.

### 2.4 Listagem de builds (`/builds`)

Detalhado na seção 5. Resumo:

- **Funciona**: 53 builds em cartões com classe, nome, uma frase precisa, chips (elemento, orçamento, dificuldade) e quatro notas em pontos; contagens por faceta; URL sincronizada (`?class=…&damage=…`); barra "Filtrando por" com remoção individual e "Limpar tudo"; estado vazio com explicação; bottom sheet no celular com "Mostrar N builds" que atualiza ao vivo (11 ao marcar Sorceress); Esc fecha a sheet; contador `aria-live`.
- **Não funciona**:
  - [DEFEITO] Rodapé estático "Por que tão poucas builds?" + título órfão "Classes aguardando guias de build" (EN e PT) em qualquer estado, inclusive com 53 resultados.
  - [USABILIDADE] As contagens de faceta não se estreitam com os filtros ativos (Necromancer marcado, "Frio (9)" continua 9, e o resultado é zero). O sistema convida a combinações vazias.
  - [USABILIDADE] Sem ordenação e sem explicação da ordem (Blizzard, 7 Paladins, 10 Sorceress…). Não é alfabética, nem por classe, nem por dificuldade.
  - [USABILIDADE] 28 caixas de seleção em 5 grupos antes do primeiro cartão (490 px no celular de 320, 770 px no tablet). Em 768 px o usuário rola uma tela inteira de checkboxes antes de ver uma build.
  - [USABILIDADE] O campo de busca local ("Nome, classe ou apelido") e a busca global (Ctrl K) coexistem sem relação; o usuário não sabe qual usar.
  - [OPINIÃO VISUAL] Os quatro pares "Velocidade de limpeza / Magic find / Sobrevivência / Solo self-found" com cinco pontos cada aparecem em todos os 53 cartões. Em uma grade de duas colunas, são 20 pontos por linha; o olho para de ler. Os chips de tag (borda cinza, texto cinza) competem com os pontos ember pela atenção.
- **Evidência**: `builds-top.png`, `builds-empty.png`, `builds-sheet-390-selected.png`, `builds-768.png`.
- **Prioridade**: P0 (rodapé), P1 (modelo de filtros).

### 2.5 Página de build (`/builds/<classe>/<slug>`)

- **Objetivo**: dizer ao jogador o que fazer agora e o que consertar em seguida.
- **Funciona**: a estrutura de 11 blocos é a melhor do ecossistema; "Como se joga" em prosa; "Como chegar lá" com aviso "não evolua com esta build" e link para o walkthrough; árvore com pontos e papéis (Maximizada / Utilidade / Pré-requisito / Obrigatória); tabela "Maximize nestas, nesta ordem" com o porquê; atributos em linguagem direta ("Energia: nenhum. Zero."); breakpoints com prioridade (obrigatório / recomendado / luxo); imunidades como restrição real; cada slot com alternativa "ou", "Procure por:" e "Sockets:"; "O que consertar em seguida" ao fim de cada tier; mercenário; onde farmar ordenado pela build com tier mínimo; notas SSF e Hardcore.
- **Não funciona**:
  - [USABILIDADE] 18.931 px no desktop e 31.939 px em 390 px. Não há sumário da página (11 seções). A barra de tiers é sticky, mas só aparece quando o usuário já chegou à seção Gear (px 6.066); nas 6 mil px anteriores nada indica que existem tiers.
  - [USABILIDADE] Os tiers são âncoras, não estado. Ir de "Econômico" para "Otimizado" significa rolar por ~2 mil px de Starter/Nightmare/Early Hell no caminho de volta. Não há "meu tier" persistido entre builds.
  - [DEFEITO] Mercenário › Gear renderiza slugs ("insight", "infinity", "treachery", "vampire gaze") sem link; "Andariel's Visage" resolvido. Confirmado em Blizzard Sorceress; a estrutura é a mesma em todas as builds.
  - [USABILIDADE] Nenhum link para páginas de skill fora do painel da árvore (0 links `/skills/` na página). A tabela "Maximize nestas" cita Blizzard, Glacial Spike, Ice Blast, Ice Bolt sem link.
  - [USABILIDADE] "Onde farmar" ordena por adequação da build, mas não diz o que a build precisa de imunidade/sunder em cada área (a informação existe na página de área).
  - [OPINIÃO VISUAL] O bloco "Resumo" (oito linhas de pontos) repete a informação dos chips e ocupa uma dobra inteira no celular antes de qualquer conteúdo acionável.
  - [USABILIDADE] Profundidade desigual entre builds. Confirmado nos dados: todas as 53 têm os seis tiers e todas as seções (imunidades, Hardcore, SSF, mercenário, farm), mas o número de escolhas por build vai de 43 (Tesladin, Melee Sorceress, Freezing Arrow) a 74 (War Cry Barbarian), e as alternativas "ou" vão de 1 (Holy Fire, Poison Javelin) a 34 (Blizzard). Os tiers "Início" de Paladin, Sorceress e Amazon têm 4 a 5 slots contra 10 nos de Barbarian e Assassin. Não é um defeito; é um risco de percepção ("esta build é de segunda") que pode ser sinalizado com o rótulo de confiança que já existe (4 builds Warlock são "fonte única", 3 são "consenso da comunidade").
- **Evidência**: `build-y540.png`, `build-y1500.png`, `build-y6040.png`, `build-merc-390.png`, `build-skills-320.png`; contagem de links; medição de altura.
- **Recomendação**: ver Backlog B1, B3, B4 e seção 7.
- **Prioridade**: P0 (mercenário), P1 (navegação por tier e sumário).

### 2.6 Página de skill (`/classes/<classe>/skills/<skill>`)

- **Objetivo**: consulta rápida durante o jogo.
- **Funciona**: "Resumo" em tabela (árvore, nível, teto, tipo, elemento, mana), "Como funciona" em três bullets, pré-requisitos, desbloqueia, sinergias recebidas e dadas com a nota sobre pontos duros, "Builds que usam" com pontos investidos, navegação "todas as skills". Breadcrumb correto. Tudo em 2.500 px.
- **Não funciona**:
  - [USABILIDADE] "Dano por nível" mostra apenas nível 1 e 20. Para consulta em jogo, o jogador quer ver o nível dele (ou 1/5/10/15/20/25/30 com +skills).
  - [USABILIDADE] Sem navegação anterior/próxima na árvore, nem link de volta à posição na árvore da classe (a página de classe não tem âncora por skill).
  - [OPINIÃO VISUAL] O ícone é um glifo genérico (estrela de quatro pontas) igual para toda skill de "Magia"; não ajuda a reconhecer a skill.
- **Prioridade**: P2.

### 2.7 Evolução (`/leveling`, `/leveling/<classe>`)

- **Objetivo**: ser seguido em paralelo ao jogo.
- **Funciona**: índice com as decisões-chave por classe; tabela de transições de dificuldade com o porquê; penalidade de resistência explicada com exemplo numérico; quests que valem a pena; guia por etapas (6 a 8) com objetivo, com o que matar, pontos de skill por nível, atributos, o que fazer (com ícones por tipo), equipamento a caçar e "pronto para avançar quando"; barra de etapas sticky.
- **Não funciona**:
  - [USABILIDADE] 12.400 px sem marcação de progresso: quem volta ao guia no dia seguinte precisa lembrar a etapa. Não há "estou aqui" nem checkbox local.
  - [USABILIDADE] A barra de etapas transborda horizontalmente no desktop (o oitavo item corta em "Ni…") e não tem indicador de rolagem.
  - [USABILIDADE] O guia de Sorceress leva à Blizzard; jogadores que vão de Lightning ou Fire Ball têm que inferir onde o caminho diverge. O Warlock tem "Respec planning" como seção, o que é o modelo certo.
  - [OPORTUNIDADE] Nada de Nightmare/Hell como "fase de farm" no mesmo formato de etapa (o guia termina em "Hell 60–80" e entrega para a build).
- **Prioridade**: P1 (progresso persistido), P2 (barra de etapas).

### 2.8 Farm (`/farming`, `/farming/<área>`)

- **Funciona**: explicação de alvl 85 e treasure class; cartões com ato, alvl, imunidades; página de área com "Por que correr", "Como chegar", "O que esperar", bosses, "Builds que farmam aqui".
- **Não funciona**: [USABILIDADE] sem filtro por classe/build/elemento ("quero uma área sem imunes a frio"), que é a pergunta real; sem Terror Zones em rotação nem relação com a mecânica já documentada. [OPINIÃO VISUAL] O selo "alvl 85 TOP TC" em mono laranja é o único elemento vibrante da página e se repete dez vezes; perde valor.
- **Prioridade**: P2.

### 2.9 Runewords, Runas, Itens (`/runewords`, `/runes`, `/items`)

- **Funciona**: runewords agrupadas por tier de relevância (é a melhor decisão editorial da referência), runas em ordem com "+", base explícita; página de runeword com erros comuns, "quem quer isso" e "builds que usam" gerado; runa com receita de upgrade e runewords que a usam; itens com base e nível.
- **Não funciona**:
  - [USABILIDADE] Nenhuma dessas três páginas tem filtro ou busca local (0 controles). 53 runewords em 7.400 px sem filtrar por tipo de base, sockets ou classe; 66 itens em 6.000 px sem filtrar por slot ou classe. A pergunta "runeword de 3 sockets para elmo" exige rolagem.
  - [USABILIDADE] "Itens" tem 66 entradas por decisão editorial ("catalogados quando um guia precisa"). Está explicado, mas a busca global devolve "Nightwing's Veil" e não "Tal Rasha" (ausente). A lacuna deveria aparecer como "ainda não catalogado" na busca.
  - [OPINIÃO VISUAL] Os cartões de runeword são o melhor cartão do site (nome Cinzel, runas em chips numerados, base em texto discreto). Este padrão deveria ser a referência para os cartões de build.
- **Prioridade**: P2.

### 2.10 Breakpoints, Mercenários, Mecânicas, Fontes

- **Funciona**: breakpoints com a explicação "104% vale o mesmo que 63%", tabelas por classe com notas; mercenários com "a dificuldade da contratação é permanente"; mecânicas com "fórmulas, não vibes"; fontes com hierarquia de fontes, discordâncias registradas e rótulos de confiança. É o conteúdo que constrói autoridade.
- **Não funciona**: [USABILIDADE] breakpoints é uma tabela estática; a pergunta do jogador é "tenho 80% FCR, em que frame estou?" (calculadora de uma linha). [USABILIDADE] Mecânicas e Fontes só são alcançáveis pelo menu "Menu ▾" ou rodapé.
- **Prioridade**: P2/P3.

### 2.11 Busca (Ctrl K)

- **Funciona**: índice de 520 entradas por idioma (skills, builds, itens, runewords, mecânicas, páginas), categorias, teclado (↑↓ ↵ esc), resultados relevantes ("resist" devolve as três skills, a mecânica e Lower Resist). Em pt-BR, "frio" encontra Ice, Cold Rupture e mecânicas.
- **Não funciona**: [USABILIDADE] não há botão de busca visível no celular além da lupa no header (ok), mas a busca local de builds e a global não se conversam. [USABILIDADE] Sem busca por sinônimos/apelidos entre idiomas (em pt-BR, "gelo" primeiro mostrou "Carregando índice…" e não pude confirmar resultados; "frio" funcionou). [OPORTUNIDADE] Áreas de farm e runas não apareceram nas consultas testadas.
- **Prioridade**: P2.

### 2.12 404

- [USABILIDADE] A página mostra EN e PT empilhados, sem header nem navegação, sem busca. Funciona, mas parece página de erro de servidor.
- **Prioridade**: P3.

---

## 3. Jornadas

| Jornada | Estado | Onde flui | Onde trava |
|---|---|---|---|
| Descoberta pela home | Fluida até a escolha; **interrompida** nos tiers | Manifesto, classes | Tiers não clicáveis; "Começar um personagem" vai para a Sorceress |
| Escolha de classe | Fluida | Cartões com "melhor para" | Nota de cobertura contradiz a página |
| Listar e filtrar builds | Funciona; **confusa** | URL sincronizada, chips de remoção, sheet mobile | Facetas não se estreitam; sem ordenação; rodapé "poucas builds"; 28 caixas antes do conteúdo |
| Abrir uma build | Fluida no desktop; **cansativa** no celular | Estrutura dos 11 blocos | 19 mil / 32 mil px; sem sumário; tiers só por âncora |
| Entender equipamento e alternativas | Fluida | "ou", "Procure por", "Sockets", "o que consertar" | Mercenário com slugs; profundidade desigual entre builds |
| Navegar pela árvore de skills | Fluida em ≥640 px; **incompleta** no celular | Teclado, caminho de pré-requisito em ember, posições do jogo | Vira lista abaixo de 640 px; painel lateral só a partir de 1024 px |
| Abrir uma skill individual | Fluida | Sinergias nos dois sentidos, builds que usam | Dano só em nível 1 e 20; sem anterior/próximo |
| Leveling | Fluida; **sem memória** | Etapas com "pronto quando" | Sem progresso persistido; barra corta no desktop |
| Trocar idioma | Fluida | Preserva a rota; hreflang | Termos de slot em inglês no pt-BR ("Amulet", "Belt", "Charms") |
| Busca | Fluida | 520 entradas, teclado | Duas buscas sem relação |
| Voltar e navegar entre relacionados | Fluida entre build ↔ item ↔ runeword ↔ área | "Builds que usam", "builds que farmam aqui" | Build → skill exige abrir o painel; itens → sem "usado por" na lista |
| 320 / 390 / tablet / desktop | Sem overflow horizontal em nenhum; header cabe em 320 | Tipografia escala bem; árvore 3×6 sobrevive em tablet | Tablet ganha 770 px de filtros antes da primeira build; celular tem 32 mil px por build e árvore em lista |
| Teclado | Fluida | Skip link, foco visível 2 px, roving tabindex, Esc fecha sheet e menu | Setas na árvore saltam em diagonal (Ice Blast → Shiver Armor); sem atalho para pular tiers |
| Sem conhecimento prévio | Boa na home; **frágil** na referência | Copy em perguntas do jogador | Runas/Itens/Breakpoints/Mercenários/Mecânicas escondidos em "Menu ▾" |

Perspectivas de usuário:

- **Iniciante**: bem servido pelo copy e pelo leveling; perde-se no tamanho da build e não sabe que "Menu ▾" guarda a referência.
- **Retornante**: encontra o alerta de oito classes e a data de verificação (ótimo); sente falta de "o que mudou no 3.3" em uma página.
- **Experiente**: quer tabela, não prosa; sente falta de filtro em runewords/itens, calculadora de breakpoint e comparação entre builds.
- **Mobile**: header e tipografia excelentes; build de 32 mil px e árvore em lista (abaixo de 640 px) são o custo.
- **Procurando uma build rápido**: busca global resolve em dois toques; a listagem não.
- **Seguindo leveling**: bom guia, sem memória de etapa.
- **Comparando builds**: não há caminho; precisa abrir duas abas.
- **Consultando skill em jogo**: página de skill resolve; falta o dano no nível atual.
- **Alternando PT/EN**: perfeito na navegação; alguns rótulos de slot ficaram em inglês.

---

## 4. Árvores de skills

### O que existe hoje (observado em produção e confirmado no código)

- Grade por tree: 3 colunas × 6 fileiras de nível (1/6/12/18/24/30). **As posições são as do jogo**: `content/classes/skill-graph.ts` (240 nós gerados de um commit fixo dos dados do jogo) carrega `row`, `column`, `tree`, `requiredLevel` e `prerequisites` por skill, e `lib/skills.ts` monta a grade a partir disso, preservando células vazias. No Cold, por exemplo, Ice Bolt e Frozen Armor na fileira 1 (colunas 2 e 3), Frost Nova e Ice Blast na fileira 2 (colunas 1 e 2), Shiver Armor na fileira 3 (coluna 3), como no jogo.
- Nós como cartões com glifo por tipo (Magia/Buff/Passiva/Invocação) colorido por elemento (`components/game/skill-sigil.tsx`, SVG inline, com nota explícita de que a arte da Blizzard não é licenciável), nome e tipo. Conectores em SVG (`viewBox 0 0 3 rows`, traço sem escala) com o caminho do nó selecionado em ember. Na build, cada nó ganha papel e pontos (Maximizada 20, Utilidade 1, Pré-requisito 1, "—").
- Painel de detalhes: coluna sticky à direita a partir de 1024 px; abaixo disso, bottom sheet `role=dialog aria-modal` com foco preso, scroll travado e retorno de foco. Hover só quando `(hover: hover)`.
- Teclado: `role=grid/row/gridcell`, roving tabindex (um Tab por tree), setas com funções puras testadas (`lib/skill-tree-nav.ts`), Home/End, Enter/Espaço, Escape com guarda contra reabertura. Um bloco `<noscript>` reproduz a árvore como lista com links.
- Abaixo de 640 px: uma coluna agrupada por "Level N" e o SVG de conectores é ocultado (`hidden sm:block`).
- Sem ícones por skill; sem contagem de pontos por tree; sem nível de personagem; sem estado "bloqueado / disponível / alocado" fora da build.

### Comparação com a interface do jogo

A tela original tem, para cada tree, uma grade 3×6 com posições fixas por skill, setas de dependência, ícone 48 px em moldura, número de pontos no canto, e tooltip com descrição, nível atual e próximo. O Codex já tem **a estrutura e as posições**; o que falta para "ler como no jogo" é (1) o ícone reconhecível por skill, (2) o número de pontos no canto do nó e o total por tree, (3) o estado de desbloqueio por nível, e (4) a grade sobreviver no celular. A spec `docs/spec/0001-skills-experience.md` (status "Proposed", fases 1–5 não iniciadas) já previa parte disso e hoje está superada pelo grafo que cobre as 8 classes.

### Direção A — Réplica visual altamente fiel

- **Descrição**: grade 3×6 com posições do jogo, ícones originais, molduras douradas, fundo de pergaminho, setas de dependência, contador de pontos, tooltip no hover.
- **Valor para o jogador**: reconhecimento imediato; a tela do site "bate" com a tela do jogo, então o jogador acha a skill pela posição que memorizou.
- **Risco legal**: alto. Ícones, molduras e o fundo são obras protegidas por direito autoral da Blizzard; a disposição com a mesma arte constitui trade dress. O Legal FAQ da Blizzard concede licença para imagens do jogo "for home, noncommercial and personal use only", exige manter os avisos de copyright e é revogável a qualquer momento; as diretrizes de marca proíbem uso que implique relação, patrocínio ou endosso. Ela não cobre um site que venha a ter anúncios, patrocínio ou loja. Icy Veins, d2runewizard e o Arreat Summit servem os ícones originais; isso é prática de mercado, não licença. Fontes na seção de referências.
- **Acessibilidade**: ícones 48 px com nome só no tooltip falham para leitor de tela e para quem não decorou os ícones; contraste de dourado sobre pergaminho é ruim para texto pequeno; hover não existe em touch.
- **Responsividade**: a grade 3×6 com ícones cabe em 320 px (3 × ~90 px), o que é uma vantagem real sobre os cartões atuais; mas o tooltip precisa virar gaveta.
- **Performance**: 30 ícones × 8 classes = ~240 imagens (sprite ou WebP de 2 a 4 KB cada); irrelevante se em sprite por classe.
- **Esforço**: grande (assets, extração, licença, novo componente, testes visuais).
- **Identidade**: o site deixaria de parecer o D2R Codex e passaria a parecer uma cópia da tela do jogo com texto ao lado.

### Direção B — Estruturalmente fiel, identidade própria (recomendada)

- **Descrição**: manter a grade 3×6 com as posições do jogo (já existem) e a mesma topologia de setas (já existe); adicionar contador de pontos no canto do nó e total por tree; nível de personagem opcional como filtro de "desbloqueado/bloqueado"; nós **compactos** (ícone + nome em uma linha, ~88 px de largura) para que a grade de três colunas caiba em 320 px sem virar lista; conectores preservados em todos os tamanhos. Ícones **próprios**: glifos monocromáticos em SVG desenhados pelo projeto (uma silhueta por skill, não por tipo), dentro de uma moldura quadrada própria com a cor do elemento. Molduras, fundo e tipografia continuam sendo os do Codex (Cinzel, abyss, ember). Nome sempre visível (abaixo do ícone em ≥640 px; ao lado ou no `aria-label` abaixo disso).
- **Valor para o jogador**: a memória espacial do jogo funciona (mesma posição, mesma seta), que é o que "fidelidade" entrega de fato; e ganha o que o jogo não dá (pontos por build, sinergias, link para a página) em qualquer tela.
- **Risco legal**: baixo. Posição e dependências são dados de jogo (fatos), não arte; ícones e molduras são originais.
- **Acessibilidade**: nome em texto, contraste próprio, foco visível, gaveta em touch (já existe), setas do teclado alinhadas à grade (já existem).
- **Responsividade**: grade 3×6 compacta em 320 px; a única mudança de layout é o tamanho do nó, não a estrutura.
- **Esforço**: médio, e menor do que aparenta: a parte cara (dados de posição, grafo, teclado, sheet) está feita. Resta o nó compacto responsivo, os contadores e ~240 glifos SVG por fases (começar pelas 53 skills principais das builds; o glifo por elemento+tipo atual serve de fallback).
- **Identidade**: preserva e fortalece.

### Direção C — Evolução do layout atual

- **Descrição**: manter os cartões; adicionar pontos por tree, âncoras por skill e afinar as setas do teclado (hoje Ice Blast → direita cai em Shiver Armor, uma fileira abaixo); baixar o ponto de colapso para lista de 640 px para ~480 px com cartões menores.
- **Valor**: melhora incremental; não resolve o reconhecimento por ícone nem o celular de 320–480 px.
- **Risco**: nenhum. **Esforço**: pequeno. **Identidade**: preserva.

### Comparação

| Critério | A. Réplica | B. Estrutural | C. Evolução |
|---|---|---|---|
| Impacto para o jogador | Alto (reconhecimento) | Alto (reconhecimento + dados) | Baixo |
| Esforço | Grande | Médio | Pequeno |
| Risco legal | Alto | Baixo | Nenhum |
| Acessibilidade | Ruim sem trabalho extra | Boa | Boa |
| Mobile | Boa na grade, ruim no tooltip | Boa | Continua lista |
| Identidade do Codex | Perde | Fortalece | Mantém |
| Manutenção | Alta (assets por patch/classe nova) | Média | Baixa |

**Recomendação: B.** O que o jogador reconhece na tela do jogo é a posição e a seta, não o pergaminho; e isso o Codex já tem. B completa a leitura (ícone, pontos, estado) com risco baixo e leva a grade ao celular, que é onde hoje a árvore desaparece. A pode ser revisitada se um dia houver licença explícita. C é o primeiro sprint de B (contadores, âncoras, setas), não uma alternativa. Isto é uma proposta, não uma decisão de implementação.

---

## 5. Filtros

### Diagnóstico funcional

- Cinco grupos (Classe, Tipo de dano, Dificuldade, Orçamento, "Boa para"), 28 opções, todas multi-seleção; lógica OR dentro do grupo e AND entre grupos (observado: Cold devolve 9; Necromancer+Cold devolve 0; confirmado em `lib/builds/filter.ts`).
- Contagens são estáticas (totais globais), não condicionais: calculadas uma vez no servidor em `components/builds/filterable-build-list.tsx` e passadas como props imutáveis; o cliente recalcula só os resultados.
- "Boa para" = nota ≥ 4 (`GOOD_AT_THRESHOLD`), com a análise de distribuição que justifica 4 documentada no código.
- Filtros por ladder, hardcore, online, temporada, patch e estilo de jogo foram **recusados de propósito** (`REFUSED_FILTERS`, com motivos e teste). Esta auditoria concorda com a recusa e não os propõe.
- Existe uma string "Ocultar filtros" declarada nos dois dicionários e nunca renderizada (resto do modelo anterior, inline).
- URL reflete o estado; recarregar mantém; compartilhável.
- Barra "Filtrando por" com chips removíveis + "Limpar tudo"; estado vazio com botão "Limpar tudo".
- Mobile: botão "Filtros" com badge de ativos, bottom sheet `role=dialog aria-modal`, "Limpar filtros" / "Cancelar" / "Mostrar N builds" com N ao vivo; Esc fecha; foco vai para o botão de fechar.
- Busca local por nome/apelido no mesmo bloco.
- Sem ordenação; sem "salvar filtro"; sem contagem condicional; sem filtro por tier/nível (a informação que a home mais promove).

### Diagnóstico visual

- [OPINIÃO VISUAL] O bloco é uma **lista de formulário**, não uma ferramenta: checkboxes nativas quadradas em três colunas, rótulos com contagem entre parênteses, cinco títulos em caixa alta. Nada indica hierarquia entre "Classe" (decisão primária) e "Partidas de 8 jogadores" (raro).
- Densidade: 28 controles + 5 títulos + campo + contador + linha de rodapé explicativa ("'Boa para' significa 4 de 5…") = ~350 px em desktop, 490 px em 320, 770 px em tablet. É a primeira dobra inteira.
- Excesso de bordas: campo de busca com borda, cartões com borda, chips com borda, barra "Filtrando por" com chips com borda. Tudo tem a mesma borda cinza de 1 px; nada tem elevação.
- Estado selecionado: checkbox ember + rótulo branco; funciona, mas a única evidência de "aplicado" fica em uma barra abaixo que só aparece depois.
- O rodapé explicativo de "Boa para" é honesto, mas é uma frase de metodologia no meio do controle.
- No celular, a sheet é a melhor peça do conjunto (título, fechar, rodapé fixo com ação primária ember). O problema é o que está dentro dela: os mesmos 28 checkboxes.

### Proposta de simplificação

Princípio: **duas decisões primárias visíveis, o resto sob demanda**, e o resultado sempre visível ao lado.

1. **Classe** vira uma fileira de 8 chips com glifo (ou abas) acima da grade, sem contagem entre parênteses (a contagem vai para o chip como número pequeno).
2. **"Onde você está"** (novo, alinhado à tese): um segmento único de tiers/nível (Início · Nightmare · Início do Hell · Econômico · Otimizado · BiS) que filtra por "builds viáveis neste tier com orçamento ≤" e, quando aberta uma build, já rola para o tier. Este filtro substitui, na prática, "Orçamento".
3. **Mais filtros** (botão com badge): Tipo de dano, Dificuldade, "Boa para" em um popover no desktop e na mesma sheet no celular. "Boa para" ganha um único controle "Foco" com as 8 opções como chips de uma linha, sem caixas.
4. **Ordenar**: Recomendado (ordem editorial) · Mais fáceis · Mais baratas · A–Z.
5. **Busca local** some do bloco; o campo global (Ctrl K) já resolve nome/apelido. Se mantida, vira ícone dentro da barra de chips.
6. Contagens condicionais; opções com zero resultado ficam desabilitadas com o número 0.
7. A frase "'Boa para' significa 4 de 5" vira um `?` com tooltip no rótulo.

### Comportamento recomendado — desktop

- Linha 1: chips de classe (8) + "Ordenar" à direita.
- Linha 2: segmento "Onde você está" (6) + botão "Mais filtros (2)" + contador "9 builds".
- Chips aplicados aparecem **na própria linha 2** com ✕, não em uma barra separada.
- Grade começa em ≤ 220 px do topo do conteúdo.
- Popover de "Mais filtros" aplica ao vivo, fecha com Esc/click fora, mantém foco.

### Comportamento recomendado — mobile

- Linha 1: chips de classe em rolagem horizontal com fade nas bordas.
- Linha 2: "Onde você está" como select nativo ou chips roláveis; botão "Filtros (2)" abre a sheet atual.
- Sheet: mantém "Mostrar N builds" ao vivo; grupos colapsáveis com o primeiro (Dano) aberto; "Limpar" no cabeçalho.
- Primeiro cartão visível em ≤ 300 px.

### Estados necessários

Padrão · com filtros aplicados (chips inline) · vazio (com "remover último filtro" e sugestão de builds próximas) · carregando índice (busca) · opção com zero resultado (desabilitada) · sheet aberta (scroll do body travado, foco preso) · filtro vindo da URL (chips já renderizados no SSR) · erro de URL inválida (ignorar parâmetro).

### Wireframe (descrição textual)

```
BUILDS
Guias de build
Toda build documentada em seis tiers…                       [Ordenar: Recomendado ▾]

[⚡ Sorceress 11] [✚ Paladin 7] [➶ Amazon 8] [☠ Necro 3] [🌿 Druid 7] [⚔ Assassin 7] [🪓 Barb 6] [◈ Warlock 4]

Onde você está:  ( Início | Nightmare | Início do Hell | Econômico | Otimizado | BiS )   [Mais filtros (0)]   53 builds
Aplicados: [Sorceress ✕] [Frio ✕]  Limpar

┌──────────────────────────────┐ ┌──────────────────────────────┐
│ SORCERESS · Frio · Iniciante │ │ PALADIN · Mágico · Moderada  │
│ Blizzard Sorceress           │ │ Hammerdin                    │
│ A farmadora de MF de referência… │ …                        │
│ Limpeza ●●●●○  MF ●●●●●      │ │ Limpeza ●●●●●  MF ●●●●○      │
│ Econômico: Spirit · Oculus · Vipermagi → "Ver no tier"      │
└──────────────────────────────┘ └──────────────────────────────┘
```

No cartão: reduzir de quatro para **duas** notas (as duas mais altas ou as duas escolhidas em "Foco"), e adicionar uma linha "no seu tier" quando "Onde você está" estiver ativo. Chips de tag viram texto em uma linha (classe · elemento · dificuldade), reservando a borda para o cartão.

---

## 6. Backlog priorizado

Formato de cada item: problema · evidência · usuário · proposta · impacto · esforço · dependências · risco · critério de sucesso.

### P0

**B0.1 Textos de cobertura e "poucas builds" desatualizados**
- Problema: `/classes` afirma cobertura parcial; `/builds` termina com "Por que tão poucas builds?" e título órfão "Classes aguardando guias de build" (EN/PT).
- Evidência: textos capturados em 2026-09-07; sitemap com 54 builds e 9 leveling.
- Usuário: todos; pior para retornantes que testam a frescura do site.
- Proposta: gerar a nota a partir dos dados (classes sem builds = lista vazia → não renderiza) ou remover.
- Impacto: alto na confiança; esforço: pequeno; dependências: nenhuma; risco: nenhum.
- Sucesso: nenhuma frase no site contradiz contagens derivadas dos dados; teste que falha se a lista "aguardando" estiver vazia e o título renderizar.

**B0.2 Mercenário › Gear com slugs sem link**
- Evidência: HTML da seção (`<span class="font-medium">insight</span>`), `build-merc-390.png`.
- Usuário: quem monta o mercenário (todos os tiers a partir de Nightmare).
- Proposta: resolver slug → nome/link do runeword ou item, como no resto da página.
- Impacto: alto (é a única parte "quebrada" visível na página mais importante); esforço: pequeno; risco: nenhum.
- Sucesso: todos os slugs de mercenário nas 53 builds resolvem para uma página existente (teste de dados).

**B0.3 og:image ausente**
- Evidência: meta tags sem `og:image`; `/en-us/opengraph-image` → 404; `twitter:card=summary_large_image` declarado.
- Usuário: quem compartilha (aquisição).
- Proposta: imagem OG gerada por rota (título, classe, elemento, patch) no estilo do site.
- Impacto: alto na aquisição; esforço: pequeno/médio; dependências: fonte Cinzel disponível no gerador; risco: baixo.
- Sucesso: preview renderiza no Discord e no WhatsApp para home, classe, build e runeword.

### P1

**B1.1 Navegação por tier na build ("meu tier")**
- Problema: 6 tiers empilhados; barra sticky só a partir do px 6.066; nada persistido.
- Evidência: mapa de seções; 18.931 px desktop, 31.939 px em 390.
- Usuário: todos; pior no celular.
- Proposta: seletor de tier no topo da página (junto ao "Resumo"), que (a) rola para o tier, (b) opcionalmente colapsa os outros, (c) persiste em `localStorage` e é reaplicado nas próximas builds; sumário da página com as 11 seções.
- Impacto: muito alto; esforço: médio; dependências: nenhuma; risco: colapsar por padrão pode esconder conteúdo de quem lê tudo (manter "mostrar todos os tiers").
- Sucesso: tempo até o primeiro slot do tier escolhido < 2 s em celular; usuários com tier salvo caem no tier ao abrir outra build.

**B1.2 Redesenho do modelo de filtros** (seção 5) — esforço médio; sucesso: primeiro cartão visível ≤ 220 px no desktop e ≤ 300 px no celular; zero combinações vazias clicáveis.

**B1.3 Árvore de skills — Direção B** (seção 4) — esforço médio (por fases); sucesso: árvore com grade 3×6 e conectores em 320 px; posições iguais às do jogo; teclado navega por fileira/coluna.

**B1.4 Tiers da home clicáveis e CTA de classe**
- Proposta: cartões de tier → `/builds?tier=…`; "Começar um personagem" → seletor de classe (ou `/leveling`).
- Esforço: pequeno; sucesso: taxa de clique nos tiers > 0 (hoje é impossível).

**B1.5 Sumário/abas na página de classe** — esforço pequeno; sucesso: "Skill trees" alcançável em um clique a partir do topo.

**B1.6 Progresso persistido no leveling**
- Proposta: marcar etapa atual (checkbox por etapa, `localStorage`), badge "você está na etapa 4" e retorno automático.
- Esforço: pequeno/médio; dependência: hoje o site não usa `localStorage` em lugar nenhum (o menu mobile afirma isso explicitamente) e o teste de fronteira cliente/servidor precisa de um lugar sancionado para esse estado; sucesso: ao reabrir o guia, a etapa marcada está em foco.

**B1.7 Referência fora do "Menu ▾"**
- Problema: Runas, Itens, Breakpoints, Mercenários e Mecânicas só existem no dropdown; home não os apresenta.
- Proposta: seção "Referência" na home com 5 cartões; no header, agrupar "Referência ▾" com rótulo claro em vez de "Menu".
- Esforço: pequeno.

### P2

**B2.1 Filtros em Runewords e Itens** (base, sockets, classe, slot; chips de uma linha) — esforço pequeno/médio.
**B2.2 Contagens condicionais de faceta** — parte de B1.2, listado à parte por ser implementável isoladamente; esforço pequeno.
**B2.3 Ordenação na listagem** — esforço pequeno.
**B2.4 Página de skill: dano por nível 1–30 e anterior/próximo na árvore** — esforço pequeno.
**B2.5 Links de skill na tabela "Maximize nestas"** e âncoras por skill na árvore da classe — esforço pequeno.
**B2.6 Calculadora de breakpoint** ("tenho X% → frame Y; próximo em Z%") na página de breakpoints e no bloco de breakpoints da build — esforço pequeno/médio.
**B2.7 Comparação entre builds** (2 a 3 lado a lado: resumo, orçamento por tier, imunidades, breakpoints) — esforço médio; depende do modelo de dados já uniforme (favorável).
**B2.8 pt-BR: rótulos residuais em inglês** — os dicionários têm 902 chaves cada, sem faltas; 104 são idênticas ao inglês e a maioria é termo de jogo por decisão (ADR 0003). As que parecem lacuna e não política: `home.headlineHighlight` "best in slot", `mercenaries.tierEndgame` "endgame", `mechanics.categoryEndgame`, `sources.factPatch` "Patch", `farming.targetUniques/Sets/Bases/Charms/Jewels/Keys`, `farming.bossKindSuperUnique`, `skills.effectChance`, `skills.effectMana`, `builds.filters.resultsOne/Many` ("{count} build(s)"), e os rótulos de slot "Amulet/Belt/Charms" vistos na build. Esforço pequeno.
**B2.9 Farm: filtrar por build/elemento** ("áreas sem imunes a frio") e cruzar com Terror Zones — esforço médio.
**B2.10 Modo compacto / segunda tela** na build: esconder prosa, manter tabelas (skills, stats, breakpoints, tier atual, farm); `@media print` equivalente — esforço médio.
**B2.11 Equalizar profundidade das builds mais novas** (alternativas "ou" e "Procure por" nas builds com < 10 alternativas) — esforço editorial grande, mas incremental.

### P3

**B3.1 404 com header e busca; um idioma por rota.**
**B3.2 Web manifest + ícones** (instalar como app no celular para a consulta em jogo).
**B3.3 JSON-LD** (Article/BreadcrumbList) para rich results.
**B3.4 "O que mudou no patch 3.3" como página** (o site já cita várias mudanças espalhadas).
**B3.5 Favoritos locais** (estrela em build/runeword, lista em "Minhas builds") — só depois de B1.1, porque o tier persistido já cobre a necessidade principal.
**B3.6 Barra de etapas do leveling com indicador de rolagem no desktop.**
**B3.7 Ícone de skill por skill** (parte final da Direção B).
**B3.8 Higiene**: cinco SVGs do starter do Next em `public/` sem uso; `resolveRef` fabrica links para `/items/sets|bases|charms/…` que não têm rota (hoje nenhum conteúdo os emite, mas é um 404 latente); contagens desatualizadas em comentários e README ("29 builds", "1004/1009 páginas", "apenas dois client components", "menu é um `<details>` nativo"); string `hideFilters` morta; `site-header` reconstrói o índice de busca (500+ entradas) a cada página só para mostrar a contagem (custo apenas de build).

---

## 7. Roadmap

**Quick wins (dias)**: B0.1, B0.2, B0.3, B1.4, B1.5, B2.2, B2.3, B2.5, B2.8, B3.1, B3.6.

**Próxima etapa (2–4 semanas)**: B1.1 (tier selecionado e sumário na build) + B1.2 (filtros) + B1.6 (progresso no leveling) + B1.7 (referência na home/header). Estas quatro mudam a percepção de "documento" para "ferramenta" sem tocar em dados.

**Evolução estrutural (1–2 meses)**: B1.3 Direção B da árvore (dados de posição → grade → glifos por fases), B2.1 filtros de referência, B2.6 calculadora de breakpoint, B2.4 skill por nível, B2.10 modo compacto.

**Apostas futuras**: B2.7 comparação, B2.9 farm por build + Terror Zones, B3.2 PWA, B3.5 favoritos, B3.4 página de patch, B2.11 equalização editorial contínua.

---

## 8. O que não fazer

- **Réplica literal da tela do jogo (Direção A)**: risco de copyright/trade dress, acessibilidade ruim, e o site deixaria de ter identidade. O reconhecimento vem da posição e das setas, não do pergaminho.
- **Planner de skills/itens completo (estilo D2 Planner)**: enorme manutenção, foge da tese ("o que fazer agora"), e há ferramentas maduras para isso. Linkar para elas é melhor.
- **Cadastro/login para favoritos**: `localStorage` cobre 90% do valor sem custo de privacidade nem backend.
- **Comentários/comunidade**: moderação sem retorno; a autoridade do site vem justamente de não ser opinião de fórum.
- **Anúncios em rede**: além de conflitar com a política de conteúdo de fãs se assets do jogo forem usados, destrói a leitura de 30 mil px no celular.
- **Catalogar centenas de itens "para completar"**: a página de itens explica por que não; a busca deve dizer "ainda não catalogado" em vez de o catálogo crescer sem verificação.
- **Modo claro**: o custo de manter duas paletas com o nível atual de textura é alto e o público-alvo joga em tela escura; melhor investir em contraste do modo atual.
- **Drop calculator / trackers em tempo real de Terror Zone**: dependem de dados externos ou de scraping e existem em d2runewizard; linkar.
- **Notas de 1 a 5 mais finas ou "tier list"**: o site diz por que as notas são grosseiras; uma tier list contradiz a tese "onde você está".
- **Filtros por ladder / hardcore / online / temporada / patch**: já recusados no código com justificativa (`REFUSED_FILTERS`); o conteúdo trata Hardcore e SSF como notas dentro de cada build, que é o lugar certo. Reabrir isso só multiplicaria combinações vazias.
- **Reescrever a árvore com screenshots do painel do jogo como fundo** (o que o d2planner.github.io faz): fiel por construção, mas pixel fixo, ilegível em 320 px, sem teclado e com a mesma exposição legal da Direção A.
- **Abrir mais uma "página de cobertura" ou "roadmap público"**: o problema atual é justamente texto estático sobre o estado do conteúdo que envelhece; qualquer afirmação de cobertura deve ser derivada dos dados.

---

## 9. Próximo passo recomendado

**Uma única etapa: "Meu tier" na página de build (B1.1) junto com os três P0 (B0.1, B0.2, B0.3).**

Por que antes das demais: a página de build é onde o valor do site está e onde a experiência mais falha (19 mil / 32 mil px). O seletor de tier converte a promessa da home em comportamento real, é implementável sem tocar nos dados, e cria o estado ("onde você está") que os filtros (B1.2) e a home (B1.4) vão reutilizar em seguida. Os P0 são pequenos e removem as três coisas que hoje contradizem a página de fontes.

Resultados objetivos esperados:

- Tempo até o primeiro slot do tier escolhido em celular: de "rolar 10 a 20 mil px" para < 2 s.
- Zero frases no site contradizendo contagens de dados (teste automatizado).
- 100% dos slugs de mercenário resolvidos (teste de dados).
- Preview de link renderizando em Discord/WhatsApp para 100% das rotas.
- Tier persistido reaplicado ao abrir outra build (teste de viewport/E2E).

---

## Evidências

### Rotas analisadas (produção, 2026-09-07)

`/`, `/en-us`, `/pt-br`, `/en-us/classes`, `/pt-br/classes`, `/en-us/classes/sorceress`, `/pt-br/classes/sorceress`, `/en-us/classes/necromancer`, `/en-us/classes/warlock`, `/en-us/classes/sorceress/skills/blizzard`, `/pt-br/classes/sorceress/skills/blizzard`, `/en-us/builds` (+ `?damage=cold`, `?class=necromancer&damage=cold`), `/pt-br/builds`, `/en-us/builds/sorceress/blizzard-sorceress`, `/pt-br/builds/sorceress/blizzard-sorceress`, `/en-us/builds/paladin/hammerdin`, `/en-us/builds/warlock/abyss-warlock`, `/en-us/builds/barbarian/leap-attack-barbarian`, `/en-us/builds/necromancer/summoner-necromancer`, `/en-us/leveling`, `/en-us/leveling/sorceress`, `/pt-br/leveling/sorceress`, `/en-us/leveling/warlock`, `/en-us/farming`, `/en-us/farming/ancient-tunnels`, `/en-us/runewords`, `/en-us/runewords/spirit`, `/en-us/runes`, `/en-us/runes/jah`, `/en-us/items`, `/en-us/items/harlequin-crest`, `/en-us/breakpoints`, `/en-us/mercenaries`, `/en-us/mechanics`, `/en-us/about/sources`, `/en-us/this-does-not-exist` (404), `/pt-br/nada` (404), `/en-us/classes/sorceress/skills` (404), `/sitemap.xml` (1.002 URLs), `/robots.txt`.

### Viewports

1280×800 e 1280×900 (desktop), 768×1024 (tablet), 390×844 e 320×640 (celular). Sem overflow horizontal em nenhum; header de 57 px cabe em 320.

### Medições

| Página | HTML decodificado | JS | CSS | Fontes | Altura desktop | Altura 390 px |
|---|---|---|---|---|---|---|
| Home | 61 KB | 8 arquivos, 580 KB | 52 KB | 6 woff2, 224 KB | ~2.000 px | — |
| /builds | 527 KB | 9, 598 KB | 52 KB | idem | — | — |
| Build (Blizzard) | 560 KB | 9, 587 KB | 52 KB | idem | 18.931 px | 31.939 px |
| Classe (Sorceress) | 312 KB | 9, 598 KB | 52 KB | idem | ~8.000 px | — |

Carregamento com cache morno: domInteractive 90–190 ms, load 110–230 ms. Sem `<img>` em nenhuma página. Transferência comprimida não pôde ser medida (transferSize = 0 nas entradas de performance); o HTML de 527–560 KB é o payload RSC inline e comprime bem, mas é o que o celular precisa parsear. Sem erros de console; um aviso de preload de CSS não utilizado em todas as páginas.

### Capturas

Na pasta de trabalho da sessão (`scratchpad/shots/`): `home-desktop.png`, `class-sorc-skilltree.png`, `class-sorc-skill-selected.png`, `builds-top.png`, `builds-empty.png`, `build-y540.png`, `build-y1500.png`, `build-y6040.png`, `search-bliz.png`, `ref-en-us_runewords.png`, `ref-en-us_items.png`, `ref-en-us_farming.png`, `ref-en-us_leveling_sorceress.png`, `ref-en-us_classes_sorceress_skills_blizzard.png`, e em `m/`: `home-320.png`, `builds-sheet-390-selected.png`, `class-skill-tapped-390.png`, `class-skills-390.png`, `build-gear-390.png`, `build-skills-390.png`, `build-skills-320.png`, `build-merc-390.png`, `builds-768.png`, `class-skills-768.png`.

### Comparação en-US / pt-BR

- Rotas espelhadas 1:1 (sitemap com 1.002 URLs, ~501 por idioma); hreflang en-US, pt-BR e x-default; troca de idioma preserva a rota; redirecionamento por `Accept-Language` funciona (`/` → `/pt-br`).
- Conteúdo traduzido integralmente nas páginas verificadas (home, classe, build, skill, leveling, listagem, filtros, estado vazio, notas de cobertura).
- Resíduos em inglês na build pt-BR: "Amulet" (7), "Charms" (4), "Belt" (1), "Hardcore" (5, aceitável), "Buff/Spell" nos tipos de skill (parcial: "Magia" aparece, "Buff" fica), "budget/endgame" nos chips do mercenário (4, mesmo defeito B0.2), "Solo self-found"/"Magic find"/"Terror Zones" (termos de comunidade, aceitáveis).
- 404 mostra os dois idiomas em ambas as rotas.
- Busca pt-BR indexa 520 entradas com descrições traduzidas.

---

## Auditoria técnica orientada ao produto (leitura do repositório)

Consequência visível para o usuário em cada linha; caminhos citados para verificação.

### O que o código confirma como sólido

- **Tudo estático.** Next 16.3 App Router, `app/[lang]/`, `dynamicParams = false` herdado por todas as rotas, `generateStaticParams` em todas as dinâmicas, sitemap de 1.002 URLs gerado do registro com alternates por idioma. Consequência: nenhuma página depende de servidor no clique; carregamentos de 100–200 ms com cache morno; um slug errado responde 404 do próprio site.
- **Conteúdo como TypeScript** (ADR 0001) com overlays pt-BR por slug mesclados campo a campo (`lib/registry/localize.ts`) e um gate `check:content` que barra overlays faltantes. Consequência: pt-BR não pode "cair" para inglês em produção sem quebrar o build; 53/53 builds, 8/8 jornadas, dicionários de 902 chaves sem faltas.
- **Seis tiers como decisão de produto** (ADR 0002: onze estágios foram colapsados em seis de propósito). Todas as 53 builds têm os seis tiers em ordem canônica, `immunityPlan`, `hardcoreNotes`, `selfFoundNotes`, mercenário e farm. Consequência: a promessa da home é verdadeira em 100% do catálogo; a diferença entre builds é de densidade (43 a 74 escolhas), não de estrutura.
- **Grafo de skills gerado dos dados do jogo** (`content/classes/skill-graph.ts`, 240 nós com fileira, coluna, pré-requisitos e nível), com teste de deriva (`check:graph-drift`). Consequência: as posições da árvore são as do jogo; sinergias "nos dois sentidos" e "builds que usam" vêm do mesmo grafo e não podem desatualizar.
- **Fronteira cliente/servidor vigiada**: só 6 componentes `"use client"` (busca, filtros, sheet, árvore interativa, troca de idioma, menu mobile) e um teste que falha se `content/` ou o registro vazar para o cliente. Consequência: ~590 KB de JS por página são framework, não conteúdo; o índice de busca (1,1 MB) só é baixado ao abrir a busca.
- **Acessibilidade tratada como código**: `role=grid` com roving tabindex e funções de navegação testadas, focus trap e scroll lock reutilizados por sheet de filtros, sheet de skills e menu, `<noscript>` com a árvore em lista, teste de contraste e de composição de `aria-label`, gate de viewport em Chrome real via CDP (`scripts/viewport.test.ts`) que mede overflow em 320 px e alvos de toque de 24×24.
- **Metadados por página** via um único helper (`lib/metadata.ts`) com canonical, hreflang en-US/pt-BR/x-default e OG básico; `proxy.ts` resolve `/` por cookie → Accept-Language → en-US.

### O que o código explica sobre os problemas vistos

| Achado em produção | Causa no código | Consequência |
|---|---|---|
| Mercenário › Gear com slugs | `app/[lang]/builds/[classSlug]/[slug]/page.tsx:492` renderiza `g.ref.slug.replace(/-/g," ")` em vez de `<ItemRefLink refItem={g.ref} />` (que `/mercenaries` usa em `page.tsx:186`); também descarta `g.why` | Única referência cruzada do site sem link; texto em minúsculas |
| Título órfão "Classes aguardando guias" | `app/[lang]/builds/page.tsx:121-137` renderiza a `<Section>` sem o guarda `.length > 0` que `leveling/page.tsx:146` tem | Título vazio em todas as visitas, nos dois idiomas |
| "Por que tão poucas builds?" | `dictionaries/*.ts` `builds.whyFewBody`, callout incondicional em `builds/page.tsx:117` | Copy de quando havia 2 builds exibida com 53 |
| Nota de cobertura em `/classes` | texto estático no dicionário | Contradiz a própria página |
| Facetas não se estreitam | contagens calculadas uma vez no servidor (`filterable-build-list.tsx:130-140`) | Combinações vazias clicáveis |
| Sem preview ao compartilhar | não existe `opengraph-image` em nenhuma rota; `twitter.card = summary_large_image` em todas | Links sem imagem no Discord/WhatsApp |
| Sem rich results | nenhum `application/ld+json` no repositório | Google não vê Article/Breadcrumb |
| Sem modo de impressão/consulta | nenhum `@media print` nem variante `print:` em `globals.css` ou componentes | A página de 6 tiers imprime como está, com header e filtros |
| Árvore vira lista no celular | SVG de conectores `hidden sm:block`; grade colapsa para uma coluna abaixo de 640 px | Sem mapa no telefone |
| 404 nos dois idiomas | `app/not-found.tsx` documenta a decisão (não há `[lang]/not-found.tsx`) | Página de erro sem header e bilíngue |
| HTML de 527–560 KB | payload RSC inline com toda a listagem/build; sem imagens | Rápido por ser estático, mas é o que o celular parseia; vale acompanhar |
| Busca sem tolerância a erro | `lib/search/scoring.ts` é substring (exato > prefixo > substring > keyword > descrição), com apelidos e remoção de acentos, sem distância de edição | "blizard" não encontra Blizzard; "shako" e "hoto" encontram |

### Escalabilidade editorial e risco de regressão

- **Adicionar uma build** exige um arquivo TS com todos os campos do tipo `Build` (11 blocos, 6 tiers) mais um overlay pt-BR; os gates (`check:content`, `test:allocations`, `test:build-claims`, `test:immunity`, etc.) rejeitam campos faltantes, afirmações superlativas sem base e sinergias erradas. Consequência: o custo por build é alto e uniforme, o que explica a densidade estável; não há caminho para "build rascunho" publicada, o que é bom para confiança e ruim para velocidade.
- **Adicionar uma classe** já foi feito (Warlock) com o mesmo pipeline; o grafo é gerado por script de um commit fixo dos dados, então um patch que mova skills exige regenerar e passar no teste de deriva.
- **Dados de patch** ficam em `about/sources` e no rodapé (verificado em 2026-08-30); não há CHANGELOG nem página "o que mudou". Consequência: o leitor vê a data, mas não o diff.
- **Regressões visuais**: o único gate de layout é o de viewport (overflow e alvos de toque); não há screenshot diff, Lighthouse ou axe. Qualquer redesenho de filtros ou árvore deveria entrar acompanhado de um teste de altura da primeira dobra (px até o primeiro cartão) e de um snapshot de HTML por estado, que a suíte `check:built` já sabe fazer.
- **Estado persistido** (tier escolhido, etapa de leveling, favoritos) não tem hoje nenhum lugar: o site não usa `localStorage`, e o teste de fronteira exige que isso viva em um dos client islands. É viável e pequeno, mas precisa de decisão de arquitetura antes do primeiro uso.

---

## Referências externas

Fatos observados nas páginas citadas (verificados em 2026-09-07 pelo agente de pesquisa); opiniões marcadas como tal. Itens não verificáveis estão indicados.

### Maxroll D2R — https://maxroll.gg/d2 · https://maxroll.gg/d2/guides/blizzard-sorceress · https://maxroll.gg/d2/guides/sorceress-leveling · https://maxroll.gg/d2/resources/breakpoints-animations · https://maxroll.gg/d2/d2planner

- **Faz bem** (observado): guia com sumário fixo (Skills / Variants / Gameplay / Essentials / Mechanics / Changelog); equipamento organizado em **variantes** (Starter, Standard, Magic Find, Set) com planner embutido; tabela por slot "Item Options / Desirable Stats" com prioridade destacada; breakpoints inline com link para página canônica; leveling por estágio com respec marcado; "Last Updated" e changelog por guia; planner com perfis por URL e galeria da comunidade.
- **Faz mal** (observado): anúncios pesados; alocação de skills em prosa e slider, sem árvore; selos de temporada desatualizados (cards em "Season 14" com o site em S15); só inglês.
- **Serve ao Codex**: changelog visível por build; tabela de slot com "estatísticas prioritárias"; breakpoint inline → página canônica (o Codex já faz).
- **Não copiar**: o layout com anúncios; variantes em vez de tiers (os seis tiers do Codex são mais úteis para "onde você está").

### Icy Veins D2 — https://www.icy-veins.com/d2/blizzard-sorceress-build · https://www.icy-veins.com/d2/sorceress-skill-calculator

- **Faz bem**: sumário numerado; seção de breakpoints por build; "Respec at level 24" explícito; calculadora de skills por classe.
- **Faz mal**: equipamento em uma lista única sem tiers; "Last updated May 2026" no cabeçalho com changelog parado em Set/2025 (a data não é lastreada pelo conteúdo); ícones de skill são os originais do jogo renomeados por índice.
- **Serve ao Codex**: nada estrutural que já não exista; serve de contraexemplo para a data de verificação, que no Codex deveria derivar de mudanças reais.

### d2runewizard — https://d2runewizard.com/runewords · https://d2runewizard.com/runeword-calculator · https://d2runewizard.com/terror-zone-tracker · https://d2runewizard.com/integration

- **Faz bem**: lista de runewords filtrável por tipo de item, runas (AND), grupos de propriedade; cada linha de stat mostra qual runa contribui; "Current as of Patch 3.3 and Season 15" na página; calculadora "o que posso fazer com as runas que tenho" com presets de Countess; tracker de Terror Zone com toggles RotW/Ladder/HC/região e calendário de single player; API pública com política de uso justo.
- **Faz mal**: navegação com 15+ ferramentas de qualidade desigual; só inglês.
- **Serve ao Codex**: filtros de runeword (B2.1), selo "atual até patch X" por página de dados, atribuição de stat por runa (o Codex já tem "contribuições individuais" na página de runeword).
- **Não copiar**: trackers em tempo real (dependem de dados externos; linkar).

### diablo2.io — https://diablo2.io/runewords/ · https://diablo2.io/tzonetracker.php · https://diablo2.io/skills/

- **Faz bem**: facetas de versão ("Original / 1.10 / 2.4 / 2.6 / New in RotW") e **Ladder only / Non-ladder only** como filtros; áreas filtráveis por imunidade; preferência global SC/HC × Ladder/NL; Holy Grail "tenho/não tenho".
- **Faz mal**: builds só em fórum; muralha de botões de texto sem hierarquia (hostil no celular); rodapé sem aviso de direitos da Blizzard.
- **Serve ao Codex**: filtrar áreas de farm por imunidade (B2.9); tag de versão em runewords novas do RotW.
- **Não copiar**: fórum como guia; filtros em muralha.

### Arreat Summit / PureDiablo / diablowiki — https://classic.battle.net/diablo2exp/skills/sorceress-cold.shtml · https://www.purediablo.com/diablo-2/skillplanner · https://diablo2.diablowiki.net/Skill_Tree (bloqueado por Cloudflare; não verificado)

- **Observado**: o Arreat Summit lista skills por tree com nível requerido e pré-requisitos em texto, sem grade; ícones originais com aviso "© Blizzard Entertainment". A disposição 3×6 do jogo não pôde ser confirmada por wiki; a melhor evidência disponível é o uso de screenshots dos painéis pelo d2planner e o próprio grafo do Codex gerado dos dados do jogo.

### D2 Planner — https://d2planner.github.io/skills/ · https://github.com/d2planner/skills

- **Observado**: SPA React que usa **screenshots dos painéis do jogo** como fundo com overlays clicáveis (fiel por construção); estado salvo na URL; patch 1.14D apenas, sem D2R/RotW/Warlock; "Mobile friendly (TODO)"; sem teclado.
- **Serve ao Codex**: nada a copiar; é o exemplo do que a Direção A custaria em responsividade e acessibilidade.

### Ecossistema pt-BR — https://criticalhits.com.br/games/diablo-2-resurrected-melhor-build-para-necromante/ · https://www.mixvale.com.br/2026/03/09/guia-exclusivo-diablo-2-resurrected-solucao-total-atos-i-a-v-e-bosses/ · https://discord.me/d2rbr (403; tamanho não verificado) · pt.wowhead.com (403; não verificado se os guias são traduzidos)

- **Observado**: não existe site pt-BR estruturado e atual; o que há são artigos avulsos de 2021, walkthrough genérico de campanha e um Discord.
- **Opinião**: a paridade pt-BR do Codex é uma diferenciação real, condicionada a manter o pt-BR em sincronia (o gate já existe; a lacuna conhecida de `farmingWhy` na memória do projeto mostra o risco).

### Direitos e política de conteúdo de fãs — https://www.blizzard.com/en-us/legal/c1ae32ac-7ff9-4ac3-a03b-fc04b8697010/blizzard-legal-faq · https://www.blizzard.com/en-us/legal/8bcb0794-6641-4ce3-a573-8eb243bab342/blizzard-entertainment-logo-and-trademark-guidelines · https://www.blizzard.com/legal/9c9cb70b-d1ed-4e17-998a-16c6df46be7b/copyright-notices

- **Observado**: o Legal FAQ concede licença de imagens do jogo para uso "for home, noncommercial and personal use only", exige manter avisos de copyright e é revogável; as diretrizes de marca restringem a uso não comercial, com ™/® na primeira ocorrência, nunca no domínio, nunca implicando patrocínio ou endosso. Uma "Fan Site policy" dedicada é referenciada, mas não foi encontrada uma URL viva (não verificado).
- **Implicação**: o rodapé atual ("Diablo II: Resurrected é marca registrada da Blizzard Entertainment. Referência não oficial feita por fãs.") cobre o essencial; se qualquer asset do jogo for adotado, o site precisa continuar sem anúncios e adicionar as linhas de copyright completas. Com a Direção B, nada disso é necessário.

### Estado do jogo em setembro de 2026 — https://maxroll.gg/d2/news/diablo-ii-resurrected-ladder-season-15-and-patch-3-3 · https://d2runewizard.com/blizz-tracker/177263 · https://ggseason.com/d2r/patch-notes/ · https://diablo.fandom.com/wiki/Diablo_II:_Resurrected_%E2%80%93_Reign_of_the_Warlock

- **Observado**: Reign of the Warlock lançado em 11/02/2026; Patch 3.3 em 18/08/2026; Ladder Season 15 iniciada em 21/08/2026; sem anúncio de 3.4 ou S16. A afirmação do site ("Patch 3.3 · Temporada 15 · verificado 2026-08-30") está correta e atual.

### Matriz de funcionalidades (observada)

| Funcionalidade | Maxroll | Icy Veins | d2runewizard | diablo2.io | D2R Codex hoje |
|---|---|---|---|---|---|
| Comparação de builds | planner "compare" | não | não | não | não |
| Builds salvas/favoritos | perfis do planner | não | não | bookmarks | não |
| Modo impressão/companheiro | não | não | app Overwolf (TZ) | bot Discord | não |
| Respec como etapa | sim (leveling) | texto | Hero Editor | não | sim (`respecPlan` por classe) |
| Normal/NM/Hell | abas de leveling | não | presets Countess | não | tiers por faixa de nível + guia por etapa |
| Ladder/Non-ladder | selo de temporada | não | toggle TZ | faceta + preferência | recusado de propósito |
| Notas Hardcore | uma linha | não | toggle | preferência | seção por build |
| Solo self-found | não | não | não | não | seção por build + faceta "Boa para" |
| pt-BR | não | não | não | não | paridade completa |

Ninguém oferece modo de consulta em jogo, SSF como conteúdo estruturado, nem tiers por "onde você está". Essas três lanes, mais o pt-BR, são as que o Codex já ocupa ou pode ocupar sem clonar ninguém.

---

## Confirmação de escopo

Nenhum arquivo do repositório foi criado, alterado ou removido; nenhum commit, push, PR, deploy ou mudança de configuração foi feita; nenhum dado externo foi publicado. Os únicos artefatos produzidos ficaram na pasta temporária da sessão (este relatório, capturas de tela e textos de página coletados).
