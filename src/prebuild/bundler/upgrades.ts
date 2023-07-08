import type { Quest } from "@atlasacademy/api-connector/dist/Schema/Quest.js";
import {
  QuestFlag,
  QuestType
} from "@atlasacademy/api-connector/dist/Schema/Quest.js";
import type { Servant } from "@atlasacademy/api-connector/dist/Schema/Servant";
import { getNiceQuestsFull } from "~/atlas-api/cache/data/niceQuest";
import { UpgradesFile } from "~/static/upgrades";
import { getPreviousNP, getPreviousSkill } from "~/upgrades/getPrevious";
import {
  getRelatedNP,
  getRelatedServant,
  getRelatedSkill
} from "~/upgrades/getRelated";
import { Log } from "~/utils/log";
import type {
  BundledUpgrade,
  UpgradeMap,
  UpgradeMapNP,
  UpgradeMapSkill
} from "~/upgrades/types";
import { PrebuildBundler } from "../utils/bundlers";
import type { IDCollection } from "../utils/collectIds";

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
 * Array.prototype.filter callback that returns true for Rank Up Quests and
 * Interlude Quests (other than branches)
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

const UpgradesBundler = new PrebuildBundler({
  name: "Upgrades",
  outputFile: UpgradesFile,
  bundle: async () => {
    const [quests, questsNA] = await Promise.all([
      getNiceQuestsFull().then(quests => quests.filter(filterQuests)),
      getNiceQuestsFull("NA").then(quests => quests.filter(filterQuests))
    ]);

    const upgrades = new Array<BundledUpgrade>();
    const ids = {
      servants: new Set(),
      quests: new Set(),
      skills: new Set(),
      nps: new Set()
    } satisfies Partial<IDCollection>;

    for (const quest of quests) {
      ids.quests.add(quest.id);
      const questNA = questsNA.find(questNA => questNA.id == quest.id);
      const servant = await getRelatedServant(quest.id, "JP");
      if (!servant) {
        Log.throw(`Could not find related Servant for quest id ${quest.id}`);
      }

      ids.servants.add(servant.id);
      const upgrade: BundledUpgrade = {
        quest: quest.id,
        servant: servant.id
      };
      const upgradeMap = getUpgradeMap(servant, quest.id);
      if (questNA) upgrade.na = true;

      if (upgradeMap) {
        upgrade.upgrades = upgradeMap;
        if (upgradeMap.type == "np") {
          ids.nps.add(upgradeMap.id);
          ids.nps.add(upgradeMap.newId);
        } else {
          if (upgradeMap.id) ids.skills.add(upgradeMap.id);
          ids.skills.add(upgradeMap.newId);
        }
      } else if (quest.warId == 1001) {
        Log.throw(
          `Could not find related Skill or NP for rankup quest id ${quest.id}`
        );
      }

      upgrades.push(upgrade);
    }

    return { data: upgrades, size: upgrades.length, ids };
  }
});

export const bundleUpgrades =
  UpgradesBundler.processBundle.bind(UpgradesBundler);
