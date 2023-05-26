import { Borders } from "~/types/borders";
import type { CCBorder } from "./types";

export const enum CCBackgrounds {
  BRONZE,
  SILVER,
  GOLD
}

const basePath = "/assets/backgrounds/cc_";

export const CCBackgroundPath: Record<CCBackgrounds, string> = {
  [CCBackgrounds.BRONZE]: `${basePath}bronze.png`,
  [CCBackgrounds.SILVER]: `${basePath}silver.png`,
  [CCBackgrounds.GOLD]: `${basePath}gold.png`
};

export const CCBackgroundFromBorder: Record<CCBorder, string> = {
  [Borders.BRONZE]: CCBackgroundPath[CCBackgrounds.BRONZE],
  [Borders.SILVER]: CCBackgroundPath[CCBackgrounds.SILVER],
  [Borders.GOLD]: CCBackgroundPath[CCBackgrounds.GOLD]
};
