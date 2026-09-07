import type { Build } from "@/lib/types";
import { blizzardSorceress } from "./blizzard-sorceress";
import { hammerdin } from "./hammerdin";
import { smiter } from "./smiter";
import { zealot } from "./zealot";
import { fohdin } from "./fohdin";
import { avenger } from "./avenger";
import { tesladin } from "./tesladin";
import { holyFirePaladin } from "./holy-fire-paladin";
import { lightningSorceress } from "./lightning-sorceress";
import { fireballMeteorSorceress } from "./fireball-meteor-sorceress";
import { frozenOrbSorceress } from "./frozen-orb-sorceress";
import { novaSorceress } from "./nova-sorceress";
import { enchantSorceress } from "./enchant-sorceress";
import { hydraSorceress } from "./hydra-sorceress";
import { meteorbSorceress } from "./meteorb-sorceress";
import { frostNovaSorceress } from "./frost-nova-sorceress";
import { fireWallSorceress } from "./fire-wall-sorceress";
import { meleeSorceress } from "./melee-sorceress";
import { lightningFuryAmazon } from "./lightning-fury-amazon";
import { lightningStrikeAmazon } from "./lightning-strike-amazon";
import { strafeAmazon } from "./strafe-amazon";
import { multipleShotAmazon } from "./multiple-shot-amazon";
import { freezingArrowAmazon } from "./freezing-arrow-amazon";
import { explodingArrowAmazon } from "./exploding-arrow-amazon";
import { poisonJavelinAmazon } from "./poison-javelin-amazon";
import { jabFendAmazon } from "./jab-fend-amazon";
import { summonerNecromancer } from "./summoner-necromancer";
import { poisonNovaNecromancer } from "./poison-nova-necromancer";
import { boneSpearNecromancer } from "./bone-spear-necromancer";
import { windDruid } from "./wind-druid";
import { fireDruid } from "./fire-druid";
import { furyDruid } from "./fury-druid";
import { summonDruid } from "./summon-druid";
import { maulDruid } from "./maul-druid";
import { fireClawsDruid } from "./fire-claws-druid";
import { rabiesDruid } from "./rabies-druid";
import { fireTrapsin } from "./fire-trapsin";
import { lightningTrapsin } from "./lightning-trapsin";
import { phoenixStrike } from "./phoenix-strike";
import { kicksin } from "./kicksin";
import { bladeFury } from "./blade-fury";
import { dragonTail } from "./dragon-tail";
import { whirlwindAssassin } from "./whirlwind-assassin";
import { whirlwindBarbarian } from "./whirlwind-barbarian";
import { frenzyBarbarian } from "./frenzy-barbarian";
import { berserkBarbarian } from "./berserk-barbarian";

/**
 * Build registry.
 *
 * Adding a build means writing one file and adding one line here. Everything
 * else — routing, the class page listing, the "builds that use this item"
 * reverse index, the farming recommendations — derives from the data.
 */
export const builds: Build[] = [blizzardSorceress, hammerdin, smiter, zealot, fohdin, avenger, tesladin, holyFirePaladin, lightningSorceress, fireballMeteorSorceress, frozenOrbSorceress, novaSorceress, enchantSorceress, hydraSorceress, meteorbSorceress, frostNovaSorceress, fireWallSorceress, meleeSorceress, lightningFuryAmazon, lightningStrikeAmazon, strafeAmazon, multipleShotAmazon, freezingArrowAmazon, explodingArrowAmazon, poisonJavelinAmazon, jabFendAmazon, summonerNecromancer, poisonNovaNecromancer, boneSpearNecromancer, windDruid, fireDruid, furyDruid, summonDruid, maulDruid, fireClawsDruid, rabiesDruid, lightningTrapsin, fireTrapsin, phoenixStrike, kicksin, bladeFury, dragonTail, whirlwindAssassin, whirlwindBarbarian, frenzyBarbarian, berserkBarbarian];
