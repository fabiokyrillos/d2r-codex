import type { ProgressionJourney } from "@/lib/types";

/**
 * The Warlock levelling journey — one route into four builds.
 *
 * A fifth shape, and the arithmetic is what makes it one. The Sorceress plans
 * an identity change at 30, the Necromancer needs no respec at all, the Amazon
 * forks at 30 between five endgame skills. This class does something none of
 * those do: **the levelling route is the finished plan for one build and the
 * optional half of another, so two of the four need no respec and the two that
 * do have two spare tokens each.**
 *
 * The route is Miasma Bolt into Miasma Chain, and the reason is the same one
 * the Abyss page is built on — magic is recorded as an immunity in one of the
 * eighteen catalogued areas, against twelve for fire. A levelling character has
 * no sunder charm, no pierce and no second element, so the element that is
 * almost never resisted is the one that never strands them.
 *
 * WHAT THE ARITHMETIC ACTUALLY SAYS
 * ---------------------------------
 * Spend the route to level 99 and the skill screen reads the Abyss build's core
 * exactly, plus its fire package, plus one point in Summon Goatman that no
 * finished build keeps. One of 110, spent in Act 1 on the thing that stopped
 * you dying in the Blood Moor.
 *
 * Keep spending into fire from level 30 instead, and the same route lands on
 * the Apocalypse core plus its void package — 60 in the fire chain, 40 already
 * in miasma, 3 in the sigils — without a respec either. The two Chaos builds
 * are the same character taking a different turn at 30.
 *
 * THE THING THAT IS TRUE AT EVERY STAGE AND OF NO OTHER CLASS
 * -----------------------------------------------------------
 * The Warlock levitates the weapon, so **a two-handed staff costs nothing in
 * the off-hand**. Every "weapon or shield?" decision another class makes on the
 * way up, this one does not make. A level 19 Leaf in a two-socket staff is
 * +3 to Fire Skills for two of the commonest runes in the game, and the
 * Grimoire stays where it is. No generic levelling guide will tell a caster to
 * do that, because for every other caster it is wrong.
 *
 * WHAT THIS ROUTE DELIBERATELY DOES NOT USE
 * -----------------------------------------
 * The class's own uniques. The earliest is `Measured Wrath` at level 52 and the
 * three Ars grimoires are 73, 78 and 80 — so the entire journey below runs on
 * generic gear, vendor staves and two-rune runewords. That is not an apology.
 * It is what levelling a class that shipped this year actually looks like, and
 * a route built on items nobody has yet would be a route for nobody.
 */
export const warlockJourney: ProgressionJourney = {
  classSlug: "warlock",
  targetBuild: "abyss-warlock",
  summary:
    "One magic-damage route from level 1 to 99 that becomes the Abyss build with no respec, the Apocalypse build with no respec, and either of the other two with one of the three free tokens the game hands out.",
  overview: [
    "**Miasma Bolt from level 1, Miasma Chain from 12, and that is the character until 30.** Magic damage is recorded as an immunity in one of the eighteen catalogued areas on this site; fire is recorded in twelve. A levelling Warlock owns no sunder charm and has no pierce, so the element almost nothing resists is the one that never leaves them stuck in a doorway.",
    "**One point in Summon Goatman at level 2 and never again.** It is a body between you and the room, and it is the only point in this whole route that no finished build keeps. How many demons you get is decided by Demonic Mastery's fifth and tenth hard points and by nothing else — which is a Blood Boil decision, not a levelling one.",
    "**The class passive changes gear planning at every single stage.** The weapon levitates, so a two-handed staff leaves the off-hand free. You are never choosing between a big stick and a Grimoire, which is a choice every other caster in the game has to make.",
    "**Nothing here needs an item that does not exist yet.** The Warlock's own uniques start at level 52 and its best three at 73 and above, so this route is vendor staves, generic Grimoires and runewords built from Countess runes. Say it out loud, because a guide that assumes the class's signature items is useless to anyone playing the class now.",
    "**Three free respecs, and at most one is needed.** Akara's reward for clearing the Den of Evil is a full respec in every difficulty. Two of the four builds want none of them.",
  ],

  stages: [
    {
      slug: "war-act-1-normal",
      name: "A bolt and a body",
      classSlug: "warlock",
      summary: "Levels 1-11. Pick the one level-one skill that is still on your bar at 99.",
      levels: [1, 11],
      difficulty: "normal",
      location: "Act 1 — Rogue Encampment through the Monastery",
      goal: "Clear the Den of Evil, get a demon in front of you, and kill Andariel.",
      killingWith: "Miasma Bolt, with a Goatman standing between you and whatever is coming.",
      order: 1,
      skillPoints: [
        "Level 1: **Miasma Bolt**. Five skills are open at level 1 and this is the one that is still worth points at 99 — 4 mana, the longest reach in the class, and magic damage that almost nothing in the game resists.",
        "Level 2: **Summon Goatman**, one point. It is a body, not a damage source, and one point is all it will ever get on this route.",
        "Levels 3-5: back into **Miasma Bolt**.",
        "**The Den of Evil point goes into Miasma Bolt too.** It is a synergy of everything this character will ever cast, so there is no wrong time to spend it here.",
        "Level 6: **Ring of Fire**, one point. A second element for the handful of things that shrug off magic, and the first rung of the ladder if you later turn fire at 30.",
        "Levels 7-11: **Miasma Bolt** to ten.",
        "That is 12 points at level 11, and eleven of them are in skills the finished character still has.",
      ],
      statPoints: [
        "**Vitality, and almost nothing else.** A Warlock gets 3 life per point where a Sorceress gets 2, so the same investment buys half as much again.",
        "**Strength only to wear what you are actually wearing.** It becomes the most important stat on this class later — a Blasphemous Grimoire asks 106 — but that is a level 80 problem and paying it now buys nothing.",
        "No Energy, on this route or any other. Mana comes from an Insight mercenary in Act 2 and from potions until then.",
      ],
      actions: [
        {
          kind: "tip",
          text: "**Put a staff in your hand and a Grimoire in your off-hand, and understand why you can.** The Warlock levitates the weapon rather than holding it, so a two-handed staff occupies the weapon slot alone. Every other caster in this game trades the off-hand for a big weapon. You do not, at any level, ever.",
        },
        {
          kind: "quest",
          text: "Clear the **Den of Evil** completely. Akara gives **+1 skill point** and a **free full respec**. Spend the point in Miasma Bolt and put the respec in the stash — this route may never need it, and it is what lets you become a Cleave or a Blood Boil Warlock at 30 without rerolling.",
        },
        {
          kind: "shop",
          text: "Buy from **Charsi and Akara every time you pass**. A magic staff with +2 or +3 to Warlock skills is worth more than anything that drops before Act 3, and Grimoires are on their lists too — a normal-tier Grimoire asks between 12 and 25 Strength, so any of them fits.",
        },
        {
          kind: "gear",
          text: "**Grimoires are the class's own off-hand and they roll staffmods.** Look for +2 to Warlock Skills, and better still a +2 to the Chaos tab — the three tabs are demon, eldritch and chaos, and two levels of the tab you are actually spending in is two free levels of Miasma Bolt.",
        },
        {
          kind: "quest",
          text: "Kill **Blood Raven** for the free Rogue Scout. A second body matters more here than her arrows do.",
          optional: true,
        },
        {
          kind: "warning",
          text: "Your Goatman does not scale with gear the way you do, and it is not meant to. Re-summon it when it dies and keep moving; it costs 30 mana and about two seconds.",
        },
        {
          kind: "tip",
          text: "Andariel is poison. Buy antidotes from Akara before going down, and stand at Miasma Bolt's range rather than the Goatman's.",
        },
      ],
      gearTargets: [
        { label: "Any staff with +2 or +3 to Warlock Skills", why: "Two-handed and free of charge on this class. Buy every one the vendors roll until one sticks.", lookFor: ["+2-3 to Warlock Skills", "+to Miasma Bolt", "Faster Cast Rate"] },
        { label: "Any Grimoire with +2 to Warlock Skills", why: "The off-hand exists only because of the class passive, and at this tier it costs 12 to 25 Strength.", lookFor: ["+2 to Warlock Skills", "+2 to Chaos Skills"] },
        { ref: { kind: "rune", slug: "tal" }, why: "Keep every Tal, Eth, Ith, Ral and Ort the Countess drops. Stealth and Leaf are both two runes and both are the next real upgrade." },
      ],
      exitCriteria: "Andariel is dead, Miasma Bolt is at ten, and you have a Goatman you re-summon without thinking about it.",
    },

    {
      slug: "war-act-2-3-normal",
      name: "The chain replaces the bolt",
      classSlug: "warlock",
      summary: "Levels 12-20. One skill arrives and does the rest of Normal for you.",
      levels: [12, 20],
      difficulty: "normal",
      location: "Act 2 and Act 3 — Lut Gholein to Travincal",
      goal: "Get Miasma Chain online, hire an Act 2 mercenary, and put Insight in his polearm.",
      killingWith: "Miasma Chain — three magic bolts at level 12, and more with every point.",
      order: 2,
      skillPoints: [
        "Level 12: **Miasma Chain**. This is the skill that clears Normal. It spawns three bolts at one point and climbs toward twelve, each of them magic, at the range of a bow.",
        "**Radament's skill point goes into Miasma Chain.** It is the only quest in Act 2 that gives one.",
        "Levels 13-20: **Miasma Chain** to nine. Every point is another fraction of a bolt and there is nothing competing for them yet.",
        "**Do not touch Flame Wave when it opens at 18.** It is a fire skill on a magic route, and if you turn fire at 30 you will want Ring of Fire maxed before it anyway.",
        "That is 21 points at level 20 — Miasma Bolt ten, Miasma Chain nine, and one each in Summon Goatman and Ring of Fire.",
      ],
      statPoints: [
        "**Still Vitality.** Act 2 is where a Warlock who skimped finds out.",
        "Enough **Strength** for a two-socket staff and whatever body armour you are wearing. Leaf needs a staff and staves ask very little.",
        "**Lam Esen's Tome in Act 3 gives +5 stat points, not a skill point.** Take it as soon as the Kurast bazaar is open.",
      ],
      actions: [
        {
          kind: "mercenary",
          text: "**Hire an Act 2 mercenary from Greiz.** Nightmare Holy Freeze is the one to end up with, but in Normal take whatever is offered — the point right now is that something else is being hit.",
        },
        {
          kind: "runeword",
          text: "At level 27, make **Insight** in a four-socket polearm for the mercenary. Its Meditation aura is the mana plan for this character from here to 99, and it is why no point in this journey ever goes into Energy.",
          atLevel: 27,
          refs: [{ kind: "runeword", slug: "insight" }],
        },
        {
          kind: "runeword",
          text: "At level 17, make **Stealth** in any two-socket body armour. Faster cast rate, faster hit recovery and faster run — three things this class has no other early source for.",
          atLevel: 17,
          refs: [{ kind: "runeword", slug: "stealth" }],
        },
        {
          kind: "runeword",
          text: "At level 19, make **Leaf** in a two-socket staff if you have any intention of turning fire at 30. Tir and Ral give **+3 to Fire Skills**, and because the Warlock levitates the staff you keep the Grimoire as well. For every other caster in the game this is a trade; here it is not.",
          atLevel: 19,
          refs: [{ kind: "runeword", slug: "leaf" }],
          optional: true,
        },
        {
          kind: "quest",
          text: "Do **Lam Esen's Tome** in Act 3. Alkor's reward is stat points rather than a skill point, and five of them at this level is roughly fifteen life.",
        },
        {
          kind: "warning",
          text: "Duriel is fast and hits hard, and this character has no way to escape him. Bring thawing potions, keep the mercenary alive, and cast from as far back as Miasma Chain will let you.",
        },
        {
          kind: "tip",
          text: "The Horadric Cube is a stash tab that travels. It is also how you will make every rune above Ral for the rest of the game.",
        },
      ],
      gearTargets: [
        { ref: { kind: "runeword", slug: "stealth" }, why: "Two Countess runes, and the first item that makes the character feel responsive." },
        { ref: { kind: "runeword", slug: "leaf" }, why: "Two runes for +3 to Fire Skills in a staff you can hold alongside a Grimoire. Only worth making if fire is where you are going." },
        { ref: { kind: "runeword", slug: "insight" }, why: "For the mercenary, at level 27. The mana problem this class has is solved here and never comes back." },
      ],
      exitCriteria: "Mephisto is dead, Miasma Chain is at nine, and your mercenary is carrying Insight or is about to.",
    },

    {
      slug: "war-act-4-5-normal",
      name: "The sigils, and the turn at thirty",
      classSlug: "warlock",
      summary: "Levels 21-30. Three cheap points buy an execute, and then the route forks.",
      levels: [21, 30],
      difficulty: "normal",
      location: "Act 4 and Act 5 — the Pandemonium Fortress to the Worldstone",
      goal: "Max Miasma Chain, open Sigil: Death, and decide which of the four builds you are.",
      killingWith: "Miasma Chain, with a sigil under the pack finishing whatever it left standing.",
      order: 3,
      skillPoints: [
        "**Izual gives +2 skill points** — the largest single grant in the game. Both go into Miasma Chain.",
        "Levels 21-23: **Miasma Chain** to twenty. It is finished and it will stay finished.",
        "Level 24: the sigil chain, one point each. Sigil Lethargy and Sigil Rancor are prerequisites and Sigil Death is the reason — its execute is a flat 13% of a normal monster's life and 10% of a champion's, and **neither number rises with level**. One point is the whole skill except its radius, which makes it the best single point available to this class.",
        "Level 24 also opens **Enhanced Entropy**. One point now because Abyss cannot be taken without it; the other nineteen come much later.",
        "Levels 25-30: **Miasma Bolt** back up toward twenty.",
        "That is 32 points at level 30, and thirty-one of them are in the finished Abyss build.",
      ],
      statPoints: [
        "**Vitality.** Hell is two acts away and its resistance penalty is about to make everything hit harder.",
        "Enough **Strength** for a four-socket sword if you are making Spirit at 25, which is 25 for a Crystal Sword.",
        "**Lam Esen's Tome again in Nightmare and Hell.** Fifteen stat points across the three difficulties.",
      ],
      actions: [
        {
          kind: "quest",
          text: "Kill **Izual** in Act 4. He gives **+2 skill points**, and he is the only quest in the game that gives two.",
        },
        {
          kind: "runeword",
          text: "At level 25, make **Spirit** in a four-socket sword. +2 to All Skills and 25-35% Faster Cast Rate for four Countess runes, and a sword is one-handed — which on this class means nothing at all, because the off-hand was never in question.",
          atLevel: 25,
          refs: [{ kind: "runeword", slug: "spirit" }],
        },
        {
          kind: "runeword",
          text: "At level 27, make **Lore** in any two-socket helm. +1 to All Skills for an Ort and a Sol.",
          atLevel: 27,
          refs: [{ kind: "runeword", slug: "lore" }],
        },
        {
          kind: "runeword",
          text: "At level 29, **Rhyme** goes in a Grimoire. Two runes for all resistances and cannot-be-frozen — and two is the only rune count a Grimoire can take, because every Grimoire base in the game has exactly two sockets. It is the same reason Spirit and Ancients' Pledge can never go in one.",
          atLevel: 29,
          refs: [{ kind: "runeword", slug: "rhyme" }],
        },
        {
          kind: "transition",
          text: "**Level 30 is where the four builds separate, and two of them separate without a respec.** Keep spending into miasma and you are already building the Abyss Warlock. Start spending into Ring of Fire, Flame Wave and Apocalypse instead and everything you have becomes that build's void package — 60 points in the fire chain, 40 already in miasma, 3 in the sigils, and not one point wasted.",
        },
        {
          kind: "respec",
          text: "**The Cleave and Blood Boil builds need a respec here, and you have three.** Nothing in the Eldritch tree and almost nothing in the Demon tree is on this route, so use Akara's Normal token at 30 and keep the Nightmare and Hell ones.",
        },
        {
          kind: "quest",
          text: "Do **Anya's** rescue in Act 5 in every difficulty. Her Scroll of Resistance is a permanent bonus to all resistances and it is the cheapest resistance this character will ever get.",
        },
        {
          kind: "warning",
          text: "The Ancients cannot be skipped and they cannot be town-portalled out of. Clear the surrounding level first, drink everything, and let the sigil do the work — an Ancient below a tenth of its life inside Sigil: Death simply dies.",
        },
      ],
      gearTargets: [
        { ref: { kind: "runeword", slug: "spirit" }, why: "The single biggest levelling upgrade in the game for any caster, and four common runes." },
        { ref: { kind: "runeword", slug: "rhyme" }, why: "For the Grimoire, at level 29. Two sockets is all a Grimoire has and Rhyme is a two-rune word." },
        { ref: { kind: "runeword", slug: "lore" }, why: "+1 to All Skills in a helm, for two runes." },
      ],
      exitCriteria: "Baal is dead, Miasma Chain and Miasma Bolt are close to twenty, and you know which of the four you are.",
    },

    {
      slug: "war-nightmare",
      name: "Abyss, and the first real resistances",
      classSlug: "warlock",
      summary: "Levels 30-48. The capstone arrives and the character stops being a levelling project.",
      levels: [30, 48],
      difficulty: "nightmare",
      location: "Nightmare — Act 1 through Act 5",
      goal: "Max Abyss, get resistances back to maximum, and reach the Hell gate.",
      killingWith: "Miasma Chain into Abyss, with Sigil: Death under anything that survives the first pass.",
      order: 4,
      skillPoints: [
        "Level 30: **Abyss**. Twenty to forty magic in a radius of 6, and the mana is charged when it resolves rather than when it starts — an interrupted cast costs nothing.",
        "Levels 31-48: **Abyss** to twenty, and **Miasma Bolt** with whatever is left over.",
        "**The Nightmare quest points — Den of Evil, Radament and Izual — are four more**, and all four go the same way.",
        "That is 54 points at level 48.",
        "If you turned fire at 30 instead: Ring of Fire to twenty first, then Flame Wave, then Apocalypse. The ordering matters because Ring of Fire feeds both of the others and is the cheapest of the three to finish.",
      ],
      statPoints: [
        "**Vitality, still.** Nightmare's −40 to all resistances is survived with life as much as with resistance.",
        "**Strength toward 38.** That is what a Burnt Text asks, and Measured Wrath sits on one at level 52 — the first Warlock unique any character can actually wear.",
        "Nothing in Dexterity. A Grimoire blocks, but a caster who is blocking has already made the mistake that mattered.",
      ],
      actions: [
        {
          kind: "runeword",
          text: "At level 37, **Splendor** is the other two-rune Grimoire option — +1 to All Skills and 10% faster cast against Rhyme's resistances. Make whichever your resistances can afford.",
          atLevel: 37,
          refs: [{ kind: "runeword", slug: "splendor" }],
        },
        {
          kind: "runeword",
          text: "At level 41, **Lionheart** in a three-socket body armour: +25 to all attributes, which is 75 life and a real bite out of the Strength bill at the same time.",
          atLevel: 41,
          refs: [{ kind: "runeword", slug: "lionheart" }],
          optional: true,
        },
        {
          kind: "quest",
          text: "**Den of Evil, Radament and The Fallen Angel again.** Four more skill points, and a second free respec you should also not spend.",
        },
        {
          kind: "farm",
          text: "**Run the Countess whenever you pass Black Marsh.** Every runeword this route uses is built from what she drops, and the Hell version of her is where Ist and above start appearing.",
        },
        {
          kind: "tip",
          text: "**Sigil: Death does not care about Nightmare.** Its thresholds are percentages of the monster's own life, so it executes exactly as well at level 48 as it did at 24 — and it is still sitting at one point.",
        },
        {
          kind: "warning",
          text: "Nightmare Ancients and Nightmare Baal are the two walls. Both are answered with more life rather than more damage, which is the argument for Lionheart over another skill item.",
        },
      ],
      gearTargets: [
        { ref: { kind: "runeword", slug: "splendor" }, why: "The second Grimoire runeword, at 37. Still two runes, because a Grimoire still has two sockets." },
        { ref: { kind: "runeword", slug: "lionheart" }, why: "+25 to all attributes is 75 life and part of a Grimoire's Strength requirement in one item." },
        { label: "Any amulet or rare ring with +Warlock skills and resistance", why: "Two slots this route never plans around and always benefits from." },
      ],
      exitCriteria: "Nightmare Baal is dead, Abyss is at twenty, and your resistances are at or near the cap.",
    },

    {
      slug: "war-hell",
      name: "Where the element choice pays for itself",
      classSlug: "warlock",
      summary: "Levels 48-70. Twelve of eighteen areas resist fire. One resists you.",
      levels: [48, 70],
      difficulty: "hell",
      location: "Hell — Act 1 through Act 4",
      goal: "Finish Enhanced Entropy, get the first Warlock unique, and clear to the Chaos Sanctuary.",
      killingWith: "Miasma Chain and Abyss, and the sigil under every pack worth the four seconds.",
      order: 5,
      skillPoints: [
        "Levels 49-70: **Enhanced Entropy** from one to twenty, then **Miasma Bolt** with the remainder. Enhanced Entropy gives Abyss +2% damage with 3% more per level, which is the steepest single line in the skill and the reason it is worth twenty points rather than one.",
        "**The Hell quest points are four more** and they go the same way.",
        "That is 80 points at level 70, and the finished Abyss core is 83.",
        "The fire route reaches Apocalypse's core at almost exactly the same level, because both plans are sixty points of capstone chain plus a handful of ones.",
      ],
      statPoints: [
        "**Strength to 38 if you have not already**, for Measured Wrath at 52.",
        "**Everything else into Vitality.** Hell's −100 to all resistances is the largest single difficulty step in the game.",
        "If you are heading for the Occult Tome later, 82 is the number — but that is a level 78 item and there is no reason to pre-pay it.",
      ],
      actions: [
        {
          kind: "gear",
          text: "At level 52, **Measured Wrath** becomes wearable — a Burnt Text with +1 to Warlock skills, 25% Faster Cast Rate and +20-30 to all resistances, at 38 Strength. It is the first item in the game made for this class that a character can realistically own.",
          atLevel: 52,
        },
        {
          kind: "runeword",
          text: "At level 51, **Coven** in a three-socket helm: +1 to All Skills, 20% Faster Cast Rate and 26-40% magic find once Ist's own helm modifier is counted.",
          atLevel: 51,
          refs: [{ kind: "runeword", slug: "coven" }],
        },
        {
          kind: "runeword",
          text: "At level 53, **Vigilance** is Dol and Gul in a Grimoire — all resistances, life, mana and a large defence bonus. It is the only runeword in the game whose first listed item type is the Grimoire, and it is two runes because that is all a Grimoire has room for.",
          atLevel: 53,
          refs: [{ kind: "runeword", slug: "vigilance" }],
        },
        {
          kind: "runeword",
          text: "At level 49, a Cleave Warlock wants **Oath** in a four-socket sword or axe — it publishes 50% Increased Attack Speed once Shael is counted, and this is the point where that build stops borrowing and starts hitting.",
          atLevel: 49,
          refs: [{ kind: "runeword", slug: "oath" }],
          optional: true,
        },
        {
          kind: "warning",
          text: "**This is where the element choice shows.** Fire immunity is recorded in twelve of the eighteen catalogued areas on this site and magic immunity in one — the Arcane Sanctuary. A fire Warlock needs a Flame Rift, which is a level 75 drop; a magic one needs nothing at all.",
        },
        {
          kind: "farm",
          text: "**The Mausoleum is the area to learn.** Area level 85, two screens from the Cold Plains waypoint, and its recorded immunities are poison and cold — neither of which this route deals.",
        },
        {
          kind: "quest",
          text: "**Den of Evil, Radament and The Fallen Angel one last time.** The final four skill points, bringing the quest total to twelve.",
        },
      ],
      gearTargets: [
        { ref: { kind: "runeword", slug: "coven" }, why: "One Ist and two common runes for +1 skills and 20% cast rate." },
        { ref: { kind: "runeword", slug: "vigilance" }, why: "The Grimoire runeword, at 53. Two runes, because two sockets." },
        { ref: { kind: "unique", slug: "measured-wrath" }, why: "The first Warlock unique that is not an endgame item. Level 52, 38 Strength." },
      ],
      exitCriteria: "Hell Mephisto and Diablo are dead, Enhanced Entropy is at twenty, and you have a Warlock item in your off-hand.",
    },

    {
      slug: "war-endgame",
      name: "The last thirty points, and which build you already are",
      classSlug: "warlock",
      summary: "Levels 70-99. The plan closes, and the route turns out to have been a build the whole time.",
      levels: [70, 99],
      difficulty: "hell",
      location: "Hell — the Worldstone Keep, Terror Zones, and whatever you farm",
      goal: "Finish the core, choose a package, and stop levelling as a project.",
      killingWith: "The finished build, whichever of the four you turned into.",
      order: 6,
      skillPoints: [
        "Levels 71-99: twenty-nine points, and the last of them are the ones that decide the character rather than build it.",
        "**Miasma Bolt to twenty** closes the Abyss core at 83 of 110.",
        "**Then the package.** Ring of Fire to twenty is the fire answer for the one area that resists you; Psychic Ward with its two prerequisites is the ward. Take one, not both — 110 does not hold them.",
        "**One point in Summon Goatman is the only point this route spends that no finished build keeps.** It is one of the seven the fire package leaves spare, and it bought you the whole of Act 1.",
        "83 + 20 = 103, with the Goatman making 104 and six genuinely free.",
      ],
      statPoints: [
        "**Strength last, and only as far as the off-hand you actually want.** 82 for an Occult Tome, 95 for a Blasphemous Compendium, 106 for a Blasphemous Grimoire — against a class base of 15.",
        "**Everything else is Vitality, for the whole thirty levels.** At 3 life per point it is the best conversion available to any caster in the game.",
        "Energy is still zero, and Insight is still the reason.",
      ],
      actions: [
        {
          kind: "transition",
          text: "**You are already an Abyss Warlock.** Not 'ready to become one' — the skill screen reads that build's core with nothing to undo. This is the only class on the site where the levelling route and a finished build are the same 83 points.",
        },
        {
          kind: "transition",
          text: "**Or an Apocalypse Warlock, also with no respec**, if you turned fire at 30. Sixty points in Ring of Fire, Flame Wave and Apocalypse, forty already spent in miasma, three in the sigils — which is that build's core plus its void package exactly, and the void half is what answers the twelve fire-immune areas.",
        },
        {
          kind: "respec",
          text: "**Or spend a token.** Cleave and Blood Boil are both single-respec transitions from here and you should still be holding all three tokens. The Cleave plan is 104 of 110 and the tightest of the four; the Blood Boil plan is 72 with a package on top.",
        },
        {
          kind: "gear",
          text: "At level 73, 78 and 80 the three **Ars** grimoires become wearable — Tor'Baalos for Blood Boil, Dul'Mephistos for Cleave and Abyss, Al'Diablolos for Apocalypse. Each raises several of its build's skills from one slot, and each is the reason that build's Strength number is what it is.",
          atLevel: 73,
        },
        {
          kind: "farm",
          text: "**Terror Zones rotate every thirty minutes and are the fastest experience in the game past level 90.** In Hell they also spawn Heralds of Terror, each more dangerous than the last — a magic build with a 50-unit reach is unusually well placed to fight them and unusually badly placed to be caught by one.",
        },
        {
          kind: "tip",
          text: "**Do not respec to chase a package.** Both are inside the same core, and the difference between them is twenty points you can re-earn by levelling rather than by spending a token you might want for a different build later.",
        },
      ],
      gearTargets: [
        { ref: { kind: "unique", slug: "ars-dul-mephistos" }, why: "An Occult Tome at level 78 with +2 to Warlock skills and −10-20% to Enemy Magic Resistance. The largest magic pierce on any item in the game." },
        { label: "Entropy Locket", why: "A level 54 amulet with +5-10% to Magic Skill Damage. Wearable long before this stage and worth wearing from the moment it drops." },
        { ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 to All Skills, life and mana per level, and 10% damage reduction — the best all-round helm for any of the four." },
      ],
      exitCriteria: "The core is closed, a package is chosen, and the build page for whichever of the four you became takes over from here.",
    },
  ],

  respecPlan: [
    {
      at: "Never, if you are becoming the Abyss Warlock",
      why: "The route and the build are the same 83 points. There is no transition and nothing to undo — the only point spent that the finished plan does not list is one in Summon Goatman, and it is one of the spare seven.",
    },
    {
      at: "Never, if you are becoming the Apocalypse Warlock",
      why: "Turn fire at level 30 and keep spending. Sixty points into Ring of Fire, Flame Wave and Apocalypse, plus the forty already in miasma and the three in the sigils, is that build's core with its void package attached — and the void package is exactly what answers the twelve catalogued areas that record fire immunity.",
    },
    {
      at: "Once, at level 30, for the Cleave Warlock",
      why: "Nothing in the Eldritch tree is on this route and its plan is 104 of 110, so there is no partial version to grow into. Spend Akara's Normal token the moment Mirrored Blades unlocks and keep the other two.",
    },
    {
      at: "Once, at level 30, for the Blood Boil Warlock",
      why: "The Demon tree shares only the Goatman with this route, and the tree's real threshold is Demonic Mastery's tenth hard point — which is what takes the demon cap from one to three and which nothing else in the game moves. Respec once you can pay for it rather than trickling into it.",
    },
    {
      at: "Three tokens exist and at most one is needed",
      why: "Akara gives a full respec for the Den of Evil in every difficulty. Two of the four builds want none of them, and the two that do want one — so every Warlock finishes this journey with at least two tokens in the stash and the freedom to try a second build on the same character.",
    },
  ],

  confidence: "single",
};
