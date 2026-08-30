# D2 Codex

A progression-first companion for **Diablo II: Resurrected**, built around one
question: *what should I do next?*

Most build guides open on a best-in-slot loadout you do not own. This one
documents every build at six gear tiers, so the page is useful whether you are
level 12 with a vendor staff or level 95 hunting a perfect roll.

**Current baseline:** Patch 3.3 · Ladder Season 15 · *Reign of the Warlock*

---

## Running it

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server (Turbopack) |
| `npm run build` | Production build; prerenders every content page |
| `npm run start` | Serve the production build |
| `npm run check` | Content integrity + lint + typecheck |
| `npm run check:content` | Validates every cross-reference in the content graph |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

Run `npm run check` before committing. It catches the class of error TypeScript
cannot: a build pointing at a runeword slug that does not exist.

---

## Architecture

```
app/          Routes. Server components only — no client JS on content pages.
components/
  ui/         Layout and presentation primitives (Card, Badge, DataTable…)
  game/       Domain components (ItemRefLink, RuneSequence, GearProgression…)
  layout/     Site shell
content/      All game data, as typed TypeScript
lib/
  types/      Domain models
  registry/   The single data-access layer
  labels.ts   Display labels for every string-literal union
docs/
  research/   Where the numbers came from, and what is still unverified
  adr/        Architecture decisions and their reasoning
scripts/      Content validation
```

### Three rules that keep this scalable

**1. Content is data, never JSX.**
No guide text lives inside a React component. Pages are templates fed by
`content/`. Adding a build means writing one data file, not one page.

**2. Entities are described once and referenced everywhere.**
Spirit is defined in `content/runewords/runewords.ts`. Every build that
recommends it stores `{ kind: 'runeword', slug: 'spirit' }`, and the UI resolves
that into a correctly coloured, correctly linked, correctly named reference.
Nothing is ever restated, so nothing can drift out of sync.

**3. Everything goes through the registry.**
Pages and components call `lib/registry`, never a content module directly. When
this project eventually gets a database or CMS, only that one module changes.

### Why TypeScript data files instead of MDX or JSON

The product's core value is cross-referencing and filtering — "which builds use
this item", "which areas suit this build", "what is my next upgrade". That needs
a typed, queryable graph, not documents.

TypeScript gives compile-time checking across hundreds of entities, real
autocomplete while authoring, and zero build tooling. Long-form prose that needs
structure (the mechanics articles) is stored as typed `ContentBlock[]` rather
than a Markdown string, which keeps tables structured and item references inside
prose linkable and type-checked.

See [`docs/adr/0001-content-as-typescript.md`](docs/adr/0001-content-as-typescript.md).

---

## Adding content

### A new build

1. Create `content/builds/<slug>.ts` exporting a `Build`.
2. Add it to the array in `content/builds/index.ts`.
3. Run `npm run check:content`.

The route, the class page listing, the "builds that use this item" reverse index
on every item page, and the "builds that farm here" list on every area page all
appear automatically.

The type will require six `gearSets` covering `starter` through `bis`. That is
deliberate — a build documented only at best-in-slot is the exact failure this
project exists to avoid.

### A new item

Add a `UniqueItem` to `content/items/uniques.ts`. Write stat ranges as the game
rolls them (`+8-15% to Cold Skill Damage`), not as averages — knowing the range
is what tells a reader whether a drop is worth keeping.

Mark the one or two stat lines that actually motivate the item with
`notable: true`; the UI highlights those.

### A new runeword

Add a `Runeword` to `content/runewords/runewords.ts`. The validator enforces
that `runes.length === sockets` and that `requiredLevel` is at least the highest
constituent rune's level.

Fill in `bases.exclusions` with the mistakes people actually make. "Not spears —
polearms and spears are different item classes" has saved more bases than any
amount of correct information elsewhere on the page.

### A new farming area

Add a `FarmingArea` to `content/farming/areas.ts`.

**Take area levels from the game's own `levels.txt`, using the Expansion
columns** (`MonLvlEx`, `MonLvlEx(N)`, `MonLvlEx(H)`). The non-Expansion columns
in the same table describe Classic Diablo II and give materially different
numbers — Ancient Tunnels is 67 in Classic and 85 in D2R. The validator checks
that `hellLevel85` agrees with `levels.hell`.

### A new class

Add a `CharacterClass` to `content/classes/classes.ts`. Skills live in
`content/classes/<class>/skills.ts`; register them in `lib/registry`.

---

## Content standards

Accuracy beats coverage. Every number here is verified against a source, and the
site says so when something is not.

**Source hierarchy:**

1. The game's own data files — area levels, monster levels, base item stats
2. Blizzard official material — patch notes, The Arreat Summit
3. Structured community databases — cross-checked against each other
4. Current build guides — for consensus and playstyle, never as the sole source
   for a number

**When sources disagree, the page says so.** Two live examples: whether enemy
Lightning Resistance reduces Static Field, and how many statues the Colossal
Ancients recipe takes (Blizzard's own announcement contradicts itself). Both are
documented rather than resolved by guesswork.

Every entity carries a `confidence` field. `verified` is the baseline and is not
displayed; anything below it is labelled in the UI.

Unverified facts are tracked in
[`docs/research/00-game-state.md`](docs/research/00-game-state.md) so nothing
gets written on unstable ground.

### One thing worth knowing before you edit anything

**Diablo II has eight classes, not seven.** The Warlock shipped with *Reign of
the Warlock* in February 2026. Any source that lists seven predates the
expansion — which means it also predates the Terror Zone rework, the Colossal
Ancients, Grimoires and the loot filter. Class count is a useful freshness test
for any D2 material you consult.

---

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4

Every content page is a server component and prerenders to static HTML. The
search dialog is the only client component in the codebase — the mobile menu is
a native `<details>` element, and the gear-tier navigation is anchor links.

### Search

Global search (Ctrl/Cmd+K, or `/`) is built from the registry at build time and
emitted as a single static `/search-index.json`. The dialog fetches it lazily on
first open, so pages carry none of its weight.

Inlining the index into every page's RSC payload cost about 46KB per route —
nearly half the weight of a rune page, repeated across all 118 routes. Moving it
to a lazily-fetched static file cut the rune page from 103KB to 58KB.

The index carries nicknames alongside real names, because that is what people
type: `shako`, `hoto`, `soj`, `hdin`, `alvl 85`. Mechanics articles also index
their headings and callout titles, so searching `sunder` or `larzuk` finds the
article that explains them.

---

## Licence and attribution

Unofficial fan reference. Diablo II: Resurrected is a trademark of Blizzard
Entertainment. All content is written from scratch after researching and
reconciling sources; nothing is copied from another guide.
