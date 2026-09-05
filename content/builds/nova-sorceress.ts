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
 * - **Nova has exactly one synergy.** Its row reads
 *   `EDmgSymPerCalc = (skill('Static Field'.blvl))*par8` with `par8 = 5`, and
 *   that is the whole list. Charged Bolt feeds Lightning and Chain Lightning,
 *   neither of which the core casts, so twenty points there used to buy
 *   nothing.
 *
 * Which left forty-one points — a third of the character — described in prose
 * as four suggestions worth more than the budget between them. They are now
 * three packages, costed against the graph, each closing at 110:
 *
 * - **The Storm** maxes Thunder Storm and Chain Lightning. Both edges are in
 *   the graph and both are already paid for: `thunder-storm` receives from
 *   Static Field, which this build maxes, and `chain-lightning` receives from
 *   Nova. Its three spare points go to Charged Bolt, which feeds the Chain
 *   Lightning it just maxed — the same twenty points that bought nothing in
 *   the core.
 * - **Energy Shield** buys Telekinesis, whose *hard* level sets the shield's
 *   mana ratio. The extraction records that as a parameter rather than a
 *   synergy edge, so it is described as a ratio and never labelled one.
 * - **The Hydra hybrid** is the pre-Infinity answer to lightning immunity, and
 *   it is priced honestly: Hydra's synergies are Fire Bolt and Fire Ball, this
 *   route holds both at one point, and Fire Mastery ends at 18 because that is
 *   what fits.
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
    "Energy Shield, if you take that package, turns mana burn from an annoyance into a death",
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
      points: 1,
      role: "prerequisite",
      note: "**Your damage for the first eleven levels, and one point after that.** It is Lightning's prerequisite and therefore Chain Lightning's, which is how this plan reaches Thunder Storm and Energy Shield. It is **not** a Nova synergy — it feeds Lightning and Chain Lightning, and the core casts neither. The Storm package is the one case where that changes.",
    },
    { skill: "warmth", points: 1, role: "utility", note: "Mana regeneration from level 1, and it matters more here than on any other build if you take Energy Shield." },
    { skill: "telekinesis", points: 1, role: "utility", note: "Teleport's prerequisite. One point in the core; **the Energy Shield package maxes it**, because its hard level is what sets the shield's mana-to-damage ratio." },
    { skill: "teleport", points: 1, role: "utility", note: "**One point forever**, and it is how you get into the middle of the pack." },
    { skill: "frozen-armor", points: 1, role: "utility", note: "Free defence and a chance to freeze whatever reaches you." },
    { skill: "frost-nova", points: 1, role: "utility", note: "Chills everything around you. On a build that lives at the centre of packs, this is a real button." },
    {
      skill: "thunder-storm",
      points: 1,
      role: "utility",
      note: "A passive lightning strike on a timer, and its prerequisites — Chain Lightning and Nova — are already paid. One point in the core. **Static Field feeds it**, which this build maxes, so two of the three packages below take it to twenty for nineteen points and no new gear.",
    },
    { skill: "lightning", points: 1, role: "utility", note: "One point for the rare single target Static Field cannot finish. **Do not raise it** — it is on a different cast table from Nova, so the cast rate the rest of your gear buys does not apply to it." },
    {
      skill: "chain-lightning",
      points: 1,
      role: "prerequisite",
      note: "**Thunder Storm and Energy Shield both require Chain Lightning.** One point covers both in the core — and Nova feeds it, which is why the Storm package maxes it rather than leaving it here.",
    },

  ],
  skillPackages: [
    {
      id: "spare-points",
      name: "The second half of the plan",
      choose: "one",
      intro:
        "The core above is 69 of 110 and it is **finished** — Nova has one synergy, Static Field, and it is already maxed, so no further point anywhere raises Nova damage. Forty-one are left, which is more than a third of the character. **Take exactly one of the three below.** They are alternatives and not a menu: the Storm and the Hydra hybrid both want the whole budget, and a character holding half of each has neither.",
      packages: [
        {
          id: "storm",
          name: "The Storm",
          when: "The default. It stays inside the lightning tree, changes no gear, and buys the two things Nova is worst at — a target it cannot reach and a target it cannot burst — using synergies the core has already paid for.",
          tradeoff:
            "It does nothing at all about lightning immunity. If you do not own an Infinity yet, the Hydra hybrid is the package that keeps Hell playable; this is the one that makes Hell faster once you do.",
          skills: [
            {
              skill: "thunder-storm",
              points: 20,
              role: "main",
              order: 1,
              note: "**Static Field feeds Thunder Storm, and this build maxes Static Field.** That is the whole argument: twenty points here arrive on top of twenty already spent, both prerequisites are already paid, and it costs no cast time at all — it strikes on its own timer while you are casting Nova.",
            },
            {
              skill: "chain-lightning",
              points: 20,
              role: "main",
              order: 2,
              note: "**Nova feeds Chain Lightning**, so the core's twenty arrive with it. It is the answer to whatever is standing outside Nova's ring — a shooter on a ledge, a boss you would rather not stand next to. Note the cast table: like Lightning, it is not on Nova's.",
            },
            {
              skill: "charged-bolt",
              points: 4,
              role: "synergy",
              order: 3,
              note: "The last three points, and this is the one package where they are not idle: **Charged Bolt feeds Chain Lightning**, which you have just maxed. Four is what the budget leaves, not a target.",
            },
          ],
          rotationNote:
            "Nova is still the button you hold. Chain Lightning for what is out of reach, Static Field for what has too much life, and Thunder Storm running the whole time without ever being cast.",
          gearNote:
            "No change. Every point is lightning damage under the same Lightning Mastery and the same −enemy lightning resistance you were already stacking.",
          statNote: "No change. Vitality with everything after gear requirements.",
          contentNote:
            "The Worldstone Keep, the Throne of Destruction and Travincal — the build's own farming list, once Infinity exists.",
        },
        {
          id: "energy-shield",
          name: "Energy Shield",
          when: "You fight from the centre of the pack and the Sorceress has the smallest life pool in the game. This package spends the budget on not dying rather than on killing, and it is the only route that changes what your gear is for.",
          tradeoff:
            "**Mana burn stops being an annoyance and becomes a death**, and Static Field — which costs mana — is now spending your health bar. You also give up Chain Lightning, so anything outside Nova's ring stays outside it.",
          skills: [
            {
              skill: "telekinesis",
              points: 20,
              role: "utility",
              order: 1,
              note: "**The package.** Its *hard* level is what sets the shield's mana-to-damage ratio, and no amount of +skills gear moves it — which is exactly why this is worth twenty points and not five.",
            },
            {
              skill: "thunder-storm",
              points: 20,
              role: "main",
              order: 2,
              note: "Fed by the Static Field you already max, and it costs no mana to keep running — which on a build whose mana is now its life is why it is here rather than Chain Lightning.",
            },
            {
              skill: "energy-shield",
              points: 1,
              role: "main",
              order: 3,
              note: "**Two mana per point of damage at base**, improved by Telekinesis. One point: the extraction this site reads does not publish what a second point changes, so the plan buys the ratio, which is measurable, and not the level, which is not.",
            },
          ],
          remainderNote:
            "**Two points are genuinely left over.** Warmth is where they go — on this route mana regeneration is life regeneration — or a second and third point of Energy Shield if you would rather have levels the site cannot yet put a number on. Either way the character finishes at 110.",
          rotationNote:
            "Unchanged in what you press, changed in what you watch: the mana globe is the health globe. Static Field becomes something you spend rather than something you spam.",
          gearNote:
            "The largest gear change of the three. Mana on rings and an amulet outranks magic find, **the mercenary's Insight becomes required rather than convenient**, and mana burn is a reason to leave an area. In Hardcore this is the route that pairs with putting Infinity on the mercenary and keeping a Spirit shield.",
          statNote:
            "**Still no points in Energy.** The shield scales with the size of the pool, and gear supplies far more mana per point spent than the attribute does. Vitality is still where the points go, because a drained shield hands you back your real life total.",
          contentNote:
            "Hell Terror Zones and 8-player games. Avoid it anywhere mana burn is common, which includes much of the Worldstone Keep.",
        },
        {
          id: "hydra-hybrid",
          name: "The Hydra hybrid",
          when: "You do not own an Infinity. This is the package that answers lightning immunes with a second damage type rather than with a rune word, and it is the only route on this page that works before the build's defining item exists.",
          tradeoff:
            "The most expensive package and the least efficient: **Hydra's own synergies are Fire Bolt and Fire Ball, and this plan holds both at one point**, so the fire damage comes almost entirely from Fire Mastery. A fully synergised Hydra is a different character and has its own page. Once Infinity exists, the Storm is strictly better.",
          skills: [
            {
              skill: "hydra",
              points: 20,
              role: "main",
              order: 1,
              note: "Three fire-breathing heads, cast and forgotten. It is the second damage type, and it works while you are casting Nova rather than instead of it.",
            },
            {
              skill: "fire-mastery",
              points: 18,
              role: "main",
              order: 2,
              note: "**Where the fire damage actually comes from on this route**, since the synergies are held at one point. Eighteen rather than twenty because that is what the budget leaves after the chain, and the last two points are worth less than the twenty in Hydra they would have to come from.",
            },
            {
              skill: "fire-bolt",
              points: 1,
              role: "prerequisite",
              note: "First of three points on the chain to Hydra. It is also a Hydra synergy, at one point, which is the honest measure of how little this route buys from synergies.",
            },
            {
              skill: "fire-ball",
              points: 1,
              role: "prerequisite",
              note: "Second on the chain, and the other Hydra synergy. Same one point, same reason.",
            },
            {
              skill: "enchant",
              points: 1,
              role: "prerequisite",
              note: "**Hydra's actual prerequisite.** It needs Fire Ball and Warmth, and the core already pays for Warmth.",
            },
          ],
          rotationNote:
            "Drop Hydra before you teleport in, then Nova as normal. Against a lightning immune the order reverses: Hydra first, and you keep your distance instead of standing in the middle.",
          gearNote:
            "Split gear, which is the hidden cost. **A Griffon's Eye and lightning facets do nothing for the Hydra**, and a fire facet does nothing for Nova. Bonuses that read *all skills* — Enigma, Mara's, a Hellfire Torch, an Annihilus — are what pay both halves, so this route wants them earlier than the others do.",
          statNote: "No change.",
          contentNote:
            "The Chaos Sanctuary and the Pit before Infinity, and anywhere the immunity list is mixed. The Secret Cow Level does not need it — nothing there is lightning immune.",
        },
      ],
    },
  ],

  flexPoints: [
    "**Forty-one points are spare before you choose, and the package you pick above spends every one of them** — bar the two the Energy Shield route leaves over, which it names. Nova has one synergy and it is already maxed, so none of this is a way to raise Nova damage; the packages buy reach, survival or a second element instead.",
    "**Do not put points in Energy**, even on the Energy Shield route. The shield scales with your mana pool, and gear supplies far more mana per point spent than the attribute does.",
    "**Magic find variant:** the same skill plan, whichever package you took, swapping damage charms and gear for magic find. The build's clear speed makes it one of the better magic find characters even at reduced damage.",
    "**The Lightning Sorceress is not this build with the Storm package.** That page maxes Lightning and Chain Lightning as its main skills, on their own cast table, and holds Nova at one point; this one is the reverse. If the Storm package is the part that appeals, read that page before committing forty-one points to a half version of it.",
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
        "Charged Bolt carries you to level 12, and one point is all it is worth after that — it is not a Nova synergy. **Static Field is**, at 5% per hard point, as well as your answer to anything with too much life, so it is the one to pour levelling points into.",
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
    "One answer, and the build is built around owning it. **Lightning Mastery does not break immunity** — it is a damage multiplier at 50% plus 12% per level, the same as on the Lightning Sorceress. What breaks it is **Conviction from Infinity**, and this build's defining choice is to wield that Infinity yourself rather than putting it on the mercenary: the aura is identical either way, and self-wielding frees him to carry the Insight that pays your mana bill. **Griffon's Eye** stacks another -15-20% enemy lightning resistance on top, and **lightning facets** add more still. Before Infinity exists, the honest answers are the **Hydra hybrid package** for a second damage type, or picking zones — the Secret Cow Level has nothing lightning immune in it at all. A **Crack of the Heavens** sunder charm works but costs 70 to 90 points of your own lightning resistance, which on a build standing in the middle of lightning enchanted packs is a worse trade than usual.",

  hardcoreNotes:
    "The most dangerous Sorceress on the site, and the reasons are structural rather than fixable. You fight from the centre of the pack by design; self-wielding Infinity means **no shield at all**, so no block and no resistances from that slot; and the Sorceress life pool is the smallest in the game. If you take Energy Shield, **mana burn becomes lethal** rather than annoying. In Hardcore the honest recommendation is to put Infinity on the mercenary instead and keep a Spirit shield — you lose the Insight and pay for mana another way, and you keep a defensive slot. Chains of Honor over Enigma, Battle Orders always, and 60% Faster Hit Recovery as a hard requirement.",

  selfFoundNotes:
    "Not realistically. The finished build is an Infinity, which is two Ber runes among four, and there is no version of the endgame that works without Conviction. What *is* self-found is the first eighty levels: Nova at 12 over a maxed Static Field — its one synergy — is a genuinely strong and very cheap character, and the Hydra hybrid package keeps it viable in Hell against lightning immunes — it is the one route on this page costed for a character with no high runes. Treat this page as a destination. The Frozen Orb and Fire Ball Meteor pages describe builds that reach their own ceiling without a single high rune.",

  levelingPath: {
    summary:
      "Levels as itself. Charged Bolt from level 1 gets you to Nova at 12, Static Field from 6 is the synergy you keep, and Teleport at 18 gives you the mobility the build is built on. Lightning Mastery at 30 is when the damage starts to compound. **No respec is required** — but be clear-eyed that the build you are levelling is not the build on this page's later tiers, which is defined by an item rather than a skill. **Do not start a package before the core is finished**, which is around level 80: until then every point belongs to the 69, and which package you want depends on whether an Infinity has turned up by the time you get there.",
  },

  confidence: "verified",
  complete: true,
};
