> **Errata (2026-09-08, após a execução da Fase 0B).** Este parecer é preservado como foi entregue;
> o corpo abaixo **não** foi reescrito. A medição do protótipo (Fase 0B.1) encontrou duas afirmações
> factualmente erradas nele, ambas sobre a árvore de skills. Ficam registradas aqui para que ninguém
> as leia como verdade:
>
> 1. **§10, protótipo — "Corpse Explosion" não é da Summoning.** O texto a lista entre os nomes mais
>    longos da Summoning do Necromancer. Ela pertence à tree **Poison and Bone**
>    (`content/classes/skill-graph.ts`, `tree: "poison-and-bone"`). Os três nomes mais longos que de
>    fato estão na Summoning são **"Raise Skeletal Mage" (19), "Skeleton Mastery" (16) e
>    "Raise Skeleton" (14)**. O argumento do parecer — usar a Summoning porque ela estressa a largura
>    do nó — continua válido; só o exemplo estava errado.
> 2. **§7, `role=grid` — alargar a grade não corrige "de graça".** O parecer diz que trazer a grade
>    3×6 para 320 px corrige o `role=grid` inválido, na premissa de que as células vazias só saem da
>    árvore de acessibilidade abaixo de `sm`. Elas **nunca entram**: a célula vazia é renderizada com
>    `role="gridcell"` **e** `aria-hidden="true"` **e** `hidden sm:block`, então as fileiras já
>    divergem no desktop. A correção exige **também** remover o `aria-hidden` e dar um nome acessível
>    à célula — a chave `skills.emptyCell` ("No skill" / "Sem skill") já existe nos dois dicionários,
>    sem uso, e é o nome previsto para isso. O diagnóstico do parecer ("há um defeito latente que
>    ninguém sabe que está quebrado") estava certo; a causa e o custo da correção, não.
>
> Nenhuma conclusão, severidade ou recomendação do parecer muda por causa disto. As correções
> correspondentes foram aplicadas ao PRD (§2.2 D7, §8.2 R-TREE-0, §8.3 R-TREE-1).

# Revisão adversarial do PRD vNext — D2R Codex

| | |
|---|---|
| **SHA do PRD revisado** | **`e5ebde4`** (`e5ebde4c72bc818bacd9ee0646e1a39bdfb3ab4b`) |
| **Documento revisado** | [`docs/product/PRD-vNext.md`](../PRD-vNext.md) @ `e5ebde4` |
| **Evidência de origem** | [`docs/product/audits/2026-09-07-product-ux-audit.md`](../audits/2026-09-07-product-ux-audit.md) |
| **Data da revisão** | 2026-09-08 |
| **Revisor** | sênior de produto, UX, acessibilidade e viabilidade técnica |
| **Repositório** | `D:\Projetos\GitHub\d2r-codex` @ `e5ebde4` (main, 1 commit à frente de `origin/main` = `7e69fca`, worktree limpo) |
| **Produção consultada** | https://d2r-codex.vercel.app — 2026-09-08 |
| **Modo** | somente leitura; nenhuma correção implementada |
| **Veredicto** | **PRONTO COM CORREÇÕES** |

**Nota de baseline.** `e5ebde4` é um commit exclusivamente de documentação (`docs/product/PRD-vNext.md` +766, `docs/product/audits/…` +622; nenhum arquivo de código). Portanto o código em `HEAD` é idêntico ao de `7e69fca`, e a convenção do PRD ("referências apontam para `7e69fca`") é válida. Todas as medições abaixo foram feitas em 2026-09-08, em produção, com viewport controlado.

### Sumário de findings por severidade

| Severidade | Qtd. | Identificadores |
|---|---|---|
| **BLOCKER** | **3** | B1, B2, B3 |
| **HIGH** | **7** | H1, H2, H3, H4, H5, H6, H7 |
| **MEDIUM** | **10** | M1, M2, M3, M4, M5, M6, M7, M8, M9, M10 |
| **LOW** | **5** | L1, L2, L3, L4, L5 |
| **Total** | **25** | |

Outros artefatos desta revisão: **12** contradições (§4, C1–C12) · **6** requisitos tecnicamente prematuros (§5) · **10** requisitos ausentes (§6, A1–A10) · **10** itens a remover (§8) · priorização revisada (§9) · **11** unidades de fase revisadas (§10) · decisões para Q1–Q5 (§11) · checklist de aprovação (§12).

---

## 1. Veredicto

# PRONTO COM CORREÇÕES

Com uma ressalva que muda o sequenciamento: **a Fase 0 pode começar hoje; as Fases 1 e 3 estão bloqueadas** até que as correções B1–B3 e H2–H4 sejam aplicadas.

O documento é sólido no essencial — a tese, os limites de escopo, a rastreabilidade e a maioria dos requisitos resistem à leitura adversarial. Os problemas não exigem reescrever o PRD; exigem cerca de doze edições pontuais e nomeadas. O que impede a aprovação imediata é que **três critérios de aceite não podem ser satisfeitos como escritos** e um deles é a condição de saída da Fase 1.

---

## 2. Resumo executivo

O PRD acerta no que é mais difícil: ele decide. Rejeita tabs puras com motivo, recusa o compartilhamento por decisão do proprietário, mantém `REFUSED_FILTERS`, separa fato de opinião de hipótese (§17.7), e amarra quase todo requisito a um gate automatizado. A matriz de rastreabilidade cobre os treze defeitos. Isso é acima da média para um documento desta natureza.

O que ele erra é aritmética e estado atual — as duas coisas que uma revisão adversarial existe para pegar.

**Aritmética.** Medi a página de build em produção a 390 px: 31.939 px de altura (o PRD acerta), com a seção Gear ocupando 16.315 px distribuídos em seis tiers de 2.191 a 3.421 px. Comprimir cinco tiers ao alvo de 320 px do próprio PRD e expandir um deixa a página em ~20.600 px. A meta da Fase 1 é ≤ 12.000 px. **Não fecha, e não fecha por 8.600 px.** O resto da altura está na seção Skills (5.912 px a 390 px), que só encolhe na Fase 3, e na prosa, que só encolhe na Fase 5. A Fase 1 não pode passar no próprio portão.

**Estado atual.** O achado D13 diz que o 404 não tem header. Ele tem: `app/not-found.tsx` renderiza um `<header>` com o wordmark, e produção confirma. Cinco commits entre `786cc36` e `7e69fca` fizeram esse trabalho antes do PRD ser escrito. Pior: o mesmo arquivo documenta, com medição, por que "um idioma por rota" transformou as 1009 páginas pré-renderizadas em renderizações sob demanda — e P2.9 pede exatamente isso. O PRD manda desfazer uma decisão que o repositório já mediu.

**Contradições internas.** Três requisitos descrevem o mesmo controle de tier com contratos incompatíveis sem JavaScript (R-BUILD-12 diz que renderiza como âncoras; R-FILT-2 e R-A11Y-12 dizem que não renderiza). E8 manda traduzir três chaves pt-BR que R-I18N-5 manda manter como estão — e que já estão corretas no dicionário.

**Números da árvore.** R-TREE-3 dimensiona o nó a partir de "288 px úteis". Medi: são **280 px** (`Container` é `px-5`). E o requisito ignora o trilho de nível de 36 px que o componente renderiza hoje acima de `sm` — com ele, o nó cai para 73 px, abaixo do piso de 84 px que o próprio requisito estabelece. R-TREE-8 cita um baseline de "~1.500 px" para um requisito que governa abaixo de 640 px, onde a medição real é **3.511 px**.

**Trabalho editorial disfarçado de desenvolvimento.** O caso mais caro está escondido em E6, classificado como "strings mortas, esforço pequeno": `lib/builds/filter.ts` justifica `GOOD_AT_THRESHOLD = 4` com uma distribuição empírica medida sobre **29 builds**. Hoje são 53. Não é um comentário desatualizado — é a base de evidência de um limiar que R-FILT-4 e R-FILT-5 usam. Precisa ser remedido antes da Fase 2, não corrigido como texto.

**O que o PRD deveria ter decidido sozinho.** Q4 (PWA) e Q5 (aprofundamento editorial) já têm resposta dentro do próprio documento: a regra de entrada da Fase 6 responde Q4, e §9.2 responde Q5. Só Q1 e Q2 precisam do proprietário — e as opções de Q2 estão incompletas: falta a que resolve o problema que o proprietário nomeou.

**Sobre o protótipo da árvore.** É a hipótese de maior risco do documento (§17.7 admite: "que o nó compacto de 84 px é legível a 30 cm") e sustenta um princípio de produto (§1.5 #7) e um objetivo (O3). Está agendado para "antes da fase 3", que é a quarta entrega. Deve subir para a Fase 0: custa um arquivo HTML estático e, se falhar, evita três fases construídas sobre uma premissa falsa.

---

## 3. Findings classificados

### BLOCKER

---

#### B1 · A meta de altura da Fase 1 é aritmeticamente inatingível

**Referência no PRD:** §12, linha "Altura da página de build (390 px) | 31.939 px | ≤ 12.000 px com tier ativo e demais compactos (estimativa)"; §14 Fase 1, "Aceite: métricas 1–3 da seção 12"; §13 P1.1, "Aceite: métricas 1–3".

**Problema:** a condição de saída da Fase 1 exige uma redução que o escopo da Fase 1 não pode produzir.

**Evidência (medida hoje, produção, 390×844, `/en-us/builds/sorceress/blizzard-sorceress`):**

| Bloco | Altura |
|---|---|
| Página inteira | 31.939 px (o PRD acerta) |
| Seção Gear (`#gear-starter` → fim) | 16.315 px |
| — Starter / Nightmare / Early Hell | 2.191 / 2.434 / 2.226 px |
| — Budget / Optimized / BiS | 3.355 / 3.421 / 2.688 px |
| Seção Skills (y 2.439 → 8.351) | 5.912 px |
| Prosa de topo (How it plays → Getting there) | 2.440 px |

Aplicando R-BUILD-5 (tier compacto ≤ 320 px) e R-BUILD-2 (um tier ativo):

- cinco tiers compactos = 1.600 px
- um tier ativo, pior caso realista (Budget) = 3.355 px
- Gear passa a ≈ 4.955 px
- página = 31.939 − 16.315 + 4.955 = **20.579 px**
- melhor caso (Starter ativo, 2.191 px) = **19.415 px**

**Impacto:** a fase termina com o gate vermelho ou com o gate relaxado em silêncio. A segunda hipótese é pior: O7 ("cada fase termina com pelo menos um gate novo que teria detectado a regressão") perde credibilidade na primeira fase que o exercita, e todo gate posterior herda a suspeita.

**Correção proposta:** separar a meta da fase da meta do produto.
- Fase 1: **≤ 21.000 px a 390 px** (−34%), com a conta acima escrita no PRD para ser auditável.
- Meta de produto ≤ 12.000 px: mover para uma métrica transversal que declare suas dependências — R-TREE-8 (Fase 3, remove ~3.900 px) e R-BUILD-15 (Fase 5, prosa). Mesmo somadas, 20.579 − 3.900 = 16.679 px; o restante precisa vir do modo compacto. Se o proprietário quiser 12.000 px, o PRD tem que dizer de onde saem os 4.700 px finais.
- Adotar Q2 = (c) (ver §11) derruba a Fase 1 para **≈ 17.500 px** sem nenhum trabalho extra, porque os seis tiers começam compactos.

---

#### B2 · R-BUILD-1 se contradiz: "acima da dobra" versus "na região de Resumo"

**Referência no PRD:** R-BUILD-1 (§6.3) — "deve exibir, acima da dobra (na região de 'Resumo'), um controle segmentado… *Aceite:* em 320, 390, 768 e 1280 px o controle é visível sem rolar".

**Problema:** as duas metades da frase pedem posições diferentes. O critério de aceite falha por construção em 320 px.

**Evidência (produção):**

| Viewport | `<h2>At a glance</h2>` | Dobra | Situação |
|---|---|---|---|
| 320×640 | y = **938 px** | 640 px | 298 px **abaixo** da dobra |
| 390×844 | y = 783 px | 844 px | cabeçalho visível; o controle abaixo dele, não |

Acima de "At a glance" ficam breadcrumb, H1, subtítulo e a seção "How it plays" (y = 399 px a 390 px).

**Impacto:** quem implementar precisa escolher entre desobedecer à localização ou ao critério de aceite. As duas escolhas passam por revisão de código e uma delas quebra o teste de viewport da própria fase.

**Correção proposta:** decidir a âncora explicitamente. Recomendo colocar o seletor **imediatamente após o bloco de título, antes de "How it plays"**, e deixar "Resumo/At a glance" onde está. Reescrever o aceite em número medível: *"o topo do controle fica a ≤ 560 px do topo do documento em 320×640"* — verificável pelo mesmo teste de viewport que já mede a primeira dobra em `/builds`.

---

#### B3 · O contrato sem JavaScript do seletor de tier é contraditório entre três requisitos

**Referência no PRD:** R-BUILD-12 ("Sem JS, os seis tiers renderizam expandidos, **o seletor funciona como âncoras**"); R-FILT-2 ("**no-JS não renderiza o controle** (é preferência)"); R-A11Y-12 ("controles de preferência (tier, nível, compacto) **só aparecem com JS**"). R-FILT-2 declara explicitamente que é o "mesmo componente do `R-BUILD-1`".

**Problema:** o mesmo componente tem que renderizar e não renderizar sem JavaScript.

**Evidência:** interna ao documento. Reforçada pelo código: o site inteiro é estático (`app/[lang]/layout.tsx:83` — `export const dynamicParams = false`), as âncoras `#gear-*` já existem e são idênticas nos dois idiomas (verificado em produção: `gear-starter`, `gear-nightmare`, `gear-early-hell`, `gear-budget`, `gear-optimized`, `gear-bis` em `/en-us` e `/pt-br`), e não há hoje nenhum `localStorage` no repositório (`lib/prefs.ts` não existe).

**Impacto:** o gate de R-A11Y-12 ("teste de HTML sem scripts por página-tipo") e o de R-BUILD-12 se contradizem. Um dos dois vai falhar, e como são de fases diferentes (1 e 2), a contradição só aparece na Fase 2, depois da Fase 1 ter sido dada por concluída.

**Correção proposta:** separar os dois papéis, que só parecem o mesmo por compartilharem estilo.

| Papel | Onde | Sem JS | Requisito |
|---|---|---|---|
| **Navegação** por tier | página de build | **renderiza**: seis links `#gear-<tier>` no HTML | R-BUILD-1 / R-BUILD-12 |
| **Preferência** de estágio | listagem, home | **não renderiza** | novo `R-PREF-4`, referenciado por R-FILT-2 |

Na página de build, a gravação da preferência é um *enriquecimento* dos mesmos seis links, não um controle diferente. Escrever isso resolve a contradição sem mudar o desenho.

---

### HIGH

---

#### H1 · D13 está parcialmente incorreto e P2.9 pede algo que o código já mediu como inviável

**Referência no PRD:** §2.2 D13 ("404 sem header, sem busca e com os dois idiomas empilhados"); §13 P2.9 ("404 com header e busca, um idioma por rota"); §16, linha "404 bilíngue sem header (D13) | P2.9 | Fase 5".

**Problema:** metade do achado está resolvida; a outra metade pede a reversão de uma decisão medida.

**Evidência:**

*"sem header" — **resolvido**.* `app/not-found.tsx` renderiza um `<header className="border-b border-border">` com o wordmark em `Container size="shell"`. Produção, `/en-us/this-does-not-exist`:

```
D2 CodexResurrected404Page not found…
D2 CodexResurrected → https://d2r-codex.vercel.app/en-us
```

*"um idioma por rota" — **refutado com medição no próprio repositório**.* O cabeçalho de `app/not-found.tsx` registra: ler `cookies()`/`headers()` no `not-found` raiz "turned all 1009 prerendered pages into on-demand renders. Measured on a build: every route went from `●` to `ƒ`" — e registra também que `[lang]/not-found.tsx` nunca é alcançado e que um catch-all `[lang]/[...rest]` piorou (shell `__next_error__` com corpo vazio). Os commits `786cc36`, `ab08b0d`, `4d19e88`, `7e69fca` são esse trabalho, todos anteriores ao PRD.

*"sem busca" — **atual**.* Confirmado.

**Impacto:** um implementador diligente lê P2.9, tenta o idioma por rota, e gasta um dia refazendo cinco dead ends já documentados — ou pior, entrega a versão que converte 1002 páginas estáticas em dinâmicas e não é pego por nenhum gate existente.

**Correção proposta:**
- Reescrever D13 para **"404 sem busca"**.
- Reescrever P2.9 para **"adicionar busca ao 404"** (esforço pequeno; a busca é um client island e o 404 já carrega `globals.css` e as duas fontes).
- Mover "um idioma por rota" para §17.6 (decisões descartadas) com a medição, ao lado de "Direção A" — não como item de backlog.
- Corrigir a linha correspondente em §16.

---

#### H2 · R-TREE-3 parte de uma largura errada e ignora o trilho de nível de 36 px

**Referência no PRD:** R-TREE-3 — "largura mínima 84 px para que 3 colunas + 2 vãos caibam em **288 px úteis**"; R-TREE-1 — "3 colunas × 6 fileiras em **todas** as larguras a partir de 320 px".

**Problema:** o número base está errado e o requisito não considera um elemento que o componente já renderiza.

**Evidência (medida em produção, 320×640, `/en-us/classes/sorceress`):**

```json
{"gridWidth":280,"cols":"280px","gap":"8px","docScrollW":320}
```

São **280 px**, não 288: `Container` aplica `px-5` (20 px de cada lado) em `components/ui/index.tsx:39`.

E `components/game/skill-tree-interactive.tsx:299` renderiza um trilho de nível — `className="hidden shrink-0 sm:grid …"` com filhos `w-9 … pr-2 border-r`, medido em **36 px** de largura a 768 px.

| Cenário a 320 px | Cálculo | Nó |
|---|---|---|
| Sem trilho | (280 − 16) / 3 | **88 px** ✅ |
| Com trilho (45 px) | (280 − 45 − 16) / 3 | **73 px** ❌ (piso é 84) |

**Impacto:** R-TREE-1 e R-TREE-3 só são simultaneamente satisfazíveis se o trilho for suprimido abaixo de 640 px, e o PRD não diz isso. Hoje o trilho é `hidden` abaixo de `sm` e o cabeçalho de fileira (`sm:hidden`, linha ~374) carrega o nível no lugar; ao trazer a grade 3×6 para 320 px, o requisito precisa dizer qual dos dois sobrevive.

**Correção proposta:** corrigir 288 → 280 e acrescentar a decisão que falta: *"abaixo de 640 px o trilho de nível não é renderizado; o nível continua no `aria-label` de cada nó (já está) e no cabeçalho de fileira existente."* Recalcular o piso do nó a partir de 280 px.

---

#### H3 · R-TREE-8 cita o baseline do regime errado e a meta de altura provavelmente não fecha

**Referência no PRD:** R-TREE-8 — "Em <640 px … reduzindo a altura de **~1.500 px para ~500 px**. *Aceite:* altura da seção em 390 px ≤ 600 px por tree".

**Problema:** o baseline citado é o de ≥640 px; o requisito governa <640 px. E a meta colide com a geometria que R-TREE-3 estabelece.

**Evidência (produção, `/en-us/classes/sorceress`):**

| Viewport | Seção de skills | Por grade |
|---|---|---|
| 320 px | **3.511 px** | 954 px × 3 |
| 390 px | **3.443 px** | 954 px × 3 |
| ≥640 px (calculado: 6 fileiras × 88 px + 5 × 8 px) | ≈ 1.704 px | 568 px × 3 |

O "~1.500 px" descreve o comportamento em tablet/desktop. Abaixo de 640 px — onde R-TREE-8 se aplica — a medição é 3.511 px.

Sobre a meta de 600 px: a fileira mede **88 px** hoje (`sm:grid-rows-[repeat(6,5.5rem)]`, confirmado: `tileH: 88`). Seis fileiras + cinco vãos = 568 px, **antes** do cabeçalho da tree e do controle segmentado que R-TREE-8 introduz. R-TREE-3 fixa a *largura* do nó (84 px) mas nenhum requisito fixa a *altura* da fileira.

**Impacto:** o critério de aceite é uma moeda ao ar. Se a fileira ficar em 88 px, falha; se encolher, nenhum requisito autoriza nem limita a mudança, e o alvo de toque de 44 px (R-A11Y-4) entra em risco.

**Correção proposta:**
- Corrigir o baseline para o regime governado: **3.511 px a 320 px**, e declarar a meta como redução dessa medição.
- Acrescentar um requisito de altura de fileira (`≤ 76 px abaixo de 640 px`, mantendo ≥ 44 px de alvo) **ou** subir o orçamento da seção para ≤ 700 px por tree. Sem um dos dois, R-TREE-3 e R-TREE-8 não se conversam.
- Alimentar esse número com o resultado do protótipo (§10), que é onde ele deve ser descoberto.

---

#### H4 · R-TREE-13 remove um invariante documentado sem substituí-lo

**Referência no PRD:** R-TREE-13 — "Setas movem estritamente pela grade… pulando células vazias e **parando na borda**… A navegação atual 'vizinho mais próximo' **é substituída**".

**Problema:** o comportamento atual não é um descuido; é uma garantia deliberada, e o PRD a descarta sem colocar nada no lugar.

**Evidência:** `lib/skill-tree-nav.ts:44-56`:

> "Left/right within the row, **continuing into the neighbouring row at an edge so that every skill stays reachable by arrows alone**."

E o cabeçalho do módulo (linhas 1-19) registra que a versão anterior — que percorria uma lista achatada — era o bug (ArrowDown andava "três blocos adiante"), e que o teste foi unificado justamente para impedir deriva entre componente e teste.

O aceite proposto verifica dois casos da Sorceress (`Ice Blast → direita = nada`, `Ice Blast → baixo = Glacial Spike`). Nada verifica alcançabilidade nas 24 árvores.

**Impacto:** com um único Tab stop por tree (roving tabindex) e navegação estrita, um nó cuja fileira e cuja coluna não tenham vizinho de entrada fica inalcançável só pelo teclado. O D8 é real e o desenho estrito é o certo — mas a troca perde uma propriedade que hoje é verdadeira e que nenhum teste novo cobre.

**Correção proposta:** manter a intenção e reintroduzir a garantia como critério: *"teste que, para as 24 árvores das 8 classes, todo nó é alcançável a partir do primeiro nó usando apenas setas, Home e End."* Se o teste não puder ficar verde com navegação estrita, o PRD tem que dizer qual dos dois comportamentos vence — e essa é uma decisão de produto, não de implementação.

---

#### H5 · E8 contradiz R-I18N-5, e três das chaves listadas não são defeitos

**Referência no PRD:** §2.2 D12; §9.1 E8; R-I18N-5.

**Problema:** E8 manda traduzir chaves que R-I18N-5 manda manter, e que já estão corretas.

**Evidência (`lib/i18n/dictionaries/pt-br.ts`):**

| Chave | Valor atual | E8 diz | R-I18N-5 diz | Veredito |
|---|---|---|---|---|
| `builds.filters.resultsOne` (:303) | `"{count} build"` | traduzir | manter ("'build' é termo mantido") | **já correto** |
| `builds.filters.resultsMany` (:304) | `"{count} builds"` | traduzir | manter | **já correto** |
| `skills.effectChance` (:739) | `"Chance"` | traduzir | — | **já correto** (palavra portuguesa) |
| `skills.effectMana` (:750) | `"Mana"` | traduzir | — | **já correto** (termo de jogo; `effectManaSteal` já é "Mana roubada") |
| `home.headlineHighlight` (:104) | `"best in slot"` | traduzir | — | defeito real |
| `mercenaries.tierEndgame` (:888) | `"endgame"` | traduzir | — | defeito real |

**Impacto:** E8 tem como critério de aceite "lista de exceções explícita no teste de dicionário". Executá-lo como escrito piora o pt-BR em duas chaves e depois faz o próprio teste de R-I18N-5 falhar.

**Correção proposta:** podar D12 e E8 para as chaves genuinamente erradas (`home.headlineHighlight`, `mercenaries.tierEndgame`, `farming.target*`, `sources.factPatch`, rótulos de slot "Amulet/Belt"), e declarar a lista de termos mantidos **uma única vez**, em `docs/adr/0003`, referenciada pelos dois requisitos em vez de duplicada.

---

#### H6 · D10 contém uma afirmação incorreta e esconde um defeito de conteúdo dentro de "strings mortas"

**Referência no PRD:** §2.2 D10; §9.1 E6 ("Remover `hideFilters`; atualizar comentários e README… esforço: pequeno"); §13 P2.7.

**Problema (a) — afirmação incorreta.** D10 lista `mobile-navigation.tsx:25` e "menu `<details>`" como comentário desatualizado. **Não está desatualizado.** O menu ainda é um `<details>`, deliberadamente, e o arquivo explica por quê:

> "**Why it is still a `<details>`.** A button and a panel would have been the obvious shape, and it would have taken the menu away from every reader without JavaScript — the site prerenders every page precisely so that reader is served."

Produção a 390 px confirma: `{"details":1,"summary":1}` no `<header>`. `README.md:318` ("The mobile menu is a native `<details>` element") está **correto**. Executar E6 como escrito significa "corrigir" uma frase verdadeira — e o risco real é alguém concluir que o `<details>` é o obsoleto e trocá-lo, removendo o menu para quem não tem JavaScript, contra §1.5 #9 e R-A11Y-12.

**Problema (b) — defeito de conteúdo classificado como comentário.** `lib/builds/filter.ts:86-95` justifica `GOOD_AT_THRESHOLD = 4` com uma distribuição empírica:

> "Across the **29 published builds** and eight axes — **232 ratings** — 47.4% sit at 4 or above… At 5 only, twelve of the 29 builds carry no tag at all."

Hoje são **53 builds**. Isso não é um comentário velho: é a **base de evidência de um limiar** que R-FILT-4 (contagens condicionais) e R-FILT-5 ("Boa para") usam como entrada. Reescrever "29" para "53" sem remedir seria escrever à mão uma afirmação sobre os dados — exatamente o que §1.5 #2 proíbe.

**Problema (c) — dois números que não devem ser "corrigidos".** `app/not-found.tsx:36` e `scripts/not-found.test.ts:25` dizem "1009 prerendered pages". É o **registro de uma medição histórica**, não uma afirmação sobre o estado atual. Trocar por 1002 falsifica o registro. Já `layout.tsx:79` e `mobile-navigation.tsx:25` ("1004 pages") são afirmações correntes e estão erradas — o sitemap em produção tem **1002** `<loc>`.

**Correção proposta:** dividir E6 em três itens com naturezas diferentes:
- **E6a** (higiene, P2): remover `hideFilters` (declarada em `en-us.ts:305`/`pt-br.ts:312`, tipada em `build-filters.tsx:88`, passada em `filterable-build-list.tsx:161`, **nunca renderizada**); corrigir "1004" em `layout.tsx:79` e `mobile-navigation.tsx:25`; corrigir `README.md:315-317` ("the only client components" — hoje são seis) e `search-dialog.tsx:18`.
- **E6b** (não mexer): registrar que "1009" em `not-found.tsx:36` e `not-found.test.ts:25` é medição histórica, e que o `<details>` do menu é decisão vigente. **Remover ambos de D10.**
- **E6c** (novo, bloqueante da Fase 2): **remedir a distribuição de `GOOD_AT_THRESHOLD` sobre as 53 builds** e reescrever a justificativa a partir da nova medição. Se o limiar mudar, R-FILT-4 e R-FILT-5 mudam com ele.

---

#### H7 · R-BUILD-3 tem um critério de aceite não verificável

**Referência no PRD:** R-BUILD-3 — "*Aceite:* snapshot do HTML sem preferência é **idêntico ao atual exceto pelo controle novo**".

**Problema:** "idêntico exceto pelo X" não tem definição operacional. Inserir um controle segmentado muda o DOM, cria ids e relações ARIA, e desloca tudo abaixo dele. Nenhum diff de snapshot vai retornar "idêntico".

**Impacto:** um critério que não pode ser executado é um critério que será marcado como cumprido por inspeção. É o único aceite de §6.3 sem um número ou um predicado.

**Correção proposta:** substituir por duas asserções verificáveis:
1. as seis seções `#gear-*` estão presentes e expandidas;
2. a lista ordenada dos textos de `h2`/`h3` da página é igual à atual.

Se Q2 = (c) for adotado (§11), R-BUILD-3 muda de conteúdo e este problema desaparece junto.

---

### MEDIUM

---

#### M1 · O PRD escreve à mão contagens sobre o próprio site — o defeito que ele proíbe

**Referência:** §2.1 ("dicionários de 902 chaves", "40 scripts de teste"); §12 ("902/902 chaves… Meta: 902+/902+"); §1.5 princípio 2.

**Evidência:** contagem aproximada de chaves nos dois dicionários hoje: **922** em `en-us.ts` e 922 em `pt-br.ts`. `package.json` tem **46** scripts `test:`/`check:` (55 no total), não 40. "1.002 URLs" está **correto** (sitemap conferido).

**Impacto:** baixo em consequência, alto em coerência — a meta "902+/902+" já nasce satisfeita e não mede nada. E o documento que exige contagens derivadas é o mesmo que as escreve à mão.

**Correção:** marcar os números como "medido em 2026-09-07" e trocar as metas por predicados ("zero chaves faltantes nos dois dicionários"), não por limiares numéricos.

---

#### M2 · R-FILT-4 (desabilitar opções em zero) pode fechar descobertas úteis, e não está especificado junto com R-FILT-7

**Referência:** R-FILT-4; R-FILT-7 ("Remover último filtro").

**Evidência:** `components/builds/filterable-build-list.tsx` **já** poda facetas — `narrowingOptionsFor()` remove opções que toda build carrega e `isDiscriminating()` remove grupos inteiros que não discriminam. O comentário do arquivo registra a regra ("that is a per-option rule, not a per-group one"). Somar "desabilitar em zero" a essa poda significa que uma opção pode sumir *e* desabilitar por razões que o leitor não vê.

**Impacto:** o caso real que o proprietário levanta — Necromancer + Frio devolve zero — é informativo: "esta classe não tem build de frio" é uma resposta, não um beco. Desabilitar transforma resposta em silêncio.

**Correção:** manter a desabilitação (é o que zera "combinações vazias clicáveis", métrica 5), **mas especificá-la junto com R-FILT-7 num único requisito**, porque só fazem sentido em par: a opção desabilitada mostra `0` visível e o estado vazio nunca é alcançável; se o leitor chegar lá pela URL, "Remover último filtro" desfaz. E definir "último filtro" como o último `pushState` da sessão — o histórico já registra isso (R-FILT-9), então é implementável de forma previsível sem estado novo.

---

#### M3 · "Para o meu estágio" não tem definição suficiente para ser a ordenação padrão

**Referência:** R-FILT-5; R-FILT-2 ("a ordenação padrão passa a 'Para o meu estágio'").

**Problema:** o critério são três comparadores diferentes atrás de um rótulo — `difficulty`+`budget` para os três primeiros tiers, `soloSelfFound` para Econômico, `clearSpeed` para Otimizado/BiS. O mapeamento é editorial, não derivado, e §17.7 já o classifica como **hipótese** ("que 'Para o meu estágio' é a ordenação mais útil").

**Impacto:** vira o padrão assim que existe preferência. A queixa de J1 sobre a listagem de hoje é exatamente "ordem inexplicada"; trocar uma ordem inexplicada por outra, que ainda muda de significado conforme o tier, não resolve J1 — reembala.

**Correção:** uma das duas:
- (a) manter o critério, **mas nunca como padrão** — "Recomendado" continua padrão e "Para o meu estágio" fica disponível; ou
- (b) renomear para o que faz ("Mais fácil de montar agora") e publicar o comparador com teste, aceitando que é editorial e assumido.

Em ambos os casos, o `?` de R-FILT-5 deve explicar a regra em uma frase, como já faz para "Recomendado".

---

#### M4 · §6.1 promete impressão e leitura completa; R-BUILD-5 e R-BUILD-15 tiram as duas

**Referência:** §6.1 ("os seis tiers continuam existindo no HTML… para leitura completa, **impressão** e no-JS"); R-BUILD-5 ("conteúdo completo continua no DOM (`hidden`/`<details>`)"); R-BUILD-15 (o modo compacto mantém "tier ativo" e "a mesma folha serve como `@media print`").

**Problema:** `hidden` e `<details>` não são intercambiáveis — `hidden` sai da árvore de acessibilidade e da impressão; `<details>` sem `open` também não imprime na maioria dos motores. E R-BUILD-15 imprime só o tier ativo, o que contradiz a promessa de §6.1.

**Evidência de contexto:** não existe hoje nenhum `@media print` no repositório (verificado).

**Correção:** escolher. Recomendo `<details>` (não `hidden`) mais uma regra de impressão que force `[open]` nos seis, e reescrever R-BUILD-15 para dizer que a impressão **expande todos os tiers** enquanto o modo compacto de tela mostra só o ativo. Também: desacoplar as duas entregas — o modo compacto serve à consulta em segunda tela (valor real, celular ao lado do jogo); a folha de impressão é uma superfície separada e deve poder ser cortada sem levar o modo compacto junto.

---

#### M5 · R-BUILD-10 prescreve mecanismo onde já tem resultado medível

**Referência:** R-BUILD-10 — "o estado ativo é aplicado no cliente sem layout shift perceptível (os tiers compactos são o estado inicial quando há preferência, **aplicado antes da pintura via script inline mínimo ou classe no `<html>`**). *Aceite:* CLS < 0,1".

**Problema:** solução técnica prematura dentro de um requisito que já tem critério observável (CLS < 0,1). Além disso, um script inline antes da pintura é uma superfície de fronteira cliente/servidor nova, e o teste de fronteira que o PRD cita como "continua verde" (R-PREF-1) hoje vigia `"use client"` em módulos, não script inline em layout.

**Correção:** manter "CLS < 0,1 ao carregar com preferência", apagar o mecanismo, e acrescentar a restrição que importa: *"nenhuma exceção nova ao teste de fronteira cliente/servidor; se um script inline for necessário, ele entra na lista vigiada"*.

---

#### M6 · R-TREE-17 mistura orçamento não medido com proibição de identidade

**Referência:** R-TREE-17 — "sprite SVG por classe, **≤ 40 KB por classe**… sem imagens raster… aumento **≤ 15%** do HTML (baseline 312 KB)".

**Problema:** 30 símbolos por classe em 40 KB são ~1,3 KB por glifo. Pode ser folgado ou apertado dependendo do desenho, e o PRD não diz que testou. "Proibição total de raster" é uma regra de produto correta (identidade + recolorir por CSS), mas está no mesmo requisito que dois orçamentos que são hipóteses.

**Correção:** separar. Regra de produto: **sem raster** (justificada por identidade e por tematização via `currentColor`). Gate medível: **HTML por página de classe ≤ 360 KB** (já está em §12 e é a consequência que importa). Os 40 KB viram um orçamento a validar no plano da Fase 4, não um requisito com aceite.

---

#### M7 · R-BUILD-4 pede sticky "em todas as larguras" sem confrontar o orçamento vertical de 320 px

**Referência:** R-BUILD-4 — "o seletor é sticky abaixo do header **em todas as larguras**"; R-A11Y-8 (header a 320 px, "orçamento de ~22 px registrado na memória do projeto").

**Problema:** o header mede 57 px a 320 px. Uma segunda barra sticky custa mais ~44–56 px de um viewport de 640 px — cerca de 9% da tela, permanentemente, na largura onde a leitura já é mais cara.

**Correção:** declarar o orçamento combinado como aceite (*"header + seletor sticky ≤ 112 px a 320 px"*), **ou** tornar o seletor não-sticky abaixo de 640 px e confiar nos chips roláveis de R-BUILD-9. A segunda opção é mais simples e não perde nada: em 320 px a distância entre tiers adjacentes já cabe em uma tela quando os demais estão compactos.

---

#### M8 · A Fase 5 é grande demais, e o PRD admite isso no próprio texto

**Referência:** §14 Fase 5 — escopo com P1.5 (resto), P1.6, P2.2, P2.3, P2.4, P2.5, P2.6, P2.9, padrão de cartão e blocos da home; risco declarado: "dispersão; **a fase deve ser cortada em entregas por página se passar de duas semanas**".

**Problema:** dez iniciativas sobre oito tipos de página, com a regra de corte escrita dentro da própria fase. Uma fase que já vem com plano de fuga não é uma fase; é uma lista.

**Correção:** cortar agora, não depois (proposta em §10).

---

#### M9 · Quatro linhas da matriz de rastreabilidade apontam para itens que não são requisitos

**Referência:** §16, linhas "Tiers da home não clicáveis… | **P1.5 (parte)**", "Página de classe sem sumário | **P1.5**", "Referência escondida em 'Menu ▾' | **P1.5**", "Leveling sem progresso | **P1.6**".

**Problema:** a convenção do documento (§ cabeçalho) é "cada requisito tem um identificador estável (`R-<área>-<n>`) e pelo menos um critério de aceite verificável". P1.5 e P1.6 são **baldes de prioridade**, não requisitos: não têm ID de requisito e o único aceite deles é uma linha em §13.

**Impacto:** a coluna "Requisito" da matriz aponta para o nada em quatro achados, e o item 11 do próprio checklist de revisão ("cada achado aceito possui requisito") falha.

**Correção:** criar `R-NAV-1…4` (tiers clicáveis na home, CTA de classe, sumário/abas na classe, referência na home e no header) e `R-LEVEL-1…2` (progresso persistido, barra com indicador), cada um com aceite próprio, e reapontar as quatro linhas.

---

#### M10 · Um achado da auditoria foi perdido: não existe índice de skills por classe

**Referência:** auditoria §2.3 ("não existe página índice de skills da classe (`/classes/sorceress/skills` retorna 404)"); PRD §17.1 lista a rota entre as auditadas; **nenhum requisito a trata**.

**Evidência:** `/en-us/classes/sorceress/skills` → **404** em produção hoje.

**Impacto:** J6 declara "toda menção a skill é link" e a rota aparece na lista de rotas auditadas, mas o achado sumiu entre a auditoria e o PRD. É um achado sem requisito — a situação inversa da M9.

**Correção:** decidir explicitamente. Ou criar o requisito, ou registrar em §17.6 como **recusado com motivo** (a árvore + a busca já cobrem o acesso; um índice seria uma terceira porta para o mesmo conteúdo). Recomendo recusar — mas por escrito.

---

### LOW

- **L1 ·** §12 lista "Tempo para localizar uma build pela busca | 2 toques — já bom | Meta: Manter" como métrica. Não é métrica de sucesso; é estado atual. Mover para §2.1.
- **L2 ·** R-TREE-9 introduz `d2rc.level`, mas R-PREF-3 lista só três chaves e tem como aceite "teste que falha se uma chave nova não estiver na lista". R-TREE-9 reprova no gate de R-PREF-3. Acrescentar `d2rc.level` à lista.
- **L3 ·** A instalação como app aparece três vezes (§2.4 possibilidade futura, Q4 questão, P3.4 item de fase) para uma decisão só. Consolidar.
- **L4 ·** O gate de R-A11Y-6 ("teste de CSS procura `@media (prefers-reduced-motion)` para cada transição declarada") é um `grep`: passa com uma media query vazia. O gate promete mais do que verifica. Aceitável para o custo, mas o texto deveria dizer que é uma verificação de presença.
- **L5 ·** O3 diz "todo controle novo com alvo ≥ 24×24 px (gate existente)" enquanto R-A11Y-4 exige "≥ 24×24 px (mínimo) **e ≥ 44 px para controles primários**". O objetivo subdeclara o requisito que resume.

---

## 4. Matriz de contradições

| # | Requisito A | Requisito B | Natureza | Resolução proposta |
|---|---|---|---|---|
| C1 | R-BUILD-12 — sem JS o seletor renderiza como âncoras | R-FILT-2 / R-A11Y-12 — o controle de preferência não renderiza sem JS (mesmo componente) | Contrato no-JS incompatível | Separar navegação (build, sempre no HTML) de preferência (listagem, só com JS) — **B3** |
| C2 | R-BUILD-1 — controle "acima da dobra" | R-BUILD-1 — controle "na região de Resumo" | Interna ao requisito; medida: 938 px a 320 px | Fixar posição acima de "How it plays"; aceite em px — **B2** |
| C3 | §12 — altura ≤ 12.000 px como aceite da Fase 1 | R-BUILD-5 + escopo da Fase 1 (≈ 20.579 px) | Aritmética | Meta de fase 21.000 px; 12.000 px como meta transversal — **B1** |
| C4 | E8 — traduzir `resultsOne/Many` | R-I18N-5 — manter "{count} build/builds" | Editorial | Podar D12/E8; lista única de termos mantidos no ADR 0003 — **H5** |
| C5 | D10 — comentário "menu `<details>`" está desatualizado | `mobile-navigation.tsx` — "Why it is still a `<details>`", verificado em produção | Estado atual incorreto | Remover de D10 — **H6(a)** |
| C6 | D13/P2.9 — "um idioma por rota" | `app/not-found.tsx` — medição: 1009 páginas viraram `ƒ` | Premissa refutada no repositório | Mover para §17.6 — **H1** |
| C7 | R-TREE-1 — 3 colunas a partir de 320 px | R-TREE-3 — piso de 84 px em "288 px úteis" (reais: 280 px, menos 45 px de trilho) | Geometria | Corrigir 280; suprimir o trilho abaixo de 640 px — **H2** |
| C8 | R-TREE-3 — largura do nó | R-TREE-8 — seção ≤ 600 px por tree (fileira atual: 88 px → 568 px + cabeçalhos) | Geometria | Requisito de altura de fileira, ou orçamento de 700 px — **H3** |
| C9 | §6.1 — os seis tiers no HTML "para leitura completa, impressão e no-JS" | R-BUILD-5 (`hidden`) + R-BUILD-15 (impressão só do tier ativo) | Promessa versus mecanismo | `<details>` + regra de impressão que força `[open]` — **M4** |
| C10 | R-TREE-13 — navegação estrita, para na borda | `skill-tree-nav.ts` — invariante de alcançabilidade por setas | Invariante removido sem substituto | Reintroduzir como critério de aceite nas 24 árvores — **H4** |
| C11 | §1.5 #2 — nenhuma afirmação sobre o site escrita à mão | §2.1/§12 — "902 chaves" (reais: 922), "40 scripts" (reais: 46) | O documento viola o próprio princípio | Datar as medições; metas como predicados — **M1** |
| C12 | R-TREE-9 — nova chave `d2rc.level` | R-PREF-3 — aceite falha para chave fora da lista | Lista incompleta | Acrescentar `d2rc.level` — **L2** |

---

## 5. Requisitos tecnicamente prematuros

Requisitos que fixam a solução antes de a decisão de produto exigir:

| Requisito | O que prescreve | Por que é prematuro | O que deveria dizer |
|---|---|---|---|
| **R-BUILD-10** | "script inline mínimo ou classe no `<html>`" antes da pintura | O resultado já é medível (CLS < 0,1); o mecanismo cria fronteira cliente/servidor nova | Só o CLS, mais "sem exceção nova ao teste de fronteira" |
| **R-TREE-17** | sprite `<symbol>`+`<use>`, ≤ 40 KB por classe | O KB por glifo nunca foi testado; o gate que importa é o HTML por página | "Sem raster" (produto) + "≤ 360 KB por página" (gate); 40 KB vira orçamento do plano |
| **R-BUILD-11** | "`role=tablist`-like **ou** grupo de botões com `aria-pressed`" | Oferece duas alternativas com semânticas diferentes e não escolhe — ver §7 | Escolher `aria-pressed` e justificar (não é um tablist: não há painéis mutuamente exclusivos) |
| **R-BUILD-5** | "`hidden`/`<details>`" | Não são equivalentes para a11y nem para impressão | Escolher `<details>` |
| **R-FILT-2** | "Segmento de seis posições (**mesmo componente** do R-BUILD-1)" | Amarra dois contextos com contratos no-JS opostos a uma implementação | Compartilham estilo; comportamento é declarado por contexto |
| **R-TREE-8** | "as outras permanecem no DOM, ocultas" | Prescreve o mecanismo antes de saber se as três árvores cabem no orçamento de HTML por página (312 KB hoje) | Declarar o resultado (troca de tree sem navegação, foco preservado) e medir o custo no protótipo |

---

## 6. Requisitos ausentes

| # | Lacuna | Por que importa | Onde entra |
|---|---|---|---|
| A1 | **Remedição de `GOOD_AT_THRESHOLD` sobre 53 builds** | R-FILT-4 e R-FILT-5 dependem do limiar; a evidência atual é de 29 builds | Novo E6c, bloqueante da Fase 2 |
| A2 | **Altura da fileira da árvore abaixo de 640 px** | R-TREE-3 fixa largura; nada fixa altura, e R-TREE-8 tem meta de altura | Novo R-TREE-3b |
| A3 | **Destino do trilho de nível abaixo de 640 px** | Decide se o nó tem 88 px ou 73 px | Acrescentar a R-TREE-1 |
| A4 | **Invariante de alcançabilidade por teclado nas 24 árvores** | R-TREE-13 remove a garantia atual sem substituto | Acrescentar ao aceite de R-TREE-13 |
| A5 | **Orçamento vertical combinado dos elementos sticky a 320 px** | Header 57 px + seletor sticky em 640 px de viewport | Acrescentar a R-BUILD-4 / R-A11Y-8 |
| A6 | **IDs de requisito para navegação e leveling** | Quatro linhas da matriz apontam para baldes de prioridade | `R-NAV-1…4`, `R-LEVEL-1…2` |
| A7 | **Decisão registrada sobre o índice de skills por classe** | Achado da auditoria perdido; rota ainda 404 | §17.6 (recusa) ou requisito novo |
| A8 | **Regra de impressão que expande os seis tiers** | §6.1 promete impressão completa; nada a implementa | R-BUILD-15 reescrito |
| A9 | **Critérios de aprovação do protótipo da árvore** | Hoje há um único critério (5 s / 30 cm) para a hipótese mais cara do documento | §8.5 ampliado (ver §10) |
| A10 | **Definição de "último filtro" em R-FILT-7** | "Remover último filtro" só é previsível se ancorado no histórico que R-FILT-9 já mantém | R-FILT-7 |

---

## 7. Acessibilidade — revisão crítica

Não aceito uma solução por ter atributos ARIA. Comparo com padrão reconhecido e com a experiência real de teclado.

**`role=grid` na árvore — manter, com uma correção.** É defensável: a grade tem semântica bidimensional real (fileira = nível, coluna = posição do jogo) e o padrão APG de grid é o que descreve navegação por setas com um único Tab stop. O roving tabindex já está implementado e testado. **Mas hoje há um defeito latente:** abaixo de `sm` as células vazias são `hidden sm:block` (`skill-tree-interactive.tsx:387`), ou seja, saem da árvore de acessibilidade — e um `role=grid` com fileiras de larguras diferentes é inválido. Trazer a grade 3×6 para 320 px (R-TREE-1) **corrige isso de graça**, e o PRD deveria dizer que corrige, porque hoje ninguém sabe que está quebrado.

**`tablist` versus `aria-pressed` no seletor de tier — escolher `aria-pressed`.** R-BUILD-11 oferece as duas ("`role=tablist`-like ou grupo de botões"). Não são equivalentes e o "-like" não existe. `tablist` obriga a `tabpanel`s mutuamente exclusivos, e o desenho aprovado é accordion: os seis tiers continuam no DOM, vários podem estar expandidos (sem JS, todos estão). Anunciar "aba 4 de 6" para um accordion mente para o leitor de tela. **`aria-pressed` num grupo de botões, com setas, descreve o que o controle faz.** Corolário: se Q2 = (c) (todos compactos), `aria-expanded` no `<summary>` de cada tier já carrega o estado, e o seletor vira navegação — mais simples ainda.

**Árvores "no DOM, ocultas" (R-TREE-8) — depende de como.** `hidden` (ou `display:none`) é correto: remove da árvore de acessibilidade e do Tab, e o leitor de tela não encontra três árvores quando a interface mostra uma. O que **não** pode é `visibility` ou `aria-hidden` sozinho — o segundo esconde do leitor mas mantém o foco alcançável, que é o pior dos dois mundos. O PRD deve dizer `hidden`, e o aceite deve incluir "nenhum elemento focável dentro de uma tree não ativa".

**`aria-live` no painel (R-TREE-14) — usar com parcimônia.** O requisito pede `role=region` com `aria-live=polite` no desktop. Um painel que reanuncia todo o conteúdo a cada movimento de seta é ruído: navegando pela grade com setas, o usuário recebe o `aria-label` da célula **e** o painel inteiro, duas vezes por tecla. Recomendo: `aria-live` **só na seleção confirmada** (Enter/Espaço/clique), não na mudança de foco; ou nenhum `aria-live` e o painel como `role=region` com nome — o leitor navega até ele quando quiser. A `aria-live` é a escolha certa para o contador de resultados dos filtros (R-FILT-13), onde já existe e onde a mudança é uma linha.

**`<details>` (R-BUILD-5) — a escolha certa, pelo motivo certo.** É o único mecanismo que dá estado expansível sem JavaScript, e o projeto já o usa deliberadamente no menu mobile pelo mesmo motivo. Nota de implementação para o plano, não para o PRD: `<summary>` tem semântica de botão em navegadores modernos, mas não aceita `role` arbitrário sem custo; e conteúdo dentro de um `<details>` fechado não é encontrado pelo Ctrl+F em alguns motores — o que reforça M4 (regra de impressão) e afeta a promessa de "leitura completa".

**Foco preso (R-A11Y-9) — reuso correto.** `lib/focus-trap.ts` e `lib/scroll-lock.ts` já servem três superfícies (sheet de filtros, sheet de skills, menu). Reusar é a decisão certa e o PRD acerta em dizê-lo. Uma condição que falta: o sheet novo de "Seções" (R-BUILD-9) precisa devolver o foco ao gatilho — está em R-A11Y-2, mas não no aceite de R-BUILD-9.

**Hover (R-TREE-11 / R-A11Y-10) — coberto.** O gate `(hover: hover)` já existe no componente e a alternativa por toque/teclado existe. Sem objeção.

**Alvos de toque — a tensão real está na árvore.** R-A11Y-4 quer ≥ 44 px para controles primários e nomeia os nós da árvore. A 320 px, com 280 px úteis, o nó terá ~88 px de largura — folgado — mas a **altura** depende de H3/A2. Se a fileira encolher para caber no orçamento de 600 px da seção, o nó pode ficar abaixo de 44 px de altura. **Os dois requisitos precisam ser resolvidos juntos**, e é isso que o protótipo tem que medir.

**Zoom 400% (R-TREE-15) — o requisito cobre 200%, não 400%.** O texto diz "em 400% (320 px efetivo), idem com nó compacto", mas o aceite é "teste de viewport em 320 px cobre o caso". Não cobre: a 400% de zoom o texto também escala, então o nome do nó ocupa proporcionalmente mais espaço do que ocupa num viewport nativo de 320 px. WCAG 1.4.10 (Reflow) exige 320 px CSS equivalentes, que é o que o teste mede — logo o teste é **suficiente para a conformidade**, mas o PRD não deveria afirmar que "cobre 400%" no sentido visual. Ajustar a redação.

**Sem JavaScript — o ponto mais forte e o mais frágil.** R-A11Y-12 é o melhor requisito de acessibilidade do documento e está em conflito direto com R-BUILD-12 (**B3**). Resolver B3 é resolver metade da acessibilidade do vNext.

---

## 8. Requisitos que devem ser removidos

| Item | Por quê |
|---|---|
| **P2.9, parte "um idioma por rota"** | Refutado com medição no próprio repositório (**H1**). Vai para §17.6. |
| **P2.9, parte "com header"** | Já entregue (**H1**). O item vira só "busca no 404". |
| **D10, parte "menu `<details>`"** | Não é defeito; é decisão vigente que serve o leitor sem JS (**H6a**). |
| **D10/E8, `resultsOne/Many`, `effectChance`, `effectMana`** | Já corretos; "corrigi-los" piora o pt-BR (**H5**). |
| **E6, parte "1009 páginas"** | Registro de medição histórica; reescrever falsifica (**H6c**). |
| **P3.7 — JSON-LD (BreadcrumbList)** | Serve rich results do Google. §3.2 exclui métricas de crescimento e aquisição; o produto é pessoal e o próprio PRD diz que SEO existe "por ser parte de uma página bem formada, não como investimento em aquisição". BreadcrumbList é investimento em aquisição. **Remover, não adiar.** |
| **P3.1 — comparação de duas builds** | O proprietário escreveu as 53 builds. Comparar duas lado a lado tem valor para quem chega de fora; para quem é a fonte, o custo de manutenção (uma superfície nova, `?vs=`, layout de duas colunas em 320 px) não se paga. **Remover, não adiar.** |
| **P3.4 — PWA/manifest** | O proprietário já disse que não é prioridade, e a regra de entrada da Fase 6 ("cada item entra só se o proprietário sentir falta dele em sessão de jogo") já decide. **Remover do roadmap; nota em §2.4.** |
| **P3.8 — rótulo de confiança no cartão** | O proprietário escreveu os rótulos e sabe quais builds são de fonte única. Valor ≈ zero para leitor único; custo de manutenção não nulo. **Remover.** |
| **R-FILT-14, parte "filtros avançados como formulário GET dentro de `<details>`"** | Chips de classe como links (o ganho real) é barato e vale. Um formulário GET completo para os quatro grupos avançados é uma segunda implementação dos filtros, mantida em paralelo com a de cliente, para um leitor sem JS que este site pessoal quase certamente não tem. **Manter os links de classe; cortar o formulário GET.** |

**Nota sobre o modo compacto (R-BUILD-15 / P2.5):** não removo, mas **desacoplo**. O modo compacto de tela serve à consulta com o jogo aberto — é a tese do produto. A folha `@media print` é uma superfície separada com público diferente; amarrá-las ("a mesma folha serve como `@media print`") dobra o custo de teste. Entregar o compacto; decidir a impressão depois, quando houver evidência de que o proprietário imprime.

---

## 9. Priorização revisada

Regras aplicadas: remover o resolvido; não promover preferência visual a P0; separar correção comprovada de redesenho; produto pessoal; minimizar manutenção futura.

### P0 — contradizem o site ou bloqueiam uma fase

| # | Item | Mudança em relação ao PRD |
|---|---|---|
| **P0.1** | Notas de cobertura e listagem (D1, D2, D3) | inalterado — confirmado atual em produção |
| **P0.2** | Equipamento do mercenário (D4) | inalterado — confirmado em `page.tsx:492` |
| **P0.3** | **Remedir `GOOD_AT_THRESHOLD` sobre 53 builds** | **novo** — promovido de E6 (**H6b**); bloqueia a Fase 2 |
| **P0.4** | **Protótipo da árvore mobile** | **promovido** de "antes da fase 3"; bloqueia a Fase 3 e valida O3 e §1.5 #7 |

### P1 — maior impacto

- **P1.1** "Meu tier" e tiers compactos — R-BUILD-1…12, R-PREF-1…4. *Com B1, B2, B3 e Q2=(c) aplicados.*
- **P1.2** Comparação adjacente e upgrades — R-BUILD-6, 7. Inalterado.
- **P1.3** Redesenho dos filtros — R-FILT-1…16 menos o formulário GET. **Depende de P0.3.**
- **P1.4** Árvore, etapa estrutural — R-TREE-1…17. **Depende de P0.4.** Com H2, H3, H4 aplicados.
- **P1.5** Descoberta e orientação — agora `R-NAV-1…4` (**M9**).
- **P1.6** Progresso no leveling — agora `R-LEVEL-1…2` (**M9**).

### P2 — melhorias importantes

P2.1 ícones (Q1); P2.2 dano 1–30 e anterior/próximo; P2.3 filtros em runewords/itens; P2.4 calculadora de breakpoint; P2.5 **modo compacto** (impressão desacoplada); P2.6 tolerância a erro na busca e busca única; P2.7 higiene E6a + pt-BR podado; P2.8 aprofundamento editorial (contínuo); **P2.9 busca no 404** (escopo reduzido).

### P3 — o que sobra

P3.3 página "o que mudou no 3.3"; P3.5 farm por build e imunidade; P3.6 árvore por etapa no leveling.
**Removidos:** P3.1 comparação, P3.2 favoritos *(mantido: é barato e o tier persistido já cria o módulo)*, P3.4 PWA, P3.7 JSON-LD, P3.8 rótulo no cartão.
*Correção:* P3.2 favoritos — **manter**, porque `lib/prefs.ts` já existirá e o custo marginal é uma chave. Removidos de fato: P3.1, P3.4, P3.7, P3.8.

---

## 10. Fases revisadas

**Onze unidades entregáveis** (Fases 0, 1a, 1b, 2, 3, 4, 5a, 5b, 5c, 5d, 6) no lugar das sete do PRD (§14: Fases 0 a 6). Nenhuma passa de ~2 semanas. Cada uma é visível isoladamente.

### Fase 0 — Correções editoriais, mercenário e as duas validações que destravam o resto

- **Escopo:** P0.1, P0.2, E5 (links de skill), E6a (higiene podada), E7 (SVGs órfãos e `resolveRef`), E8 (pt-BR podado) **+ P0.3 remedição do limiar + P0.4 protótipo da árvore**.
- **Por que as duas validações entram aqui:** nenhuma toca layout, nenhuma toca produção, e cada uma destrava uma fase posterior. O protótipo é um HTML estático em `docs/`; o remedição é um script que lê `content/builds/`. Custam dias e podem invalidar semanas.
- **Aceite:** zero afirmações estáticas de cobertura; zero referências sem link; distribuição do limiar publicada sobre 53 builds; protótipo aprovado pelo proprietário (critérios abaixo).
- **Entregável visível:** `/classes`, `/builds` e as 53 builds sem texto falso; mercenário com links.

### Fase 1a — Preferência e navegação por tier

- **Escopo:** `lib/prefs.ts` + `d2rc.tier` (R-PREF-1…4); seletor com os seis tiers **como âncoras no HTML** (B3); os seis tiers **compactos por padrão** (Q2=c); tier ativo expandido por preferência ou hash, hash vence; R-BUILD-1…5, 9, 10, 11, 12.
- **Aceite:** altura a 390 px **≤ 17.500 px** sem preferência e **≤ 21.000 px** com um tier expandido; ≤ 2 ações até o tier; CLS < 0,1; topo do controle ≤ 560 px a 320×640; HTML sem scripts com os seis tiers expandidos e seis âncoras.
- **Entregável visível:** a build deixa de ser uma rolagem de 32 mil px na primeira visita.

### Fase 1b — Comparação adjacente, sumário e descoberta

- **Escopo:** R-BUILD-6, 7, 8; `R-NAV-1…4` (tiers clicáveis na home, CTA de classe, sumário na classe, referência na home e no header).
- **Depende de:** 1a (forma dos dados de tier e do módulo de preferências).
- **Entregável visível:** marcadores novo/mantido/alternativa/removido; "Seções" acessível em um toque; a referência sai do "Menu ▾".

### Fase 2 — Filtros

- Inalterada em escopo, menos o formulário GET (§8). **Depende de P0.3.**

### Fase 3 — Árvore, etapa estrutural

- Inalterada, mas começa com a pergunta mais cara já respondida (P0.4). Com H2 (280 px, trilho), H3 (altura de fileira), H4 (alcançabilidade) e A2/A3 escritos.

### Fase 4 — Ícones

- Inalterada. Com Q1 = (B), "240 desenhos" vira "240 mapeamentos" e a fase pode terminar.

### Fase 5a — Leveling · 5b — Referência · 5c — Skill e busca · 5d — Acabamento

- **5a:** `R-LEVEL-1…2` (progresso persistido, barra com indicador).
- **5b:** P2.3 filtros em runewords/itens, P2.4 calculadora.
- **5c:** P2.2 dano 1–30 e anterior/próximo, P2.6 busca única e tolerância a erro.
- **5d:** padrão de cartão, blocos de referência da home, busca no 404, modo compacto (P2.5).
- Cada uma é uma entrega visível por si; nenhuma depende das irmãs.

### Fase 6 — Aberta

- P3.3, P3.5, P3.6, P3.2, P2.8. Regra de entrada mantida ("só entra o que o proprietário sentir falta em sessão de jogo") — e essa regra é a razão de Q4 e Q5 não precisarem existir.

**Dependências circulares:** nenhuma encontrada. A única que estava implícita e agora fica explícita: Fase 2 → P0.3 (limiar) e Fase 3 → P0.4 (protótipo), ambas resolvidas ao mover as validações para a Fase 0.

---

### Protótipo da árvore mobile — perguntas e critérios de aprovação

Estático, em `docs/`, sem código de produção. Árvores **Cold da Sorceress** (a que o PRD já pede) **e Summoning do Necromancer** — esta última porque carrega os nomes mais longos medidos hoje ("Raise Skeletal Mage", "Corpse Explosion", "Skeleton Mastery").

**O protótipo tem que responder:**

1. **Largura.** Em 280 px úteis (medidos, não 288), três colunas de 84–88 px com vão de 8 px comportam um nome em duas linhas a 11–12 px sem cortar "Raise Skeletal Mage"?
2. **Trilho de nível.** Suprimido abaixo de 640 px, o nível continua legível pelo cabeçalho de fileira sozinho?
3. **Altura da fileira.** Qual altura comporta ícone de 36 px + duas linhas de nome + contador de pontos? O número resultante alimenta o orçamento de R-TREE-8 e o alvo de toque de R-A11Y-4.
4. **Conectores.** Com vãos de 8 px, os traços do SVG se distinguem dos vãos da grade ou lêem como ruído?
5. **Alvo de toque.** O nó fica ≥ 44 px nos dois eixos com a altura escolhida em (3)?
6. **Zoom.** A 400% (320 px CSS efetivos, com o texto escalado), o layout se mantém ou exige um nó diferente?
7. **Estados.** "Bloqueada / disponível / investida / maximizada" se distinguem a 36 px de ícone **sem depender de cor**?
8. **pt-BR.** Os nomes de skill ficam em inglês (ADR 0003), mas o controle de abas traduz ("Frio · Raio · Fogo"). Cabe em 280 px?

**Critérios de aprovação do proprietário** — em telefone real, nos dois idiomas:

- Encontra Blizzard e o caminho de pré-requisito até ela em **≤ 5 s sem tocar** *(critério que o PRD já tem — manter)*.
- Lê **todos** os nomes da árvore Summoning do Necromancer à distância normal de uso, sem zoom.
- Toca **10 nós consecutivos** sem erro de alvo.
- Diz, perguntado diretamente, que prefere isto à lista de hoje.
- Zero rolagem horizontal a 320 px e a 400% de zoom.

**Se reprovar:** a Direção B continua válida para ≥ 640 px, mas o compromisso "a árvore continua sendo árvore em 320 px" (§1.5 #7, O3) precisa ser renegociado **antes** da Fase 1, não depois da Fase 3.

---

## 11. Decisões recomendadas para Q1–Q5

| Questão | Precisa de decisão agora? | Recomendação |
|---|---|---|
| **Q1** Origem dos ícones | **Sim** — define a Fase 4 | **(B) conjunto licenciado único e completo** — não (c) |
| **Q2** Tier ativo sem preferência | **Sim** — define a Fase 1 | **(c) todos compactos** — opção que o PRD não oferece |
| **Q3** Abas em tablet | **Não** — é saída do protótipo | Manter (a); confirmar na Fase 0 |
| **Q4** PWA | **Não** — o PRD já responde | Remover a questão |
| **Q5** Aprofundamento editorial | **Não** — o PRD já responde | Remover a questão |

---

**Q1 · Origem dos ícones.** A recomendação do PRD é (c) — conjunto licenciado como base e próprios para as 53 skills principais. **A preferência declarada do proprietário ("consistência completa importa mais que ter poucos ícones perfeitos") elimina exatamente essa opção**, porque (c) é, por construção, duas mãos visuais convivendo na mesma grade durante um período indeterminado.

| | Cobertura | Consistência | Licença | Atribuição | Esforço | Manutenção | Fidelidade | Performance |
|---|---|---|---|---|---|---|---|---|
| **A** Próprios (240) | 240/240 | máxima | limpa | nenhuma | muito alto (240 desenhos) | alta (classe nova = 30 glifos) | identidade própria | melhor |
| **B** Licenciado completo | 240/240 se o conjunto cobrir | alta (uma mão) | CC BY — atribuição obrigatória | por ícone, no manifesto | médio (240 mapeamentos) | baixa | fantasia genérica, não D2 | igual a A |
| **C** Base + progressivo | 240/240 desde o início | **quebra durante a transição** | mista | dupla | espalhado | **a mais alta** (duas origens + regra visual) | mista | igual |
| **D** Glifos por categoria | 240/240 | perfeita | limpa | nenhuma | ~zero (**é o estado atual**) | mínima | **não distingue Blizzard de Ice Blast** | melhor |

(D) merece ser nomeada pelo que é: o estado de hoje (`components/game/skill-sigil.tsx`, glifo por tipo+elemento), que é precisamente a queixa da auditoria §2.6. Não é etapa intermediária; é ficar parado.

**Recomendo (B), com (A) como horizonte** — e, se um dia for (A), a troca é **completa, de uma vez**, nunca progressiva. R-TREE-19 já prevê `origin`/`license`/`author` por ícone e a página de fontes gerada do manifesto, então (B) custa uma seção de atribuição, não uma arquitetura.

**Mas a decisão depende de proveniência concreta e não deve ser tomada no papel.** A pergunta que decide é: *um único conjunto CC BY cobre 240 skills de D2 sem mapeamentos absurdos?* Ninguém sabe. **Gate proposto:** antes da Fase 4, mapear as 30 skills da Sorceress contra o conjunto candidato e olhar o resultado lado a lado. Se as 30 forem defensáveis, (B) está aprovada; se cinco forem risíveis, (A) é o caminho e a Fase 4 muda de tamanho. Essa é uma decisão do proprietário informada por um artefato, não por uma tabela.

---

**Q2 · Tier ativo sem preferência.** A preferência do proprietário — "evitar que a primeira visita continue com 32 mil px de conteúdo" — **elimina a recomendação (a) do PRD**, porque (a) mantém os seis tiers expandidos até a primeira escolha, ou seja, mantém 31.939 px para toda primeira visita, inclusive a do próprio proprietário em telefone novo, aba anônima ou depois de limpar o navegador.

E (b) — "Econômico como padrão" — é pior por outro motivo: afirma sobre o leitor algo que o site não sabe. Um jogador na segunda dificuldade abre a build e é informado de que está em "Econômico".

**As duas opções do PRD estão incompletas. Falta a terceira:**

> **(c) Sem preferência, os seis tiers renderizam compactos, nenhum pré-selecionado, e o seletor mostra "Onde você está?".**

Cada tier compacto traz cabeçalho, faixa de nível, objetivo em uma frase e uma linha por slot (R-BUILD-5 já define isso), mais "Expandir". Nada é escondido, nada é afirmado, e a primeira visita cai de 31.939 px para **≈ 17.500 px** — a maior redução isolada do documento, a custo zero.

| | Altura na 1ª visita (390 px) | Esconde conteúdo? | Afirma algo falso? |
|---|---|---|---|
| (a) tudo expandido | 31.939 px | não | não |
| (b) Econômico padrão | ≈ 20.600 px | cinco tiers | **sim** |
| **(c) todos compactos** | **≈ 17.500 px** | não (resumo por tier + "Expandir") | não |

Efeitos colaterais, todos favoráveis: R-BUILD-3 fica simples de escrever e de testar (**H7** desaparece); a meta da Fase 1 (**B1**) fica confortável; e o leitor sem JavaScript continua com tudo expandido (R-BUILD-12), que é o comportamento certo para quem não tem como expandir.

---

**Q3 · Abas em tablet.** A preferência do proprietário ((a), abas só abaixo de 640 px) coincide com a recomendação do PRD e com a medição: a 768 px as três grades somam ~1.704 px, altura tolerável em tablet, e a grade 3×6 já sobrevive lá hoje. **Concordo — mas a questão não deve estar na lista de decisões pendentes.** O próprio PRD diz "Quando: no protótipo da fase 3". É uma saída do protótipo, e com o protótipo movido para a Fase 0, Q3 se resolve sozinha antes de qualquer código.

---

**Q4 · PWA.** O proprietário já disse que não é prioridade. **A questão não deveria existir:** P3.4 vive na Fase 6, cuja regra de entrada é "cada item entra só se o proprietário sentir falta dele em sessão de jogo". Essa regra responde Q4 e responderá de novo daqui a seis meses, com informação melhor. **Remover a questão e remover P3.4 do roadmap** (fica a nota em §2.4).

---

**Q5 · Aprofundamento editorial.** O proprietário diz que conteúdo raso pode evoluir continuamente sem bloquear UX — que é literalmente o que §9.2 já escreve ("Editorial, incremental, sem bloquear fases"). **A questão duplica uma decisão que o PRD já tomou.** Remover Q5; manter P2.8 como fluxo contínuo desde a Fase 0, sem posição no roadmap.

**Questão que falta.** Uma decisão real não está listada: **o trilho de nível sobrevive abaixo de 640 px?** (**H2**/A3). É escolha de desenho com consequência medível (nó de 88 px versus 73 px) e deve ser respondida pelo protótipo da Fase 0, junto com Q3.

---

## 12. Checklist de aprovação do PRD

O PRD está aprovado quando **todos** os itens abaixo estiverem verdadeiros. Cada um é verificável por leitura do documento; nenhum exige código.

**Bloqueantes**

- [ ] **B1** A meta de altura da Fase 1 é ≤ 21.000 px (ou ≤ 17.500 px com Q2=c), com a aritmética escrita; ≤ 12.000 px aparece como meta transversal com as fases de que depende nomeadas.
- [ ] **B2** R-BUILD-1 fixa uma posição só para o seletor, e o aceite é um número em px medido em 320×640.
- [ ] **B3** O contrato sem JavaScript está declarado por contexto: navegação (build, no HTML) e preferência (listagem, só com JS), com IDs de requisito distintos.

**Estado atual**

- [ ] **H1** D13 fala só de busca; P2.9 fala só de busca; "um idioma por rota" está em §17.6 com a medição.
- [ ] **H6a** "menu `<details>`" saiu de D10.
- [ ] **H6c** "1009 páginas" está marcado como medição histórica e fora de E6.
- [ ] **H5** D12 e E8 listam só as chaves realmente erradas; a lista de termos mantidos vive uma vez só, no ADR 0003.
- [ ] **M1** As contagens do próprio PRD estão datadas, e as metas são predicados, não limiares numéricos.

**Árvore de skills**

- [ ] **H2** R-TREE-3 usa 280 px; R-TREE-1 declara o destino do trilho de nível abaixo de 640 px.
- [ ] **H3** O baseline de R-TREE-8 é a medição de <640 px (3.511 px), e existe requisito de altura de fileira ou orçamento revisado de seção.
- [ ] **H4** R-TREE-13 traz o invariante de alcançabilidade por setas como critério de aceite nas 24 árvores.
- [ ] **A9** §8.5 lista as oito perguntas do protótipo e os cinco critérios de aprovação; o protótipo está na Fase 0.

**Coerência de requisitos**

- [ ] **H7** R-BUILD-3 tem aceite executável (seis `#gear-*` presentes; lista de headings inalterada).
- [ ] **M4** §6.1, R-BUILD-5 e R-BUILD-15 concordam: `<details>`, com regra de impressão que expande os seis.
- [ ] **M5/M6** R-BUILD-10 e R-TREE-17 declaram resultado, não mecanismo.
- [ ] **M9** `R-NAV-1…4` e `R-LEVEL-1…2` existem, com aceite; a matriz aponta para eles.
- [ ] **L2** `d2rc.level` está em R-PREF-3.
- [ ] **§7** R-BUILD-11 escolhe `aria-pressed` (não "tablist-like"); R-TREE-14 restringe `aria-live` à seleção confirmada; R-TREE-8 diz `hidden` e proíbe elementos focáveis em tree inativa.

**Escopo**

- [ ] **§8** P3.1, P3.4, P3.7, P3.8 e o formulário GET de R-FILT-14 foram removidos (não adiados).
- [ ] **P0.3** A remedição de `GOOD_AT_THRESHOLD` sobre 53 builds é item de Fase 0 e bloqueia a Fase 2.
- [ ] **M10** O índice de skills por classe está resolvido: requisito ou recusa registrada em §17.6.
- [ ] **M8** A Fase 5 está dividida em 5a–5d.
- [ ] **§11** Q1 e Q2 decididos (com Q2 incluindo a opção (c)); Q3 movida para saída do protótipo; Q4 e Q5 removidas.

**Rastreabilidade**

- [ ] Cada achado aceito tem requisito com ID; cada requisito importante tem prioridade; cada prioridade pertence a uma fase; cada requisito tem aceite verificável.
- [ ] Nenhuma linha de §16 aponta para item inexistente ou para balde de prioridade.
- [ ] Nada de compartilhamento, social, contas, sincronização ou backend reaparece indiretamente — **verificado nesta revisão: não reaparece.** O único caso limítrofe era P3.7 (JSON-LD), removido em §8 por servir aquisição.

---

## Confirmação de escopo

A revisão foi conduzida em modo somente leitura. Este documento é o único artefato que ela adiciona ao repositório.

- **Nenhum código, configuração ou conteúdo do produto foi alterado.**
- **O PRD (`docs/product/PRD-vNext.md`) não foi editado.**
- **A auditoria (`docs/product/audits/2026-09-07-product-ux-audit.md`) não foi editada.**
- **Nenhuma correção apontada neste relatório foi implementada.**
- **O commit `e5ebde4` não foi reescrito.**
- **Nenhum push, nenhum deploy.**
- Único arquivo adicionado: `docs/product/reviews/2026-09-08-prd-vnext-review.md` (este documento), em um único commit documental.

O relatório é um parecer, não um plano de execução. As correções que ele propõe pertencem a uma sessão posterior, depois de o proprietário decidir Q1 e Q2 (§11).
