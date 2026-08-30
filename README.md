# D2 Codex

A progression-first companion for **Diablo II: Resurrected**, built around one
question: *what should I do next?*

Most build guides open on a best-in-slot loadout you do not own. This one
documents every build at six gear tiers, so the page is useful whether you are
level 12 with a vendor staff or level 95 hunting a perfect roll.

**Current baseline:** Patch 3.3 · Ladder Season 15 · *Reign of the Warlock*

Published in English (`/en-us/…`) and Brazilian Portuguese (`/pt-br/…`).

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
app/
  [lang]/     Every public route. Server components only — no client JS
              on content pages.
  sitemap.ts  Both locales, with hreflang alternates
proxy.ts      Redirects `/` and any unprefixed path to a locale
components/
  ui/         Layout and presentation primitives (Card, Badge, DataTable…)
  game/       Domain components (ItemRefLink, RuneSequence, GearProgression…)
  layout/     Site shell, including the language switcher
content/      All game data, as typed TypeScript
              <domain>/*.ts     invariant data + en-US copy
              <domain>/pt-br.ts pt-BR copy overlay, keyed by slug
lib/
  types/      Domain models — copy.ts holds the localizable-fields types
  registry/   The single data-access layer; every getter takes a Locale
  i18n/       Locale config, UI dictionaries, and the server-only locale reader
  search/     scoring.ts (client-safe) + index.ts (built from the registry)
  routes.ts   The only place a URL is constructed
  labels.ts   Display labels for every string-literal union
docs/
  research/   Where the numbers came from, and what is still unverified
  adr/        Architecture decisions and their reasoning
scripts/      Content validation and translation-coverage reporting
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

**4. A mechanical fact is written once, in one language.**
Numbers, slugs, refs and relations live in the invariant record. Translations
supply prose only. A drop-level correction touches exactly one file, no matter
how many languages the site ships.

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
3. Add a `BuildCopy` entry to `content/builds/pt-br.ts`.
4. Run `npm run check:content`.

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

1. Add a `CharacterClass` to `content/classes/classes.ts`.
2. Create `content/classes/<class>/skills.ts` exporting `<class>Skills` and
   `<class>Trees`.
3. Add both to the arrays in `content/classes/index.ts`.
4. Add the pt-BR copy to `content/classes/pt-br.ts` and
   `content/classes/skills-pt-br.ts`.

`lib/registry` and every page that consumes skills stay untouched. Skill slugs
must be globally unique, not just unique within a class — the registry throws on
a duplicate at module load.

### A new leveling journey

Create `content/progression/<class>-journey.ts` exporting a `ProgressionJourney`,
add it to `content/progression/index.ts`, and add a `JourneyCopy` entry to
`content/progression/pt-br.ts`.

Write stages, not levels. Ninety-nine pages would be unreadable, and the
decisions that actually matter cluster tightly around skill unlocks (1/6/12/18/
24/30), quest rewards and difficulty transitions — put every stage boundary on
one of those. The validator warns if stages leave a gap in level coverage.

---

## Languages

The site ships in **en-US** and **pt-BR** on explicit, indexable URLs:
`/en-us/runewords/spirit` and `/pt-br/runewords/spirit`. Slugs are identical
across languages — only the prefix changes — so the language switcher in the
header always lands on the same page you were reading, and `hreflang` pairs are
trivially correct.

`proxy.ts` redirects `/` and any unprefixed path to a locale: the cookie the
switcher sets if there is one, otherwise the browser's `Accept-Language`,
otherwise en-US. It is a 307, not a 308, so the first visit is never cached as
permanent.

### Invariant data vs localized copy

en-US is the editorial source and lives inline with the data. Other locales
supply an **overlay** — a slug-keyed record of *only* the fields that are prose:

```ts
// content/runes/runes.ts — invariant, written once
{ slug: 'ral', number: 8, requiredLevel: 19, dropsFrom: [...],
  summary: 'The fire-resistance rune…' }

// content/runes/pt-br.ts — copy only
{ ral: { summary: 'A runa de resistência a fogo…' } }
```

Copy types live in `lib/types/copy.ts` and contain no numbers by construction —
putting one there is a type error. `lib/registry/localize.ts` merges the overlay
at read time; `npm run check:content` reports coverage per domain and fails on an
overlay slug that no longer exists.

Nested content is addressed by stable keys rather than duplicated structure:
gear picks by `${slot}-${index}` (alternatives `-alt${n}`), breakpoint rows by
`${stat}-${value}`, farming notes by `${area}-${difficulty}`.

### UI strings

`lib/i18n/dictionaries/en-us.ts` is `as const`; its type is widened to `string`
and exported as `Dictionary`. `pt-br.ts` is annotated with it, so a missing key,
an extra key, or a restructured section is a **compile error**. There is no
runtime check for missing translations because there cannot be a missing one.

Server Components read the locale from `next/root-params` via
`lib/i18n/server.ts` — no prop drilling. That module is server-only, which is
why `lib/i18n/index.ts` (client-safe) and `lib/search/scoring.ts`
(dependency-free) exist as separate entry points. Client Components take their
strings as props.

### What is *not* translated

Skill names, rune and runeword names, unique and set item names, area and NPC
names, base item types, and stat lines quoted from the game all stay in English
in both locales — `Blessed Hammer`, `Shako`, `Chaos Sanctuary`,
`+2 to All Skills`. Brazilian players trade, search and read patch notes using
those names, and the official pt-BR client strings have not been verified
against a primary source, so inventing them would be exactly the kind of
confident guess this project avoids. pt-BR explains an opaque term in the
sentence around it instead of replacing it.

See [`docs/adr/0003-locale-overlays-and-untranslated-proper-nouns.md`](docs/adr/0003-locale-overlays-and-untranslated-proper-nouns.md).

### Adding a locale

1. Add it to `LOCALES` in `lib/i18n/config.ts`, plus its `BCP47`, `OG_LOCALE`
   and display-name entries.
2. Create `lib/i18n/dictionaries/<locale>.ts` typed `: Dictionary`. `tsc` will
   list every key you still owe.
3. Create `content/<domain>/<locale>.ts` for each domain and register them in
   `lib/registry/overlays.ts`.
4. Run `npm run check:content` — it prints per-domain coverage for every locale.

Routes, `generateStaticParams`, the sitemap, `hreflang`, the switcher and the
search index all derive from `LOCALES`. Nothing else needs touching.

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

Every content page is a server component and prerenders to static HTML, in both
languages. The search dialog and the language switcher are the only client
components in the codebase — and the switcher renders real `<Link>` elements, so
it is crawlable and works with JavaScript disabled. The mobile menu is a native
`<details>` element, and the gear-tier navigation is anchor links.

### Search

Global search (Ctrl/Cmd+K, or `/`) is built from the registry at build time and
emitted as one static index per locale — `/en-us/search-index.json` and
`/pt-br/search-index.json`. The dialog fetches the active language's index
lazily on first open, so pages carry none of its weight and you never get
results in the wrong language.

Inlining the index into every page's RSC payload cost about 46KB per route —
nearly half the weight of a rune page, repeated across every one of them. Moving
it to a lazily-fetched static file cut the rune page from 103KB to 58KB.

The index carries nicknames alongside real names, because that is what people
type: `shako`, `hoto`, `soj`, `hdin`, `alvl 85`. Those stay searchable in
pt-BR — the pt-BR nickname set is a superset of the English one, not a
replacement — and queries are accent-folded, so `maldicao` finds `maldição`.
Mechanics articles also index their headings and callout titles, so searching
`sunder` or `larzuk` finds the article that explains them.

---

## Licence and attribution

Unofficial fan reference. Diablo II: Resurrected is a trademark of Blizzard
Entertainment. All content is written from scratch after researching and
reconciling sources; nothing is copied from another guide.
