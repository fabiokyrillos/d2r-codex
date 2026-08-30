import type { Build } from "@/lib/types";
import { blizzardSorceress } from "./blizzard-sorceress";

/**
 * Build registry.
 *
 * Adding a build means writing one file and adding one line here. Everything
 * else — routing, the class page listing, the "builds that use this item"
 * reverse index, the farming recommendations — derives from the data.
 */
export const builds: Build[] = [blizzardSorceress];
