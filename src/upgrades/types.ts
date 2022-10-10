import { ClassName } from "@atlasacademy/api-connector";
import { FGOSkillBorder } from "../types/borders";

export enum UpgradeQuestType {
  INTERLUDE = "interlude",
  RANKUP = "rankup",
  MAIN = "main",
  UNKNOWN = "unknown"
}

export interface QuestUnlockCondition {
  quests?: number[];
  bond?: number;
  asc?: number;
}

interface QuestBase {
  name: string;
  search: string; // search subject
  open: number; // opening date as timestamp
  type: UpgradeQuestType;
  na?: true;
  unlock?: QuestUnlockCondition;
}

export interface SkippedQuest extends QuestBase {
  type: UpgradeQuestType.MAIN | UpgradeQuestType.UNKNOWN;
  unlock?: undefined;
}

export interface UpgradeMap {
  type: "np" | "skill";
  id: number;
  newId: number;
}

export interface InterludeQuest extends QuestBase {
  type: UpgradeQuestType.INTERLUDE;
  servant: number;
  upgrade?: UpgradeMap;
}

export interface RankUpQuest extends QuestBase {
  type: UpgradeQuestType.RANKUP;
  servant: number;
  upgrade: UpgradeMap;
}

type UpgradesQuest = SkippedQuest | InterludeQuest | RankUpQuest;

// WIP: maybe just extend BasicServant to add na prop?
export interface UpgradesServant {
  name: string;
  search: string; // search subject
  className: ClassName;
  icon: string;
  na?: true;
}

export interface BasicSkill {
  name: string;
  icon: string;
  border?: FGOSkillBorder;
  na?: true;
}

export interface BasicNP {
  name: string;
  type: "buster" | "quick" | "arts";
  border?: FGOSkillBorder;
  na?: true;
}

type IDMap<T> = { [key: number]: T | undefined };

export interface UpgradesData {
  lastUpdated: number;
  data: {
    quests: IDMap<UpgradesQuest>;
    servants: IDMap<UpgradesServant>;
    skills: IDMap<BasicSkill>;
    nps: IDMap<BasicNP>;
  };
}
