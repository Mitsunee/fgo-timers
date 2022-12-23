import { BundledSkill } from "./types";

export function getSkillNum(skill: BundledSkill, servantId: number): number {
  if (typeof skill.num == "number") return skill.num;
  return skill.num[servantId] || 1;
}
