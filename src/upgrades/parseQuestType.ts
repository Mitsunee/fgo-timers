import type { Quest } from "@atlasacademy/api-connector/dist/Schema/Quest.js";
import { QuestType } from "@atlasacademy/api-connector/dist/Schema/Quest.js";
import { UpgradeQuestType } from "./types";

export function parseQuestType(quest: Quest): UpgradeQuestType {
  switch (quest.type) {
    case QuestType.FRIENDSHIP:
      return UpgradeQuestType.INTERLUDE;
    case QuestType.EVENT:
      if (quest.warId === 1001) return UpgradeQuestType.RANKUP;
    // break omitted
    default:
      return UpgradeQuestType.OTHER;
  }
}
