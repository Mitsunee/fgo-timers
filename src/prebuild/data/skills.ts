import { getNiceSkill } from "~/atlas-api/cache/data/niceSkill";
import { shortenAtlasUrl } from "~/atlas-api/urls";
import { mapUpgradeLevelToSkillBorder } from "~/servants/borders";
import { getSkillOwners } from "~/servants/getOwner";
import { PLACEHOLDER_SKILL } from "~/servants/placeholder";
import { SkillsFile } from "~/static/data/skills";
import { getUpgradeLevel } from "~/upgrades/getUpgradeLevel";
import { Log } from "~/utils/log";
import type { BundledSkill } from "~/servants/types";
import { DataBundler } from "../utils/dataBundlers";

export const SkillsBundle = new DataBundler({
  file: SkillsFile,
  transform: async id => {
    if (id == 0) {
      return Object.assign({}, PLACEHOLDER_SKILL, {
        icon: shortenAtlasUrl(PLACEHOLDER_SKILL.icon)
      });
    }

    const [skill, skillNA] = await Promise.all([
      getNiceSkill(id),
      getNiceSkill(id, "NA")
    ]);

    if (!skill) {
      Log.error(`Could not find skill with id ${id}`);
      return;
    }

    const owners = await getSkillOwners(skill);
    if (owners.length < 1) {
      Log.error(`Could not find any owners of skill id ${id}`);
      return;
    }

    const upgradeLevel = getUpgradeLevel(owners[0], skill); // can be assumed to be consistent (tested)
    const skillVariants = owners
      .flatMap(servant => servant.skills)
      .filter(skill => skill.id == id);
    let num: number | PartialDataMap<number> = skill.num;
    if (!skillVariants.every(skill => skill.num == num)) {
      num = Object.fromEntries(
        owners.map(servant => {
          const skill = servant.skills.find(skill => skill.id == id)!;
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

    return data;
  }
});

export const bundleSkillsData = SkillsBundle.processBundle.bind(SkillsBundle);
