import type { Build } from "@/lib/types";

/**
 * Dragon Tail.
 *
 * THE ORDER, WHICH IS THE WHOLE PAGE
 * ----------------------------------
 * Dragon Tail kicks once and the kick detonates. The universal description of
 * that explosion — "it adds fire damage" — is wrong in the one way that decides
 * where this character can farm.
 *
 * **The fire is computed from the physical damage the target actually
 * suffered.** The mechanics reference states it of this family by name: some of
 * the Assassin's combat kicks "deliver elemental damage based on enemy's
 * suffered physical damage, so they won't do elemental damage to physical
 * immune enemies."
 *
 * The pinned data agrees by absence, and the absence is total. `Dragon Tail`
 * carries `EType = fire` and **no `EMin`, no `EMax`, no `EMinLev`, no
 * `EMaxLev`, and no `calc4`** — and `calc4` is the column whose own
 * description reads "% Damage Dealt as Elemental (Used only if there is an
 * Etype)". Its missile, `dragontail missile`, carries none of them either. So
 * there is no authored fire number anywhere in the extraction. The controls are
 * in the same file: Berserk carries `calc4 = 100` and converts everything;
 * Corpse Explosion carries `Param5 = 50` and splits it in half; Concentrate and
 * Frenzy carry `calc4 = skill('Berserk'.blvl)`. Skills that convert a stated
 * share say so in a column. This one has nothing to state, because the quantity
 * is not authored — it is derived at the moment of the hit.
 *
 * So the sequence is:
 *
 *   1. the kick rolls to hit
 *   2. physical damage is computed and the target's **physical** resistance is
 *      applied
 *   3. the explosion is derived from what actually got through
 *   4. the target's **fire** resistance is applied to that
 *
 * And the two consequences invert the usual advice:
 *
 *   - **A physical immune takes no fire either.** Not less fire — none. There
 *     is nothing for step 3 to read. This is not a build that answers physical
 *     immunity by having a second element; it is a build whose second element
 *     is a function of the first.
 *   - **A fire immune loses only the explosion.** The kick lands in full. Fire
 *     immunity costs this build its crowd clear and none of its single-target
 *     damage, which is the opposite of how it reads.
 *
 * WHY THIS IS NOT THE KICKSIN, AND THE DIFFERENCE IS ARITHMETIC
 * ------------------------------------------------------------
 * Both kick, both take their damage from the boots, both hold claws they do not
 * hit with. Then they diverge, and every axis diverges the same way.
 *
 *   Dragon Talon  `calc1 = lvl/6+1` kicks, `Param1/2 = 5 + 7` damage %
 *   Dragon Tail   one kick, `Param1/2 = 50 + 20` damage %, `Param3 = 6` radius
 *
 * Twenty points is four kicks at +138% each on one page, and one kick at
 * **+430%** with an explosion around it on this one. That single number is why
 * the two builds want opposite gear:
 *
 *   - **A plus to your skills buys kicks on the Kicksin and damage here.** There is no
 *     breakpoint to step over; every point of `+skills` is 20% more.
 *   - **Crushing Blow is worth a quarter of what it is worth there.** It is a
 *     per-hit roll, and this build makes one hit per press instead of four to
 *     seven. The Kicksin's signature mechanic is this build's minor one.
 *   - **Attack rating matters, and there it does not.** One roll to hit per
 *     press means one chance to waste the whole press.
 *
 * TIGER STRIKE IS THE BUILD'S SECOND HALF, AND IT PAYS TWICE
 * ---------------------------------------------------------
 * `Param1 = 100` baseline, `Param2 = 20` per level, applied **per charge** —
 * so twenty points is +480% per charge and three charges is a multiplier on the
 * kick that dwarfs anything else available. And `Param4 = 50` is "Attack Rating
 * % per Charge", so three charges also carry +150% attack rating into the one
 * roll that matters.
 *
 * That is the rotation, and it is genuinely a rotation rather than a held
 * button: three Tiger Strikes, then one Dragon Tail into the middle of the
 * pack. Charges stand for `375` frames — fifteen seconds, flat — so the walk
 * between packs does not cost them.
 *
 * THE COST IS PRINTED ON THE ROW
 * ------------------------------
 * `Param4 = -40`, and its own description is "Attack Speed % Reduction". Dragon
 * Tail is forty percent slower than the same character's other attacks. That is
 * the price of the explosion and it is why the speed package exists, why Burst
 * of Speed is worth twenty points here and nothing at all on the Blade Fury
 * page, and why a Dragon Tail bar does not reach the frame counts a Dragon
 * Talon bar does.
 *
 * WHAT THE KICK CARRIES
 * ---------------------
 * The same list as every kick, and it is not the list most gear advice assumes:
 * Crushing Blow, Open Wounds, both leeches, elemental and magic damage from
 * equipment, poison, Venom and chance-to-cast on striking all travel.
 * **Deadly Strike and Claw Mastery do not** — neither is applied to kick
 * damage — and neither are the plain minimum and maximum *physical* damage adds
 * from equipment. Nothing on the off-hand claw is read for special events.
 *
 * IT ROLLS TO HIT, EXCEPT WHEN IT SPENDS CHARGES
 * ----------------------------------------------
 * `ToHit = 20`, `LevToHit = 15` and `UseAttackRate = 1`, so this is an ordinary
 * attack-rate skill. `Param8 = 1` is "Always Hit (0 = disabled | 1 = enabled
 * only when Charges are consumed)", so the swing that releases a Tiger Strike
 * stack cannot miss — and a Dragon Tail pressed with no charges standing can.
 * That is a rotation fact rather than a footnote: pressing the finisher on an
 * empty stack is both the weakest and the least reliable thing this build does.
 *
 * THE EXPLOSION ITSELF
 * --------------------
 * `dragontail missile`: `Explosion = 1`, `CollideKill = 1`, `LastCollide = 1`,
 * `NoMultiShot = 1`, `NumDirections = 1`, `HitShift = 8`, and **no `NextHit`
 * and no `NextDelay`**. One explosion, on the target, with `Param3 = 6` of
 * radius around it, hitting everything inside once. There is no cap on how
 * often a given monster can be caught by it, which matters only because the
 * kick is slow enough that it never comes up.
 *
 * WHAT IS NOT ESTABLISHED, AND IS NOT PUBLISHED
 * ---------------------------------------------
 * - **The fraction.** That the fire is derived from the physical is
 *   established; *what share* of it becomes fire is in no column, because no
 *   column holds it. No percentage is published anywhere on this page.
 * - Whether the explosion's own damage can be raised by −enemy fire resistance
 *   applied at step 4 only, or whether anything reads it earlier.
 * - What `Param3 = 6` is in yards. The site publishes the raw radius the same
 *   way the skill page does.
 */
export const dragonTail: Build = {
  slug: "dragon-tail",
  name: "Dragon Tail",
  classSlug: "assassin",
  summary:
    "One kick, and it detonates. The fire is computed from the physical damage that actually landed — so this is the crowd-clearing kicker, and a physical immune takes neither half.",
  damageTypes: ["physical", "fire", "poison"],
  primarySkill: "dragon-tail",
  playstyle:
    "You charge Tiger Strike three times on whatever is nearest, then put one Dragon Tail into the middle of the pack, and the pack goes up. That is the whole loop, and it is a loop rather than a held button: the charges stand for fifteen seconds, so you build them on the way in and spend them where they will reach the most. The kick is forty percent slower than the same character's other attacks and that is the deliberate trade — you are not making many hits, you are making one very large one and letting it spread. The thing to internalise is that the explosion is not a second damage type you can fall back on. It is computed from the physical damage that got through, so it is enormous on anything the kick hurts and exactly nothing on anything the kick does not.",
  strengths: [
    "**The only kick that clears a room.** One press, one explosion, everything inside the radius",
    "**+430% kick damage at twenty points**, against the Kicksin's +138% — the point value that makes these two different builds rather than two spellings of one",
    "Tiger Strike multiplies the kick by +480% *per charge* and carries +150% attack rating across three, so the two skills that make the build also solve each other's problems",
    "Charges stand fifteen seconds flat, so the rotation survives the walk between packs",
    "**A fire immune costs you the explosion and none of the kick** — which is the reverse of how most players read this build",
    "Boots are the weapon, so the damage item is cheap and has no dexterity requirement at all",
    "Dragon Flight is one point and is the class's only native movement skill",
  ],
  weaknesses: [
    "**A physical immune takes no fire either**, because the fire is derived from the physical that landed. This is the build's wall and it is a hard one",
    "**−40% attack speed, printed on the row.** This is the slowest attack on the class and no amount of gear makes it fast",
    "**Crushing Blow is worth a quarter of what it is worth on the Kicksin**, because there is one roll per press rather than four to seven",
    "One roll to hit per press, so a miss costs the whole activation and attack rating is not optional",
    "Deadly Strike and Claw Mastery do nothing on a kick, and both are on items this build otherwise wants",
    "It is melee, with no life bonus of its own and no ranged answer",
    "Pressed with no charges standing it is both weak and able to miss — the rotation is not decorative",
  ],
  difficulty: "moderate",
  budget: "medium",
  ratings: {
    clearSpeed: 4,
    bossing: 3,
    survivability: 3,
    magicFind: 3,
    terrorZones: 4,
    ubers: 2,
    soloSelfFound: 4,
    players8: 3,
  },

  skills: [
    {
      skill: "dragon-tail",
      points: 20,
      role: "main",
      order: 1,
      note: "**+430% kick damage at twenty**, from `Param1 = 50` baseline and `Param2 = 20` per level, plus an explosion of `Param3 = 6` radius around the target. There is no synergy to buy anywhere — every point of this skill's damage is in this skill.",
    },
    {
      skill: "tiger-strike",
      points: 20,
      role: "main",
      order: 2,
      note: "**The multiplier, and it is the larger of the two numbers.** +100% baseline and +20% per level, applied *per charge*, so twenty points is +480% per charge and three charges is the largest multiplier in the tree. `Param4 = 50` also gives +50% attack rating per charge, which is how a build with one roll per press affords to make it.",
    },
    {
      skill: "venom",
      points: 20,
      role: "main",
      order: 3,
      note: "**The only damage on this page a physical immune does not stop.** Poison is neither physical nor derived from it, and it rides every kick. Its length is pinned to ten frames rather than stacked, so a slow attack gets less out of it than a fast one — which is honest, and still leaves it the third-largest number here and the only one that survives the wall.",
    },
    { skill: "dragon-talon", points: 1, role: "prerequisite", note: "The chain to Dragon Tail runs Talon → Claw → Tail. One point, and worth having on the bar for a single target that does not need an explosion." },
    { skill: "dragon-claw", points: 1, role: "prerequisite", note: "The second link. It is the one finisher that *is* a weapon attack — `SrcDam = 128` and Claw Mastery written into its formula — so it is a different skill wearing the same tree, and one point is all this build wants of it." },
    { skill: "dragon-flight", points: 1, role: "utility", note: "**One point, and it is the class's only movement skill.** It teleports to a target and kicks it, and it is a finisher — so it spends a standing Tiger Strike stack across the room. Engage, escape and opener in one button." },
    { skill: "claw-mastery", points: 1, role: "prerequisite", note: "**One point and no more, and the reason is specific.** Claw Mastery is not applied to kick damage. It is here because it is the gateway to the whole Shadow tree — Weapon Block sits behind it, and so does the branch Venom needs." },
    { skill: "burst-of-speed", points: 1, role: "prerequisite", note: "Fade's prerequisite, and the answer to the −40%. One point unless you take the speed package, which is where the case for twenty is made." },
    { skill: "fade", points: 1, role: "utility", note: "Venom's prerequisite. One point unless you take the survival package. It excludes Burst of Speed, and the two are the only members of their exclusion group in `states.json` — so those two packages are genuinely opposed." },
    { skill: "weapon-block", points: 1, role: "utility", note: "One point, and it only works with a claw in each hand — which this build has, because the claws are doing nothing else." },
    { skill: "psychic-hammer", points: 1, role: "prerequisite", note: "Cloak of Shadows' prerequisite." },
    { skill: "cloak-of-shadows", points: 1, role: "utility", note: "Blinds the pack and cuts its defence, which on a build with one roll to hit per press is worth more than the blind." },
    { skill: "mind-blast", points: 1, role: "utility", note: "Stun and conversion, and the one skill here that Faster Cast Rate does anything for." },
    { skill: "shadow-warrior", points: 1, role: "prerequisite", note: "Shadow Master's prerequisite, and replaced by it — they share a `pettype`." },
    { skill: "shadow-master", points: 1, role: "utility", note: "One point is one shadow. Nineteen more is the third package." },
  ],

  skillPackages: [
    {
      id: "dragon-tail-38",
      name: "The last thirty-eight points",
      choose: "one",
      intro:
        "The core is 72 of 110, and it is closed: **Dragon Tail has no synergy in either direction**, and Tiger Strike and Venom are both at twenty, so no further point anywhere raises a damage number. That leaves thirty-eight, and all three routes below buy survival or speed rather than damage — which is what a build with no synergies has to spend points on. **Take exactly one.** Each costs exactly thirty-eight and closes at 110. Note that the first two are mutually exclusive by mechanism as well as by budget: Burst of Speed and Fade write the same kind of self-state and casting one drops the other.",
      packages: [
        {
          id: "speed",
          name: "Burst of Speed and Weapon Block — attack the penalty",
          when: "**Take this for clearing.** The −40% on the row is this build's defining cost, and Burst of Speed's up to 60% attack speed is undiminished — it is not the item affix, it does not go through the diminishing formula, and it is the largest single answer to the penalty available.",
          tradeoff: "You give up Fade, and therefore its resistances and its curse-length reduction. On Hell that is a real loss and in the Chaos Sanctuary it is the wrong choice.",
          skills: [
            { skill: "burst-of-speed", points: 20, role: "utility", note: "**Up to 60% attack speed, undiminished, plus run speed.** The one buff on this class that directly repays the row's own penalty." },
            { skill: "weapon-block", points: 20, role: "utility", note: "A block chance climbing toward 65% with two claws and no shield. On a build that stands in the middle of what it just exploded, this is the survivability plan." },
          ],
          gearNote: "Increased Attack Speed on the primary claw stacks with this and is worth real slots. Off-hand attack speed is not read.",
          rotationNote: "Unchanged in shape and materially faster in practice: three charges arrive sooner, so the fifteen-second window covers more ground.",
          contentNote: "Terror Zones, the Cow Level, Travincal, and anywhere the problem is a room.",
          remainderNote: "None. Thirty-eight points, and the plan closes at 110.",
        },
        {
          id: "survival",
          name: "Fade and Cloak of Shadows — attack the room",
          when: "**Take this for Hell and for Hardcore.** Fade takes elemental resistance to its ceiling and curse length down by as much as 90%, and Cloak of Shadows cuts the defence of everything nearby — which on a build with one roll to hit per press is an attack stat wearing a defensive coat.",
          tradeoff: "You give up Burst of Speed and therefore live with the full −40%. The rotation gets slower and the character gets much harder to kill.",
          skills: [
            { skill: "fade", points: 20, role: "utility", note: "Resistances, physical damage reduction at 1% per level, and the curse-length line that answers Iron Maiden. It excludes Burst of Speed, which is the whole trade this package is." },
            { skill: "cloak-of-shadows", points: 20, role: "utility", note: "**A long blind and a large defence reduction on everything in the room.** The blind is the survivability; the defence reduction is why the one roll to hit lands." },
          ],
          gearNote: "Resistances stop being what every ring and charm is chosen for, so those slots become attack rating and life.",
          contentNote: "The Chaos Sanctuary, the Worldstone Keep, and any Hardcore character.",
          remainderNote: "None. Thirty-eight points exactly.",
        },
        {
          id: "shadow",
          name: "Shadow Master and Mind Blast — attack the aggro",
          when: "**Take this if the problem is being surrounded rather than being slow.** A twenty-point shadow has up to 90% resistances and uses your skills, and Mind Blast converts part of the pack to fight for you.",
          tradeoff: "You give up both of the above: no undiminished attack speed and no Fade. The character stays slow and squishy and stops being the only target.",
          skills: [
            { skill: "shadow-master", points: 20, role: "utility", note: "It replaces Shadow Warrior rather than joining it — they share a `pettype` with `petmax = 1`. What it buys is the thing a slow melee build most needs: something else for the pack to walk towards while the charges build." },
            { skill: "mind-blast", points: 20, role: "utility", note: "Stun, and a conversion chance that rises to 40%. Converted monsters are bodies in front of you and damage you did not have to make." },
          ],
          gearNote: "Faster Cast Rate finally does something — for Mind Blast, and for nothing you attack with.",
          contentNote: "Players-8 games, dense Terror Zones, and the whole of Hell before the gear plan is finished.",
          remainderNote: "None. Thirty-eight points exactly.",
        },
      ],
    },
  ],

  flexPoints: [
    "There are none. Seventy-two in the core, thirty-eight in exactly one package, and 110 is the total.",
    "**Do not spend them on Claw Mastery.** It is not applied to kick damage, and it is the most commonly recommended sink for spare points on a martial-arts Assassin.",
    "**Do not spend them on Dragon Talon.** It is a different build — its lever is kick count and this build makes one kick — and the two do not add up to more than either.",
  ],

  stats: {
    strength: "**More than a Kicksin wants, and the boot damage formula is why.** The strength term multiplies the boots' own damage before the skill percentage is applied, so strength is not only a gear requirement here. Beyond that, decide which boots you are ending on: Gore Rider needs about 93, upgraded needs about 156.",
    dexterity: "**Enough that the one roll per press lands.** Three Tiger Strike charges carry +150% attack rating, and Cloak of Shadows cuts the target's defence, so this is not a huge number — but a Kicksin can afford to miss a kick and this build cannot afford to miss the press.",
    vitality: "Everything left. It is melee with no life bonus of its own.",
    energy: "None.",
    notes: [
      "**Every boot in the game asks for no dexterity at all** (`reqdex 0` on every row), so nothing in the damage plan asks for dexterity. What asks for it is the to-hit roll, and Tiger Strike answers most of that for free.",
      "The strength decision is the same one the Kicksin page describes and it matters slightly more here, because the boots' damage is multiplied by a larger skill percentage before anything else touches it.",
      "If you take the survival package, resistances arrive from Fade and those gear slots become attack rating.",
    ],
  },

  breakpoints: [
    {
      stat: "fhr",
      value: 48,
      frames: 5,
      priority: "required",
      why: "**Required.** A rotation with a wind-up is a rotation that can be interrupted, and being hit-stunned between the third charge and the release wastes the whole stack.",
    },
    {
      stat: "fbr",
      value: 86,
      frames: 3,
      priority: "recommended",
      why: "Worth it with the speed package, which takes Weapon Block to twenty and a block chance climbing toward 65%. Without that package this is a luxury.",
    },
    {
      stat: "fcr",
      value: 65,
      frames: 11,
      priority: "luxury",
      why: "**For Mind Blast and the buffs only.** Cast rate shortens the Assassin's `SC` animation from 16 frames to 11 and does not touch a kick.",
    },
  ],
  breakpointNotes:
    "**There is no Increased Attack Speed row, and the reason is the same one the other kick page gives, plus one that is specific to this skill.** A kick plays the `KK` animation and runs on attack speed, so the claws you are holding are an input to the same formula the affix feeds — even though the damage is the boots'. A single published percentage would therefore be wrong for most readers, because the requirement moves with both claws' base speed, with which hand they are in, and with Burst of Speed's undiminished contribution. Three rules apply and all three catch people out: **two claws use the average of both bases**, **Increased Attack Speed on the off-hand claw does not count**, and **Burst of Speed adds as much as 60% without diminishing returns** — which is why it is a twenty-point package here and worth nothing at all on the Blade Fury page. And the number this build starts from is worse than the class's: `Param4 = -40`, an attack speed reduction printed on the skill's own row, so a Dragon Tail bar begins forty percent behind a Dragon Talon bar on the same character. For a specific pair of claws, use an attack-speed calculator and give it both bases, the main hand's Increased Attack Speed only, and your Burst of Speed level.",

  gearSets: [
    {
      tier: "starter",
      goal: "Reach level 18 and the explosion. Until then this is Tiger Strike into a normal attack, which is a perfectly good way to level.",
      levelRange: [1, 30],
      nextUpgrade: "Exceptional boots the moment you are 25, and two claws with +skills.",
      slots: [
        { slot: "boots", picks: [{ label: "Any boots with a damage range on them", why: "**The boots are the weapon.** Of 217 armour rows only shields, auric shields and boots carry a damage range at all, and this is the slot the whole build is computed from. Normal boots are 3–20; exceptional are 23–80 from level 25.", lookFor: ["Any min/max damage", "Faster Run/Walk"] }] },
        { slot: "weapon", picks: [{ label: "Any claw with +skills", why: "The claw does not contribute to the kick's damage. What it contributes is `+skills`, which here is +20% kick damage per point rather than an extra kick." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "stealth" }, why: "Two runes, and the Faster Hit Recovery is what protects a rotation with a wind-up." }] },
        { slot: "helm", picks: [{ ref: { kind: "runeword", slug: "lore" }, why: "+1 skills, which is +20% on the kick." }] },
        { slot: "belt", picks: [{ label: "The largest belt you can wear", why: "Potions. This is melee with no leech until the gear plan provides it." }] },
      ],
    },
    {
      tier: "nightmare",
      goal: "The full rotation, and Venom from level 30. This is where the build becomes itself.",
      levelRange: [30, 55],
      nextUpgrade: "Treachery, and the first real boots.",
      slots: [
        { slot: "boots", picks: [{ label: "Exceptional boots with damage and resistances", why: "23–80 base at level 25, and that base is multiplied by +430% before anything else touches it.", lookFor: ["Damage range", "Resistances", "Faster Run/Walk"] }] },
        { slot: "weapon", picks: [{ label: "A claw with +3 Martial Arts", why: "Three effective levels is +60% kick damage. Charsi restocks claws on every town entry and they roll Assassin skills natively." }] },
        { slot: "offhand", picks: [{ label: "A second claw with +skills", why: "Both claws' `+skills` are read. Nothing else on the off-hand is — not its attack speed, not its procs." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "treachery" }, why: "45% Increased Attack Speed, which this build genuinely wants, and a chance to cast Fade when struck." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "vampire-gaze" }, why: "Life leech and damage reduction. Leech works from a kick." }] },
        { slot: "gloves", picks: [{ label: "Rare gloves with attack rating and life", why: "Attack rating, because there is one roll per press." }] },
        { slot: "belt", picks: [{ label: "Rare belt with life and resistances", why: "Hell's resistance penalty is coming." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "nagelring" }, why: "Attack rating and magic find." }] },
      ],
    },
    {
      tier: "early-hell",
      goal: "Survive the −100% resistance penalty and start meeting physical immunes. This is the tier where the immunity plan stops being theoretical.",
      levelRange: [55, 70],
      nextUpgrade: "Gore Rider, and a Bone Break charm if one turns up.",
      slots: [
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "**39–80 base plus 15% Crushing Blow and 10% Open Wounds.** Its 15% Deadly Strike does nothing — Deadly Strike is not applied to kick damage — and the boots are still the best in the slot by a distance, because the base damage is what the +430% multiplies." }] },
        { slot: "weapon", picks: [{ label: "A claw with +3 Dragon Tail and Increased Attack Speed", why: "The primary claw's attack speed is read and the off-hand's is not, so put the speed here and the `+skills` on both.", lookFor: ["+3 Dragon Tail", "Increased Attack Speed", "+2 Martial Arts"] }] },
        { slot: "offhand", picks: [{ label: "A second claw with +3 Martial Arts", why: "`+skills` and Weapon Block. Its own attack speed is not counted." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "duress" }, why: "15% Crushing Blow, Enhanced Damage and Faster Hit Recovery, for three mid runes.", alternatives: [{ ref: { kind: "runeword", slug: "smoke" }, why: "+50 to all resistances if the Hell penalty is the immediate problem." }] }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "vampire-gaze" }, why: "Leech and damage reduction, socketed for resistances." }] },
        { slot: "gloves", picks: [{ label: "Crafted blood gloves", why: "Life, leech and attack rating — the three things a slow melee build runs out of." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Damage reduction and life leech." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen and 150–250 attack rating. Being frozen slows an animation that is already 40% slow." }] },
        { slot: "ring2", picks: [{ label: "A rare ring with attack rating and resistances", why: "Attack rating first." }] },
        { slot: "amulet", picks: [{ label: "A rare amulet with +2 Assassin skills", why: "+2 skills is +40% kick damage." }] },
      ],
    },
    {
      tier: "budget",
      goal: "A finished Hell character. The rotation is fast enough and the explosion is large enough that the remaining work is the immunity plan.",
      levelRange: [70, 85],
      nextUpgrade: "Upgraded boots, and the sunder charm that actually matters here.",
      slots: [
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Still the item. Crushing Blow and Open Wounds are worth less here than on the Kicksin — one roll per press instead of four — and the base damage is worth more." }] },
        { slot: "weapon", picks: [{ label: "A rare or crafted claw with +3 Dragon Tail and 20% Increased Attack Speed", why: "Both halves of what the primary hand is for." }] },
        { slot: "offhand", picks: [{ label: "A second claw with +3 Martial Arts and +3 Shadow Disciplines", why: "`+skills` only. Do not pay for attack speed here — it is not read." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "duress" }, why: "Crushing Blow, damage and hit recovery." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "vampire-gaze" }, why: "Leech and damage reduction.", sockets: "Two — Um and Um, or attack rating jewels." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "draculs-grasp" }, why: "**Life Tap on striking.** It is a `domeleedamage` proc and a kick raises that event, so it fires — and on a build that makes one big hit, one Life Tap goes a long way." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Damage reduction and leech." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen and attack rating." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 skills and mana." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "highlords-wrath" }, why: "**+1 skills and 20% Increased Attack Speed.** Not for its Deadly Strike, which a kick does not use." }] },
      ],
      charms: [{ label: "Grand charms with +1 Martial Arts, and a Bone Break sunder charm", why: "**Bone Break is the sunder charm this build wants and the reason is the damage order.** It puts a physical immune at 95% physical resistance, and because the fire is derived from the physical that lands, restoring the physical restores both halves. A Flame Rift does nothing here — fire was never the blocked half." }],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders, at level 57." }],
    },
    {
      tier: "optimized",
      goal: "Upgraded boots and the full rotation speed. This is where the +430% starts multiplying a number worth multiplying.",
      levelRange: [85, 95],
      nextUpgrade: "Best-in-slot claws, and the strength to wear the elite base.",
      slots: [
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "**Upgraded to a Myrmidon Greaves base: 39–80 becomes 83–149.** That is the single largest upgrade on the page, because it roughly doubles the number the skill percentage multiplies. It costs about sixty strength." }] },
        { slot: "weapon", picks: [{ label: "Best-in-slot primary claw: +3 Dragon Tail, +3 Martial Arts, 40% Increased Attack Speed", why: "Every `+skill` is +20% kick damage, and the attack speed here is the only attack speed the game reads." }] },
        { slot: "offhand", picks: [{ label: "A second claw with the highest +skills you can find", why: "`+skills` and Weapon Block, and nothing else on this hand is read." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "chains-of-honor" }, why: "+2 skills, +65 to all resistances and 8% damage reduction. The skills are +40% kick damage." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "andariels-visage" }, why: "+2 Assassin skills, 20% Increased Attack Speed and life leech — all three of which this build uses. The −30% fire resistance is the price.", sockets: "One — a Um, or a ruby for the fire penalty." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "draculs-grasp" }, why: "Life Tap on striking, and Open Wounds on top." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 skills, which here is a damage line." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen and attack rating." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 skills." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills and +30 to all resistances." }] },
      ],
      charms: [{ label: "Annihilus, Hellfire Torch, grand charms with +1 Martial Arts, Bone Break", why: "Every `+1` is +20% kick damage, and Bone Break is what opens the areas the immunity plan closes." }],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." }],
    },
    {
      tier: "bis",
      goal: "The ceiling. Everything that raises the boots' base, the skill level, or the number of times you get to press the button.",
      levelRange: [95, 99],
      nextUpgrade: "Nothing.",
      slots: [
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Upgraded. 83–149 before a +430% skill percentage and three Tiger Strike charges." }] },
        { slot: "weapon", picks: [{ label: "Best-in-slot primary claw with +3 Dragon Tail and 40% Increased Attack Speed", why: "Skills and speed, in the only hand that is read for speed." }] },
        { slot: "offhand", picks: [{ label: "Best-in-slot off-hand claw with the highest +skills", why: "Skills and Weapon Block." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "chains-of-honor" }, why: "+2 skills, resistances, damage reduction." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "crown-of-ages" }, why: "Damage reduction, resistances and two sockets, without Andariel's fire penalty.", sockets: "Two — Um and Um, or 15% Increased Attack Speed jewels." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "draculs-grasp" }, why: "Life Tap on striking." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 skills." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen and attack rating." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 skills." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills and resistances." }] },
      ],
      charms: [{ label: "Annihilus, Hellfire Torch, +1 Martial Arts grand charms, Bone Break", why: "Skills are damage on this page, and the sunder is the only thing that opens a physical immune to either half." }],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." }],
    },
  ],

  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "**A Might mercenary, and here the aura compounds rather than adds.** Might raises physical damage, the kick is physical, and the explosion is computed from the physical damage that landed — so a percentage on the first term arrives again in the second. That is the only place on this site where a mercenary aura pays twice for the same reason. The caveat is the obvious one: against a physical immune it pays nothing twice, because both halves are zero. **Insight** is the alternative if mana is the problem, though a build that presses four buttons in fifteen seconds rarely runs dry. And if physical immunity is the recurring problem rather than an occasional one, note that a Might mercenary is also physical — the answer there is a Bone Break charm or a different area, not a different aura.",

  farming: [
    {
      area: "travincal",
      difficulty: "hell",
      why: "**The best run on the page.** Fire and lightning are the common immunities and physical is not, so the kick lands, the explosion follows it, and the Council stand close enough together that one press catches all three. Short, repeatable, and it drops the runes the gear plan wants.",
      minTier: "early-hell",
      rating: 5,
    },
    {
      area: "mausoleum",
      difficulty: "hell",
      why: "Poison and cold are the common immunities, so the kick and the explosion both land on everything — and the density is exactly what an area-of-effect finisher is for. Your Venom does nothing here, which costs less than it sounds because the other two halves are working.",
      minTier: "nightmare",
      rating: 4,
    },
    {
      area: "countess",
      difficulty: "hell",
      why: "Fire is the common immunity, not physical — and because the explosion is derived from the physical rather than replacing it, the kick still lands in full and only the detonation is dulled. The tower packs are tight enough that the radius earns its keep.",
      minTier: "nightmare",
      rating: 4,
    },
    {
      area: "andariel",
      difficulty: "hell",
      why: "Poison only, so both halves of the kick land and **your Venom does nothing at all** — the clearest demonstration on the page that the twenty points in it are an answer to a specific problem rather than free damage. A fast, repeatable fight.",
      minTier: "nightmare",
      rating: 4,
    },
    {
      area: "mephisto",
      difficulty: "hell",
      why: "Fire and lightning, so the kick lands in full. He is a single target, which is the shape this build is worst at — but three Tiger Strike charges into one Dragon Tail is still a very large hit, and the drops are the reason to come.",
      minTier: "early-hell",
      rating: 3,
    },
    {
      area: "pindleskin",
      difficulty: "hell",
      why: "Cold and poison rather than physical, one fixed superunique, and a corridor. Venom is dead weight and the kick is not.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "lower-kurast",
      difficulty: "hell",
      why: "Fire and poison are the common immunities and physical is not, so the kick lands — and the chests are the point rather than the monsters, which suits a build that clears a screen and moves on.",
      minTier: "nightmare",
      rating: 3,
    },
    {
      area: "pit",
      difficulty: "hell",
      why: "**Area level 85, and physical is one of the common immunities** — which on this page means the explosion goes too, because it is derived from the physical that landed. Bring a Bone Break charm or accept that the Venom is doing the work on those packs.",
      minTier: "optimized",
      rating: 2,
    },
    {
      area: "secret-cow-level",
      difficulty: "hell",
      why: "**Physical is the listed immunity here, and the cows come in exactly the density this skill is built for.** That is the tension: the best geometry on the list sits behind the one immunity that closes both halves. With a Bone Break charm this is one of the best runs on the page and without one it is a Venom run.",
      minTier: "optimized",
      rating: 3,
    },
  ],

  immunityPlan:
    "**Physical immunity closes this build twice, and that is the fact the page exists to publish.** Two damage types on a build normally mean two answers: resist one and the other still lands. This build lists two — physical and fire — and has one, because **the fire is computed from the physical damage the target actually suffered**. Against a monster with 100% or more physical resistance there is nothing for the explosion to be derived from, so a physical immune takes no fire either. Not less: none. This site's own census lists physical among the common immunities in eight of twenty farming areas, including the Pit, the Cow Level, the Chaos Sanctuary and the Worldstone Keep. The answers, in order of how much they help. First and best, a **Bone Break sunder charm**, which puts a physical immune at 95% physical resistance — and because the fire is derived from the physical, restoring one restores both. It is the only item in the game that reopens this build's whole damage on a physical immune, and a Flame Rift does nothing at all here, because fire was never the half that was blocked. Second, **Venom**, which is twenty points of the core for exactly this reason: poison is neither physical nor derived from it, so it is untouched. Third, **walk past**, which is correct more often than players like. And the mirror image is worth stating because it reads backwards: **a fire immune costs you only the explosion**. The kick lands in full, the single-target damage is unchanged, and what you lose is the crowd clear — so a fire-immune pack is a slow fight and a physical-immune pack is not a fight at all.",

  hardcoreNotes:
    "**Take the Fade package, and treat the wind-up as the risk.** This build's rotation has a shape — three charges, then a release — and the dangerous moment is not the release but the three swings before it, spent in melee at 40% reduced attack speed. Faster Hit Recovery is marked required for that reason: a stun between the second and third charge is a stun in the middle of a pack with nothing to show for it. Fade's curse-length reduction is the Iron Maiden answer and it matters here, though less than on a multi-hit page — one large reflected hit is survivable in a way that seven small ones stacked into a second are not. Weapon Block needs two claws, which this build is holding anyway. And the specific Hardcore trap on this page is the Chaos Sanctuary: it lists physical among its common immunities, so the build is weak there *and* it is the room where Iron Maiden lives. There is very little reason to be in it.",

  selfFoundNotes:
    "**Self-found friendly for the same reason the Kicksin is: the damage item is a boot.** Gore Rider is a common unique on an exceptional base, and everything that multiplies it — Dragon Tail's own +430% and three Tiger Strike charges — is skill points rather than drops. Claws come from the Act 1 vendor, restock every time you enter town, and roll Assassin skills natively, so the `+skills` half of the plan is shopping rather than farming. Nothing in the first four tiers is a runeword above four runes: Stealth, Lore, Treachery, Smoke, Duress. **The one genuinely hard item is the sunder charm**, which is Terror Zone drop-gated, and the honest note is that the build is complete without it and simply farms a shorter list of areas.",

  levelingPath: {
    summary:
      "**Tiger Strike exists at level 1 and Dragon Tail at 18, so the first act is the rotation with the second half missing.** Charging and then swinging normally is a real levelling plan: the generic Attack row carries `finishing = 1` just as the three kicks do, so an ordinary swing releases the charges and takes the multiplier with it. Dragon Claw arrives on the way as a prerequisite and is a perfectly good level-12 skill in its own right. From 18 the build is itself, and the boots do the rest: normal boots are 3–20, exceptional 23–80 at level 25, elite 50–149 from 45. Venom lands at 30 and is worth a point the moment it does.",
    respecAt:
      "None required. If you have spent points on Claw Mastery expecting them to raise the kick, that is the one respec this page would justify.",
    viaBuild: "kicksin",
  },

  confidence: "verified",
  complete: true,
};
