import type { Build } from "@/lib/types";

/**
 * The second build, chosen specifically to stress the schema in ways the
 * Blizzard Sorceress does not:
 *
 * - Magic damage instead of an element, so `immunityPlan` reads completely
 *   differently — this build has almost no immunity problem at all
 * - A different breakpoint table (75/125 rather than 105)
 * - Real Dexterity investment for maximum block, which the Sorceress stat plan
 *   explicitly rejects
 * - A build that genuinely needs Enigma, where the Sorceress does not
 *
 * Cross-checked against D2Runewizard and DiabloBytes build guides, with skill
 * data verified against The Arreat Summit.
 */
export const hammerdin: Build = {
  slug: "hammerdin",
  name: "Hammerdin",
  classSlug: "paladin",
  summary:
    "Magic damage that almost nothing resists, permanent maximum block, and a party-wide aura. The reference all-rounder.",
  damageTypes: ["magic"],
  primarySkill: "blessed-hammer",
  playstyle:
    "You run Concentration, position yourself so the hammer spiral passes through the pack, and hold the button. The hammers do the aiming badly and you do it well — the whole skill of the build is standing in the right place. Holy Shield keeps your block at maximum, so unlike most high-damage builds you can simply stand in the middle of things. With Enigma you teleport into position instead of walking, and the build becomes as fast as a Sorceress while being far harder to kill.",
  strengths: [
    "Magic damage — only a handful of monsters in the entire game resist it",
    "150% bonus damage to Undead and Demons, which is most of Chaos Sanctuary and Baal",
    "Permanent maximum block through Holy Shield; genuinely tanky at full damage",
    "Concentration and Vigor benefit the whole party",
    "Strong at every gear level, from Spirit-and-Lore to full best in slot",
  ],
  weaknesses: [
    "The hammer spiral is genuinely hard to aim, and the build feels weak until it clicks",
    "Needs Enigma to reach Sorceress-level clear speed — and Enigma is expensive",
    "Damage scales only with +skills, so raw damage gear does nothing",
    "Splits stat points three ways: Strength for gear, Dexterity for block, Vitality for life",
  ],
  difficulty: "moderate",
  budget: "medium",
  ratings: {
    clearSpeed: 5,
    bossing: 4,
    survivability: 5,
    magicFind: 4,
    terrorZones: 5,
    ubers: 3,
    soloSelfFound: 4,
    players8: 5,
  },

  skills: [
    {
      skill: "blessed-hammer",
      points: 20,
      role: "main",
      order: 1,
      note: "Max first. Magic damage in a clockwise spiral, plus 150% to Undead and Demons.",
    },
    {
      skill: "vigor",
      points: 20,
      role: "synergy",
      order: 2,
      note: "+14% magic damage per level, and it makes you faster. Max second.",
    },
    {
      skill: "concentration",
      points: 20,
      role: "main",
      order: 3,
      note: "Your active aura. Multiplies hammer damage directly — this is not a synergy, it must be running.",
    },
    {
      skill: "blessed-aim",
      points: 20,
      role: "synergy",
      order: 4,
      note: "+14% magic damage per level. You will never activate this aura.",
    },
    {
      skill: "resist-lightning",
      points: 20,
      role: "flex",
      order: 5,
      note: "**The Uber Tristram variant, not the core build — and it is worth two different amounts.** Running the aura, twenty hard points give +20% maximum lightning resistance, taking the cap from 75% to 95%. But a Hammerdin runs **Concentration**, and only one aura is active at a time, so in practice you keep the passive half: **+10%, to an 85% cap**. Both numbers read *base* level, so gear +skills raise neither. See the flex points below for when each applies.",
    },
    {
      skill: "holy-shield",
      points: 1,
      role: "utility",
      note: "One hard point. +skills pushes it well past that, and it is what holds your block at maximum.",
    },
    {
      skill: "redemption",
      points: 1,
      role: "utility",
      note: "Switch to it after a pack to refill life and mana from corpses. Replaces most potion use.",
    },
    { skill: "cleansing", points: 1, role: "prerequisite", note: "Vigor's prerequisite, together with Defiance, and a genuine curse-duration swap." },
    { skill: "prayer", points: 1, role: "prerequisite", note: "Cleansing's prerequisite, and therefore on the path to Vigor." },
    { skill: "defiance", points: 1, role: "prerequisite", note: "Vigor prerequisite." },
    { skill: "might", points: 1, role: "prerequisite", note: "Blessed Aim prerequisite, and a usable early aura." },
    { skill: "smite", points: 1, role: "prerequisite", note: "Charge's prerequisite, and therefore Holy Shield's. Also never misses." },
    { skill: "holy-bolt", points: 1, role: "prerequisite", note: "Blessed Hammer prerequisite. Heals other players." },
    {
      skill: "charge",
      points: 1,
      role: "prerequisite",
      note: "**Holy Shield requires Blessed Hammer and Charge.** Charge in turn requires Smite, so the pair costs two points, not one.",
    },
  
  ],
  flexPoints: [
    "One point in **Fanaticism** is worth taking once prerequisites allow — it costs almost nothing and is a strong party aura.",
    "**Salvation** is a useful one-point swap for Uber Tristram and other resistance-hostile content. Note it raises *current* resistance only — unlike the three Resist auras it has no maximum-resistance component at all.",
    "**The 20-point Resist Lightning variant, and what it actually buys.** Uber Mephisto runs Conviction, which drags your lightning resistance down; a higher *cap* is what keeps you at the top of that fall. Twenty hard points raise the cap by 20% while Resist Lightning is the active aura, or by 10% while it is not. A Hammerdin keeps **Concentration** active — it is the damage multiplier the whole build rests on — so the honest value of this variant is **+10% passive, always on, 75% to 85%**. Swapping the aura for the full +20% means fighting the Ubers with unbuffed hammers, which is usually the worse trade.",
    "**Why it is an Uber variant and not the PvM plan.** Twenty points is 18% of the character. Outside Uber Tristram nothing punishes an 85% lightning cap rather than 75%, and those points do more in Holy Shield or as one-point auras. Take it if Uber Tristram is what this character is for; skip it otherwise.",
    "Extra points beyond the five maxed skills go into **Holy Shield** for more defence and block, or **Redemption** for faster sustain.",
  ],

  stats: {
    strength: "Enough for your gear. 103 for a Herald of Zakarum, less if you use a Spirit in a lighter base.",
    dexterity: "Enough to reach 75% block **with Holy Shield active**. Check it with Holy Shield up, not down.",
    vitality: "Everything remaining.",
    energy: "None. Insight and Redemption cover mana entirely.",
    notes: [
      "This is the main way the Hammerdin differs from a caster: **Dexterity is a real investment**, not something to skip. Maximum block is the build's survivability, and it is what lets you stand in packs.",
      "Calculate Dexterity with Holy Shield **active**. Holy Shield's block bonus means you need far less Dexterity than the shield's raw numbers suggest, and people routinely over-invest by fifty points.",
      "Strength depends entirely on your shield choice. A Sacred Targe Spirit needs far less than a Monarch, which is why it is the preferred base.",
      "An Enigma's +0.75 Strength per character level means you can plan Strength assuming you will eventually have one — but do not strand yourself before then.",
    ],
  },

  breakpoints: [
    {
      stat: "fcr",
      value: 125,
      frames: 9,
      priority: "recommended",
      why: "The endgame target. Reachable with Heart of the Oak (40) + Spirit shield (35) + Arachnid Mesh (20) + Magefist (20) + a 10% ring.",
    },
    {
      stat: "fcr",
      value: 75,
      frames: 10,
      priority: "required",
      why: "Hit this first. Two Spirits (35 + 35) plus Magefist (20) gets you to 90% with no rare gear at all.",
    },
    {
      stat: "fhr",
      value: 48,
      frames: 5,
      priority: "recommended",
      why: "The Paladin table is forgiving. 48% is comfortably reachable and enough for almost all content.",
    },
    {
      stat: "fbr",
      value: 32,
      frames: 3,
      priority: "recommended",
      why: "You are blocking constantly, so recovery from a block matters. Herald of Zakarum alone gives 30%.",
    },
  ],

  immunityPlan:
    "This is the build's defining advantage: Blessed Hammer deals magic damage, and only a small number of monsters in Acts 2 and 3 are magic immune. In practice you either let your mercenary handle those, or walk past them. There is no Sunder Charm to hunt, no Infinity to save for, and no zone you have to avoid. The trade is that you cannot increase your damage by lowering enemy resistance either — Conviction does nothing for magic damage — so your damage comes entirely from +skills and Concentration.",

  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "Hire an Act 2 Nightmare mercenary. Holy Freeze is the usual choice here rather than Might: your own damage does not need help, and slowing everything around you makes hammer positioning far easier. Insight for mana, Treachery or Duriel's Shell for survivability, Vampire Gaze for life steal and damage reduction.",

  gearSets: [
    {
      tier: "starter",
      goal: "Get to level 18 and Blessed Hammer, then through Normal.",
      levelRange: [1, 30],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "+2 skills and up to 35% Faster Cast Rate at level 25. Same four Countess runes as every other build's Spirit.",
              sockets: "Tal, Thul, Ort, Amn into a 4-socket Crystal Sword.",
              alternatives: [
                {
                  label: "Any scepter with +Blessed Hammer or +Concentration",
                  why: "Paladin scepters roll class skill bonuses. Shop the vendors — a +3 Blessed Hammer scepter beats most early uniques.",
                  lookFor: ["+3 Blessed Hammer", "+3 Concentration", "+2 Combat Skills"],
                },
              ],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "ancients-pledge" },
              why: "Three Countess runes for near-max resistances, and a Paladin shield adds its own innate resistance on top.",
              alternatives: [
                { ref: { kind: "runeword", slug: "rhyme" }, why: "Cannot Be Frozen and 25% magic find for two runes." },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "stealth" },
              why: "25% Faster Cast Rate, 25% Faster Run/Walk, 25% Faster Hit Recovery at level 17.",
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "runeword", slug: "lore" },
              why: "+1 to All Skills for two common runes.",
            },
          ],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "20% Faster Cast Rate at level 23." }],
        },
        {
          slot: "belt",
          picks: [
            {
              ref: { kind: "unique", slug: "nightsmoke" },
              why: "+10 all resistances and 50% damage-taken-to-mana at level 20. A genuinely good early belt for a build with no Energy.",
            },
          ],
        },
      ],
      nextUpgrade:
        "Blessed Hammer at 18, then a Spirit at 25. Practise the spiral — the build lives or dies on positioning.",
      notes:
        "Level with Blessed Hammer from 18 if you like; unlike Blizzard it is immediately usable. Before 18, use Zeal or Holy Fire with a decent weapon.",
    },

    {
      tier: "nightmare",
      goal: "Reach 75% Faster Cast Rate and get resistances under control.",
      levelRange: [30, 60],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "Still correct. There is nothing better until Heart of the Oak.",
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "A second Spirit in a shield. Two Spirits plus Magefist is 90% Faster Cast Rate — well past the 75% breakpoint.",
              sockets: "Tal, Thul, Ort, Amn into a 4-socket Sacred Targe if you can find one — its Strength requirement is far lower than a Monarch's.",
              alternatives: [
                {
                  ref: { kind: "unique", slug: "herald-of-zakarum" },
                  why: "+2 Paladin skills, +2 Combat skills, +50 all resistances and 30% increased blocking. Less Faster Cast Rate than Spirit, far more defence.",
                },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "unique", slug: "skin-of-the-vipermagi" },
              why: "+1 skills, 30% Faster Cast Rate and up to +35 all resistances at 43 Strength.",
              alternatives: [
                { ref: { kind: "runeword", slug: "smoke" }, why: "+50 all resistances if that is the bottleneck." },
                { ref: { kind: "runeword", slug: "lionheart" }, why: "+25 Strength effectively refunds 25 stat points, which a Paladin can spend on Dexterity instead." },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            { ref: { kind: "runeword", slug: "lore" }, why: "Still fine until a Shako appears." },
          ],
        },
        {
          slot: "amulet",
          picks: [
            {
              label: "Any amulet with +2 Paladin Skills",
              why: "+2 class skills is the most valuable amulet affix. Combat Skills specifically is even better.",
              lookFor: ["+2 Paladin Skill Levels", "+3 Combat Skills", "Faster Cast Rate", "Resistances"],
            },
          ],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "20% Faster Cast Rate." }],
        },
        {
          slot: "boots",
          picks: [
            {
              label: "Rare boots with Faster Run/Walk and resistances",
              why: "You are still walking everywhere until Enigma. Movement speed is real value here.",
              lookFor: ["30% Faster Run/Walk", "Two resistances", "Faster Hit Recovery"],
            },
          ],
        },
      ],
      nextUpgrade:
        "Get to 75% Faster Cast Rate, then push resistances to 75% before entering Hell. After that, start saving for Enigma.",
    },

    {
      tier: "early-hell",
      goal: "Survive Hell and start farming. Enigma is the goal that changes everything.",
      levelRange: [60, 75],
      slots: [
        {
          slot: "weapon",
          picks: [
            { ref: { kind: "runeword", slug: "spirit" }, why: "Still doing the job." },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "unique", slug: "herald-of-zakarum" },
              why: "+2 Paladin and +2 Combat skills, +50 all resistances, +20 Strength and +20 Vitality, and 30% increased blocking. In early Hell the resistances and block matter more than Spirit's cast rate.",
              sockets: "An Um rune for more resistances, or a perfect diamond.",
              alternatives: [
                { ref: { kind: "runeword", slug: "spirit" }, why: "If you need the Faster Cast Rate to hold your breakpoint." },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "unique", slug: "skin-of-the-vipermagi" },
              why: "Still the best budget caster armor.",
              alternatives: [
                { ref: { kind: "unique", slug: "duriels-shell" }, why: "Cannot Be Frozen, +15 Strength, +1 life per level and strong resistances. A defensive alternative." },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "harlequin-crest" },
              why: "+2 skills, +1.5 life per level, 50% magic find and 10% damage reduction.",
              sockets: "An Um rune for resistances, or a perfect topaz for magic find.",
            },
          ],
        },
        {
          slot: "belt",
          picks: [
            {
              ref: { kind: "unique", slug: "string-of-ears" },
              why: "Up to 15% physical damage reduction and 8% life steal, on a build that stands in melee range. Only 20 Strength.",
            },
          ],
        },
        {
          slot: "boots",
          picks: [
            {
              ref: { kind: "unique", slug: "sandstorm-trek" },
              why: "Faster Hit Recovery, +Strength (which buys shield requirement) and huge poison resistance.",
            },
          ],
        },
        {
          slot: "ring1",
          picks: [
            {
              ref: { kind: "unique", slug: "stone-of-jordan" },
              why: "+1 skills and +25% maximum mana. Hammers cost mana and you have no Energy.",
            },
          ],
        },
      ],
      charms: [
        { label: "Resistance small charms", why: "The cheapest resistance in the game." },
        { label: "Paladin Combat Skill grand charms", why: "+1 Combat Skills each — directly multiplies hammer damage." },
      ],
      nextUpgrade:
        "Enigma. Nothing else comes close — Teleport turns this from a good build into the best build.",
    },

    {
      tier: "budget",
      goal: "A complete Hell farming setup with Enigma and 75% Faster Cast Rate.",
      levelRange: [75, 85],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "Perfectly adequate. Heart of the Oak is a large upgrade but not a requirement.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "heart-of-the-oak" },
                  why: "+3 skills, 40% Faster Cast Rate and up to +40 all resistances. The definitive endgame Hammerdin weapon.",
                },
              ],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "In a Sacred Targe. +2 skills and 35% Faster Cast Rate at a Strength requirement a Paladin can actually afford.",
              alternatives: [
                { ref: { kind: "unique", slug: "herald-of-zakarum" }, why: "Trade cast rate for resistances, block and +2 Combat skills." },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "enigma" },
              why: "Teleport. This is the single largest upgrade available to the build — it changes your clear speed more than any damage item could. The +0.75 Strength per level also pays for your shield.",
              sockets: "Jah, Ith, Ber into a 3-socket Mage Plate or Archon Plate.",
              alternatives: [
                { ref: { kind: "unique", slug: "skin-of-the-vipermagi" }, why: "Until you can afford Jah, Ith and Ber." },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            { ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 skills, life, magic find and damage reduction." },
          ],
        },
        {
          slot: "amulet",
          picks: [
            {
              ref: { kind: "unique", slug: "maras-kaleidoscope" },
              why: "+2 all skills and up to +30 all resistances.",
              alternatives: [
                {
                  label: "Rare or crafted amulet: +2 Paladin Skills with Faster Cast Rate",
                  why: "Mara's has no Faster Cast Rate. If your 125% breakpoint is tight, an amulet that carries both is worth more.",
                  lookFor: ["+2 Paladin Skill Levels", "10-20% Faster Cast Rate", "Resistances"],
                },
              ],
            },
          ],
        },
        {
          slot: "belt",
          picks: [
            { ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 skills and 20% Faster Cast Rate." },
            { ref: { kind: "unique", slug: "string-of-ears" }, why: "Trade the skill and cast rate for physical damage reduction." },
          ],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "20% Faster Cast Rate." }],
        },
        {
          slot: "boots",
          picks: [
            { ref: { kind: "unique", slug: "sandstorm-trek" }, why: "Faster Hit Recovery and Strength." },
            { ref: { kind: "unique", slug: "war-traveler" }, why: "Up to 50% magic find on a magic-find setup." },
          ],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 skills." }],
        },
        {
          slot: "ring2",
          picks: [
            {
              label: "Rare ring: 10% Faster Cast Rate with resistances",
              why: "Usually what closes the 125% breakpoint.",
              lookFor: ["10% Faster Cast Rate", "Two resistances", "+Life", "+Mana"],
            },
          ],
        },
      ],
      charms: [
        { label: "Paladin Combat Skill grand charms with life", why: "+1 Combat Skills each. The best damage per inventory square." },
        { label: "Annihilus", why: "+1 all skills, +10-20 all attributes and resistances." },
        { label: "Hellfire Torch (Paladin)", why: "+3 Paladin skills and +10-20 all resistances." },
        { label: "Resistance small charms", why: "Fill the gaps so gear can chase skills instead." },
      ],
      weaponSwap: [
        {
          ref: { kind: "runeword", slug: "call-to-arms" },
          why: "Battle Orders. Roughly +40% life and mana — and a Paladin has a large life pool to multiply.",
        },
      ],
      nextUpgrade: "Heart of the Oak, then push to the 125% Faster Cast Rate breakpoint.",
    },

    {
      tier: "optimized",
      goal: "125% Faster Cast Rate with maximum block and capped resistances.",
      levelRange: [85, 99],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "heart-of-the-oak" },
              why: "+3 skills, 40% Faster Cast Rate and up to +40 all resistances. Made in a Flail — one-handed, 41 Strength, reaches 4 sockets.",
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "In a Sacred Targe, for the 35% Faster Cast Rate you need to reach 125%.",
              alternatives: [
                { ref: { kind: "unique", slug: "herald-of-zakarum" }, why: "If your cast rate is covered elsewhere, the resistances and block are worth more." },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "enigma" }, why: "Teleport. Non-negotiable at this tier." }],
        },
        {
          slot: "helm",
          picks: [
            { ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 skills, life, magic find, damage reduction." },
            { ref: { kind: "unique", slug: "crown-of-ages" }, why: "+1 skills, 30% Faster Hit Recovery, up to 15% damage reduction and two sockets. The Hardcore choice." },
          ],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills and resistances." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 skills, 20% Faster Cast Rate." }],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "20% Faster Cast Rate." }],
        },
        {
          slot: "boots",
          picks: [
            {
              label: "Rare boots: Faster Hit Recovery, Faster Run/Walk, two resistances",
              why: "A well-rolled rare beats every unique here.",
              lookFor: ["Faster Hit Recovery", "30% Faster Run/Walk", "Two resistances at 30%+"],
            },
          ],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 skills." }],
        },
        {
          slot: "ring2",
          picks: [
            { ref: { kind: "unique", slug: "stone-of-jordan" }, why: "A second one, if your breakpoint allows." },
            { label: "Rare 10% Faster Cast Rate ring", why: "Whatever closes 125% and patches your worst resistance." },
          ],
        },
      ],
      charms: [
        { label: "Annihilus", why: "+1 all skills." },
        { label: "Hellfire Torch (Paladin)", why: "+3 Paladin skills." },
        { label: "9 x Paladin Combat Skill grand charms with life", why: "+9 Combat Skills." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        { label: "Spirit or Lidless Wall in the swap off-hand", why: "More +skills means a higher Battle Orders level." },
      ],
      nextUpgrade:
        "Mercenary upgrades — Fortitude and Andariel's Visage — and perfect charm rolls. Your own gear is essentially finished.",
    },

    {
      tier: "bis",
      goal: "Every slot optimised, 125% Faster Cast Rate, 75% block, capped resistances.",
      levelRange: [90, 99],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "heart-of-the-oak" },
              why: "A 40% all-resistance roll in a Flail.",
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "A 35% Faster Cast Rate roll in a Sacred Targe, socketed for the runeword and nothing else.",
              alternatives: [
                { ref: { kind: "unique", slug: "herald-of-zakarum" }, why: "Upgraded to a Zakarum Shield and socketed with an Um. The defensive best in slot." },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "enigma" }, why: "In an Archon Plate." }],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "harlequin-crest" },
              why: "Socketed with an Um rune for resistances, or Ist for magic find.",
              sockets: "Um rune, or a perfect topaz on a magic-find setup.",
            },
          ],
        },
        {
          slot: "amulet",
          picks: [
            {
              label: "Crafted caster amulet: +2 Paladin Skills, 20% Faster Cast Rate, life, mana",
              why: "The one slot where a craft genuinely beats every unique, because it can carry skills and cast rate together.",
              lookFor: ["+2 Paladin Skill Levels", "20% Faster Cast Rate", "+Life", "Resistances"],
            },
            { ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "The reliable alternative." },
          ],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 skills, 20% Faster Cast Rate." }],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "20% Faster Cast Rate. Still unbeaten for the slot." }],
        },
        {
          slot: "boots",
          picks: [
            {
              label: "Rare boots: 30% Faster Run/Walk, Faster Hit Recovery, two high resistances",
              why: "A perfect rare, tuned to close whatever gap remains.",
            },
          ],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 skills." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 skills. Two is standard once cast rate is covered elsewhere." }],
        },
      ],
      charms: [
        { label: "Annihilus (20/20/20)", why: "+1 all skills, +20 all attributes and resistances." },
        { label: "Hellfire Torch (Paladin, 3/20/20)", why: "+3 Paladin skills." },
        { label: "9 x Combat Skill grand charms with 40+ life", why: "+9 Combat Skills and around 400 life." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders, after two Battle Commands." },
        { label: "Spirit in the swap off-hand", why: "More +skills for a higher Battle Orders." },
      ],
      nextUpgrade:
        "Nothing in your own gear. Verify your block is at 75% with Holy Shield active, and your resistances at 75% in Hell.",
    },
  ],

  farming: [
    {
      area: "chaos-sanctuary",
      difficulty: "hell",
      why: "Area level 85, extremely dense, and almost nothing here resists magic. The 150% bonus to Undead and Demons applies to nearly every monster in the zone. This is the Hammerdin's home.",
      minTier: "early-hell",
      rating: 5,
    },
    {
      area: "worldstone-keep",
      difficulty: "hell",
      why: "Three area level 85 floors and Baal at the end. Every immunity type appears here, and the Hammerdin ignores all of them.",
      minTier: "budget",
      rating: 5,
    },
    {
      area: "travincal",
      difficulty: "hell",
      why: "The Council are fire and lightning immune, which stops most casters. They are not magic immune. Tight packing suits the hammer spiral perfectly.",
      minTier: "early-hell",
      rating: 5,
    },
    {
      area: "pit",
      difficulty: "hell",
      why: "Area level 85, dense, and its cold and lightning immunes are irrelevant to you.",
      minTier: "budget",
      rating: 4,
    },
    {
      area: "ancient-tunnels",
      difficulty: "hell",
      why: "Area level 85 and compact. Works fine, though it is less of a standout here than for a cold build.",
      minTier: "budget",
      rating: 4,
    },
    {
      area: "mephisto",
      difficulty: "hell",
      why: "Monster level 87 and a twenty-second route. He is fire and lightning immune, and none of that matters.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "countess",
      difficulty: "nightmare",
      why: "Where the runes for your Spirits, Lore and Insight come from.",
      minTier: "starter",
      rating: 4,
    },
    {
      area: "mausoleum",
      difficulty: "hell",
      why: "Area level 85, mostly undead — which means the 150% Undead bonus applies to nearly everything.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "pindleskin",
      difficulty: "hell",
      why: "Monster level 86 ten seconds from a town portal, and he is undead.",
      minTier: "early-hell",
      rating: 3,
    },
  ],

  levelingPath: {
    summary:
      "Unlike the Blizzard Sorceress, you can level as this build directly. Blessed Hammer unlocks at 18 and is immediately usable — no respec needed. Before 18, use Zeal with a decent weapon, or Holy Fire and a Might aura.",
    respecAt:
      "Usually not needed. Keep your Den of Evil tokens for experimenting, or for correcting an over-investment in Dexterity.",
  },

  selfFoundNotes:
    "Strong self-found up to a point. Two Spirits, Lore, Ancient's Pledge and Insight all come from Countess runes, and Herald of Zakarum, Harlequin Crest and Skin of the Vipermagi are all realistically findable. The wall is Enigma: Jah, Ith and Ber is a serious ask solo, and the build is noticeably slower without it. It still farms Chaos Sanctuary and Travincal perfectly well while you save.",

  hardcoreNotes:
    "One of the safest builds in the game for Hardcore. Maximum block through Holy Shield, a large life pool, and magic damage that never leaves you unable to kill something. Take Holy Freeze on the mercenary. Prefer Herald of Zakarum over a second Spirit for the resistances and block, and consider Crown of Ages over a Harlequin Crest for the damage reduction. The real Hardcore risk on this build is Iron Maiden from Oblivion Knights in Chaos Sanctuary — it reflects physical damage, and while your hammers are magic, your mercenary's attacks are not.",

  confidence: "verified",
  complete: true,
};
