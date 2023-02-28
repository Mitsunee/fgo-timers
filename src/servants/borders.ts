import { Borders } from "../types/borders";
import type { ServantBorder, SkillBorder } from "./types";

/**
 * Maps Servant rarity as number to Borders enum value
 * @param rarity rarity of Servant
 * @returns ServantBorder
 */
export function mapServantRarityToBorder(rarity: number): ServantBorder {
  switch (rarity) {
    case 0:
      return Borders.BLACK;
    case 1:
    case 2:
      return Borders.BRONZE;
    case 3:
      return Borders.SILVER;
    case 4:
    case 5:
    default:
      return Borders.GOLD;
  }
}

/**
 * Maps Upgrade level as number to Borders enum value
 * @param level Upgrade level of skill
 * @returns SkillBorder
 */
export function mapUpgradeLevelToSkillBorder(level: number): SkillBorder {
  switch (level) {
    case 0:
      return Borders.BLACK;
    case 1:
      return Borders.GOLD;
    case 2:
    default:
      return Borders.RED;
  }
}
