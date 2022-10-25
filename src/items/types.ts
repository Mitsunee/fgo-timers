import { ServantBorder } from "../servants/types";
import { Borders } from "../types/borders";

export type ItemBorder =
  | Borders.BRONZE
  | Borders.SILVER
  | Borders.GOLD
  | Borders.BLUE;

interface ItemBase {
  name: string;
  icon: string;
  na?: true;
}

export interface BundledCE extends ItemBase {
  border: ServantBorder;
}

export interface BundledItem extends ItemBase {
  border: ItemBorder;
}

type CustomItemRarity = "bronze" | "silver" | "gold" | "blue";

export interface CustomItem extends ItemBase {
  id: number;
  rarity: CustomItemRarity;
  na?: undefined;
}

export function mapCustomItemRarityToBorder(
  rarity: CustomItemRarity
): ItemBorder {
  switch (rarity) {
    case "bronze":
      return Borders.BRONZE;
    case "silver":
      return Borders.SILVER;
    case "gold":
      return Borders.GOLD;
    default:
      return Borders.BLUE;
  }
}
