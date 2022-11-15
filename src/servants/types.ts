import type { NoblePhantasm } from "@atlasacademy/api-connector/dist/Schema/NoblePhantasm";
import type { Skill } from "@atlasacademy/api-connector/dist/Schema/Skill";
import { ClassName } from "@atlasacademy/api-connector";
import { Borders } from "../types/borders";

export type SkillBorder = Borders.BLACK | Borders.GOLD | Borders.RED;

export type ServantBorder =
  | Borders.BLACK
  | Borders.BRONZE
  | Borders.SILVER
  | Borders.GOLD;

export enum ServantCard {
  BUSTER,
  ARTS,
  QUICK,
  EXTRA
}

export type NPType = ServantCard.BUSTER | ServantCard.ARTS | ServantCard.QUICK;

export enum ServantAvailability {
  PERMANENT,
  STORYLOCKED,
  LIMITED,
  WELFARE,
  FP_POOL,
  FP_LIMITED,
  FP_LOCKED
}

export interface BundledServant {
  name: string;
  search: string;
  icon: string;
  classId: ClassName;
  border: ServantBorder;
  rarity: number;
  na?: true;
  availability?: ServantAvailability;
}

export interface BundledSkill {
  name: string;
  num: number | IDMap<number>; // servant id or map servant id to skill num
  icon: string;
  border: SkillBorder;
  na?: true;
}

export interface BundledNP {
  name: string;
  type: NPType;
  border: SkillBorder;
  na?: true;
}

export function isSkill(subject: Skill | NoblePhantasm): subject is Skill {
  return !Object.keys(subject).includes("card");
}
