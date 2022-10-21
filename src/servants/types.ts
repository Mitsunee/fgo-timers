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

export interface BundledServant {
  name: string;
  search: string;
  icon: string;
  className: ClassName;
  border: ServantBorder;
  na?: true;
}

export interface BundledSkill {
  name: string;
  num: number;
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
