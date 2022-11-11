import { Borders } from "src/types/borders";
import { ItemBorder } from "./types";

export enum ItemBackgrounds {
  BRONZE,
  SILVER,
  GOLD,
  BLUE,
  ZERO
}

const basePath = "/assets/backgrounds/material_bg_";

export const ItemBackgroundPath: Record<ItemBackgrounds, string> = {
  [ItemBackgrounds.BRONZE]: `${basePath}bronze.png`,
  [ItemBackgrounds.SILVER]: `${basePath}silver.png`,
  [ItemBackgrounds.GOLD]: `${basePath}gold.png`,
  [ItemBackgrounds.BLUE]: `${basePath}blue.png`,
  [ItemBackgrounds.ZERO]: `${basePath}zero.png`
};

// TODO: make sure the fallbacks look good (some are a bit dark right now)
export const ItemBackgroundFromBorder: Record<
  ItemBorder,
  { path: string; fallback: string }
> = {
  [Borders.BRONZE]: {
    path: ItemBackgroundPath[ItemBackgrounds.BRONZE],
    fallback: "#56361d"
  },
  [Borders.SILVER]: {
    path: ItemBackgroundPath[ItemBackgrounds.SILVER],
    fallback: "#6d6d6d"
  },
  [Borders.GOLD]: {
    path: ItemBackgroundPath[ItemBackgrounds.GOLD],
    fallback: "#f9e677"
  },
  [Borders.BLUE]: {
    path: ItemBackgroundPath[ItemBackgrounds.BLUE],
    fallback: "#366baf"
  },
  [Borders.ZERO]: {
    path: ItemBackgroundPath[ItemBackgrounds.ZERO],
    fallback: "#82b1c3"
  }
};
