# ADR 0001 — Game content lives in TypeScript, not MDX or JSON

**Status:** Accepted
**Date:** 2026-08-30

## Context

This project will eventually hold hundreds of guides, hundreds of items, many
builds and several large structured datasets. The content format decision is
effectively irreversible once there is real volume, so it is worth getting right
before writing the second build guide.

The obvious candidates:

- **MDX** — prose-first, allows embedded React components
- **Markdown + frontmatter** — prose-first, portable, CMS-friendly
- **JSON** — data-first, portable, no build tooling
- **TypeScript data files** — data-first, typed, compile-time checked

## Decision

Game content lives in **TypeScript data files** under `content/`, typed against
models in `lib/types/`, and accessed exclusively through `lib/registry/`.

Long-form prose that needs structure (mechanics articles) is stored as a typed
`ContentBlock[]` discriminated union rather than a Markdown string.

## Why

**The product is a graph, not a document collection.** The features that make
this site worth building are all traversals: "which builds use this item",
"which areas suit this build", "what is my next upgrade at this gear tier",
"which runewords need this rune". Those are queries over typed relationships.
MDX would make each page easy to write and the graph impossible to maintain.

**Cross-references must not drift.** The brief is explicit that Spirit should
exist once and be referenced, not restated in twelve builds. That requires
referential identity — `{ kind: 'runeword', slug: 'spirit' }` — resolved at
render time. With MDX every mention would be prose, and every mention would
need updating when a stat changes.

**The compiler is free QA on a research-heavy project.** Accuracy is the whole
value proposition. A `Record<ProgressionTier, …>` map means adding a tier
produces compile errors at every site that must handle it. A union gaining a
member cannot be silently ignored. On a project where a wrong number is the
worst possible outcome, that is worth a great deal.

**Zero build tooling risk.** This runs on a brand-new Next.js major version.
Adding `@next/mdx`, `@mdx-js/loader` and a remark/rehype pipeline on top of a
just-released Turbopack default is avoidable risk for no gain we actually need.

**Prose is a small fraction of the content.** The bulk of what this site holds
is structured: stat lines, breakpoint rows, gear picks, area levels, skill
allocations. The genuinely prose-shaped content is the mechanics articles, and
those benefit from structure too — a `formula` block and a `table` block render
better than Markdown could, and item references inside them stay linkable.

## Consequences

**Good:**

- Every cross-reference is checked, either by the compiler or by
  `npm run check:content`
- Adding a build is one file plus one line; routing, reverse indexes and
  listings all derive automatically
- Content is tree-shaken into the pages that use it and prerendered to static
  HTML; no runtime data layer at all
- Refactoring a model is a compiler-guided exercise rather than a search

**Bad:**

- Authoring prose in template literals is less pleasant than writing Markdown
- Non-developers cannot contribute content without touching TypeScript
- Long content files (`blizzard-sorceress.ts` is already substantial) need
  splitting as they grow

**Mitigations:**

- A minimal `**bold**` inline formatter (`components/game/rich-text.tsx`) makes
  prose strings readable without pulling in a Markdown parser. It renders only
  `<strong>` around plain text and must not grow into a Markdown engine.
- If non-developer contribution becomes a requirement, the registry is the seam:
  swap its implementation for a CMS client and nothing above it changes.

## What would change this decision

If the site becomes majority long-form prose, or if non-developer authors need
to contribute directly, MDX becomes the better fit for the prose portion.
Structured game data should stay in TypeScript regardless — the two can coexist,
with MDX pages importing from the registry.
