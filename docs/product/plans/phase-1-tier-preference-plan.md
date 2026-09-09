# Plano da Fase 1 — Tiers compactos e preferência "Meu tier"

**Escrito:** 2026-09-08 · **Revisado:** 2026-09-09 (duas rodadas de revisão adversarial; §15) · **Baseline de código:** `2873b61` (main = origin/main, worktree limpo)
**Contrato:** [PRD vNext](../PRD-vNext.md) §6 (R-BUILD-1…5, 9–12), §6.4 (R-PREF-1…4), §10, §11, §12.1, §14 Fase 1
**Origem:** três agentes em paralelo (estado/arquitetura, experiência/acessibilidade, testes/adversarial) sobre `2873b61`, seguidos de uma revisão adversarial deste próprio plano, cujos dois BLOCKER e sete HIGH estão resolvidos abaixo e registrados em §15.
**Status:** executável. Q1 e Q2 não são reabertas. As Fases 2, 3, 4 e 5 não são iniciadas.

> **O que este plano decide.** O PRD decide *o que* muda e *como se verifica*. Este documento decide *como* se implementa, com que arquivos, em que ordem, com quais testes, e — onde a medição contradisse uma hipótese do PRD — **com que números a aritmética é refeita**, como §12.1 manda.

---

## 1. Resumo executivo

A página de build serve hoje seis tiers empilhados e sempre abertos: **32.574 px** em 390 px (en-US) e **34.030 px** (pt-BR), com a seção Gear ocupando 16.458 px. Não há como dizer ao site em que estágio o jogador está, nem memória disso entre builds.

A Fase 1 entrega seis tiers compactos por padrão quando há JavaScript, um seletor "Onde você está?" logo abaixo do título, a preferência local única `d2rc.tier`, expansão do tier escolhido, a ação explícita "Ir para o equipamento", e **nenhum deslocamento automático**. Sem JavaScript o HTML servido continua com os seis tiers abertos e seis âncoras, e não promete persistência nenhuma.

Três medições mudaram o plano (§3). Uma revisão adversarial encontrou dois defeitos no próprio plano — um mecanismo de CSS que teria quebrado R-BUILD-5 com todos os gates verdes, e uma aritmética que atribuía a fases futuras uma dívida que é desta (§3.4). Ambos estão corrigidos.

---

## 2. Verificação do baseline

| Invariante | Estado |
|---|---|
| branch | `main` |
| HEAD | `2873b61e300b6635e7c0d51daff2a6eed5d354c5` |
| origin/main | idêntico a HEAD |
| worktree | limpo |
| stashes | nenhum |
| worktrees | um só |
| deployment de produção | `6337303717`, SHA `2873b61e…`, `state=success` |

Baseline de artefato: 6 âncoras `#gear-*` em en-US e pt-BR, idênticas; **1** `<details>` na página (o menu mobile); HTML construído de `/en-us/builds/sorceress/blizzard-sorceress` = **584.029 bytes** (produção: 583.980); overflow horizontal 0 em 320/390/768/1280 nos dois idiomas.

---

## 3. O que a medição contradisse — e a aritmética refeita

§12.1 instrui: *"Os 320 px por tier compacto são hipótese; se a medição da Fase 1 der outro número, a meta de página é recalculada com a mesma aritmética, escrita no plano da fase."* R-BUILD-5 e §17.7 também marcam os 320 px como **hipótese**.

### 3.1 O tier compacto não cabe em 320 px, e o orçamento é uma fórmula, não uma faixa

Piso de um tier compacto a 390 px, na escala de tipo do próprio design system:

| Parte | px |
|---|---|
| padding `p-4` + bordas | 34,0 |
| cabeçalho (ordinal · `h3` 18/28 · badge · afordância) | 28,0 |
| `mt-1.5` + objetivo (`text-sm leading-snug`, 2 linhas) | 44,5 |
| `mt-3` + linhas de preview (`text-sm` 20 px + `space-y-0.5`) | 12 + 22 × N |
| **cromo fixo** | **118,5** |

**Orçamento por tier, medido a 390 px:**

```
f(N, G) = 118,5 + 22N + 19,25 × max(0, G − 2)     tolerância +8%
```

onde `N` = `slots.length` e `G` = número de linhas que o objetivo ocupa. **O termo do objetivo não é decorativo:** os `goal` vão de 20 a 187 caracteres (p50 69, p90 115) e, a ~48 caracteres por linha em 390 px, cerca de 67 das 318 instâncias passam de duas linhas. Sem esse termo, um tier de 4 ou 5 slots com objetivo longo estoura a tolerância de 8% — `blade-fury/starter` em +16,8%, `phoenix-strike/optimized` em +11,4%. A tolerância de 8% cobre a variação de fonte e arredondamento, não uma linha inteira de texto.

**A medição é a 390 px e a 320 px, com o orçamento reavaliado em cada uma** — a 320 px o objetivo quebra mais e `G` cresce. C13 declara a largura em cada asserção.

Faixas fixas foram descartadas: a versão anterior deste plano tinha bandas para "≤6 slots" e "≥9 slots" e **nenhuma para 7 ou 8** — 37 das 318 instâncias, incluindo **três das seis** da build-baseline. A fórmula cobre as 318.

Distribuição real medida sobre as 53 builds (318 instâncias):

```
4 slots: 28   5: 20   6: 29   7: 16   8: 21   9: 48   10: 155   11: 1
```

**49% dos tiers têm 10 ou 11 slots.** O pior caso é o caso típico: `f(10, 2) = 338,5 px`, e nenhum tier de 9 ou mais slots cabe em 320 px. Os tiers rasos cabem — `f(4, 2) = 206,5` — mas são 28 de 318. Chegar a 320 px num tier de 10 slots exigiria linhas de preview a 12 px (fora da escala do site) ou remover o objetivo do resumo, que R-BUILD-5 exige.

### 3.2 O baseline de §12.1 já tinha derivado

O PRD ancora em 31.939 px de página e 16.315 px de Gear, medidos em produção em 2026-09-07. A medição local em `2873b61`, com o driver CDP do repositório, dá **32.574 px** e **16.458 px**: a página cresceu **635 px** depois da Fase 0A. A aritmética do PRD foi feita sobre uma página que não existe mais.

### 3.3 pt-BR é o pior caso e o PRD nunca o mediu

| Build, 390 px | Página | Gear |
|---|---|---|
| blizzard-sorceress **en-US** | 32.574 | 16.458 |
| blizzard-sorceress **pt-BR** | **34.030** | **17.228** |

pt-BR é 4–9% mais alto por página e 5–13% por tier. O maior tier expandido medido em qualquer lugar é `blizzard-sorceress` / `optimized` / pt-BR a 320 px: **4.025 px**. Toda meta desta fase é verificada nos dois idiomas.

### 3.4 A aritmética refeita, por tier real — e onde a dívida realmente está

`blizzard-sorceress`, a build que §12 nomeia como baseline, tem `slots.length` = **[8, 8, 7, 10, 10, 10]**, não dez em toda parte. Avaliando `f(N)` por tier:

```
294,5 + 294,5 + 272,5 + 338,5 + 338,5 + 338,5 = 1.877,0  (seis compactos)
vãos: 5 × 40 (space-y-10)                     =   200
cabeçalho da seção                            =    90
Gear, seis compactos                          = 2.167,0
```

Com `NãoGear` = 32.574 − 16.458 = **16.116** (en). **O tier expandido usado é o pior medido de verdade nesta build: `optimized` = 3.380 px**, não `budget` (3.316) — §3.3 já o nomeia como o maior, e a linha que C13 afirma diz "pior tier", então a conta tem de ser a do pior.

| Estado | Antes das alavancas | Meta do PRD | Diferença |
|---|---|---|---|
| Gear, seis compactos | **2.167** | ≤ 1.920 | +247 |
| Gear, um expandido (`optimized`, E = 3.380) | **5.208,5** | ≤ 4.955 | +253,5 |
| Página, seis compactos | **18.283** | ≈ 17.500 | +783 |
| Página, um expandido | **21.324,5** | ≤ 21.000 | +324,5 |

**Alavancas dentro do escopo**, todas dentro do desenho de R-BUILD-5:

| Alavanca | Seis compactos | Cinco compactos + um aberto |
|---|---|---|
| `space-y-10` → `space-y-6` (5 vãos × 16 px) | 80 | 80 |
| `p-4` → `p-3` no cartão compacto (8 px por tier) | 48 | 40 |
| `space-y-0.5` → 0 nas linhas de preview (2 px por linha) | 94 | 76 |
| **total** | **222** | **196** |

| Estado | Depois das alavancas | Meta do PRD | Folga residual |
|---|---|---|---|
| Gear, seis compactos | **1.945** | ≤ 1.920 | **+25** |
| Gear, um expandido | **5.012,5** | ≤ 4.955 | **+57,5** |
| Página, seis compactos | **18.061** | ≈ 17.500 | +561 |
| Página, um expandido | **21.128,5** | ≤ 21.000 | **+128,5** |

**Onde a dívida está, com a conta fechada.** A folga de 128,5 px no estado que o PRD trava decompõe-se exatamente em dois termos:

- **57,5 px dentro do Gear**, que as alavancas não alcançam sem violar o próprio R-BUILD-5 (a linha de objetivo custa 44,5 px e o padding 34 px; cortá-los é remover o que o requisito manda mostrar).
- **71 px fora do Gear**: o conteúdo não-Gear cresceu de 15.624 para 16.116 px desde a medição do PRD (**+492**), e a derivação do PRD deixava **421 px** de folga (20.579 contra o teto de 21.000). 492 − 421 = **71**.
- 57,5 + 71 = **128,5** ✔.

Ou seja: **45% do estouro residual é da Fase 1 e 55% é deriva de baseline** — e a versão anterior deste plano errava duas vezes, primeiro atribuindo tudo às Fases 4 e 6d, depois provando viabilidade com o tier `budget` enquanto a linha asserida falava do pior tier.

**A afirmação "nenhuma altura de tier compacto alcança 21.000" foi retirada por ser falsa.** O que é verdade, com precisão: fechar em 21.000 com o pior tier aberto exigiria que os cinco compactos somassem ≤ 1.294 px, isto é **258,8 px de média**, contra 1.422,5 px pós-alavanca (284,5 de média) — **25,7 px por tier** que R-BUILD-5 não deixa ceder. (Os dois lados já descontam as alavancas de vão e de padding; só o termo por tier fica.)

**Aceite da Fase 1.** Todas as linhas são de `blizzard-sorceress`, a build que §12 nomeia, a 390 px, salvo onde dito. As metas são os valores **pós-alavanca projetados**, com a folga contra o PRD publicada em cada linha — não são as metas do PRD renomeadas:

| Métrica | Meta desta fase | vs. PRD | C13 |
|---|---|---|---|
| Gear, seis compactos, en | ≤ 1.974 px | +54 sobre 1.920, publicado | **afirma** |
| Gear, um expandido (pior tier), en | ≤ 5.050 px | +95 sobre 4.955, publicado | **afirma** |
| Página, seis compactos, en | ≤ 18.150 px | +650 sobre ≈17.500, publicado | **afirma** |
| Página, um expandido (pior tier), en | ≤ 21.200 px | +200 sobre 21.000: **128,5 atribuídos em §3.4 (57,5 no Gear + 71 de deriva) e 71,5 de folga de meta** | **afirma** |
| As mesmas quatro, pt-BR | +9% sobre cada uma | idem | **afirma** |
| Altura por tier compacto, 318 instâncias, a 390 e a 320 px | `f(N, G)` +8% | — | **afirma** |
| Máximo absoluto do catálogo (`leap-attack-barbarian`, [10×6]) | publicado, não travado | — | **publica** |
| Redução da seção Gear | ≥ 88% contra 16.458 px | — | **afirma** |
| Redução da página na primeira visita | ≥ 44% contra 32.574 px | — | **afirma** |

O que C13 **afirma** falha o gate; o que ele **publica** entra no relatório. `leap-attack-barbarian` tem 24.531 px de conteúdo não-Gear e chega a ≈29.800 px com um tier aberto: é o máximo do catálogo, é medido, e não é travado, porque a redução que faltaria vem das Fases 4 e 6d.

### 3.5 O aceite de ≤560 px já falha em pt-BR, antes de o controle existir

Medido o fim do bloco de título nas 53 builds × 2 idiomas, na posição mais alta possível:

| Posição | en-US min/p50/max | acima de 560 | pt-BR min/p50/max | acima de 560 |
|---|---|---|---|---|
| **A** — logo após `PageHeader` | 399 / 465 / **554** | 0 de 53 | 399 / 487 / **583** | **2 de 53** |
| **B** — antes de "Como se joga" | 399 / 465 / **2.325** | 1 de 53 | 399 / 487 / **2.445** | 3 de 53 |

`assassin/lightning-trapsin` e `assassin/whirlwind-assassin` terminam o bloco de título a **583 px** em pt-BR. O número 560 veio da correção B2 da revisão do PRD, medida só em en-US.

**Uma ambiguidade a fechar antes de escrever o gate:** 583 px é o *fim do `PageHeader`*, não o topo do controle. O controle entra como primeiro filho de `<div className="mt-8 …">` (`page.tsx:161`), então o topo real é **583 + 32 = 615 px** — a folga é de **55 px, não 23**. A primeira medição da implementação é o topo do controle renderizado de verdade, nas 53 × 2, e nenhuma decisão é tomada antes dela.

Alavancas sem tocar em conteúdo, na ordem: `mt-8` → `mt-4` acima do controle (16 px); `py-10` → `py-6` no `PageHeader` abaixo de `sm` (16 px); `h1` `text-3xl` → `text-2xl` abaixo de `sm` (20 px). Somam 52 px — perto dos 55, e é honesto dizer que pode não fechar.

**C14 é escrito em dois níveis (decisão do proprietário, §16.3):** alvo de **560 px** e teto duro de **640 px**. Entre os dois, o gate fica verde e as páginas entram no relatório como excedentes do alvo; acima de 640 px o gate fica vermelho e a execução para antes do push, com a medição e a causa apresentadas. Não há lista permanente de exceções.

O objetivo de produto é encontrar o controle na primeira viewport de 320×640, não obedecer a um número derivado só do en-US. R-BUILD-1 tem dois aceites — o número **e** a jornada J3.

### 3.6 Três achados herdados e um entregue adiante

- **`gear-progression.tsx:31` é `sticky top-14` em todas as larguras**, o que já viola R-A11Y-8 desde antes desta fase. R-BUILD-4 está na lista da Fase 1, então corrigir é escopo. É **perda visível** para quem gostava da barra no celular → item de UAT.
- **`scroll-mt-32` (128 px) soma com `scroll-padding-top: 5rem` (80 px) = 208 px** de offset de âncora. Invisível com tier de 2.200 px; conspícuo com tier compacto de ~300 px. Reconciliar para **112 px a partir de 640 px** (header 57 + espelho sticky ~40 + margem) e **72 px abaixo** (header 57 + margem, porque §8.1 remove o sticky ali): `scroll-padding-top` vai a `3rem` em `globals.css:74`, `scroll-mt-16` (64 px) no tier, e uma media query abaixo de `sm` reduz o `scroll-padding-top` a `0.5rem` (8 px). Confere: 64 + 48 = **112** a partir de 640 px; 64 + 8 = **72** abaixo. Os dois lados têm dono em §10 e mudam no mesmo commit; `anchorOffsetPx()` em `lib/prefs.ts` devolve o mesmo número ao realinhamento por JS.
- **`prefers-reduced-motion` não existe em CSS nenhum do app.** `globals.css:72` tem `scroll-behavior: smooth` sem guarda, e a Fase 1 introduz o controle que mais o dispara.
- **R-BUILD-7 é insatisfazível como escrito, e é da Fase 2.** 45 das 53 builds não têm `nextUpgrade` no tier `bis` (273 de 318 tiers têm; as 45 lacunas são todas em `bis`). O `<summary>` é desenhado para tolerar a ausência, e o número vai para a Fase 2.

---

## 4. Arquitetura

### 4.1 A fronteira

```
BuildPage (Server)
├─ PageHeader (Server)                      page.tsx:135-159
├─ <TierSelector/>          ← 'use client'  ÚNICA ilha nova
├─ callout gatedBy (Server)                 :168-178
├─ Section "Como se joga" (Server)          :180
│  … nove seções Server inalteradas …
└─ Section id="gear" (Server)               :461
   └─ GearProgression (Server)
      ├─ nav de tiers (espelho de navegação, sticky só ≥640 px)
      ├─ seis <section> wrapper, cada uma com <details> + <ul> de preview
      └─ <TierPreferenceScript/> (Server)   um <script> inline, ÚLTIMO filho
```

Todo o conteúdo dos tiers permanece no servidor. A ilha recebe apenas props serializáveis (seis registros `{slug, label, short, from, to}` e as strings de dicionário); **não** recebe `children` e **não** renderiza os `<details>`. Garantido pelo framework (`05-server-and-client-components.md:182`) e verificado por `client-boundary.test.ts`, que varre os chunks construídos procurando strings do corpus.

### 4.2 Por que a ilha não controla `open`

`components/layout/mobile-navigation.tsx:89-108` documenta uma tentativa anterior neste repositório. Em resumo (o comentário é longo; isto é paráfrase, não citação): a primeira versão do menu guardava `open` em `useState` e renderizava `<details open={open}>`, e o gate pegou — "Escape fecha o menu" falhava enquanto "Escape devolve o foco" passava, nos dois idiomas. A causa é que **`toggle` é assíncrono**: a plataforma o enfileira em vez de disparar durante o toque, então entre abrir o menu e a próxima tarefa o DOM diz aberto e qualquer cópia React ainda diz fechado. O arquivo conclui que o elemento é a fonte única da verdade ali, em vez de um espelho dela.

Repetir isso reabriria um bug fechado. Além disso R-BUILD-3 e R-BUILD-5 tornam os tiers **não exclusivos**, o que obrigaria o React a espelhar seis booleanos que o usuário muda sem o React ouvir até o `toggle` chegar. **A ilha muta `element.open` imperativamente.**

### 4.3 Os dois caminhos de aplicação

| Caminho | Quando | O que faz |
|---|---|---|
| **Script inline** (Server Component, último filho de Gear) | durante a parse, **antes da primeira pintura** | estado dos seis `<details>` + realinhamento do hash |
| **`useLayoutEffect`** (ilha cliente) | depois do commit, **antes da pintura** | troca `<a>`→`<button>`, `aria-pressed`, rótulo, ações, live region |

Ambos chamam a mesma `applyTierState(doc)` idempotente de `lib/prefs.ts`.

**`useLayoutEffect`, não `useEffect`, e o motivo é a navegação soft.** Numa navegação `<Link>` de `/builds` para a build — o caminho mais comum de todos, a jornada J1→J3 — o script inline **não roda** (o próprio doc do Next: *"Scripts inserted via DOM updates don't execute in the browser"*). O React renderiza o payload RSC, que carrega os seis `<details open>` incondicionalmente, porque é isso que R-BUILD-12 exige. Com `useEffect`, o navegador **pinta ~16.458 px de gear expandido** e só depois colapsa. `useLayoutEffect` roda depois do commit e antes da pintura, então o colapso é invisível.

**Por que o script inline continua necessário** mesmo com o colapso sendo invisível no caso comum: sem hash, o Gear começa ~11.200 px abaixo da dobra e o colapso não é visto. **Com hash, é.** O navegador salta para `#gear-budget` durante a parse; um colapso posterior à pintura remove ~13.000 px acima do leitor. O script fecha isso por construção e é o padrão documentado do Next 16.3.3 instalado (`preventing-flash-before-hydration.md`, cujo exemplo trabalhado é um accordion `<details>` persistido em `localStorage`).

`next/script` não serve: `beforeInteractive` exige o root layout e não bloqueia a hidratação. O helper `InlineScript` do doc não é necessário: ele existe porque o script do exemplo é renderizado por um *Client* Component; o nosso é de Server Component e por isso nunca é reexecutado numa navegação soft — que é o comportamento desejado.

`suppressHydrationWarning` vai em cada `<details>`: sem ele, um mismatch faria o React re-renderizar a partir do boundary e **descartar o trabalho do script**.

### 4.4 O módulo único de preferência

`lib/prefs.ts` — cliente-seguro, sem efeito colateral no import, sem import proibido.

```ts
export const PREF_KEYS = ["d2rc.tier", "d2rc.compact", "d2rc.leveling.<class>", "d2rc.level"] as const;
export const IMPLEMENTED_PREF_KEYS = ["d2rc.tier"] as const;   // a Fase 1 escreve SÓ esta
export const TIER_KEY = "d2rc.tier";

export function isTier(v: unknown): v is ProgressionTier;
export function readTier(): ProgressionTier | null;            // nunca lança, nunca escreve
export function writeTier(t: ProgressionTier): boolean;
export function clearTier(): boolean;

export function tierAnchorId(t: ProgressionTier): string;      // "gear-budget"
export function tierAnchorHref(t: ProgressionTier): string;    // "#gear-budget"
export function tierFromHash(hash: string): ProgressionTier | null;

export type TierSource = "hash" | "preference" | "none";
export function resolveActiveTier(i: { hash: string; stored: string | null }):
  { active: ProgressionTier | null; source: TierSource; preferred: ProgressionTier | null };

export function applyTierState(doc: Document): { active: ProgressionTier | null; source: TierSource };
export function tierBootScript(): string;                      // a FONTE do script inline
export function anchorOffsetPx(viewportWidth: number): number; // 112 a partir de 640, 72 abaixo
```

`anchorOffsetPx` é condicional à largura de propósito: a partir de 640 px o espelho sticky existe e o offset é header 57 + espelho ~40 + margem = **112**; abaixo de 640 px §8.1 remove o espelho, e um offset de 112 deixaria ~40 px de espaço morto acima da âncora — exatamente o sintoma que §3.6 existe para corrigir. Abaixo de 640 px o valor é **72** (header 57 + margem 15).

Quatro decisões com peso:

1. **O `try` envolve o acesso à propriedade, não só a chamada.** Ler `window.localStorage` já lança `SecurityError` com dados de site bloqueados. `globalThis.localStorage?.getItem(k)` devolve `undefined` no Node, então importar no servidor é seguro e nada no escopo do módulo toca armazenamento.
2. **Ler nunca escreve e nunca apaga.** É gate: `mobile-navigation.test.ts:383` já afirma armazenamento vazio depois de navegar.
3. **Valor inválido é ignorado e mantido, não apagado.** R-PREF-1 diz "ignorado"; ignorar não é apagar, e uma leitura que apaga dado do usuário é efeito colateral. Inválido = qualquer coisa que não seja exatamente um dos seis slugs canônicos.
4. **`tierBootScript()` devolve a string exata injetada**, o que a torna testável em `check` sem build e dá à "lista vigiada" de R-BUILD-10 uma definição legível por máquina.

O id `gear-<tier>` nunca é codificado à mão: produtor e consumidor passam por `tierAnchorId()`.

### 4.5 O que a arquitetura deliberadamente não faz

Sem query string, sem `useSearchParams`, sem cookie, sem backend, sem `cookies()`/`headers()`. `dynamicParams = false` (`layout.tsx:83`) permanece; todas as páginas continuam pré-renderizadas; o sitemap não enumera fragmentos. Um cookie foi considerado e recusado — o próprio doc do Next avisa que lê-lo no root layout tira a aplicação inteira da pré-renderização estática.

---

## 5. Markup

### 5.1 O seletor — HTML servido (sem JS)

```html
<div>
  <p id="tier-picker-legend">Onde você está?</p>
  <nav aria-labelledby="tier-picker-legend"
       class="mt-3 -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
    <a href="#gear-nightmare" data-tier="nightmare" class="tier-chip shrink-0">
      <span aria-hidden="true" class="font-mono text-xs text-ember">02</span>
      <span class="font-display text-sm sm:hidden">NM</span>
      <span class="font-display text-sm sr-only sm:not-sr-only">Nightmare</span>
      <span class="text-xs text-ink-subtle">Níveis 30–60</span>
    </a>
    <!-- ×6, na ordem canônica de lib/labels.ts:81-88 -->
  </nav>
</div>
```

- Sem `aria-pressed`, sem "Meu tier", sem "Ir para o equipamento", sem "Limpar". R-PREF-4 e R-BUILD-12 satisfeitos por construção.
- **A legenda é um `<p>`, nunca um heading** — R-BUILD-3 exige a lista de `h2`/`h3` inalterada.
- **`shrink-0` é obrigatório.** Num contêiner flex, itens encolhem abaixo da largura do conteúdo e o texto quebra no meio da palavra. `gear-progression.tsx:37` já começa com `shrink-0` pelo mesmo motivo, e o commit `6c54ef4` ("Add variant F, which stops breaking names at 200% text") é a lição mais recente do repositório sobre exatamente isto.
- **Quando a forma curta e a longa são iguais, renderiza-se um único span sem alternância responsiva.** Em en-US `budgetLabel`/`budgetShort` são ambos "Budget" e `optimizedLabel`/`optimizedShort` ambos "Optimized"; em pt-BR isso vale para `starter` ("Início"), `budget` ("Econômico") e `optimized` ("Otimizado"). Renderizar os dois spans faria um leitor de tela em pt-BR ouvir "Econômico Econômico Níveis 75–85". A regra é:

  ```
  label === short  →  <span class="font-display text-sm">{label}</span>          (um span, sempre visível)
  label !== short  →  <span class="font-display text-sm sm:hidden">{short}</span>
                      <span class="font-display text-sm sr-only sm:not-sr-only">{label}</span>
  ```

  Suprimir apenas o span longo e deixar o curto com `sm:hidden` deixaria três chips **sem rótulo visível a partir de 640 px** — que é o que a versão anterior desta regra fazia.

### 5.2 O seletor — depois do enhancement

```html
<p id="tier-picker-legend">Meu tier: Econômico · Níveis 75–85</p>
<div role="group" aria-labelledby="tier-picker-legend">
  <button type="button" data-tier="budget" aria-pressed="true"  aria-current="location" tabindex="0">…</button>
  <button type="button" data-tier="bis"    aria-pressed="false" tabindex="-1">…</button>
  <!-- os seis, cinco com aria-pressed="false" -->
</div>
<p>
  <a href="#gear-budget">Ir para o equipamento</a>
  <button type="button" aria-label="Limpar meu tier">Limpar</button>
</p>
<p class="sr-only" role="status" aria-live="polite"></p>
```

- **`role="group"`, não `tablist` nem `radiogroup`.** R-BUILD-11 proíbe `role=tab`; um `radiogroup` implicaria painéis mutuamente exclusivos, que os seis `<details>` não são.
- **Os seis carregam `aria-pressed`**, cinco `false`. Marcar só um faria a tecnologia assistiva anunciar os outros como botão comum.
- **A legenda é o nome do grupo, não a live region.** Uma região `sr-only` separada é escrita **só na ativação pelo usuário** — carregar com preferência não anuncia.
- **"Limpar" é exigido pela Fase 1** por R-PREF-3, que vive em §6.4 e é fácil de perder.

### 5.3 A troca `<a>` → `<button>` sem mismatch

```
render do servidor    →  <a href="#gear-…"> ×6 dentro de <nav>
1º render do cliente  →  idêntico (estado inicial `enhanced: false`)
hidratação            →  bate; zero mismatch
useLayoutEffect       →  setEnhanced(true)   (flush síncrono, antes da pintura)
2º render             →  <button aria-pressed> ×6 dentro de <div role="group">
```

O React compara apenas o **primeiro** render do cliente contra o HTML; o efeito roda depois do commit, então a troca é atualização de estado normal. `<a>` e `<button>` recebem métricas de caixa idênticas, de modo que a troca contribui 0 para o CLS.

**Rejeitados:** renderizar os dois e esconder um por CSS (viola §1.5 #9 e duplica seis nomes acessíveis); `<a href>` com `role="button"` + `aria-pressed` (`aria-pressed` é inválido em link; `role=button` tira o elemento da lista de links e quebra a ativação por Espaço).

### 5.4 O tier compacto

```html
<section id="gear-budget" class="scroll-mt-16 rounded border border-border p-3" aria-labelledby="gear-budget-heading">
  <details data-tier="budget" class="group peer" open suppressHydrationWarning>
    <summary>
      <span aria-hidden="true" class="font-mono text-xs text-ember">04</span>
      <h3 id="gear-budget-heading" class="font-display text-lg">Econômico</h3>
      <span class="badge">Níveis 75–85</span>
      <span class="ml-auto text-xs text-ink-subtle">
        <span class="group-open:hidden">Expandir ▾</span>
        <span class="hidden group-open:inline">Recolher ▴</span>
      </span>
      <span class="mt-1.5 block text-sm leading-snug text-ink-muted"><RichText>{goal}</RichText></span>
    </summary>
    …corpo completo do tier, exatamente como hoje (gear-progression.tsx:77-126)…
  </details>

  <ul class="peer-open:hidden mt-3">
    <li class="flex gap-2 text-sm">
      <span class="w-20 shrink-0 text-xs uppercase text-ink-subtle">Elmo</span>
      <span class="truncate">Harlequin Crest</span>
    </li>
    <!-- uma por ENTRADA de slots[], na ordem autoral, keyed por índice -->
  </ul>
</section>
```

Sete decisões, cada uma com o motivo:

1. **Cada par `<details>` + `<ul>` vive dentro do seu próprio `<section>` wrapper. Isto não é estilo: sem o wrapper o mecanismo está errado.** Tailwind 4.3.3 compila a variante `peer` como `&:is(${b} ~ *)` — **irmão geral**, não adjacente (verificado em `node_modules/tailwindcss/dist/lib.js`). Com os doze elementos como irmãos num só contêiner, abrir o tier 1 casaria `#gear-starter[open] ~ ul` contra os previews dos tiers 2 a 6 e **esconderia os cinco**, quebrando "ainda visível quando fechado" de R-BUILD-5 na maioria dos carregamentos. O wrapper restringe o `~` ao par. Ele também devolve os cinco vãos (em vez de onze) que §3.4 conta, e preserva os seis `role="region"` nomeados que o markup de hoje tem (`gear-progression.tsx:46-51`) e que a versão anterior deste plano apagava sem contabilizar como perda.
2. **O preview fica fora do `<details>`, escondido por CSS.** A restrição de R-BUILD-5 é "**ainda visível quando fechado**", não "dentro do `<summary>`". Dez linhas de slot dentro do `<summary>` virariam o *nome acessível* do disclosure: ~50 palavras a cada foco e a cada passagem do rotor. Um nome que é uma lista não é um nome. Também fecharia a porta para R-BUILD-13 e para os marcadores da Fase 2, porque um link dentro de `<summary>` tem conflito de ativação.
   **Custo assumido:** as linhas de preview não fazem parte do alvo de toque. Mitigação: o `<summary>` tem ~80 px e largura inteira; a afordância fica à direita do cabeçalho, logo acima do preview; as linhas não têm sublinhado nem cursor de ponteiro. Se o UAT mostrar gente tocando no preview, a alternativa medida é movê-lo para dentro e aceitar o nome longo.
3. **Só conteúdo de frase e de heading dentro do `<summary>`.** O modelo de conteúdo de `summary` é *phrasing content, optionally intermixed with heading content* — o `<h3>` é conforme, um `<div>` ou um `<p>` não são. Daí `<span class="block">` no lugar do `<p>`.
4. **O objetivo passa por `RichText`.** `gear-progression.tsx:73` já faz isso, e dois objetivos carregam `**` nos dois idiomas (`phoenix-strike/optimized` entre eles). Sem `RichText`, `**` vaza como texto literal e `raw-markup.test.ts` fica vermelho.
5. **Sem `name=` nos `<details>`.** O accordion exclusivo nativo fecharia cinco dos seis `<details open>` **já na parse, mesmo sem JavaScript**, quebrando R-BUILD-12.
6. **A afordância alterna "Expandir"/"Recolher"** por `group-open:`, e **o `<details>` carrega `group` além de `peer`**. Tailwind compila `group-*` como `&:is(:where(.group):is([open], …) *)`: sem a classe `group` num ancestral, os dois spans ficam inertes — "Expandir" apareceria sempre e "Recolher" nunca. É a mesma classe de erro de mecanismo do item 1 desta lista, e o repositório já tem o pareamento certo em `mobile-navigation.tsx:141` (`className="group relative …"`) com `:161` (`group-open:rotate-180`). **C28 afirma a alternância**, porque sem isso o HTML servido — onde os seis estão abertos — diria "Expandir" seis vezes sobre tiers expandidos: uma afirmação estática que a própria página contradiz, exatamente a classe de defeito que a Fase 0A levou a zero.
7. **Uma linha por *entrada* de `slots[]`, na ordem autoral, keyed por índice — nunca um `Map` por slot.** `blade-fury` lista `weapon` duas vezes no tier `budget` (sancionado por `check-content.ts:761`), o que já é chave React duplicada em `gear-progression.tsx:80`. Um resumo keyed por slot perderia uma linha em silêncio.

`charms` e `weaponSwap` **não aparecem no preview**: R-BUILD-5 diz "uma linha por **slot**", e eles são blocos suplementares, não `GearSet.slots`. Ficam no corpo expandido. (São 242 e 165 dos 318 tiers — 76% — então isto precisa estar dito, não é caso de borda.)

---

## 6. Estados e eventos

Definições: **preferida** = o valor válido em `d2rc.tier`. **ativa** = o tier do hash se válido, senão a preferida. `aria-pressed="true"` acompanha a **preferida**; `aria-current="location"` acompanha a **expandida**; o estado de rolagem (R-BUILD-4) é visual, sem ARIA.

Essa atribuição é a única que deixa R-BUILD-3 e R-BUILD-11 verdadeiros ao mesmo tempo: se `aria-pressed` seguisse o hash, um carregamento sem preferência **com** hash teria `aria-pressed="true"` e violaria o aceite de R-BUILD-3.

| # | Carregamento / evento | `<details open>` | Rótulo | `aria-pressed` | `aria-current` | "Ir p/ equipamento" | Escreve? | `scrollY` |
|---|---|---|---|---|---|---|---|---|
| 1 | Sem JS, qualquer URL | os seis | — | nenhum | nenhum | ausente | não | só âncora nativa |
| 2 | JS, sem pref, sem hash | nenhum | "Onde você está?" | nenhum `true` | nenhum | oculto (espaço reservado) | não | inalterado |
| 3 | JS, sem pref, hash válido | só o do hash | "Onde você está?" | nenhum `true` | o do hash | → `#gear-<hash>` | não | âncora nativa + realinhamento único |
| 4 | JS, sem pref, hash inválido | nenhum | "Onde você está?" | nenhum `true` | nenhum | oculto | não | inalterado |
| 5 | JS, pref, sem hash | só o preferido | "Meu tier: X · Níveis a–b" | o preferido | o preferido | → `#gear-<pref>` | não | **inalterado** |
| 6 | JS, pref, hash = pref | só o preferido | "Meu tier: X …" | o preferido | o preferido | → `#gear-<pref>` | não | âncora nativa |
| 7 | JS, pref, hash ≠ pref | **só o do hash** | "Meu tier: X …" | o preferido | **o do hash** | → `#gear-<hash>` | não | âncora nativa + realinhamento |
| 8 | JS, valor inválido gravado | nenhum | "Onde você está?" | nenhum `true` | nenhum | oculto | não (mantém) | inalterado |
| 9 | Ativar um controle não pressionado | só esse | "Meu tier: X …" | esse | esse | → `#gear-<X>` | **sim, uma vez** | **inalterado** |
| 10 | Ativar o controle **já pressionado** | reexpande esse | inalterado | inalterado | esse | inalterado | **não** (idempotente) | inalterado |
| 11 | Ativar "Ir para o equipamento" | inalterado | inalterado | inalterado | inalterado | inalterado | não | salto de âncora nativo |
| 12 | Ativar um `<summary>` direto | esse alterna; os outros intactos | inalterado | inalterado | inalterado | inalterado | **não** | **pode mudar** (ver §7) |
| 13 | "Limpar" | fecha o expandido | volta a "Onde você está?" | nenhum `true` | nenhum | oculto | **apaga a chave** | inalterado |
| 14 | `hashchange` → tier válido | só esse | inalterado | inalterado | o novo | → o novo | não | nativa |
| 15 | `hashchange` → vazio/inválido | **inalterado** | inalterado | inalterado | **segue o expandido**, não a preferida | segue o expandido | não | inalterado |
| 16 | Voltar/Avançar entre páginas (bfcache) | como restaurado | como restaurado | como restaurado | como restaurado | como restaurado | não | restaurada |
| 17 | Navegação soft de `/builds` | aplicado no `useLayoutEffect`, antes da pintura | conforme 2/5 | idem | idem | idem | não | inalterado |

Quatro linhas precisam de justificativa:

- **Linha 10 é idempotente, não destrutiva.** Uma versão anterior deste plano fazia a reativação *limpar* a preferência. Isso é uma invenção — R-BUILD-2 define seleção como gravar e expandir, e nada no PRD torna a reativação destrutiva — e é ativamente nociva no estado da linha 7, onde o chip pressionado (`budget`) não é o expandido (`optimized`): tocar em `budget`, o gesto óbvio para "mostre meu tier de novo", apagaria a preferência. "Limpar" (linha 13) é o único caminho de limpeza, e é o que R-PREF-3 pede.
- **Linha 12 não promete `scrollY` estável.** Abrir um `<summary>` do tier 2 enquanto se lê o tier 5 reflui ~3.000 px **acima** da viewport, o *scroll anchoring* do Chrome dispara e `scrollY` **muda** — de propósito, para manter o leitor no lugar. O invariante real é *posição visual preservada*, não `scrollY` constante. Dizer o contrário seria escrever um aceite que falha por comportamento correto do navegador.
- **Linha 12 também não grava.** Abrir não é escolher: R-BUILD-3 garante que todo tier pode ser expandido, R-BUILD-2 diz que *selecionar* grava. O leitor que abre um segundo tier para comparar (J5) fica com os dois abertos.
- **Linha 15 mantém `aria-current` no tier expandido.** A versão anterior mandava `aria-current` voltar à preferida enquanto o `<details>` expandido continuava sendo o do hash — os dois apontariam para tiers diferentes. `aria-current="location"` significa "o item que corresponde à localização atual"; a localização visível é o tier aberto.

---

## 7. Nenhum deslocamento automático

| # | Caminho | Como fecha |
|---|---|---|
| 1 | Ação padrão de âncora nos chips | **Estrutural**: depois do enhancement são `<button type="button">` sem `href`. Não há `preventDefault()` a esquecer. |
| 2 | Interceptação do `<Link>` | Os chips, as âncoras da nav e "Ir para o equipamento" são `<a>` cru. Next **não** intercepta `<a href="#hash">`; intercepta `<Link>` e roda o próprio `scrollIntoView`. Gate de higiene proíbe `<Link>` com href de fragmento nesses componentes. |
| 3 | `<details>` alternando acima da viewport | **O controle sticky dentro de Gear é espelho de navegação: navega e reflete, não grava nem expande.** Se gravasse, selecionar o tier 2 lendo o tier 5 refluiria ~3.000 px acima da viewport e o scroll anchoring moveria `scrollY` — o gate falharia por comportamento do navegador, não por código nosso. Isto é um **desvio da letra de R-BUILD-4** ("o controle é repetido"), registrado como tal em §14. |
| 4 | `element.focus()` | Sempre `focus({ preventScroll: true })`. Nunca focar um `<details>`, um `<summary>` ou uma seção após a seleção. |
| 5 | `scrollIntoView` | **Banido no código da Fase 1**, inclusive `{block:'nearest'}`. Centrar o chip ativo é `container.scrollLeft = …` aritmético, horizontal e local ao contêiner. O realinhamento da linha 3/7 usa `window.scrollTo` com `anchorOffsetPx(window.innerWidth)` (§4.4) — nunca uma constante, porque abaixo de 640 px o valor é 72 e não 112. |
| 6 | **Hash no load + colapso** | O script inline roda **antes da pintura**, então o colapso acontece antes de o navegador assentar o salto; em seguida realinha **uma vez**, com `behavior:'auto'`, guardado por sinalizador. R-BUILD-2 sanciona: "o único deslocamento é o nativo do navegador para a âncora". |
| 7 | Restauração de scroll no reload | Não combatida. O offset é do navegador, não nosso; §6.1 fala do que *nós* deslocamos. Medido e publicado. |
| 8 | bfcache | Página restaurada intacta, efeitos não re-rodam. Caso de regressão no gate. |
| 9 | `scroll-behavior: smooth` sem guarda (`globals.css:72`) | Torna a asserção de `scrollY` corrida: o gate amostra duas vezes com 200 ms e exige estabilidade. Também é violação de R-A11Y-6 → um bloco `@media (prefers-reduced-motion: reduce)`. |
| 10 | Live region crescendo | É `sr-only`, fora de fluxo, tamanho zero. |
| 11 | Clicar botão parcialmente fora da tela | Só alcançável pelo sticky, que (3) tira do caminho de seleção. |
| 12 | Setas do teclado na linha rolável de chips | `focus({preventScroll:true})` + `scrollLeft` aritmético tocam só o scroller da linha, nunca o documento. |
| 13 | **Abrir um `<summary>` acima da viewport** | **Não fecha, e não deve.** É o caminho da linha 12 de §6: o scroll anchoring muda `scrollY` de propósito para manter o leitor no lugar. O invariante afirmado é *posição visual*, não `scrollY`. |

**Por que os doze primeiros valem para o controle do topo, estruturalmente e não por sorte:** ele fica a ~465 px e **não é sticky em nenhuma largura** (§8.1), então qualquer tier que ele abra ou feche está milhares de pixels **abaixo** da viewport em todos os estados, e o scroll anchoring só dispara em deslocamentos *acima* da âncora.

**Forma do gate:** grava `scrollY` → clique real nas coordenadas do chip (`Page.click`) → `waitFor` `aria-pressed="true"` → duas amostras estáveis com 200 ms → afirma igualdade, e também `documentElement.scrollLeft === 0`.

---

## 8. Responsividade, acessibilidade e idiomas

### 8.1 Por largura

- **< 640 px:** chips com rolagem horizontal (`-mx-5 … overflow-x-auto px-5`), `shrink-0` em cada um, fade por `mask-image` só quando `scrollWidth > clientWidth`, chip ativo centralizado por `scrollLeft` aritmético. **Nenhum elemento sticky além do header** — exige tornar `gear-progression.tsx:31` `sm:sticky sm:top-14`.
- **≥ 640 px:** chips quebram em linha (`sm:flex-wrap`) — 2 linhas de 3 entre 640 e 1023, linha única a partir de 1024. O controle do topo **não é sticky em nenhuma largura**; o espelho dentro de Gear é, a `sm:top-14`.

Geometria do chip: três linhas, `px-3 py-2`, `min-w-[5.5rem]`, `min-h-[2.75rem]`, sem altura fixa → ≈102 × 64 px, passando os **44 px nos dois eixos** que R-A11Y-4 exige de um controle primário.

**O espelho dentro de Gear não recebe `data-tier`.** Ele mantém a forma de link de uma linha que já tem (`px-3 py-1.5`, ~32 px de altura). Consequências, ditas: C15 exige ≥44 px de `[data-tier]`, então o espelho fica fora dessa asserção — e fica, porque crescê-lo a 44 px empurraria header + sticky para ~117 px, além do teto de 112 px de R-A11Y-8 que §8.1 se impõe. O espelho continua sujeito ao mínimo geral de 24 px, que já cumpre.

### 8.2 Os rótulos cabem

Maior rótulo em qualquer idioma: **`Início do Hell`** (pt-BR, 14 caracteres) ≈105 px de texto + padding ≈129 px de chip. Ele só é desenhado a partir de `sm`, onde há ≥576 px — **cabe com folga**. Abaixo de `sm` o desenhado é `earlyHellShort` = "Hell". A 200% de *texto*, a forma longa ≈234 px, ainda dentro dos 280 px úteis de 320 px. **Nenhum rótulo precisa truncar em nenhuma largura, em nenhum dos dois idiomas.**

| Largura | Útil | Linha de rótulos longos (814) | Linha de curtos (652) | Resultado |
|---|---|---|---|---|
| 320 | 280 | — | 652 | rola horizontalmente; fade + centragem |
| 390 | 350 | — | 652 | rola horizontalmente |
| 640 | 576 | 814 | — | quebra em 2 linhas de 3 |
| 768 | 704 | 814 | — | 2 linhas de 3 |
| 1280 | 960 | 814 | — | linha única |

### 8.3 Zoom: duas coisas diferentes

Adotada a distinção do protótipo da Fase 0B: **zoom de página** (WCAG 1.4.10) reduz a largura CSS — 200% em 1280 = 640 px, 400% = 320 px, ambas na tabela; **texto ampliado** (WCAG 1.4.4) leva o corpo da raiz a 200% sem mudar a largura, medido à parte. **`640` falta em `viewport.test.ts:71` e entra nesta fase** — é a largura do gate de R-A11Y-7 e o breakpoint de R-BUILD-4.

### 8.4 Teclado e leitor de tela

| Tecla | Comportamento |
|---|---|
| Tab | Uma parada no grupo (roving tabindex): o chip pressionado, ou o primeiro. Depois → "Ir para o equipamento" → "Limpar". Sem JS: seis paradas de link. |
| ← / → | Movem o foco no grupo, com volta nas pontas. `focus({ preventScroll: true })` + centragem por `scrollLeft`. **Focar nunca grava e nunca expande.** |
| ↑ / ↓ | Não vinculadas — brigariam com a rolagem da página. |
| Home / End | Primeiro / último chip. |
| Enter / Espaço | Ativa. `<button type="button">` dá as duas nativamente. |
| Escape | **Nada na Fase 1 precisa. Não adicionar handler** — já existem dois no documento. |
| `<summary>` | Nativo: Tab, Enter/Espaço, `aria-expanded` da plataforma. **Nunca escrever `aria-expanded` à mão.** |

Anúncio na seleção confirmada (região `sr-only`, só na ativação, nunca no load nem ao mover foco): en-US `My tier: Budget, levels 75–85.` · pt-BR `Meu tier: Econômico, níveis 75–85.`

Foco visível já é global e já é 2 px ember (`globals.css:91-94`); R-A11Y-2 não pede CSS novo.

**A Fase 1 não usa `focus-trap` nem `scroll-lock`.** R-BUILD-9 tem duas cláusulas e a segunda ("o sumário vira sheet") depende de R-BUILD-8, que §14 do PRD lista em "**Fora:** … sumário". `mobile-navigation.tsx:38-42` já registra a regra: *"This is a disclosure, not a modal."*

### 8.5 Dicionários

Novo sub-objeto `builds.tierPicker.*`. **Os dois arquivos mudam no mesmo commit** (R-I18N-8).

| Chave | en-US | pt-BR |
|---|---|---|
| `legend` | `Where are you?` | `Onde você está?` |
| `myTier` | `My tier: {tier} · Levels {from}–{to}` | `Meu tier: {tier} · Níveis {from}–{to}` |
| `announce` | `My tier: {tier}, levels {from}–{to}.` | `Meu tier: {tier}, níveis {from}–{to}.` |
| `goToGear` | `Go to the gear` | `Ir para o equipamento` |
| `clear` | `Clear` | `Limpar` |
| `clearLabel` | `Clear my tier` | `Limpar meu tier` |
| `expand` | `Expand` | `Expandir` |
| `collapse` | `Collapse` | `Recolher` |

Reusados sem mudança: `builds.levelsRange`, `builds.gearTiersNav`, os doze `tiers.*Label`/`*Short`, os dez `gearSlots.*`. Nenhum par novo fica byte-idêntico EN/PT, então **`docs/adr/0003` não precisa de edição**.

**Desvio deliberado de R-I18N-4.** O requisito manda a forma longa para o `aria-label`. Literalmente, isso quebra **WCAG 2.5.3 (Label in Name)**: "NM" não está contido em "Nightmare, levels 30–60", então comando de voz falha. A composição por conteúdo põe a forma longa no nome acessível **e** mantém o texto visível dentro dele. Precedente da casa: `mobile-navigation.tsx:158` (`sr-only sm:not-sr-only`, sempre no nome acessível). *(`site-header.tsx:91` usa `hidden … sm:inline`, que é o arranjo oposto e não serve de precedente aqui.)*

---

## 9. Testes

### 9.1 O que o harness tem, e o que falta

**Tem:** driver CDP real (`scripts/headless.ts`) com `setViewport`, `setScriptsEnabled(false)`, `click`, `press`, `evaluate`, `waitFor`, e `drainConsole()` — que é como um mismatch de hidratação é pego, porque ele é só um erro de console. `assertFreshBuild()` recusa julgar build velho. `D2R_BUILD_ROOT` / `D2R_CHUNK_DIR` existem para apontar um gate a uma cópia corrompida.

**Não tem, e a fase constrói:** medição de CLS; asserção de `scrollY`; manipulação de `localStorage`; medição de altura de elemento; lista vigiada de scripts inline; `640` nas WIDTHS.

**`scripts/headless.ts` ganha dois métodos, e só dois.** A versão anterior deste plano dizia que o arquivo não seria tocado, com uma justificativa errada (alegava que um `PerformanceObserver` instalado depois do `navigate` perderia o shift — falso para `layout-shift`, que é bufferizado: `observe({type:'layout-shift', buffered:true})` recebe o backlog, e é assim que `web-vitals` funciona). Mas dois testes **genuinamente** precisam de acesso que a classe não expõe, porque `send()` é `private` (`headless.ts:279`):

| Método novo | CDP | Quem precisa |
|---|---|---|
| `addInitScript(source: string)` | `Page.addScriptToEvaluateOnNewDocument` | **C11** — o `localStorage` só pode ser feito lançar *antes* do script de boot rodar, o que é impossível com `evaluate` depois do `goto` |
| `axNodes()` | `Accessibility.enable` + `Accessibility.getFullAXTree` | **C6b** — a exposição do heading dentro de `<summary>` é um fato da árvore de acessibilidade, invisível no DOM |

São aditivos, não mudam nenhum caminho existente, e o commit que os introduz **re-roda todos os gates de navegador** para provar que nada regrediu. Escondê-los custaria dois testes reais; a alternativa honesta não é fingir que o arquivo não precisa mudar, é mudá-lo de forma mínima e provar que não quebrou.

### 9.2 Matriz de estados executável

O produto cartesiano das 17 linhas de §6 × 5 larguras × 2 idiomas × 53 builds é **9.010 células**. Colapsa para ~70 em quatro argumentos de independência: hash × preferência interagem só por uma regra pura (as 15 combinações viram teste unitário; 4 são distintas no navegador); largura não interage com a lógica; idioma interage com layout e texto; as 53 builds interagem só com layout.

| Célula | Descrição | 320 | 390 | 768 | 1280 | zoom | Idiomas | Builds | Linha de §6 |
|---|---|---|---|---|---|---|---|---|---|
| S1 | sem JS | ● | ● | ○ | ○ | ○ | ambos | **53** (arquivo) | 1 |
| S2 | JS, sem preferência | ● | ● | ● | ● | ● | ambos | 7 nomeadas | 2 |
| S3 | JS, preferência válida | ● | ● | ○ | ● | ○ | ambos | 7 nomeadas | 5 |
| S4 | preferência inválida | ○ | ● | ○ | ○ | ○ | en | 1 — **idêntico a S2** | 8 |
| S5 | localStorage lança | ○ | ● | ○ | ○ | ○ | en | 1 — **idêntico a S2**, zero erro de console | 8 |
| S6 | preferência + hash igual | ○ | ● | ○ | ○ | ○ | en | 1 | 6 |
| S7 | hash válido, sem preferência | ○ | ● | ○ | ● | ○ | ambos | 2 | 3 |
| S8 | hash inválido | ○ | ● | ○ | ○ | ○ | en | 1 | 4 |
| S9 | **hash válido + preferência conflitante** | ○ | ● | ○ | ● | ○ | ambos | 2 | 7 |
| S10 | hash inválido + preferência válida | ○ | ● | ○ | ○ | ○ | en | 1 | 8+5 |

Transições, 390 px, dois idiomas, 2 builds — **cada uma mapeada a uma linha de §6**: T1 selecionar (9) · T2 abrir um `<summary>` (12) · T3 reativar o pressionado (10) · T4 "Limpar" (13) · T5 ir para outra build · T6 trocar idioma · T7 Voltar/Avançar (16) · T8 recarregar · T9 `hashchange` (14, 15) · **T10 navegação soft de `/builds`** (17).

Toda linha de §6 tem célula ou transição; toda célula tem linha.

### 9.3 Testes, por requisito

| # | Requisito | Arquivo | Asserção | Gate |
|---|---|---|---|---|
| C1 | R-BUILD-12 | **novo** `build-tiers-html.test.ts` | 53 × 2: exatamente seis `<details … open>` dentro de `#gear`, no HTML sem scripts | `check:built` |
| C2 | R-BUILD-12 / R-I18N-2 | idem | seis âncoras `#gear-*` iguais a `tierOrder`, idênticas nos dois idiomas | idem |
| C3 | R-BUILD-12 / R-PREF-4 | idem | nenhuma string de preferência no markup **+ controle**: elas existem no payload, então a ausência é afirmação sobre markup | idem |
| C4 | R-BUILD-3/5 | **novo** `build-tier-state.test.ts` | presença: contagem de linhas de slot no DOM bate com o registro em S1–S10. **Mais uma asserção de visibilidade estritamente limitada ao `<ul>` de preview**: abrindo **`starter`, o primeiro tier** (nunca `bis` — com o último aberto o `~` não alcança irmão nenhum e a asserção passaria mesmo sem o wrapper, deixando M10 vacuosa), os outros cinco previews continuam visíveis | idem |
| C5 | R-BUILD-3 | idem, S2 | seis sem `open`, zero `aria-pressed="true"`, `scrollY` inalterado, URL inalterada | idem |
| C6 | R-BUILD-3 | idem | **fixture comprometida**: lista ordenada de `h2`/`h3` capturada do build atual em `2873b61`, por locale, nas 53 builds; o novo build é afirmado contra ela. A comparação no-JS-vs-enriquecido fica como checagem *adicional*, não a principal | idem |
| C6b | R-BUILD-3 / R-A11Y-3 | idem | `Accessibility.getFullAXTree` numa build por locale: os seis rótulos de tier continuam expostos **como heading** apesar de estarem dentro de `<summary>` | idem |
| C7 | R-BUILD-2 / R-PREF-1 | idem, T1 | antes 0 chaves; depois de um clique 1 chave, `d2rc.tier`, valor canônico | idem |
| C8 | R-BUILD-2 | idem | `scrollY` inalterado ao selecionar **no controle do topo**, com a página em `scrollY = 0` e levemente rolada; duas amostras estáveis | idem |
| C8b | R-BUILD-4 | idem | rolar até dentro de Gear, ativar o **espelho sticky**: ele **não** grava, **não** move `aria-pressed`, e o único deslocamento é o da âncora | idem |
| C9 | R-BUILD-2 | idem, S9 | `d2rc.tier="bis"` + `#gear-starter` → `starter` aberto, `bis` fechado, `aria-pressed` em `bis` | idem |
| C10 | R-PREF-1 | **novo** `prefs.test.ts` (puro) | 6 válidos + ≥8 inválidos; `#gear-early-hell` (o slug hifenizado é a armadilha); matriz 3×3 de `resolveActiveTier` | `check` |
| C11 | R-PREF-1 | `build-tier-state`, S5 | `setItem` lançando `SecurityError` → estado S2 **e** `drainConsole()` vazio | `check:built` |
| C12 | R-BUILD-10 | **novo** `build-cls.test.ts` | `PerformanceObserver({type:'layout-shift', buffered:true})`; `< 0,1` com preferência; **controle**: >0,1 numa página sintética que desloca | idem |
| C12b | R-BUILD-10 | idem | **navegação soft** `/builds` → build com preferência: CLS < 0,1 e nenhum quadro pintado com mais de um `<details open>` | idem |
| C13 | R-BUILD-5 / §12.1 | bloco de altura | as nove linhas de §3.4, marcadas afirma/publica; altura por tier contra `f(N, G)` nas 318 instâncias, **a 390 px e a 320 px, com a largura declarada em cada asserção** | idem |
| C14 | R-BUILD-1 | idem | **dois níveis (decisão do proprietário, §16.3).** Alvo: topo do controle renderizado ≤ **560** px a 320×640. Teto duro: ≤ **640** px nas 53 × 2 — acima disso o gate fica **vermelho** e a execução para antes do push. Entre 561 e 640 o gate fica **verde** e as páginas são **publicadas como excedentes do alvo**. Sem lista permanente de exceções | idem |
| C15 | R-A11Y-4 | estende `viewport.test.ts` | alvo efetivo ≥ 24 px geral; **≥ 44 px** para `[data-tier]` (o espelho não carrega `data-tier`, §8.1) | idem |
| C16 | R-A11Y-1 / R-BUILD-11 | novo bloco de a11y | Tab alcança o grupo em ordem visual; setas movem; Enter/Espaço selecionam; `aria-current="location"` no tier expandido em S3/S7/S9; **zero `role="tab"` na página** | idem |
| C17 | R-BUILD-4 / R-A11Y-8 | bloco de altura | a 320/390 o único `position: sticky` é o header; a ≥640 header + espelho ≤ 112 px | idem |
| C18 | R-BUILD-10 | C1 + higiene | nenhum `?tier=` em nenhum HTML; nenhum `<Link>` com href de fragmento nos componentes da fase | idem |
| C19 | R-BUILD-10 | **estende** `client-boundary.test.ts` | **a lista vigiada**: enumera scripts inline de primeira parte no HTML construído, allowlist para os do framework, e fixa a fonte do nosso contra `tierBootScript()` | idem |
| C20 | R-PREF-2 | `build-tier-state` | zero requisições de rede novas após selecionar | idem |
| C21 | R-PREF-3 | `prefs.test.ts` | chaves usadas ⊆ `PREF_KEYS`; varredura do repo por literais `d2rc.` fora da lista | `check` |
| C22 | R-I18N-1/2 | todos | todo teste percorre `LOCALES` | — |
| C23 | R-I18N-4/6 | estende `dictionary.test.ts` | pares curto/longo; nenhuma chave nova idêntica EN/PT fora da lista do ADR 0003 | `check` |
| C24 | 53 builds | C1 + uma passada headless | **todas as 53**, nunca `firstBuild(locale)` | ambos |
| C25a | R-BUILD-3 | **novo bloco em** `hygiene.test.ts` (fonte, sem navegador) | o código da fase nunca referencia `document.referrer`, `navigator.language`, `Accept-Language`, nem qualquer heurística de nível ou de URL de origem. **Prova que inferir é impossível**, que é mais forte do que observar que não inferiu | `check` |
| C25b | R-BUILD-3 | `build-tier-state` | sem preferência, nas duas rotas de idioma e em toda largura: sempre seis fechados, nenhum pressionado, rótulo em "Onde você está?" | `check:built` |
| **C26** | R-PREF-3 / §6 linhas 10 e 13 | idem | clicar um chip → 1 chave; clicar o **já pressionado** → ainda 1 chave, mesmo valor (idempotente); clicar "Limpar" → **0 chaves**, rótulo de volta, nenhum `aria-pressed="true"`, `scrollY` inalterado | idem |
| **C27** | §6 linha 12 | idem | abrir um `<summary>` acima da viewport: **posição visual preservada** (o `getBoundingClientRect()` do elemento em leitura não se move, lido por `page.evaluate` antes e depois) e **nenhuma escrita** — não `scrollY` constante | idem |
| **C28** | R-BUILD-5 / §5.4-6 | `build-tiers-html` + `build-tier-state` | **duas metades, porque a de texto sozinha é vacuosa.** Em `build-tiers-html` (lê arquivo): cada `<details>` carrega a classe `group` e os dois spans carregam `group-open:hidden` / `hidden group-open:inline` — os *seletores*, não o texto, porque os dois textos estão no HTML servido com ou sem `group`. Em `build-tier-state` (navegador, `setScriptsEnabled(false)` e depois com JS): `getComputedStyle().display` mostra "Recolher" num tier aberto e "Expandir" num fechado, nos dois idiomas | idem |

Ordem no `check:built`: os que leem arquivo entram cedo; os que sobem navegador entram no fim, junto de `test:viewport` — a cadeia é sequencial com `&&`.

### 9.4 Builds medidas no headless

`blade-fury` [5,8,10,11,10,10] · `blizzard-sorceress` [8,8,7,10,10,10] · `phoenix-strike` [10×6] · `fire-trapsin` [10×6] · `whirlwind-assassin` [6,8,10,10,10,10] · `tesladin` [4,4,6,9,10,10] · **`leap-attack-barbarian` [10×6]** (o máximo do catálogo, 24.531 px de não-Gear). Cada uma em en-US e pt-BR.

### 9.5 Mutations

`D2R_BUILD_ROOT` e `D2R_CHUNK_DIR` existem, documentados, para apontar um gate a uma cópia corrompida. Copiar `.next/server/app` para o scratchpad, mutar a cópia, rodar com a variável. **Nunca tocar no repositório.**

> ⚠️ `build-freshness.ts:59`: com `D2R_BUILD_ROOT` setado o teste de frescor é **pulado**. Variável esquecida faz todo `check:built` posterior julgar o mutante e reportar verde. Cada mutation roda em shell próprio e o plano confere `env | grep D2R_` depois.

| # | Mutação | Fica VERMELHO | Injeção |
|---|---|---|---|
| M1 | tiers servidos fechados | **C1** (6 → 0), C4 em S1 | `sed` na cópia |
| M2 | seleção chama `scrollIntoView` | **C8 e só C8** | worktree, rebuild |
| M3 | valor inválido aceito | **C10** (puro), C9, C11 | mutação em memória |
| M4 | hash deixa de vencer | **C9 e só C9** | worktree, rebuild |
| M5 | troca de idioma apaga a preferência | **T6** | worktree |
| M6 | conteúdo de tier sai do DOM | **C4 em todos os estados** — é o defeito D7 voltando | apagar o corpo na cópia |
| M7 | só uma build funciona | **C24**, e só se ele varrer as 53 | corromper um HTML pt-BR |
| M8 | um rótulo sem tradução | **C23** e **C3** | trocar o rótulo pt-BR |
| **M9** | `clearTier()` vira no-op | **C26** | worktree, rebuild |
| **M10** | remover o wrapper `<section>` de §5.4-1 | **C4** (asserção de visibilidade do preview) | worktree, rebuild |

Cada gate novo entrega o próprio controle anti-vacuidade, como `page-structure.test.ts:129-149` e `client-boundary.test.ts:142-166` já fazem.

---

## 10. Arquivos e propriedade

| Arquivo | Ação | Dono |
|---|---|---|
| `lib/prefs.ts` | novo | A1 |
| `components/game/tier-preference-script.tsx` | novo (Server) | A1 |
| `scripts/prefs.test.ts` | novo | A1 |
| `package.json` | alterar — registrar scripts | A1 |
| `components/game/tier-selector.tsx` | novo (`'use client'`) | A2 |
| `components/game/gear-progression.tsx` | alterar | A2 |
| `components/game/index.tsx` | alterar — dois exports | A2 |
| `app/[lang]/builds/[classSlug]/[slug]/page.tsx` | alterar | A2 |
| `lib/i18n/dictionaries/en-us.ts` + `pt-br.ts` | alterar — mesmo commit | A2 |
| `app/globals.css` | alterar — `prefers-reduced-motion` **e** `scroll-padding-top` `3rem` / `0.5rem` abaixo de `sm` (§3.6) | A2 |
| `scripts/build-tiers-html.test.ts` | novo | A3 |
| `scripts/build-tier-state.test.ts` | novo | A3 |
| `scripts/build-cls.test.ts` | novo | A3 |
| `scripts/heading-snapshot.json` | novo — fixture de C6, capturada em `2873b61` | A3 |
| `scripts/client-boundary.test.ts` | alterar — lista vigiada | A3 |
| `scripts/viewport.test.ts` | alterar — 640, alvo 44 px, alturas | A3 |
| `scripts/dictionary.test.ts` | alterar — pares curto/longo | A3 |
| `scripts/hygiene.test.ts` | alterar — proibir `<Link>` de fragmento (C18) | A3 |
| `scripts/headless.ts` | alterar — **só** `addInitScript()` e `axNodes()` (§9.1) | A3 |

**Contratos de coordenação:**
1. `package.json` é de A1; os outros pedem entradas.
2. `<TierPreferenceScript/>` é de A1 mas é **exportado** por `components/game/index.tsx`, que é de A2, e **colocado** por A2 como último filho de Gear, depois dos seis `<details>` — um script antes dos elementos não acha nada. A1 entrega o componente com nome estável e sem props; A2 exporta e coloca.
3. `gear-<tier>` nunca é codificado à mão: produtor e consumidor passam por `tierAnchorId()`. O offset de âncora passa por `anchorOffsetPx(width)`, nunca por um literal.
4. Os dois lados do offset de âncora (§3.6) mudam juntos: `scroll-mt-16` no tier (A2, `gear-progression.tsx`) e `scroll-padding-top` `3rem` com a media query de `0.5rem` abaixo de `sm` (A2, `globals.css`). Mesmo dono, mesmo commit, e `anchorOffsetPx()` tem de devolver a mesma soma.
5. Nenhum agente acrescenta casos de altura a `viewport.test.ts` fora do bloco de A3.

**Worktrees.** A análise correu com três agentes em paralelo, somente leitura, no worktree principal. A implementação usa **um worktree só, com propriedade estrita de arquivos, e o coordenador serializa todos os builds e gates** — dois builds no mesmo checkout se invalidam (`assertFreshBuild`). A memória do projeto registra que worktrees aqui exigem junction de `node_modules`, que removê-los pode apagar o `node_modules` real, e que um navegador apontado para dentro trava o diretório. A Fase 1 toca poucos arquivos fortemente acoplados. Desvio consciente da preferência por worktrees, registrado.

---

## 11. Commits

Pequenos, sem `git add -A`, sem amend, squash, rebase, reset destrutivo ou force push.

**Duas regras governam a sequência.**

*Primeira:* `check` e `check:built` são cadeias `&&`. Um gate vermelho no começo **impede os seguintes de rodar** — pior que vermelho, é não-executado. Por isso cada script novo entra em `package.json` como entrada `test:*` autônoma no commit 2, e só é **enfiado na cadeia** no commit que o deixa verde.

*Segunda:* isolar da cadeia **não** protege `lint` e `typecheck`, os dois últimos elos de `check`, porque `tsconfig.json` inclui `**/*.ts` — um teste que importa um módulo inexistente quebra o `typecheck` de qualquer jeito. Por isso o commit 2 traz `lib/prefs.ts` como **stub tipado**: as assinaturas reais de §4.4, com corpos que devolvem o zero *válido para cada tipo* — `null`, `false`, `""`, `0` para `anchorOffsetPx`, `{active:null, source:"none", preferred:null}` para `resolveActiveTier` e `{active:null, source:"none"}` para `applyTierState`. Os testes então falham por **comportamento**, que é o ponto do TDD, e não por compilação, que não prova nada.

1. **plano da Fase 1** — este documento.
2. **testes vermelhos** — `prefs.test.ts`, `build-tiers-html.test.ts`, `build-tier-state.test.ts`, `build-cls.test.ts`, `heading-snapshot.json` (capturado **antes** de qualquer mudança de markup), os dois métodos novos de `headless.ts`, e o **stub tipado** de `lib/prefs.ts`. Registrados como `test:*` autônomos, fora das cadeias. Cada um roda e falha por comportamento, e o log entra no commit. **Todos os gates de navegador existentes são re-rodados aqui** para provar que a mudança em `headless.ts` não regrediu nada.
3. **módulo de preferência** — o stub vira implementação real; `tier-preference-script.tsx`. `test:prefs` verde e entra em `check`.
4. **progressive enhancement** — `gear-progression.tsx` vira wrapper + `<details>` + preview; dicionários EN+PT (as chaves `expand`/`collapse` são usadas já aqui, então vêm neste commit, não no 5); script colocado. C1, C2, C3, C4, C6, C6b, **C28** verdes e entram em `check:built`.
5. **seletor e ações** — `tier-selector.tsx`, inserção em `page.tsx`, chaves restantes do dicionário. C5, C7, C8, C9, C11, C25b, C26 verdes e entram na cadeia.
6. **acessibilidade e responsividade** — chips roláveis com `shrink-0`, fade, centragem, sticky só ≥640 px, `prefers-reduced-motion`, offset de âncora nos dois lados (`3rem`/`0.5rem` + `scroll-mt-16`), 640 nas WIDTHS, alturas. C8b, C12, C12b, C13, C14, C15, C16, C17, C27 verdes e entram na cadeia.
7. **gates e mutations** — lista vigiada de scripts inline (C19), higiene de `<Link>` e de heurísticas de inferência (C18, C25a), rede (C20), chaves (C21), dicionário (C23), varredura das 53 (C24); relatório das dez mutations.
8. **documentação factual final** — números medidos, aritmética refeita, o que ficou fora e por quê.

---

## 12. Riscos e rollback

| Risco | Mitigação |
|---|---|
| `peer-open` esconder previews vizinhos | Wrapper por tier (§5.4-1) + a asserção de visibilidade de C4 + a mutation M10 |
| A meta de página de §12.1 não fechar | §3.4: aritmética refeita por tier, dívida atribuída onde ela está, alavancas nomeadas, folga residual publicada |
| ≤560 px falhar em 2 builds pt-BR | §3.5: medir o topo real do controle; alavancas nomeadas; lista de exceção nomeada e datada, afirmada contra valores medidos; pauta de J3 |
| Navegação soft pintar seis tiers abertos | `useLayoutEffect` (§4.3) + C12b |
| Hash + colapso aterrissar errado | Script antes da pintura + realinhamento único com `anchorOffsetPx(width)`; C9 e o gate de scroll |
| Scroll anchoring quebrar um gate | C8 mede só o controle do topo (estruturalmente seguro); C27 afirma posição visual, não `scrollY`, no caminho onde o anchoring é correto |
| Heading perdido dentro de `<summary>` | C6b, na árvore de acessibilidade, não no DOM |
| `mobile-navigation.test.ts:383` ficar vermelho | A fase só escreve em seleção explícita; o gate fica **inalterado** e é rodado para confirmar |
| Um gate de altura medir uma build só | C24 varre as 53; M7 prova que varre |
| `D2R_BUILD_ROOT` esquecido | Shell próprio por mutation; conferir `env` depois |
| Remoção do sticky abaixo de 640 px | Item explícito de UAT |
| Espelho fora da asserção de 44 px | Dito em §8.1 com o motivo (teto de 112 px); continua sob o mínimo de 24 px |

**Rollback.** Cada commit é reversível com `git revert`. Não há migração de dados, backend, mudança de URL nem de sitemap. Reverter os commits 3–7 devolve exatamente `2873b61`, porque nenhum conteúdo editorial muda e as seis âncoras nunca deixam de existir. Uma preferência já gravada vira chave órfã inerte, ignorada pela leitura protegida.

---

## 13. Publicação

Somente com todos os gates verdes, lendo o exit code de volta do log, sem pipe:

```
rm -rf .next
npm run predeploy > "$LOG" 2>&1; echo "EXIT=$?" >> "$LOG"; tail -1 "$LOG"
```

O build limpo é obrigatório: a memória do projeto registra um predeploy verde servindo artefato velho.

Depois: push normal de `main`, sem force; aguardar o deployment de produção **do SHA exato** via `gh api repos/fabiokyrillos/d2r-codex/deployments?sha=<SHA>`; validar o domínio público; conferir 8 classes, 53 builds, 240 skills, sitemap inalterado, zero localhost, e nenhuma regressão em filtros, menu, 404 ou árvore.

**A lista de exceção de C14, se existir, é apresentada na sessão J3 antes de a fase ser dada por fechada.**

---

## 14. Fora de escopo, registrado

- **R-BUILD-6, 7, 8** (comparação, "próximo" no resumo, sumário) — Fase 2. O `<summary>` é desenhado para acomodá-los.
- **R-BUILD-9, segunda cláusula** (o sumário vira sheet) — depende de R-BUILD-8, que §14 do PRD lista em "Fora".
- **R-BUILD-15**, filtros, árvore, ícones, leveling, home — Fases 3 a 6.
- **Desvio de R-BUILD-4, declarado:** o requisito diz "o controle é repetido"; este plano faz o repetidor um **espelho de navegação** que não grava nem expande (§7, caminho 3). Consequência assumida: um leitor no fundo de Gear não define o tier sem voltar ao topo, e a métrica "≤ 2 ações" de §12.2 vale a partir do controle do topo. A troca compra a estabilidade de `scrollY` que R-BUILD-2 exige como aceite.
- **R-I18N-7** (troca de idioma preservar o hash) — defeito real em `locale-switcher.tsx:94`, que monta o `href` sem fragmento. Fora porque o switcher está no header de ~1.002 páginas e R-I18N-7 não está na lista da fase. **A Fase 1 verifica que trocar de idioma não perde a preferência** (T6), o que é escopo e é grátis, já que `localStorage` é por origem. O conserto fica anotado para a Fase 2 ou 3.
- **`d2rc.compact`, `d2rc.leveling.<classe>`, `d2rc.level`** — documentadas na lista fechada (R-PREF-3 exige a lista), **não implementadas**.
- **R-BUILD-7 contra os dados** — 45 de 53 builds sem `nextUpgrade` em `bis`; entregue à Fase 2 com o número.

**As Fases 2, 3, 4 e 5 não são iniciadas por este plano.**

---

## 15. Achados da revisão adversarial deste plano

Revisão somente leitura sobre a primeira versão, no vocabulário de severidade da revisão do PRD. Verdito: *não pronto para executar*. Todos os BLOCKER e HIGH estão resolvidos nesta versão; os MEDIUM e LOW aceitos também.

| # | Sev. | Achado | Disposição |
|---|---|---|---|
| B1 | BLOCKER | `peer-open:hidden` compila com `~` (irmão geral), não `+` — abrir um tier esconderia os previews de todos os posteriores, com todos os gates verdes | **Corrigido.** Wrapper `<section>` por tier (§5.4-1), asserção de visibilidade escopada em C4, mutation M10. Verificado em `node_modules/tailwindcss/dist/lib.js` |
| B2 | BLOCKER | A aritmética usava `C` uniforme de pior caso e omitia a linha "Gear com um expandido" do PRD, atribuindo às Fases 4/6d uma dívida que é da Fase 1 | **Corrigido.** §3.4 recomputa por `slots.length` real, restaura a linha omitida, recompõe a atribuição (que a segunda rodada corrigiu de novo, para **45% Fase 1 / 55% deriva**), nomeia as alavancas, e retira a afirmação falsa de que 21.000 era inalcançável |
| H1 | HIGH | C6 comparava a página nova consigo mesma — verde mesmo se os seis `h3` fossem apagados nos dois lados | **Corrigido.** Fixture capturada em `2873b61` (C6) + C6b na árvore de acessibilidade |
| H2 | HIGH | `useEffect` pinta ~16.458 px de gear expandido na navegação soft, o caminho mais comum | **Corrigido.** `useLayoutEffect` em §4.3/§5.3 + C12b |
| H3 | HIGH | Sem orçamento para tiers de 7 ou 8 slots — 37 instâncias, metade da build-baseline | **Corrigido.** Faixas trocadas pela fórmula `f(N) = 118,5 + 22N` |
| H4 | HIGH | C14 nasceria vermelho e §13 proíbe publicar com gate vermelho; e a folga é de 55 px, não 23 | **Corrigido.** §3.5 desfaz a ambiguidade do `mt-8`, e C14 vira afirmação dura + lista de exceção nomeada, datada e afirmada |
| H5 | HIGH | "pior caso" sem escopo, e `leap-attack-barbarian` nomeado como máximo e não medido | **Corrigido.** Linhas escopadas a `blizzard-sorceress`, coluna afirma/publica, e a build entra em §9.4 |
| H6 | HIGH | Reativar o chip pressionado apagava a preferência — invenção, nociva na linha 7, e sem teste | **Corrigido.** §6 linha 10 vira idempotente; "Limpar" é o único caminho; C26 e M9 |
| H7 | HIGH | A segunda configuração de C8 era inexecutável, e a linha 12 prometia `scrollY` constante onde o anchoring é correto | **Corrigido.** C8 mede o topo, C8b mede o espelho, C27 afirma posição visual; §6 linha 12 reescrita |
| M1–M11 | MEDIUM | offset de âncora sem dono e sem número; `aria-current` sem coluna nem teste; buracos na matriz; sequência de commits cegando a suíte; falta de `shrink-0`; nome acessível duplicado; "Expandir" sem par; arquivos fora da tabela de propriedade; seis `role="region"` apagados sem contabilizar; `RichText` no `<summary>`; desvio de R-BUILD-4 não declarado | **Todos incorporados** — §3.6, §5.1, §5.4, §6, §8.1, §9.2, §10, §11, §14 |
| L1–L5 | LOW | 22 px de erro aritmético; justificativa errada para tocar `headless.ts`; precedente citado errado; frase de largura medindo o rótulo errado; justificativa inexistente para `idSection` | **Todos corrigidos** |

### 15.1 Segunda rodada de revisão

A versão corrigida foi revista de novo. Sete dos nove itens foram confirmados como resolvidos; **três achados novos** apareceram, dois deles no próprio conserto:

| # | Sev. | Achado | Disposição |
|---|---|---|---|
| N1 | HIGH | **`group-open:` usado sem a classe `group`** — a mesma classe de erro de mecanismo do B1, repetida no conserto do M7. A afordância ficaria travada em "Expandir" e nenhum gate veria | **Corrigido.** `class="group peer p-3"` no `<details>` (§5.4), com o precedente correto de `mobile-navigation.tsx:141/161`, **mais C28** afirmando a alternância nos dois idiomas e nos dois estados |
| N2 | HIGH | **C6b e C11 eram inexecutáveis** — `send()` é `private` em `headless.ts:279`, e o plano proibia alterar o arquivo | **Corrigido.** §9.1 reverte a proibição e autoriza **dois** métodos aditivos (`addInitScript`, `axNodes`), com re-execução de todos os gates de navegador no commit 2. A justificativa anterior para não tocar no arquivo estava errada; a decisão certa é mudá-lo minimamente e provar que não quebrou |
| N3 | HIGH | **A prova de viabilidade usava `budget` (3.316) enquanto a linha asserida diz "pior tier"** — e o pior medido é `optimized` (3.380) | **Corrigido.** §3.4 refeito com 3.380: a folga residual é **+57,5 px dentro do Gear e +71 px de deriva fora dele**, somando 128,5. As metas passam a ser os valores pós-alavanca projetados, com a folga contra o PRD publicada em cada linha |
| N4–N10 | MEDIUM | `f(N)` ignorava a quebra do objetivo; a regra do rótulo deixava três chips sem texto visível ≥640 px; C11 precisava do mesmo hook de C6b; C4/M10 podiam ficar vacuosos se o tier aberto fosse o último; `ANCHOR_OFFSET_PX` fixo apesar de o sticky sumir <640 px; meta de 2.100 abaixo do próprio valor calculado; `lint`/`typecheck` fora da regra de isolamento | **Todos corrigidos** — §3.1 (termo `G`), §5.1 (regra de span único), §9.1, §9.3 C4 (abre `starter`), §4.4 (`anchorOffsetPx()`), §3.4 (metas pós-alavanca), §11 (stub tipado no commit 2) |
| N11–N15 | LOW | "635 − 421 = 71" com o operando errado; contradição do "menor valor 333 px"; contagem de células desatualizada; citação apresentada como literal sendo paráfrase; contabilidade do padding | **Todos corrigidos** — §3.1, §3.4, §4.2, §5.4, §9.2 |

### 15.2 Terceira rodada

A terceira rodada confirmou que os três consertos HIGH da segunda se sustentam — o mecanismo `group`+`peer` verifica contra o Tailwind 4.3.3 instalado, os dois métodos novos cobrem C6b e C11, e a aritmética de §3.4 reproduz dígito a dígito, inclusive sob o termo `G`. Encontrou um HIGH novo e dez defeitos menores:

| # | Sev. | Achado | Disposição |
|---|---|---|---|
| P1 | HIGH | **C25 era inexecutável** — `Accept-Language` e referrer estão fora da superfície do driver e fora dos dois métodos que §9.1 autoriza, e o padrão do sistema operacional tornaria o teste dependente da máquina. Falsificava o "e só dois" | **Corrigido, sem terceiro método.** C25 vira **C25a** (varredura de fonte: o código nunca referencia `document.referrer`, `navigator.language` ou `Accept-Language` — prova que inferir é *impossível*) e **C25b** (navegador: sem preferência, nas duas rotas, seis fechados). Mais forte que o original, e "só dois" continua verdadeiro |
| P2 | MEDIUM | O offset abaixo de `sm` dava **88 px**, não os 72 declarados | **Corrigido.** `scroll-padding-top` abaixo de `sm` vai a `0.5rem`: 64 + 8 = 72 |
| P3 | MEDIUM | §7, §10 e §12 ainda citavam a constante `ANCHOR_OFFSET_PX` (112) que §4.4 substituiu por função | **Corrigido** nas três |
| P4 | MEDIUM | **C28 e C8b não entravam em commit nenhum** — o gate do próprio conserto de N1 nunca chegaria à cadeia | **Corrigido.** C28 no commit 4, C8b no commit 6 |
| P5 | MEDIUM | A metade de C28 que lê arquivo era vacuosa: os dois textos estão no HTML com ou sem `group` | **Corrigido.** A metade de arquivo afirma os *seletores*; a de navegador afirma o `display` computado |
| P6 | MEDIUM | "≥ 88% de redução" exigia ≤ 1.974,96 enquanto a linha de Gear pedia ≤ 1.980 — duas linhas asseridas em contradição por 5 px | **Corrigido.** Meta de Gear a ≤ 1.974 |
| P7 | LOW | "+200 … atribuído 57,5 / 71" deixava 71,5 px sem atribuição | **Corrigido:** 128,5 atribuídos + 71,5 de folga de meta, dito |
| P8 | LOW | As duas médias de cinco compactos dobravam a alavanca de vão | **Corrigido** para 258,8 / 284,5; a conclusão de 25,7 px por tier não muda |
| P9 | LOW | `p-3` no `<details>` deixava o preview, que é irmão, fora da caixa com padding | **Corrigido.** Padding e borda vão para o `<section>` wrapper |
| P10 | LOW | §15 citava 73% depois de §3.4 ter passado a 45/55 | **Corrigido** |
| P11 | LOW | A regra do stub listava só `null`/`false`/`""`, inválida para três dos onze exports | **Corrigido** com os zeros válidos por tipo |

**Verificado e sem achado:** a linha "+9% para pt-BR". Medidos os `goal` reais de pt-BR, o Gear compacto fica +1,0% a 390 px e +3,0% a 320 px — folgadamente dentro dos 9%.

---

## 16. Decisões do proprietário (2026-09-09), sobre o plano aprovado

O plano foi aprovado em `d8bb709`. Cinco decisões o refinam; nenhuma reabre planejamento.

### 16.1 O espelho dentro de Gear — desvio de R-BUILD-4 **aprovado**
O controle principal, perto do topo, define e grava "Meu tier". O espelho sticky dentro de Gear
**só navega**: reflete o tier visível, navega por âncoras, **não grava a preferência**, **não
altera `aria-pressed`**, **não expande nem compacta conteúdo acima da viewport**, e não pode
provocar reflow compensado nem salto inesperado. O espelho continua acessível e tem alvo mínimo
de **24 px**; o controle principal segue os **44 px** de R-A11Y-4.
**Ao fim da fase, o PRD é atualizado para registrar este refinamento contratual, sem reescrever
histórico** — uma entrada nova em §18 e uma nota em R-BUILD-4, não uma edição do texto vigente.

### 16.2 Altura dos tiers — a hipótese de 320 px está oficialmente substituída
A fórmula e as medições reais deste plano passam a prevalecer. **Não comprimir conteúdo além da
legibilidade para perseguir 320 px.** O relatório final publica: altura por quantidade de slots;
altura total dos seis compactos; Blizzard en-US; Blizzard pt-BR; pior caso entre as 53 builds;
estado sem preferência; estado com um tier expandido; diferença contra as projeções do PRD; e
**que parte da redução pertence de fato à Fase 1**.

### 16.3 Posição do controle principal — alvo e teto
Alvo **≤ 560 px** em 320×640; teto absoluto **≤ 640 px** nas 53 builds × 2 idiomas.
Processo: recuperar espaço só com os levers seguros já identificados; **não** cortar título,
badges ou informação relevante; **não** reduzir alvos de toque; **não** usar posicionamento
sobreposto; **não** provocar CLS. Páginas entre 561 e 640 px são registradas como excedentes do
alvo com o gate **verde**. Qualquer página acima de 640 px **para a execução antes do push**,
com medição e causa apresentadas.

### 16.4 Hash na troca de idioma — fora da Fase 1
A perda do fragmento em `locale-switcher.tsx:94` fica registrada para a Fase 2. **O header não é
alterado nesta execução.** A Fase 1 prova apenas que `d2rc.tier` sobrevive à troca de locale (T6).

### 16.5 `nextUpgrade` — fora da Fase 1
As lacunas em `bis` (45 de 53 builds) continuam na Fase 2. **Não inventar conteúdo nem alterar
dados** para satisfazer um requisito futuro.
