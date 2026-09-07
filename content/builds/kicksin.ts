import type { Build } from "@/lib/types";

/**
 * The Kicksin.
 *
 * THE ONE FACT THE WHOLE PAGE HANGS ON
 * ------------------------------------
 * A kick does not use the weapon. Dragon Talon carries `Kick = 1`, `weapsel = 4`
 * and **no `SrcDam` column at all**, and `SrcDam` is the column that gives a
 * skill a share of weapon damage — it is 128 on Attack, Zeal, Whirlwind, Fend,
 * Frenzy, Berserk, Jab, Strafe, Tiger Strike, Cobra Strike and, in the same row
 * of the same tree, Dragon Claw. Its absence is not an omission.
 *
 * What `weapsel = 4` points at is visible in two other places. It appears on
 * exactly four character skills: Smite — whose `itypea1 = "shld"` and whose
 * damage is the shield's — and the three kicks. And of 217 rows in `armor.json`,
 * the only ones carrying `mindam`/`maxdam` are shields, auric shields and
 * **boots**. Armour damage columns exist for precisely those two attacks.
 *
 * So: **the boots are the weapon.** The claws in her hands contribute their
 * +skills and nothing else to a kick.
 *
 * WHICH MAKES UPGRADING BOOTS THE LARGEST SINGLE UPGRADE ON THE PAGE
 * -----------------------------------------------------------------
 *   Gore Rider    War Boots `xhb`       39-80   ->  Myrmidon Greaves `uhb`  83-149
 *   War Traveler  Battle Boots `xtb`    37-64   ->  Mirrored Boots   `utb`  50-145
 *   Silkweave     Mesh Boots `xmb`      23-52   ->  Boneweave Boots  `umb`  69-118
 *
 * Roughly double the base, on the item the damage comes from. Nothing else in
 * the gear plan moves a number that far.
 *
 * KICK COUNT IS THE OTHER HALF, AND IT IS BOUGHT WITH +SKILLS
 * ----------------------------------------------------------
 * `calc1 = "lvl/6+1"`, and `lvl` is the *effective* level — the distinction the
 * file itself draws, since Death Sentry's row uses `lvl` beside
 * `skill('Fire Trauma'.blvl)` for its own two numbers. So kicks step at
 * effective level 6, 12, 18, 24, 30, 36, 42, 48: four kicks at twenty hard
 * points, five at +4 skills, six at +10, seven at +16. **+skills are kicks**,
 * they are worth stepping over a breakpoint for, and worth nothing between one.
 *
 * CLAW MASTERY IS A DRAGON CLAW SKILL, NOT A DRAGON TALON ONE
 * -----------------------------------------------------------
 * Dragon Claw's damage is `calc1 = ln12 + skill('Claw Mastery'.blvl) * par7`
 * with `par7 = 4` — an explicit Claw Mastery term written into the formula.
 * **Dragon Talon's `calc1` is `lvl/6+1` and names nothing.** Claw Mastery's own
 * row is `passive = 1` with `passiveitype = "h2h"`, and a kick is not an h2h
 * weapon attack, so the passive has nothing to attach to.
 *
 * Cycle 4 shipped this as "not determinable here" and spent one point on the
 * strength of the asymmetry alone. It is determinable, and the answer is the
 * same: the D2library mechanics reference states it outright — "**Deadly Strike
 * and/or Claw Mastery are not applied to kick damage**". Two independent
 * routes, one conclusion. One point, because Burst of Speed and Weapon Block
 * require it, and not one more.
 *
 * DRAGON TALON HAS NO SYNERGIES IN EITHER DIRECTION
 * -------------------------------------------------
 * Nothing in `skills.json` names Dragon Talon as a synergy source, and its own
 * row carries no synergy column. The only reference to it anywhere is Dragon
 * Claw's `reqskill1`. That is why the core is 74 rather than 90: there is no
 * synergy to buy, so the points go to what the kicks are delivered *through*.
 *
 * WHAT THE KICKS CARRY — AND THE LIST IS NOT THE ONE YOU WOULD GUESS
 * ------------------------------------------------------------------
 * `item_crushingblow` and `item_openwounds` both fire on `itemevent1 =
 * "domeleedamage"` — a per-hit event, not a per-activation one, which is why
 * this build's listed damage bears no relation to what it does to a boss.
 * How many `domeleedamage` events one Dragon Talon activation emits is engine
 * behaviour and not in any table; the site does not multiply a number by it.
 *
 * What travels with a kick and what does not is settled, and it splits in a
 * place most gear advice does not look. The damage order has two separate
 * steps: **plain min/max damage from equipment**, and later **elemental damage
 * from skills and equipment**. Kicks are excluded from the first and not from
 * the second.
 *
 *   travels   Crushing Blow · Open Wounds · life and mana leech
 *             elemental damage from equipment · magic damage
 *             poison damage · Venom · Prevent Monster Heal
 *             blind / flee / freeze / slow on hit
 *             **chance to cast on striking and on attack**
 *   does not  Deadly Strike · Claw Mastery
 *             + minimum and maximum PHYSICAL damage from equipment
 *             anything at all on the **off-hand** claw
 *
 * The last line is the one that changes a gear plan: the secondary claw is read
 * for `+skills` and defence and for nothing else — not its Increased Attack
 * Speed, not its procs, not its Crushing Blow.
 *
 * CRUSHING BLOW'S ACTUAL SIZE
 * ---------------------------
 * Cycle 4 published that this was unavailable. It is available, and it is the
 * number this build lives on: a Crushing Blow removes
 * **100 / (2 × (players + 1)) percent of the monster's *current* life**, taken
 * from its single-player life pool even in a full game — so 25% at players 1,
 * 12.5% at players 3, 6.25% at players 7. **Halved against champions and
 * bosses**, halved again if the hit was ranged, and a tenth against objects.
 * The chance is uncapped and additive, but over 100% buys nothing. And
 * positive physical resistance cuts the damage, so a physical immune takes
 * none of it — which is the wall this page already names.
 *
 * VENOM DOES NOT MULTIPLY WITH KICKS
 * ----------------------------------
 * `aurastat3 = skill_poison_override_length` with `ELen = 10`. It *overrides*
 * the poison timer to four tenths of a second rather than adding to it, so more
 * kicks per second buy uptime, not magnitude. This is the same fact the class
 * foundation publishes and the reason Venom is worth twenty points here and
 * would not be worth twenty on a slower attack.
 *
 * FADE AND BURST OF SPEED — NOW A COLUMN, NOT A BEHAVIOUR
 * -------------------------------------------------------
 * Cycle 4 published this claim as resting "on behaviour, not on a column",
 * because `states.txt` was outside the extraction. It is inside it now.
 * `fade` and `quickness` are the **only two members of `group = 2`**, and
 * `group` is the column that makes states exclude each other — the control
 * being `group = 1`, which holds exactly the Sorceress armours. `venomclaws`
 * carries no group at all, which is why Venom stacks with either of them.
 *
 * WHAT IS NOT ESTABLISHED, AND IS NOT PUBLISHED
 * ---------------------------------------------
 * - Whether each of N kicks is its own `domeleedamage` event. Every kick rolls
 *   its own to-hit check, and Crushing Blow is checked per hit, so the page
 *   speaks of per-kick rolls — but the count of events per activation is not
 *   in a table and no number here is multiplied by it.
 * - Whether Always Hit (`Param8 = 1`, "enabled only when Charges are consumed")
 *   covers every kick of an activation or only the one that spends the charge.
 */
export const kicksin: Build = {
  slug: "kicksin",
  name: "Kicksin",
  classSlug: "assassin",
  summary:
    "Dragon Talon kicks four to seven times per press, and every kick rolls Crushing Blow separately. The damage is in the boots, not the claws — which is why this build hunts footwear.",
  damageTypes: ["physical", "poison", "fire", "lightning"],
  primarySkill: "dragon-talon",
  playstyle:
    "You walk up and press one button, and the button kicks four times — five, six or seven once your +skills are high enough. Each kick is a separate hit that rolls Crushing Blow, Open Wounds and life leech on its own, so a boss with a large health bar falls to a build whose listed damage looks unimpressive next to a Sorceress's. Venom runs the whole time and rides every one of those kicks. The rest of the plan is about being allowed to stand there: Weapon Block at twenty gives a block chance with two claws and no shield, Burst of Speed makes the kicks faster, and one point in Death Sentry turns the first corpse into the rest of the room. What you do not do is hit a physically immune monster, because the kicks are physical and there is no version of this build where that is not true.",
  strengths: [
    "**Every kick rolls Crushing Blow separately**, so this is the best boss-killer on the class and the reason it is the Uber build",
    "Each of those rolls takes **a quarter of the monster's current life** at players 1 — halved on a boss, and halved by every step up the player count — which is why the character sheet number is beside the point",
    "**Elemental and magic damage from your gear rides the kick.** Physical damage adds do not, and the two are different steps of the damage order — so a weapon whose damage is fire or magic is not the dead slot it looks like",
    "**Open Wounds cannot be resisted**, so it is the one line on the gear plan that a physical immune has no answer to — as long as something else has already drawn blood",
    "**The damage is in the boots**, which are cheap, and upgrading them roughly doubles it — the largest single upgrade on any Assassin page",
    "+skills buy whole extra kicks at effective level 6, 12, 18, 24, 30, 36, 42 and 48",
    "Weapon Block gives a real block chance with two claws and no shield at all",
    "Venom rides every kick, and a build that kicks this often is the one that gets the most out of a poison that does not stack",
    "Boots have **no dexterity requirement at all** — every one of them is `reqdex 0` — so the attribute plan is strength and vitality",
  ],
  weaknesses: [
    "**Physical immunity is a wall, and Crushing Blow does not get through it either** — it is physical damage like the rest of the kick",
    "**Deadly Strike does nothing on a kicker.** It is on two of the build's own signature items and it is not applied to kick damage, so do not shop for more of it",
    "**Nothing on the off-hand claw is read for special events** — not its procs, not its Crushing Blow, not its attack speed. That hand is `+skills` and defence only",
    "Eight of this site's twenty farming areas list physical among their common immunities, including the Pit, the Cow Level and the Chaos Sanctuary",
    "**Iron Maiden.** A seven-kick activation against a reflected-damage curse is the fastest way to kill yourself on this site",
    "It is melee with no life bonus, no innate leech until the gear plan provides it, and no ranged option at all",
    "Clear speed is ordinary. This build kills one thing very fast and a room at walking pace, which is the opposite of its trap siblings",
    "The listed damage number is close to meaningless, because the build's output is per-hit procs rather than the number on the character sheet",
  ],
  difficulty: "moderate",
  budget: "medium",
  ratings: {
    clearSpeed: 3,
    bossing: 5,
    survivability: 4,
    magicFind: 2,
    terrorZones: 3,
    ubers: 5,
    soloSelfFound: 3,
    players8: 3,
  },

  skills: [
    {
      skill: "dragon-talon",
      points: 20,
      role: "main",
      order: 1,
      note: "**Twenty hard points is four kicks and +138% kick damage** (`5 + 7 per level`), and the kick count comes off the *effective* level, so every +skill above twenty is working toward a fifth kick at 24 and a sixth at 30. It has no synergy in either direction — nothing in the file feeds it — so twenty is the whole investment and the rest of the page is about delivery.",
    },
    {
      skill: "venom",
      points: 20,
      role: "main",
      order: 2,
      note: "**The second damage source, and the one that answers a physical immune.** It writes poison damage onto you as a character stat, so it rides the kicks rather than the claws. Its length is `ELen = 10` under `skill_poison_override_length` — four tenths of a second, *overriding* rather than stacking — so a build that kicks seven times a second is the one that keeps it up rather than the one that multiplies it.",
    },
    {
      skill: "weapon-block",
      points: 20,
      role: "utility",
      order: 3,
      note: "**20% at one point, 65% at twenty**, with two claws and no shield. This is why a melee Assassin can stand where this build stands, and it is the reason the claws stay in her hands at all when they contribute nothing to the kick.",
    },
    {
      skill: "tiger-strike",
      points: 1,
      role: "utility",
      note: "**A charge-up, not an attack.** Three charges multiply the damage of the kick that spends them, and while it spends them `Param8 = 1` makes the kick unable to miss. One point is enough to have it; see the packages for the case for twenty.",
    },
    { skill: "fire-blast", points: 1, role: "prerequisite", note: "The Traps tree's only level-1 skill, and the first of four points on the way to Death Sentry." },
    { skill: "shock-web", points: 1, role: "prerequisite", note: "Second of the four." },
    { skill: "charged-bolt-sentry", points: 1, role: "prerequisite", note: "Third of the four." },
    { skill: "lightning-sentry", points: 1, role: "prerequisite", note: "Fourth. Also Death Sentry's only synergy, which is what the first package is built on." },
    {
      skill: "death-sentry",
      points: 1,
      role: "utility",
      note: "**One point buys the entire corpse explosion.** It is 40–80% of the dead monster's *base* life at every level, half fire and half physical, and it does not scale with skill level at all — levels buy radius and the lightning half. Five points total to reach it, and it is what turns a single-target build into one that clears a room.",
    },
    { skill: "claw-mastery", points: 1, role: "prerequisite", note: "**One point, and deliberately one.** Dragon Claw's damage formula names Claw Mastery explicitly; Dragon Talon's names nothing. It is here because Burst of Speed and Weapon Block require it." },
    { skill: "psychic-hammer", points: 1, role: "prerequisite", note: "Cloak of Shadows' prerequisite." },
    { skill: "burst-of-speed", points: 1, role: "utility", note: "Attack speed, which on this build is kicks per second. One point now; the third package takes it to twenty." },
    { skill: "cloak-of-shadows", points: 1, role: "utility", note: "Blinds the room and strips its defence. The opener for a build that has to arrive in melee." },
    { skill: "fade", points: 1, role: "utility", note: "Resistances, curse length and physical damage reduction. The curse line is the Iron Maiden answer; see the second package." },
    { skill: "shadow-warrior", points: 1, role: "prerequisite", note: "Shadow Master's prerequisite, and replaced by it." },
    { skill: "mind-blast", points: 1, role: "utility", note: "Stun, and the only skill here that Faster Cast Rate does anything for." },
    { skill: "shadow-master", points: 1, role: "utility", note: "A second body for the pack to hit while you kick one thing to death." },
  ],

  skillPackages: [
    {
      id: "the-last-thirty-six",
      name: "The thirty-six points a synergy-free build leaves over",
      choose: "one",
      intro:
        "The core above is 74 of 110, and it is unusually small for a reason: **Dragon Talon has no synergies in either direction**, so there is nothing to buy that raises the kick beyond the twenty points already in it. Thirty-six are left — a third of the character — and they go to what the kicks are delivered through rather than to the kicks. **Take exactly one.** Each costs exactly thirty-six and the plan closes at 110 whichever you take.",
      packages: [
        {
          id: "death-sentry",
          name: "Death Sentry and Lightning Sentry",
          when: "**The default.** Take it unless you are building specifically for Uber Tristram, where there is very little to explode.",
          tradeoff:
            "It spends a third of the character outside the kick entirely, and the sentry competes for nothing you were using — but it also does nothing for a boss standing alone in a room, which is the fight this build is otherwise best at.",
          skills: [
            {
              skill: "death-sentry",
              points: 20,
              role: "main",
              order: 1,
              note: "Nineteen on top of the core's one. **They do not raise the corpse explosion**, which is a flat 40–80% of the dead monster's base life at every level. What they buy is radius — half a yard per level from a base of five — and the lightning half of the skill.",
            },
            {
              skill: "lightning-sentry",
              points: 18,
              role: "synergy",
              order: 2,
              note: "**Death Sentry's only synergy, at 12% per hard point.** Seventeen more points is +204% on the lightning half, which is what kills the first monster so the corpse chain has something to start on.",
            },
          ],
          rotationNote:
            "Kick one thing to death, drop a Death Sentry on the corpse, and kick the next while the room comes apart. The sentry is the clear speed this build otherwise does not have.",
          gearNote: "Nothing changes. Thirty-six skill points buying a clear-speed answer that no gear slot has to pay for.",
          statNote: "No change.",
          contentNote: "Hell Terror Zones, the Mausoleum, Travincal, and anywhere the problem is a room rather than one monster.",
        },
        {
          id: "tiger-strike",
          name: "Tiger Strike and Fade",
          when: "**Uber Tristram, and any boss you intend to kill on purpose.** Also the Hardcore answer.",
          tradeoff:
            "It gives up the corpse chain entirely, so clear speed stays at walking pace, and it costs you Burst of Speed — Fade and Burst of Speed cannot both be up, so the kicks get slower in exchange for surviving what they are kicking.",
          skills: [
            {
              skill: "tiger-strike",
              points: 20,
              role: "main",
              order: 1,
              note: "**A multiplier on the kick that spends the charges, and the largest one available to this build.** Three charges before a Dragon Talon is the whole Uber rotation. It also makes that kick unable to miss while it is spending them — `Param8 = 1`, \"Always Hit ... enabled only when Charges are consumed\".",
            },
            {
              skill: "fade",
              points: 18,
              role: "utility",
              order: 2,
              note: "**Curse length cut by up to 90%, and that is the line that matters here rather than the resistances.** Iron Maiden reflects a share of the damage you deal, and nothing on this site deals damage in as many separate instalments as a seven-kick Dragon Talon. Seventeen points cuts how long it sticks to you.",
            },
          ],
          rotationNote:
            "Tiger Strike three times, then Dragon Talon. The three charges stand for fifteen seconds, so they survive the walk between the door and the boss.",
          gearNote:
            "Fade is resistance you stop buying on rings and charms, so those slots go to Crushing Blow, attack speed and +skills instead.",
          statNote: "No change.",
          contentNote: "Uber Tristram, the Ancients, and Hardcore generally.",
        },
        {
          id: "burst-of-speed",
          name: "Burst of Speed and Shadow Master",
          when: "When the kicks are already killing things and the problem is how long it takes to reach them.",
          tradeoff:
            "It costs you Fade, and therefore the Iron Maiden mitigation, which makes the Chaos Sanctuary a place you visit rather than farm. It also buys no damage at all — every point is speed or a body.",
          skills: [
            {
              skill: "burst-of-speed",
              points: 20,
              role: "main",
              order: 1,
              note: "**Up to 60% attack speed, undiminished, and up to 70% run speed.** Attack speed is kicks per second, and undiminished means it is worth far more than the same number on an item.",
            },
            {
              skill: "shadow-master",
              points: 18,
              role: "utility",
              order: 2,
              note: "**Resistances climbing toward 90% and +15% life per level.** A melee build's real problem is being the only target; this is the point at which the Shadow Master stops dying instantly and starts holding a pack.",
            },
          ],
          rotationNote: "Buff, then walk in faster than the pack expects. You are trading the corpse chain for arriving first.",
          gearNote: "Faster run/walk on the boots stops mattering, so Gore Rider's case gets stronger against War Traveler's.",
          statNote: "No change.",
          contentNote: "Terror Zone clearing, Travincal runs on a timer, and anywhere the walk is the cost.",
        },
      ],
    },
  ],

  flexPoints: [
    "There are none. Seventy-four in the core, thirty-six in exactly one package, and 110 is the total a level-99 character with every quest reward has.",
    "**Do not spend the thirty-six on Claw Mastery.** It is the most commonly recommended sink for them and the page's own header explains why it is not here: Dragon Claw's damage formula names Claw Mastery and Dragon Talon's does not.",
    "**Do not spend them on Dragon Tail either.** It is a different build — its row carries a −40% attack speed penalty, which is the opposite of what a kick-count build wants.",
  ],

  stats: {
    strength: "**This is where the attribute points go, and boots are why.** Gore Rider needs 93 effective strength; upgraded to Myrmidon Greaves it needs about 156, and Shadow Dancer about 166. Decide which boots you are ending on before you spend, because the difference is sixty points.",
    dexterity: "Enough for your claws, and no more. **Every boot in the game asks for no dexterity at all** — `reqdex 0` on every row — so the damage item on this build wants nothing from this attribute. Block comes from Weapon Block, which is a skill and not a stat.",
    vitality: "Everything left. It is a melee build with no life bonus of its own.",
    energy: "None.",
    notes: [
      "**The strength number is a decision, not a formula.** Ending on upgraded Gore Riders costs roughly sixty more strength than ending on un-upgraded ones, and those sixty points are life you do not have. Upgrade only if you can reach it without gutting vitality.",
      "Dexterity for block is the wrong instinct here and would be right on almost any other melee build. Weapon Block replaces it entirely.",
      "If you take the Tiger Strike package, resistances arrive from Fade rather than from gear, and the points that would have chased a resistance requirement go to vitality.",
    ],
  },

  breakpoints: [
    {
      stat: "fcr",
      value: 65,
      frames: 11,
      priority: "luxury",
      why: "**For Mind Blast and the buffs, and for nothing you attack with.** Cast rate shortens the Assassin's `SC` animation from 16 frames to 11. It does not touch a kick. Luxury rather than recommended, because this build presses one cast button between fights and none during them.",
    },
    {
      stat: "fhr",
      value: 48,
      frames: 5,
      priority: "required",
      why: "**Required, because this build's whole method is standing next to the thing.** Being hit-stunned mid-activation costs you the rest of the kicks, and the kicks are the damage.",
    },
    {
      stat: "fbr",
      value: 86,
      frames: 3,
      priority: "recommended",
      why: "Weapon Block at twenty gives a block chance climbing toward its 65% ceiling, and a block you recover from slowly is a block that still cost you the fight. This is the breakpoint that makes those twenty points pay.",
    },
  ],
  breakpointNotes:
    "**Kicks run on attack speed, and there is no Increased Attack Speed row above because a single number would be wrong for most readers.** Dragon Talon plays the `KK` animation, which is on the attack-speed calculation — so the claws' own base speed is an input to the same formula the affix feeds, even though the damage itself is the boots'. That is the part that catches people out: **the claws you hold change how fast you kick, and the boots decide how hard.** The same three rules apply as everywhere else on this class: two claws use the average of both bases, Increased Attack Speed on the off-hand claw does not count, and Burst of Speed adds as much as 60% undiminished — which is what the third package is buying, and what the Fade package gives up. Being chilled lengthens the animation, so Cannot Be Frozen is a speed stat here. **Faster Cast Rate does nothing for any of this**, which is why its row above is marked luxury rather than left out: leaving it out invites the reader to assume it was an oversight.",

  gearSets: [
    {
      tier: "starter",
      goal: "Get to Nightmare with a kick that works. Boots are the weapon, so any boots with damage on them beat any boots without.",
      levelRange: [1, 30],
      nextUpgrade: "Exceptional boots the moment you are 25, and two claws with +skills.",
      slots: [
        { slot: "weapon", picks: [{ label: "Any claw with +2 to Martial Arts or +3 to Dragon Talon", why: "**It does nothing for the kick's damage and everything for the kick count.** +skills raise the effective level that `lvl/6+1` reads.", lookFor: ["+3 to Dragon Talon", "+2 to Martial Arts", "Increased Attack Speed"] }] },
        { slot: "offhand", picks: [{ label: "A second claw, for Weapon Block", why: "**Weapon Block needs a claw in both hands** — its row is `itypea1 = h2h` and `itypeb1 = h2h`. A second claw is not optional on this build." }] },
        { slot: "helm", picks: [{ ref: { kind: "runeword", slug: "lore" }, why: "+1 to all skills for two runes, which is progress toward a kick breakpoint." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "stealth" }, why: "Faster hit recovery, on a build that is going to be hit." }] },
        { slot: "gloves", picks: [{ label: "Any gloves with Increased Attack Speed", why: "Attack speed is kicks per second." }] },
        { slot: "belt", picks: [{ label: "Any belt with life and resistances", why: "Four rows." }] },
        { slot: "boots", picks: [{ label: "The highest-damage boots you can wear — Greaves over Chain Boots over Boots", why: "**This is the weapon slot on this build.** Greaves are 10–20 where plain Boots are 3–8, and that difference is your damage, not your defence.", lookFor: ["Any damage at all", "Faster run/walk", "Resistances"] }] },
        { slot: "ring1", picks: [{ label: "Any ring with life or resistances", why: "Nothing clever yet." }] },
        { slot: "ring2", picks: [{ label: "Any ring with life or resistances", why: "Same." }] },
        { slot: "amulet", picks: [{ label: "Any amulet with +Assassin skills", why: "+skills are kicks." }] },
      ],
    },
    {
      tier: "nightmare",
      goal: "Exceptional boots, and the first real Crushing Blow. This is where the build starts doing what it is for.",
      levelRange: [30, 55],
      nextUpgrade: "Gore Rider, and Treachery for the attack speed.",
      slots: [
        { slot: "weapon", picks: [{ label: "A claw with +2 Martial Arts and Increased Attack Speed", why: "Skills for the kick count, speed for the rate. The claw's damage is irrelevant and you can ignore it entirely.", lookFor: ["+2 to Martial Arts", "+3 to Dragon Talon", "Increased Attack Speed"] }] },
        { slot: "offhand", picks: [{ label: "A second claw with +skills", why: "Weapon Block needs it, and its +skills count toward the kick breakpoints even though its attack speed does not count toward the frames." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "tarnhelm" }, why: "+1 skills and magic find." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "treachery" }, why: "**45% Increased Attack Speed and a Fade proc when struck.** The attack speed is kicks and the Fade is resistance you did not have to buy.", alternatives: [{ ref: { kind: "runeword", slug: "smoke" }, why: "+50 resistances for two runes if the Lem has not appeared." }] }] },
        { slot: "gloves", picks: [{ label: "Rare or crafted gloves with 20% Increased Attack Speed", why: "Twenty percent is the whole slot." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Physical damage reduction and life leech, which is what a melee character in Nightmare is short of." }] },
        { slot: "boots", picks: [{ label: "Exceptional boots with damage — War Boots or Battle Boots base", why: "**War Boots are 39–80 where Greaves were 10–20.** Stepping from normal to exceptional roughly quadruples the kick's base, and it happens at level 25.", lookFor: ["War Boots or Battle Boots base", "Crushing Blow", "Faster run/walk"] }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen — being chilled lengthens the kick animation — plus attack rating, which a kick does use." }] },
        { slot: "ring2", picks: [{ label: "A rare ring with leech, life and resistances", why: "Leech per hit, on a build that hits four times a press." }] },
        { slot: "amulet", picks: [{ label: "+2 Assassin skills or +3 Martial Arts", why: "Kick count again." }] },
      ],
    },
    {
      tier: "early-hell",
      goal: "Gore Rider, and the Crushing Blow stack that makes this build a boss killer.",
      levelRange: [55, 70],
      nextUpgrade: "Upgraded Gore Riders if the strength is affordable, and a second source of Crushing Blow.",
      slots: [
        { slot: "weapon", picks: [{ label: "A claw with +3 Dragon Talon and Increased Attack Speed", why: "+3 Dragon Talon is half a kick breakpoint on its own.", lookFor: ["+3 to Dragon Talon", "+2 to Martial Arts", "Increased Attack Speed"] }] },
        { slot: "offhand", picks: [{ label: "A second claw with +3 Dragon Talon", why: "Both claws' +skills count toward the effective level, so the off-hand is a kick-count slot even though its attack speed is ignored." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "vampire-gaze" }, why: "Physical damage reduction and life stolen per hit — both of which a build that stands in melee and hits repeatedly is the best possible user of." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "treachery" }, why: "Still 45% attack speed, still a free Fade." }, { ref: { kind: "runeword", slug: "duress" }, why: "**15% Crushing Blow on the armour**, which stacks with the boots and applies per kick." }] },
        { slot: "gloves", picks: [{ label: "Crafted or rare gloves with 20% Increased Attack Speed and leech", why: "Attack speed and leech. **Dracul's Grasp is the upgrade and needs level 76**, which is a tier away." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Physical damage reduction is what keeps a melee Assassin alive in Hell." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "**The build's item.** 15% Crushing Blow and 10% Open Wounds, on the slot the damage already comes from, and every kick rolls both separately. Its 15% Deadly Strike is the one line here that does nothing — **Deadly Strike is not applied to kick damage**, on any item, and this page would rather tell you that than let you go shopping for more of it. There is nothing to roll for: the affixes are fixed. The question this slot asks is whether you can afford the strength to upgrade the base later.", lookFor: ["A War Boots base", "Strength for the upgrade"] }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen and attack rating." }] },
        { slot: "ring2", picks: [{ label: "A rare ring with leech and resistances", why: "The Hell resistance tax." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills and +30 resistances, which is both problems in one slot." }] },
      ],
      charms: [{ label: "Martial Arts skillers, and life/resistance small charms", why: "A skiller is progress toward the next kick breakpoint. Between breakpoints it buys damage percentage; at one, it buys a whole extra hit." }],
    },
    {
      tier: "budget",
      goal: "A finished Hell character. Crushing Blow from two slots, Weapon Block at sixty-five percent, and enough resistance to stand still.",
      levelRange: [70, 85],
      nextUpgrade: "Upgraded boots, and the decision about whether to hold a polearm instead of claws.",
      slots: [
        { slot: "weapon", picks: [{ label: "A rare claw with +3 Dragon Talon, +2 Martial Arts and 20% Increased Attack Speed", why: "The claw is a +skills and speed item on this build. Its own damage never enters the kick.", lookFor: ["+3 to Dragon Talon", "+2 to Martial Arts", "20% Increased Attack Speed", "A Runic Talons base"] }] },
        { slot: "offhand", picks: [{ label: "A second rare claw with +3 Dragon Talon", why: "Weapon Block requires it and the +skills count." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "vampire-gaze" }, why: "Damage reduction and leech." }, { ref: { kind: "unique", slug: "andariels-visage" }, why: "**+2 Assassin skills, 20% Increased Attack Speed and +8-10% life stolen per hit**, at the cost of −30% fire resistance. On a build that hits this often the leech line is enormous." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "duress" }, why: "15% Crushing Blow, and cheap." }, { ref: { kind: "runeword", slug: "chains-of-honor" }, why: "+2 skills, +65 resistances and 8% damage reduction, if the runes exist." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "draculs-grasp" }, why: "**Life Tap on striking, on a build that strikes four to seven times per press.** Nothing else in the slot comes close for a melee Assassin." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Physical damage reduction." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow and Open Wounds, per kick. Its Deadly Strike does nothing on a kicker.", sockets: "None — these are not socketable and do not want to be." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 skills and the mana to keep kicking." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "highlords-wrath" }, why: "+1 skills — which is kick count — and 20% Increased Attack Speed. **Not** for its Deadly Strike, which a kick does not use; two of this build's levers in one slot, not three." }] },
      ],
      charms: [{ label: "Martial Arts skillers, Annihilus, Hellfire Torch", why: "The Torch alone is +3 Assassin skills, which is half a kick breakpoint." }],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders, on a claw. Level 57, so it has been available for a while by here." }],
    },
    {
      tier: "optimized",
      goal: "Upgraded boots, maximum Crushing Blow, and the Uber setup. This is the tier where the strength decision from the attribute plan gets paid.",
      levelRange: [85, 99],
      nextUpgrade: "Best-in-slot claws, and the Riftsin experiment if you want to run it.",
      slots: [
        {
          slot: "weapon",
          picks: [
            { label: "A rare or crafted Runic Talons with +3 Dragon Talon, +2 Martial Arts and 20% Increased Attack Speed", why: "Still a +skills item. There is no claw upgrade that raises kick damage, only ones that raise kick count and rate.", lookFor: ["+3 to Dragon Talon", "+2 to Martial Arts", "20% Increased Attack Speed"] },
            {
              label: "Rift, in a 4-socket polearm or scepter — the \"Riftsin\" variant",
              why: "**A gear variant of this build rather than a build of its own, and cycle 4's two caveats have both been answered — one for it, one against the page.** Because a kick takes nothing from the weapon's *physical* damage, holding a polearm costs the kick nothing, which is why the variant exists at all. **The proc works.** Trigger events are on the short list of things a kick carries, alongside Crushing Blow and Open Wounds, so Rift's `hit-skill` — 20% to cast level 16 Tornado — fires from kicks, and it fires from the **primary** weapon, which a Rift held alone is. **And this page had the other half backwards.** Its 160–250 magic and 60–180 fire are *not* the physical min/max adds that kicks skip; they are elemental and magic damage, which the damage order applies at a later step that kicks are not excluded from. They transfer. They are the largest thing Rift gives a kicker, and the page previously told you they were worthless. What the swap genuinely costs is **Weapon Block**, whose row requires a claw in both hands, and both claws' +skills, which can be a whole kick — pay that only if you have counted the kick you are losing. Voulge or Bill are the cheap 4-socket bases, both `reqdex 0`.",
              sockets: "Hel, Ko, Lem, Gul, in that order, into a 4-socket polearm or scepter.",
              tradeOnly: false,
            },
          ],
        },
        { slot: "offhand", picks: [{ label: "A second Runic Talons with +3 Dragon Talon", why: "Weapon Block and kick count. Empty if you are running the Rift variant, which is most of what that variant costs." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "andariels-visage" }, why: "+2 Assassin skills, 20% attack speed and life stolen per hit." }, { ref: { kind: "unique", slug: "crown-of-ages" }, why: "Damage reduction and two sockets, if the fire resistance penalty is the problem." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "chains-of-honor" }, why: "+2 skills, +65 resistances, 8% damage reduction." }, { ref: { kind: "runeword", slug: "fortitude" }, why: "The defence and life if you would rather not chase resistances." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "draculs-grasp" }, why: "Life Tap on striking." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Physical damage reduction." }, { ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 skills, if resistances are already handled." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "**Upgraded to a Myrmidon Greaves base, which takes 39–80 to 83–149.** That is roughly double the number the whole build is computed from, and it costs about sixty strength. It is the single largest upgrade on this page." }, { ref: { kind: "unique", slug: "sandstorm-trek" }, why: "If the strength for upgraded Gore Riders would cost too much vitality: already an elite base at 60–110, with far better attributes." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen and attack rating." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 skills." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "highlords-wrath" }, why: "+1 skills and attack speed. The Deadly Strike is dead weight here and the slot is still worth it." }] },
      ],
      charms: [{ label: "Martial Arts skillers, Annihilus, Hellfire Torch", why: "Count the total and check it against the kick table: effective 24, 30, 36 and 42 are where a charm becomes a kick." }],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." }],
    },
    {
      tier: "bis",
      goal: "The Uber killer. Every source of Crushing Blow, upgraded boots, and enough +skills for seven kicks.",
      levelRange: [90, 99],
      nextUpgrade: "Nothing. This is the build that kills the things other builds cannot.",
      slots: [
        { slot: "weapon", picks: [{ label: "A crafted Runic Talons with +3 Dragon Talon, +3 Martial Arts and 20% Increased Attack Speed", why: "Six effective levels from one item is a whole kick." }] },
        { slot: "offhand", picks: [{ label: "A second crafted Runic Talons with +3 Dragon Talon", why: "Kick count, and Weapon Block at sixty-five percent." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "andariels-visage" }, why: "Socketed with a Ral to answer its own fire penalty. +2 skills, attack speed and leech." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "chains-of-honor" }, why: "+2 skills, resistances and damage reduction." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "draculs-grasp" }, why: "Life Tap on striking, which against an Uber is the difference between the fight being survivable and not." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Physical damage reduction." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Upgraded. 83–149 base, plus Crushing Blow and Open Wounds per kick." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 skills." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "highlords-wrath" }, why: "+1 skills and attack speed." }] },
      ],
      charms: [{ label: "Annihilus, Hellfire Torch, Martial Arts skillers with life", why: "+skills to the next kick breakpoint, then life with everything after it." }],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders before every Uber portal." }],
    },
  ],

  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "**Might, and it is not close.** The mercenary's aura raises the physical damage of every kick, and physical damage is what this build is. Holy Freeze is the usual melee answer elsewhere and is worse here: chilling a boss does nothing for a build whose problem was never that the boss moved. Give him Insight until leech is sorted, then Fortitude or an Infinity if one exists — although **Infinity's Conviction does nothing for a physical build**, so it is a mercenary-survivability item here rather than a damage one. What no mercenary helps with is Iron Maiden, which is on you.",

  farming: [
    {
      area: "uber-tristram",
      difficulty: "hell",
      why: "**The build's reason to exist.** Fire, lightning and poison are the common immunities here and physical is not, so the kicks land — and per-kick Crushing Blow is the mechanic that brings down health bars the size of the three Uber bosses'. Take the Tiger Strike package and bring Life Tap.",
      minTier: "optimized",
      rating: 5,
    },
    {
      area: "travincal",
      difficulty: "hell",
      why: "Fire and lightning are the common immunities, so the kicks land on everything. A short run, a fixed pack standing in one place, and enough corpses that the Death Sentry package turns it into seconds.",
      minTier: "early-hell",
      rating: 5,
    },
    {
      area: "pindleskin",
      difficulty: "hell",
      why: "Cold and poison rather than physical, one fixed superunique, and a corridor. The fastest repeatable fight this build has outside Ubers.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "mausoleum",
      difficulty: "hell",
      why: "Poison and cold, so the kicks land, and high density in one room — which is exactly what the Death Sentry package converts into clear speed. **Venom is doing nothing here**, which is worth knowing before you wonder why the poison bar is not moving.",
      minTier: "nightmare",
      rating: 4,
    },
    {
      area: "countess",
      difficulty: "hell",
      why: "Fire is the only common immunity, so the kicks land on everything, and the runes are what the rest of this page is made of. A short, enclosed, repeatable run.",
      minTier: "nightmare",
      rating: 4,
    },
    {
      area: "andariel",
      difficulty: "hell",
      why: "Poison only, so every kick lands — and **your Venom does nothing at all**, which makes this the clearest demonstration on the site of why the twenty points in it are conditional rather than free.",
      minTier: "nightmare",
      rating: 3,
    },
  ],

  immunityPlan:
    "**Physical immunity is this build's wall, and it is a harder wall than most melee pages admit — including for Crushing Blow.** Crushing Blow is physical damage; a monster with 100% or more physical resistance takes essentially nothing from it, so the mechanic that makes this the best boss-killer on the class is exactly the mechanic that stops working. This site's own area census lists physical among the common immunities in **eight of twenty farming areas**, and they are not obscure ones: the Pit, the Cow Level, the Chaos Sanctuary, the Worldstone Keep, the River of Flame, Nihlathak's temple, the Stony Tomb and the Kurast temples. Half the popular Hell farming list is closed to the kicks. Four answers, in order of how much they help. First, **Venom**, which is why it is twenty points of the core rather than a package: poison is not physical, it rides every kick, and almost nothing on the farming list resists it. Second, the **Death Sentry package** — its corpse explosion is half fire and half physical, and the fire half lands on a physical immune, but something has to die first, so it is an answer to a room rather than to a monster. Third, **a mercenary who is not you**: an Act 2 Might mercenary is also physical, so if physical immunity is the problem the answer is an Act 3 Iron Wolf or an Act 5 Barbarian rather than more aura. Fourth, and most often correct: **walk past**. A physical-immune pack in a Terror Zone is not a puzzle this build solves, and pretending otherwise is how the character dies. What does **not** work is stacking Crushing Blow, which is physical and stops at the same wall — and Deadly Strike was never on the table, because a kick does not use it anywhere. **Open Wounds is the one exception, and it is a real one.** Its damage is not poison and it cannot be resisted at all, so a physical immune has no defence against it. The catch is the condition: the state only starts on a non-player enemy that is already below full life. On its own, against a monster your kicks cannot scratch, it never begins — but the moment Venom has taken the first sliver off, Open Wounds has somewhere to land. That is a second reason the two belong in the same plan, and it is the only physical-adjacent line on this page that goes through the wall.",

  hardcoreNotes:
    "**Take the Tiger Strike and Fade package, and stay out of the Chaos Sanctuary.** The Iron Maiden problem is worse for this build than for any other on the site, and the reason is arithmetic: the curse reflects a share of the damage you deal, and a seven-kick Dragon Talon deals it in seven instalments in about a second. Fade's curse-length reduction is the mitigation and eighteen points of it cuts the duration by up to 90%, but the real mitigation is not being there — the Chaos Sanctuary lists physical among its common immunities anyway, so this build has little reason to be in the room. Beyond that: Weapon Block at twenty is not optional, which means two claws is not optional; Life Tap from Dracul's Grasp is the largest survivability item in the game for a build that strikes this often; and Cannot Be Frozen protects the kick rate, which on Hardcore is the difference between finishing an activation and being interrupted halfway through it.",

  selfFoundNotes:
    "**The most self-found-friendly endgame build on the class, because its weapon is a boot.** Gore Rider is a common unique on an exceptional base, and it is the single item the whole build is computed from — no rune, no trade, no ladder. Everything else is either a vendor claw (Charsi restocks on every town entry and claws roll Assassin skills natively) or a runeword of four runes or fewer: Lore, Stealth, Treachery, Duress. Nothing here needs a high rune. The two things that are genuinely hard self-found are the **Hellfire Torch**, which is Uber-gated and therefore circular, and the strength to wear upgraded Gore Riders, which is a decision rather than a drop. **And one thing that costs nothing:** the Death Sentry package is five prerequisite points and thirty-six package points, and it turns a single-target build into a farming one without a single item.",

  levelingPath: {
    summary:
      "**Dragon Talon exists at level 1, which almost nothing else on this class does.** You can kick from the first skill point, and the build levels as itself the whole way — the twenty points in Dragon Talon are spent in the order the endgame wants and never respecced. What changes is the boots. Normal boots are 3–20 damage, exceptional are 23–80 at level 25, and elite are 50–149 from level 45, so the levelling experience is three step-changes in the same slot rather than a new skill. Venom arrives at 30 and is worth a point the moment it does.",
    respecAt: "None required. If you have spent points on Claw Mastery expecting it to raise the kicks, that is the one respec this page would justify.",
  },

  confidence: "verified",
  complete: true,
};
