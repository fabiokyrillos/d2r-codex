# Fase 2 — evidência visual (§7.5)

**Data:** 2026-09-09 · **HEAD:** `8350503` ("Phase 2, commit 7") · **Plano:** [`../phase-2-comparison-orientation-plan.md`](../phase-2-comparison-orientation-plan.md)

**70 imagens.** Todas produzidas contra o **build de produção que já estava em `.next`** — nada foi
reconstruído e nenhum arquivo de código foi tocado. O driver é o do próprio repositório
(`scripts/headless.ts`: `Page.launch()`, `setViewport`, `goto`, `evaluate`, `screenshot()`), servindo o
build com `startSite()`, num Chrome real. Antes de cada rolagem o script escreve
`document.documentElement.style.scrollBehavior = "auto"`, porque a rolagem suave global (§3.11) faz a
captura pegar o meio da animação.

Nome do arquivo: `<largura>-<idioma>-<build ou página>-<estado>.png`.

Quando um tier inteiro precisa caber num quadro, a altura da viewport é ajustada à altura medida da
`<section>` daquele tier (a largura é sempre a largura nominal do nome do arquivo). Quem lê a imagem vê
o tier completo, não um recorte.

---

## 0. Nota do coordenador, posterior à captura

Duas coisas mudaram **depois** de estas imagens serem tiradas, e ambas por causa delas.

**O limiar da maioria passou a ser inclusivo.** Este relatório apontou que
`blizzard-sorceress/bis` tem exatamente 70% de "mantido" (7 de 10) e que, com a comparação
*estritamente* maior, nenhuma linha de maioria disparava — deixando um leitor de tela a ouvir
"Mantido" sete vezes na build que o PRD nomeia como baseline. Medido no catálogo: **35 dos 265 tiers
comparáveis estavam exatamente nessa fronteira**, porque dez slots é o tier modal e 7-de-10 a sua
divisão mais comum. O limiar passou a `>=`, o que leva o corpus de **602 para 454** repetições
só-de-leitor-de-tela. As seis imagens `*-shipped.png` foram **retiradas de novo** contra o build novo;
as `*-synthetic-keptshown.png` não mudaram, porque o contrafactual remove a linha de maioria de
qualquer forma. Estado atual das seis:

| imagem | desenhados | só leitor de tela | linha de maioria |
|---|---|---|---|
| `1280-en-us-blade-fury-bis` | 1 | 0 | "Almost all kept here: 9 of 10 slots" |
| `1280-en-us-blade-fury-nightmare` | 0 | 1 | "Almost all new here: 7 of 8 slots" |
| `1280-en-us-blizzard-sorceress-bis` | 3 | **0** | "Almost all kept here: 7 of 10 slots" |
| `1280-en-us-blizzard-sorceress-nightmare` | 5 | 3 | (nenhuma — 5 de 8 é 62,5%) |
| `390-en-us-blizzard-sorceress-bis` | 3 | **0** | idem bis |
| `390-en-us-blizzard-sorceress-nightmare` | 5 | 3 | (nenhuma) |

**Só doze imagens estão versionadas.** As setenta foram produzidas; ficam no repositório as **doze do
eixo decisivo** em en-US (as duas builds × os dois tiers × os dois tratamentos, a 1280 px, mais o par
`blizzard-sorceress` a 390 px onde o silêncio *de facto* poupa altura). As outras 58 — os outros
idiomas, o sumário, o header a 900 px, a página sem JS, o zoom de 200% — seguem a convenção que o
próprio PRD usa em §17.4 para as capturas da auditoria: **produzidas e medidas, não versionadas**. Os
números que elas sustentam estão escritos abaixo, que é o que sobrevive a um `git clone`.

**A conclusão do relatório foi aceita e o plano corrigido.** §7.2.1 do plano passa a dizer que, a
partir de 640 px, silenciar "mantido" **não poupa pixel nenhum**, e que onde a maioria dispara o
tratamento rejeitado é 36 px mais curto. A decisão fica; a justificação passa de "altura e ruído" para
**encontrabilidade da exceção**, que é o que as imagens de facto mostram.

---

## 1. O eixo decisivo — "mantido" desenhado ou silencioso

§7.2 mandou decidir **com evidência visual** e disse que *"se as capturas contrariarem a aritmética, a
aritmética perde"*. Estas são as capturas.

### 1.1 O que "sintético" significa, exatamente

O tratamento `-synthetic-keptshown` é o contrafactual que §7.2 rejeitou, injetado no DOM só para a
foto: **toda ocorrência carrega o próprio rótulo desenhado, e a linha de maioria desaparece**. Em
concreto, o script

1. remove o `<p data-tier-majority>` do tier;
2. tira o `sr-only` de cada `<span data-slot-marker="kept">` e lhe dá as mesmas classes de um marcador
   desenhado (`block text-xs tracking-wide uppercase text-ink-muted`);
3. cria um marcador desenhado nas linhas que a regra de maioria deixava sem nada, com a palavra do
   estado majoritário do tier.

Nenhum arquivo do site foi alterado; a injeção vive na página carregada e morre com ela.

### 1.2 Os quatro, na mesma build (`blizzard-sorceress`), nos dois idiomas

| largura · idioma | tier | linhas | desenhados (enviado) | "mantido" só no leitor | linha de maioria | desenhados (sintético) | altura da seção |
|---|---|---|---|---|---|---|---|
| 1280 en-US | `nightmare` | 8 | **5** | 3 | — | 8 | 1491 → 1491 px (**+0**) |
| 1280 en-US | `bis` | 10 | **3** | 7 | — | 10 | 1762 → 1762 px (**+0**) |
| 1280 pt-BR | `nightmare` | 8 | **5** | 3 | — | 8 | 1537 → 1537 px (**+0**) |
| 1280 pt-BR | `bis` | 10 | **3** | 7 | — | 10 | 1808 → 1808 px (**+0**) |
| 390 en-US | `nightmare` | 8 | **5** | 3 | — | 8 | 2658 → 2706 px (**+48**) |
| 390 en-US | `bis` | 10 | **3** | 7 | — | 10 | 2842 → 2954 px (**+112**) |
| 390 pt-BR | `nightmare` | 8 | **5** | 3 | — | 8 | 2796 → 2844 px (**+48**) |
| 390 pt-BR | `bis` | 10 | **3** | 7 | — | 10 | 2911 → 3023 px (**+112**) |

Arquivos: `{1280,390}-{en-us,pt-br}-blizzard-sorceress-{nightmare,bis}-{shipped,synthetic-keptshown}.png`
(16 imagens).

### 1.3 O mesmo eixo onde a regra de maioria realmente dispara

`blizzard-sorceress` **não tem linha de maioria em nenhum dos dois tiers** — `nightmare` é 5 novos de 8
(62,5%) e `bis` é 7 mantidos de 10, exatamente 70%, e o limiar é *estritamente maior* que 70%
(`lib/builds/compare-tiers.ts:118`). Capturar só essa build tornaria a metade "estado majoritário" da
decisão infalsificável, então o mesmo par foi feito numa build onde a regra dispara nos dois tiers:

| largura · idioma | tier | linhas | desenhados (enviado) | linha de maioria (enviado) | desenhados (sintético) | altura da seção |
|---|---|---|---|---|---|---|
| 1280 en-US | `blade-fury` `nightmare` | 8 | **0** | "Almost all new here: 7 of 8 slots" | 8 | 1004 → **968** px (**−36**) |
| 1280 en-US | `blade-fury` `bis` | 10 | **1** | "Almost all kept here: 9 of 10 slots" | 10 | 1306 → **1270** px (**−36**) |
| 1280 pt-BR | `blade-fury` `nightmare` | 8 | **0** | "Quase tudo novo aqui: 7 de 8 slots" | 8 | 1004 → **968** px (**−36**) |
| 1280 pt-BR | `blade-fury` `bis` | 10 | **1** | "Quase tudo mantido aqui: 9 de 10 slots" | 10 | 1306 → **1270** px (**−36**) |

Arquivos: `1280-{en-us,pt-br}-blade-fury-{nightmare,bis}-{shipped,synthetic-keptshown}.png` (8 imagens).

### 1.4 Minha leitura, sem enfeite

**O tratamento enviado é o melhor — e a aritmética que §7.1 e §7.2 usam para defendê-lo não sobrevive
às fotos em 1280 px.**

O que as imagens mostram, na ordem em que muda a conclusão:

1. **De 640 px para cima, silenciar "mantido" não economiza um pixel.** Em `blizzard-sorceress`,
   desenhar sete "KEPT" a mais no `bis` deixa a seção exatamente na mesma altura (1762 → 1762 px em
   en-US, 1808 → 1808 px em pt-BR). §7.1 já dizia que a coluna do slot é mais curta que a dos picks e
   que o marcador "custa zero altura" — está confirmado, e **isso corta para os dois lados**: também
   tira do argumento contra desenhar "mantido" a parte de altura.
2. **Onde a linha de maioria substitui os rótulos, o tratamento sintético é 36 px mais curto.** Em
   `blade-fury`, apagar a frase e rotular as oito/dez linhas *encolhe* a seção. Em 1280 px, "repetir
   por slot" é literalmente mais barato em pixels que "dizer uma vez".
3. **O argumento que as fotos sustentam é de sinal, não de altura.** Na captura `bis` enviada, três
   palavras aparecem na coluna do slot — ALTERNATIVE, NEW, NEW — e o olho cai exatamente nas três
   linhas que mudaram. Na sintética, dez palavras aparecem, e "KEPT" usa **o mesmo tom cinza** de
   "NEW": a coluna vira uma escada uniforme de palavras e as três exceções deixam de ser figura contra
   fundo. Não é ruído de altura; é perda de contraste de informação. A regra do proprietário ("não
   exibir 'mantido' repetidamente se isso tornar a página mais ruidosa que útil") é atendida por esse
   motivo, não pelo que §7.1 mede.
4. **Em 390 px o tratamento enviado ganha também em altura**, porque ali o rótulo empilha e custa 16 px
   por linha: +48 px em `nightmare` (3 rótulos) e +112 px em `bis` (7 rótulos), ~3,9% da altura do
   tier. A captura `390-pt-br-blizzard-sorceress-bis-synthetic-keptshown.png` é a mais eloquente do
   lote: "MANTIDO" sete vezes numa coluna estreita, com "NOVO" e "ALTERNATIVA" perdidos no meio.

**Se eu tivesse de defender o sintético**, teria um argumento honesto: ele é uniforme e nunca obriga o
leitor a saber que "sem rótulo" quer dizer "mantido" — o tratamento enviado tem um estado tácito, e um
estado tácito é uma convenção que o leitor precisa aprender. Em 1280 px isso custa zero pixel. É um
argumento real, e é o que a foto sintética em 1280 px mostra bem. Mas ele perde nos dois pontos que
importam mais: a exceção deixa de ser encontrável, e em telefone o preço aparece em altura.

**Recomendação:** manter §7.2 como está — mas **corrigir a justificativa** para dizer "achabilidade da
exceção" em vez de "altura/ruído", porque a medição em 1280 px não sustenta a segunda.

### 1.5 Densidade de selo realmente observada (contada nas próprias capturas)

§7.2 projeta, por tier e "se mantido for silencioso", 91,5% em `nightmare` e 14,6% em `bis`. **Nenhum
desses dois números aparece nestas fotos**, porque a tabela de §7.2 é anterior à regra de maioria e é
uma média sobre as 53 builds. O que está desenhado nas imagens:

| build · tier | linhas | desenhados | % com selo | linha de maioria |
|---|---|---|---|---|
| `blade-fury` `early-hell` | 10 | 0 | **0%** | "…new here: 10 of 10" |
| `abyss-warlock` `nightmare` | 8 | 0 | **0%** | "…new here: 8 of 8" |
| `blade-fury` `nightmare` | 8 | 0 | **0%** | "…new here: 7 of 8" |
| `leap-attack-barbarian` `nightmare` | 10 | 0 | **0%** | "…novo aqui: 10 de 10" |
| `blade-fury` `bis` | 10 | 1 | **10%** | "…kept here: 9 of 10" |
| `smiter` `bis` | 10 | 1 | **10%** | "…kept here: 9 of 10" |
| `smiter` `budget` | 8 | 1 | **12,5%** | "…new here: 7 of 8" |
| `blizzard-sorceress` `bis` | 10 | 3 | **30%** | — (7/10 = 70%, não passa) |
| `hammerdin` `optimized` | 10 | 3 | 30% | — |
| `summoner-necromancer` `budget` | 10 | 3 | 30% | — |
| `abyss-warlock` `optimized` | 10 | 3 | 30% | — |
| `nova-sorceress` `optimized` | 9 | 3 | 33% | — |
| `blade-fury` `budget` | 11 | 5 | 45% | — |
| `blizzard-sorceress` `nightmare` | 8 | 5 | **62,5%** | — (5/8 = 62,5%, não passa) |
| `leap-attack-barbarian` `early-hell` | 10 | 7 | **70%** | — |
| `hammerdin` `early-hell` | 7 | 5 | **71%** | — |

Faixa observada: **0% a 71%**, com a moda entre 0% e 33%. As duas densidades mais altas do lote **não
são `nightmare`** — são `early-hell`, o tier que a tabela de §7.2 nem destaca. Nas capturas sintéticas
a densidade é 100% em todos os casos, por construção.

---

## 2. Onde as capturas contrariam ou qualificam o plano

Registrado aqui porque §7.2 pediu exatamente isto.

1. **§7.2, sobre `bis`, não vale para a build de referência do PRD.** O texto diz que a regra dá a
   `bis` "uma frase e ~1,4 rótulos em vez de oito repetições de 'Kept' no leitor de tela". Em
   `blizzard-sorceress` — a build que §7.5 nomeia e que o PRD usa como baseline — a maioria **não
   dispara** (7 mantidos de 10 é exatamente 70%, e o limiar é `> 0.7`), então o leitor de tela ainda
   ouve "Kept" **sete vezes**. O comportamento é o que o código declara em
   `lib/builds/compare-tiers.ts:112-118`, e a decisão de limiar é defensável; o que não se sustenta é a
   frase de §7.2 aplicada a essa build. As duas fotos `…-bis-shipped.png` em 1280 px mostram o tier sem
   nenhuma linha de maioria.
2. **A economia de altura ao silenciar "mantido" é 0 px de 640 px para cima**, e **−36 px a favor do
   sintético** onde a maioria dispara. §7.1/§7.2 argumentam com "caixa em 87% das linhas" e com ruído;
   a parte "caixa" já foi corrigida para micro-rótulo, e o que sobra da aritmética não decide nada em
   desktop. Ver §1.4 acima.
3. **A tabela de densidade de §7.2 não descreve a página depois das duas regras.** Ver §1.5.
4. **`nav.reference` não nomeia o landmark em 900–1399 px.** O rodapé de §10.4 diz que `nav.reference`
   passaria a nomear dois landmarks (a nav de referência do desktop e este painel). No build, o gatilho
   lê "Reference"/"Referência" a partir de 900 px (medido, e visível nas capturas `900-*-home-header-*`)
   mas o `aria-label` do `<nav>` de dentro continua `nav.menu` em toda largura — decisão deliberada,
   com a razão escrita em `components/layout/site-header.tsx:195-200` ("Menu" é o nome honesto para uma
   região com os dez links). Os `aria-label` medidos em 900 px são `["Primary", "Reference", "Menu"]`
   (en-US) e `["Principal", "Referência", "Menu"]` (pt-BR). Uma foto não mostra `aria-label`; fica
   registrado como divergência entre §10.4 e o comentário do código, para o proprietário escolher qual
   texto corrigir.
5. **A 200% de texto em 320 px a página transborda lateralmente — e não é por causa dos marcadores.**
   Com `font-size` de raiz em 200% (32 px), `documentElement.scrollWidth` mede **552 px** contra 320 px
   de viewport. Removendo **todos** os `[data-slot-marker]` do documento, continua 552 px. O que
   transborda é a linha do cabeçalho (o `<span class="min-[900px]:hidden">Menu</span>` e o painel
   `w-56`). A 100% de texto, na mesma largura, `scrollWidth` é exatamente 320 px. Pré-existente,
   fora do escopo desta fase, registrado por ter aparecido na captura que §7.5 pediu.
6. **`TIER_CEILING` (460 px) não tem sentido a 200% de texto.** Os tiers compactos medem 923–1068 px a
   320 px pt-BR com o raiz em 32 px, ou seja 2,0–2,3× o teto. É a aritmética esperada (tudo é `rem`),
   mas o teto guarda 100% de texto e só isso — a folga de 40 px que §7.5 cita é do tamanho padrão.

---

## 3. Índice das imagens

### 3.1 O eixo decisivo (24)

| arquivo | mostra |
|---|---|
| `1280-en-us-blizzard-sorceress-nightmare-shipped.png` | `nightmare` expandido como enviado: 5 rótulos desenhados, 3 "kept" silenciosos, sem linha de maioria |
| `1280-en-us-blizzard-sorceress-nightmare-synthetic-keptshown.png` | o mesmo tier com "KEPT" desenhado em toda linha |
| `1280-en-us-blizzard-sorceress-bis-shipped.png` | `bis` como enviado: ALTERNATIVE + NEW + NEW, e o bloco "FINAL SETUP" com o texto autorado |
| `1280-en-us-blizzard-sorceress-bis-synthetic-keptshown.png` | o mesmo `bis` com dez rótulos — sete deles "KEPT" |
| `1280-pt-br-…` (4) | os mesmos quatro em pt-BR ("MANTIDO", "NOVO", "ALTERNATIVA") |
| `390-en-us-…` (4) e `390-pt-br-…` (4) | os mesmos oito em 390 px, onde o rótulo empilha e custa 16 px por linha |
| `1280-{en-us,pt-br}-blade-fury-{nightmare,bis}-{shipped,synthetic-keptshown}.png` (8) | o mesmo eixo numa build onde a **linha de maioria dispara nos dois tiers** |

### 3.2 Estados de marcador (9)

| arquivo | mostra |
|---|---|
| `1280-en-us-smiter-budget-removed-belt-amulet.png` | **slot removido**: `early-hell` → `budget` perde `belt` e `amulet`; bloco "No longer worn" no fim do tier, com o item riscado |
| `390-pt-br-smiter-budget-removed-belt-amulet.png` | o mesmo em pt-BR a 390 px ("Não se usa mais") |
| `1280-en-us-nova-sorceress-optimized-removed-offhand.png` | **slot removido**: `budget` → `optimized` perde `offhand` |
| `768-pt-br-nova-sorceress-optimized-removed-offhand.png` | o mesmo a 768 px, pt-BR |
| `1280-en-us-blade-fury-budget-duplicate-weapon.png` | **a duplicata**: `budget` lista `weapon` duas vezes; as duas ocorrências são comparadas por índice e carregam marcadores independentes (11 linhas) |
| `390-pt-br-blade-fury-budget-duplicate-weapon.png` | a duplicata a 390 px, pt-BR |
| `1280-en-us-blade-fury-early-hell-many-changes.png` | **tier com muitas mudanças**: 10 de 10 novos → uma frase, zero rótulos |
| `1280-en-us-smiter-bis-few-changes.png` | **tier com poucas mudanças**: 9 de 10 mantidos → uma frase e um único "NEW" |
| `390-pt-br-smiter-bis-few-changes.png` | o mesmo em pt-BR a 390 px |

### 3.3 As builds nomeadas (8)

`1280-en-us-hammerdin-optimized.png` · `768-pt-br-hammerdin-early-hell.png` ·
`1280-en-us-summoner-necromancer-budget.png` · `320-pt-br-summoner-necromancer-budget.png` ·
`1280-en-us-leap-attack-barbarian-early-hell.png` (Barbarian) ·
`390-pt-br-leap-attack-barbarian-nightmare.png` ·
`1280-en-us-abyss-warlock-nightmare.png` (Warlock) · `320-pt-br-abyss-warlock-optimized.png`.

`blizzard-sorceress` e `blade-fury` estão em §3.1 e §3.2. Cobertura de largura das duas seções juntas:
320, 390, 768 e 1280, nos dois idiomas.

### 3.4 O BiS terminal (3, mais os `bis` de §3.1)

| arquivo | texto medido no bloco |
|---|---|
| `1280-en-us-dragon-tail-bis-terminal.png` | **"FINAL SETUP" seguido de "Nothing."** — o caso exato que §6 promete mostrar |
| `1280-pt-br-dragon-tail-bis-terminal.png` | **"CONFIGURAÇÃO FINAL" seguido de "Nada."** |
| `1280-en-us-hammerdin-bis-terminal.png` | "FINAL SETUP" + "Nothing in your own gear. Verify your block is at 75%…" — o caso em que apagar o texto apagaria conteúdo autorado |

Minha leitura de `dragon-tail`: é redundante e é verdadeiro, como §6 diz. Em pt-BR fica um pouco pior
que em en-US, porque "Nada." sozinho vira um parágrafo de uma palavra dentro de um bloco com borda, e o
bloco parece grande demais para o que carrega. Não apaga nada e não mente; se o proprietário quiser
outra coisa numa fase futura, o alvo é **só** o par `finalSetup` + `nextUpgrade` começando por
"Nothing."/"Nada." sem frase depois — são duas builds (`dragon-tail`, `whirlwind-assassin`), não as
oito.

### 3.5 A linha "Próximo:" (3)

| arquivo | mostra |
|---|---|
| `1280-en-us-blizzard-sorceress-next-line.png` | `nightmare` aberto; o tier compacto **imediatamente seguinte** (`early-hell`) carrega "Next: …"; `budget`, `optimized` e `bis` **não** |
| `390-pt-br-blizzard-sorceress-next-line.png` | "Próximo:" a 390 px, em duas linhas (`line-clamp-2`) |
| `320-pt-br-blizzard-sorceress-next-line.png` | o mesmo a 320 px |

Medido junto com as fotos: dos cinco `[data-tier-next]` do documento, **exatamente um** tem
`display` diferente de `none` — o do tier seguinte ao aberto — com `-webkit-line-clamp: 2`. Altura da
linha: 19 px a 1280 px (uma linha), 39 px a 390 e a 320 px (duas linhas, cortadas).

### 3.6 O sumário da página de build (6)

| arquivo | mostra |
|---|---|
| `640-en-us-hammerdin-summary-row.png` | regime desktop no limite: gatilho retirado, 11 entradas em **duas** linhas (92 px) |
| `768-en-us-hammerdin-summary-row.png` | uma linha (60 px) |
| `1280-en-us-hammerdin-summary-row.png` | uma linha (60 px) |
| `768-pt-br-hammerdin-summary-row.png` | o mesmo em pt-BR |
| `320-pt-br-hammerdin-summary-sheet-open.png` | **sheet aberto**: `position: fixed`, do y=114 ao fim da viewport (o teto de 80vh), scrim escurecendo a página, 11 entradas |
| `390-en-us-hammerdin-summary-sheet-open.png` | sheet aberto a 390 px (y=292→844) |

### 3.7 O sumário da página de classe (2)

`1280-en-us-classes-sorceress-summary.png` e `320-pt-br-classes-sorceress-summary.png`.
Cinco entradas — Start here / Core mechanics / Attributes / Skill trees / Breakpoints
(Comece por aqui / Mecânicas centrais / Atributos / Árvores de skills / Breakpoints) — **sempre
visíveis, sem divulgação**: 49 px numa linha a 1280 px, 157 px quebrando a 320 px. Todas as cinco
âncoras resolvem para um elemento presente no documento (verificado no momento da captura).

### 3.8 O cabeçalho e a home (8)

| arquivo | mostra |
|---|---|
| `900-en-us-home-header-reference.png` | a 900 px o gatilho lê **"Reference"** |
| `900-pt-br-home-header-reference.png` | a 900 px lê **"Referência"** |
| `900-en-us-home-header-reference-open.png` | o mesmo painel aberto, com os dez links |
| `390-pt-br-home-header-menu.png` | abaixo do degrau o gatilho continua **"☰ Menu"** — o outro lado da condição de §10.4 |
| `1280-en-us-home-tier-cards.png` | os **seis cartões de tier**, cada um um link inteiro para `/en-us/builds` |
| `390-pt-br-home-tier-cards.png` | os mesmos seis a 390 px, `/pt-br/builds` |
| `1280-en-us-home-reference-block.png` · `1280-pt-br-home-reference-block.png` | o **bloco de referência** da home: Runes/Items/Breakpoints/Mercenaries/Mechanics e Runas/Itens/Breakpoints/Mercenários/Mecânicas |

### 3.9 Sem JavaScript (3)

`1280-en-us-blizzard-sorceress-nojs-from-starter.png`,
`1280-en-us-blizzard-sorceress-nojs-from-budget.png` (a metade de baixo da mesma página) e
`390-pt-br-blizzard-sorceress-nojs-from-starter.png`.

Medido com o scripting desligado no momento da navegação: **6 de 6** tiers `open`, **22** marcadores
desenhados e **23** "Kept" só no leitor de tela na página inteira, **0** previews compactos visíveis,
**0** linhas "Próximo:" visíveis. É exatamente o que §7.3 promete ao leitor sem JS — o `nextUpgrade`
inteiro ao pé de cada tier aberto, e nenhuma linha derivada.

### 3.10 200% de texto a 320 px, pt-BR (4)

| arquivo | mostra |
|---|---|
| `320-pt-br-blizzard-sorceress-zoom200-nightmare.png` | o tier aberto com o raiz em 32 px |
| `320-pt-br-blizzard-sorceress-zoom200-marker.png` | um marcador desenhado a 200%: "ALTERNATIVA", `font-size` 24 px, `line-height` 32 px, uma linha, sem colisão com o nome do slot |
| `320-pt-br-blade-fury-zoom200-majority-line.png` | a frase de maioria — a string nova mais longa — a 200%: "Quase tudo novo aqui: 7 de 8 slots" em **três** linhas, 96 px |
| `320-pt-br-blizzard-sorceress-zoom200-compact-next.png` | os tiers compactos e a linha "Próximo:" a 200%; alturas medidas: 923–1068 px por tier compacto |

A emulação é `document.documentElement.style.fontSize = "200%"` (zoom de texto, que é o que §7.4 mede),
não zoom de página. Ver §2.5 e §2.6 para o que essas duas capturas revelaram.

---

## 4. O que não foi capturado, e por quê

- **Nenhum estado de foco, hover ou `:target`.** §7.5 não pede, e uma captura estática de foco exigiria
  dirigir o teclado — cabe nos gates de a11y, não aqui.
- **Nenhuma combinação exaustiva.** São 53 builds × 6 tiers × 4 larguras × 2 idiomas; foram capturados
  os casos que §7.5 nomeia, mais o segundo eixo decisivo de §1.3, que o plano não nomeia mas sem o qual
  a metade "estado majoritário" da decisão ficaria sem foto.
- **A página inteira sem JS numa só imagem.** Com os seis tiers abertos ela passa de 9.000 px; foram
  capturadas duas faixas de 2.600 px em 1280 px e uma em 390 px, com a contagem de tiers abertos
  medida na mesma sessão e publicada em §3.9.
- **`aria-label` e texto `sr-only`** não aparecem em foto nenhuma, por definição. Os números de §3.9 e
  o item 1 de §2 vêm de medição no mesmo Chrome, na mesma navegação da captura.
