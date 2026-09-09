# Plano da Fase 2 — Comparação, orientação e descoberta

**Data:** 2026-09-09 · **Baseline:** `0b5a2bc` · **PRD:** [`../PRD-vNext.md`](../PRD-vNext.md) §14 "Fase 2"
**Escopo:** R-BUILD-6, R-BUILD-7, R-BUILD-8; R-NAV-1…4; R-I18N-7 (carregado explicitamente para esta fase).
**Fase anterior:** [`phase-1-tier-preference-plan.md`](phase-1-tier-preference-plan.md) · [`phase-1-report.md`](phase-1-report.md)
**Revisão:** duas revisões adversariais independentes sobre a primeira versão. Veredito das duas: **não
pronto**. 6 BLOCKER e 11 HIGH, todos dispostos em §23. Esta é a versão corrigida.

> **As Fases 3, 4 e 5 não são iniciadas por este plano.**

---

## 1. Resumo executivo

A Fase 1 encolheu a seção Gear de 16.458 px para 2.034 px e deu ao leitor um tier preferido. Deixou-o
sem duas coisas: **o que mudou** entre um tier e o anterior, e **onde ele está** numa página de
18.344 px. Esta fase entrega as duas, mais quatro correções de descoberta (`R-NAV-1…4`) e o conserto
do fragmento na troca de idioma que a Fase 1 registrou e não fez.

Três agentes mediram o repositório antes de qualquer código; duas revisões adversariais mediram o
plano depois. **A revisão derrubou quatro mecanismos que a primeira versão dava como certos**, e cada
um está corrigido com uma medição, não com um argumento:

1. **O guarda de remoção não disparava.** A regra de identidade é `ref` primeiro; a remoção falsa que
   ela existia para suprimir compara `label:weapon switch…` com `runeword:call-to-arms`. Identidades
   diferentes, guarda morta — **0 supressões em 53 builds**. Substituído por uma regra estrutural que
   dispara exatamente uma vez (§4.5).
2. **`sm:block` não revela um `<details>` fechado.** Medido em Chrome 151: o painel é escondido por
   `content-visibility: hidden` no pseudo-elemento `::details-content`, e `display` num filho não
   vence um `content-visibility` num ancestral. O sumário do desktop teria renderizado **invisível**,
   com todos os gates verdes. Substituído pelo padrão que a Fase 1 já provou (§8.1).
3. **O orçamento de altura mirava 1 de 7 constantes.** A que aperta primeiro não é a que a primeira
   versão citou, e o gatilho de parada estava acima do ponto onde uma **afirmação publicada** da
   Fase 1 quebra (§3.8).
4. **A decisão sobre "mantido" foi argumentada a partir de um estado que o padrão nunca mostra.** Os
   52,6% são de uma página com os seis tiers abertos; a Fase 1 abre **um**. Por tier o quadro
   inverte-se, e a decisão foi refeita (§7.2).

E duas medições que **refutam** riscos levantados: o cabeçalho não transborda em 900–1023 px hoje
(§3.9), e a rolagem suave custa 297–1.296 ms, não os ~1.500 ms estimados (§3.11).

---

## 2. Verificação do baseline

| Invariante | Estado |
|---|---|
| branch | `main` |
| `HEAD` / `origin/main` | `0b5a2bcd706698a26e85c3b5054a4b0d967eb1c6`, idênticos |
| worktree | limpo (`git status --porcelain` vazio) |
| stashes | nenhum |
| worktrees | um |
| Fase 1 | publicada no deployment `6354306313` |
| `npm run check` | **verde**, exit code lido de volta do log |

Investigação e revisão correram **somente leitura**, com todos os scripts descartáveis no scratchpad,
e `git status --porcelain` conferido depois de cada agente.

---

## 3. O que a medição estabeleceu

### 3.1 As 45 lacunas de `nextUpgrade` são todas em `bis`

| Medição | Valor |
|---|---|
| builds / tiers | 53 / **318** (nenhuma build incompleta) |
| tiers com `nextUpgrade` | **273** · sem: **45** |
| **lacunas fora de `bis`** | **ZERO** |
| por tier | starter…optimized 53/0 cada · **bis 8/45** |
| **tiers-fonte da repetição (`starter`…`optimized`)** | **265 de 265 têm `nextUpgrade`** |
| primeiro `starter` / último `bis` | 53/53 |

A decisão de "BiS terminal" cobre exatamente o conjunto das lacunas: **nenhum requisito muda e nenhum
dado é alterado.** E como `bis` não tem "seguinte", as 45 lacunas **não tocam** a metade de repetição
de R-BUILD-7.

*Reproduzido integralmente pela revisão 1.*

### 3.2 Os quatro estados são totais

| Estado | Total | nightmare | early-hell | budget | optimized | bis |
|---|---|---|---|---|---|---|
| **novo** | 999 | 329 | 279 | 220 | 109 | 62 |
| **mantido** | 1.245 | 32 | 145 | 252 | 373 | 443 |
| **alternativa** | 125 | 15 | 18 | 41 | 37 | 14 |
| **removido** (regra §4.5) | **48** | 8 | 36 | **3** | **1** | 0 |

`999 + 1.245 + 125 = 2.369` = todas as ocorrências de slot fora de `starter` (2.659 − 290). Nenhum
slot escapa. Das 125 "alternativa", 33 vêm de pick secundário e 92 de `alternatives[]` aninhada.

*Toda a tabela reproduzida pela revisão 1, dígito a dígito.*

> **Correção medida durante a implementação (commit 3).** A linha de removidos desta tabela dizia
> `budget 2 / optimized 2`. O real é **`budget 3 / optimized 1`**. A regra ingênua dá `budget 3 /
> optimized 2`, e a única supressão de §4.5 é `blade-fury budget→optimized`, **cujo tier de destino é
> `optimized`** — a subtração tinha sido feita na coluna errada. Os totais (48 adotado, 49 ingênuo),
> os 30 pares e as 235 de 265 renderizações **não mudam**, e as outras dezanove células da tabela
> reproduzem. As três de `budget` são `smiter` a perder `belt` e `amulet` e `zealot` a perder
> `gloves`; a de `optimized` é `nova-sorceress` a perder `offhand`.

### 3.3 Um único slot duplicado — e a remoção falsa que ele produz

`blade-fury/budget` é o **único** (build, tier) com slot duplicado: `weapon` ×2, sendo a segunda a
**décima primeira e última** entrada, depois de `amulet`:

```
blade-fury/budget    weapon[0]  runeword:passion
                     weapon[10] label:"Weapon switch: Call to Arms and a Spirit shield"
blade-fury/optimized weapon×1   runeword:grief      weaponSwap: [runeword:call-to-arms]
```

A décima primeira entrada é, de facto, uma entrada de `weaponSwap` autorada dentro de `slots`. Some em
`optimized` — mas o conteúdo continua lá, no `weaponSwap`. Uma implementação literal publica
**"Removido: Weapon — Call to Arms weapon switch"** na única build com slot duplicado.

**Ordem autorada é carga estrutural:** apenas **1 de 318** tiers lista slots na ordem canônica de
`GEAR_SLOTS`; apenas **9 de 53** builds mantêm a mesma sequência nos seis tiers.

### 3.4 Identidade: `ref` primeiro

| Medição | Valor |
|---|---|
| picks (nível de topo, `slots`+`charms`+`weaponSwap`) com `ref` | 2.685 · sem `ref`: 834 |
| ref-less **dentro de `slots`** | **408** |
| picks sem `ref` **e** sem `label` | **0** (a regra é total) |
| picks com `ref` **e** `label` na fonte en-US | **0** |
| `ref.kind` em uso | 2 de 7 — `unique`, `runeword` |
| slugs sob mais de um `kind` / colisões entre catálogos | **nenhuma** |
| overlays pt-BR que sobrescrevem `label` | 385 · ref-less que diferem por idioma: 334 |
| **divergência de marcador en × pt, identidade por `ref`** | **0** |
| divergência com identidade por `label` | **1** (`hammerdin/bis/gloves-0`) |

> Contagem: 2.685 + 834 = 3.519 é o censo **raso** (picks de topo). O censo **profundo**, incluindo os
> 308 `alternatives[]` aninhados, é 3.827. As duas contagens aparecem separadas de propósito; a
> primeira versão deste plano misturava-as numa tabela só.

ADR 0003 §1 explica por quê: overlays pt-BR endereçam picks por `${slot}-${index}` e `label` é copy
localizada. **A comparação roda sobre os dados invariantes**, e `kind` entra na chave para impedir a
primeira colisão futura, não uma atual.

### 3.5 A forma curta não pode ser derivada sem inventar texto

Sobre os **265** textos-fonte (`starter`…`optimized`):

**(i) extrair nomes de catálogo** — falha em **103 de 265 (38,9%)**: são os tiers cujo próximo passo
não é um item (`smiter/starter`: "Level 30 is the real start of the build"). A forma do exemplo do PRD
funciona em no máximo 61% dos casos.

**(ii) truncar** — medido sobre os **273** textos existentes (os 265 fonte mais os 8 de `bis`):

| Corte | mediana | p90 | máx | Custo |
|---|---|---|---|---|
| string inteira | **75** | 116 | 187 | 24 passam de 120 caracteres |
| primeira frase | 59 | 88 | 156 | no-op para 179 de 273; **descarta a metade qualificadora em 94** |
| primeira oração | 26 | 76 | 132 | **inverte o conselho**: `"Mosaic — but only if you can make one"` → `"Mosaic"` |

**Decisão (§7.3): `line-clamp-2` sobre o texto completo.** O texto inteiro fica no DOM, no Ctrl+F e no
leitor de tela; o corte é do navegador, não uma afirmação editorial.

### 3.6 Onze seções, sete com `id`

Medido nas **106** páginas construídas: exatamente **11** `<section>` de topo dentro de `<main>`, uma
ordem por idioma, zero `id` duplicado.

| # | Título (en-US) | Chave | `id` hoje |
|---|---|---|---|
| 1–4 | How it plays · At a glance · Strengths and weaknesses · Getting there | `builds.howItPlays` · `builds.atAGlance` · `classes.strengthsWeaknesses` · `builds.gettingThere` | **faltam os quatro** |
| 5–11 | Skills · Stats · Breakpoints · Dealing with immunities · Gear progression · Mercenary · Where to farm | — | `skills` `stats` `breakpoints` `immunities` `gear` `mercenary` `farming` |

Três das onze são condicionais na fonte (`levelingPath`, `immunityPlan`, `merc`) mas populadas nas 53
builds hoje. **O sumário tolera ausência**: uma build futura sem `immunityPlan` renderiza 10, e um
sumário com âncora morta é a forma exata do defeito D2. Por isso **nenhum gate fixa o número 11** —
todos comparam entradas com seções renderizadas (§14.3).

Os quatro `id` novos não colidem com nada nas 106 páginas. Nenhum dos sete existentes é linkado de
qualquer lugar do repositório, mas são URLs publicadas e **não mudam**.

**Fora das onze, deliberadamente:** o portão de disponibilidade (um `<div>`, 1 de 53 builds) e o par
Self-found / Hardcore (um `<div>` com dois `<h3>`). Nenhum é `<section>`; promovê-los quebraria
`page-structure.test.ts` e o `heading-snapshot.json`.

### 3.7 Nada acima do controle de tier abaixo de 640 px

Topo do controle, 320×640: `blizzard-sorceress` 457 (en) / 517 (pt); **`lightning-trapsin` e
`whirlwind-assassin` 575 px (pt)**. A pilha é `mt-6 space-y-12`, então um irmão custa a própria altura
**+ 48 px**:

| Bloco inserido | Acima do controle | Abaixo |
|---|---|---|
| 44 px | 575 → **667 px** — **estoura o teto de 640 de C14** | +0 |
| 74 px | 575 → 697 | +0 |

**Regra permanente:** abaixo de 640 px nada é inserido acima do controle de tier.

**E uma consequência que a primeira versão não mediu (revisão 1, Mh):** o controle mede ~100 px
(legenda + chips + linha de ação reservada), então um gatilho colocado logo **abaixo** dele começa por
volta de **675 px** — fora da primeira tela de 640 px. C14 mede só o topo do controle e não veria isso.
**O topo do gatilho do sumário entra na tabela de C14 como número medido e asserido** (§14.5); se
exceder 640 px em qualquer das 106 páginas, o sumário passa a ser uma linha **dentro** do bloco do
controle em vez de um irmão abaixo dele.

### 3.8 O orçamento de altura — todas as sete constantes

A primeira versão citou uma. São sete, e a que aperta primeiro não é a que ela citou:

| Constante | file:line | limite | medido hoje | folga | move? |
|---|---|---|---|---|---|
| `TIER_CEILING` (por tier compacto) | `build-tier-heights.test.ts:82,214-218` | 460 | 420 (phoenix-strike pt @320) | **40 px/tier** | ver §3.8.2 |
| `GEAR_CEILING[320]` | `:83,219-221` | 2.550 | 2.349 | 201 px | só com novo pior medido |
| `GEAR_CEILING[390]` | `:83` | 2.300 | 2.129 | 171 px | idem |
| `ACCEPTANCE[en].compactGear` | `:100,267` | 2.100 | 2.034 | 66 px | com atribuição |
| **`MIN_GEAR_REDUCTION` × `BASELINE.gear`** | `:107-108,272-278` | ≤ 2.139,5 | 2.034 (**87,6%**) | **105,5 px** | **NÃO sem o proprietário** |
| `ACCEPTANCE[en].openGear` | `:100` | 5.400 | 5.272 | 128 px | com atribuição |
| `ACCEPTANCE[en].compactPage` | `:100` | 18.500 | 18.344 | 156 px | com atribuição |
| `ACCEPTANCE[en].openPage` | `:100` | 21.750 | 21.582 | 168 px | com atribuição |

`TIER_CEILING` é asserido para **cada tier** de **cada uma das 7 `HEIGHT_SUBJECTS`**, nos **dois
idiomas**, a **390 e 320 px** — 168 asserções. `ACCEPTANCE` dispara **só em `blizzard-sorceress`**
(`if (slug === "blizzard-sorceress")`). Foi essa a confusão da primeira versão.

**`MIN_GEAR_REDUCTION` não é uma calibração — é a manchete publicada da Fase 1** (relatório §4: "Seção
Gear 16.458 → 2.034 px, 87,6%"). Elevá-la é reescrever um número publicado, e isso não acontece sem o
proprietário.

#### 3.8.1 O desenho que faz a conta fechar

A primeira versão punha a linha "Próximo:" nos **cinco** tiers compactos. Ao `text-sm` do preview
(altura de linha 20 px), `line-clamp-2` custa ~46 px por tier: **5 × 46 ≈ 230 px**, o que estoura seis
das sete constantes. `line-clamp-1` custa ~130 px e ainda estoura duas.

**Decisão: a linha "Próximo:" aparece apenas no tier compacto imediatamente seguinte ao tier
expandido.** Consequências, todas favoráveis:

- **sem preferência (primeira visita), nenhuma linha renderiza** → `GEAR_CEILING`, `compactGear`,
  `compactPage` e **`MIN_GEAR_REDUCTION` ficam exatamente como a Fase 1 os deixou.** A afirmação
  publicada de 87,6% não é tocada;
- com um tier expandido, **exatamente um** tier compacto cresce → só `TIER_CEILING` e os dois
  `open*` são exercitados, e estes têm 128 e 168 px de folga;
- é a leitura fiel da intenção de R-BUILD-7: a linha é a **ponte** entre o tier que se está a ler e o
  seguinte. Sem tier expandido não há "seguinte" de onde vir.

Desvio declarado da letra de R-BUILD-7 em §22(g).

#### 3.8.2 Como `TIER_CEILING` é tratado

O tier que carrega a linha pode passar de 460 px. **Não se eleva `TIER_CEILING`**, que guarda os
outros cinco. Cria-se uma constante **nova e nomeada**, `TIER_CEILING_WITH_NEXT`, aplicada **apenas**
ao tier que carrega a linha. O gate fica mais específico, não mais frouxo, e a atribuição a R-BUILD-7
vive no comentário da constante.

**Medido (protótipo do commit 2: 7 builds × 2 idiomas × {390, 320}, texto real de cada tier,
`line-clamp-2` ao `text-sm` do preview):**

| | |
|---|---|
| custo por tier | **+46 a +47 px**, uniforme em todas as 140 células |
| pior tier absoluto **com** a linha | **467 px** — pt-BR `blade-fury/budget` a 320 px (o tier de 11 slots) |
| tiers **sem** a linha | **inalterados** — nenhuma das outras seis constantes se move |

`TIER_CEILING_WITH_NEXT = **510**`.

> **Correção à regra que este plano trazia.** §3.8 dizia "medido, arredondado para cima à dezena", o
> que daria **470** — **3 px** de folga sobre 467. Um gate com 3 px de margem é intermitente: qualquer
> métrica de fonte ou um `goal` que um editor alongue torna-o vermelho sem regressão nenhuma. A
> política que o próprio arquivo já documenta para `TIER_CEILING` é outra — *"os tetos ficam cerca de
> 10% acima [do pior medido], apertado o bastante para apanhar uma regressão e folgado o bastante para
> sobreviver a um `goal` mais longo"* — e é 460 sobre 420, **9,5%**. Aplicada ao novo pior medido,
> 467 × 1,1 ≈ 514 → **510** (9,2%). Usa-se **a mesma política do arquivo**, não uma nova. A regra
> anterior foi escrita antes da medição; a medição prevalece, como manda §16.2 do plano da Fase 1.

#### 3.8.3 A regra de parada, na primeira constante que quebra

Não num número redondo: **para se `compactGear` medido exceder 2.139 px** (o piso dos 87% de
`MIN_GEAR_REDUCTION`), ou se qualquer tier sem a linha exceder 460 px. Nesse caso a execução para e o
número vai ao proprietário antes de continuar.

O projeto mede **antes** de escrever o componente: um protótipo no scratchpad injeta a linha nas sete
`HEIGHT_SUBJECTS` × 2 idiomas × {390, 320} e publica as sete colunas. Isso acontece no commit 2, não no
4 — a primeira versão adiava o único número que decide o seu maior risco.

*(A primeira versão dizia "elevar exatamente pela quantia medida **mais** ~3%". As constantes já
contêm ~3%; compor os dois é elevar duas vezes. A regra é: **medido, arredondado para cima à
dezena.**)*

### 3.9 O cabeçalho tem 42 px de folga em exatamente 900 px

Medido em Chrome real (`header div.flex.h-14`, folga = largura de conteúdo − filhos − gaps):

| Largura | 640 | 768 | 899 | **900** | 960 | 1024 | 1280 | 1399 | 1400 | 1440 |
|---|---|---|---|---|---|---|---|---|---|---|
| folga en-US | 110 | 238 | 369 | **42** | 102 | 100 | 356 | 475 | 33 | 73 |
| folga pt-BR | 111 | 239 | 370 | **58** | 118 | 116 | 372 | 491 | 53 | 93 |

**Zero transbordo em qualquer largura hoje** — o risco levantado por aritmética está **refutado por
medição**. 900 px é o degrau onde a nav primária aparece (`min-[900px]`) com o container ainda
estreito. `viewport.test.ts` não testa 900.

**Abaixo de `sm` (640 px) a palavra do gatilho é `sr-only`** (`mobile-navigation.tsx:155-158`): só o
glifo é desenhado. Um rótulo mais longo custa **zero largura a 320 e 390 px**, e o orçamento de ~22 px
que a memória do projeto regista para o header **não é tocado**. Isto está escrito porque um
implementador que lesse só a tabela poderia concluir o contrário — ou "simplificar" o par
`sr-only sm:not-sr-only` e reintroduzir o transbordo de 320 px que o header já documenta ter tido.

### 3.10 `Menu`, `Referência` e o ADR 0003

`nav.menu` vale `"Menu"` nos dois dicionários e é a única chave com esse valor; `Menu` está no bloco
`<!-- BEGIN:invariant-strings -->` do ADR 0003, e `dictionary.test.ts:200-205` afirma que a lista não
contém nada que tenha deixado de ser coincidência. `nav.reference` **já existe** traduzido
(`Reference` / `Referência`) e já é usado em seis páginas.

**Mas o rótulo não pode simplesmente trocar** (revisão 2, H5): `site-header.tsx:96` mostra a nav
primária só a partir de `min-[900px]`, e `:142-146` passa o rótulo como `menuLabel` **e**
`navigationLabel` de um painel com `items={[...primary, ...reference]}` — **os dez links**. De 320 a
899 px esse `<details>` é a **única** via para Classes, Builds, Leveling e Farming. Chamá-lo
"Referência" arquiva a navegação primária do site sob "Referência" em todos os telefones — e nomeia
assim o *landmark*, não só o gatilho.

A decisão do proprietário é condicional: *"trocar … por 'Referência' **quando esse for o
agrupamento**"*. Abaixo de 900 px não é. §10.4 implementa a condição.

### 3.11 A rolagem suave custa 297–1.296 ms

Medido nas sete âncoras de seção reais, do topo da página, com `scroll-behavior: smooth` global:

| Largura | mínimo | mediana | **pior** |
|---|---|---|---|
| 390 px | 381 ms (`#gear`) | ~660 ms | **1.296 ms** (`#stats`, 6.018 px) |
| 1280 px | 297 ms | ~500 ms | **964 ms** (`#stats`, 3.448 px) |

A estimativa de ~1.500 ms da investigação era alta: a Fase 1 encurtou todas as distâncias ao colapsar
o Gear. §22(h) decide o que fazer com isto **nesta fase**, com estes números.

---

## 4. Regras formais da comparação

### 4.1 Módulo e assinatura

`lib/builds/compare-tiers.ts`, puro: sem string de exibição, sem `locale`, sem `lib/registry`.

```ts
export type PickIdentity = string;                  // "unique:harlequin-crest" | "label:rare ring…"
export type SlotMarker = "new" | "kept" | "alternative";

export interface SlotComparison {
  key: string;              // `${slot}#${occurrence}`
  slot: GearSlot; occurrence: number; index: number;
  entry: GearSetSlotEntry;  // a MESMA referência de objeto que set.slots[index]
  marker: SlotMarker | null;                        // null só no primeiro tier
  previous?: PickIdentity;
  alternativeVia?: "secondary-pick" | "nested-alternative";
}
export interface RemovedSlot { key; slot; occurrence; identity: PickIdentity; pick: GearPick }
export interface TierComparison {
  tier: ProgressionTier; previousTier?: ProgressionTier;
  slots: SlotComparison[];        // mesmo comprimento E MESMA ORDEM que set.slots
  removed: RemovedSlot[];
  /** Estado majoritário do tier, quando um estado passa de 70% — ver §7.2. */
  majority?: { marker: SlotMarker; count: number; total: number };
}
export function identityOf(pick: GearPick): PickIdentity;
export function compareTiers(previous: GearSet | undefined, current: GearSet): TierComparison;
export function compareProgression(gearSets: GearSet[]): TierComparison[];
```

### 4.2 A estrutura, e o aviso

**Nada é indexado por nome de slot.** Um `Map<GearSlot, …>` colapsa `blade-fury/budget` em silêncio: a
linha do CTA desaparece, nenhum teste nota, e a lista de removidos publica um fantasma. É a lição que
`lib/registry/index.ts:307-329` e o cabeçalho de `gear-progression.tsx` já carregam.

A chave é **nome do slot + índice de ocorrência**, na ordem autorada. `slots` é um array **paralelo** a
`set.slots`, e o teste afirma **identidade de objeto** (`comparison.slots[i].entry === set.slots[i]`),
não só o comprimento — porque ordenar preserva comprimento e índices e escaparia a uma asserção mais
fraca (revisão 1, Md).

### 4.3 Identidade

```
identityOf(pick):
    if pick.ref:  return pick.ref.kind + ":" + pick.ref.slug
    return "label:" + pick.label.trim().toLowerCase().collapseWhitespace()
```

Normalização mínima. **Não** se remove pontuação: `"Rare ring: 10% FCR, resistances, life"` e
`"…, life, mana"` são recomendações diferentes.

### 4.4 Derivação dos três marcadores

```
if previous is None:  return todos com marker: null        # `starter`, 290 ocorrências
for k in keyed(current):                                    # ordem autorada
    prevEntry = before.get(k.key)
    if prevEntry is None:                emit "new"          # 278
    prevId, curId = identityOf(prevEntry.picks[0]), identityOf(k.entry.picks[0])
    if prevId == curId:                  emit "kept"         # 1.245
    elif prevId in picks[1:]:            emit "alternative" via secondary-pick    #  33
    elif prevId in alternatives[]:       emit "alternative" via nested-alternative#  92
    else:                                emit "new"          # 721
```

`picks[0]` é a principal: o preview já assume isso (`gear-progression.tsx:189`) e 2.555 de 2.659
entradas têm um pick só.

### 4.5 Remoções — a regra que substitui o guarda morto

A primeira versão suprimia uma remoção "cuja identidade ainda exista no tier atual". **Medido: suprime
zero.** A identidade de `blade-fury/budget weapon#1` é `label:weapon switch: call to arms and a spirit
shield`; a do `weaponSwap` de `optimized` é `runeword:call-to-arms`. A regra de identidade de §4.3 é
precisamente o que as torna diferentes: **o guarda e a regra de identidade eram mutuamente exclusivos
por construção.**

**Regra nova, estrutural e medida:**

> Uma remoção é publicada quando o **nome do slot** deixa de ter qualquer ocorrência no tier atual.
> Se o slot ainda tem uma ocorrência, o que mudou foi o item — e isso o marcador dessa ocorrência já
> diz.

É o que "Removido" significa para o leitor: *já não se veste nada neste slot*. Medido sobre as 53
builds:

| | ocorrências | pares (build, tier) | renderizações sem o bloco |
|---|---|---|---|
| regra ingênua (ocorrência sumiu) | 49 | 31 | 234 de 265 |
| **regra adotada (slot vazio)** | **48** | **30** | **235 de 265** |
| suprimidas | **1** — exatamente `blade-fury budget→optimized weapon#1` | | |

Dispara uma vez, na única build que precisa, sem reintroduzir comparação por rótulo e sem tocar em
conteúdo. E **M11 volta a ser detectável**: remover a regra muda 48 → 49 e vira T10 vermelho — ao
contrário do guarda morto, cuja remoção não mudava saída nenhuma.

### 4.6 Escopo deliberado

`charms` e `weaponSwap` **não** entram na comparação: R-BUILD-6 diz "cada slot", e o tipo documenta os
dois como *não* sendo slots de equipamento. Comparação posicional de charms dá quase só ruído (76
tiers não têm nenhum). **Excluir é certo, mas tem de estar escrito**, porque "marcadores em todos os
slots" lê-se como "em tudo".

### 4.7 O que os quatro estados não dizem

- **"Mudou de lugar":** uma identidade que era principal de um slot passa a ser principal de outro
  (`runeword:spirit` de `weapon` para `offhand` assim que chega uma arma a sério). Sob o modelo por
  slot, o destino lê "novo" e a origem lê "novo" ou "removido". **Medido: 17 ocorrências**, sob esta
  definição: *a identidade era principal da chave K em N; em N+1 não é principal de K; e é principal
  de outra chave.* A investigação reportou 77 e a revisão 32, ambas sem método declarado; os três
  números medem coisas diferentes e **este plano publica o seu, com a definição junto**. Não vira um
  quinto marcador — isso quebraria o contrato de R-BUILD-6 (§22 não o autoriza).
- **`sockets` e `lookFor` mudados sob "mantido":** 125 + 75 casos. Inerente à redação de R-BUILD-6
  ("mesma referência"); registrado para não ser "descoberto" em revisão.

---

## 5. Matriz de casos

| # | Forma real | Casos | Estado |
|---|---|---|---|
| 1–2 | mesma `ref` / mesmo `label` normalizado | parte de 1.245 | mantido |
| 3 | principal anterior vira **pick secundário** | 33 | alternativa |
| 4 | principal anterior vira **`alternatives[]`** | 92 | alternativa |
| 5 | principal mudou, anterior ausente da ocorrência | 721 | novo |
| 6 | nome de slot não existia | 277 | novo |
| 7 | nome existia, **ocorrência** não (`blade-fury weapon#1`) | 1 | novo |
| 8 | **slot inteiro sumiu** | **48** | removido |
| 8b | ocorrência sumiu mas o slot continua | **1** | **não publicado** (§4.5) |
| 9 | mesma identidade em dois slots do mesmo tier (`spirit`) | 70 | comparadas isoladamente |
| 10 | identidade **mudou de slot** | **17** | destino novo, origem novo/removido — §4.7 |
| 11–12 | identidade mantida, `sockets` / `lookFor` mudaram | 125 / 75 | mantido — §4.7 |
| 13–15 | pick sem `ref` traduzido / não traduzido / `label` pt-BR sobre `ref` | 334 / 52 / 1 | identidade invariante; 0 divergências |
| 16–17 | `bis` sem / com `nextUpgrade` | 45 / 8 | terminal (§6) |
| 18 | slot presente → ausente → presente | 46 | removido, depois novo |
| 19 | troca ring1/ring2 | 0 | não existe |

Cobertura: 53 builds × 2 idiomas na função pura; as sete `HEIGHT_SUBJECTS` no navegador a 320, 390,
768 e 1280 px.

---

## 6. Comportamento do BiS

`bis` é terminal: não exige `nextUpgrade`, não inventa, não duplica o próprio equipamento, e apresenta
uma mensagem curta (`builds.finalSetup` — "Final setup" / "Configuração final").

**A medição obriga a uma precisão.** Oito builds têm `nextUpgrade` em `bis`, todas começando por
"Nothing." / "Nada." — e **seis carregam uma frase real depois disso**, incluindo `blizzard-sorceress`
("…the upgrades are on the mercenary…") e `hammerdin` ("…verify your block is at 75%…"), as duas que o
PRD usa como baseline. Substituí-las por uma string fixa **apaga conteúdo autorado de seis builds**.

**Contrato:** `bis` nunca recebe um "próximo" derivado nem a afordância ember de "o que consertar em
seguida"; o cabeçalho passa a ser a mensagem terminal; onde `nextUpgrade` existe, o texto **continua a
ser renderizado** sob esse cabeçalho. Em `dragon-tail` e `whirlwind-assassin` isso lê "Configuração
final" seguido de "Nada." — redundante, verdadeiro, e não apaga nada. **Vai para as capturas de §7.5**
para o proprietário decidir se quer outra coisa numa fase futura.

---

## 7. UX dos marcadores

### 7.1 Forma — micro-rótulo, não selo

A primeira versão especificava "ember, borda 1px, peso médio". A revisão mediu o que isso produz: em
`nightmare` **6,2 de 7,1 linhas** ficariam com uma caixa. Uma caixa em 87% das linhas não é um
marcador, é um fundo — exatamente o que o contrato proíbe ("discretos", "não poluir").

**O marcador é um micro-rótulo em maiúsculas na coluna do slot**, abaixo do nome do slot: sem borda,
sem fundo, `text-xs`, cor de tom secundário para "novo" e ember apenas para "alternativa". A coluna do
slot (`8rem` a partir de `sm`) é mais curta que a coluna dos picks, portanto **a partir de 640 px o
marcador custa zero altura**. Abaixo de 640 px o layout empilha e custa uma linha de 16 px.

| Estado | EN | PT | Desenhado? |
|---|---|---|---|
| novo | `New` | `Novo` | sim |
| alternativa | `Alternative` | `Alternativa` | sim |
| mantido | `Kept` | `Mantido` | **não** — §7.2 |
| removido | `Removed` | `Removido` | bloco próprio ao fim do tier |

Chaves novas: `builds.marker{New,Kept,Alternative,Removed}`, `builds.removedTitle`,
`builds.majorityNew|Kept|Alternative`, `builds.finalSetup`, `builds.nextShort` — nos dois idiomas, no
mesmo commit. Nenhuma é coincidência EN/PT, portanto nada muda no ADR 0003.

### 7.2 "Mantido", e o estado majoritário

O proprietário mandou decidir **com evidência visual** se "mantido" aparece sempre ou fica silencioso.
A primeira versão decidiu com o número errado: 52,6% é o total de uma página com **os seis tiers
abertos**, e a Fase 1 abre **um**. Por tier, que é o que o leitor vê:

| Tier | slots/build | novo | mantido | alt | % com selo se "mantido" for silencioso |
|---|---|---|---|---|---|
| `nightmare` | 7,09 | 6,21 | 0,60 | 0,28 | **91,5%** |
| `early-hell` | 8,34 | 5,26 | 2,74 | 0,34 | 67,2% |
| `budget` | 9,68 | 4,15 | 4,76 | 0,77 | 50,9% |
| `optimized` | 9,79 | 2,06 | 7,04 | 0,70 | 28,1% |
| `bis` | 9,79 | 1,17 | 8,36 | 0,26 | **14,6%** |

Silenciar "mantido" resolve `bis` (85 pontos) e quase nada em `nightmare` (8,5 pontos). Sozinho, não é
a decisão certa.

**Decisão, em duas partes:**

1. **"Mantido" não é desenhado.** Resolve a metade `bis` da distribuição.
2. **O estado majoritário de um tier é declarado uma vez, não repetido por slot.** Quando um estado
   passa de **70%** das ocorrências do tier, ele é dito numa linha no topo do corpo do tier — *"Quase
   tudo novo aqui: 6 de 7 slots"* / *"Quase tudo mantido: 8 de 10 slots"* — e **não é repetido em
   nenhum dos dois canais**, nem visual nem `sr-only`. Só as exceções levam rótulo.

Isso dá `nightmare` uma frase e ~1 rótulo em vez de 6,5 caixas, e dá `bis` uma frase e ~1,4 rótulos em
vez de oito repetições de "Kept" no leitor de tela. **A regra é simétrica nos dois canais**, que é o
que a regra do proprietário pede ("não exibir 'mantido' repetidamente se isso tornar a página mais
ruidosa que útil") — a primeira versão trocava ruído visual por ruído sonoro e contava como vitória.

A contagem vem da função pura (`TierComparison.majority`), derivada dos dados como todas as contagens
do site — não é texto editorial novo.

**Como o texto do marcador existe, e a armadilha evitada.** Sempre `<span class="sr-only">`, **nunca
`aria-label`**. A linha do slot é `<div data-gear-slot=…>` e a célula do rótulo um `<span>` puro: ambos
computam `role=generic`, sobre o qual a ARIA **proíbe** nome de autor, e um `aria-label` num contentor
não entra no texto lido dos descendentes. Pior, é uma armadilha verde: a revisão mediu que a árvore de
acessibilidade do Chrome mostra `{"role":"generic","name":"Kept"}` — um gate sobre `axNodes()`
**passaria** sobre algo que nenhum leitor de tela anuncia. O gate afirma um **nó de texto oculto em
ordem de documento dentro da linha**, e afirma a **ausência** de `aria-label` nessas linhas.

**Condicional à evidência visual de §7.5**, que é produzida antes do commit 4 e tem de fixar
`nightmare` **e** `bis` da mesma build lado a lado, nos dois tratamentos — a decisão varia por tier, e
capturas de um tier só a tornariam infalsificável.

### 7.3 "Próximo:" — onde, quanto, e quando

**Quando:** apenas no tier compacto **imediatamente seguinte ao tier expandido** (§3.8.1). Sem
preferência, nenhuma linha. `starter` nunca a recebe (não há tier anterior); `bis` recebe a de
`optimized`, e as 45 lacunas de `bis` nunca aparecem.

**Onde:** um irmão **depois** do `<ul data-tier-preview>`, dentro do `<section>` do tier, com o seu
próprio `peer-open:hidden`. **Não dentro do `<ul>`**: um `<p>` dentro de um `<ul>` é inválido, e
`build-tier-state.test.ts:262-266` afirma que `ul[data-tier-preview].children.length` é igual a
`slots.length` — um `<li>` a mais deixa cinco de seis tiers vermelhos. **Não dentro do `<summary>`**:
conteúdo ali vira o **nome acessível** da divulgação, que é o motivo, já escrito no cabeçalho do
componente, pelo qual o preview também está fora.

**Quanto:** `line-clamp-2` sobre o `nextUpgrade` completo. O texto inteiro fica no DOM, no Ctrl+F e no
leitor de tela.

*Sem JavaScript os seis tiers vêm `open`, o preview está escondido e a linha não é desenhada. O leitor
sem JS lê o `nextUpgrade` inteiro ao pé de cada tier aberto, que é onde ele já está hoje — §12 diz isto
explicitamente em vez de prometer "tudo".*

### 7.4 Acessibilidade dos marcadores

Sem `role` novo, sem foco novo, sem `aria-current`, sem `aria-label`. Contraste ≥ 4,5:1 (`test:contrast`
estendido). A 200% de texto os micro-rótulos reagem ao mesmo `line-height` e são medidos em §14.5.

### 7.5 Evidência visual obrigatória

Em `docs/product/plans/phase-2-visual/`, `<largura>-<idioma>-<build>-<estado>.png`:

- **estados de marcador:** um tier com poucas mudanças, um com muitas, um com slot removido, um com a
  duplicata (`blade-fury/budget`);
- **builds:** `hammerdin`, `blizzard-sorceress`, `summoner-necromancer`, `blade-fury`, um Barbarian, um
  Warlock;
- **o eixo que decide §7.2:** `nightmare` **e** `bis` da mesma build, lado a lado, nos **dois**
  tratamentos (com e sem selo de "mantido");
- **o BiS terminal**, incluindo `dragon-tail` ("Configuração final" + "Nada."), que §6 promete mostrar;
- **a linha "Próximo:"** — a mudança visual mais arriscada da fase;
- **o sumário**: linha de desktop a 640/768/1280 e sheet a 320/390; e o sumário da página de classe;
- **o header a 900 px** e o bloco de referência da home;
- **a página sem JavaScript**, com os seis tiers abertos e todos os marcadores visíveis;
- idiomas: en-US e pt-BR · larguras: 320, 390, 768, 1280 · **e 200% de zoom a 320 px pt-BR**, que é
  onde `TIER_CEILING` tem 40 px.

---

## 8. Sumário da página de build (R-BUILD-8)

### 8.1 Uma superfície, dois regimes — e o mecanismo que a revisão corrigiu

A primeira versão dizia que `sm:block` "vence a regra do UA". **Medido em Chrome 151: não vence.** Um
`<details>` fechado esconde o painel com `content-visibility: hidden` no pseudo-elemento
`::details-content`, e um `display` num **filho** não vence um `content-visibility` num **ancestral**:

```
detailsOpen: false · panelDisplay: "block" · panelCheckVisibility: FALSE · summaryDisplay: "none"
getComputedStyle(details,'::details-content').contentVisibility: "hidden"
```

`display:flex|grid|contents|block` no próprio `<details>` também falham. O sumário do desktop teria
renderizado **invisível nas 106 páginas**, com `build-toc-html` verde (os links estão no markup) e um
gate de altura verde (as caixas são dispostas: 36 px o painel, 17 px um link). É a forma de falha que o
cabeçalho de `build-tiers-html.test.ts` já avisa: *"visibilidade é um facto sobre caixas dispostas
depois do CSS"*.

**Mecanismo adotado — o que a Fase 1 já provou.** Um único `<details data-sections open>` **servido
aberto**, com um `<nav><ol>` de `<a href="#id">`; a ilha cliente **remove `open` abaixo de 640 px** e
transforma o painel em bottom sheet. Idêntico ao que `gear-progression.tsx` faz com os seis tiers e ao
que `tier-selector.tsx` já opera. **Sem piso de suporte de navegador**, sem `::details-content`, sem
utilitário Tailwind novo.

- **≥ 640 px:** fica aberto. Uma linha de links que quebra, em fluxo normal, com o `<summary>`
  `sm:hidden`. O leitor sem JS vê o mesmo.
- **< 640 px:** a ilha fecha-o e o `<summary>` vira o botão "Seções"; ao abrir, o painel ganha
  `role="dialog"`, scrim, `trapTarget`, `lockScroll`, Escape e fundo fecham, foco volta ao `<summary>`,
  ativar um link fecha, mudança de rota fecha.
- **< 640 px sem JS:** o `<details>` fica aberto e a lista dos 11 rótulos pt-BR mede ~396 px em fluxo.
  **Custo declarado**, e é a troca que compra a ausência de piso de navegador. O leitor sem JS já
  recebe uma página com os seis tiers abertos (~40.647 px a 320 px), portanto 396 px de lista navegável
  não é o problema dominante dessa experiência.

*A medição de "118 px a 640/768, 76 px a 1280" da primeira versão veio de uma lista sintética e é
**re-tirada** contra este mecanismo antes do commit 5.*

**Alternativas rejeitadas:** barra sticky sob o header (header 57 + espelho 49 = 106 contra o teto de
112 de R-A11Y-8; e C17 já reprova qualquer `NAV` sticky abaixo de 640); trilho na calha (calha de
**0 px a 1024** e 128 a 1280 contra um rótulo de 212 px); `::details-content { content-visibility:
visible }` (funciona — medido — mas exige `@custom-variant` no Tailwind 4.3.3 e tem piso Chrome 131 /
Safari 18.4 / Firefox 139, sem fallback).

### 8.2 O tier ativo, sem uma segunda preferência

`writeTier`/`clearTier` têm hoje **um** importador. O sumário **não** será um segundo escritor, nem uma
segunda chave, nem uma segunda regra de resolução.

**Mecanismo: observar o DOM, que a Fase 1 já declara fonte de verdade.** A ilha recebe do servidor os
seis registros `{slug, label}` e observa o atributo `open` dos seis `[data-tier-section]` com
`MutationObserver({attributes:true, attributeFilter:["open"]})`.

**Verificado por medição, não por citação da especificação** — `lib/prefs.ts:235` escreve a
**propriedade** `.open`, `:271` escreve o **atributo**:

| Caminho | Como | Observado? |
|---|---|---|
| A — `applyTierState` | `el.open = …` (propriedade) | **sim**, e o atributo passa a existir |
| B — script de boot | `setAttribute`/`removeAttribute` | **sim** |
| C — pressão real no `<summary>` | o navegador | **sim** |

*(C só apareceu à segunda tentativa: a primeira leu o retângulo antes de a rolagem suave assentar e o
clique errou o alvo. Um "zero" mal medido teria condenado o mecanismo certo.)*

Não importa nada de `lib/prefs` — nem `readTier`. Zero alterações no código da Fase 1. Vê também a
expansão manual de um segundo tier, de que a regra abaixo depende.

**Regras degeneradas, escritas:** 0 abertos → nenhum rótulo; >1 aberto → nenhum rótulo. Renderiza como
um `<span>` na linha "Gear progression" (`Progressão de equipamento · Econômico`): não é controle, não
é focável, sem `aria-pressed`, sem `aria-current`. Sem JS não renderiza.

### 8.3 Três tripwires

1. **`heading-snapshot.json`** fixa os `h2`/`h3` das 106 páginas de build: **o sumário não pode conter
   `<h2>` nem `<h3>`**. *(Cobre só páginas de build — na página de classe a mesma regra é afirmada pelo
   gate novo, porque o snapshot não a vê.)*
2. **`build-tier-state.test.ts:110`** lê `dataset.tier` de cada `[aria-current="location"]`: **nenhum
   `aria-current` no sumário**, e nenhum scroll-spy nesta fase.
3. **`client-boundary.test.ts:295-313`** fixa o único script inline byte a byte e afirma que ele existe
   nas páginas de build "e em nenhuma outra": **nenhum script inline novo**.

---

## 9. Âncoras e hash

### 9.1 Onde as âncoras aterram — medido

`<Section>` carrega `scroll-mt-24` (96 px) e aterra a **104 px** (<640) / **144 px** (≥640); os tiers
carregam `scroll-mt-16` (64 px) e aterram a **72/112**, que é `anchorOffsetPx()`.

1. Toda âncora do sumário **já aterra corretamente**, com 47/87 px de espaço morto abaixo do header.
2. **`anchorOffsetPx()` é o número errado para seções.** O sumário não rola por JS: usa
   `<a href="#id">` puro, e a questão desaparece.
3. **`<Section className="scroll-mt-16">` não funciona** — medido: o computado continua 96 px, porque
   `cn()` é um `join` simples (sem `tailwind-merge`) e utilitários de mesma especificidade decidem-se
   pela ordem na folha. **Quem "consertar" os 47/87 px por `className` publica um no-op verde.** Esta
   fase não mexe no offset; o espaço morto é publicado no relatório.

### 9.2 R-I18N-7 — o fragmento na troca de idioma

**Causa raiz:** a URL é remontada de `usePathname()` (só caminho — a tabela "Returns" do Next 16 mostra
`/dashboard?v=2` → `'/dashboard'`) e `location.search` (só query). O fragmento nunca é lido:
`locale-switcher.tsx:125` é `` router.push(`${href}${search}`) ``.

**Por que não pode ir no `href`:** o header é pré-renderizado em ~1.002 documentos
(`dynamicParams = false`). Não há `window` no prerender: pôr o fragmento no `href` é crash ou mismatch
de hidratação garantido. Não existe `useHash` no Next 16 (zero ocorrências de `location.hash` em toda a
árvore de documentação do App Router). E `build-filters.test.ts:585-600` já fixa a forma da fonte.

**Mecanismo:**

```tsx
// substitui locale-switcher.tsx:122-125
const search = globalThis.location.search;   // literal preservado: o gate casa /location\.search/
const hash = globalThis.location.hash;
if (!search && !hash) return;
event.preventDefault();
if (hash) globalThis.location.assign(`${href}${search}${hash}`);   // navegação dura
else      router.push(`${href}${search}`);                          // inalterado
```

> As duas leituras ficam em linhas separadas de propósito. A forma desestruturada
> `const { search, hash } = globalThis.location` **apaga a substring `location.search`** e deixa
> `build-filters.test.ts:593` vermelho — o gate que este plano cita três vezes como a sua guarda.

**Por que navegação dura só com fragmento:** a documentação do Next 16 não diz o que `router.push` com
fragmento faz quanto a rolagem; e `tier-selector.tsx:38-45` documenta que **numa navegação soft o
script de boot inline não corre** (o Next insere-o por atualização de DOM, e scripts inseridos não
executam), enquanto `history.pushState` **não** dispara `hashchange`. A navegação dura entrega o salto
à plataforma e faz o boot correr. O caminho só-query fica **exatamente** como está.

**Medição obrigatória antes de fixar a forma:** se o caminho soft acertar a âncora **e** o estado do
tier seguir, a variante soft é preferida também para o hash e o plano é corrigido com o número. O teste
distingue os dois casos em vez de assumir um.

**Limitações declaradas:** cliques com modificador continuam a abrir o caminho puro (deliberado em
`:112-121`); sem JS o `<a href>` é o caminho puro, sem fragmento (R-A11Y-12 permite); e uma troca com
fragmento passa a ser um **recarregamento completo** de uma página de 18.344 px — uma frase no
relatório.

**Os cinco exemplos obrigatórios**, nos dois sentidos: `#gear-budget` (hash + tier Budget expandido +
aterragem); `#skills` numa build; `#skills` numa classe; `?class=necromancer&damage=cold` (query, que
**já funciona e não pode regredir**); e `?class=necromancer#content` (ambos, na ordem
`path`+`?query`+`#hash`). `#content` é o alvo do skip link e o único exemplo honesto de query+hash numa
rota filtrada — `/builds` não tem outros ids.

---

## 10. Descoberta e navegação

### 10.1 R-NAV-1 — os seis cartões de tier da home

Hoje são seis `<li>` sem `href` (`app/[lang]/page.tsx:77-100`). **O cartão inteiro passa a ser o
link**, reutilizando `LinkCard` (`components/ui/index.tsx`), que é exatamente "cartão que é um link" e
já é usado quatro linhas abaixo, em `page.tsx:116`. Um cartão com borda e `hover:border-border-strong`
cujo alvo fosse só o rótulo seria uma afordância pior que a atual.

Uma ilha cliente mínima anexa **um** listener delegado ao `<ol>` e, num clique em `[data-tier]`, chama
`writeTier()` antes de deixar a navegação seguir.

- **Nenhuma chave nova, nenhum literal novo** (passa por `lib/prefs`, mantendo `prefs.test.ts:176`
  verde); **nenhum parâmetro de query** (o `href` é `/builds` puro — a recomendação `?tier=` da
  auditoria de 2026-09-07 está **superada** pelo PRD); **nenhum script inline**.
- **R-PREF-4:** a metade que navega está no HTML servido; a de preferência é um handler que não existe
  sem JS.
- Seis links com o mesmo `href` e seis nomes acessíveis diferentes dentro de um `<ol>` — aceitável, e
  dito aqui em vez de descoberto no gate de a11y.
- **Nunca escrever no render, hover ou `visibilitychange`.**

**Risco medido a resolver antes do commit 6 (revisão 1, Mf).** `mobile-navigation.test.ts:214` faz
`page.click(12, 700)` na home a 390 px, **dentro do bloco "uma pressão fora fecha o menu"**. Se essa
coordenada cair num cartão que agora é um link, o clique **navega para `/builds`** e a asserção
seguinte corre noutra página. Isto **não** é resolvido por `localStorage.clear()` nem por ordem de
execução — a primeira versão apontou a mitigação ao alvo errado. **Mitigação:** medir as caixas dos
seis âncoras a 390 px na home; se (12, 700) intersectar alguma, mover a coordenada no mesmo commit e
escrever no teste por quê. O `Container` tem `px-5`, portanto x=12 está provavelmente na calha — mas
isso é sorte, e o plano deve possuí-la como número.

**Valor diferido, declarado:** nada em `/builds` lê `d2rc.tier` até à Fase 3.

### 10.2 R-NAV-2 — o CTA de classe

`app/[lang]/page.tsx:53` é `r.levelingFor("sorceress")`: um jogador de Paladin cai na Sorceress.
`/leveling` **já é** a superfície adequada — `content/progression/index.ts` exporta **8 jornadas para 8
classes** e `leveling/page.tsx:56-77` renderiza-as todas. **Uma troca de href de uma linha**, sem
wizard e sem rota nova (§17.6 do PRD proíbe uma terceira porta). `home.ctaStart` já não promete classe:
**nenhuma chave nova**.

**O mesmo href aparece em `page.tsx:146`**, no bloco "Leveling" — um bloco que apresenta *a área* a
apontar para *uma* classe. **Corrigido junto** (§22c).

### 10.3 R-NAV-3 — sumário da página de classe

A página tem **8** `<Section>`, 7 tituladas, **uma com id** (`<Section id="skills">`, `:238`) — que
**não muda**. R-NAV-3 pede cinco entradas: Builds, Mecânicas, Atributos, Skills, Breakpoints. Quatro
ids novos.

**Cinco entradas, não oito, e o gate afirma o predicado certo.** `Strengths and weaknesses`,
`Class-specific items` e a introdução sem título ficam fora, porque R-NAV-3 nomeia cinco. O gate
**não** afirma "entradas == seções renderizadas" (5 ≠ 8, vermelho no dia um): afirma (i) toda entrada
resolve para um elemento presente no documento, e (ii) toda seção **da lista declarada** que renderizou
tem exatamente uma entrada, e nenhuma cujo guarda foi falso a tem.

**Entradas condicionais aos mesmos guardas das seções** — uma âncora morta é a forma exata do defeito
D2. **Rótulos reutilizam os títulos existentes**, portanto entrada e cabeçalho não podem divergir.

**Sempre visível, sem divulgação.** Cinco entradas cabem numa linha que quebra mesmo a 320 px, o que
mantém "Skill trees alcançável em **uma interação** a partir do topo" (decisão 7 do proprietário) em
todas as larguras. É o mesmo componente do sumário da build, com `collapsible={false}`.

**Nada sticky abaixo de 640 px.** Nota: `leveling/[classSlug]/page.tsx:105` é `sticky top-14` em todas
as larguras e mede **57 + 65 = 122 px a 320 px**, 10 px acima do teto — o mesmo defeito que a Fase 1
corrigiu em `gear-progression.tsx`, ainda vivo. **Fora do escopo**, registrado, e explicitamente **o
padrão a não copiar**.

### 10.4 R-NAV-4 — referência descoberta

**Header — rótulo condicional à largura.** A decisão do proprietário é condicional: *"quando esse for o
agrupamento"*. De 320 a 899 px o `<details>` é a **única** navegação do site (§3.10), e chamá-lo
"Referência" arquiva Classes, Builds, Leveling e Farming sob "Referência" em todos os telefones —
nomeando assim também o **landmark**, porque `site-header.tsx:144-145` passa o mesmo rótulo como
`menuLabel` **e** `navigationLabel`.

> **Abaixo de 900 px o rótulo continua `nav.menu`. De 900 px para cima, onde a nav primária já está na
> linha e o agrupamento restante é de facto a referência, passa a `nav.reference`.**

Implementado como dois `<span>` com `hidden` / `min-[900px]:inline` — o padrão `group-open:hidden` que
`gear-progression.tsx:109-114` já usa. `display:none` remove um dos dois da árvore de acessibilidade,
portanto o nome acessível é sempre exatamente um.

Consequências: **`nav.menu` não é apagado**, o ADR 0003 **não muda**, `dictionary.test.ts` fica verde
sem edição. Em troca, perde-se a propriedade de "apagar a chave para que dois gates falhem a compilar".
**O substituto é mais forte**: os gates passam a afirmar o nome acessível do gatilho **por largura** —
`nav.menu` abaixo de 900, `nav.reference` a partir de 900, nos dois idiomas. Um rename mal feito falha
em vez de passar despercebido.

**Os 10 links não se movem.** `items={[...primary, ...reference]}` fica intocado; dois gates já fixam a
contagem em 10.

**O custo de largura está medido** (§3.9): 42 px (en) e 58 px (pt) a 900 px, contra ~+38/+45 px de
palavra. **900 e 960 entram em `WIDTHS` antes da troca.** Se 900 px não couber, o degrau do rótulo
sobe para a largura medida em que cabe (960 px tem 102/118 px) — e é dito no comentário do header, que
é onde este tipo de aritmética já vive.

> `nav.reference` passa a nomear dois landmarks — o `<nav>` de referência do desktop (≥1400 px) e este
> painel (900–1399 px). Nunca coexistem (`display:none` remove um), mas é uma coincidência de dois
> breakpoints e leva uma linha de comentário, porque uma mudança futura de breakpoint produziria dois
> landmarks com o mesmo nome em silêncio.

**Home.** Existem três blocos (Leveling, Farming, Runewords) e **nenhum** dos cinco pedidos. Entra um
bloco com cinco `LinkCard` — Runas, Itens, Breakpoints, Mercenários, Mecânicas — com títulos de `nav.*`
(existentes) e **cinco pares de chaves novas** `home.ref*Body`, curtas, de tamanho de cartão: as
descrições de índice existentes têm ~40 palavras e são copy de cabeçalho.

**A coluna do rodapé continua como está.** A diferença para os cinco da home é deliberada (Runewords já
tem bloco próprio). Registrado.

---

## 11. Acessibilidade

| Preocupação | Contrato | Gate |
|---|---|---|
| Marcadores | texto, nunca só cor; `sr-only`, **nunca `aria-label`**; sem role, sem foco | `build-markers-html` (§14.2); `test:contrast` |
| Sumário — landmark / lista / links | `<nav aria-label>` + `<ol><li>` + `<a href="#id">` puro | `build-toc-html`; `test:hygiene` |
| Sumário — gatilho | `<summary>` nativo; **nunca** `aria-expanded` à mão | `axNodes()` |
| Sumário — headings | nenhum `h2`/`h3` | `heading-snapshot` (build) + gate novo (classe) |
| Sumário — `aria-current` | não usar | `build-tier-state:110` |
| Sem tabs | nenhum `role="tab"` | C16 |
| Alvo | ≥ 24×24 px (não é "controle primário" de R-A11Y-4) | `viewport.test.ts` |
| Foco | anel global 2 px; devolvido ao `<summary>` em **todos** os caminhos | novas asserções |
| Sheet | `role=dialog`, foco preso, scroll travado, Esc e fundo fecham | utilitários existentes |
| Movimento | sem animação, como `mobile-filter-sheet.tsx:38-44` | padrão existente |
| Zoom | 200% de texto e 400% de página sem transbordo | `viewport.test.ts` |

**Uma correção de método (revisão 1, Mg).** A primeira versão mandava resolver `role="dialog"
aria-modal` dentro de `<details>` com `page.axNodes()`. Medido: `axNodes()` devolve `{role, name}` e
**nada mais** (`headless.ts:349-361`) — responde à metade do papel (a árvore lê
`DisclosureTriangle` → `dialog`, que é a forma desejada) e **não pode ver `aria-modal`, ordem de foco
ou inércia**, que é o contrato de R-BUILD-9. É a mesma forma de defeito que a revisão da Fase 1
registrou em N2. **Decisão:** o spike responde só à questão do papel; `aria-modal`, foco preso e scroll
travado seguem o precedente já assente de `components/builds/mobile-filter-sheet.tsx` e os testes que
ele já tem. Nenhum método novo em `headless.ts` nesta fase.

---

## 12. Progressive enhancement

| Requisito | Sem JS |
|---|---|
| R-BUILD-6 | **tudo** — a comparação é derivada no servidor; marcadores e bloco de removidos no HTML |
| R-BUILD-7 | o `nextUpgrade` **completo** ao pé de cada tier aberto (como hoje). A linha "Próximo:" **não** é desenhada: ela vive no preview, e sem JS os seis tiers estão abertos, logo não há tier compacto. **Nada se perde**; o texto é o mesmo |
| R-BUILD-8 | `<details open>` com os 11 links, todos resolvendo para ids presentes; **nenhum rótulo de tier ativo**, nenhuma string de preferência. Custo: ~396 px de lista em fluxo abaixo de 640 px (§8.1) |
| R-NAV-1 | os seis cartões navegam; nenhuma preferência é gravada nem prometida |
| R-NAV-2/3/4 | href correto; sumário de âncoras servido; cinco cartões e o rótulo do header servidos |
| R-I18N-7 | o `<a href>` é o caminho puro; **o fragmento perde-se sem JS** — limitação declarada |

**Nenhuma implementação paralela.**

---

## 13. Arquivos e propriedade

| Arquivo | Ação | Dono |
|---|---|---|
| `lib/builds/compare-tiers.ts` · `scripts/compare-tiers.test.ts` | novos | A1 |
| `components/game/gear-progression.tsx` | alterar — marcadores, majoritário, "Próximo:", BiS | A1 |
| `components/game/tier-markers.tsx` | novo (Server) | A1 |
| **`scripts/build-markers-html.test.ts`** | **novo** — o meio-render de R-BUILD-6/7 (§14.2) | A1 |
| `scripts/build-tier-heights.test.ts` | alterar — `TIER_CEILING_WITH_NEXT`, atribuído | A1 |
| `components/game/page-sections.tsx` | novo (ilha cliente só para a sheet) | A2 |
| `app/[lang]/builds/[classSlug]/[slug]/page.tsx` · `app/[lang]/classes/[slug]/page.tsx` | alterar — ids + sumário | A2 |
| `scripts/build-toc-html.test.ts` | novo | A2 |
| `scripts/build-tier-state.test.ts` | alterar — bloco do tier ativo **e** a asserção de `children.length` do preview (§7.3) | A2 |
| `scripts/viewport.test.ts` | alterar — **900 e 960** em `WIDTHS`; superfícies novas | A2 |
| `scripts/hygiene.test.ts` | alterar — `TIER_FILES` + allowlist de `writeTier` (§14.5) | A2 |
| `app/[lang]/page.tsx` · `components/home/tier-cards.tsx` | alterar / novo | A3 |
| `components/layout/site-header.tsx` · `locale-switcher.tsx` | alterar | A3 |
| `scripts/nav-discovery.test.ts` · `scripts/locale-switch.test.ts` | novos | A3 |
| `scripts/mobile-navigation.test.ts` | alterar — rótulo por largura; coordenada de (12,700) se medir dentro de um cartão | A3 |
| `lib/i18n/dictionaries/en-us.ts` + `pt-br.ts` | alterar — **sempre no mesmo commit** | conforme o requisito |
| `package.json` | alterar — registrar e **encadear** os scripts | A1 |

**`components/ui/index.tsx` não é alterado:** `Section` **já aceita `id`**. A primeira versão abria uma
linha condicional que convidava a uma edição desnecessária num componente partilhado.

**Contratos:** `package.json` é de A1; um único componente de sumário serve build e classe; nenhum `id`
é escrito à mão em dois lugares (constante ordenada exportada, como `tierAnchorId()`); dicionários EN e
PT mudam sempre juntos; **um worktree só, propriedade estrita, e o coordenador serializa builds e
gates** (dois builds no mesmo checkout invalidam-se).

---

## 14. Testes

### 14.1 `scripts/compare-tiers.test.ts` (puro, em `check`)

| # | Asserção | Esperado |
|---|---|---|
| T1 | 318 tiers, ordem canônica, primeiro `starter`, último `bis` | 318/53/53 |
| T2 | `starter` sem marcador em nenhuma build | 290 |
| T3 | **`comparison.slots[i].entry === set.slots[i]` para todo i** (identidade de objeto, não só comprimento) | 318 tiers |
| T4 | cada entrada tem exatamente um de novo/mantido/alternativa | 2.369 |
| T5 | totais: **novo 999, mantido 1.245, alternativa 125, removido 48** | fixados |
| T6 | totais por tier de destino | 5 linhas de §3.2 |
| T7/T8 | `identityOf` total; nenhum slug sob dois `kind` | 0 / 0 |
| T9 | `blade-fury/budget` → **11** comparações, `weapon#0` e `weapon#1` distintos | 11 |
| T10 | `blade-fury budget→optimized` → **0** removidos (regra §4.5) | 0 |
| T10b | removidos em **30** pares distintos; ausentes de **235** de 265 | fixados |
| T11/T12 | marcadores en-US == pt-BR nas 53; `hammerdin/bis/gloves#0` kept nos dois | 0 divergências |
| T13 | normalização não funde dois anéis que diferem depois da vírgula | distintas |
| T14 | `majority` presente sse um estado > 70%, com contagem correta | por tier |
| T15–T22 | os oito casos nomeados de §5, por fixture | — |
| T23–T29 | R-BUILD-7: 265/265 fonte; 45 lacunas todas `bis`; nenhuma perda fora de `bis`; o resumo vem do tier **anterior**; `bis` sem "próximo" derivado; conjunto pt-BR == en-US; nenhum texto no HTML ausente de `content/` | — |

### 14.2 `scripts/build-markers-html.test.ts` — **o gate que faltava** (`check:built`)

A primeira versão testava a função pura e o HTML do sumário, e **nada afirmava que o HTML carrega os
marcadores que a função calculou**. "Calcular 2.369 marcadores e não renderizar nenhum" era uma mutation
verde — a metade visível do primeiro requisito da fase. Sobre as 7 `HEIGHT_SUBJECTS` × 2 idiomas:

- toda linha `[data-gear-slot]` de um tier não-`starter` carrega exatamente um marcador, igual à saída
  de `compareTiers` para aquele `${slot}#${occurrence}` — **exceto** as cobertas pelo estado
  majoritário, que não carregam nenhum e cujo tier carrega a linha de maioria;
- `starter` não carrega nenhum (290 linhas);
- o bloco de removidos aparece **exatamente** nos 30 pares que têm remoções e em mais nenhum;
- `bis` mostra o cabeçalho terminal, nunca o de "o que consertar em seguida", nas 53;
- o marcador é um nó de texto oculto **em ordem de documento dentro da linha**, e **não há
  `aria-label`** nessas linhas;
- controle anti-vacuidade no padrão de `page-structure.test.ts:129-149`.

### 14.3 `scripts/build-toc-html.test.ts` (HTML, sem scripts, 53 × 2)

Entradas do sumário == seções **renderizadas naquele documento** (nunca o literal 11, §3.6); hrefs na
ordem do documento; cada id exatamente uma vez; texto de cada link == valor de dicionário do cabeçalho
alvo, nos dois idiomas; nenhum `h2`/`h3`; nenhum `?` em href; nenhum `<Link>`; nenhuma string de
preferência (com o controle anti-vacuidade de C3). **Controles sintéticos:** uma página com href
pendurado falha; uma página cuja contagem de links **difere da contagem de seções renderizadas** falha
*(não "uma página com 10 links falha", que contradiz a tolerância de §3.6)*.

### 14.4 `nav-discovery.test.ts` e `locale-switch.test.ts` (`check:built`)

Home: seis cartões, `href` terminando em `/builds`, `data-tier` == `PROGRESSION_TIERS`, **o cartão
inteiro é o link**; sem scripts os seis links existem e nenhum controle de preferência; clicar o cartão
*k* grava `PROGRESSION_TIERS[k]`; **carregar a home não escreve nada**; `ctaStart` == `/leveling` nos
dois idiomas e `page.tsx:146` também; `/leveling` lista 8 classes; cinco cartões de referência naquela
ordem; **nome acessível do gatilho do header por largura** — `nav.menu` a 320/390/768, `nav.reference` a
900/1280 — com os 10 links intactos. Página de classe, todas as classes, dois idiomas: o sumário existe,
toda href resolve para um elemento presente, `#skills` está entre elas, e o predicado de §10.3 vale.

> `mobile-navigation.test.ts:306` faz `r.classSkills(...).split("#")[0]` — **descarta o fragmento** e
> não afirma nada sobre `id="skills"`. Só o gate novo cobre M37; a primeira versão sobre-atribuía.

Locale switch, nos dois sentidos: os cinco exemplos de §9.2; o cookie continua escrito; um controle de
que uma URL sem query e sem hash troca **sem** `preventDefault`; e uma asserção anti-vacuidade de que o
harness consegue observar um hash **ausente**.

### 14.5 Extensões a gates existentes

- **`build-tier-heights.test.ts`** — `TIER_CEILING_WITH_NEXT` com atribuição no comentário; as sete
  constantes de §3.8 publicadas por medição; **o topo do gatilho do sumário entra na tabela de C14** e
  é asserido nas 106 páginas (§3.7); C17 re-executado com o sumário aberto e fechado a 320/390.
- **`viewport.test.ts`** — **900 e 960** em `WIDTHS` (passando de oito para **dez**; §14 fala em "as
  larguras de `WIDTHS`", nunca "as oito"); superfície "sections sheet open"; **asserção de
  visibilidade computada** (`checkVisibility()`) do painel do sumário a 640/768/1280 — altura não é
  evidência, e foi exatamente isso que deixaria B2 passar; links do sumário ≥ 24×24.
- **`build-tier-state.test.ts`** — rótulo do tier ativo: aparece com preferência **ou com hash de
  tier**, e não aparece quando **não há nem preferência nem hash** *(a primeira versão dizia "não
  aparece sem preferência", o que é falso: com hash e sem preferência `resolveActiveTier` devolve
  `active = fromHash` e o tier abre)*; `Object.keys(localStorage)` continua `["d2rc.tier"]`; Escape,
  fundo, link e navegação soft fecham e devolvem o foco; `body.style.overflow` restaurado.
- **`hygiene.test.ts`** — o sumário entra em `TIER_FILES`; e a regra de escritor único vira
  **allowlist**: *só `components/game/tier-selector.tsx` e `components/home/tier-cards.tsx` podem
  importar `writeTier`/`clearTier`, com a varredura escopada a `app/`, `components/`, `lib/`; em
  particular `components/game/page-sections.tsx` não pode.* *(A primeira versão dizia "só
  `tier-selector.tsx`", o que proibia o commit 6 e apanharia `scripts/prefs.test.ts:35-36`.)*
- **`mobile-navigation.test.ts`** — rótulo por largura; coordenada de dispensa medida (§10.1).
- **`client-boundary.test.ts`** — expectativas **inalteradas**: continua a existir exatamente um script
  inline declarado.

---

## 15. Mutations

> `D2R_BUILD_ROOT` / `D2R_CHUNK_DIR` apontam um gate a uma cópia corrompida. Copiar `.next/server/app`
> para o scratchpad, mutar a cópia, correr com a variável. **Nunca tocar no repositório.**
> `build-freshness.ts:59`: com `D2R_BUILD_ROOT` setado o teste de frescor é **pulado** — variável
> esquecida faz todo `check:built` posterior julgar o mutante e reportar verde. Cada mutation corre em
> shell próprio e o plano confere `env | grep D2R_` depois.

> **Regra nova.** O log desta branch tem dois commits — `0c9f640` e `3b50df0` — que são recuperações de
> trabalho que *um revert de mutation apagou*. Portanto: **uma mutation de fonte só corre depois de o
> trabalho real estar committado**, e a reversão restaura o arquivo de uma cópia guardada no
> scratchpad, **nunca** com `git checkout -- .`. Depois de cada uma: `git status --porcelain` e
> `git diff --stat` contra o commit, no log.

| # | Mutação | Vermelho em |
|---|---|---|
| M1–M2 | indexar por nome de slot · ordenar por `GEAR_SLOTS` | T9 · **T3** (identidade de objeto) |
| M3 | identidade ignora `kind`, usa `label ?? ref` | T11, T12 |
| M4–M6 | derrubar ramo secundário · aninhado · comparar `picks[last]` | T5 |
| M7 | marcador em `starter` | T2 |
| M8–M9 | exigir `nextUpgrade` em `bis` · dar-lhe um derivado | T24, T27 |
| M10 | inventar texto de upgrade | T29 |
| M11 | **tirar a regra de remoção de §4.5** | **T10 e T10b** (48 → 49, 30 → 31) |
| M12 | resumo compacto vindo do próprio tier | T26 |
| M12b | mostrar "Próximo:" em todos os compactos | altura (§3.8) + `build-markers-html` |
| M13 | não declarar o estado majoritário | T14 |
| **M39** | **calcular os marcadores e não renderizar nenhum** | **`build-markers-html`** |
| **M40** | **renderizar o marcador do tier errado** | idem |
| M14–M16 | remover uma seção do sumário · trocar dois hrefs · rótulo como `<h2>` | `build-toc-html` · idem · `heading-snapshot` |
| M17 | mover o sumário para cima do controle | C14 (667 > 640 medido) |
| M18 | `<nav>` do sumário `sticky top-14` | C17 |
| **M18b** | **o painel do desktop fica invisível** (voltar a `sm:block`) | **asserção de visibilidade computada** (§14.5) |
| M19–M22 | sem devolver foco · sem `lockScroll` · sem fechar na rota · `writeTier` no sumário | asserções da sheet · allowlist de higiene |
| M23 | `aria-current` no sumário | `build-tier-state:110` |
| M24–M28 | cartão sem `href` · grava no render · chave errada · script inline na home · boot na home | `nav-discovery` · idem + `mobile-navigation:385` · `prefs.test:176` · `client-boundary` |
| M29–M30 | CTA de volta à Sorceress · cartão de referência a menos | `nav-discovery` |
| M31 | header com o rótulo errado **em qualquer das duas faixas** | `nav-discovery` (nome por largura) |
| M32–M35 | switcher larga `hash` · larga `search` · hash no `href` · `useSearchParams` | `locale-switch` · `locale-switch` (o gate de fonte **não** apanha — é o que justifica o de navegador) · `build-filters:596` · `:588` |
| M35b | **desestruturar `location`** (apaga a substring) | `build-filters:593` |
| M36–M38 | menu volta a ficar aberto · renomear `id="skills"` · entrada para seção não renderizada | `mobile-navigation` · `nav-discovery` · `nav-discovery` |

Cada gate novo entrega o próprio controle anti-vacuidade.

---

## 16. Commits

Pequenos, semanticamente separados. **Sem `git add -A`, amend, squash, rebase, reset destrutivo ou
force push.**

`check` e `check:built` são cadeias `&&`: um gate vermelho no começo **impede os seguintes de correr**.
Por isso cada script novo entra no commit 2 como `test:*` autônomo e é **encadeado no commit que o
deixa verde** — e **a cadeia é nomeada por commit**, porque a primeira versão deixava dois gates novos
fora de qualquer cadeia e `predeploy` nunca os teria executado. E como `tsconfig` inclui `**/*.ts`,
isolar da cadeia **não** protege `lint`/`typecheck`: `compare-tiers.ts` entra no commit 2 como **stub
tipado** com zeros válidos por tipo.

1. **plano** — este documento.
2. **testes vermelhos** — os cinco novos (`compare-tiers`, `build-markers-html`, `build-toc-html`,
   `nav-discovery`, `locale-switch`), o stub tipado, **900/960 em `WIDTHS`**, e o **protótipo de altura
   de §3.8.3** com as sete colunas publicadas. Cada um corre e falha **por comportamento**; o log entra
   no commit. *(A primeira versão afirmava que 900/960 estariam "verdes hoje" sem nunca ter corrido o
   gate nessas larguras — aqui isso é **medido** antes de ser afirmado, e se algo já estiver vermelho é
   reportado como pré-existente.)*
3. **comparação pura** — implementação; `test:compare-tiers` **→ `check`**.
4. **apresentação de marcadores e upgrades** — `gear-progression.tsx`, BiS terminal, estado
   majoritário, linha "Próximo:", `TIER_CEILING_WITH_NEXT`, dicionários EN+PT.
   `test:build-markers-html` **→ `check:built`**. Evidência visual de §7.5 produzida **antes** deste
   commit.
5. **sumário** — `page-sections.tsx`, quatro ids da build, ilha da sheet, rótulo do tier ativo.
   `test:build-toc-html` **→ `check:built`**.
6. **descoberta, home e classes** — cartões (`LinkCard`), CTA (as duas ocorrências), cinco cartões de
   referência, rótulo do header por largura, quatro ids da classe e o sumário lá.
   `test:nav-discovery` **→ `check:built`**.
7. **locale e hash** — o handler; `test:locale-switch` **→ `check:built`**.
8. **mutations e gates** — as ~45 mutations com o log; allowlist de higiene; coordenada de
   `mobile-navigation` se a medição de §10.1 a exigir.
9. **documentação factual e PRD** — relatório e as correções de §21.

---

## 17. Publicação

Só com todos os gates verdes, **lendo o exit code de volta do log, sem pipe**:

```
rm -rf .next
npm run predeploy > "$LOG" 2>&1; echo "EXIT=$?" >> "$LOG"; tail -1 "$LOG"
```

O build limpo é obrigatório: a memória do projeto regista um predeploy verde servindo artefato velho.
Depois: push normal de `main`, sem force; aguardar o deployment **do SHA exato** pela API do GitHub;
validar o domínio público; conferir 8 classes, 53 builds, 240 skills, sitemap inalterado, zero
localhost, e nenhuma regressão em filtros, menu, 404 ou árvore.

**Antes do push:** `grep` que confirma que **todo `test:*` acrescentado por esta fase aparece em `check`
ou `check:built`** (§20).

---

## 18. Riscos

| # | Risco | Mitigação |
|---|---|---|
| R1 | R-BUILD-7 estoura uma das sete constantes | §3.8: uma linha só, no tier após o expandido; protótipo no commit 2; parada na primeira constante que quebra |
| R2 | Sumário acima do controle estoura C14 | §3.7 é regra; M17 prova; **o topo do gatilho entra em C14** |
| R3 | "Mudou de lugar" (17) lê-se como dois "novos" | Documentado (§4.7); um quinto marcador quebraria R-BUILD-6 |
| R4 | "Mantido" esconde `sockets`/`lookFor` (125+75) | Inerente a R-BUILD-6; registrado |
| R5 | Identidade por label é estável por sorte (52 sem tradução) | `ref` primeiro confina a exposição a 408 picks; T11 vigia |
| R6 | Rótulo do header estoura a linha a 900 px | 900/960 em `WIDTHS` **antes**; degrau sobe se preciso |
| R7 | `(12,700)` navegar para `/builds` no bloco 5 | Medir as caixas antes do commit 6 e mover a coordenada |
| R8/R9 | `router.push` com fragmento não aterrar; tier não seguir | Navegação dura com hash; o teste distingue |
| R10 | `role=dialog` dentro de `<details>` | Spike só do papel; `aria-modal` segue o precedente da sheet de filtros (§11) |
| R11 | `<details>` aberto numa navegação soft | Efeito de fecho por `usePathname()`, como `mobile-navigation.tsx` |
| R12 | `toggle` é assíncrono | O elemento é a fonte de verdade; nunca espelhar `open` em estado |
| R13 | Revert de mutation apagar trabalho | §15: só depois do commit; restauro por cópia |
| R14 | `heading-snapshot` reprovar 106 páginas | Nenhum `h2`/`h3` novo; M16 prova |
| R15 | `<Section className="scroll-mt-…">` no-op verde | Medido (§9.1); a fase não mexe no offset |
| R16 | Rolagem de 297–1.296 ms por ativação | §22(h) decide **nesta fase**, com os números |
| R17 | Sem JS, 396 px de lista abaixo de 640 px | Declarado (§8.1/§12); é a troca que evita o piso de navegador de `::details-content` |

**Rollback.** Cada commit é reversível com `git revert`. Sem migração, sem backend, sem mudança de URL
ou sitemap, sem conteúdo editorial alterado. As seis âncoras `#gear-<tier>` e os sete ids existentes
nunca deixam de existir.

---

## 19. Fora de escopo, registrado

Filtros, `GOOD_AT_THRESHOLD`, ordenação, árvore, ícones, leveling, favoritos, modo compacto, impressão,
comparação entre builds, compartilhamento, conta, backend — **nada tocado**. Mais: um quinto marcador;
scroll-spy; o offset de âncora das seções (47/87 px, medido e publicado, não alterado);
`leveling/[classSlug]/page.tsx:105` sticky a 320 px (57+65 = 122 px, 10 acima do teto — defeito real,
medido, **fora do escopo**); o par Self-found/Hardcore, inalcançável pelo sumário por não ser
`<section>`; cliques com modificador e leitores sem JS continuam a perder o fragmento;
`nextUpgradeShort` como campo autorado (265 strings) seria a única forma curta fiel e é trabalho de
conteúdo; `d2rc.compact`, `d2rc.leveling.<classe>`, `d2rc.level` continuam documentadas e não
implementadas.

**As Fases 3, 4 e 5 não são iniciadas por este plano.**

---

## 20. Checklist de fechamento

- [ ] Leitura pt-BR em 390 px pelo proprietário (R-I18N-8).
- [ ] Evidência visual de §7.5 apresentada; a decisão de §7.2 confirmada ou revertida por ela.
- [ ] J5 concluída na sessão do proprietário — **com o número de marcadores desenhados à frente dele**
      (§21).
- [ ] As ~45 mutations re-executadas **depois do último ajuste da revisão**.
- [ ] `git diff --stat` contra o último commit confirma que nenhuma correção da revisão foi perdida.
- [ ] **`grep` confirma que todo `test:*` novo está em `check` ou `check:built`.**

---

## 21. Correções ao PRD, no commit 9

Cada uma é uma edição pontual mais uma entrada em §18 do PRD, sem reescrever histórico — o padrão do
refinamento de R-BUILD-4.

| # | Texto atual | Correção |
|---|---|---|
| a | R-BUILD-6: *"A comparação usa `ref.slug`"* | `ref.kind + ref.slug` |
| b | R-BUILD-7 *Aceite:* *"presente nos seis tiers"* | insatisfazível em `bis` para 45 de 53; reescrito para o contrato terminal de §6 |
| c | §14 Fase 2: *"marcadores em todos os slots das 53 builds"* | o primeiro tier é isento. **Classificados: 2.369 de 2.659. Desenhados: 1.124 mais as linhas de maioria** (§7.2). **Os dois números vão ao proprietário antes do commit 4**, não no relatório depois |
| d | R-BUILD-6: removidos *"listado ao fim"* | **48 remoções em 30 pares**; o bloco está ausente de **235 de 265** renderizações: é **condicional**, e não se orça altura para ele |
| e | R-BUILD-7: *"repetido … no `<summary>` do tier compacto seguinte"* | vai no bloco de preview, **fora** do `<summary>` (nome acessível), e **só no tier seguinte ao expandido** (§3.8.1) |
| f | **J5** (`PRD:206`) e R-BUILD-6: *"cada slot … carrega um marcador"* | refinado: *cada slot recebe um marcador; o estado majoritário do tier pode ser declarado uma vez em vez de repetido por slot*. **É a condição de avanço da fase** — a primeira versão não a listou |
| g | R-BUILD-8 *Aceite:* *"cada seção alcançável em um toque"* e R-NAV-3 idem | na build abaixo de 640 px são **dois toques** (abrir a sheet, tocar o link), o que a decisão 4 do proprietário já prevê ("uma interação **após abrir**"). Na página de classe continua **um**, porque o sumário lá é sempre visível (§10.3) |
| h | R-NAV-4: rótulo *"Referência"* | condicional à largura (§10.4), como a própria decisão do proprietário condiciona ("quando esse for o agrupamento") |

*(A primeira versão listava R-BUILD-8/9 × R-PREF-4 como contradição do PRD. Não é: é uma decisão de
desenho que este plano toma em §8.1. Removido daqui.)*

---

## 22. Decisões do coordenador

**a. BiS mantém o `nextUpgrade` que já tem** — a mensagem terminal é o cabeçalho; o texto autorado
continua. Apagá-lo seria mudança editorial, fora de escopo. §6.

**b. A remoção falsa é suprimida por uma regra estrutural** — "Removido" = o slot ficou vazio. Dispara
uma vez, sem comparação por rótulo, sem tocar em conteúdo, e mantém M11 detectável. §4.5.

**c. O segundo href para a Sorceress (`page.tsx:146`) é corrigido junto com o CTA.** Mesmo defeito,
mesmo arquivo, numa fase cujo objetivo declarado inclui corrigi-lo.

**d. A forma curta é `line-clamp-2` sobre o texto completo**, e a linha aparece **só no tier compacto
seguinte ao expandido**. Nenhuma truncagem mecânica é fiel (§3.5), e é isto que faz a conta de altura
fechar sem tocar na afirmação publicada de 87,6%. §3.8.1.

**e. "Mantido" não é desenhado, e o estado majoritário de um tier é dito uma vez, nos dois canais.**
Decidido a partir da distribuição **por tier**, não do total da página. Condicional à evidência visual
de §7.5. §7.2.

**f. Os marcadores são micro-rótulos na coluna do slot, não selos** — zero altura a partir de 640 px, e
não transformam `nightmare` num campo de caixas. §7.1.

**g. O sumário é servido `<details open>` e fechado por JS abaixo de 640 px**, em vez de revelado por
CSS: `sm:block` não vence `content-visibility` e teria renderizado invisível com os gates verdes. Custo
declarado: ~396 px de lista para o leitor sem JS no celular. §8.1.

**h. A rolagem suave fica.** Medida: 297–1.296 ms, mediana ~660 ms a 390 px — não os ~1.500 ms
estimados, porque a Fase 1 encurtou as distâncias. Trocar `scroll-behavior` é uma mudança global em
~1.002 páginas que também altera as âncoras de tier da Fase 1, e ninguém a pediu. **Entra como item
explícito da sessão de UAT**; se o proprietário a reprovar, a correção é uma linha em `globals.css`
mais a re-execução dos gates de âncora da Fase 1, e isso fica escrito aqui para não ser reinventado.

**i. O rótulo do header é condicional à largura** — `nav.menu` abaixo de 900 px, `nav.reference` a
partir daí, porque abaixo de 900 px o `<details>` é a única navegação do site e a decisão do
proprietário é explicitamente condicional. `nav.menu` não é apagado; o ADR 0003 não muda; e o gate
passa a afirmar o nome **por largura**, que é mais forte do que a compilação falhar. §10.4.

**j. Um só componente de sumário serve build e classe**, com `collapsible` por página: sempre visível
na classe (cinco entradas, um toque em todas as larguras), divulgação na build (onze entradas, 396 px
empilhados). §10.3.

**k. A troca de idioma usa navegação dura quando há fragmento** e mantém `router.push` para só-query.
**Sujeito a medição**: se o caminho soft acertar âncora e estado, o plano é corrigido com o número.
§9.2.

---

## 23. Disposição dos achados das duas revisões adversariais

Duas revisões independentes e paralelas sobre a primeira versão deste plano, no vocabulário de
severidade da revisão do PRD. **Veredito das duas: não pronto para executar.** R1 mediu aritmética e
mecanismos; R2 leu como quem vive com o resultado. Todos os BLOCKER e HIGH estão resolvidos abaixo; os
MEDIUM e LOW aceitos também.

### BLOCKER

| # | Rev | Achado | Disposição |
|---|---|---|---|
| B1 | R1 | **O guarda de remoção de §4.4 suprimia zero.** A identidade é `ref` primeiro; o guarda comparava `label:weapon switch…` com `runeword:call-to-arms`. Guarda e identidade eram mutuamente exclusivos por construção. T5, T10, M11 e §21(d) assentavam num número inexistente, e M11 era **indetectável** (apagar um no-op não muda saída) | **Corrigido.** Regra estrutural nova em §4.5 ("Removido = o slot ficou vazio"), medida: dispara **1** vez, exatamente no caso `blade-fury`. Totais republicados: **48 remoções em 30 pares, ausentes de 235 de 265**. M11 volta a ser detectável |
| B2 | R1+R2 | **`sm:block` não revela um `<details>` fechado.** Medido em Chrome 151: `content-visibility: hidden` em `::details-content`; `display` num filho não vence. O sumário do desktop renderizaria **invisível nas 106 páginas** com `build-toc-html` verde e um gate de altura verde | **Corrigido.** §8.1 passa a servir `<details open>` e fechar por JS abaixo de 640 px — o padrão que `gear-progression.tsx` já provou, sem piso de navegador. Custo declarado (396 px sem JS no celular). **Asserção de visibilidade computada** acrescentada (§14.5); M18b prova |
| B3 | R1 | **§8.2 proibia §10.1**: o commit 6 cria o segundo importador de `writeTier`, o commit 8 a regra que o proíbe; e a varredura apanharia `scripts/prefs.test.ts` | **Corrigido.** A regra vira **allowlist** escopada a `app/`/`components/`/`lib/`, nomeando `tier-selector.tsx` e `tier-cards.tsx`, e proibindo explicitamente `page-sections.tsx` (§14.5) |
| B4 | R1+R2 | **O orçamento de altura mirava 1 de 7 constantes.** A que aperta primeiro é `TIER_CEILING` (40 px/tier, 168 asserções), não `ACCEPTANCE` (66 px, só em `blizzard-sorceress`); e a parada de "+250 px" ficava **acima do ponto onde `MIN_GEAR_REDUCTION` — a afirmação publicada de 87,6% — quebra** | **Corrigido.** §3.8 publica as **sete** com folga medida e diz qual move e qual **não move sem o proprietário**. O desenho muda (§3.8.1): a linha "Próximo:" só no tier seguinte ao expandido, portanto **sem preferência nada cresce** e a afirmação de 87,6% não é tocada. Constante nova e nomeada `TIER_CEILING_WITH_NEXT` só para o tier que a carrega. Parada na **primeira constante que quebra**. O clamp é nomeado e medido no commit 2 |
| B5 | R2 | **§7.2 decidia a partir de um estado que o padrão nunca mostra.** Os 52,6% são de seis tiers abertos; a Fase 1 abre um. Por tier, silenciar "mantido" ganha 85 pontos em `bis` e **8,5 em `nightmare`**, onde 91,5% das linhas continuariam com selo | **Corrigido.** §7.2 refeito a partir da tabela **por tier**. Duas partes: "mantido" não é desenhado **e** o estado majoritário (>70%) é dito uma vez, **em ambos os canais**, em vez de repetido por slot. §7.1 troca selos por micro-rótulos (zero altura ≥640 px) |
| B6 | R2 | **J5, a condição de avanço da fase**, exige marcador em cada slot do tier ativo; §21 não listava a contradição, e publicava "2.369 alcançável" quando o número desenhado é outro | **Corrigido.** §21(f) refina J5 e R-BUILD-6 explicitamente; §21(c) publica **os dois números** — classificados 2.369, desenhados 1.124 mais as linhas de maioria — e leva-os ao proprietário **antes do commit 4** |

### HIGH

| # | Rev | Achado | Disposição |
|---|---|---|---|
| H1 | R1 | `const { search, hash } = globalThis.location` **apaga a substring `location.search`** e deixa `build-filters.test.ts:593` vermelho — o gate que o plano cita três vezes como guarda | **Corrigido.** Duas leituras em linhas separadas, com o motivo escrito (§9.2). M35b prova |
| H2 | R1 | **A metade renderizada de R-BUILD-6 não tinha gate, arquivo nem mutation.** "Calcular 2.369 marcadores e não renderizar nenhum" era verde | **Corrigido.** `scripts/build-markers-html.test.ts` novo (§14.2), dono A1, em `check:built`, mais **M39** e **M40** |
| H3 | R1 | "Próximo:" dentro do `<ul data-tier-preview>` quebra `build-tier-state.test.ts:262-266` (`children.length`), e a edição não tinha dono | **Corrigido.** §7.3 põe a linha **fora** do `<ul>`, como irmão com o seu próprio `peer-open:hidden`, e §13 dá o arquivo a A2 |
| H4 | R1 | **`build-toc-html` e `nav-discovery` nunca entravam numa cadeia** — `predeploy` não os executaria, e entre os dois cobrem cinco dos nove requisitos | **Corrigido.** §16 nomeia a cadeia por commit; §17 e §20 acrescentam um `grep` de fechamento |
| H5 | R1 | `aria-label` na linha `role=generic` é **proibido pela ARIA, ineficaz, e passa** num gate sobre `axNodes()` | **Corrigido.** Só `sr-only`; o "ou" foi removido; o gate afirma nó de texto em ordem de documento **e ausência de `aria-label`** |
| H6 | R2 | §3.8 passo 5 ("nada além do que R-BUILD-7 custa") **proibia a altura que §8.1 gasta** | **Corrigido.** O orçamento é por requisito, e o desenho de §3.8.1 remove o conflito na origem |
| H7 | R2 | §10.3 (5 entradas) × §14.4/M38 ("entradas == seções renderizadas", 8 na classe): vermelho no dia um | **Corrigido.** §10.3 fixa cinco e o predicado passa a ser "toda entrada resolve" + "toda seção **da lista declarada** que renderizou tem uma entrada" |
| H8 | R2 | **"Referência" nomeia mal a única navegação abaixo de 900 px** — e nomeia o *landmark* dos dez links, não só o gatilho | **Corrigido.** §10.4 torna o rótulo condicional à largura, que é o que a decisão do proprietário condiciona. `nav.menu` sobrevive, o ADR não muda, e o gate afirma o nome **por largura** |
| H9 | R2 | Dois toques e rolagem lenta contra "um toque"; §21 não declarava | **Corrigido.** §21(g) declara; §22(h) **decide nesta fase** com a medição (297–1.296 ms, não ~1.500) e põe a rolagem na pauta do UAT com a correção de uma linha já escrita |
| H10 | R2 | §7.5 não cobria BiS terminal (que §6 promete), a linha "Próximo:", o sumário, o header a 900 px, a página sem JS, nem o eixo **por tier** que decide §7.2 | **Corrigido.** §7.5 reescrito com todos, incluindo `nightmare` × `bis` lado a lado nos dois tratamentos e 200% a 320 px pt-BR |
| H11 | R1 | §3.8 adiava o clamp, "o único número que decide o seu maior risco" | **Corrigido.** Clamp nomeado e medido no commit 2, antes do componente |

### MEDIUM e LOW

| # | Rev | Achado | Disposição |
|---|---|---|---|
| Ma | R1 | §14.3 fixava "exatamente 11 links", contra a tolerância que §3.6 exige | **Corrigido:** entradas == seções renderizadas; o controle passa a ser "contagem ≠ seções renderizadas falha" |
| Mb | R1 | §21(d): "48 … 217 de 265" — medido 49 sobre **31** pares → 234 | **Corrigido e remedido** com a regra nova: **48 / 30 / 235** |
| Mc | R1 | **M2 escapava a T3**: ordenar preserva comprimento e índices | **Corrigido:** T3 afirma **identidade de objeto** (`slots[i].entry === set.slots[i]`) |
| Md | R1 | `mobile-navigation.test.ts:306` **descarta o fragmento** e não cobre M37 | **Corrigido:** a sobre-atribuição foi removida (§14.4) |
| Me | R1 | R7 mirava `localStorage`; o perigo real em `:214` é **navegação**, no bloco 5 | **Corrigido:** §10.1 manda medir as caixas dos seis âncoras antes do commit 6 e mover a coordenada se preciso |
| Mf | R1 | `axNodes()` devolve `{role,name}` e **não pode** responder sobre `aria-modal` | **Corrigido:** §11 limita o spike ao papel; `aria-modal` segue o precedente de `mobile-filter-sheet`. Nenhum método novo em `headless.ts` |
| Mg | R1 | O gatilho do sumário aterra ~675 px, fora da primeira tela, e nenhum gate o vê | **Corrigido:** entra na tabela de C14 e é asserido nas 106 páginas (§3.7, §14.5) |
| Mh | R1 | "verde hoje" para 900/960 era afirmação não verificada | **Corrigido:** o commit 2 mede antes de afirmar, e reporta como pré-existente o que já estiver vermelho |
| Mi | R1 | "o rótulo não aparece sem preferência" é **falso** com hash e sem preferência | **Corrigido** (§14.5): "não aparece quando não há nem preferência nem hash de tier" |
| Mj | R1 | §21(f) da versão anterior não era contradição do PRD, era decisão de desenho | **Removido** de §21 |
| Mk | R2 | §7.3 instruía HTML inválido (`<p>` dentro de `<ul>`) e §12 prometia "tudo" sem JS para R-BUILD-7 | **Corrigido** em §7.3 e §12 |
| Ml | R2 | O cartão de tier não dizia se o link envolve o cartão todo | **Corrigido:** `LinkCard`, cartão inteiro (§10.1) |
| Mm | R1 | §3.4 misturava censo raso (3.519) e profundo (3.827) | **Corrigido** com nota explícita |
| Mn | R1 | §3.5 misturava 265 e 273 | **Corrigido:** cada número com o seu conjunto |
| Mo | R1+coord | "77 mudou de lugar" não reproduziu (R1 mediu 32) | **Remedido pelo coordenador: 17**, com a **definição publicada junto** (§4.7). Os três números mediam coisas diferentes; nenhum tinha método declarado |
| Mp | R1 | `heading-snapshot.json` só cobre páginas de build; M15 ficava sem guarda na classe | **Corrigido** (§8.3): o gate novo afirma a regra na página de classe |
| Mq | R1 | §13 mandava alterar `components/ui/index.tsx` "se `Section` precisar de `id`" — já aceita | **Linha removida** de §13 |
| Mr | R1+R2 | "as oito larguras" depois de `WIDTHS` passar a dez | **Corrigido:** "as larguras de `WIDTHS`" |
| Ms | R2 | §1 dizia "custo exatamente zero" sem o qualificador da métrica | **Corrigido:** §3.7 diz de que métrica se trata |
| Mt | R1 | M34 casava por substring | **Registrado** no gate |
| Mu | R2 | O motivo pelo qual R-NAV-4 é seguro a 320 px (`sr-only`) não estava escrito | **Corrigido** (§3.9), com o aviso de não "simplificar" o par `sr-only sm:not-sr-only` |
| Mv | R2 | A troca de idioma com fragmento passa a ser recarregamento completo | **Declarado** em §9.2 |

### Confirmado pelas revisões, sem alteração

Reproduziram-se **todos** os números de conteúdo: 318 tiers · 273/45 todas em `bis` · 2.659/290 ·
999/1.245/125 · a tabela de 20 células por tier · 33+92 · `blade-fury/budget` como única duplicata ·
1 de 318 em ordem canônica · 408 picks sem `ref` · 0 × 1 divergência en/pt · os oito textos de `bis`
verbatim · 8/75/116/187 · 125/75/46 · 11 seções com 7 ids · 52,6%/72%/85%.

E dois mecanismos que as revisões esperavam ver cair **resistiram**: o `MutationObserver` sobre `open`
**dispara** para a escrita de propriedade de `applyTierState` (§8.2), e `role="dialog"` dentro de
`<details>` lê corretamente na árvore de acessibilidade. §9.2 **não** quebra `persistLocale` nem
`build-tier-state.test.ts:639-648`, e §22(c) é correção, não alargamento de escopo.
