# Proposal 2 — one slug override for the Barbarian

**From:** Agent B (Barbarian), branch `claude/barbarian-complete`
**To:** the coordinator. `scripts/skill-graph-rules.ts` is yours; this is the
decision record for the one line I am asking for, and for the twenty-nine I am
not.

**Decide this before `npm run gen:skill-graph`.** It goes one of two ways and
both are cheap, but the branch is already authored against one of them.

---

## The ask

```ts
"Pole Arm Mastery": "polearm-mastery",
```

## The evidence

`skills.txt` calls the row `Pole Arm Mastery`. `skilldesc.json` gives it
`str name = skillname134`, and `json/allstrings-eng.json` at the pinned commit
resolves that to:

```
skillname134 = Polearm Mastery
```

One space, and the shipped game does not have it. `slugFor` would publish
`/classes/barbarian/skills/pole-arm-mastery`.

Pinned by its own row rather than by resemblance, in the style the existing
overrides use:

| | |
| --- | --- |
| page | 2 (Combat Masteries) |
| row, column | 2, 1 |
| level | 6 |
| `passiveitype` | `pole` — the item type the game calls "Polearm" |
| `passivestat1/2/3` | `passive_mastery_melee_th` / `_dmg` / `_crit` |
| `str long` | "passive - improves polearm skill" |

## Why it is the `Clay Golem` case, not a new one

`SLUG_OVERRIDES` already carries three entries created by exactly this: `Clay
Golem` is spelled with a space in the tables and `BloodGolem`, `IronGolem` and
`FireGolem` are not, and the file's own comment calls that "an artifact of how
the rows were typed rather than anything a player sees". This is the same
artifact with the sign flipped — a space where the shipped name has none.

It is emphatically **not** the Druid or Assassin case. Nothing here is a working
title and nothing names a different concept. A reader who lands on
`pole-arm-mastery` will know what they are looking at; they will simply never
have typed it, and neither will any guide or database.

## The twenty-nine I am not asking for

Every other Barbarian identifier is byte-identical to its `str name`. Two were
checked specifically because they looked like candidates:

| Identifier | Suspicion | What the string table says |
| --- | --- | --- |
| `Blade Mastery` | that it ships as "Sword Mastery" | `skillname127 = Blade Mastery`. Its own description — "improves swords and daggers fighting skill" — explains the name: `passiveitype = blde`, the type the game calls "Swords and Knives" |
| `Battle Command` | that `str alt` = "Battle Cmd" is a second name | `str alt` is a short label for a narrow UI element. `skillname155 = Battle Command`, and every other Barbarian row's `str alt` is simply its full name repeated |

## If you decline

Say so and I will change three strings on my branch — the `slug` in
`content/classes/barbarian/skills.ts`, the key in
`content/classes/barbarian/pt-br.ts`, and one reference in
`docs/research/08-barbarian.md`. It is a five-minute change and it must happen
**before** you generate, not after: the branch currently authors
`polearm-mastery`, so generating without the override produces one
`orphan-skill` and one `orphan-node` in `check:content`.

The mismatch is loud rather than silent, which is the point of the rule. But it
is still a mismatch, so this file exists to make the choice explicit rather than
letting a generator run decide it.
