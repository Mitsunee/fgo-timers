import { List } from "@foxkit/util/object";
import type { SupportedRegion } from "../../atlas-api/api";
import { atlasCache } from "../../atlas-api/cache";
import { shortenAtlasUrl } from "../../atlas-api/urls";
import { Log } from "../../utils/log";
import type { BundledSkill } from "../../servants/types";
import { getSkillOwners } from "../../servants/getOwner";
import { mapUpgradeLevelToSkillBorder } from "../../servants/borders";
import { PLACEHOLDER_SKILL } from "../../servants/placeholder";
import { getUpgradeLevel } from "../../upgrades/getUpgradeLevel";
import type { DataBundler } from "../utils/dataBundlers";

async function flatMapSkills(region: SupportedRegion) {
  const niceServant = await atlasCache[region].getNiceServant();
  return niceServant.flatMap(servant => servant.skills);
}

export const bundleSkillsData: DataBundler<BundledSkill> = async ids => {
  const [niceSkills, niceSkillsNA] = await Promise.all([
    flatMapSkills("JP"),
    flatMapSkills("NA")
  ]);
  const skillQueue = List.fromArray([...ids]); // to be processed
  const res = new Map<number, BundledSkill>(); // result of processing

  // Add placeholder skill
  res.set(0, {
    ...PLACEHOLDER_SKILL,
    icon: shortenAtlasUrl(PLACEHOLDER_SKILL.icon)
  });

  while (skillQueue.length > 0) {
    const skillId = skillQueue.shift()!;
    const skill = niceSkills.find(skill => skill.id == skillId);
    if (!skill) {
      Log.error(`Could not find skill id ${skillId}`);
      return false;
    }

    const owners = await getSkillOwners(skill);
    if (owners.length < 1) {
      Log.error(`Could not find any owners of skill id ${skillId}`);
      return false;
    }

    const skillNA = niceSkillsNA.find(skill => skill.id == skillId);
    const upgradeLevel = getUpgradeLevel(owners[0], skill); // can be assumed to be consistent (tested)
    const skillVariants = owners
      .flatMap(servant => servant.skills)
      .filter(skill => skill.id == skillId);
    let num: number | IDMap<number> = skill.num!; // can be assumed to be defined (tested)
    if (!skillVariants.every(skill => skill.num == num)) {
      num = Object.fromEntries(
        owners.map(servant => {
          const skill = servant.skills.find(skill => skill.id == skillId)!;
          return [servant.id, skill.num!];
        })
      );
    }

    const data: BundledSkill = {
      name: skillNA?.name || skill.name,
      num,
      icon: shortenAtlasUrl(skill.icon!), // can be assumed to be defined (tested)
      border: mapUpgradeLevelToSkillBorder(upgradeLevel)
    };

    if (skillNA) data.na = true;

    res.set(skillId, data);
  }

  Log.info(`Mapped data for ${res.size - 1} Skills`);
  return {
    name: "Skills",
    path: "skills.json",
    data: res
  };
};
