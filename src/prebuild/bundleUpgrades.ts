import type { Quest } from "@atlasacademy/api-connector/dist/Schema/Quest.js";
import {
  QuestFlag,
  QuestType
} from "@atlasacademy/api-connector/dist/Schema/Quest.js";
import type { Servant } from "@atlasacademy/api-connector/dist/Schema/Servant";

import type {
  BundledUpgrade,
  UpgradeMap,
  UpgradeMapNP,
  UpgradeMapSkill
} from "../upgrades/types";
import type { PrebuildBundler } from "./bundlers";
import { atlasCache } from "../atlas-api/cache";
import {
  getRelatedNP,
  getRelatedServant,
  getRelatedSkill
} from "../upgrades/getRelated";
import { Log } from "../utils/log";
import { getPreviousNP, getPreviousSkill } from "../upgrades/getPrevious";

function getUpgradeMap(
  servant: Servant,
  questId: number
): UpgradeMap | undefined {
  // describe upgrade type if applicable
  let relatedSkill: ReturnType<typeof getRelatedSkill>;
  let relatedNP: ReturnType<typeof getRelatedNP>;

  if ((relatedSkill = getRelatedSkill(servant, questId))) {
    // upgrades skill
    const upgradeMap: UpgradeMapSkill = {
      type: "skill",
      newId: relatedSkill.id
    };

    const previousSkill = getPreviousSkill(servant, relatedSkill);
    if (previousSkill) {
      upgradeMap.id = previousSkill.id;
    }

    return upgradeMap;
  } else if ((relatedNP = getRelatedNP(servant, questId))) {
    // upgrades NP
    const previousNP = getPreviousNP(servant, relatedNP);

    return {
      type: "np",
      id: previousNP.id,
      newId: relatedNP.id
    } satisfies UpgradeMapNP;
  }

  return;
}

/**
 * Array.prototype.filter callback that returns true for Rank Up Quests and Interlude Quests (other than branches)
 */
function filterQuests(quest: Quest) {
  // Return true for all Rank Up Quests
  if (quest.warId == 1001) return true;
  // Return true for Interlude Quests...
  if (quest.type == QuestType.FRIENDSHIP) {
    // ...but ignore branches
    return !quest.flags.includes(QuestFlag.BRANCH);
  }

  return false;
}

type UpgradeBundler = PrebuildBundler<BundledUpgrade[]>;
export const bundleUpgrades: UpgradeBundler = async function () {
  const [niceWar, niceWarNA] = await Promise.all([
    atlasCache.JP.getNiceWar(),
    atlasCache.NA.getNiceWar()
  ]);

  const upgrades = new Array<BundledUpgrade>();
  const servants = new Set<number>();
  const quests = new Set<number>();
  const skills = new Set<number>();
  const nps = new Set<number>();

  const questsData = niceWar
    .flatMap(war => war.spots.flatMap(spot => spot.quests))
    .filter(filterQuests);
  const questsDataNA = niceWarNA
    .flatMap(war => war.spots.flatMap(spot => spot.quests))
    .filter(filterQuests);

  for (const questData of questsData) {
    quests.add(questData.id);
    const questDataNA = questsDataNA.find(quest => quest.id == questData.id);

    // Find Servant
    const servant = await getRelatedServant(questData.id, "JP");
    if (!servant) {
      Log.error(`Could not find related Servant for quest id ${questData.id}`);
      return false;
    }
    servants.add(servant.id);

    // describe upgrade
    const upgrade: BundledUpgrade = {
      quest: questData.id,
      servant: servant.id
    };
    if (questDataNA) upgrade.na = true;

    const upgradeMap = getUpgradeMap(servant, questData.id);
    if (upgradeMap) {
      upgrade.upgrades = upgradeMap;
      if (upgradeMap.type == "np") {
        nps.add(upgradeMap.id);
        nps.add(upgradeMap.newId);
      } else {
        if (upgradeMap.id) skills.add(upgradeMap.id);
        skills.add(upgradeMap.newId);
      }
    } else if (questData.warId == 1001) {
      Log.error(
        `Could not find related Skill or NP for rankup quest id ${questData.id}`
      );
      return false;
    }

    upgrades.push(upgrade);
  }

  Log.info(`Mapped ${upgrades.length} Upgrades for ${servants.size} servants`);
  return {
    name: "Upgrades",
    path: "upgrades.json",
    data: upgrades,
    quests: Array.from(quests),
    servants: Array.from(servants),
    skills: Array.from(skills),
    nps: Array.from(nps)
  };
};
