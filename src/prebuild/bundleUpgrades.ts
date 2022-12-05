import {
  QuestFlag,
  QuestType
} from "@atlasacademy/api-connector/dist/Schema/Quest.js";
import type { Servant } from "@atlasacademy/api-connector/dist/Schema/Servant";

import { Upgrade, UpgradeMap } from "../upgrades/types";
import type { PrebuildBundler } from "./bundlers";
import { atlasCache } from "../atlas-api/cache";
import {
  getRelatedNP,
  getRelatedServant,
  getRelatedSkill
} from "../upgrades/getRelated";
import { Log } from "../utils/log";
import { getPreviousNP, getPreviousSkill } from "../upgrades/getPrevious";

function getUpgradeMap(servant: Servant, questId: number): UpgradeMap | false {
  // describe upgrade type if applicable
  let relatedSkill: ReturnType<typeof getRelatedSkill>;
  let relatedNP: ReturnType<typeof getRelatedNP>;

  if ((relatedSkill = getRelatedSkill(servant, questId))) {
    // upgrades skill
    const upgradeMap: UpgradeMap = {
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
    };
  }

  return false;
}

export const bundleUpgrades: PrebuildBundler<Upgrade[]> = async function () {
  const [niceWar, niceWarNA] = await Promise.all([
    atlasCache.JP.getNiceWar(),
    atlasCache.NA.getNiceWar()
  ]);

  const upgrades = new Array<Upgrade>();
  const servants = new Set<number>();
  const quests = new Set<number>();
  const skills = new Set<number>();
  const nps = new Set<number>();

  // parse Interludes
  const interludes = niceWar
    .flatMap(war => war.spots.flatMap(spot => spot.quests))
    .filter(
      quest =>
        quest.type == QuestType.FRIENDSHIP &&
        !quest.flags.includes(QuestFlag.BRANCH)
    );
  const interludesNA = niceWarNA
    .flatMap(war => war.spots.flatMap(spot => spot.quests))
    .filter(
      quest =>
        quest.type == QuestType.FRIENDSHIP &&
        !quest.flags.includes(QuestFlag.BRANCH)
    );

  for (const interlude of interludes) {
    quests.add(interlude.id);
    const interludeNA = interludesNA.find(quest => quest.id == interlude.id);

    // Find Servant
    const servant = await getRelatedServant(interlude.id, "JP");
    if (!servant) {
      Log.error(
        `Could not find related Servant for interlude quest id ${interlude.id}`
      );
      return false;
    }
    servants.add(servant.id);

    // describe upgrade
    const upgrade: Upgrade = {
      quest: interlude.id,
      servant: servant.id
    };
    if (interludeNA) upgrade.na = true;

    const upgradeMap = getUpgradeMap(servant, interlude.id);
    if (upgradeMap) {
      upgrade.upgrades = upgradeMap;
      if (upgradeMap.type == "np") {
        nps.add(upgradeMap.id);
        nps.add(upgradeMap.newId);
      } else {
        if (upgradeMap.id) skills.add(upgradeMap.id);
        skills.add(upgradeMap.newId);
      }
    }

    upgrades.push(upgrade);
  }

  // parse Rank Up Quests
  const rankupsJP = niceWar
    .find(war => war.id == 1001)!
    .spots.flatMap(spot => spot.quests);
  const rankupsNA = niceWarNA
    .find(war => war.id == 1001)!
    .spots.flatMap(spot => spot.quests);

  for (const rankup of rankupsJP) {
    quests.add(rankup.id);
    const rankupNA = rankupsNA.find(quest => quest.id == rankup.id);

    // Find Servant
    const servant = await getRelatedServant(rankup.id, "JP");
    if (!servant) {
      Log.error(
        `Could not find related Servant for rankup quest id ${rankup.id}`
      );
      return false;
    }
    servants.add(servant.id);

    // describe upgrade
    const upgrade: Upgrade = {
      quest: rankup.id,
      servant: servant.id
    };
    if (rankupNA) upgrade.na = true;

    const upgradeMap = getUpgradeMap(servant, rankup.id);
    if (upgradeMap) {
      upgrade.upgrades = upgradeMap;
      if (upgradeMap.type == "np") {
        nps.add(upgradeMap.id);
        nps.add(upgradeMap.newId);
      } else {
        if (upgradeMap.id) skills.add(upgradeMap.id);
        skills.add(upgradeMap.newId);
      }
    } else {
      Log.error(
        `Could not find related Skill or NP for rankup quest id ${rankup.id}`
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
