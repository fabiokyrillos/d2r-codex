import type { FarmingArea } from "@/lib/types";

/**
 * Farming areas.
 *
 * Area levels are taken from the game's own `levels.txt`, using the
 * **Expansion** columns (`MonLvlEx`, `MonLvlEx(N)`, `MonLvlEx(H)`). This matters:
 * the non-Expansion columns in the same table describe Classic Diablo II and
 * give materially different numbers — Ancient Tunnels is level 67 in Classic
 * and level 85 in Lord of Destruction / D2R.
 *
 * Area level 85 is the threshold at which the highest treasure classes unlock,
 * which is why `hellLevel85` is a first-class field rather than a note.
 *
 * See `docs/research/05-areas.md`.
 */
export const farmingAreas: FarmingArea[] = [
  {
    slug: "countess",
    name: "The Countess",
    summary:
      "A short, safe run for low and mid runes. The single best rune source for a character under level 50.",
    act: 1,
    access:
      "Black Marsh waypoint → Forgotten Tower → five Tower Cellar levels. The Countess is on the fifth.",
    levels: { normal: 7, nightmare: 42, hell: 79 },
    hellLevel85: false,
    density: 3,
    danger: 2,
    runLength: "short",
    commonImmunities: ["fire"],
    bosses: [
      {
        name: "The Countess",
        kind: "super-unique",
        notes:
          "Guaranteed rune drop from a special rune treasure class, on top of her normal drops.",
        immunities: ["fire"],
      },
    ],
    targets: ["runes", "gems"],
    notableDrops: [
      { kind: "rune", slug: "tal" },
      { kind: "rune", slug: "ral" },
      { kind: "rune", slug: "ort" },
      { kind: "rune", slug: "thul" },
      { kind: "rune", slug: "amn" },
      { kind: "rune", slug: "shael" },
      { kind: "rune", slug: "ist" },
    ],
    why: "She has a dedicated rune drop table on top of her normal loot, so every kill produces runes. Her Hell area level of 79 caps her rune drops at Ist — she cannot drop anything higher.",
    route: [
      "Take the Black Marsh waypoint and find the Forgotten Tower (it is a fixed building, but its position in the Marsh is random).",
      "Descend five Tower Cellar levels. Levels 1-4 can be run past — there is nothing worth killing.",
      "On level 5 the Countess is always in the far corner room, with a guaranteed super chest beside her.",
      "Kill her, grab the drop, leave and remake. The run should take under two minutes.",
    ],
    recommendedDifficulties: ["normal", "nightmare", "hell"],
    terrorZone: true,
    notes:
      "Run her in Normal for Stealth and Ancient's Pledge runes, in Nightmare for Spirit and Insight runes, and in Hell for Um through Ist. Once you need runes above Ist she is finished — move to Travincal or high Terror Zones.",
    confidence: "verified",
  },
  {
    slug: "andariel",
    name: "Andariel",
    summary:
      "The fastest boss run in the game. A short walk from a waypoint, and a very generous drop table for her level.",
    act: 1,
    access:
      "Catacombs Level 2 waypoint → Catacombs Level 3 → Level 4. Roughly 30 seconds with Teleport.",
    levels: { normal: 12, nightmare: 43, hell: 73 },
    hellLevel85: false,
    density: 2,
    danger: 3,
    runLength: "very-short",
    commonImmunities: ["poison"],
    bosses: [
      {
        name: "Andariel",
        kind: "act-boss",
        immunities: ["poison"],
        notes:
          "Her poison attack is the main danger. Antidote potions raise your maximum poison resistance temporarily and make the fight trivial.",
      },
    ],
    targets: ["uniques", "sets", "runes", "gems"],
    notableDrops: [
      { kind: "unique", slug: "skin-of-the-vipermagi" },
      { kind: "unique", slug: "the-oculus" },
    ],
    why: "Andariel's quest drop is famously generous, and even on repeat kills she has a better drop table than her area level suggests. Combined with the shortest walk of any boss, she gives the best drops-per-minute of any early target.",
    route: [
      "Take the Catacombs Level 2 waypoint.",
      "Teleport or run to the Level 3 stairs, then to Level 4.",
      "Andariel is always in the same room on Level 4.",
      "Drink an antidote potion before engaging — it raises your maximum poison resistance well above the usual 75% cap.",
    ],
    suitedTo: ["sorceress", "amazon", "assassin"],
    recommendedDifficulties: ["normal", "nightmare", "hell"],
    terrorZone: true,
    notes:
      "Her Hell area level of 73 caps the item level of what she can drop, so she cannot produce the very highest-tier items. She is a volume target, not a jackpot target.",
    confidence: "verified",
  },
  {
    slug: "mephisto",
    name: "Mephisto",
    summary:
      "The classic magic-find run. High-value drop table, a 20-second route, and a trick that makes him unable to reach you.",
    act: 3,
    access:
      "Durance of Hate Level 2 waypoint → Level 3. Mephisto is directly ahead.",
    levels: { normal: 25, nightmare: 55, hell: 83 },
    hellLevel85: false,
    density: 2,
    danger: 3,
    runLength: "very-short",
    commonImmunities: ["fire", "lightning"],
    bosses: [
      {
        name: "Mephisto",
        kind: "act-boss",
        hellLevel: 87,
        notes:
          "Mephisto's own monster level in Hell is 87, higher than his area level of 83, which is why his drop table is so much better than the zone around him.",
        immunities: ["fire", "lightning"],
      },
    ],
    targets: ["uniques", "sets", "runes", "gems", "charms"],
    notableDrops: [
      { kind: "unique", slug: "harlequin-crest" },
      { kind: "unique", slug: "skin-of-the-vipermagi" },
      { kind: "unique", slug: "the-oculus" },
      { kind: "unique", slug: "arachnid-mesh" },
    ],
    why: "Mephisto is monster level 87 in Hell despite standing in a level 83 zone, which puts almost every desirable item in his drop table. The route from waypoint to boss is about twenty seconds, and the moat trick removes nearly all the risk.",
    route: [
      "Take the Durance of Hate Level 2 waypoint.",
      "Find the stairs down to Level 3 — the layout is random but small.",
      "On Level 3, Mephisto stands across a moat of blood.",
      "The moat trick: stand on the near side of the moat. Mephisto's melee cannot reach you, and his ranged attacks can be dodged by stepping behind the wall segment. Attack him across the gap.",
      "Council members guard the approach. They can be skipped entirely if you position carefully.",
    ],
    suitedTo: ["sorceress", "necromancer", "amazon"],
    recommendedDifficulties: ["nightmare", "hell"],
    terrorZone: true,
    notes:
      "He is lightning and fire immune in Hell, which rules out Lightning and Fire Sorceresses without help. Cold and physical builds have no such problem — this is a large part of why the Blizzard Sorceress is the reference magic-find character.",
    confidence: "verified",
  },
  {
    slug: "ancient-tunnels",
    name: "Ancient Tunnels",
    summary:
      "An area level 85 zone with almost no cold immunes. The best general magic-find area for a cold build.",
    act: 2,
    access:
      "Lost City waypoint → the tunnel entrance is a trapdoor in the Lost City, position randomised.",
    levels: { normal: 17, nightmare: 46, hell: 85 },
    hellLevel85: true,
    density: 4,
    danger: 3,
    runLength: "short",
    commonImmunities: ["fire", "poison"],
    bosses: [
      {
        name: "Various unique packs",
        kind: "unique-pack",
        notes: "No fixed super unique, but the zone reliably spawns several champion and unique packs.",
      },
    ],
    targets: ["uniques", "sets", "runes", "charms", "jewels", "bases"],
    notableDrops: [
      { kind: "unique", slug: "harlequin-crest" },
      { kind: "unique", slug: "deaths-fathom" },
      { kind: "unique", slug: "nightwings-veil" },
    ],
    why: "One of very few area level 85 zones with no cold immunity among its regular population, which makes it the natural home for a Blizzard Sorceress. Dense, self-contained, and every drop rolls from the top treasure classes.",
    route: [
      "Take the Lost City waypoint.",
      "Search the Lost City for the trapdoor down. It is randomly placed, which is the main time cost of the run.",
      "The Tunnels themselves are a single small level — clear it and leave.",
    ],
    suitedTo: ["sorceress", "assassin", "amazon", "druid"],
    recommendedDifficulties: ["hell"],
    terrorZone: true,
    notes:
      "The regular population — Sand Maggots and Ghoul-type monsters — is not cold immune. Unique packs can still roll a cold immunity modifier, so 'no cold immunes' means the base monsters, not literally everything.",
    confidence: "verified",
  },
  {
    slug: "pit",
    name: "The Pit",
    summary:
      "Area level 85, high density, and no boss to fight. The best pure item-hunting area in Act 1.",
    act: 1,
    access:
      "Black Marsh waypoint → Tamoe Highland → the Pit entrance is in the Monastery outer wall area.",
    levels: { normal: 7, nightmare: 39, hell: 85 },
    hellLevel85: true,
    density: 4,
    danger: 3,
    runLength: "short",
    commonImmunities: ["physical", "cold", "lightning"],
    targets: ["uniques", "sets", "runes", "bases", "charms", "jewels"],
    notableDrops: [
      { kind: "unique", slug: "harlequin-crest" },
      { kind: "unique", slug: "deaths-fathom" },
      { kind: "rune", slug: "ist" },
      { kind: "rune", slug: "vex" },
    ],
    why: "Both Pit levels are area level 85 in Hell, the monster density is high, and there is no boss gate — you walk in and start killing things that can drop anything in the game.",
    route: [
      "Take the Black Marsh waypoint and head to Tamoe Highland.",
      "The Pit entrance sits in the Tamoe Highland near the Monastery gate.",
      "Level 2 is the denser of the two and holds the fixed chest. Many runners clear only Level 2.",
    ],
    poorlySuitedTo:
      "Cold-only builds struggle here — the Pit population includes cold immunes, unlike Ancient Tunnels.",
    recommendedDifficulties: ["hell"],
    terrorZone: true,
    confidence: "verified",
  },
  {
    slug: "travincal",
    name: "Travincal",
    summary:
      "The Council pack is the densest concentration of high-rune potential in the game, and it is fifteen seconds from the waypoint.",
    act: 3,
    access: "Travincal waypoint. The Council stand directly ahead.",
    levels: { normal: 24, nightmare: 54, hell: 82 },
    hellLevel85: false,
    density: 2,
    danger: 4,
    runLength: "very-short",
    commonImmunities: ["fire", "lightning"],
    bosses: [
      {
        name: "Council Members (Ismail Vilehand, Geleb Flamefinger, Toorc Icefist)",
        kind: "super-unique",
        notes:
          "Three named Council members plus regular Council. They hit extremely hard in Hell and cast Charged Bolt and Hydra.",
        immunities: ["fire", "lightning"],
      },
    ],
    targets: ["runes", "gold", "uniques", "sets"],
    notableDrops: [
      { kind: "rune", slug: "ist" },
      { kind: "rune", slug: "gul" },
      { kind: "rune", slug: "vex" },
      { kind: "rune", slug: "ohm" },
      { kind: "rune", slug: "lo" },
      { kind: "rune", slug: "ber" },
    ],
    why: "A very large number of high-level monsters in a tiny area, immediately next to a waypoint. Council members roll from good treasure classes and can drop any rune in the game, which makes Travincal the standard high-rune target.",
    route: [
      "Take the Travincal waypoint.",
      "The Council are gathered on the raised platform straight ahead.",
      "Kill them, loot, leave. Do not continue into the Durance unless you are also running Mephisto.",
      "A Barbarian with Find Item re-rolls loot from each corpse, which is why Travincal is the classic Barbarian farm.",
    ],
    suitedTo: ["barbarian", "paladin", "sorceress", "druid"],
    poorlySuitedTo:
      "Fire and Lightning builds — the Council are immune to both in Hell.",
    recommendedDifficulties: ["hell"],
    terrorZone: true,
    notes:
      "Genuinely dangerous. Council members deal very high physical and elemental damage and will kill an under-geared character quickly. This is not a Hardcore beginner's run.",
    confidence: "verified",
  },
  {
    slug: "chaos-sanctuary",
    name: "Chaos Sanctuary",
    summary:
      "Area level 85, extremely dense, and it ends with Diablo. The best experience-per-hour area in the game outside Baal runs.",
    act: 4,
    access: "River of Flame waypoint → a short walk to the Chaos Sanctuary entrance.",
    levels: { normal: 28, nightmare: 58, hell: 85 },
    hellLevel85: true,
    density: 5,
    danger: 5,
    runLength: "medium",
    commonImmunities: ["fire", "lightning", "physical"],
    bosses: [
      {
        name: "Diablo",
        kind: "act-boss",
        notes: "Spawns after all three Seal bosses are killed.",
      },
      {
        name: "Grand Vizier of Chaos, Lord De Seis, Infector of Souls",
        kind: "super-unique",
        notes:
          "The three Seal bosses. De Seis is the dangerous one — he leads a pack of Oblivion Knights that cast Iron Maiden and Bone Prison.",
      },
    ],
    targets: ["uniques", "sets", "runes", "experience", "charms", "jewels"],
    notableDrops: [
      { kind: "unique", slug: "deaths-fathom" },
      { kind: "unique", slug: "nightwings-veil" },
      { kind: "rune", slug: "ber" },
      { kind: "rune", slug: "jah" },
    ],
    why: "Area level 85, very high density, three super uniques and an act boss, all in one enclosed space. It is simultaneously a top item area and a top experience area.",
    route: [
      "Take the River of Flame waypoint and run to the Chaos Sanctuary entrance.",
      "The layout is fixed: five seals, three of which spawn a boss.",
      "Clear the star area in the centre first, then work outward to the seals.",
      "Open the two seals on the left before the pair on the right — De Seis spawns from one of the left pair and is the one you want to fight with full attention.",
      "Watch for Oblivion Knights casting Iron Maiden. For a physical-damage character this is lethal; for a caster it is harmless.",
    ],
    suitedTo: ["paladin", "sorceress", "necromancer", "assassin"],
    recommendedDifficulties: ["hell"],
    terrorZone: true,
    notes:
      "Fire and lightning immunes are extremely common here. A Blizzard Sorceress handles it comfortably; a Fire Sorceress does not.",
    confidence: "verified",
  },
  {
    slug: "worldstone-keep",
    name: "Worldstone Keep",
    summary:
      "Three consecutive area level 85 floors leading to the Throne of Destruction and Baal.",
    act: 5,
    access: "The Worldstone Keep Level 2 waypoint.",
    levels: { normal: 39, nightmare: 65, hell: 85 },
    hellLevel85: true,
    density: 4,
    danger: 5,
    runLength: "medium",
    commonImmunities: ["physical", "fire", "lightning", "cold"],
    bosses: [
      {
        name: "Baal",
        kind: "act-boss",
        notes: "Reached through the Throne of Destruction after five waves of minions.",
      },
    ],
    targets: ["uniques", "sets", "runes", "experience", "charms"],
    notableDrops: [
      { kind: "rune", slug: "ber" },
      { kind: "rune", slug: "jah" },
      { kind: "rune", slug: "cham" },
      { kind: "rune", slug: "zod" },
    ],
    why: "All three Keep floors, the Throne of Destruction and the Worldstone Chamber are area level 85 in Hell — the largest contiguous block of top-tier farming space in the game, and the standard place to level from 90 to 99.",
    route: [
      "Take the Worldstone Keep Level 2 waypoint.",
      "Clear Level 2 and 3, then descend to the Throne of Destruction.",
      "Baal sends five waves of minions before he is attackable. The waves give substantial experience.",
      "Public Baal-run games are the standard way to level past 90.",
    ],
    recommendedDifficulties: ["hell"],
    terrorZone: true,
    notes:
      "Every immunity type appears here. This is where a single-element build finally runs out of road without a Sunder Charm or an Infinity mercenary.",
    confidence: "verified",
  },
  {
    slug: "mausoleum",
    name: "Mausoleum",
    summary:
      "An overlooked area level 85 zone in Act 1, right next to Blood Raven, with a mostly undead population.",
    act: 1,
    access: "Cold Plains waypoint → Burial Grounds → the Mausoleum entrance.",
    levels: { normal: 3, nightmare: 37, hell: 85 },
    hellLevel85: true,
    density: 3,
    danger: 2,
    runLength: "short",
    commonImmunities: ["poison", "cold"],
    targets: ["uniques", "sets", "runes", "bases"],
    why: "Area level 85 in Hell despite being an Act 1 zone reachable in seconds. Much safer than the Pit or Travincal, at the cost of somewhat lower density.",
    route: [
      "Take the Cold Plains waypoint and head to the Burial Grounds.",
      "The Mausoleum entrance is at the far side of the Burial Grounds, near where Blood Raven spawns.",
      "It is a single enclosed level.",
    ],
    recommendedDifficulties: ["hell"],
    terrorZone: true,
    notes:
      "Frequently missed by new players, who assume Act 1 zones are low level. Its Hell area level is identical to Chaos Sanctuary's.",
    confidence: "verified",
  },
  {
    slug: "pindleskin",
    name: "Pindleskin",
    summary:
      "The shortest run in the game. Ten seconds from town portal to a super unique with a good drop table.",
    act: 5,
    access:
      "Take the red portal in Harrogath to Nihlathak's Temple. Pindleskin is a few steps inside.",
    levels: { normal: 32, nightmare: 63, hell: 83 },
    hellLevel85: false,
    density: 1,
    danger: 2,
    runLength: "very-short",
    commonImmunities: ["cold", "poison"],
    bosses: [
      {
        name: "Pindleskin",
        kind: "super-unique",
        hellLevel: 86,
        notes:
          "His monster level in Hell is 86, above his area's level of 83, which is why he drops so far above his surroundings.",
      },
    ],
    targets: ["uniques", "sets", "runes"],
    why: "Pindleskin is monster level 86 in Hell but stands ten seconds from a portal in town. Nothing else in the game offers that ratio of drop quality to time spent.",
    route: [
      "Complete the Anya quest so the red portal appears in Harrogath.",
      "Take the portal, kill Pindleskin and his two Defiled Warrior minions, loot, leave.",
      "Because you never leave the portal's immediate area, the run resets almost instantly.",
    ],
    suitedTo: ["sorceress", "paladin", "amazon", "assassin"],
    recommendedDifficulties: ["hell"],
    terrorZone: true,
    notes:
      "He is cold immune in Hell, which is awkward for a Blizzard Sorceress — this is a run where the mercenary does the work, or where you bring a Cold Rupture sunder charm.",
    confidence: "verified",
  },
  {
    slug: "lower-kurast",
    name: "Lower Kurast",
    summary:
      "Not about the monsters. The super chests in the huts are one of the best rune sources in the game.",
    act: 3,
    access: "Lower Kurast waypoint. The huts are immediately around it.",
    levels: { normal: 22, nightmare: 52, hell: 80 },
    hellLevel85: false,
    density: 2,
    danger: 2,
    runLength: "very-short",
    commonImmunities: ["fire", "poison"],
    targets: ["runes", "gems", "bases", "gold"],
    notableDrops: [
      { kind: "rune", slug: "pul" },
      { kind: "rune", slug: "um" },
      { kind: "rune", slug: "mal" },
      { kind: "rune", slug: "ist" },
    ],
    why: "Lower Kurast contains several fixed 'super chests' inside the huts, which roll from a good treasure class independently of the monsters. You can run it safely at a low gear level because you are looting chests, not fighting.",
    route: [
      "Take the Lower Kurast waypoint.",
      "Three or four huts sit near the waypoint, each containing chests and often a weapon rack.",
      "Open the chests, ignore the monsters, leave.",
      "This run is safe enough that under-geared characters use it to bootstrap their first runewords.",
    ],
    suitedTo: ["sorceress", "amazon", "assassin", "necromancer"],
    recommendedDifficulties: ["hell"],
    terrorZone: true,
    notes:
      "The chest contents do not care how much magic find you have — chest drops use a different mechanism than monster drops. Run it in cheap gear.",
    confidence: "verified",
  },
];
