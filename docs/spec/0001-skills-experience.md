# Spec 0001 — The skills experience for Paladin and Sorceress

**Status:** Proposed. Nothing implemented.
**Written:** 2026-08-30
**Baseline:** D2R Patch 3.3 / Ladder Season 15 (see [`../research/00-game-state.md`](../research/00-game-state.md))
**Scope:** Paladin and Sorceress only — 60 skills, 6 trees, 2 locales.

> This document decides *what* the skills experience is and *how* it is built,
> down to the data model and the interaction states. It does not write code.
> Numbers are marked with the tier they came from, per the
> [source registry](../sources/README.md).

---

## 0. Read this first — the audit found a blocking defect

The audit that preceded this spec compared our authored skill prerequisites
against the game's own data. **29 of 60 are wrong**, and the damage has already
shipped.

| Check | Result |
| --- | --- |
| Prerequisite sets identical to game data | **31 / 60** |
| Cross-tree prerequisites in our content (impossible in D2) | **1** — `charge` ← `might` |
| Shipped builds whose skill plan **cannot be spent in-game** | **14 / 18** |
| Skill points those builds never account for | **38** |

### Why I am confident this is our bug, not the source's

Three independent confirmations:

1. **An internal impossibility.** D2 prerequisites are always within one tree.
   Our data has `charge` (Combat Skills) requiring `might` (Offensive Auras).
   That cannot be true under any patch, and needs no external source to reject.
2. **Two separate extractions agree 60/60.** The current D2R table and the base
   Lord of Destruction table in the same repository return byte-identical
   prerequisite sets for all sixty skills.
3. **The disagreements have a signature.** Eight of them follow the pattern
   *"the skill drawn directly above it in the tree"* — `inferno` ← `fire-bolt`,
   `holy-bolt` ← `sacrifice`, `defiance` ← `prayer`, `resist-cold` ←
   `resist-fire`. That is what someone infers from a picture of a tree, not
   what the game enforces. It is an authoring error with a consistent cause.

### What is *not* wrong

The **numbers** in our content check out. Every skill figure I have published —
Fire Mastery 30% +7%/level, Lightning Mastery 50% +12%, Cold Mastery 20% +5%,
Static Field 25% of current life, Energy Shield's 32-sixteenths — matches the
game data exactly. Two authored mana costs (Static Field flat at 9, Teleport
descending from 24) also match. The editorial research holds. It is the
structural graph that was guessed.

### The three consequences

1. **`check:content`'s prerequisite validator is currently worthless.** It
   reports 289/289 because it validates builds against the same wrong table
   they were written from. It cannot fail. Correcting the data is what gives
   that check teeth.
2. **My earlier "fix" made one page worse.** In the Sorceress phase I added
   notes to Lightning Sorceress and Nova Sorceress saying Lightning Mastery
   requires Thunder Storm. **Lightning Mastery has no prerequisite at all.**
   Those notes are live and wrong.
3. **Fourteen build pages under-count the skill budget**, by 1 to 5 points
   each. Hammerdin is the worst case: it already allocates 112 points against
   the 110 a level 99 character has, and needs a 113th for Charge.

**Phase 0 below is therefore blocking.** No visual work should start on top of
a graph that is half wrong, because the tree's whole job is to *draw that
graph*.

| Build | Points allocated | Missing prerequisite points |
| --- | --- | --- |
| Avenger | 110 | Thorns, Charge, Blessed Hammer, Holy Bolt, Cleansing |
| FoHdin | 101 | Conversion, Vengeance, Zeal, Thorns, Charge |
| Holy Fire Paladin | 99 | Charge, Blessed Hammer, Holy Bolt, Thorns |
| Meteorb Sorceress | 92 | Frost Nova, Fire Wall, Blaze, Inferno |
| Tesladin | 96 | Thorns, Charge, Blessed Hammer, Holy Bolt |
| Fire Ball Meteor Sorceress | 88 | Fire Wall, Blaze, Inferno |
| Melee Sorceress | 90 | Chain Lightning, Lightning, Ice Blast |
| Hydra Sorceress | 91 | Enchant, Blaze |
| Smiter | 93 | Blessed Hammer, Holy Bolt |
| Zealot | 95 | Blessed Hammer, Holy Bolt |
| Enchant Sorceress | 72 | Blaze |
| Fire Wall Sorceress | 90 | Blaze |
| Hammerdin | 112 | Charge |
| Nova Sorceress | 89 | Chain Lightning |
| *Blizzard, Frost Nova, Frozen Orb, Lightning Sorceress* | — | *clean* |

---

## 1. Sources and licensing

### 1.1 What was consulted

| Source | Tier | Gives us | Verdict |
| --- | --- | --- | --- |
| `skills.json` (blizzhackers/d2data) | 1 | Unlock level, level cap, prerequisites, mana formula, per-level damage, 8 labelled parameters per skill, aura/passive stat scaling | **Primary** |
| `skilldesc.json` (same repo) | 1 | **Tree page, row and column for all 60 skills**, icon cell index | **Primary** |
| `json/base/skills.json` (same repo) | 1 | The pre-D2R table | **Cross-check only** |
| The Arreat Summit | 2 | — | **Unusable.** Its class skill pages still return *Document Not Found*, as recorded in the Paladin research. |
| Maxroll, DiabloBytes, D2Runewizard | 3–4 | Synergy identities, breakpoint tables | Narrow use, see §1.4 |
| Icy Veins | 4 | — | **Not consulted.** Cloudflare bot protection; not bypassed. Referenced below only as a UX pattern I already know, never as a data source. |

### 1.2 The layout data exists, and it is exact

`skilldesc.json` carries `SkillPage`, `SkillRow`, `SkillColumn` for every skill.
All 60 are positioned; none are missing. The layout is a 3 × 6 × 3 grid — three
pages, six rows, three columns, ten skills per page.

**A verified invariant worth building on:** `SkillRow` maps onto the unlock
level in every one of the 60 cases.

| Row | 1 | 2 | 3 | 4 | 5 | 6 |
| --- | --- | --- | --- | --- | --- | --- |
| Required level | 1 | 6 | 12 | 18 | 24 | 30 |

The row grouping the brief asks for is not a presentation choice we are
imposing — it *is* the game's row index. This becomes a `check:content`
assertion (§4.4), not a comment.

### 1.3 Licensing — the honest position

The repository is **MIT licensed**, but its README states the files are "data
from the .txt files from the d2r casc." A repository owner cannot MIT-license
Blizzard's data; the MIT grant covers the extraction work, not the underlying
tables.

The site's position, which this spec does not change:

| Thing | Status | What we do |
| --- | --- | --- |
| **Facts** — "Blessed Hammer unlocks at 18", "Conviction reduces resistance 30% +5%/level", tree coordinates | Not copyrightable. Facts about a system. | Use freely, cite the tier. |
| **The game's descriptive prose** — `str long` / `str name` string tables | Blizzard's expression | **Never ship.** Not quoted, not paraphrased line-by-line. We write our own. |
| **Icons** — `IconCel` indexes Blizzard's sprite sheets | Blizzard artwork | **Never ship.** See §7. |

`localestrings-*.json` exists for eng, deu, esp, fra, ita, pol, chi and kor —
**and no Portuguese**. That independently confirms ADR 0003's finding that no
official pt-BR string table is available to us, so game proper nouns stay in
English in both locales.

### 1.4 Gaps and divergences, recorded

| # | Gap | Consequence |
| --- | --- | --- |
| **S1** | Synergy *identities* are not in Tier 1. The data says `Param8 = 14 // Damage synergy` — the magnitude — but never which skills provide it. | Every "synergy list" on the site is Tier 3/4 consensus. Skill pages must label it as such rather than implying game-data authority. |
| **S2** | Mana costs are computable but the **fractional rounding is unverified.** The formula `max(minmana, (mana + lvlmana × (lvl−1)) / 2^(8−manashift))` reproduces Static Field's flat 9 and Teleport's 24-descending exactly. D2 displays fractional mana (Blessed Hammer is commonly cited at 5.5 where integer flooring gives 5). | Publish mana costs only after validating the fraction against the client. Until then, no per-level mana table. |
| **S3** | No breakpoint or IAS data in any Tier 1 table. | Unchanged from prior phases. Skill pages link to the breakpoints page; they do not invent frame counts. |
| **S4** | `maxlvl` is 20 for all 60 skills, but hard points can exceed 20 only via items. | The tree caps hard points at 20 and says so. |
| **S5** | The base and current extractions agree on prerequisites, so this pass produced **no evidence about what changed in D2R**. Absence of a diff is not proof of no change. | Baseline stays "as extracted", not "verified current". |

---

## 2. Product definition

Four surfaces, in dependency order.

### A. Class page — three visual trees

Replaces the current flat `<ul>` of skills per tree. Rows grouped by unlock
level, prerequisite edges drawn, every node reachable by mouse, touch and
keyboard, with a contextual detail panel and an explicit link to the full skill
page.

### B. Skill page — one indexable page per skill

`/[lang]/classes/[slug]/skills/[skillSlug]` — 60 skills × 2 locales = **120 new
pages**. This is the largest SEO surface the site has added, and it is
independently valuable: it ships before any tree exists.

### C. Build page — the same tree, showing that build's plan

Hard points only. Five visual states. Never implies gear bonuses.

### D. Contextual panel — shared by A and C

One component, three input modes (hover, focus, touch).

---

## 3. The decision that shapes everything else

Two conventional options, and I am recommending against both.

**Option 1 — icon grid with floating tooltip.** What Icy Veins' calculator and
D2Planner do: a dense grid of art squares; you hover to find out what anything
is. It is compact and it is what players recognise.

It also fails three requirements at once. It needs per-skill artwork we cannot
license (§1.3). A floating tooltip over a dense grid **obscures adjacent
skills**, which the brief forbids and WCAG 2.2 SC 2.4.11 (*Focus Not Obscured*)
independently forbids for the focused element. And identity carried only by an
image is identity carried by one channel.

**Option 2 — named tiles, floating tooltip.** Fixes the art problem, keeps the
obscuring problem.

**Recommended — named tiles in the grid, and a docked detail panel.**

- Every node shows its **name and unlock level as visible text**. Identity never
  depends on hover, on an image, or on colour.
- The detail panel is **docked beside the tree** on desktop and a **bottom
  sheet** on mobile. It never floats over the grid, so it cannot obscure
  anything.

This single decision resolves the icon licence, WCAG 1.4.13 (*Content on Hover
or Focus* — the panel is trivially hoverable and dismissible when it is not a
floating layer), WCAG 2.4.11, the mobile behaviour, and the "not colour-only"
rule — together, rather than four separate mitigations.

**The trade-off, stated plainly:** named tiles are wider than 32px art squares,
so three columns of them need real horizontal room. That is what forces the
responsive strategy in §5.3 (one tree at a time below 1024px). A reader who
knows the game will find our tree less dense than the reference sites. In
exchange it is readable without hovering, which is the thing this site is
actually for.

---

## 4. Data model

### 4.1 Principle

The audit in §1 found the shape of the problem: skill attributes are genuinely
heterogeneous. Holy Shield has "Block % chance Min/Max"; Hydra has "# of max
Hydras"; Energy Shield has "Mana consumed per HP damage (in sixteenths)". A
flat `stats: Record<string, number>` would either lose these or force every
skill to carry empty fields for all of them.

So: **a discriminated union of effects, plus explicit level-scaling shapes.**
No skill is forced to have a field it does not have.

### 4.2 Level scaling — three shapes, because D2 has three

```ts
/** value(level) = base + perLevel × (level − 1). */
export interface LinearScale {
  base: number;
  perLevel: number;
}

/**
 * Elemental and physical damage do NOT grow linearly. D2 adds a different
 * amount per level inside five bands: levels 2–8, 9–16, 17–22, 23–28, 29+.
 * Blessed Hammer is +8 per level to level 8, then +10, +12, +13, +14.
 * Modelling this as linear is the single easiest way to publish wrong numbers.
 */
export interface BandedScale {
  base: number;
  /** Added per level within bands 2–8, 9–16, 17–22, 23–28, 29+. */
  bands: readonly [number, number, number, number, number];
}

/** Durations use three bands (`ELevLen1..3`), not five. */
export interface DurationScale {
  base: number;
  bands: readonly [number, number, number];
}
```

### 4.3 The effect union

```ts
export type SkillEffect =
  | { kind: "elemental-damage"; element: Element; min: BandedScale; max?: BandedScale;
      /** Damage divisor exponent; final = value × 2^(hitShift−8). */
      hitShift: number }
  | { kind: "physical-damage"; min: BandedScale; max: BandedScale }
  | { kind: "life-percent-damage"; percent: number }          // Static Field
  | { kind: "duration"; scale: DurationScale | LinearScale; unit: "frames" | "seconds" }
  | { kind: "radius"; scale: LinearScale }
  | { kind: "aura-modifier"; stat: Slug; scale: LinearScale; unit: EffectUnit }
  | { kind: "passive-modifier"; stat: Slug; scale: LinearScale; unit: EffectUnit }
  | { kind: "resistance-reduction"; element: Element | "all"; scale: LinearScale }
  | { kind: "summon-cap"; max: number }                       // Hydra
  | { kind: "absorption"; percentCap: number; manaPerDamage: LinearScale } // Energy Shield
  /**
   * Escape hatch, deliberately last and deliberately awkward to use. For a
   * one-off quantity with no shared semantics. `labelKey` MUST resolve in both
   * dictionaries — `check:content` fails the build otherwise, which is what
   * stops this becoming the bucket everything falls into.
   */
  | { kind: "quantity"; labelKey: string; scale: LinearScale; unit: EffectUnit };

export type EffectUnit = "percent" | "flat" | "yards" | "seconds" | "frames" | "count";
```

### 4.4 Position, provenance, and the invariant

```ts
export interface SkillPosition {
  /** 1-based tree index, matching in-game tab order. */
  page: 1 | 2 | 3;
  /** 1-based row. INVARIANT: TIER_LEVELS[row − 1] === skill.requiredLevel. */
  row: 1 | 2 | 3 | 4 | 5 | 6;
  column: 1 | 2 | 3;
}

export const TIER_LEVELS = [1, 6, 12, 18, 24, 30] as const;

/** Provenance travels with the dataset, not with the page that renders it. */
export interface SkillDataset {
  effects: SkillEffect[];
  mana?: ManaCost;
  /** `maxlvl`. 20 for every Paladin and Sorceress skill. */
  maxLevel: number;
  source: "game-data" | "community" | "derived";
  /** e.g. "D2R 3.3 / Season 15 extraction". */
  baseline: string;
  confidence: Confidence;
  /** What this was checked against outside the extraction, when it was. */
  crossChecked?: string;
}
```

### 4.5 Changes to the existing `Skill` type

Additive. Nothing existing is removed.

```ts
export interface Skill extends Entity {
  // ...everything already there...
  position: SkillPosition;           // NEW, required — all 60 known
  data?: SkillDataset;               // NEW, optional — added skill by skill
  /** NEW. Corrected in Phase 0; `prerequisites` becomes game-data-backed. */
  prerequisites?: Slug[];
}
```

`synergies` and `synergyFor` stay exactly as they are, and stay marked
community-sourced (gap S1).

### 4.6 What the build side needs: **nothing**

The five visual states the brief asks for are already derivable from the
shipped `SkillAllocation` type. No schema change.

| Visual state | Derivation |
| --- | --- |
| Maxed | `points >= 20` |
| Invested | `2 <= points <= 19` |
| One-point | `points === 1` and `role !== "prerequisite"` |
| Prerequisite | `role === "prerequisite"` |
| Optional / flex | `role === "flex"` |
| Unused | not present in `build.skills` |

### 4.7 New localizable copy

`SkillCopy` gains optional `effectNotes?: Record<string, string>` keyed by
effect index, on the same positional-overlay principle already used for
`synergyBonuses`. Effect *labels* (“Radius”, “Duration”) live in the UI
dictionary, not per skill — 60 skills × ~4 effects would otherwise mean ~240
hand-translated strings for perhaps 12 distinct words.

---

## 5. Wireframes

### 5.1 Class page, desktop ≥1024px

```
┌───────────────────────────────────────────────────────────────────────────┐
│  Paladin › Skills                                                          │
│  ┌─ Combat Skills ─┬─ Offensive Auras ─┬─ Defensive Auras ─┐  (tree tabs)  │
│  └─────────────────┴───────────────────┴───────────────────┘               │
├──────────────────────────────────────────┬────────────────────────────────┤
│  TREE  (roving tabindex, 1 tab stop)     │  DETAIL PANEL (docked, sticky) │
│                                          │                                │
│  lvl 1  ┌────────────┐   ┌────────────┐  │   Blessed Hammer               │
│         │ Sacrifice  │   │  Smite     │  │   ───────────────              │
│         └─────┬──────┘   └─────┬──────┘  │   Combat Skills · Level 18     │
│               │                │         │   Spell · Magic                │
│  lvl 6      ┌─┴──────────┐     │         │                                │
│             │ Holy Bolt  │     │         │   A spiralling hammer that      │
│             └─────┬──────┘     │         │   ignores physical immunity.    │
│                   │            │         │                                │
│  lvl 12 ┌─────────┴──┐   ┌─────┴──────┐  │   Requires: Holy Bolt          │
│         │   Zeal     │   │  Charge    │  │   Feeds: Fist of the Heavens   │
│         └────────────┘   └────────────┘  │                                │
│                                          │   [ Ver skill completa → ]     │
│  ...rows 4–6...                          │                                │
└──────────────────────────────────────────┴────────────────────────────────┘
```

The panel is a **sibling column**, not an overlay. Nothing is ever covered.

### 5.2 A node

```
┌──────────────────────┐   Always visible, never hover-only:
│ ◈  Blessed Hammer    │   ◈  element/kind sigil (§7)
│    18 · Spell        │      name
└──────────────────────┘      unlock level · kind
```

On a build tree the node gains a points chip and a state:

```
┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│ ◈  Blessed Hammer 20 │  │ ◈  Charge          1 │  │ ◇  Conversion      — │
│    MAXED             │  │    PRÉ-REQUISITO     │  │    não usada         │
└══════════════════════┘  └──────────────────────┘  └╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┘
   double border            solid border               dashed, dimmed
```

State is carried by **border weight + a text label + the points chip** — three
channels, none of them colour alone.

### 5.3 Mobile ≤768px

One tree at a time via the tab strip. Nodes go full-width, one per row, with
the row's level as a sticky group header. The panel becomes a bottom sheet:

```
┌─────────────────────────┐
│ lvl 18 ───────────────  │
│ ┌─────────────────────┐ │
│ │ ◈ Blessed Hammer    │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ ◈ Vengeance         │ │
├─┴─────────────────────┴─┤
│ ▲  Blessed Hammer    ✕  │  ← bottom sheet, first tap
│    Combat · Level 18    │
│    Spell · Magic        │
│    Requires: Holy Bolt  │
│  [ Ver skill completa → ]│  ← separate CTA; the tap that
└─────────────────────────┘     opened the sheet never navigates
```

### 5.4 Skill page

```
Paladin › Combat Skills › Blessed Hammer          ← breadcrumb, all linked
Blessed Hammer                    [Level 18] [Spell] [Magic] [verified]

Summary paragraph.

┌ AT A GLANCE ──────────────────────────────────────────┐
│ Tree      Combat Skills          Unlock     Level 18  │
│ Type      Spell                  Cap        20        │
│ Element   Magic                  Mana       see note  │
└───────────────────────────────────────────────────────┘

Mechanics ......................... prose, ours
Prerequisites ..................... Holy Bolt          → linked node
Synergies received ................ Vigor, Blessed Aim → Tier 3, labelled
Skills this feeds ................. Fist of the Heavens
Progression by level .............. table, only where verifiable
Builds using this skill ........... Hammerdin (20) · Smiter (1) → reverse links
Sources and confidence ............ per-dataset provenance
```

---

## 6. Interaction states

### 6.1 The state machine

One state: `selected: Slug | null`, plus how it was set (`pointer | keyboard |
touch`) so dismissal can behave correctly.

| Event | Desktop | Mobile |
| --- | --- | --- |
| Pointer enters node | select after **120 ms** | n/a |
| Pointer leaves node | deselect after **200 ms** | n/a |
| Pointer enters panel | **cancel pending deselect** | n/a |
| Node receives keyboard focus | select immediately | — |
| `Esc` | deselect, focus returns to the node | close sheet, focus returns |
| Arrow keys | move focus within the tree (roving tabindex) | — |
| `Enter` / `Space` on node | select (does **not** navigate) | select (does **not** navigate) |
| Tap node | — | select + open sheet |
| Tap outside / ✕ | — | close sheet |
| Activate "Ver skill completa" | navigate | navigate |

The open/close delays exist so a diagonal pointer path to the panel does not
dismiss it — the concrete reading of "mover o ponteiro para dentro do preview
não deve fechá-lo". With a docked panel this is a convenience; with a floating
tooltip it would be load-bearing, which is one more reason for §3.

### 6.2 Rules that follow

- **A node never navigates.** It is a `<button>` that selects. The only
  navigation is the panel's explicit link. This is the brief's "não use o mesmo
  toque simultaneamente para abrir o painel e navegar", applied to every input
  method rather than only touch.
- **No hover state on touch devices.** Gate hover handlers behind
  `matchMedia("(hover: hover)")`, not on viewport width.
- **The panel never renders empty.** With nothing selected it shows the tree's
  own theme text, so the column is never a hole.

---

## 7. Icon strategy

**Blizzard's icons are not available to us** (§1.3), and `IconCel` is only an
index into their sprite sheet — of no use without the sheet.

**We do not draw 60 pieces of substitute art either.** Sixty hand-drawn icons
is a large amount of work whose main effect would be to make identity depend on
pictures again.

**The mark is a composed sigil, and the name does the identifying.**

```
   shape  ← skill kind      colour ← element        weight ← tree
   ◈ spell    ▲ attack      --color-el-fire         (page 1/2/3 accent)
   ◉ aura     ■ passive     --color-el-cold
   ✦ buff     ⬟ summon      --color-el-lightning
   ⌁ curse    ◐ shapeshift  --color-el-magic / -physical / -poison
```

Eight `kind` values and the existing element colour tokens are already in the
design system — `--color-el-fire`, `-cold`, `-lightning`, `-magic`,
`-physical`, `-poison` all exist in `globals.css` today. Each sigil is a small
inline SVG, authored once per kind, tinted by element via `currentColor`.

This gives every node a mark that is meaningful (you can read "aura" and "cold"
off it at a glance) without ever claiming to be a per-skill illustration, and
without a licence question. The skill's **name** remains the identifier, which
is the accessible behaviour anyway.

**Rejected:** procedurally generated per-skill patterns (identicon-style). They
look like noise, carry no meaning, and would make the grid harder to scan.

---

## 8. Architecture

### 8.1 The split

Per `node_modules/next/dist/docs/01-app/02-guides/server-and-client-boundary.md`:

> Content gated behind user interaction or an event does not appear in the HTML
> available to a crawler that does not run JavaScript.

So **all panel content is server-rendered**, and the client component only
toggles visibility.

```
app/[lang]/classes/[slug]/page.tsx              Server
  └─ <SkillTree>                                Server — grid, edges, nodes
       └─ <SkillTreeInteractive>                Client — ~2KB, selection only
            ├─ nodes:  ReactNode[]              serialized elements, not code
            └─ panels: ReactNode[]              serialized elements, not code
```

The `children`-as-serialized-element pattern from the boundary guide is what
keeps the panel *content* out of the client bundle while keeping it in the
HTML. The client component receives rendered output, never the components that
produced it. It would become the site's **third** client component, after
`locale-switcher` and `search-dialog`.

### 8.2 Why not one client component per node

Sixty hydration roots on a class page for a hover behaviour is the wrong trade.
One component owns selection for a whole tree; nodes are server-rendered
markup with `data-skill` attributes and a delegated listener.

### 8.3 Strings

Same convention `search-dialog` already established: the locale dictionary must
not enter the client bundle. Only the handful of strings the interactive layer
needs (close label, "Ver skill completa", aria templates) cross as props.

### 8.4 HTML weight

30 compact panels ≈ 250–350 bytes each ≈ **~10KB per class page** before
compression. Acceptable. The *full* skill detail lives on the skill page, not
in 30 hidden panels — which is also why B is a separate surface rather than a
modal.

---

## 9. Routes

### 9.1 The chosen route, and a constraint that forces it

```
app/[lang]/classes/[slug]/skills/[skillSlug]/page.tsx
```

The brief proposes `[classSlug]`. **It has to be `[slug]`.** The existing class
page is `app/[lang]/classes/[slug]/page.tsx`, and Next 16 throws build error
**E912 — "Ambiguous app routes detected"** when two paths normalize to the same
structure with different param names. `validate-app-paths.js:217` implements
this. Reusing `[slug]` for the shared segment is the fix; the resulting URL is
identical to what the brief asked for.

The existing `app/[lang]/builds/[classSlug]/[slug]/page.tsx` is the working
precedent for the two-segment `generateStaticParams` shape.

### 9.2 `lib/routes.ts`

```ts
skill: (classSlug: Slug, skillSlug: Slug) => `${base}/classes/${classSlug}/skills/${skillSlug}`,
skillTree: (classSlug: Slug, treeSlug: Slug) => `${base}/classes/${classSlug}#${treeSlug}`,
```

`classSkills()` stays — it is what the search index currently points at, and
it keeps working during the migration.

### 9.3 Page count

347 → **467** static pages (60 skills × 2 locales). Build time and the crawl
budget both scale linearly; no change to the validation approach.

---

## 10. SEO

- `pageMetadata()` already produces canonical + `en-US`/`pt-BR`/`x-default`.
  The skill page calls it unchanged. Nothing new to get wrong.
- **Sitemap:** priority `0.6` — below builds (0.9) and classes (0.8), above
  reference tables. Skills are supporting reference, not the destination.
- **Search index:** skill entries currently point at
  `r.classSkills(classSlug)`, an anchor on the class page. They change to
  `r.skill(...)`. This is a strict improvement and the reason skill entries
  already exist in `SEARCH_KINDS`.
- **Titles:** `"{Skill} — {Class} skill"`, not just the skill name — "Charge"
  and "Might" are ambiguous words on their own.
- No structured data. `VideoGame` schema does not model skills, and inventing
  a shape for it would be noise.

---

## 11. Build integration

1. **Tree on the build page**, same component, `allocation` prop supplied.
2. **Hard points only.** The tree shows what you spend. It never adds gear.
   A persistent line states this: *"Pontos investidos. Não inclui bônus de
   equipamento."*
3. **"Effective level" is deliberately excluded.** It requires a +skills total
   that varies per gear tier and per roll, and we cannot source it reliably.
   Showing a number we cannot defend is worse than showing none. Revisit only
   if a gear tier's +skills total becomes authored data.
4. **Optional skills must not read as mandatory.** `flex` renders with a dashed
   border and an explicit *opcional* label, visually grouped away from the
   maxed core.
5. **Reverse links both ways.** Skill page lists the builds that use it and at
   how many points, derived from `build.skills` — no new authoring.

---

## 12. Accessibility criteria

| Requirement | How |
| --- | --- |
| Semantic control | Node is `<button type="button">`. No `div` with `onClick`. |
| Predictable Tab order | **Roving tabindex**: one tab stop per tree, arrows move within. Without it a class page would have ~90 tab stops. |
| Panel association | `aria-expanded` + `aria-controls` on the node; panel is `role="region"` with `aria-labelledby`. |
| **Not `role="tooltip"`** | Correct — the panel holds structured content and a link. `tooltip` is for simple text and its content is not meant to be interactive. |
| Not colour-alone | Every state carries border weight + text label + points chip (§5.2). |
| Visible focus | Existing `focus-visible` tokens; never removed on the node. |
| Localized `aria-label` | `"{skill}, nível {n}, {tree}, {points} pontos"` from the dictionary, both locales. |
| WCAG 2.2 **1.4.13** *Content on Hover or Focus* | Dismissible (`Esc`), hoverable (docked panel + 200 ms close delay), persistent (stays until dismissed or another node is selected). |
| WCAG 2.2 **2.4.11** *Focus Not Obscured* | The docked panel is a sibling column and never overlays the grid. The mobile sheet is dismissible and does not cover the focused node's row. |
| Reduced motion | Edge-draw and panel transitions respect `prefers-reduced-motion`. |
| Screen reader | Each node announces name, level, tree and — on a build tree — its points and state. |

---

## 13. Implementation phases

**Phase 0 — Data correction. Blocking, and shippable on its own.**
Correct 29 prerequisites from game data. Reconcile the 14 affected builds:
either add the missing prerequisite points to each plan, or document why the
build accepts the shortfall — but the pages must stop stating a plan that
cannot be spent. Remove the incorrect Lightning Mastery notes. Add `position`
to all 60 skills. Add validators: row↔level invariant, single-tree
prerequisites, prerequisite closure per build. **This phase makes the existing
prerequisite check meaningful for the first time.**

**Phase 1 — Data model.** `SkillEffect`, the scale types, `SkillDataset`,
registry accessors, `check:content` coverage for the escape hatch's label keys.
No UI.

**Phase 2 — Skill pages.** 120 pages, both locales, metadata, sitemap, search
rewiring. Ships without any tree existing. Largest SEO gain, lowest risk.

**Phase 3 — Static tree on the class page.** Grid, edges, named tiles, sigils.
**No interactivity** — server-rendered, fully readable, panel column shows tree
theme. Valuable and complete on its own.

**Phase 4 — Build tree.** Same component, allocation states.

**Phase 5 — The interactive panel.** Progressive enhancement over 3 and 4.
Hover, focus, roving tabindex, bottom sheet, `Esc`.

Phases 3 and 4 are deliberately usable before Phase 5 exists: with JavaScript
off, the tree is still a readable, linked, correct diagram.

---

## 14. Risks and open decisions

### Risks

| # | Risk | Mitigation |
| --- | --- | --- |
| R1 | **14 build pages are wrong in production right now.** | Phase 0 is blocking. See D1. |
| R2 | Mana fraction rounding unverified (S2) | No per-level mana table until validated. |
| R3 | Synergy identities are Tier 3, presented next to Tier 1 data | Per-dataset `source` and `confidence` render on the page. Do not let game-data authority bleed onto community claims. |
| R4 | 120 new pages of pt-BR copy | Effect *labels* are dictionary-level, not per skill (§4.7). Per-skill prose reuses existing `summary`/`mechanics`, already translated. |
| R5 | Named tiles look sparser than competitor grids | Accepted, and argued in §3. |
| R6 | The escape-hatch effect kind becomes a dumping ground | `labelKey` must resolve in both dictionaries or the build fails. |

### Open decisions — these need your call

| # | Decision | My recommendation |
| --- | --- | --- |
| **D1** | Fix the 14 builds **now** as a hotfix, or fold into Phase 0? | **Hotfix the prerequisites and the wrong Lightning Mastery notes now.** They are live and wrong. The positions and the data model can wait for the phased work. |
| **D2** | When a build is short a prerequisite point — add the point to the plan, or document the shortfall? | **Add the point.** A plan that cannot be spent is not a plan. But every affected page's point budget changes, so the totals and any "no points left" claims need re-reading — Hammerdin at 112+1 against a 110 ceiling needs a real editorial decision, not an increment. |
| **D3** | Publish per-level progression tables for all 60 skills, or only where decision-relevant? | **Only where decision-relevant.** A table for Sacrifice serves nobody. Where omitted, say so rather than leaving a blank section. |
| **D4** | Named tiles + docked panel (§3)? | **Yes** — it is what makes the accessibility criteria achievable rather than aspirational. |
| **D5** | Extend to the other six classes after this? | Out of scope here. The data (positions, prerequisites, effects) is available for all seven original classes at the same quality; the Warlock is unverified. |
```
