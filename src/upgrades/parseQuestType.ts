import type { Quest } from "@atlasacademy/api-connector/dist/Schema/Quest";
import { QuestType } from "@atlasacademy/api-connector/dist/Schema/Quest";
import { UpgradeQuestType } from "../types/upgrades";

export function parseQuestType(quest: Quest): UpgradeQuestType {
  switch (quest.type) {
    case QuestType.FRIENDSHIP:
      return UpgradeQuestType.INTERLUDE;
    case QuestType.MAIN:
      return UpgradeQuestType.MAIN;
    case QuestType.EVENT:
      if (quest.warId === 1001) return UpgradeQuestType.RANKUP;
    // break omitted
    default:
      return UpgradeQuestType.UNKNOWN;
  }
}
