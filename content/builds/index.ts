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

/**
 * Build registry.
 *
 * Adding a build means writing one file and adding one line here. Everything
 * else — routing, the class page listing, the "builds that use this item"
 * reverse index, the farming recommendations — derives from the data.
 */
export const builds: Build[] = [blizzardSorceress, hammerdin, smiter, zealot, fohdin, avenger, tesladin, holyFirePaladin, lightningSorceress, fireballMeteorSorceress, frozenOrbSorceress, novaSorceress, enchantSorceress, hydraSorceress];
