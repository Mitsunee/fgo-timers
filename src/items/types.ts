import { ItemBackgroundType } from "@atlasacademy/api-connector/dist/Schema/Item.js";
import { CustomItemSchema } from "../schema/CustomItem";
import { z } from "zod";
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

export type CustomItem = z.infer<typeof CustomItemSchema>;

export function mapCustomItemRarityToBorder(
  rarity: CustomItem["rarity"]
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

export function mapItemBackgroundToBorder(
  background: ItemBackgroundType
): ItemBorder {
  switch (background) {
    case ItemBackgroundType.BRONZE:
      return Borders.BRONZE;
    case ItemBackgroundType.GOLD:
      return Borders.GOLD;
    case ItemBackgroundType.QUEST_CLEAR_QP_REWARD:
      return Borders.BLUE;
    case ItemBackgroundType.SILVER:
    case ItemBackgroundType.ZERO:
    default:
      return Borders.SILVER;
  }
}
