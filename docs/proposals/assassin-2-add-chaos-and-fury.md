# Proposal 2 — add Chaos and Fury to the runeword registry

**From** Agent A (Assassin), branch `claude/assassin-finish`
**Touches** `content/runewords/runewords.ts`, `content/runewords/pt-br.ts`
**Why** the Whirlwind Assassin page is built entirely on Chaos and neither
runeword is catalogued, so the page names both in `label` picks and cannot link
either

Fifty runewords are in the registry. These two are not, and one of them is the
only way any Assassin reaches Whirlwind at all. Until they land, the page's
weapon and off-hand picks are prose rather than references, `gatedBy` cannot be
used, and the reverse "builds that use this item" index has nothing to point at.

Everything below is transcribed from the pinned commit —
`blizzhackers/d2data` @ `fc469993502d0498809b9fc1af140ee2a9eb8902`,
`json/runes.json` and `json/misc.json` — and is what my page's prose already
quotes.

---

## Chaos

| field | value |
| --- | --- |
| `*Rune Name` | Chaos |
| `Name` | Runeword16 |
| `*RunesUsed` | `FalOhmUm` — `r19`, `r27`, `r22` |
| `itype1` | `h2h` — **claws only**, three sockets |
| `*Patch Release` | 110 |
| level requirement | **57**, from Ohm (`misc.json` `levelreq`: Fal 41, Um 47, Ohm 57) |

Stat block, from the `T1Code`/`T1Min`/`T1Max` columns:

| code | line |
| --- | --- |
| `demon-heal` | +15 Life after each Demon Kill |
| `dmg%` | +240–290% Enhanced Damage |
| `dmg-mag` | Adds 216–471 Magic Damage |
| `oskill` (`Whirlwind`) | +1 to Whirlwind |
| `swing2` | +35% Increased Attack Speed |
| `hit-skill` (`Frozen Orb`) | 9% Chance to cast level 11 Frozen Orb on striking |
| `hit-skill` (`Charged Bolt`) | 11% Chance to cast level 9 Charged Bolt on striking |

**Note the min/max convention on the last row**: `T1Min7 = 11`, `T1Max7 = 9`, so
the chance is 11% and the skill level 9 — the columns are chance and level, not
a range. The Frozen Orb row is 9% at level 11 the same way.

## Fury

| field | value |
| --- | --- |
| `*Rune Name` | Fury |
| `Name` | Runeword44 |
| `*RunesUsed` | `JahGulEth` — `r31`, `r25`, `r05` |
| `itype1` | `mele` — and `itemtypes.json` gives `h2h` the parent `Equiv1 = "mele"` and `h2h2` the parent `h2h`, **so a claw takes it** |
| `*Patch Release` | 109 |
| level requirement | **65**, from Jah (Jah 65, Gul 53, Eth 15) |

| code | line |
| --- | --- |
| `dmg%` | +209% Enhanced Damage |
| `swing2` | +40% Increased Attack Speed |
| `noheal` | Prevent Monster Heal |
| `openwounds` | 66% Chance of Open Wounds |
| `lifesteal` | 6% Life stolen per hit |
| `deadly` | 33% Deadly Strike |
| `skill` (id 147) | +5 to Frenzy (Barbarian only) |

The last line is class-scoped (`item_singleskill` carries `Save Param Bits 3`
and its tooltip is "+# to [Skill] ([Class] only)"), so it does nothing for an
Assassin. Worth saying on the page, because it is the largest-looking line on
the item.

---

## Availability — all three rows, and they are all the same word

Neither runeword carries `firstLadderSeason`, `lastLadderSeason` or
`disallowCraftingInLadder` in `runes.json`. Exactly one row in the file carries
the last of those and it is not one of these. So both take the same block:

```ts
availability: {
  rows: [
    { mode: "ladder", status: "craftable" },
    { mode: "non-ladder-online", status: "craftable" },
    { mode: "offline", status: "craftable" },
  ],
  notes: { … },
  // provenance as the other entries carry it
}
```

`npm run test:availability` requires one row per mode, always, and the notes and
provenance blocks that go with them — the shape is already enforced, so copying
an unrestricted neighbour is the safest route.

## Recommended bases

Both runewords need **three sockets in a claw**. From `weapons.json`, the claw
bases that take three are:

- normal — Blade Talons (−20 speed), Claws (−10), Scissors Katar (−10)
- exceptional — Greater Talons (−30), Greater Claws (−20), Quhab (0), Scissors Quhab (0)
- elite — Runic Talons (−30), Feral Claws (−20), Wrist Sword (−10), Suwayyah (0), Scissors Suwayyah (0)

Battle Cestus, War Fist, Hand Scythe, Katar, Cestus, Wrist Blade, Wrist Spike,
Fascia and Hatchet Hands take two at most and can never hold either. Runic
Talons ask 115 strength and 115 dexterity; Greater Talons 79 and 79.

## Once they land

Two edits to my page, which I am happy to make on request:

- `content/builds/whirlwind-assassin.ts` — the `weapon` and `offhand` picks in
  the `early-hell`, `budget`, `optimized` and `bis` tiers become
  `{ ref: { kind: "runeword", slug: "chaos" } }` and `… "fury"`, and the build
  gains `gatedBy: ["chaos"]`.
- `content/builds/pt-br-assassin.ts` — the matching pick keys lose their
  `label` fields, exactly as the other pages' entries do for referenced items.

Note that `build-claims.ts` compares an item's `requiredLevel` against the
tier's upper bound: Chaos at 57 is legal from `early-hell` (55–70) and Fury at
65 from `early-hell` too, so no tier needs moving.
