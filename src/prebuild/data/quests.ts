import { getNiceQuest } from "~/atlas-api/cache/data/niceQuest";
import { getQuestOpenOverrides } from "~/schema/QuestOpenOverrides";
import { QuestsFile } from "~/static/data/quests";
import { GlobalNums } from "~/types/enum";
import { parseQuestType } from "~/upgrades/parseQuestType";
import { parseUnlockCond } from "~/upgrades/parseUnlockCond";
import { UpgradeQuestType } from "~/upgrades/types";
import { Log } from "~/utils/log";
import type { QuestOther, QuestUpgrade } from "~/upgrades/types";
import { DataBundler } from "../utils/dataBundlers";

export const QuestsBundle = new DataBundler({
  file: QuestsFile,
  transform: async (id, add) => {
    const [overrides, quest, questNA] = await Promise.all([
      getQuestOpenOverrides(),
      getNiceQuest(id),
      getNiceQuest(id, "NA")
    ]);

    if (!quest) {
      Log.error(`Could not find quest with id ${id}`);
      return;
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
          unlock.quests?.forEach(add);
        }

        return data;
      }
      case UpgradeQuestType.OTHER: {
        const name = questNA?.name || quest.name;
        const data: QuestOther = {
          type,
          name,
          open: -1
        };

        if (questNA) data.na = true;

        return data;
      }
    }
  }
});

export const bundleQuestsData = QuestsBundle.processBundle.bind(QuestsBundle);
