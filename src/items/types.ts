import { ItemBackgroundType } from "@atlasacademy/api-connector/dist/Schema/Item.js";
import type { CustomItemSchema } from "../schema/CustomItem";
import type { z } from "zod";
import type { ServantBorder } from "../servants/types";
import { Borders } from "../types/borders";
import type { Availability } from "../types/enum";

export type ItemBorder =
  | Borders.BRONZE
  | Borders.SILVER
  | Borders.GOLD
  | Borders.BLUE
  | Borders.ZERO;

interface ItemBase {
  name: string;
  icon: string;
  na?: true;
}

export interface BundledCE extends ItemBase {
  border: ServantBorder;
  rarity: number;
  availability?: Availability;
}

export interface BundledItem extends ItemBase {
  border: ItemBorder;
}

export type CustomItem = z.infer<typeof CustomItemSchema>;

export interface BundledLoginTicket {
  start: number;
  next: number;
  items: number[];
  na?: true;
}

/**
 * Maps rarity as string to Borders enum value
 * @param rarity rarity as string
 * @returns Borders enum value
 */
export function mapCustomItemRarityToBorder(
  rarity: CustomItem[number]["rarity"]
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

/**
 * Maps ItemBackgroundType used in API data to Borders enum value
 * @param background background property of API's item data
 * @returns Borders enum value
 */
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
    case ItemBackgroundType.ZERO:
      return Borders.ZERO;
    case ItemBackgroundType.SILVER:
    default:
      return Borders.SILVER;
  }
}
