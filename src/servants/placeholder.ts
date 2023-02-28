import { Borders } from "../types/borders";
import type { BundledSkill } from "./types";

/**
 * Placeholder skill to display if Servant has no skill in that slot
 */
export const PLACEHOLDER_SKILL: BundledSkill = {
  name: "No Skill",
  num: 1,
  border: Borders.BLACK,
  icon: "/assets/icon_spoiler.png",
  na: true
};
