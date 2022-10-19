export enum FGOBorders {
  BLACK,
  BRONZE,
  SILVER,
  GOLD,
  RED,
  BLUE
}

export type FGOSkillBorder =
  | FGOBorders.BLACK
  | FGOBorders.GOLD
  | FGOBorders.RED;

export type FGOItemBorder =
  | FGOBorders.BRONZE
  | FGOBorders.SILVER
  | FGOBorders.GOLD
  | FGOBorders.BLUE;

export type FGOServantBorder =
  | FGOBorders.BLACK
  | FGOBorders.BRONZE
  | FGOBorders.SILVER
  | FGOBorders.GOLD;
