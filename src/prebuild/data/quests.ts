import { join } from "path";
import { readFileYaml } from "@foxkit/node-util/fs-yaml";
import { List } from "@foxkit/util/object";
import { QuestOpenOverridesSchema } from "~/schema/QuestOpenOverrides";
import { parseSchema } from "~/schema/verifySchema";
import { GlobalNums } from "~/types/enum";
import { getQuestData } from "~/upgrades/getQuestData";
import { parseQuestType } from "~/upgrades/parseQuestType";
import { parseUnlockCond } from "~/upgrades/parseUnlockCond";
import { UpgradeQuestType } from "~/upgrades/types";
import { Log } from "~/utils/log";
import type { QuestOpenOverrides } from "~/schema/QuestOpenOverrides";
import type { BundledQuest, QuestOther, QuestUpgrade } from "~/upgrades/types";
import type { DataBundler } from "../utils/dataBundlers";

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

export const bundleQuestsData: DataBundler<BundledQuest> = async ids => {
  const overrides = await getOverrides();
  if (!overrides) return false;

  const questQueue = List.fromArray([...ids]); // to be processed
  const knownQuests = new Set<number>([...ids]); // are queued or processed
  const res = new Map<number, BundledQuest>(); // result of processing

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
        const open =
          override ??
          questNA?.openedAt ??
          quest.openedAt + GlobalNums.JP_TO_NA_ESTIMATE;
        const data: QuestUpgrade = {
          type,
          name,
          open
        };

        if (questNA) data.na = true;
        else if (!override) data.estimate = true;
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
          open: -1
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
