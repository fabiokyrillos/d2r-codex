import type { Build } from "@/lib/types";

/**
 * The Nova Sorceress.
 *
 * The build with the highest ceiling on the site and the most misunderstood
 * item requirement. Maxroll states plainly that the best Nova setup puts
 * **Infinity in the Sorceress's own hands** rather than the mercenary's — its
 * Conviction aura works identically from either, and self-wielding it frees the
 * mercenary to carry Insight for your mana. The research pass therefore
 * recorded "self-wield Infinity Nova" as the standard build rather than a
 * variant.
 *
 * Verified at Tier 1 (`skills.json`):
 * - Nova requires level 12; Lightning Mastery 30; Energy Shield 24.
 * - Lightning Mastery gives **50% damage at level 1 and +12% per level** — it
 *   raises your damage, it does not reduce enemy resistance.
 * - **Energy Shield consumes 32 sixteenths of mana per point of damage**, i.e.
 *   two mana per point at base. Telekinesis improves that ratio; the extraction
 *   does not give the per-level figure, so the page states the base and stops.
 * - Static Field takes 25% of the target's current life.
 *
 * Nova is **not** Lightning or Chain Lightning, so it uses the **standard**
 * Sorceress cast table (0/9/20/37/63/105/200), not the separate lightning one.
 * That distinction catches people who read the Lightning Sorceress page first.
 */
export const novaSorceress: Build = {
  slug: "nova-sorceress",
  name: "Nova Sorceress",
  classSlug: "sorceress",
  summary:
    "A ring of lightning that expands from where you stand, cast fast enough to be continuous. The fastest density killer in the game.",
  damageTypes: ["lightning"],
  primarySkill: "nova",
  playstyle:
    "Teleport into the middle of the pack and hold the button. Nova expands outward from your position, so there is no aiming at all — the only skill is choosing where to land. At full cast rate the rings overlap into something closer to a continuous field than a series of spells. You are standing inside everything you are killing, which is why Energy Shield is on the table and why the build wants more life than it looks like it should.",
  strengths: [
    "The fastest clear speed on the site. Nothing kills a packed room faster",
    "No aiming whatsoever — the spell is centred on you",
    "Self-wielded Infinity breaks lightning immunity *and* frees the mercenary for Insight",
    "Static Field handles the single targets Nova is bad at",
    "Enormous ceiling: DiabloBytes rates it the best build in the game",
  ],
  weaknesses: [
    "**Its standard setup is an Infinity**, which is a Ber, a Mal, a Ber and an Ist. There is no cheap version of the finished build",
    "You fight from the centre of the pack, which is the most dangerous place to be",
    "Poor single-target damage — bosses are a Static Field problem, not a Nova one",
    "Uses the standard cast table, which is easy to get wrong after reading the Lightning page",
    "Energy Shield turns mana burn from an annoyance into a death",
  ],
  difficulty: "advanced",
  budget: "extreme",
  ratings: {
    clearSpeed: 5,
    bossing: 2,
    survivability: 3,
    magicFind: 4,
    terrorZones: 5,
    ubers: 2,
    soloSelfFound: 1,
    players8: 5,
  },

  skills: [
    {
      skill: "nova",
      points: 20,
      role: "main",
      order: 1,
      note: "Level 12. Expands from your position, so the only decision is where to stand.",
    },
    {
      skill: "lightning-mastery",
      points: 20,
      role: "main",
      order: 2,
      note: "**50% damage at level 1 and +12% per level.** A damage multiplier, not a resistance reduction — it will not break an immunity.",
    },
    {
      skill: "static-field",
      points: 20,
      role: "synergy",
      order: 3,
      note: "A Nova synergy as well as your boss answer. It takes 25% of a target's current life per cast, which is what makes an otherwise terrible single-target build able to kill things.",
    },
    {
      skill: "charged-bolt",
      points: 20,
      role: "synergy",
      order: 4,
      note: "The other synergy, and your damage for the first eleven levels.",
    },
    { skill: "warmth", points: 1, role: "utility", note: "Mana regeneration from level 1, and it matters more here than on any other build if you take Energy Shield." },
    { skill: "telekinesis", points: 1, role: "utility", note: "Teleport's prerequisite, and it improves Energy Shield's mana-to-damage ratio. Worth more than one point if you commit to the shield." },
    { skill: "teleport", points: 1, role: "utility", note: "**One point forever**, and it is how you get into the middle of the pack." },
    {
      skill: "energy-shield",
      points: 1,
      role: "flex",
      note: "**Two mana per point of damage at base**, improved by Telekinesis. A genuine fork — read the flex points before committing.",
    },
    { skill: "frozen-armor", points: 1, role: "utility", note: "Free defence and a chance to freeze whatever reaches you." },
    { skill: "frost-nova", points: 1, role: "utility", note: "Chills everything around you. On a build that lives at the centre of packs, this is a real button." },
    {
      skill: "thunder-storm",
      points: 1,
      role: "utility",
      note: "A passive lightning strike on a timer. One point — it is not a Nova synergy and Lightning Mastery does not require it.",
    },
    { skill: "lightning", points: 1, role: "utility", note: "One point for the rare single target Static Field cannot finish. Do not invest further — it is on a different cast table." },
    {
      skill: "chain-lightning",
      points: 1,
      role: "prerequisite",
      note: "**Thunder Storm and Energy Shield both require Chain Lightning.** One point covers both.",
    },
  
  ],
  flexPoints: [
    "**Energy Shield is the build's real decision.** At two mana per point of damage it converts a large mana pool into an effective second health bar, which suits a character standing in the middle of everything. It also means mana burn kills you outright and a drained pool leaves you with your actual, tiny life total. Take it deliberately with Telekinesis investment behind it, or skip it entirely and buy life instead. Half-committing is the worst of both.",
    "**The Hydra hybrid.** Maxroll ships a variant that adds Hydra for the fire damage Nova cannot do. It costs the points you would have put into a synergy and gives you an answer to lightning immunes that is not Infinity. Worth it before Infinity exists, less so after.",
    "**Magic find variant:** same skill plan, swap damage charms and gear for magic find. The build's clear speed makes it one of the better magic find characters even at reduced damage.",
    "**Do not put points in Energy**, even for Energy Shield. The shield scales with your mana pool, and gear supplies far more mana per point spent than the attribute does.",
  ],
  stats: {
    strength: "Enough for your gear. If you self-wield Infinity, note that it goes in a **polearm or spear** — check the base's requirement before committing stat points, because it is higher than a caster normally pays.",
    dexterity: "None. This build has no block and no weapon accuracy to satisfy.",
    vitality: "Everything else, and it matters more here than on any other Sorceress because you fight from the middle.",
    energy: "None. Gear gives more mana per point than the attribute does, even for Energy Shield.",
    notes: [
      "**Infinity is a polearm or spear runeword.** A Sorceress can wield one, but the Strength requirement is the real cost of self-wielding and it should be planned before you spend a point.",
      "Life is the stat that matters. A Call to Arms swap is worth more than anything you could buy with the same currency.",
      "If you take Energy Shield, put points into Telekinesis rather than Energy — it improves the conversion ratio, which is the thing that actually scales.",
    ],
  },
  breakpoints: [
    {
      stat: "fcr",
      value: 105,
      frames: 8,
      priority: "recommended",
      why: "**The standard Sorceress table applies here** — Nova is not Lightning or Chain Lightning. At 105% the rings overlap into something continuous, which is the whole point of the build.",
    },
    {
      stat: "fcr",
      value: 63,
      frames: 9,
      priority: "required",
      why: "The minimum for the build to feel like itself rather than a series of separate casts.",
    },
    {
      stat: "fhr",
      value: 60,
      frames: 9,
      priority: "required",
      why: "Not recommended — required. You fight from inside the pack, and a Sorceress who cannot recover from a hit there does not recover at all.",
    },
  ],

  gearSets: [
    {
      tier: "starter",
      goal: "Charged Bolt to 12, Nova from there. Cheap and genuinely effective.",
      levelRange: [1, 30],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "+2 skills and up to 35% Faster Cast Rate at level 25.",
              sockets: "Tal, Thul, Ort, Amn into a 4-socket Crystal Sword.",
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "runeword", slug: "ancients-pledge" }, why: "Resistances for three Countess runes." }],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "stealth" }, why: "25% Faster Cast Rate and 25% Faster Hit Recovery at level 17." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "runeword", slug: "lore" }, why: "+1 to All Skills." }],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "20% Faster Cast Rate at level 23." }],
        },
      ],
      nextUpgrade: "Level 30 and Lightning Mastery. Nova is flat until then and that is expected.",
      notes:
        "Charged Bolt is a synergy, so the levelling points are not wasted. Static Field from level 6 is both a synergy and your answer to anything with too much life.",
    },

    {
      tier: "nightmare",
      goal: "Lightning Mastery online, two Spirits, resistances climbing.",
      levelRange: [30, 60],
      slots: [
        {
          slot: "weapon",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "Still the best value available." }],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "A second Spirit — +4 skills and 70% cast rate between them.",
              sockets: "Tal, Thul, Ort, Amn into a 4-socket shield.",
              alternatives: [
                { ref: { kind: "unique", slug: "lidless-wall" }, why: "+1 skills and 20% cast rate, plus mana after each kill, which is genuinely useful here." },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "unique", slug: "skin-of-the-vipermagi" }, why: "+1 skills, 30% cast rate and up to +35 all resistances." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "tarnhelm" }, why: "+1 skills and magic find." }],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "20% Faster Cast Rate." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "nightsmoke" }, why: "Resistances and damage-to-mana — the second half matters if you are heading for Energy Shield." }],
        },
      ],
      charms: [{ label: "Resistance and life small charms", why: "The cheapest path to 75% before Hell." }],
      nextUpgrade: "Decide on Energy Shield before Hell, because it changes what gear you want.",
    },

    {
      tier: "early-hell",
      goal: "105% cast rate, 60% hit recovery, capped resistances — and a plan for lightning immunes.",
      levelRange: [60, 75],
      slots: [
        {
          slot: "weapon",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "35% cast rate and +2 skills." }],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "The second one." }],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "unique", slug: "skin-of-the-vipermagi" },
              why: "Resistances and cast rate.",
              alternatives: [
                { ref: { kind: "runeword", slug: "chains-of-honor" }, why: "+2 skills and +65 all resistances — the better choice on a build that stands in the middle of things." },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 skills, life, magic find and 10% damage reduction. The life and the damage reduction are what you are buying." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 all skills and +20-30 all resistances." }],
        },
        {
          slot: "ring1",
          picks: [
            {
              label: "Rare ring with 10% Faster Cast Rate, resistances and life",
              why: "Cast rate plus the two stats this build is always short of.",
              lookFor: ["10% Faster Cast Rate", "Two resistances", "Life"],
            },
          ],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "sandstorm-trek" }, why: "Faster Hit Recovery and Vitality — both of which this build values more than magic find at this stage." }],
        },
      ],
      charms: [{ label: "Resistance and life small charms", why: "Hold 75%, and take life over damage where you can." }],
      nextUpgrade:
        "Infinity. Until then this build is a very fast clearer of everything that is not lightning immune, and helpless against what is.",
      notes:
        "The Hydra hybrid variant exists precisely for this tier — a fire damage source covers the lightning immunes while you save for Infinity.",
    },

    {
      tier: "budget",
      goal: "Infinity in your own hands, and the mercenary freed for Insight.",
      levelRange: [75, 85],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "infinity" },
              why: "**Self-wielded.** Its Conviction aura breaks lightning immunity and works identically in your hands or the mercenary's — but wearing it yourself frees him to carry Insight, which is where your mana comes from.",
              sockets: "Ber, Mal, Ber, Ist into a 4-socket polearm or spear. Check the base's Strength requirement before you commit stat points.",
              alternatives: [
                { ref: { kind: "runeword", slug: "spirit" }, why: "Until Infinity exists, a Spirit and a Hydra hybrid is the honest interim answer." },
              ],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              label: "None — Infinity is two-handed",
              why: "Self-wielding Infinity costs you the shield slot entirely, which is a real trade: no Spirit, no block, no resistances from that slot. The Conviction is worth it, but budget for the resistances elsewhere.",
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "chains-of-honor" }, why: "+2 skills and +65 all resistances. With no shield, this is where your resistances live." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 skills, life and damage reduction." }],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "20% Faster Cast Rate." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 all skills, 20% cast rate and increased maximum mana — the last of which matters if you took Energy Shield." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills and +30 all resistances." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills and increased maximum mana." }],
        },
        {
          slot: "ring2",
          picks: [
            {
              label: "Rare ring: 10% Faster Cast Rate, resistances, life",
              why: "With the shield slot gone, every remaining slot carries resistance.",
              lookFor: ["10% Faster Cast Rate", "Two resistances at 20+", "Life"],
            },
          ],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "sandstorm-trek" }, why: "Faster Hit Recovery and Vitality." }],
        },
      ],
      charms: [
        { label: "Hellfire Torch (Sorceress)", why: "+3 Sorceress skills and +10-20 all resistances, which you need more than usual." },
        { label: "Annihilus", why: "+1 all skills and resistances." },
        { label: "Life and resistance small charms", why: "With no shield, charms carry more of the load here than on any other Sorceress." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders. On a build with no shield standing in the middle of packs, this is not optional." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "Off-hand for the swap." },
      ],
      nextUpgrade: "Griffon's Eye and lightning facets — the enemy-resistance stack that compounds with Conviction.",
    },

    {
      tier: "optimized",
      goal: "Conviction, Griffon's and facets stacking enemy resistance into the floor.",
      levelRange: [80, 90],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "infinity" },
              why: "Conviction, self-wielded. The mercenary carries Insight.",
              lookFor: ["-55% Enemy Lightning Resistance", "Low-requirement polearm base"],
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "griffons-eye" },
              why: "**-15-20% enemy lightning resistance** on top of Conviction's reduction, plus +10-15% lightning skill damage and 25% cast rate.",
              lookFor: ["-20% Enemy Lightning Resistance", "+15% Lightning Skill Damage", "1 socket"],
              alternatives: [
                { ref: { kind: "unique", slug: "harlequin-crest" }, why: "Keep the Shako if you are dying rather than killing slowly. Life and damage reduction over damage." },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "chains-of-honor" },
              why: "+2 skills and +65 all resistances.",
              alternatives: [
                { ref: { kind: "runeword", slug: "enigma" }, why: "Teleport with a flat mana cost and Strength per level — the Strength is what makes a heavier Infinity base affordable." },
              ],
            },
          ],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "20% Faster Cast Rate." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 skills, 20% cast rate, maximum mana." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills, +30 all resistances." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills, maximum mana." }],
        },
        {
          slot: "ring2",
          picks: [
            {
              label: "Rare ring: 10% Faster Cast Rate, two resistances, life",
              why: "Still carrying resistance, because the shield slot is gone for good.",
              lookFor: ["10% Faster Cast Rate", "Two resistances at 20+", "Life"],
            },
          ],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find, once survival is settled. Sandstorm Trek if it is not." }],
        },
      ],
      charms: [
        { label: "Hellfire Torch (Sorceress)", why: "+3 Sorceress skills." },
        { label: "Annihilus", why: "+1 all skills." },
        { label: "Lightning skill grand charms with life", why: "Damage and the life this build is always short of." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "Off-hand for the swap." },
      ],
      nextUpgrade: "Lightning facets in every socket, and a better Griffon's roll.",
    },

    {
      tier: "bis",
      goal: "Nothing left to fix.",
      levelRange: [85, 99],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "infinity" },
              why: "A -55% enemy lightning resistance roll in the lightest 4-socket polearm you can find.",
              lookFor: ["-55% Enemy Lightning Resistance", "Low Strength base"],
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "griffons-eye" },
              why: "A -20% and +15% roll with a lightning facet socketed.",
              lookFor: ["-20% Enemy Lightning Resistance", "+15% Lightning Skill Damage"],
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "enigma" }, why: "Teleport, Strength for the Infinity base, and magic find per level." }],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "20% Faster Cast Rate." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 skills, 20% cast rate, maximum mana." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills, +30 all resistances." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills." }],
        },
        {
          slot: "ring2",
          picks: [
            {
              label: "Rare ring: 10% Faster Cast Rate, two resistances, life, mana",
              why: "The last slot to perfect, and it is still carrying resistance.",
              lookFor: ["10% Faster Cast Rate", "Two resistances at 20+", "Life and mana"],
            },
          ],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find." }],
        },
      ],
      charms: [
        { label: "Hellfire Torch (Sorceress)", why: "+3 Sorceress skills, 20 all resistances." },
        { label: "Annihilus", why: "+1 all skills, 20 attributes, 20 resistances." },
        { label: "Lightning skill grand charms with life", why: "The rest of the inventory." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "Off-hand for the swap." },
      ],
      notes:
        "This is the highest-ceiling build the site documents, and it earns that with an Infinity, a Griffon's Eye and an Enigma. The Frozen Orb page reaches most of its own ceiling for the price of eight Countess runes. Both statements are true and the difference between them is the honest reason to pick one.",
    },
  ],

  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "**This is the build where the mercenary's job is inverted.** Because you carry Infinity yourself, he does not need to — so give him an **Insight**, whose Meditation aura is what pays for a build that casts continuously. Take **Might** for his damage, or **Holy Freeze** to slow the pack you are standing inside, which on this build is worth more than his damage. A **Treachery** armour and a **Vampire Gaze** keep him alive; he will still die, because he is standing where you are.",

  farming: [
    {
      area: "secret-cow-level",
      difficulty: "hell",
      why: "Enormous density, nothing lightning immune, and every cow walks into a spell centred on you. The single fastest thing this build does.",
      minTier: "early-hell",
      rating: 5,
    },
    {
      area: "worldstone-keep",
      difficulty: "hell",
      why: "Area level 85 and very dense. With Infinity this is the best general farm in the game for this build.",
      minTier: "budget",
      rating: 5,
    },
    {
      area: "throne-of-destruction",
      difficulty: "hell",
      why: "Five dense waves in one room, which is exactly the shape Nova wants. Static Field handles Baal himself.",
      minTier: "budget",
      rating: 5,
    },
    {
      area: "chaos-sanctuary",
      difficulty: "hell",
      why: "Dense and high level. Static Field softens the Seal bosses that Nova cannot burst.",
      minTier: "budget",
      rating: 4,
    },
    {
      area: "pit",
      difficulty: "hell",
      why: "Area level 85 and short. Good, though the density is lower than the build would like.",
      minTier: "budget",
      rating: 4,
    },
    {
      area: "travincal",
      difficulty: "hell",
      why: "The Council are lightning immune, so this is an Infinity-only zone — and with Infinity it is very fast, because they stand in a heap.",
      minTier: "optimized",
      rating: 4,
    },
  ],

  immunityPlan:
    "One answer, and the build is built around owning it. **Lightning Mastery does not break immunity** — it is a damage multiplier at 50% plus 12% per level, the same as on the Lightning Sorceress. What breaks it is **Conviction from Infinity**, and this build's defining choice is to wield that Infinity yourself rather than putting it on the mercenary: the aura is identical either way, and self-wielding frees him to carry the Insight that pays your mana bill. **Griffon's Eye** stacks another -15-20% enemy lightning resistance on top, and **lightning facets** add more still. Before Infinity exists, the honest answers are the **Hydra hybrid** variant for a second damage type, or picking zones — the Secret Cow Level has nothing lightning immune in it at all. A **Crack of the Heavens** sunder charm works but costs 70 to 90 points of your own lightning resistance, which on a build standing in the middle of lightning enchanted packs is a worse trade than usual.",

  hardcoreNotes:
    "The most dangerous Sorceress on the site, and the reasons are structural rather than fixable. You fight from the centre of the pack by design; self-wielding Infinity means **no shield at all**, so no block and no resistances from that slot; and the Sorceress life pool is the smallest in the game. If you take Energy Shield, **mana burn becomes lethal** rather than annoying. In Hardcore the honest recommendation is to put Infinity on the mercenary instead and keep a Spirit shield — you lose the Insight and pay for mana another way, and you keep a defensive slot. Chains of Honor over Enigma, Battle Orders always, and 60% Faster Hit Recovery as a hard requirement.",

  selfFoundNotes:
    "Not realistically. The finished build is an Infinity, which is two Ber runes among four, and there is no version of the endgame that works without Conviction. What *is* self-found is the first eighty levels: Nova at 12 with Charged Bolt and Static Field synergies is a genuinely strong and very cheap character, and the Hydra hybrid keeps it viable in Hell against lightning immunes. Treat this page as a destination. The Frozen Orb and Fire Ball Meteor pages describe builds that reach their own ceiling without a single high rune.",

  levelingPath: {
    summary:
      "Levels as itself. Charged Bolt from level 1 and Static Field from 6 are both synergies, Nova arrives at 12, and Teleport at 18 gives you the mobility the build is built on. Lightning Mastery at 30 is when the damage starts to compound. **No respec is required** — but be clear-eyed that the build you are levelling is not the build on this page's later tiers, which is defined by an item rather than a skill.",
  },

  confidence: "verified",
  complete: true,
};
