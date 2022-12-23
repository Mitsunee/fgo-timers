import type {
  BundledQuest,
  QuestUnlockCondition,
  QuestUpgrade
} from "src/upgrades/types";

export interface MappedQuestInfo extends Pick<BundledQuest, "name" | "na"> {
  id: number;
}

export type MappedBundledQuest = Omit<QuestUpgrade, "unlock"> & {
  unlock?: Omit<QuestUnlockCondition, "quests"> & {
    quests?: MappedQuestInfo[];
  };
};

const memo = new Map<number, MappedBundledQuest>();

export const createQuestUnlockMapper = (
  questMap: Record<number, BundledQuest>
) => {
  return function mapQuestUnlocks(questId: number): MappedBundledQuest {
    let result: MappedBundledQuest | undefined = memo.get(questId);
    if (result) return result;
    const quest = questMap[questId];

    if (
      !quest.unlock ||
      !quest.unlock.quests ||
      quest.unlock.quests.length < 1
    ) {
      return quest as MappedBundledQuest;
    }

    result = {
      ...quest,
      unlock: {
        ...quest.unlock,
        quests: quest.unlock.quests.map(id => {
          const quest = questMap[id];
          const info: MappedQuestInfo = { id, name: quest.name };
          if (quest.na) info.na = true;
          return info;
        })
      }
    };

    memo.set(questId, result);
    return result;
  };
};
