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

export type UpgradeMap =
  | {
      type: "skill";
      id?: number;
      newId: number;
    }
  | { type: "np"; id: number; newId: number };

export interface QuestInterlude extends QuestBase {
  type: UpgradeQuestType.INTERLUDE;
  open: number;
  servant: number;
}

export interface QuestRankup extends QuestBase {
  type: UpgradeQuestType.RANKUP;
  open: number;
  servant: number;
  upgrade: UpgradeMap;
}

export type BasicQuest = QuestOther | QuestInterlude | QuestRankup;

// WIP: maybe just extend BasicServant?
export interface UpgradesServant {
  name: string;
  search: string; // search subject
  className: ClassName;
  icon: string;
  na?: true;
}

//export interface BasicSkill {
//  name: string;
//  icon: string;
//  border?: FGOSkillBorder;
//  na?: true;
//}
//
//export interface BasicNP {
//  name: string;
//  type: "buster" | "quick" | "arts";
//  border?: FGOSkillBorder;
//  na?: true;
//}

export interface Upgrade {
  quest: number; // quest id
  servant: number; // servant id
  upgrades?: UpgradeMap;
  na?: true;
}
