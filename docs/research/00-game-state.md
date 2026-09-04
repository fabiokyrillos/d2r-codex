# Current game state (research baseline)

**Researched:** 2026-08-30
**Applies to:** Diablo II: Resurrected, Patch 3.3 / Ladder Season 15

> This file is the single source of truth for "what version of the game are we
> documenting". Everything in `content/` should be written against this baseline.
> When a new patch lands, update this file **first**, then audit affected content.

## Version baseline

| Fact | Value | Confidence |
| --- | --- | --- |
| Current patch | 3.3 (client update 1.39) | High |
| Current ladder season | Season 15 | High |
| Season 14 ended | 2026-08-17, 11:00 PDT | High |
| Patch 3.3 rollout | 2026-08-18 | High |
| Season 15 start | 2026-08-21, 17:00 PDT | High |
| Expansion | *Reign of the Warlock* (launched with Season 13, Feb 2026) | High |

Blizzard also stated the patch/ladder cadence changed starting with this season:
patch rolls out a few days *before* the ladder reset rather than simultaneously.

## Playable class roster — 8 classes

**This is the single most important correction versus pre-2026 knowledge.**
Diablo II had 7 classes for 25 years. It now has 8.

| Class | Source | Notes |
| --- | --- | --- |
| Amazon | Base game | |
| Assassin | Lord of Destruction | |
| Barbarian | Base game | |
| Druid | Lord of Destruction | |
| Necromancer | Base game | |
| Paladin | Base game | |
| Sorceress | Base game | |
| **Warlock** | **Reign of the Warlock (paid DLC)** | First new class in 25 years |

The Warlock requires purchasing *Reign of the Warlock* ($25 standalone, or $40
"Infernal edition" bundled with D2R). Any Warlock content on this site must be
clearly marked as requiring the DLC.

## The Warlock

A caster class themed on forbidden Vizjerei magic.

### Class passive (unique mechanic)

The Warlock **levitates** the weapon in their right hand rather than holding it.
This means the Warlock is **the only class that can equip a two-handed weapon and
an off-hand simultaneously**. This has large implications for gear planning and
means generic "2H vs 1H+shield" advice does not apply to this class.

### Skill trees

| Tree | Theme |
| --- | --- |
| **Demon** | Enslave/bind demons as minions — Goatmen, Tainted, Defiler. Mastery allows binding any demon encountered, or consuming a bound demon to drain its life force and augment the Warlock. |
| **Eldritch** | Imbues weapons with mind magic and hexes (cripple, drain, gore explosion). Higher tiers create ethereal weapon duplicates or throw weapons at range. |
| **Chaos** | Ranged hellfire/void. Conjures **Miasma** (entropy projectiles); capstones include **Apocalypse** and **Abyss** (draws in and annihilates nearby enemies). |

> **Unverified:** exact skill lists, synergies, level requirements, and numeric
> values per tree. Blizzard's announcement is prose, not a skill table. Do not
> write Warlock skill numbers until verified against an in-game source or a
> detailed community skill database.

### Grimoires (new item type)

The Warlock's off-hand item class. Grimoires can roll Warlock staff-mods, plus a
random inherent elemental weapon damage affix (Fire *or* Magic), analogous to the
Necromancer Shrunken Head's inherent poison damage.

Five variants per quality tier:

| Normal | Exceptional | Elite |
| --- | --- | --- |
| Old Book | Burnt Text | Forgotten Volume |
| Tome | Dark Tome | Occult Tome |
| Codex | Dark Codex | Occult Codex |
| Compendium | Possessed Compendium | Blasphemous Compendium |
| Grimoire | Possessed Grimoire | Blasphemous Grimoire |

## New endgame: Colossal Ancients

A new pinnacle boss encounter added by *Reign of the Warlock*.

**Access:** Killing a **terrorized Act boss** at the end of a Terror Zone run has
a chance to drop a **statue**. Statues are combined in the **Horadric Cube** to
open the encounter.

> **Contradiction in the source — do not state a number with confidence.**
> Blizzard's own announcement says both "used once in combination with all five
> *other* statues" (implying 6) and "combine all five statues in the Horadric
> Cube" (implying 5). Until this is verified in-game, the site should say
> "one statue from each terrorized Act boss" and avoid asserting a count.

**Encounter design:** A gauntlet. Killing one Ancient makes the survivors stronger
and unlocks additional abilities on them, so the fight ramps as it progresses.

**Rewards:** A **Unique Jewel** determined by which Ancient you killed *last*.
Each Ancient can drop one of two jewels:

| Ancient | Jewels |
| --- | --- |
| Talic | Defender's Fire, Defender's Bile |
| Korlic | Protector's Frost, Protector's Stone |
| Madawc | *not captured in source — verify* |

All these jewels **require level 75**, and behave like Gheed's Fortune: **only one
may be equipped across all your items at a time** (stash/inventory holding is
unrestricted).

## Terror Zone changes

Terror Zones were substantially reworked by the expansion and tuned again in 3.3.

### Rotation

- Rotation shortened from **every hour to every 30 minutes**.
- Zones rotate in defined **groups** rather than singletons, e.g.
  "Burial Grounds + The Crypt + The Mausoleum", "Crystalline Passage + Frozen
  River", "Worldstone Keep + Throne of Destruction + Worldstone Chamber".

### Act terror consumables

Players can earn consumables that **choose which Act becomes terrorized**. While
an Act is terrorized, *every* zone in it is enhanced — higher difficulty, better
rewards.

### Heralds of Terror

In **Hell difficulty only**, Terror Zones spawn **Heralds of Terror** — hunters
that actively stalk the player. Each successive Herald that reaches you is
**exponentially more dangerous** than the last. Heralds have **tiers**; patch 3.3
increased rare-or-better drop chance from **Tier 3+**.

### Patch 3.3 Terror Zone / Colossal Ancients tuning

- Increased chance of Rare-or-better items from Herald Tier 3+.
- **Latent Sunder Charm** minimum drop level raised **69 → 75**.
- Latent Sunder Charm drop rate **reduced when using Magic Find** (Herald drop
  rate unaffected).
- Latent Sunder Charms from Magic Find now drop in **Hell difficulty only**.
- An additional item now drops alongside a **Worldstone Shard**.
- Worldstone Shard drop rate reduced.
- Ancient Statue drop rate reduced.

> **Unverified:** what Latent Sunder Charms and Worldstone Shards actually *do*.
> They are clearly distinct from the original Sunder Charms. Needs research before
> any mechanics page is written.

## New runewords (Reign of the Warlock)

| Runeword | Runes | Base |
| --- | --- | --- |
| Authority | Hel + Shael + Ral | 3-socket body armor |
| Coven | Ist + Ral + Io | 3-socket helm |
| Void | Thul + Zod + Ist | 3-socket dagger |
| Vigilence *(sic — Blizzard's spelling)* | Dol + Gul | 2-socket shield |
| Ritual | Amn + Shael + Ohm | 3-socket dagger |

> **Unverified:** the stat lines and level requirements of these runewords.

## New unique items (Reign of the Warlock)

| Unique | Base |
| --- | --- |
| Ars Al'Diablolos | Blasphemous Grimoire |
| Ars Tor'Baalos | Blasphemous Compendium |
| Ars Dul'Mephistos | Occult Tome |
| Measured Wrath | Burnt Text |
| Dreadfang | Legend Sword |
| Wraithstep | Mirrored Boots |
| Bloodpact Shard | Mithril Point |
| Opalvein | Ring |
| Sling | Ring |
| Entropy Locket | Amulet |
| Gheed's Wager | Troll Belt |
| Hellwarden's Will | Death Mask |

> Blizzard's page spells it "Blapshemous" in the unique list but "Blasphemous" in
> the Grimoire table. Treated as a typo in the source; using "Blasphemous".

## Patch 3.3 ladder → non-ladder migration

Eight previously ladder-only runewords became available in Non-Ladder with Season 15:
Mania, Hysteria, Metamorphosis, Ground, Temper, Hearth, Cure, Bulwark.

This matters for the site's Ladder/Non-Ladder distinction — these are **no longer**
a reason to play ladder.

## Quality of life (Reign of the Warlock)

- **Loot filter** added to the base game.
- **More stash tabs**, including **item stacking**.
- Dedicated tabs for **Materials, Gems, Runes, and consumables**.
- Buying the DLC grants **2 extra stash tabs and 2 extra character slots**.

## Open research questions

Tracked so we don't accidentally write content on unverified ground:

1. Warlock full skill tables (names, levels, synergies, numbers).
2. ~~Warlock starting attributes, life/mana per level, per-vitality/energy
   gains.~~ **Closed 2026-09-01.** See "The Warlock attributes exception" below.
3. Madawc's two unique jewels.
4. Exact statue count for the Colossal Ancients recipe.
5. What Latent Sunder Charms do, and how they differ from Sunder Charms.
6. What Worldstone Shards are used for.
7. Stat lines for Authority / Coven / Void / Vigilence / Ritual.
8. Full Terror Zone rotation group list (partially captured).
9. Whether the classic breakpoint tables (FCR/FHR/IAS) changed at all in 3.x.
10. Whether Warlock has its own FCR/FHR breakpoint table (near-certain that it does).

## The Warlock attributes exception

The rule for the Warlock on this site is that **no number is published until it
is verified against the game's own data**, because the class is paid DLC and
almost nothing about it is documented publicly. Its starting attributes are the
one exception, and it is an exception in the strict sense: they are published
*because* they were verified, not in spite of not being.

`json/charstats.json` in the pinned blizzhackers/d2data extraction carries a
`warlock` row alongside the seven original classes, with the same eleven numeric
columns. `scripts/attributes-rules.ts` transcribes that row and derives the
published values from it through one conversion, and `npm run test:attributes`
asserts the derivation against every class and plants mutations to prove the
comparison can fail. That check found two Warlock values that had been authored
from nothing: `hitPoints` read 60 where the table gives 55, and `stamina` read
80 against 86. Both are now correct.

So the boundary is: **the Warlock's attributes are Tier 1 and are published; the
Warlock's skills are not verified and are not.** Open question 1 above stands
unchanged, and nothing in the skill trees, synergies or damage numbers for that
class has been written as fact. The DLC runewords keep their "stat lines not yet
verified" placeholders for the same reason.

## Class coverage

| Class | Skills | Builds | Journey | Notes |
| --- | --- | --- | --- | --- |
| Sorceress | 30, with pages | 10 | Yes | Complete |
| Paladin | 30, with pages | 8 | Yes | Complete |
| **Amazon** | **30, with pages** | **8** | **Yes** | **Complete as of 2026-09-02** |
| **Necromancer** | **30, with pages** | **3** | **Yes** | **Complete as of 2026-09-03; see [`04-necromancer-foundation.md`](04-necromancer-foundation.md) and [`05-necromancer-builds.md`](05-necromancer-builds.md)** |
| **Druid** | **30, with pages** | **2** | **Yes** | **As of 2026-09-04; see [`06-druid.md`](06-druid.md). Five further build families researched and not yet written** |
| Assassin, Barbarian | — | — | — | Overview pages only |
| Warlock | — | — | — | Attributes only; see the exception above |

## Related research

- [`01-paladin-builds.md`](01-paladin-builds.md) — Paladin build families:
  catalogue, deduplication, implementation order and blocking gaps. **Executed.**
- [`02-sorceress-builds.md`](02-sorceress-builds.md) — Sorceress build families.
  **Executed.**
- [`03-amazon-builds.md`](03-amazon-builds.md) — Amazon build families, the
  alias decision, and the first pass to take item numbers from Tier 1.
  **Executed.**
- [`04-necromancer-foundation.md`](04-necromancer-foundation.md) — the
  Necromancer's trees, skills, extraction and mechanics articles; the synergy
  parameter-ownership bug; the Tier 2 cross-check and its ten divergences; and
  the five summons questions that blocked the builds. **Executed.**
- [`06-druid.md`](06-druid.md) — the Druid's thirty skills and the physical
  damage table they forced into the graph; the soft-level summon bonuses and the
  control they disarmed; the eight slug overrides; the seven build families,
  the two published and the reasons for the five that are not; and the
  arithmetic that fixes the fire-to-wind respec at level 38. **Executed.**
- [`05-necromancer-builds.md`](05-necromancer-builds.md) — the three builds, the
  Summoner journey, six dependency pages and the aliases; the summons research
  that answered four of those five questions and reshaped the point plan; the
  three new item-column semantics; and Death's Web, whose five properties are
  pinned against the extraction and independent sources. **Executed.**

## Sources

See [`../sources/README.md`](../sources/README.md) for the source registry and
reliability notes.
