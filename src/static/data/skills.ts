import path from "path";
import { Log } from "~/utils/log";
import type { BundledSkill } from "~/servants/types";
import { BundleFile } from "../Bundle";

const filePath = path.join(process.cwd(), "assets/static/data/skills.json");
export const SkillsFile = new BundleFile<PartialDataMap<BundledSkill>>({
  name: "Skills",
  filePath
});

/**
 * Reads Skills data bundle
 * @returns Bundled data
 */
export const getSkillsFull = SkillsFile.readBundle.bind(SkillsFile);

/**
 * Writes to Skills data bundle
 * @param data Record Object of bundled Skills
 * @returns FileWriteResult
 */
export const writeBundledSkils = SkillsFile.writeBundle.bind(SkillsFile);

/**
 * Reads specific Skill's bundled data
 * @param id id of Skill
 * @returns BundledSkill or undefined if id not found
 */
export async function getSkill(id: number) {
  return getSkillsFull().then(map => map[id]);
}

/**
 * Creates Record of Skills by id
 * @param ids ids of Skills
 * @returns Record of Skills
 * @throws if id was not found
 */
export async function createSkillRecord(ids: number[] | Set<number>) {
  const record: DataMap<BundledSkill> = {};
  const skills = await getSkillsFull();

  for (const id of ids) {
    if (record[id]) continue;

    const skill = skills[id];
    if (!skill) {
      Log.throw(`Could not find skill with id ${id} in bundled data`);
    }

    record[id] = skill;
  }

  return record;
}
