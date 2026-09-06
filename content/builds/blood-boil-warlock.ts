import type { Build } from "@/lib/types";

/**
 * The Blood Boil Warlock — the Demon tree, spent rather than fielded.
 *
 * The tree looks like a summoner's and is not one. The cap is **three demons**,
 * set by two hard-point thresholds in Demonic Mastery that `+skills` cannot
 * move, and three minions is not an army. What the tree actually does is
 * convert demons into damage, and Blood Boil is the conversion.
 *
 * Two extracted facts carry the page.
 *
 *   **Blood Boil publishes two damage tables, not one.** 10-20 fire and 10-20
 *   physical at level 1, with identical growth — and separately synergised, at
 *   20% per level each, by Blood Oath into the fire and Engorge into the
 *   physical. Two components fed by two different donors are two components; if
 *   they were one damage written twice, neither would have a donor. That is the
 *   argument the generator now uses to publish both.
 *
 *   **The cost falls as you spend more demons.** The skill takes 15% of one
 *   demon's life at level 1, half that per demon with two out and a third with
 *   three, never below 5%. Three demons is not three casts — it is one cast
 *   that costs a third as much.
 *
 * The demons are the ammunition and Engorge is the reload: it feeds a corpse to
 * them for 30% of their life plus 1% per level. Nothing else on this site has
 * this shape.
 */
export const bloodBoilWarlock: Build = {
  slug: "blood-boil-warlock",
  name: "Blood Boil Warlock",
  classSlug: "warlock",
  summary:
    "Detonates your own demons for fire and physical damage at once, and refills them from corpses. Two damage types on one cast, from a tree that only ever holds three minions.",
  damageTypes: ["fire", "physical"],
  primarySkill: "blood-boil",
  playstyle:
    "Summon three demons, mark something, and boil. Death Mark is what makes the tree work at range — your demons teleport to whatever you marked, which turns three slow melee minions into three that arrive — and it strips the target's defence and damage reduction while they do. Blood Boil then detonates a demon in a radius that steps from 6 to 12, for fire and physical at the same time. Engorge feeds a corpse back to the survivors, which is the reload. It is a loop rather than a rotation, and the pace is set by how many corpses the last pack left.",
  strengths: [
    "Two damage types on a single cast — fire and physical, separately synergised at 20% per level each",
    "Only six of the eighteen catalogued areas record immunity to both halves at once",
    "Blood Oath sends up to 30% of the damage you take to a demon instead, on a class that already has 3 life per Vitality",
    "The demon cost per cast falls by two thirds when three demons are out rather than one",
    "Ars Tor'Baalos raises four of the build's six skills from a single item",
  ],
  weaknesses: [
    "Three demons is the ceiling, and two hard-point thresholds — not +skills — are the only thing that raises it",
    "The loop stops without corpses: no corpse means no Engorge, and no demon means no Blood Boil",
    "Blood Boil is a targeted detonation with a radius of 6 to 12, not a screen-clearing spell",
    "Nothing comes online until level 18, and the loop is not complete until 24",
    "The best off-hand asks 95 Strength and the class base is 15",
  ],
  difficulty: "advanced",
  budget: "medium",
  ratings: {
    clearSpeed: 3,
    bossing: 4,
    survivability: 4,
    magicFind: 3,
    terrorZones: 3,
    ubers: 3,
    soloSelfFound: 3,
    players8: 4,
  },

  skills: [
    {
      skill: "blood-boil",
      points: 20,
      role: "main",
      order: 1,
      note: "Two tables at once — 10-20 fire and 10-20 physical at level 1, growing identically. The radius steps at hard points 5 and 10: 6, then 9, then 12.",
    },
    {
      skill: "blood-oath",
      points: 20,
      role: "synergy",
      order: 2,
      note: "+20% to Blood Boil's fire half per level, and separately the survivability plan: up to 30% of damage you take goes to a demon, and their life rises 50% plus 35% per level so they survive receiving it.",
    },
    {
      skill: "engorge",
      points: 20,
      role: "synergy",
      order: 3,
      note: "+20% to Blood Boil's physical half per level, and the reload: feed a corpse to the demons for 30% of their life plus 1% per level, with 5% damage reduction and life steal on top.",
    },
    {
      skill: "demonic-mastery",
      points: 10,
      role: "utility",
      order: 4,
      note: "**Ten hard points is the whole reason for this allocation.** Five take the demon cap from one to two and ten take it to three. Both thresholds read hard points, so `+skills` from gear do not move them — this is the one number on any Warlock build that gear cannot buy.",
    },
    { skill: "summon-goatman", points: 1, role: "utility", note: "One point summons them. How many you get is Demonic Mastery's business, not this skill's." },
    {
      skill: "death-mark",
      points: 1,
      role: "utility",
      note: "The skill that makes the tree playable at range: marked targets pull your demons to them across 38 units. It also cuts the target's damage reduction by 5 and its defence by 50, and it gives your Goatmen 5% Crushing Blow plus 1% per level of this skill.",
    },
  ],

  skillPackages: [
    {
      id: "the-other-38",
      name: "The other thirty-eight",
      choose: "one",
      intro:
        "The core is 72 points and the loop is complete at that number. What is left decides whether the three demons are ammunition that also fights, or whether you go and take a fourth from the world.",
      packages: [
        {
          id: "three-goatmen",
          name: "Three Goatmen",
          when: "You want the demons to be worth something between detonations. Twenty points of Demonic Mastery is +200% damage and +475% attack rating on each of them, and twenty in Summon Goatman is another +200% damage, +900 attack rating and four abilities the pet learns on its own.",
          tradeoff:
            "No Bind Demon, so no fourth demon and no captured Aura Enchanted monster fighting for you. This is the simpler build and the one that works without a specific pack in front of you.",
          skills: [
            { skill: "blood-boil", points: 20, role: "main", order: 1 },
            { skill: "blood-oath", points: 20, role: "synergy", order: 2 },
            { skill: "engorge", points: 20, role: "synergy", order: 3 },
            { skill: "demonic-mastery", points: 20, role: "utility", order: 4 },
            {
              skill: "summon-goatman",
              points: 20,
              role: "utility",
              order: 5,
              note: "It learns Stun at 2, Berserk at 3, Frenzy at 4 and Cleave at 5 — the four points from the second to the fifth buy behaviour rather than numbers, and the fifteen after them buy damage and defence.",
            },
            { skill: "death-mark", points: 1, role: "utility" },
          ],
          rotationNote:
            "Mark, let the three arrive, and boil the one standing furthest from you so the other two keep fighting. The demons are a damage source in this package and should not all be spent at once.",
          remainderNote: "Nine points spare at 101 of 110. Death Mark takes them — every point there is 1% more Crushing Blow on all three Goatmen and a longer mark.",
        },
        {
          id: "bound-demon",
          name: "The bound demon",
          when: "You want a fourth demon that does not count against the cap. Bind Demon uses a different pet type with a maximum of one, so a Warlock at ten points of Demonic Mastery holds three summoned demons and one captured one at the same time.",
          tradeoff:
            "The three Goatmen stay at one hard point and are ammunition rather than fighters. You are trading a reliable front line for one much better monster that has to be found and captured first.",
          skills: [
            { skill: "blood-boil", points: 20, role: "main", order: 1 },
            { skill: "blood-oath", points: 20, role: "synergy", order: 2 },
            { skill: "engorge", points: 20, role: "synergy", order: 3 },
            { skill: "demonic-mastery", points: 20, role: "utility", order: 4 },
            { skill: "summon-goatman", points: 1, role: "utility" },
            { skill: "death-mark", points: 1, role: "utility", note: "It raises the chance to bind as well as marking the target." },
            { skill: "summon-tainted", points: 1, role: "prerequisite" },
            { skill: "summon-defiler", points: 1, role: "prerequisite" },
            {
              skill: "bind-demon",
              points: 20,
              role: "utility",
              order: 5,
              note: "The affixes are the progression, not the numbers: Extra Strong at 5 hard points, Extra Fast at 10, Spectral Hit at 15 and Aura Enchanted at 20. On top of that the bound demon gets +75% damage with 5% more per level and +100% life with 5% more per level.",
            },
            { skill: "consume", points: 1, role: "utility", note: "Destroys a demon outright for +5% maximum life plus 1% per level and movement speed toward a 46% ceiling, for 40 seconds. One point, used before a boss." },
          ],
          gearNote:
            "Ars Tor'Baalos becomes even better here — it carries +2-3 Consume as well as the three skills this package already wanted.",
          rotationNote:
            "Bind something dangerous before the fight rather than during it. A bound Aura Enchanted monster at twenty hard points is the strongest single minion the class can field, and it is worth walking back for.",
          contentNote: "Best in areas with large, slow demons worth capturing — Act 4 and Act 5 rather than the Kurast jungles.",
          remainderNote: "Five points spare at 105 of 110. They go into Death Mark, which lengthens the mark and raises the bind chance at the same time.",
        },
      ],
    },
  ],

  stats: {
    strength: "Enough for the off-hand, and the number is 95 if you want the elite Compendium.",
    dexterity: "Base.",
    vitality: "Everything else, and it is worth more here than on the caster builds because Blood Oath is already sending part of the damage elsewhere.",
    energy: "None.",
    notes: [
      "**The off-hand is the Strength plan.** Ars Tor'Baalos sits on a Blasphemous Compendium, which asks **95 Strength** against a class base of 15. A Possessed Compendium asks 50 and a Burnt Text 38, and both are real answers until the elite is worth paying for.",
      "**Levitation Mastery reduces item requirements by 2% per level to a −50% floor.** This build spends no point in it and does not budget for the discount; whether the reduction reaches armour at all is not established.",
      "Vitality does more work here than on any other Warlock build. Blood Oath sends up to 30% of incoming damage to a demon, which is a multiplier on the life you already have rather than a replacement for it.",
      "Blood Boil's mana is 15 plus 1 per level and Engorge's is 12 plus 1. The loop is cheap; the summons are not, at 30, 50 and 70. Insight on the mercenary covers the difference.",
    ],
  },

  breakpoints: [
    { stat: "fcr", value: 75, frames: 10, why: "Blood Boil, Engorge and Death Mark are all casts, and the loop is three of them per pack. This is a damage breakpoint on this build rather than a convenience.", priority: "required" },
    { stat: "fhr", value: 56, frames: 7, why: "The Necromancer/Druid/Warlock table. You are standing closer than a caster and further than a melee character.", priority: "recommended" },
    { stat: "fcr", value: 125, frames: 9, why: "Reachable once Bloodpact Shard's 30% is in hand, and the loop is short enough that the frame is felt.", priority: "luxury" },
  ],

  gearSets: [
    {
      tier: "starter",
      goal: "A Goatman from level 1, and Death Mark at 6 so it arrives where you want it.",
      levelRange: [1, 30],
      slots: [
        { slot: "weapon", picks: [{ label: "Any wand, staff or dagger with +to Warlock skills", why: "A two-handed staff costs nothing on this class — the weapon levitates and the off-hand stays free.", lookFor: ["+1-3 to Warlock Skills", "+to Summon Goatman", "Faster Cast Rate"] }] },
        { slot: "offhand", picks: [{ label: "Any Grimoire with +to Warlock skills", why: "Normal-tier bases ask 12 to 25 Strength.", lookFor: ["+2 to Warlock Skills", "+2 to Demon Skills"] }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "stealth" }, why: "Cast rate and hit recovery for two Countess runes." }] },
        { slot: "helm", picks: [{ ref: { kind: "runeword", slug: "lore" }, why: "+1 to All Skills, which at this level is a second Goatman five levels early." }] },
      ],
      nextUpgrade: "Ten hard points in Demonic Mastery, which is worth more than any item in this tier.",
    },
    {
      tier: "nightmare",
      goal: "Blood Boil at 18 and Engorge at 24 — the loop closing for the first time.",
      levelRange: [30, 50],
      slots: [
        { slot: "weapon", picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "+2 to All Skills and 25-35% Faster Cast Rate. Two levels of Blood Boil and two of Blood Oath from four Countess runes." }] },
        { slot: "offhand", picks: [{ label: "Any Grimoire with +2 Warlock skills and a Demon tab", why: "The Demon tab is index 21. A +2 there is two levels on every skill in the plan at once.", lookFor: ["+2 to Warlock Skills", "+2 to Demon Skills"], alternatives: [{ ref: { kind: "runeword", slug: "vigilance" }, why: "Dol and Gul in a Grimoire: all resistances, life, mana and defence, for two runes that drop constantly. Two runes is also the only count a Grimoire's sockets allow." }] }] },
        { slot: "body", picks: [{ ref: { kind: "unique", slug: "skin-of-the-vipermagi" }, why: "+1 skills, 30% cast rate and resistances." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "tarnhelm" }, why: "+1 to All Skills and magic find." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "nightsmoke" }, why: "Resistances and damage-to-mana." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "waterwalk" }, why: "Life and stamina." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "nagelring" }, why: "Magic find in a placeholder slot." }] },
      ],
      nextUpgrade: "Bloodpact Shard at level 67, which is the single largest item upgrade on the character.",
    },
    {
      tier: "early-hell",
      goal: "The loop running in Hell, with enough resistance that a boiled pack does not take you with it.",
      levelRange: [50, 70],
      slots: [
        { slot: "helm", picks: [{ ref: { kind: "runeword", slug: "coven" }, why: "Ist Ral Io: +1 to All Skills, 20% Faster Cast Rate and 26-40% magic find once Ist's helm modifier is counted.", sockets: "Ist Ral Io in a three-socket circlet." }] },
        { slot: "weapon", picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "Held until Bloodpact Shard." }] },
        { slot: "offhand", picks: [{ label: "Measured Wrath", why: "A Burnt Text at level 52 with +1 to Warlock skills, +20-30 all resistance and 25% Faster Cast Rate, at 38 Strength. Its fire skills are dead weight; the resistances and the cast rate are not.", alternatives: [{ ref: { kind: "runeword", slug: "vigilance" }, why: "If the resistances matter more than the skill level." }] }] },
        { slot: "body", picks: [{ ref: { kind: "unique", slug: "skin-of-the-vipermagi" }, why: "Unchanged." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 to All Skills and 20% Faster Cast Rate — the loop is three casts per pack and this shortens all three." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "sandstorm-trek" }, why: "Strength and Vitality, and the Strength is going toward a 95-point bill." }] },
        { slot: "amulet", picks: [{ label: "Any amulet with +2 Warlock skills", why: "Two levels across the whole plan." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 to All Skills and the mana for three summons." }] },
        { slot: "ring2", picks: [{ label: "Any rare ring with 10% Faster Cast Rate and resistance", why: "Where the 75% breakpoint usually closes." }] },
      ],
      nextUpgrade: "Bloodpact Shard, and then Ars Tor'Baalos.",
    },
    {
      tier: "budget",
      goal: "The two class items that were made for this build.",
      levelRange: [70, 85],
      slots: [
        { slot: "weapon", picks: [{ label: "Bloodpact Shard", why: "A Mithril Point at level 67: **+1 to All Skills, +2-3 Blood Oath, +2-3 Blood Boil, +1-3 Bind Demon, 30% Faster Cast Rate and +10-15% maximum life**, with 25% slow on top. It raises the two skills the whole build is made of and pays a cast-rate breakpoint at the same time.", lookFor: ["+3 to Blood Boil", "+3 to Blood Oath", "+15% Maximum Life"] }] },
        { slot: "offhand", picks: [{ label: "Ars Tor'Baalos", why: "A Blasphemous Compendium at level 73: **+2 to Demon Skills, +2-3 Demonic Mastery, +2-4 Blood Boil, +2-3 Engorge, +2-3 Consume**, 12 life per character level and 5-10% damage reduction. It raises four of this build's six skills from one slot and there is nothing else like it in the game. It asks 95 Strength.", lookFor: ["+4 to Blood Boil", "+3 to Engorge", "+3 to Demonic Mastery"], alternatives: [{ label: "Measured Wrath", why: "If 95 Strength is more than you want to pay yet. It is 38, and the gap is roughly forty stat points." }] }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 to All Skills, life and mana per level, and 10% damage reduction." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "authority" }, why: "Hel Shael Ral: +2 to Warlock skills and 40-60% enhanced defence, and the Hel takes a bite out of that Strength requirement." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "Unchanged." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "sandstorm-trek" }, why: "Unchanged, and the Strength is load-bearing." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 to All Skills and +20-30 all resistances." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "Unchanged." }] },
        { slot: "ring2", picks: [{ label: "Opalvein", why: "A ring at level 50: 2-15% chance to cast Flame Wave on attack, 10% Faster Cast Rate, +6-8 all resistances and life and mana per kill. The per-kill lines suit a build that kills in bursts." }] },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders raises the demons' life as well as yours, and Blood Oath has already made their life your defence." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "The other half." },
      ],
      nextUpgrade: "Enigma, or a second Stone of Jordan.",
    },
    {
      tier: "optimized",
      goal: "Both class items rolled well, and Teleport so the demons follow you rather than the other way round.",
      levelRange: [85, 99],
      slots: [
        { slot: "weapon", picks: [{ label: "Bloodpact Shard", why: "Unchanged. Nothing else in the game carries +Blood Boil and +Blood Oath together." }] },
        { slot: "offhand", picks: [{ label: "Ars Tor'Baalos", why: "Unchanged, and now worth the 95 Strength.", lookFor: ["+4 to Blood Boil", "+3 to Engorge"] }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "Unchanged." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "enigma" }, why: "Teleport. Death Mark pulls the demons to a marked target across 38 units, so a teleporting Warlock and three demons arrive together — this is the build where Enigma changes the rotation rather than just the travel time." }, { ref: { kind: "runeword", slug: "chains-of-honor" }, why: "If a Jah is out of reach." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "+1 to Fire Skills raises Blood Boil's fire half and not its physical half — half an item, and still the best gloves available to the build." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "Unchanged." }] },
        { slot: "boots", picks: [{ label: "Wraithstep", why: "Mirrored Boots at level 67: **+1 to a Warlock skill tab**, 30% Faster Run/Walk, 20% Faster Hit Recovery and +10-15 Dexterity and Energy. The only boots in the game that carry a Warlock tab.", alternatives: [{ ref: { kind: "unique", slug: "sandstorm-trek" }, why: "If the Strength is still needed for the Compendium." }] }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "Unchanged." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "Unchanged." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "A second one." }] },
      ],
      charms: [{ label: "Grand charms with +1 to Demon Skills", why: "The Demon tab is index 21, and it is one of only two Warlock tabs that appear on any item in the game." }],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Unchanged." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "Unchanged." },
      ],
      nextUpgrade: "Better rolls. The plan does not change again.",
    },
    {
      tier: "bis",
      goal: "Nothing left to change.",
      levelRange: [90, 99],
      slots: [
        { slot: "weapon", picks: [{ label: "Bloodpact Shard", why: "At +3 Blood Boil, +3 Blood Oath and +15% maximum life." }] },
        { slot: "offhand", picks: [{ label: "Ars Tor'Baalos", why: "At +4 Blood Boil and +3 to both Engorge and Demonic Mastery." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "Socketed with a Rainbow Facet of fire — half the damage is fire and the facet only reads that half." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "enigma" }, why: "Unchanged." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "Unchanged." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "Unchanged." }] },
        { slot: "boots", picks: [{ label: "Wraithstep", why: "At +1 to the Demon tab, if the roll cooperates — the tab it grants is random." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "Unchanged." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "Unchanged." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "Unchanged." }] },
      ],
      charms: [{ label: "Nine grand charms with +1 to Demon Skills and life", why: "Nine levels across Blood Boil, Blood Oath and Engorge at once." }],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Unchanged." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "Unchanged." },
      ],
      notes:
        "Two of the ten slots on the finished character are items that exist only because this class does, and both of them were made for this build specifically. That is not true of any other Warlock page.",
    },
  ],

  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "Act 2, Nightmare, Might — it raises the demons' physical damage as well as the mercenary's, and Blood Oath has already made the demons part of your defence. Insight in the polearm is the mana plan: three summons cost 30, 50 and 70, and the loop on top of that is another 27 per pack. The mercenary is also a second body for Blood Oath to hide behind, which matters more here than on the caster builds.",

  farming: [
    { area: "mausoleum", difficulty: "hell", why: "Area level 85 with poison and cold immunity recorded — neither half of this build's damage is touched. Undead and dense, which means corpses, which means Engorge never stops.", minTier: "early-hell", rating: 5 },
    { area: "pindleskin", difficulty: "hell", why: "Cold and poison immunity recorded, a thirty-second run, and a pack tight enough that one boil covers it. His minions are also the corpses for the next one.", minTier: "nightmare", rating: 5 },
    { area: "andariel", difficulty: "hell", why: "Poison immunity only. A single boss standing still, which is what a targeted detonation wants, and a short run.", minTier: "nightmare", rating: 4 },
    { area: "mephisto", difficulty: "hell", why: "Fire and lightning immunity recorded — the fire half is blunted here and the physical half is not, which is the whole argument for carrying both.", minTier: "early-hell", rating: 4 },
    { area: "pit", difficulty: "hell", why: "Physical, cold and lightning immunity recorded and no fire. The mirror image of the Ancient Tunnels, and the other half of the same argument.", minTier: "budget", rating: 4 },
    { area: "ancient-tunnels", difficulty: "hell", why: "Area level 85 with fire and poison immunity recorded and no physical — so the fire half of Blood Boil is stopped and the physical half is not. Dense, and the corpses are close together.", minTier: "budget", rating: 4 },
  ],

  immunityPlan:
    "**Blood Boil deals fire and physical on the same cast, and the two are separately synergised.** That is not a flavour detail — it is the reason this build has the second-best immunity coverage of the four, behind only the magic one.\n\nOf the eighteen catalogued areas, twelve record fire immunity and eight record physical. **Six record both**: the Chaos Sanctuary, the Worldstone Keep, the Kurast Temples, River of Flame, Nihlathak's temple and the Stony Tomb. Everywhere else, at least one half of the cast lands at full strength. The Ancient Tunnels stop the fire and not the physical; the Pit stops the physical and not the fire; the Mausoleum and Pindleskin stop neither.\n\n**Against the six, there are two answers and both are charms.** A Flame Rift sunders fire immunity at the cost of 70 to 90 points of your own fire resistance, and a Bone Break does the same for physical. Either one converts a doubly-immune area into a singly-immune one, which is enough — you do not need both, because you are not trying to make both halves land.\n\nWhat this build does **not** have is a pierce of its own. No Warlock skill outside the Chaos tree lowers any resistance, Death Mark lowers damage reduction and defence rather than elemental resistance, and there is nothing on the Demon tree that behaves like Amplify Damage. The two sunder charms are the whole answer and the page is not going to invent a third.",

  hardcoreNotes:
    "The sturdiest of the four, and Blood Oath is why. Up to 30% of what hits you is sent to a demon instead, on a class that already gets 3 life per point of Vitality — and the same passive raises the demons' life by 50% plus 35% per level and their resistances toward a 79% ceiling, so the thing absorbing the damage survives absorbing it. Take the Three Goatmen package rather than the bound demon: a captured monster has to be found, and a Hardcore character should not be walking into a pack to acquire its defence. Keep Engorge's 5% damage reduction up, and remember the loop needs corpses — a fight with nothing dead in it yet is the dangerous one.",

  selfFoundNotes:
    "Reasonable self-found and better than the Cleave page. The core loop needs no specific item: ten hard points in Demonic Mastery is the most important upgrade in the build and it costs nothing. Spirit is four Countess runes and Coven needs one Ist. What you will not find is Ars Tor'Baalos, and until then Measured Wrath at level 52 or any Grimoire with a +2 Demon tab does most of its job — the tab is worth two levels on four of your six skills at once, which is the same shape as the elite unique in miniature.",

  levelingPath: {
    summary:
      "The awkward one of the four. Summon Goatman and Death Mark carry the first eighteen levels on their own and the build does not really exist until Blood Boil at 18, with the loop only closing when Engorge arrives at 24. Nothing is wasted — Demonic Mastery and Blood Oath are both maxed by the finished plan — but expect the demons to be doing the killing for the whole of Act 1 and 2.",
    respecAt: "No respec is needed. Every point spent on the way up is one the level 99 plan wants.",
  },

  release: "reign-of-the-warlock",
  confidence: "single",
  complete: true,
};
