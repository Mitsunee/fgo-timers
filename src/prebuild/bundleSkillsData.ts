import { List } from "@foxkit/util/object";
import type { SupportedRegion } from "../atlas-api/api";
import { atlasCache } from "../atlas-api/cache";
import { shortenAtlasUrl } from "../atlas-api/urls";
import { Log } from "../utils/log";
import type { BundledSkill } from "../servants/types";
import { getOwner } from "../servants/getOwner";
import { mapUpgradeLevelToSkillBorder } from "../servants/borders";
import { PLACEHOLDER_SKILL } from "../servants/placeholder";
import { getUpgradeLevel } from "../upgrades/getUpgradeLevel";
import type { DataBundler } from "./dataBundlers";

async function flatMapSkills(region: SupportedRegion) {
  const niceServant = await atlasCache[region].getNiceServant();
  return niceServant.flatMap(servant => servant.skills);
}

export const bundleSkillsData: DataBundler<BundledSkill> = async bundles => {
  const [niceSkills, niceSkillsNA] = await Promise.all([
    flatMapSkills("JP"),
    flatMapSkills("NA")
  ]);
  const skillQueue = new List<number>(); // to be processed
  const knownSkills = new Set<number>(); // are queued or processed
  const res = new Map<number, BundledSkill>(); // result of processing

  // Add placeholder skill
  res.set(0, {
    ...PLACEHOLDER_SKILL,
    icon: shortenAtlasUrl(PLACEHOLDER_SKILL.icon)
  });

  for (const bundle of bundles) {
    if (!bundle.skills) continue;
    for (const id of bundle.skills) {
      if (knownSkills.has(id)) continue;
      skillQueue.push(id);
      knownSkills.add(id);
    }
  }

  while (skillQueue.length > 0) {
    const skillId = skillQueue.shift()!;
    const skill = niceSkills.find(skill => skill.id == skillId);
    if (!skill) {
      Log.error(`Could not find skill id ${skillId}`);
      return false;
    }

    const servant = await getOwner(skill); // BUG: skills are reused on multiple servants
    if (!servant) {
      Log.error(`Could not find owner of skill id ${skillId}`);
      return false;
    }

    const skillNA = niceSkillsNA.find(skill => skill.id == skillId);
    const upgradeLevel = getUpgradeLevel(servant, skill);

    const data: BundledSkill = {
      name: skillNA?.name || skill.name,
      num: skill.num ?? 1, // BUG: this is possibly inconsistent between servants, but can be assumed to be defined (tested)
      icon: shortenAtlasUrl(skill.icon!), // can be assumed (tested)
      border: mapUpgradeLevelToSkillBorder(upgradeLevel) // can be assumed (tested)
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
