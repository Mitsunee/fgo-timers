import type { BundledSkill } from "./types";

/**
 * Gets skill slot number of Skill for Servant
 * @param skill BundledSkill object
 * @param servantId id of Servant
 * @returns number
 */
export function getSkillNum(skill: BundledSkill, servantId: number): number {
  if (typeof skill.num == "number") return skill.num;
  return skill.num[servantId] || 1;
}
