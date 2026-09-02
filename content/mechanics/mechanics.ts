import type { MechanicArticle } from "@/lib/types";

/**
 * Long-form mechanics explanations.
 *
 * Stored as typed content blocks rather than raw strings so tables keep their
 * structure and item references stay linkable and type-checked.
 *
 * The bar for adding an article here is that the numbers have been verified
 * against a primary source, or that the disagreement between sources is itself
 * documented. Several of these articles exist specifically to record what is
 * *not* settled.
 */
export const mechanics: MechanicArticle[] = [
  {
    slug: "magic-find",
    name: "Magic Find",
    category: "loot",
    summary:
      "How Better Chance of Getting Magic Items actually works, why it has diminishing returns, and why more is not always better.",
    keyFacts: [
      "Magic Find improves the chance an item that already dropped is upgraded to a higher quality.",
      "It has severe diminishing returns for unique, set and rare items — but none at all for magic items.",
      "It does not increase the number of items that drop, and it does not affect rune drops.",
      "Chest and container drops do not use your Magic Find at all.",
    ],
    body: [
      {
        type: "heading",
        text: "What it actually does",
      },
      {
        type: "paragraph",
        text: "Magic Find does not make more items drop, and it does not make better base items drop. When the game has already decided an item will drop, Magic Find improves the roll that decides that item's quality — pushing it up the ladder from normal toward magic, rare, set and unique.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "It does not help with runes",
        text: "Runes are not affected by Magic Find at all. If you are farming the Countess or Travincal for runes, your Magic Find gear is doing nothing — wear survivability instead.",
      },
      {
        type: "heading",
        text: "Diminishing returns",
      },
      {
        type: "paragraph",
        text: "This is the part that surprises people. Magic Find is scaled down before it is applied, and the scaling is aggressive. Your effective Magic Find for each quality tier is:",
      },
      {
        type: "formula",
        expression: "Effective MF (unique) = (MF x 250) / (MF + 250)",
        caption: "Uniques use a factor of 250 — the harshest curve in the game.",
      },
      {
        type: "formula",
        expression: "Effective MF (set) = (MF x 500) / (MF + 500)",
      },
      {
        type: "formula",
        expression: "Effective MF (rare) = (MF x 600) / (MF + 600)",
      },
      {
        type: "paragraph",
        text: "Magic items have no diminishing returns — their Magic Find applies in full.",
      },
      {
        type: "table",
        headers: ["Your MF", "Effective (unique)", "Effective (set)", "Effective (rare)"],
        rows: [
          ["0%", "0%", "0%", "0%"],
          ["100%", "71%", "83%", "86%"],
          ["200%", "111%", "143%", "150%"],
          ["300%", "136%", "188%", "200%"],
          ["500%", "167%", "250%", "273%"],
          ["1000%", "200%", "333%", "375%"],
        ],
        caption:
          "Doubling your Magic Find from 100% to 200% gains you 40 effective points for uniques. Doubling again from 200% to 400% gains you only about 40 more.",
      },
      {
        type: "callout",
        variant: "info",
        title: "The practical conclusion",
        text: "Somewhere around 200-400% Magic Find, additional points stop being worth what you give up to get them. Killing twice as fast at 200% Magic Find beats killing at half speed with 500%. This is why the strongest magic-find setups are the ones that keep enough damage and survivability to clear quickly.",
      },
      {
        type: "heading",
        text: "Where Magic Find does not apply",
      },
      {
        type: "list",
        items: [
          "Runes — completely unaffected.",
          "Chests, corpses, urns and other containers use a separate mechanism that ignores your Magic Find. This is why Lower Kurast chest running can be done in cheap gear.",
          "Quest drops, such as Andariel's first kill, are governed by their own rules.",
          "Gold. Extra Gold from Monsters is a separate stat.",
        ],
      },
      {
        type: "heading",
        text: "Player count matters more than you think",
      },
      {
        type: "paragraph",
        text: "Increasing the player count (in single player, the /players command) raises monster life and experience, and increases the number of items dropped. Unlike Magic Find, this has no diminishing returns — which is why experienced farmers raise player count before they stack more Magic Find.",
      },
    ],
    related: ["area-levels-and-treasure-classes"],
    confidence: "verified",
  },

  {
    slug: "area-levels-and-treasure-classes",
    name: "Area Levels & Treasure Classes",
    category: "loot",
    summary:
      "Why area level 85 is the number every farming guide obsesses over, and why some bosses drop above their own zone.",
    keyFacts: [
      "Every area has three separate levels — one per difficulty.",
      "Monster level determines which treasure class the game rolls on, and therefore which items can drop at all.",
      "Area level 85 unlocks the highest treasure classes; below it, entire item tiers are impossible.",
      "Act bosses and some super uniques have their own monster level, higher than the zone they stand in.",
    ],
    body: [
      {
        type: "heading",
        text: "Three numbers, not one",
      },
      {
        type: "paragraph",
        text: "Each area in Diablo II has a separate level for Normal, Nightmare and Hell. The Ancient Tunnels are level 17 in Normal, 46 in Nightmare and 85 in Hell. Only the Hell number is usually interesting, because only in Hell do areas reach the top of the table.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "A trap for guide writers",
        text: "The game's levels.txt contains two sets of columns: one for Classic Diablo II and one for the Lord of Destruction expansion. D2R uses the Expansion columns. Reading the Classic columns gives Ancient Tunnels a Hell level of 67 rather than 85 — a completely different conclusion about whether the area is worth farming. Every area level on this site comes from the Expansion columns.",
      },
      {
        type: "heading",
        text: "Why 85",
      },
      {
        type: "paragraph",
        text: "When a monster dies the game picks a treasure class based on its level, then rolls within it. Treasure classes are tiered, and the highest ones — the ones containing elite unique bases and the best items in the game — require a monster level of 85. Below that threshold, no amount of Magic Find or patience will produce those items from ordinary monsters. This is the single most consequential fact about any farming area.",
      },
      {
        type: "heading",
        text: "Bosses break the rule",
      },
      {
        type: "paragraph",
        text: "Act bosses and several super uniques carry their own monster level, independent of the zone they occupy. Hell Mephisto stands in a level 83 area but is himself monster level 87. Pindleskin stands in a level 83 area but is monster level 86. This is exactly why both are worth running despite their zones falling short of 85 — and why 'is this area level 85?' is the wrong question for a boss run.",
      },
      {
        type: "table",
        headers: ["Target", "Area level (Hell)", "Monster level (Hell)"],
        rows: [
          ["Mephisto", "83", "87"],
          ["Pindleskin", "83", "86"],
          ["Ancient Tunnels", "85", "85"],
          ["Chaos Sanctuary", "85", "85"],
          ["Worldstone Keep", "85", "85"],
          ["The Countess", "79", "79"],
        ],
        caption:
          "The Countess is capped by her area level, which is why she cannot drop runes above Ist no matter how long you run her.",
      },
      {
        type: "heading",
        text: "Item level and what it means for you",
      },
      {
        type: "paragraph",
        text: "An item that drops is stamped with an item level derived from the monster that dropped it. That item level then constrains which affixes can roll on it. A rare circlet from a level 40 monster simply cannot roll the high-tier affixes a level 85 monster's circlet can. This is why farming location matters for rares and crafts, not only for uniques.",
      },
    ],
    related: ["magic-find", "terror-zones"],
    confidence: "verified",
  },

  {
    slug: "resistances-and-immunities",
    name: "Resistances & Immunities",
    category: "combat",
    summary:
      "The difficulty penalties that catch every new player, and why a mastery skill cannot break an immunity.",
    keyFacts: [
      "Nightmare applies −40 to all your resistances. Hell applies −100.",
      "Your resistances cap at 75% by default; some items raise the cap.",
      "A monster is immune at 100% resistance or above.",
      "Resistance reduction against an immune monster works at one fifth effectiveness — and usually cannot break the immunity.",
    ],
    body: [
      {
        type: "heading",
        text: "The difficulty penalty",
      },
      {
        type: "paragraph",
        text: "This is the mechanic that kills more characters than any other, because it applies silently the moment you change difficulty.",
      },
      {
        type: "table",
        headers: ["Difficulty", "Resistance penalty", "Experience lost on death"],
        rows: [
          ["Normal", "None", "None"],
          ["Nightmare", "−40 to all resistances", "5% of the current level"],
          ["Hell", "−100 to all resistances", "10% of the current level"],
        ],
        caption:
          "Recovering your corpse returns 75% of the experience lost. Verified against The Arreat Summit.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Plan for the destination, not where you are",
        text: "A character who finishes Normal comfortably at 75% fire resistance begins Nightmare at 35%, and would begin Hell at −25%. Negative resistance means you take *more* than full damage. Fix resistances before you change difficulty, not after you start dying.",
      },
      {
        type: "heading",
        text: "The 75% cap",
      },
      {
        type: "paragraph",
        text: "Your resistances cap at 75% by default. Points above the cap are not wasted, though — they are a buffer against the next difficulty's penalty, and against monsters that apply resistance reduction such as Conviction. A character sitting at 175% fire resistance in Nightmare will still be at 75% in Hell.",
      },
      {
        type: "paragraph",
        text: "Some items raise the cap itself. The maximum-resistance runes (Gul, Vex, Ohm, Lo) each give +5% to one maximum resistance in armor, and several uniques do the same.",
      },
      {
        type: "heading",
        text: "Immunity",
      },
      {
        type: "paragraph",
        text: "A monster with 100% or more resistance to an element is immune to it and takes no damage from that element. In Hell, immunities are common and specific: a build with one damage type will eventually meet things it simply cannot hurt.",
      },
      {
        type: "callout",
        variant: "danger",
        title: "Masteries do not break immunity",
        text: "Cold Mastery, Lightning Mastery and their equivalents reduce enemy resistance — but against an already-immune monster, all resistance reduction is applied at one fifth effectiveness. A level 20 Cold Mastery nominally worth −100% cold resistance is worth only −20% against a cold-immune target, which is nowhere near enough to bring 110% resistance below 100%.",
      },
      {
        type: "heading",
        text: "What actually breaks immunity",
      },
      {
        type: "list",
        items: [
          "Sunder Charms — set an immune monster's resistance to 95%, converting immunity into a large but finite resistance. The most reliable answer in current patches.",
          "Conviction (from an Infinity runeword on a mercenary) — a large enough reduction to break many, though not all, immunities.",
          "Lower Resist (Necromancer curse, or a charged wand) — similar effect.",
          "Amplify Damage and Decrepify — break physical immunity specifically.",
          "A second damage type. The cheapest answer of all: a physical-damage mercenary handles what your element cannot.",
        ],
      },
      {
        type: "heading",
        text: "The six Sunder Charms, and what they cost you",
      },
      {
        type: "paragraph",
        text: "There is one Sunder Charm per damage type, and they are named rather than numbered. Each requires character level 75.",
      },
      {
        type: "table",
        caption:
          "Charm names and their own penalty, from the game's item data. The penalty applies to you, permanently, while the charm is in your inventory. Black Cleft is the odd one out at -45 to -65%, and Bone Break does not touch a resistance at all.",
        headers: ["Damage type", "Charm", "What it costs you"],
        rows: [
          ["Fire", "Flame Rift", "-70 to -90% to your own Fire Resistance"],
          ["Cold", "Cold Rupture", "-70 to -90% to your own Cold Resistance"],
          ["Lightning", "Crack of the Heavens", "-70 to -90% to your own Lightning Resistance"],
          ["Poison", "Rotting Fissure", "-70 to -90% to your own Poison Resistance"],
          ["Magic", "Black Cleft", "-45 to -65% to your own Magic Resistance"],
          ["Physical", "Bone Break", "-10 to -20% Physical Damage Reduction"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "The penalty is the real decision",
        text: "A Sunder Charm does not simply break immunity — it trades your own resistance for the ability to hurt something. Carrying Flame Rift means walking through Hell with fire resistance 70 to 90 points below where it was, in a difficulty that already applies -100. Budget for that before you pick one up, not after.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Patch 3.3 changed Sunder Charm acquisition",
        text: "Latent Sunder Charms now require a minimum drop level of 75 (raised from 69), their drop rate from Magic Find is reduced, and Magic Find drops are restricted to Hell difficulty. The Herald drop rate is unaffected.",
      },
    ],
    related: ["terror-zones"],
    confidence: "verified",
  },

  {
    slug: "terror-zones",
    name: "Terror Zones",
    category: "endgame",
    summary:
      "Substantially reworked by Reign of the Warlock: a 30-minute rotation, Act-wide terror consumables, Heralds of Terror and the Colossal Ancients.",
    keyFacts: [
      "Terror Zones rotate every 30 minutes, in groups of areas rather than single zones.",
      "Consumables let you choose which Act becomes terrorized, enhancing every zone in it.",
      "Heralds of Terror stalk you in Hell difficulty, each one deadlier than the last.",
      "Killing a terrorized Act boss can drop a statue used to open the Colossal Ancients fight.",
    ],
    body: [
      {
        type: "heading",
        text: "The basics",
      },
      {
        type: "paragraph",
        text: "Terrorized areas have their monster levels raised, which drags low-level zones up into the high treasure classes and makes otherwise pointless areas worth farming. The rotation is server-wide and shared by everyone.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "This system was reworked in 2026",
        text: "Reign of the Warlock changed Terror Zones substantially, and Patch 3.3 tuned them again. Guides written before February 2026 describe an hourly single-zone rotation with no Heralds, no Act terror consumables and no Colossal Ancients. All of that is out of date.",
      },
      {
        type: "heading",
        text: "Rotation",
      },
      {
        type: "list",
        items: [
          "Rotation is every 30 minutes, shortened from the previous hour.",
          "Zones rotate in groups rather than individually — for example 'Burial Grounds, The Crypt and The Mausoleum' together, or 'Worldstone Keep, Throne of Destruction and Worldstone Chamber'.",
          "Consumables can be earned that terrorize an entire Act. Every zone within it is enhanced for the duration.",
        ],
      },
      {
        type: "heading",
        text: "Heralds of Terror",
      },
      {
        type: "paragraph",
        text: "In Hell difficulty only, Terror Zones spawn Heralds of Terror — hunters that actively track the player rather than waiting to be found. Each successive Herald that reaches you is described by Blizzard as exponentially more dangerous than the last. Heralds have tiers, and Patch 3.3 increased the chance of rare-or-better drops from Tier 3 upward.",
      },
      {
        type: "heading",
        text: "The Colossal Ancients",
      },
      {
        type: "paragraph",
        text: "Killing a terrorized Act boss at the end of a Terror Zone run has a chance to drop a statue. Statues are combined in the Horadric Cube to open a new pinnacle encounter against the Colossal Ancients — a gauntlet in which killing one Ancient makes the survivors stronger and unlocks additional abilities on them.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Statue count is not settled",
        text: "Blizzard's own announcement contradicts itself, describing a statue as usable \"in combination with all five other statues\" in one place (implying six) and telling players to \"combine all five statues in the Horadric Cube\" in another. Until this is confirmed in-game, treat it as \"one statue from each terrorized Act boss\" and do not rely on a specific number.",
      },
      {
        type: "paragraph",
        text: "Felling a Colossal Ancient rewards a Unique Jewel determined by which Ancient you killed last; each can drop one of two. All these jewels require character level 75, and — like Gheed's Fortune — only one may be equipped across all your items at a time.",
      },
      {
        type: "table",
        headers: ["Ancient", "Jewels"],
        rows: [
          ["Talic", "Defender's Fire, Defender's Bile"],
          ["Korlic", "Protector's Frost, Protector's Stone"],
          ["Madawc", "Not captured in the announcement — unverified"],
        ],
        caption:
          "Madawc's two jewels were not listed in the source material reviewed. Left blank rather than guessed.",
      },
      {
        type: "heading",
        text: "Patch 3.3 changes",
      },
      {
        type: "list",
        items: [
          "Increased chance of Rare-or-better items from Herald Tier 3 and above.",
          "Latent Sunder Charm minimum drop level raised from 69 to 75.",
          "Latent Sunder Charm drop rate reduced when using Magic Find; the Herald drop rate is unaffected.",
          "Latent Sunder Charms obtained through Magic Find now drop in Hell difficulty only.",
          "An additional item now drops alongside a Worldstone Shard, but Worldstone Shard drop rate was reduced.",
          "Ancient Statue drop rate reduced.",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "Open questions",
        text: "What Latent Sunder Charms and Worldstone Shards actually do has not yet been verified from a primary source, and they are clearly distinct from the original Sunder Charms. Rather than guess, this page records the drop-rate changes and leaves the effects unstated.",
      },
    ],
    related: ["resistances-and-immunities", "area-levels-and-treasure-classes"],
    confidence: "single",
  },

  {
    slug: "sockets",
    name: "Sockets",
    category: "items",
    summary:
      "How many sockets an item can have, the three ways to add them, and why you should almost never gamble a good base.",
    keyFacts: [
      "Larzuk's quest reward gives the maximum sockets for that item type on a normal item.",
      "The Horadric Cube socket recipe gives a random number of sockets.",
      "A Hel rune plus a Scroll of Town Portal empties sockets, destroying what was in them.",
      "Socket count is capped by item type and by item level.",
    ],
    body: [
      {
        type: "heading",
        text: "Three ways to get sockets",
      },
      {
        type: "table",
        headers: ["Method", "Result", "When to use it"],
        rows: [
          [
            "Larzuk (Siege on Harrogath quest)",
            "Maximum sockets for that item type, if the item is normal quality",
            "Always, for a base you actually intend to use. One use per difficulty.",
          ],
          [
            "Horadric Cube recipe",
            "A random number of sockets within the item's allowed range",
            "When you have run out of Larzuk uses and can afford to gamble.",
          ],
          [
            "Found already socketed",
            "Whatever it rolled",
            "Check every white item that drops — a 4-socket Crystal Sword is a Spirit.",
          ],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Larzuk behaves differently on magic and rare items",
        text: "On a normal (white or grey) item Larzuk gives the maximum sockets that item type allows. On magic and rare items his behaviour is far less generous and frequently produces one socket. Only hand him normal items when you need a specific count.",
      },
      {
        type: "heading",
        text: "The Cube recipes",
      },
      {
        type: "table",
        headers: ["Recipe", "Result"],
        rows: [
          [
            "Tal + Thul + Perfect Topaz + normal Body Armor",
            "1–4 sockets, random",
          ],
          [
            "Ral + Amn + Perfect Amethyst + normal Weapon",
            "1–6 sockets, random",
          ],
          [
            "Ral + Thul + Perfect Sapphire + normal Helm",
            "1–3 sockets, random",
          ],
          [
            "Tal + Amn + Perfect Ruby + normal Shield",
            "1–4 sockets, random",
          ],
        ],
        caption:
          "Source: The Arreat Summit. The item must be normal quality and unsocketed. Low-quality and superior items do not work.",
      },
      {
        type: "heading",
        text: "Removing sockets",
      },
      {
        type: "paragraph",
        text: "A Hel rune plus a Scroll of Town Portal, cubed with a socketed item, empties every socket. The base item survives; the runes, gems or jewels that were in it are destroyed. This is the only way to recover a base from a mistake — and it is why socketing in the wrong order is so expensive.",
      },
      {
        type: "callout",
        variant: "info",
        title: "The socket count cap is per item type and item level",
        text: "A Crystal Sword can reach 6 sockets in principle, but the actual maximum depends on the item's level. A low-level base may cap below its type's theoretical maximum, which is why an early Crystal Sword sometimes will not take 4 sockets. Check the item level before spending a Larzuk use.",
      },
    ],
    related: ["area-levels-and-treasure-classes"],
    confidence: "verified",
  },

  {
    slug: "pierce",
    name: "Pierce",
    category: "combat",
    summary:
      "Why one stat multiplies four Amazon builds and does nothing at all for three others, and why nobody publishes a per-level table for it.",
    keyFacts: [
      "Pierce lets a projectile continue past a target it has hit and keep travelling.",
      "The skill and every source on gear are one pool, and the game's own columns give it a floor of 10% and a ceiling of 100%.",
      "It applies to projectiles only. A melee attack cannot pierce, whatever your total says.",
      "On Lightning Fury it multiplies rather than adds: every enemy the javelin passes through releases a fresh burst of bolts.",
      "Guided Arrow does not pierce. It seeks a single target and stops there.",
    ],
    body: [
      {
        type: "paragraph",
        text: "Pierce is the Amazon's force multiplier and the most commonly misunderstood number on her sheet. Two things make it confusing: it is both a skill and an item stat with one shared total, and its value swings from *build-defining* to *literally zero* depending on which button you are pressing.",
      },
      {
        type: "heading",
        text: "What the game's own columns say",
      },
      {
        type: "paragraph",
        text: "The Pierce skill is a passive whose two parameters the game labels **Min % Chance** and **Max % Chance**, set to 10 and 100. Its curve between them is a diminishing-returns calculation that lives in the engine rather than in any column an extraction can read — which is why this site publishes the floor and the ceiling and refuses to draw a straight line between them. A per-level table for Pierce is a table somebody invented.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Critical Strike works the same way",
        text: "Critical Strike, Dodge, Avoid and Evade all use the same shape: a stated starting chance, a stated ceiling, and a curve the tables do not contain. Any guide that prints exact per-level values for them is filling in a gap rather than reading one.",
      },
      {
        type: "heading",
        text: "The skill and your gear are one pool",
      },
      {
        type: "paragraph",
        text: "Piercing Attack from an item adds to the Pierce skill's chance rather than rolling separately, and the total is what the projectile checks against. This is why builds state a *chance to reach* rather than a *number of points to spend* — the points you need depend entirely on what you are wearing.",
      },
      {
        type: "table",
        headers: ["Source", "Piercing Attack", "Cost"],
        rows: [
          ["Razortail", "33%", "A belt slot and 20 Strength"],
          ["Demon Machine", "66%", "A weapon slot, and 95 Dexterity"],
          ["Buriza-Do Kyanon", "100%", "A weapon slot, on a slow crossbow base"],
          ["Pierce (skill)", "10% at level 1, ceiling 100%", "Hard points, plus Penetrate as its prerequisite"],
        ],
        caption:
          "Item values from the pinned blizzhackers/d2data extraction. A Buriza already sits at the ceiling on its own, which is why a Buriza Amazon spends no points on Pierce at all.",
      },
      {
        type: "heading",
        text: "Which skills it actually helps",
      },
      {
        type: "paragraph",
        text: "This is the part that decides whether Razortail belongs on a build's list. Pierce is a property of *projectiles*. A skill that fires one gets everything from it; a skill that swings a weapon gets nothing.",
      },
      {
        type: "table",
        headers: ["Skill", "Does pierce help?", "Why"],
        rows: [
          [
            "Lightning Fury",
            "**Enormously**",
            "The javelin passes through the target and every enemy it passes releases another burst of bolts. This multiplies the skill rather than adding to it.",
          ],
          [
            "Multiple Shot, Strafe",
            "Yes",
            "Each arrow that pierces hits the row behind the one you aimed at.",
          ],
          [
            "Exploding, Immolation and Freezing Arrow",
            "Yes",
            "The arrow explodes on each impact, so a pierced arrow detonates more than once.",
          ],
          [
            "Poison Javelin, Plague Javelin, Lightning Bolt",
            "Yes",
            "All three are thrown, and all three travel past what they hit.",
          ],
          [
            "Guided Arrow",
            "**No**",
            "It seeks one target and ends on it. Pierce is wasted on a Guided Arrow bar.",
          ],
          [
            "Charged Strike, Lightning Strike, Jab, Fend, Impale",
            "**No**",
            "Melee attacks. Nothing leaves the weapon, so there is nothing to pierce with.",
          ],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Pierce does not help the skill it is most often bought for",
        text: "A javelin Amazon presses Lightning Fury to clear and Charged Strike to kill bosses. Pierce is the single biggest multiplier on the first and worth exactly nothing on the second — so a Razortail is a clearing item, and swapping to a defensive belt for a boss costs you no single-target damage at all.",
      },
      {
        type: "heading",
        text: "Where it stops paying",
      },
      {
        type: "paragraph",
        text: "Pierce checks once per target, so its value falls off in thin crowds and rises steeply in dense ones. In the Secret Cow Level or the Chaos Sanctuary a high total is worth more than an equivalent amount of raw damage; against a lone boss it is worth nothing at all. That asymmetry is why the farming lists on the javelin and bow pages are ordered by density rather than by area level.",
      },
      {
        type: "refs",
        title: "Items that carry Piercing Attack",
        refs: [
          { kind: "unique", slug: "razortail" },
          { kind: "unique", slug: "buriza-do-kyanon" },
          { kind: "unique", slug: "demon-machine" },
        ],
      },
    ],
    related: ["resistances-and-immunities"],
    confidence: "verified",
  },
];
