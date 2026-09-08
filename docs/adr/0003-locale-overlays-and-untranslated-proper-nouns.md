# ADR 0003 — Locale overlays, and game proper nouns stay in English

**Status:** Accepted
**Date:** 2026-08-30

## Context

The site had to become bilingual: en-US as the editorial source, pt-BR as a
complete translation. Two problems had to be solved separately, because they
have opposite requirements.

**The data problem.** A rune's number is the same in every language. `Ral` is
`Ral`, it is rune 8, it drops from the Countess, and it gives 30% fire
resistance in a shield. Duplicating the entire rune record per locale would mean
that every future correction to a drop level, a required level, or a cross-
reference has to be made twice — and would silently rot the moment someone
forgets. But the *explanation* of that rune genuinely differs per language, and
is not a mechanical translation of a string.

**The naming problem.** Diablo II: Resurrected ships an official pt-BR
localisation. We have not verified its exact strings against a primary source.
Writing "Salto Congelante" for Frozen Orb would be inventing a translation and
asserting it as official — which is exactly the kind of confident-but-unverified
claim this project exists to avoid. Worse, a Brazilian player reading a guide
has to find the thing in their own game client, in their own trade channel, in
their own community's vocabulary.

## Decision

### 1. Invariant data lives once; localized copy is a slug-keyed overlay

Every content domain keeps a single source-of-truth array holding numbers,
slugs, IDs, refs and relations — plus the en-US copy, inline. Other locales
supply an *overlay*:

```ts
type Overlay<T> = Record<Slug, T>;
```

`lib/registry/localize.ts` merges an overlay onto the invariant records at read
time. `lib/registry/overlays.ts` maps domain → locale → overlay. en-US is
deliberately **absent** from that map: `localize` short-circuits to the identity
for the source locale, so the source language cannot drift from itself and there
is no en-US overlay to keep in sync.

Copy types (`lib/types/copy.ts`) contain *only* the localizable fields. It is a
type error to put a number in one.

Nested and positional content is addressed by stable keys rather than by
duplicating structure: gear picks by `${slot}-${index}` (alternatives
`-alt${n}`), breakpoint rows by `${stat}-${value}`, farming notes by
`${area}-${difficulty}`. Genuinely authorial fixed-length lists — a stage's
`actions`, a mercenary's `abilities` — are merged positionally.

### 2. UI strings are a typed dictionary with compile-time completeness

`lib/i18n/dictionaries/en-us.ts` is `as const`. Its type is widened to `string`
and exported as `Dictionary`:

```ts
type Widen<T> = T extends string ? string : { [K in keyof T]: Widen<T[K]> };
export type Dictionary = Widen<typeof enUS>;
```

`pt-br.ts` is annotated `: Dictionary`. A missing key, an extra key, or a
restructured section is a compile error — "zero missing translation keys" is
enforced by `tsc`, not by a runtime scan.

Content overlays cannot use that trick (slugs are data, not types), so
`npm run check:content` reports per-domain coverage and fails on an orphan
overlay slug.

### 3. Locale reaches components via `next/root-params`, not props

The root layout is `app/[lang]/layout.tsx`, so `lang` is a root param. Server
Components call `getLocale()` / `getDictionary()` from `lib/i18n/server.ts`
directly rather than threading a locale through every prop signature.

This forces a module boundary: `next/root-params` is server-only, so anything a
Client Component can import must not touch it. Hence the split —
`lib/i18n/index.ts` (client-safe: `dictionaryFor`, `alternatesFor`, `fmt`) vs
`lib/i18n/server.ts`, and `lib/search/scoring.ts` (dependency-free) vs
`lib/search/index.ts`. Client Components receive their strings as props.

### 4. Game proper nouns stay in English in both locales

Untranslated, in every language:

- skill names — Blessed Hammer, Frozen Orb, Holy Shield
- rune names, runeword names — Ral, Spirit, Insight, Enigma
- unique and set item names — Shako, Skin of the Vipermagi, The Oculus
- area, act, monster and NPC names — Chaos Sanctuary, Countess, Akara
- stat lines quoted from the game — "+2 to All Skills", "Faster Cast Rate"
- base item types — Crystal Sword, Monarch, Flail

Translated: everything the site itself wrote. Explanations, guidance, warnings,
labels, headings, metadata, the reasoning attached to a gear pick.

Where a preserved term is genuinely opaque, pt-BR **explains it on first use in
context** rather than replacing it. The stat line stays `Faster Cast Rate`; the
sentence around it explains what it does.

### 5. The UI strings that legitimately read the same in both languages

The rule above is a policy, and a policy nobody can check is a policy that
erodes. A pt-BR dictionary string byte-identical to its en-US twin is either a
term this decision keeps in English or a translation nobody did, and from the
file alone the two are indistinguishable — `mercenaries.tierEndgame` said
"endgame" beside `tierBudget` "econômico" and `tierMid` "intermediário" for as
long as the mercenary page existed.

So the sanctioned coincidences are enumerated here, once, and
`scripts/dictionary.test.ts` reads this list rather than carrying its own copy.
Every identical pair must appear below; every entry below must still be an
identical pair. A new coincidence fails the gate until someone writes it in,
which is the point at which the decision actually gets made. Strings with no
letters once placeholders are removed — `#`, `30+`, an act number — carry no
language to translate and are outside the rule.

Four reasons, and every entry has exactly one.

<!-- BEGIN:invariant-strings -->

**Game proper nouns and strings quoted from the game.** Section 4's own
categories: quest, release, difficulty and mode names, stat lines, attribute
names, base item types, and the game's own word for a monster class.

- `Attack rating`
- `bases`
- `charms`
- `Charms`
- `Den of Evil`
- `Dexterity`
- `Diablo II`
- `Energy`
- `Faster Block Rate`
- `Faster Cast Rate`
- `Faster Hit Recovery`
- `Hardcore`
- `Hell`
- `Hellforge`
- `Increased Attack Speed`
- `Ladder`
- `Lam Esen's Tome`
- `Lord of Destruction`
- `Mana`
- `Nightmare`
- `NM`
- `Non-Ladder, online`
- `Normal`
- `Offline`
- `Prison of Ice (Anya)`
- `Radament's Lair`
- `Reign of the Warlock`
- `Resurrected`
- `Sockets`
- `Sockets:`
- `Strength`
- `super unique`
- `Terror Zones`
- `The Fallen Angel (Izual)`
- `The Golden Bird`
- `Tools of the Trade`
- `Ubers`
- `Vitality`

**Community protocol.** The vocabulary a Brazilian player uses in their own
trade channel and their own Discord. Translating these would leave the reader
holding a word nobody they play with says — the same argument section 4 makes
for item names, applied to the words around them.

- `Best in Slot`
- `BiS`
- `Breakpoints`
- `Build`
- `Builds`
- `{count} build`
- `{count} builds`
- `Buff`
- `DLC`
- `Farm`
- `Frames`
- `Magic find`
- `Quest`
- `Respec`
- `Runeword`
- `Runewords`
- `Skill`
- `Skills`
- `{count} skills`
- `Solo self-found`

**Spelled the same in Portuguese.** Nothing to translate; the word is already
the Portuguese one.

- `Aura`
- `Chance`
- `Classes`
- `Item`
- `Menu`

**This site's own name, and format strings.**

- `D2 Codex`
- `%s · D2 Codex`
- `{seconds}s`

<!-- END:invariant-strings -->

## Why

**Numbers translated twice are numbers wrong once.** The overlay split means a
drop-level correction touches exactly one file. This directly implements the
project's data-quality rule: there is one place a mechanical fact can be wrong,
so there is one place to fix it.

**The player has to find the thing in their game.** A pt-BR guide that says
"procure um Elmo de Arlequim" leaves the reader searching a trade channel where
everyone says "Shako". Item and skill names are effectively the shared protocol
of the D2 community, and that protocol is English even among Brazilian players.

**We do not know the official strings.** Blizzard's pt-BR client has its own
translations. Guessing at them would produce text that is *neither* the English
the community uses *nor* the Portuguese the client shows — the worst of both.
Not inventing them is the honest option, and it is consistent with the rule that
this project documents uncertainty instead of papering over it.

**Compile-time beats a linter for UI strings.** The `Widen` trick makes the
translation contract part of the type system. There is no scan to run, no report
to read, and no way to ship a page with a missing label.

## Consequences

- Adding a locale is: one entry in `LOCALES`, one dictionary file (typed
  `Dictionary`, so `tsc` lists every missing key), one overlay file per content
  domain, and one key per domain in `OVERLAYS`. Nothing else changes — routes,
  sitemap, hreflang and `generateStaticParams` all derive from `LOCALES`.
- pt-BR pages legitimately contain English tokens. This is intended and is the
  one carve-out from "no page mixes languages": proper nouns and quoted game
  strings only, never whole sentences.
- Copy overlays must be kept structurally aligned with the invariant records
  where merging is positional. `check:content` catches slug drift; it cannot
  catch a reordered `actions` array, so those lists are treated as authorial and
  stable.
- Search indexes the active locale only, and folds accents
  (`NFD` + strip diacritics) so a Brazilian reader typing without accents still
  matches. English nicknames stay searchable in pt-BR — the pt-BR nickname set
  is a superset of the en-US one, not a replacement.
- `lib/routes.ts` is the single place a URL is built. Nothing constructs a
  locale prefix by hand.

## What would change this decision

If Blizzard's official pt-BR strings were verified against a primary source
(a client data dump, or the official localised bestiary), the right change is
**not** to replace the English names — it is to show both, English first, with
the official pt-BR in parentheses on first mention. The community protocol
argument stands regardless of whether an official translation is known.

If a third locale ever needs a different *slug* for a page — it will not, slugs
are stable and identical across languages by design — that is a routing change,
not an overlay change, and would need its own ADR.
