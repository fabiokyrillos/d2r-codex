import type { ProgressionJourney } from "@/lib/types";
import { sorceressJourney } from "./sorceress-journey";
import { paladinJourney } from "./paladin-journey";
import { amazonJourney } from "./amazon-journey";
import { necromancerJourney } from "./necromancer-journey";

export const journeys: ProgressionJourney[] = [sorceressJourney, paladinJourney, amazonJourney, necromancerJourney];
