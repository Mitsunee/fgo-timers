import { Borders } from "~/types/borders";
import type { ItemBorder } from "./types";

export const enum ItemBackgrounds {
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

export const ItemBackgroundFromBorder: Record<ItemBorder, string> = {
  [Borders.BRONZE]: ItemBackgroundPath[ItemBackgrounds.BRONZE],
  [Borders.SILVER]: ItemBackgroundPath[ItemBackgrounds.SILVER],
  [Borders.GOLD]: ItemBackgroundPath[ItemBackgrounds.GOLD],
  [Borders.BLUE]: ItemBackgroundPath[ItemBackgrounds.BLUE],
  [Borders.ZERO]: ItemBackgroundPath[ItemBackgrounds.ZERO]
};
