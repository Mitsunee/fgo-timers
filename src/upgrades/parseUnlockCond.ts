import { CondType } from "@atlasacademy/api-connector/dist/Enum/Cond.js";
import type { Quest } from "@atlasacademy/api-connector/dist/Schema/Quest";

import type { QuestUnlockCondition } from "./types";

export function parseUnlockCond(quest: Quest): QuestUnlockCondition {
  const unlock: QuestUnlockCondition = {};
  for (const condition of quest.releaseConditions) {
    switch (condition.type) {
      case CondType.SVT_FRIENDSHIP:
        if (condition.value > 0) unlock.bond = condition.value;
        break;
      case CondType.SVT_LIMIT:
        if (condition.value > 0) unlock.asc = condition.value;
        break;
      case CondType.QUEST_CLEAR:
        unlock.quests ||= new Array<number>();
        unlock.quests.push(condition.targetId);
        break;
    }
  }

  return unlock;
}
