import { List } from "@foxkit/util/object";

import { DataBundler } from "./dataBundlers";
import {
  BundledQuest,
  QuestUpgrade,
  QuestOther,
  UpgradeQuestType
} from "../upgrades/types";
import { getQuestData } from "../upgrades/getQuestData";
import { Log } from "../utils/log";
import { parseQuestType } from "../upgrades/parseQuestType";
import { parseUnlockCond } from "../upgrades/parseUnlockCond";
import { latinize } from "../utils/latinize";

// TODO: Re-implement open time overrides (See https://github.com/Mitsunee/fgo-timers/blob/main/src/scripts/upgrades-legacy/questDatesMap.mjs)

export const bundleQuestsData: DataBundler<BundledQuest> = async bundles => {
  const questQueue = new List<number>(); // to be processed
  const knownQuests = new Set<number>(); // are queued or processed
  const res = new Map<number, BundledQuest>(); // result of processing

  for (const bundle of bundles) {
    if (!bundle.quests) continue;
    for (const id of bundle.quests) {
      if (knownQuests.has(id)) continue;
      questQueue.push(id);
      knownQuests.add(id);
    }
  }

  while (questQueue.length > 0) {
    const questId: number = questQueue.shift()!;
    const [quest, questNA] = await Promise.all([
      getQuestData(questId, "JP"),
      getQuestData(questId, "NA")
    ]);

    if (!quest) {
      Log.error(`Could not find quest id ${questId}`);
      return false;
    }

    const type = parseQuestType(quest);
    const unlock = parseUnlockCond(quest);

    switch (type) {
      case UpgradeQuestType.INTERLUDE:
      case UpgradeQuestType.RANKUP: {
        const name = questNA?.name || quest.name;
        const data: QuestUpgrade = {
          type,
          name,
          search: latinize(name),
          open: questNA?.openedAt || quest.openedAt
        };

        if (questNA) data.na = true;
        if (Object.entries(unlock).length > 0) {
          data.unlock = unlock;
          unlock.quests?.forEach(unlockQuestId => {
            if (knownQuests.has(unlockQuestId)) return;
            questQueue.push(unlockQuestId);
            knownQuests.add(unlockQuestId);
          });
        }

        res.set(questId, data);
        break;
      }
      case UpgradeQuestType.OTHER: {
        const name = questNA?.name || quest.name;
        const data: QuestOther = {
          type,
          name,
          search: latinize(name)
        };

        if (questNA) data.na = true;

        res.set(questId, data);
        break;
      }
    }
  }

  Log.info(`Mapped data for ${res.size} Quests`);
  return {
    name: "Quests",
    path: "quests.json",
    data: res
  };
};
