# Proposal 3 — one search-alias row for the Whirlwind Assassin

**From** Agent A (Assassin), branch `claude/assassin-finish`
**Touches** `lib/search/index.ts`, the Assassin block of `ALIASES`
**Priority** low — the page is already findable by its own name in both locales
once Proposal 1 lands; this is the row that catches what players actually type

Add, after the `dragon-tail` row:

```ts
  "whirlwind-assassin":
    "wwsin ww sin whirlwind assassin whirlwind sin chaos claw chaossin oskill assassin giro rodopio assassina de giro garra chaos",
```

## Why these tokens and not others

- **`wwsin`** is the name the research doc's roster table records for this build
  (§4, row 8) and the one the community uses.
- **`chaossin`** and **`chaos claw`** are the item-first names, which is how
  players find a build whose skill is not in the class's own tree.
- **`giro`**, **`rodopio`** and **`assassina de giro`** are the pt-BR forms.
  `girar` is deliberately absent: it is a common verb and would match prose all
  over the Portuguese catalogue.
- **`oskill assassin`** because that is the mechanic the page is about, and no
  other page on the site would answer that search.

## Collisions checked

- `chaos` alone is **not** added. It would steal the search from the Chaos
  Sanctuary farming page, which is a real page with that name — the same reason
  the file already refuses `mosaic` on the Phoenix Strike row.
- `ww` alone is **not** added. The file's own comment rejects two-letter tokens
  ("`ls` and `ds` are deliberately absent: two-letter tokens match half the item
  list"), and `ww` would behave the same way.
- `whirlwind` on its own is safe today because there is no Barbarian class in
  the content tree. **If Agent B lands a Barbarian Whirlwind skill page, the
  bare token should move to that page and this row should keep only the
  qualified forms** — a skill page and a build page competing for the same word
  is exactly what the Phoenix Strike comment warns about.
- `claw mastery` is **not** added, even though it is this build's `primarySkill`.
  It is a skill page of its own, and `checkAliasesAreNotPages` exists to refuse
  an alias that is another entity's page name.

## Verified without it

`npm run test:search` passes as it stands. Its per-build assertion is that
searching the build's own name finds the build, and "Whirlwind Assassin" is
found first in both locales with no alias row at all. This proposal only widens
the net.
