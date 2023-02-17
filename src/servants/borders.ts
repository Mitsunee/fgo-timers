import { Borders } from "../types/borders";
import type { ServantBorder, SkillBorder } from "./types";

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
