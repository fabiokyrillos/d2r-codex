import type { ProgressionJourney } from "@/lib/types";
import { sorceressJourney } from "./sorceress-journey";
import { paladinJourney } from "./paladin-journey";

export const journeys: ProgressionJourney[] = [sorceressJourney, paladinJourney];
