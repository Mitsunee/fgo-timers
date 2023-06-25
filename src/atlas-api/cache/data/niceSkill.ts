import type { Skill as SkillBase } from "@atlasacademy/api-connector/dist/Schema/Skill";
import { getNiceServantsFull } from "./niceServant";

export interface Skill extends SkillBase {
  num: number;
}

const niceSkillCache: {
  JP?: Skill[];
  NA?: Skill[];
} = {};

function typeguardSkill(skill: SkillBase): skill is Skill {
  return typeof skill.num == "number";
}

/**
 * Generates nice Skill export from niceServantWithLore
 * @param region Region `"NA"` or `"JP"` (default: `"JP"`)
 * @returns nice Skill export
 */
export async function getNiceSkillsFull(region: SupportedRegion = "JP") {
  const knownIds = new Set<number>();
  return (niceSkillCache[region] ??= (await getNiceServantsFull(region))
    .flatMap(servant => servant.skills)
    // remove duplicates and use typeguard to ensure `num` prop is set
    .reduce((skills, skill) => {
      if (knownIds.has(skill.id) || !typeguardSkill(skill)) return skills;
      skills.push(skill);
      knownIds.add(skill.id);
      return skills;
    }, new Array<Skill>()));
}

/**
 * Gets nice data of Skills by id
 * @param ids ids of Skills to get
 * @param region Region `"NA"` or `"JP"` (default: `"JP"`)
 * @returns Array of Skills (may include undefined if any id was not found)
 */
export async function getNiceSkills(
  ids: number[],
  region: SupportedRegion = "JP"
) {
  const niceSkills = await getNiceSkillsFull(region);
  return ids.map(id => niceSkills.find(skill => skill.id == id));
}

/**
 * Gets nice Skill data by id
 * @param id id of Skill to get
 * @param region Region `"NA"` or `"JP"` (default: `"JP"`)
 * @returns Skill or undefined if not found
 */
export async function getNiceSkill(id: number, region: SupportedRegion = "JP") {
  const niceSkills = await getNiceSkillsFull(region);
  return niceSkills.find(skill => skill.id == id);
}
