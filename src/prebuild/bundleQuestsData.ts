import { List } from "@foxkit/util/object";
import { readFileYaml } from "@foxkit/node-util/fs-yaml";
import { join } from "path";

import { DataBundler } from "./dataBundlers";
import {
  BundledQuest,
  QuestUpgrade,
  QuestOther,
  UpgradeQuestType,
  OpenTimeOverrides,
  OpenTimeOverridesSchema
} from "../upgrades/types";
import { getQuestData } from "../upgrades/getQuestData";
import { Log } from "../utils/log";
import { parseQuestType } from "../upgrades/parseQuestType";
import { parseUnlockCond } from "../upgrades/parseUnlockCond";
import { verifySchema } from "../schema/verifySchema";

const overridesFilePath = join(
  "assets",
  "data",
  "upgrades",
  "openTimeOverrides.yml"
);

export const bundleQuestsData: DataBundler<BundledQuest> = async bundles => {
  const openTimes = await readFileYaml<Partial<OpenTimeOverrides>>(
    overridesFilePath
  );
  const questQueue = new List<number>(); // to be processed
  const knownQuests = new Set<number>(); // are queued or processed
  const res = new Map<number, BundledQuest>(); // result of processing

  if (
    !openTimes ||
    !verifySchema(openTimes, OpenTimeOverridesSchema, overridesFilePath)
  ) {
    if (!openTimes)
      Log.error(
        `Could not find openTimeOverrides.yml ${Log.styleParent(
          overridesFilePath
        )}`
      );
    return false;
  }

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
        const override = openTimes.overrides[quest.id];
        const open =
          (typeof override == "number" && override) ||
          (typeof override == "string" && openTimes.constants[override]) ||
          questNA?.openedAt ||
          quest.openedAt;
        const data: QuestUpgrade = {
          type,
          name,
          open
        };

        if (typeof override == "string" && !openTimes.constants[override]) {
          Log.warn(
            `Unrecognized quest open time constant '${override}'. Using api data as fallback`
          );
        }

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
          name
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
