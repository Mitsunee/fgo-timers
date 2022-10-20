export enum Borders {
  BLACK,
  BRONZE,
  SILVER,
  GOLD,
  RED,
  BLUE
}

// WIP: doesn't belong here, but doesn't have a place yet
export type ItemBorder =
  | Borders.BRONZE
  | Borders.SILVER
  | Borders.GOLD
  | Borders.BLUE;
