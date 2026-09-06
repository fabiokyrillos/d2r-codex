# Proposal 1 — wire the Whirlwind Assassin into the shared registries

**From** Agent A (Assassin), branch `claude/assassin-finish`
**Owns** `content/builds/whirlwind-assassin.ts`, `content/builds/pt-br-assassin.ts`
**Blocks** the seventh Assassin page from rendering, routing, searching or
appearing in the sitemap

Three lines in two coordinator-owned files, plus one counter in a
coordinator-owned test. Nothing else on my branch touches any of them: I applied
the first three locally to verify the gates and reverted them before committing,
so `git status` on my branch is clean and the diff below is yours to apply.

---

## 1. `content/builds/index.ts` — two lines

Add the import beside the other Assassin builds:

```ts
import { whirlwindAssassin } from "./whirlwind-assassin";
```

and append the build to the registry array, after `dragonTail`:

```ts
export const builds: Build[] = [ … bladeFury, dragonTail, whirlwindAssassin];
```

Routing, the class listing, the reverse item index, the build filters, search
and the sitemap all derive from this array, so this line is the whole wiring.

## 2. `lib/registry/overlays.ts` — one import and one spread

`content/builds/pt-br.ts` is yours and I did not append to it. The pt-BR copy
for this page lives in a new file with the same `Overlay<BuildCopy>` shape:

```ts
import { buildsPtBr } from "@/content/builds/pt-br";
import { assassinBuildsPtBr } from "@/content/builds/pt-br-assassin";
```

and, in `OVERLAYS`:

```ts
  builds: { "pt-br": { ...buildsPtBr, ...assassinBuildsPtBr } } as Partial<
    Record<Locale, Overlay<BuildCopy>>
  >,
```

The two objects have disjoint keys — `assassinBuildsPtBr` carries exactly one,
`"whirlwind-assassin"` — so the spread order does not matter and no existing
entry is shadowed. If you would rather fold the entry into `pt-br.ts` and delete
my file, the object is a drop-in: it is keyed by build slug like every other
entry in that file.

## 3. `scripts/build-page.test.ts` — one counter, and it is a real gate

Line 417 asserts how many built pages carry a package section:

```ts
  check(
    "the sweep read the pages that publish packages, in both locales",
    pagesWithPackages === 16 && routesChecked === 48,
```

The Whirlwind Assassin publishes a package group, so with Proposal 1 applied
this becomes **18 pages and 54 routes** — one page per locale and three routes
each. Without the bump, `npm run check:built` fails with

```
x the sweep read the pages that publish packages, in both locales — 18 pages, 54 routes
```

which is the assertion doing its job: it exists so that a page silently losing
its package section cannot pass. The literal has to move with the catalogue.

I verified the rest of `build-page.test.ts` passes on the new page unchanged —
the tree legend reports the core alone at 67, and no package total is ever
rendered as though it were mandatory. It is 1 failure of 1023, and it is only
this counter.

---

## What passes once these land

Verified locally with the wiring temporarily applied, then reverted:

```
npm run check       EXIT=0
npm run build       EXIT=0
npm run check:built EXIT=1 — 1 failure of 1023, the counter in item 3 above
```

`check:content` counts 43 builds and 43/43 overlays; `test:search` finds
"Whirlwind Assassin" in both locales; `test:allocations` reports
`whirlwind-assassin 67/110`.

## What still fails without them

Nothing fails — it simply does not exist. With the wiring reverted the build
object and its overlay are unreferenced modules, every gate stays green at 42
builds, and the page does not render. `scripts/assassin.test.ts` imports
`whirlwindAssassin` from its module rather than from the registry precisely so
its checks keep running while this proposal is outstanding.
