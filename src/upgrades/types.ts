export const enum UpgradeQuestType {
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
  open: number; // opening date as timestamp or -1 for UpgradeQuestType.OTHER
  type: UpgradeQuestType;
  unlock?: QuestUnlockCondition;
  na?: true;
  estimate?: boolean;
}

export interface QuestOther extends QuestBase {
  type: UpgradeQuestType.OTHER;
  open: -1;
  unlock?: undefined;
  estimate?: undefined;
}

export interface QuestUpgrade extends QuestBase {
  type: UpgradeQuestType.INTERLUDE | UpgradeQuestType.RANKUP;
}

export type BundledQuest = QuestOther | QuestUpgrade;

export type UpgradeMapSkill = { type: "skill"; id?: number; newId: number };
export type UpgradeMapNP = { type: "np"; id: number; newId: number };
export type UpgradeMap = UpgradeMapSkill | UpgradeMapNP;

export interface Upgrade /* Base */ {
  quest: number; // quest id
  servant: number; // servant id
  upgrades?: UpgradeMap;
  na?: true;
}
