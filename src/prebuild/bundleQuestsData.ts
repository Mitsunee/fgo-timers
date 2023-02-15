import { List } from "@foxkit/util/object";
import { readFileYaml } from "@foxkit/node-util/fs-yaml";
import { join } from "path";

import { DataBundler } from "./dataBundlers";
import { parseSchema } from "../schema/verifySchema";
import { QuestOpenOverridesSchema } from "../schema/QuestOpenOverrides";
import type { QuestOpenOverrides } from "../schema/QuestOpenOverrides";
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

const overridesFilePath = join(
  "assets",
  "data",
  "upgrades",
  "openTimeOverrides.yml"
);

async function getOverrides() {
  const overridesFile = await readFileYaml<QuestOpenOverrides["in"]>(
    overridesFilePath
  );

  if (!overridesFile) {
    Log.error(
      `Could not find openTimeOverrides.yml ${Log.styleParent(
        overridesFilePath
      )}`
    );
    return false;
  }

  const overrides = parseSchema(
    overridesFile,
    QuestOpenOverridesSchema,
    overridesFilePath
  );

  return overrides ?? false;
}

export const bundleQuestsData: DataBundler<BundledQuest> = async bundles => {
  const overrides = await getOverrides();
  if (!overrides) return false;

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
        const name = questNA?.name ?? quest.name;
        const override = overrides[quest.id];
        const open = override ?? questNA?.openedAt ?? quest.openedAt;
        const data: QuestUpgrade = {
          type,
          name,
          open
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
