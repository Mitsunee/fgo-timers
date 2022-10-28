export enum UpgradeQuestType {
  INTERLUDE = "intld",
  RANKUP = "rankup",
  OTHER = "other"
}

export interface QuestUnlockCondition {
  quests?: number[];
  bond?: number;
  asc?: number;
}

interface QuestBase {
  name: string;
  search: string; // search subject
  open?: number; // opening date as timestamp
  type: UpgradeQuestType;
  na?: true;
  unlock?: QuestUnlockCondition;
}

export interface QuestOther extends QuestBase {
  type: UpgradeQuestType.OTHER;
  open?: undefined;
  unlock?: undefined;
}

export interface QuestUpgrade extends QuestBase {
  // kinda want a better name for this, but couldn't come up with one
  type: UpgradeQuestType.INTERLUDE | UpgradeQuestType.RANKUP;
  open: number;
}

export type BundledQuest = QuestOther | QuestUpgrade;

export type UpgradeMap =
  | { type: "skill"; id?: number; newId: number }
  | { type: "np"; id: number; newId: number };

export interface Upgrade {
  quest: number; // quest id
  servant: number; // servant id
  upgrades?: UpgradeMap;
  na?: true;
}
