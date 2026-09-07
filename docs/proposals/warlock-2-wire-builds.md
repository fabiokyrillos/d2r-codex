# Proposal: wire the Warlock's four builds

**From:** Agent C (Warlock), branch `claude/warlock-complete`
**To:** the coordinator
**Phase:** 3 of 5 — the four build pages, committed.
**Research:** [`docs/research/09-warlock.md`](../research/09-warlock.md) §11

Four pages authored, EN-US and PT-BR, against the roster you approved. This is
what has to change in files I do not own.

---

## A. Registration — one failing check, and it is exactly this

`npm run check` currently ends:

```
1 FAILED:
  - every build file was found and read — 46 of 42
EXIT=1
```

`scripts/allocations.test.ts` reads every `.ts` in `content/builds/` except
`index.ts` and `pt-br.ts` and requires the slug count to equal the registered
build count. There are now 47 files there; 46 carry a `slug:` and 42 are
registered. The four unregistered ones are mine. `pt-br-warlock.ts` carries no
`slug:` and is correctly not counted.

### A1. `content/builds/index.ts`

```ts
import { apocalypseWarlock } from "./apocalypse-warlock";
import { abyssWarlock } from "./abyss-warlock";
import { cleaveWarlock } from "./cleave-warlock";
import { bloodBoilWarlock } from "./blood-boil-warlock";
// ...
export const allBuilds: Build[] = [ ..., apocalypseWarlock, abyssWarlock, cleaveWarlock, bloodBoilWarlock ];
```

### A2. The pt-BR overlay

`content/builds/pt-br-warlock.ts` exports `warlockBuildsPtBr: Overlay<BuildCopy>`
keyed by build slug. Merge it into `buildsPtBr` in `content/builds/pt-br.ts`, or
spread it in `lib/registry/overlays.ts` where that map is already imported —
your call, and I did not want to reformat a literal you own.

---

## B. Free-text labels — the four Grimoires are done

All 22 of their picks are real `ref`s now, across both locales and the journey:
`ars-al-diablolos`, `ars-tor-baalos`, `ars-dul-mephistos`, `measured-wrath`.
Nothing left to convert for those four.

Two of your values corrected the prose rather than confirming it. `Ars
Tor'Baalos` publishes **+1.5 life per character level**, not the 12 I read out
of the raw `hp/lvl par=12` column — twelve eighths, and the item page has the
published form. And "it raises four of this build's six skills" was loose: the
tab raises all six, and it then names three of them again plus Consume for the
bound-demon package. Both fixed in both locales.

**One line to confirm on `ars-dul-mephistos`.** Your table lists the magic
pierce, +2 Warlock Skills, 20-30% FCR, 30% FHR and 10-25% MF. The pinned row
also carries `dmg% 70-115` and `att% 50-70`, and the Cleave page leans on both —
it calls that Grimoire the only one in the game that raises weapon damage, and
picks it over the Blasphemous Grimoire because of them. If the item entry does
not carry those two lines, the Cleave page is the only thing asserting them,
which is the quiet disagreement we just fixed for Rhyme and Splendor.

**Still labels, because they are not catalogued yet:** `Dreadfang`,
`Bloodpact Shard`, `Wraithstep`, `Entropy Locket`, `Sling`, `Opalvein`,
`Gheed's Wager`.

### The conversion table, for the seven that remain

Every gear pick that names one of the nine class uniques uses `label` free text,
as you asked, because those entries are not catalogued yet. **The exact strings
used, so a find-and-replace is safe:**

| Label string | Suggested slug | Appears on |
| --- | --- | --- |
| `Ars Al'Diablolos` | `ars-al-diablolos` | Apocalypse (optimized, bis), Cleave (optimized) |
| `Ars Tor'Baalos` | `ars-tor-baalos` | Blood Boil (budget, optimized, bis) |
| `Ars Dul'Mephistos` | `ars-dul-mephistos` | Apocalypse (budget, optimized), Abyss (budget, optimized, bis), Cleave (optimized, bis) |
| `Measured Wrath` | `measured-wrath` | all four, early-hell |
| `Dreadfang` | `dreadfang` | Cleave (budget, optimized, bis) |
| `Bloodpact Shard` | `bloodpact-shard` | Blood Boil (budget, optimized, bis) |
| `Wraithstep` | `wraithstep` | Blood Boil (optimized, bis) |
| `Entropy Locket` | `entropy-locket` | Abyss (early-hell, budget, optimized, bis) |
| `Sling` | `sling` | Abyss (early-hell, budget, optimized, bis) |
| `Opalvein` | `opalvein` | Blood Boil (budget) |
| `Gheed's Wager` | `gheeds-wager` | Abyss (optimized, bis) |

The pt-BR overlay repeats the same `label` strings at the same pick keys, so
both locales convert together.

**`Hellwarden's Will` is not referenced anywhere**, because it is not in
`uniqueitems.json` under that name (§11.5). Nothing waits on it.

## C. One slug I have used that my worktree does not have yet

`vigilance`, in three builds' early-hell and nightmare tiers. My branch predates
`dc2700c`, so my local validation reports it unresolved; you renamed it and it
will resolve at integration. Flagged so the miss is not read as an error.

Everything else resolves against the catalogue as my branch has it: every
`kind: "unique"` and `kind: "runeword"` ref in all four builds was checked
against `content/items/uniques.ts` and `content/runewords/runewords.ts`.

---

## D. Two corrections outside my files

### D1. The Bone Spear Necromancer page has a claim the expansion falsified

`content/builds/bone-spear-necromancer.ts` says, in its immunity section:

> "There is no Magic Mastery, no +% Magic Skill Damage on any item, and no
> sunder charm for magic."

The first and third clauses are still true. **The second is not.** Verified at
Tier 1 through `properties.json` and `itemstatcost.json` against the string
table:

```
extra-mag   -> passive_mag_mastery -> ModStrMagMastery -> "%+d%% to Magic Skill Damage"
pierce-mag  -> passive_mag_pierce  -> ModStrMagPierce  -> "-%d%% to Enemy Magic Resistance"
```

and both appear on shipped items:

```
Void (runeword)       extra-mag 10-15      Entropy Locket   extra-mag  5-10
Ars Dul'Mephistos     pierce-mag 10-20     Gheed's Wager    pierce-mag 3-7
Sling                 pierce-mag  3-5
```

So the expansion added +% Magic Skill Damage and −% to Enemy Magic Resistance to
the game, and every carrier is a Warlock item. The Necromancer's sentence was
correct when it was written and is now half wrong. `bone-spear-necromancer.ts`
is yours; the Abyss page states the new position and does not contradict the old
one by implication.

Worth noting the claim it does **not** touch: there is still no magic sunder
charm, so nothing here breaks a magic immunity. Both pages can keep saying that.

### D2. Composed runeword stats — folded in, flagged for the reverse direction

I used your composed numbers rather than the raw columns: **Coven at 26-40%
magic find** and **Ritual at 250-320% Enhanced Damage with 40% Increased Attack
Speed**. Anything that later quotes the raw `runes.json` block for those two will
disagree with both the item page and these builds.

---

## E. What the pages carry that you asked for

- **The immunity inversion leads both Chaos pages.** Apocalypse's `immunityPlan`
  says its own −40 fire pierce is skipped entirely against a still-immune monster
  rather than reduced, names the twelve-of-eighteen figure, and gives exactly two
  answers: a Flame Rift or the void package. Abyss's says the gear pierce is real
  and large and still does not break an immunity, and that no magic sunder charm
  exists. Each page names the other.
- **No `+2 Eldritch` item, stated plainly** on the Cleave page — in `weaknesses`,
  in the nightmare and early-hell off-hand reasons, and in the charm note, where
  grand charms are the only Eldritch-specific items in the game.
- **Aliases are search terms.** I have not put an `aliases` field on any of the
  four; the type carries none and inventing one would have been the thing we
  agreed not to do. If you want them searchable, `search-aliases` is your file
  and §11.7 has the list — with the page copy saying they are search terms
  rather than names.
- **`Latent Sunder Charm` is not mentioned on any page.** The five original
  sunder charms are, because they are catalogued and established.
- **No thrown package on the Cleave page**, per §11.2 and your note that refusing
  the package as well as the page is the part people get wrong. The file's header
  comment says why in two lines so the next reader does not re-propose it.

---

## F. Verification

- **Point budgets, machine-checked against `MAX_HARD_POINTS`:**

  | Build | Core | Package paths | Worst |
  | --- | --- | --- | --- |
  | Apocalypse | 63 | void 103, demon wall 104 | 104 |
  | Abyss | 83 | fire 103, ward 105 | 105 |
  | Cleave | 104 | — (6 in `flexPoints`) | 104 |
  | Blood Boil | 72 | goatmen 101, bound 105 | 105 |

  Every package group is `choose: "one"`, every path fits 110, and every
  remainder is named in a `remainderNote` or a `flexPoints` entry.
- **Prerequisite closure** holds for the core and for every package: no plan
  allocates a skill whose prerequisites it does not also hold.
- **Every `role: "synergy"` allocation has a real graph edge** into that plan's
  primary or a `main` skill — checked for cores and packages separately. The
  passives that are not synergies (Levitation Mastery, Enhanced Entropy, Demonic
  Mastery, Blood Oath's defensive half) are labelled `utility` and say so in
  their notes.
- **Six gear tiers on each build**, `starter` through `bis`, with nothing above
  its tier.
- **All twenty-four farming entries** point at catalogued area slugs, and every
  `why` is written against that area's recorded `commonImmunities`.
- **pt-BR parity: 468 translated strings compared, one identical to the source** —
  `sockets: "Tal Thul Ort Amn."`, which is a rune list and correctly invariant
  under ADR 0003. Every package, gear tier, gear pick, alternative, charm,
  weapon-swap, breakpoint, skill note and farming reason has a Portuguese twin at
  the right key.
- `npm run check` → **`EXIT=1`**, one failure, and it is §A: `every build file
  was found and read — 46 of 42`. Zero TypeScript errors of any kind — the 32
  pre-existing `PageProps` errors are gone from this run because the check now
  fails before `typecheck`. "All content references resolve. No integrity
  problems found."

Phase 4 (the journey) does not start until you say the items have landed.
