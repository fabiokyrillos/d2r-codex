import type { Build } from "@/lib/types";
import { blizzardSorceress } from "./blizzard-sorceress";
import { hammerdin } from "./hammerdin";
import { smiter } from "./smiter";
import { zealot } from "./zealot";
import { fohdin } from "./fohdin";

/**
 * Build registry.
 *
 * Adding a build means writing one file and adding one line here. Everything
 * else — routing, the class page listing, the "builds that use this item"
 * reverse index, the farming recommendations — derives from the data.
 */
export const builds: Build[] = [blizzardSorceress, hammerdin, smiter, zealot, fohdin];
