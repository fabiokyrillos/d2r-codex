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
  {
    slug: "corpse-explosion",
    name: "Corpse Explosion",
    category: "combat",
    summary:
      "Where the damage actually comes from, why a Champion does not explode harder than the trash beside it, and what raises it.",
    keyFacts: [
      "The damage is 70–120% of the exploded monster **type's** base life, recomputed from the game's own table — not the corpse's own life.",
      "Player count, and Champion, Unique and Super Unique life bonuses, do not raise it.",
      "Half the damage is physical and half is fire, split from one rolled total.",
      "**Skill level, radius and damage percentage are three different things.** Points and +skills raise the level; the level raises the radius; nothing on that path moves the 70–120% band.",
      "Amplify Damage helps the physical half. Lower Resist, and anything that lowers a target's fire resistance, helps the fire half.",
      "If your character level is below the corpse's monster level, the damage is scaled down in that proportion.",
    ],
    body: [
      { type: "heading", text: "The sentence that is almost right" },
      {
        type: "paragraph",
        text: "Corpse Explosion is usually described as dealing damage based on the corpse's maximum life. That is close enough to be useful and wrong in the ways that decide how you play it. The skill does not read the corpse. It looks up **what that kind of monster is worth** at that monster's level and difficulty, in the same table the game used to create it, and takes the average of the life range it finds there.",
      },
      {
        type: "paragraph",
        text: "Everything below follows from that one substitution, and each consequence is something a player can act on.",
      },
      { type: "heading", text: "What does not raise it" },
      {
        type: "list",
        items: [
          "**Player count.** Monsters have more life in a full game; the table the skill reads does not change, so the explosion does not either.",
          "**Champion, Unique and Super Unique bonuses.** A Champion pack has several times the life of the monsters beside it and explodes for the same amount. There is no reason to save the boss of a pack for last.",
          "**The skill's own level.** Points buy radius and nothing else. The 70–120% band does not move.",
        ],
      },
      { type: "heading", text: "What does raise it" },
      {
        type: "list",
        items: [
          "**Killing something tougher.** A Baal-run minion is worth more than a Cow, and the difference is the whole of the skill's scaling.",
          "**Difficulty.** The lookup is per difficulty, so the same monster explodes harder in Hell than in Normal.",
          "**Your own character level**, but only as a penalty that stops applying. If your level is below the monster's, the damage is multiplied by yours over its. Level past it and the penalty is simply gone; there is no bonus beyond that point.",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "It is the first kill that costs you",
        text: "Nothing about the explosion is worth optimising except getting the first corpse. Whatever you kill first sets the whole chain going, and the pack it clears would have exploded for the same amount whichever member you had killed first.",
      },
      { type: "heading", text: "Half physical, half fire" },
      {
        type: "paragraph",
        text: "One total is rolled between 70% and 120%, and then split: half is dealt as physical damage and half as fire. Each half meets the target's resistance to its own type, which is why the skill keeps working against monsters that stop most things dead.",
      },
      {
        type: "table",
        headers: ["Against", "What happens"],
        rows: [
          ["A fire immune", "The fire half is reduced or stopped. The physical half lands normally."],
          ["A physical immune", "The physical half is reduced or stopped. The fire half lands normally."],
          ["Both immune", "Very little. Extremely rare, and the reason a second damage type is worth having."],
          ["Amplify Damage on the target", "The physical half hits harder — the curse cuts physical damage resistance by 100 points, as it does for every other physical hit."],
          ["Lower Resist on the target", "The fire half hits harder. So does a Sunder Charm, a mercenary's Conviction, or any −% to Enemy Fire Resistance you carry."],
        ],
      },
      { type: "heading", text: "Three numbers people run together" },
      {
        type: "paragraph",
        text: "Almost every wrong statement about this skill comes from treating its **skill level**, its **radius** and its **damage percentage** as one quantity. They are three, and only two of them are connected:",
      },
      {
        type: "table",
        headers: ["Quantity", "What moves it", "What does not"],
        rows: [
          [
            "Skill level",
            "Hard points, +Necromancer Skills, +Poison and Bone Skills — and **+to Fire Skills**, because the game tags this skill's element as fire, so an item that adds levels to fire skills adds them here.",
            "Nothing about the corpse.",
          ],
          [
            "Radius",
            "The skill level, and only the skill level: 8 half squares at level 1 plus 1 per level.",
            "The corpse, the difficulty, your character level.",
          ],
          [
            "Damage percentage",
            "Nothing. The 70–120% band is two flat parameters.",
            "**Skill level, +skills of any kind, and every item that adds levels.** Levelling the skill to twenty does not make one explosion hit harder; it makes it reach further.",
          ],
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "So +to Fire Skills does something, and it is not what it looks like",
        text: "The skill's element is fire in the game's own tables, so a wand or amulet with **+to Fire Skills** raises its effective level exactly as +Necromancer Skills does — and what a higher level buys here is **radius**. That is a real upgrade for a skill whose whole job is reaching the next corpse. What it is not is more damage per corpse, and an item chosen for the fire tag on the theory that it raises the explosion's damage was chosen for the wrong reason.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "What this site still does not claim",
        text: "Whether **+% Fire Skill Damage** raises the fire half is not asserted here, in either direction. The split is computed inside the skill from the corpse's life before the ordinary spell-damage pipeline runs, and this pass did not trace where the resulting fire damage rejoins it. A Fire Mastery is a separate matter and a simpler one: it is a Sorceress passive, and a Necromancer cannot have it — so it is not a modifier that applies to this skill on this class, whatever the pipeline does. Neither belongs in a gear recommendation as a direct damage increase without evidence that does not exist yet.",
      },
      { type: "heading", text: "Radius, and the unit problem" },
      {
        type: "paragraph",
        text: "The game states the radius in a unit it names: **half squares**, starting at 8 and rising by 1 per skill level. The engine halves that number before using it, so the effective radius runs from about 4 at level 1 to about 13 at level 20. That is the whole of what points buy, and it is worth buying — a Corpse Explosion that reaches the next corpse is a chain, and one that does not is a single cast.",
      },
      {
        type: "paragraph",
        text: "The published radius on this site is the game's own parameter, with the halving stated rather than applied to it. Older documentation converts the same parameter to yards by dividing it by three, giving 2.6 at level 1 and 9 at level 20. Neither convention derives from the other, and this site does not pick one and call it a distance in yards. The number that is certain is the parameter and what the engine does with it.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Curse radius is a different unit",
        text: "A curse's radius parameters are named only \"Radius\", and the engine uses them as they stand — no halving. Applying Corpse Explosion's conversion to a curse, or the reverse, would be wrong by a factor of two in one direction or the other.",
      },
      { type: "heading", text: "Where this comes from" },
      {
        type: "paragraph",
        text: "The 70%, the 120%, the 50% split and the radius parameters are the skill's own columns in the pinned game-data extraction this site reads. The substitution of the monster type's table life for the corpse's own, the halving of the radius, and the character-level penalty are read from the reference implementation of the legacy engine — which is the Diablo II that predates Resurrected, and is named as such rather than presented as the current build. Nothing here depends on a claim the two disagree about.",
      },
    ],
    related: ["resistances-and-immunities", "curses", "minions"],
    confidence: "verified",
  },
  {
    slug: "curses",
    name: "Curses",
    category: "combat",
    summary:
      "One curse per monster, what each of the ten actually does, and why the argument is never which is strongest.",
    keyFacts: [
      "A monster carries exactly one curse. Casting a second replaces the first.",
      "Attract is the exception: while it runs, **no** curse can be applied to that target at all.",
      "**The one-fifth rule is narrow.** It applies to the three curses that lower a resistance, and only against a target already immune to the resistance being lowered.",
      "**Amplify Damage and Decrepify are not two grades of the same curse.** Against a physical immune only Amplify Damage breaks it, and no amount of Decrepify substitutes.",
      "Dim Vision and Terror are the only two curses whose duration is divided by the difficulty — by 2 in Nightmare and by 4 in Hell.",
      "Curse Resistance is a real stat in the engine, and **nothing in the current baseline gives it to anything**. Bosses do not shrug curses off by default.",
    ],
    body: [
      { type: "heading", text: "One slot" },
      {
        type: "paragraph",
        text: "Every curse writes into the same place on the monster. Casting Decrepify over Amplify Damage does not add to it; it replaces it. That single rule is the whole shape of the tree — ten skills competing for one slot — and it is why the useful question is never which curse is strongest but which one you are giving up to cast this one.",
      },
      {
        type: "list",
        items: [
          "Recasting **the same** curse at the same effective level refreshes its duration.",
          "Casting it at a **lower** effective level than the one already on the target does nothing at all — a Necromancer whose curse level dropped when they swapped gear cannot overwrite their own better curse.",
          "**Attract locks the slot.** While it is on a monster, no curse can be applied — not Amplify Damage, and not another Attract.",
        ],
      },
      { type: "heading", text: "The one-fifth rule, and exactly where it applies" },
      {
        type: "paragraph",
        text: "Three curses lower a resistance: Amplify Damage and Decrepify lower physical damage resistance, and Lower Resist lowers the four elemental ones. **For those three, and only against a target whose base value of the resistance being lowered is already 100 or more, the game divides the curse's effect by five.** It is the same one-fifth rule the Sorceress's masteries run into, and it is applied per stat rather than per skill.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "What the rule does not say",
        text: "It is not a general penalty against tough monsters, it is not a boss rule, and it does not touch the other seven curses at all. Terror on a fire immune lasts exactly as long as Terror on anything else, because Terror does not lower a resistance. Lower Resist on a monster that is fire immune but not cold immune is cut against its fire and works in full against its cold — one curse, one cast, two different outcomes on the same target.",
      },
      {
        type: "table",
        headers: ["Curse", "Full effect", "Against something immune to that stat"],
        rows: [
          ["Amplify Damage", "−100 physical damage resistance", "−20, which breaks a monster sitting at exactly 100%"],
          ["Decrepify", "−50 physical damage resistance", "−10, which does not break a 100% immunity"],
          ["Lower Resist", "−25% up to −70% fire, cold, lightning and poison resistance", "A fifth of that, against the element the monster is immune to"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "This is the one place the choice is not a judgement call",
        text: "Against a physical immune, Amplify Damage breaks the immunity and Decrepify does not — 20 points against a monster sitting at 100 is enough, and 10 is not. **The two are not interchangeable and neither is a strictly better version of the other.** Everywhere else they are a real trade: Amplify doubles your damage against an unresisting target, while Decrepify multiplies it by 1.5 and slows, weakens and hobbles the target as well. A page that treats Decrepify as \"Amplify Damage with utility\" is wrong in exactly the situation where the difference decides the fight.",
      },
      { type: "heading", text: "The ten, with their numbers" },
      {
        type: "paragraph",
        text: "Radius and duration at one hard point and at twenty. The durations are the Normal-difficulty figures; Dim Vision and Terror are shorter elsewhere, and nothing else is.",
      },
      {
        type: "table",
        headers: ["Curse", "Radius", "Duration", "What it does"],
        rows: [
          ["Amplify Damage", "3 → 22", "8s → 65s", "−100 physical damage resistance"],
          ["Dim Vision", "4 → 23", "7s → 45s", "Blinds: the monster stops chasing and stops shooting"],
          ["Weaken", "9 → 28", "14s → 59.6s", "−33% → −52% physical damage dealt"],
          ["Iron Maiden", "7", "12s → 57.6s", "Returns 200% → 675% of melee damage to the attacker"],
          ["Terror", "4", "8s → 27s", "The monster flees"],
          ["Confuse", "6 → 25", "10s → 48s", "The monster attacks whatever is nearest, including its own pack"],
          ["Life Tap", "4 → 23", "16s → 61.6s", "50% of physical damage dealt to it returns as life"],
          ["Attract", "9", "12s → 80.4s", "Everything nearby attacks the cursed monster"],
          ["Decrepify", "6", "4s → 15.4s", "−50% movement, attack speed, damage dealt and physical resistance"],
          ["Lower Resist", "7 → 26", "20s → 58s", "−25% up to −70% fire, cold, lightning and poison resistance"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Radius is in the game's own unit, and it is not Corpse Explosion's",
        text: "A curse's radius parameters are named only \"Radius\" and the engine uses them exactly as they stand. Corpse Explosion's are named \"half squares\" and the engine halves them first. The two are different units with the same-looking numbers, so no shared conversion to yards is applied to either.",
      },
      { type: "heading", text: "Difficulty, and the two curses it shortens" },
      {
        type: "paragraph",
        text: "Dim Vision and Terror both work by changing what a monster's AI is doing, and both have their duration divided by the difficulty's curse divisor: 1 in Normal, 2 in Nightmare, 4 in Hell. Dim Vision at one point lasts 7 seconds in Normal and under 2 in Hell. Every other curse in the tree lasts the same everywhere.",
      },
      { type: "heading", text: "Curse Resistance, and what actually carries it" },
      {
        type: "paragraph",
        text: "The engine has a Curse Resistance stat. Where a target has it, a curse's duration is reduced in proportion, and at 100 or more the curse does not land at all. That is the mechanism, and it is worth knowing because it is the shape a future patch would use.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Nothing in the current baseline populates it",
        text: "Checked rather than assumed: the stat exists in the game's stat table, **no property in the property table writes to it**, and the monster-property table — thirteen rows in the whole game — grants extra fire damage, crushing blow, faster cast, knockback, thorns and fade, and no curse resistance to anything. So a boss on this baseline is not quietly resisting your curses. If Amplify Damage feels unreliable on Mephisto, the explanation is somewhere else — the one-fifth rule if he is immune to what you are lowering, or a second curse of your own overwriting the first.",
      },
      {
        type: "paragraph",
        text: "This site therefore does **not** publish the common claim that curses are generally weaker against bosses. It is a statement about a stat that is currently zero everywhere, and repeating it would leave a reader skipping the single largest physical damage multiplier in the game on precisely the fights where it works.",
      },
      { type: "heading", text: "Which one, and when" },
      {
        type: "paragraph",
        text: "There is no strongest curse, and a guide that names one is answering a different question than the one the slot poses. What there is, is a shortlist per situation:",
      },
      {
        type: "list",
        items: [
          "**Clearing with physical damage** — Amplify Damage. It is the largest physical multiplier in the game and one point is enough.",
          "**Something dangerous** — Decrepify. Slower, weaker and easier to hit is worth more than a bigger number on a monster that is about to kill you.",
          "**A physical immune** — Amplify Damage, and only Amplify Damage. Decrepify's cut becomes 10 points and does not break it.",
          "**An elemental build, or any poison build** — Lower Resist. It is the only thing in the class that lowers poison resistance, and poison has no Mastery.",
          "**A melee party** — Life Tap. Half the damage dealt comes back as life, for everyone hitting the target.",
          "**Being overwhelmed as a Summoner** — Dim Vision. A blinded pack stops shooting and stops chasing, which is worth more than any amount of damage while the army catches up.",
          "**Something with a lot of life hitting something of yours in melee** — Iron Maiden, which returns a multiple of the damage dealt to whoever dealt it. Read the caution below before planning a fight around it.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Iron Maiden is not an Uber Tristram plan on this site",
        text: "Iron Maiden returning several times the damage dealt is real, and \"curse the boss and let it kill itself\" is the most repeated Necromancer claim there is. Whether it works in **Uber Tristram** depends on what those three bosses actually do to a cursed target and to the pets standing in front of them, and this site has not researched that fight. So the curse is described for what it does, and no page here presents it as an Uber strategy, alone or alongside Life Tap.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Curses arrive from outside the class too",
        text: "A Reaper's Toll casts Decrepify on striking and a Dracul's Grasp casts Life Tap, which is why both turn up on characters with no Necromancer anywhere near them. The one-slot rule still applies: a mercenary's Decrepify overwrites your Amplify Damage exactly as another Necromancer's would.",
      },
      { type: "heading", text: "Where this comes from" },
      {
        type: "paragraph",
        text: "The radii, durations and magnitudes are the curses' own columns in the pinned game-data extraction. The one-slot rule, the Attract exception, the one-fifth immunity divisor, the refresh-and-do-not-downgrade behaviour and the Curse Resistance cut-off are read from the reference implementation of the legacy engine — the Diablo II that predates Resurrected. The difficulty divisor comes from the game's own difficulty table. That **nothing populates Curse Resistance** is a fact about this baseline rather than about the engine, and it was established by reading the stat table, the property table and the monster-property table in the pinned extraction; if a later patch adds a carrier, that sentence is the one to revisit.",
      },
    ],
    related: ["resistances-and-immunities", "corpse-explosion", "minions"],
    confidence: "verified",
  },
  {
    slug: "minions",
    name: "Minions and summons",
    category: "combat",
    summary:
      "What is fixed when a minion is raised, how many you get, why the difficulty resistance penalty is not their problem, and what loses an Iron Golem.",
    keyFacts: [
      "A minion's stats are written onto it when it is created. Raising a skill or putting on +skills gear changes the next one you raise, not the ones already standing.",
      "**Summons do not take the −40 / −100 difficulty resistance penalty.** Every minion's resistance columns carry the same number in Normal, Nightmare and Hell. Your mercenary does take it.",
      "Skeletons and skeletal mages have **separate** caps: eight each at twenty hard points, and more with +skills.",
      "Summon Resist raises fire, lightning, cold and poison. It reaches neither physical nor magic, and it does not reach revives.",
      "Only one golem exists at a time, and the Iron Golem is the only minion that survives leaving a game — it is rebuilt when you next enter one.",
      "A revive lasts three minutes, cannot be refreshed, and takes its life from the monster type's table rather than from the corpse.",
    ],
    body: [
      { type: "heading", text: "The snapshot" },
      {
        type: "paragraph",
        text: "This is the single most consequential thing about the class, and it is invisible while you play. When a minion is created, the game writes its life, its damage, its attack rating, its defence and its resistances onto it — once. They are not recalculated afterwards. **Swapping equipment does not update a minion that is already standing.** A skeleton raised before you put on a helm with +3 to Skeleton Mastery is exactly as strong as it was before you put the helm on, and taking the helm off again does not weaken it either.",
      },
      {
        type: "callout",
        variant: "info",
        title: "What to do about it",
        text: "Re-raise. Unsummon the army and rebuild it after any change to your skill levels — a level-up into Skeleton Mastery, a new helm, a new wand on the swap. It is the difference between an army built at your current +skills and one built at whatever you were wearing when you last found a corpse.",
      },
      {
        type: "callout",
        variant: "success",
        title: "A Skill Shrine is a window, not a buff",
        text: "The shrine raises your skill levels while it runs, and the snapshot is what makes that worth acting on: **a minion raised during the shrine keeps the higher values after it expires**, because the values were written at creation and are never recalculated. An army already standing when you touch the shrine gains nothing. The play is to unsummon and rebuild inside the window, on corpses you have lined up beforehand.",
      },
      { type: "heading", text: "How many of each" },
      {
        type: "table",
        headers: ["Minion", "How many", "At 20 hard points"],
        rows: [
          ["Skeletons", "One per level up to three, then two plus one for every three levels", "8"],
          ["Skeletal mages", "The same formula, counted separately", "8"],
          ["Golems", "One, shared across all four golem skills", "1"],
          ["Revives", "The skill's effective level", "20"],
        ],
      },
      {
        type: "paragraph",
        text: "All four counts read the **effective** skill level rather than hard points, so +skills gear raises them directly. The skeleton and mage caps are independent, which is why a Summoner fields both armies at once rather than choosing between them.",
      },
      { type: "heading", text: "Life and damage, per difficulty" },
      {
        type: "paragraph",
        text: "Every summon is a monster, and the game keeps its life, its damage and its defence in the monster table with a separate column per difficulty. Those columns are the base the rest is built on, and they are the only part of a minion's strength this site publishes as a number.",
      },
      {
        type: "table",
        caption: "Base life and melee damage from the game's own monster table. Skill levels, the masteries and Battle Orders all build on top of these.",
        headers: ["Minion", "Life (N / NM / H)", "Melee damage (N / NM / H)", "Defence (N / NM / H)"],
        rows: [
          ["Skeleton", "21 / 30 / 42", "1–2 / 1–2 / 1–2", "5 / 5 / 6"],
          ["Skeletal mage", "61 / 88 / 123", "1–2 / 1–2 / 1–2", "24 / 26 / 28"],
          ["Clay Golem", "100 / 175 / 275", "2–5 / 2–6 / 3–7", "100 / 100 / 100"],
          ["Blood Golem", "201 / 388 / 637", "7–20 / 11–28 / 12–33", "120 / 120 / 120"],
          ["Iron Golem", "306 / 595 / 980", "7–19 / 11–30 / 12–33", "140 / 140 / 140"],
          ["Fire Golem", "313 / 613 / 1013", "10–27 / 15–39 / 18–47", "200 / 200 / 200"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "This is a base, not a finished number",
        text: "A skeleton in Hell does not have 42 life. It has 42 plus what Skeleton Mastery adds, scaled by the level the skill is summoned at, and raised again by any Battle Orders standing on it. Those further layers are computed inside the engine from columns this site does not publish as a formula, and a page that multiplied them out would be presenting a reconstruction of the legacy engine as though it were a documented interface of the current build. What the base table does establish is the shape: a mage starts at roughly three times a skeleton's life, a golem at five to fifteen times, and every one of them roughly doubles between Normal and Hell while the monsters around it grow far faster than that.",
      },
      {
        type: "paragraph",
        text: "The skeletal mage's melee column is 1–2 and is not the reason to raise one. A mage's damage is the elemental missile it throws, which is rolled from the skill rather than from the monster row, and which is why a mage army answers physical immunity where a skeleton army cannot.",
      },
      { type: "heading", text: "The difficulty penalty is not the army's problem" },
      {
        type: "paragraph",
        text: "A player loses 40 points of every resistance in Nightmare and 100 in Hell. **A summon loses nothing.** The monster table carries a separate resistance column per difficulty for every minion in the class, and in each case the three values are identical — a Clay Golem is 50% cold resistant in Normal, in Nightmare and in Hell alike. The penalty is a property of the player character, and a minion is not one.",
      },
      {
        type: "table",
        caption: "Base resistances. Each of these is the same number in all three difficulties.",
        headers: ["Minion", "Physical", "Magic", "Fire", "Lightning", "Cold", "Poison"],
        rows: [
          ["Skeleton", "0%", "0%", "0%", "0%", "0%", "0%"],
          ["Skeletal mage", "0%", "0%", "0%", "0%", "0%", "0%"],
          ["Clay Golem", "25%", "0%", "0%", "20%", "50%", "0%"],
          ["Blood Golem", "0%", "20%", "0%", "0%", "0%", "20%"],
          ["Iron Golem", "0%", "0%", "0%", "50%", "0%", "100%"],
          ["Fire Golem", "0%", "0%", "100%", "0%", "0%", "0%"],
        ],
      },
      {
        type: "callout",
        variant: "danger",
        title: "Your mercenary is not a summon",
        text: "The mercenary is a hireling with a player's resistance rules, and **he takes the full −40 and −100**. Gearing him for resistance in Hell is necessary and gearing the army for it is a different problem with a different answer. Confusing the two is the most common way a Necromancer page gets this wrong: it recommends resistance charms \"for the pets\", which is not a thing that exists, and then leaves the one member of the party who genuinely needs them at −100.",
      },
      { type: "heading", text: "What Summon Resist actually covers" },
      {
        type: "paragraph",
        text: "Summon Resist grants one passive value, on a diminishing curve that starts at 20% and climbs toward a ceiling of 75%. What that value applies to is narrower than the name suggests:",
      },
      {
        type: "list",
        items: [
          "**It raises fire, lightning, cold and poison resistance.** Those four, and no others.",
          "**It does not raise physical or magic resistance.** A skeleton at twenty points of Summon Resist is still taking full physical damage, which is why a Clay Golem's own 25% physical is not something the skill can reproduce elsewhere.",
          "**It reaches skeletons, skeletal mages and golems.** On the path this site could verify it does not reach revives, so a revive walks into Hell on whatever the monster it came from happened to carry.",
          "**A minion's resistance ceiling is 100**, not the player's 75. Summon Resist stacking onto a Fire Golem's own 100% fire cannot push it past that, and it cannot push anything past it either.",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "The first point is most of the skill",
        text: "The curve is steep at the start and flat afterwards: one hard point already buys the large part of what twenty buy. Because summons take no difficulty penalty, Summon Resist is not compensating for anything — it is a straight addition to an army that was already at its listed values in Hell. That is the whole case for one point rather than twenty, and it is the opposite of the argument usually made for it.",
      },
      { type: "heading", text: "What the two masteries actually give" },
      {
        type: "table",
        headers: ["Skill", "Per level", "Reaches"],
        rows: [
          ["Skeleton Mastery", "+8 life and +2 damage", "Skeletons, skeletal mages and revives"],
          ["Skeleton Mastery (revives only)", "+5% life and +10% damage", "Revives"],
          ["Golem Mastery", "+20% life and +25 attack rating", "Whichever golem is out"],
          ["Golem Mastery (movement)", "0% climbing toward 40%", "Whichever golem is out"],
          ["Summon Resist", "20% climbing toward 75%", "Fire, lightning, cold and poison, on skeletons, mages and golems"],
        ],
      },
      {
        type: "paragraph",
        text: "None of these is a synergy in the game's sense. A synergy reads hard points only; all three of these read the effective level, so gear that grants +skills raises them — and all three are still subject to the snapshot, so raising them does nothing for an army already standing.",
      },
      { type: "heading", text: "Immunity piercing carries to the army" },
      {
        type: "paragraph",
        text: "Each of these minions has a passive that reads the caster's immunity-piercing stats — the effect a Sunder Charm grants. Which immunities each one pierces is not uniform, and the pattern is in the game's own tables:",
      },
      {
        type: "table",
        headers: ["Minion", "Immunities it pierces"],
        rows: [
          ["Skeletons", "Physical"],
          ["Skeletal mages", "Cold, fire, lightning, poison"],
          ["Clay and Blood Golem", "Physical"],
          ["Fire Golem", "Fire"],
          ["Iron Golem and revives", "All six"],
        ],
      },
      { type: "heading", text: "The golem, and the item you cannot get back" },
      {
        type: "paragraph",
        text: "One golem at a time, across all four skills. Summoning a Clay Golem while an Iron Golem is standing replaces the Iron Golem, and the item the Iron Golem was made from is already gone — it was consumed when the golem was made, not held somewhere and returned.",
      },
      { type: "heading", text: "What persists between games, and what does not", level: 3 },
      {
        type: "paragraph",
        text: "Skeletons, skeletal mages, revives and the three ordinary golems do not survive you leaving a game. You arrive in the next one alone and rebuild from the first corpse. **The Iron Golem is the exception**: in the expansion it is stored with the character and reconstructed when you next enter a game, which is what makes the item spent on it an investment rather than a one-session cost — and what makes losing it expensive.",
      },
      {
        type: "table",
        caption: "Every way an Iron Golem, and with it the item inside it, is gone for good.",
        headers: ["What happens", "Result"],
        rows: [
          ["The golem is killed", "Gone. The item is not dropped and not returned."],
          ["Your character dies", "Gone."],
          ["You summon any other golem", "Gone — the new golem replaces it, and one pet slot is all there is."],
          ["A respec removes your point in Iron Golem", "Gone. The skill no longer exists on the character, and neither does the golem."],
          ["You leave the game", "Kept. Rebuilt when you next enter one."],
        ],
      },
      {
        type: "callout",
        variant: "danger",
        title: "Use something you would be content to lose",
        text: "Four of the five rows above destroy the item permanently, and one of them is dying, which is not a plan you control. This site therefore recommends an Iron Golem only from a **cheap, replaceable item**, and never suggests feeding it a Pride, an Insight, a Beast or an Infinity — the standard advice in guides that do not enumerate the loss conditions first. If you would mind losing it, it is not a candidate. And check your respec plans before you cast: a token spent on rearranging the tree takes the golem with it.",
      },
      { type: "heading", text: "Revive is a burst, not an army" },
      {
        type: "list",
        items: [
          "Three minutes, flat, at every skill level, and **it cannot be refreshed**. The clock starts when the monster stands up.",
          "The revive's life is **re-rolled from that monster type's base life range** at its level and difficulty. A Champion revives with the ordinary life of its kind.",
          "If the monster's level is above your character level, its life is scaled down in that proportion.",
          "Only monsters the game flags as revivable can be raised, which is why some packs never yield one.",
          "**Summon Resist does not reach a revive.** Skeletons, mages and golems get it; the revive keeps whatever resistances its own monster type carries, which for most of the popular choices is nothing at all.",
        ],
      },
      { type: "heading", text: "Keeping the army with you" },
      {
        type: "paragraph",
        text: "Minions left far enough behind can stop following, and sometimes disappear. A Town Portal, a waypoint or a set of dungeon stairs collects them; so does Teleport, which recalls them instantly. This is documented behaviour rather than a bug, and it is the practical reason a Summoner walks the route rather than running ahead of it.",
      },
      { type: "heading", text: "The bosses that hit pets harder" },
      {
        type: "paragraph",
        text: "The monster table carries a **Prime Evil** flag, and the engine uses it to raise the damage those monsters deal to a player's pets specifically. Fifteen monsters carry it: Andariel, Duriel, Mephisto, Diablo, Baal and their clone and Uber forms, plus the three Colossal Ancients. It is why an army that walks through a Hell zone unbothered can be deleted by the act boss at the end of it.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "The flag is stated; the multiplier is not",
        text: "That these fifteen deal extra damage to pets is in the game's own table. **How much extra is not**, and this pass did not find a figure it could stand behind, so none is published — a number invented to fill the gap would be the most quotable sentence on the page and the least supported. Play it as a direction rather than as arithmetic: expect the army to die faster to a boss than to anything leading up to it, expect to re-raise mid-fight, and bring corpses.",
      },
      { type: "heading", text: "What this site still could not settle" },
      {
        type: "paragraph",
        text: "Shorter than it was. The difficulty penalty, the Skill Shrine, Iron Golem persistence and the per-difficulty base tables are all answered above. What is left is:",
      },
      {
        type: "list",
        items: [
          "**The Prime Evil damage multiplier against pets.** The flag is Tier 1; the number is not established here.",
          "**How the layers above the base table combine.** Skill level, Skeleton Mastery, Golem Mastery and Battle Orders all raise a minion, and the exact composition is engine behaviour rather than a published column — so this site gives the base and describes the rest qualitatively rather than printing a formula.",
          "**Uber Tristram specifically.** Three of the fifteen Prime Evils stand in one room there; whether an army is a viable answer to them is a question about a fight this pass did not research, and no Necromancer page on this site claims it is.",
        ],
      },
      { type: "heading", text: "Where this comes from" },
      {
        type: "paragraph",
        text: "The counts, the mastery figures, the golem limit, the revive duration, the immunity-piercing table, **the per-difficulty life, damage and resistance columns** and the Prime Evil flag are all columns in the pinned game-data extraction; the minion count is corroborated level by level against the 1.11 documentation. The snapshot, the revive's re-rolled life, its character-level penalty, Summon Resist's reach and the Iron Golem's persistence between games are read from the reference implementation of the legacy engine — the Diablo II that predates Resurrected, named as such because it is not proof about the current build.",
      },
    ],
    related: ["resistances-and-immunities", "corpse-explosion", "curses"],
    confidence: "single",
  },
];
