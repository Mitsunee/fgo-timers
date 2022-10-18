import { ClassName } from "@atlasacademy/api-connector";

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

export type BasicQuest = QuestOther | QuestUpgrade;

// WIP: maybe just extend BasicServant?
interface _UpgradesServant {
  name: string;
  search: string; // search subject
  className: ClassName;
  icon: string;
  na?: true;
}

// interface _BasicSkill {
//  name: string;
//  icon: string;
//  border?: FGOSkillBorder;
//  na?: true;
//}
//
// interface _BasicNP {
//  name: string;
//  type: "buster" | "quick" | "arts";
//  border?: FGOSkillBorder;
//  na?: true;
//}

export type UpgradeMap =
  | { type: "skill"; id?: number; newId: number }
  | { type: "np"; id: number; newId: number };

export interface Upgrade {
  quest: number; // quest id
  servant: number; // servant id
  upgrades?: UpgradeMap;
  na?: true;
}
