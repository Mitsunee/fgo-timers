import { ItemBackgroundType } from "@atlasacademy/api-connector/dist/Schema/Item.js";
import type { CustomItemSchema } from "../schema/CustomItem";
import type { z } from "zod";
import type { ServantBorder } from "../servants/types";
import { Borders } from "../types/borders";
import type { Availability } from "../types/enum";

// TODO: rename "CE" and "CC" types to "CraftEssence" and "CommandCode"

export type ItemBorder =
  | Borders.BRONZE
  | Borders.SILVER
  | Borders.GOLD
  | Borders.BLUE
  | Borders.ZERO;

export type CCBorder = Borders.BRONZE | Borders.SILVER | Borders.GOLD;

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

export interface BundledCC extends ItemBase {
  rarity: number;
  border: CCBorder;
}

export interface BundledItem extends ItemBase {
  border: ItemBorder;
}

export type CustomItem = z.infer<typeof CustomItemSchema>;

export interface BundledLoginTicket {
  name: string;
  start: number;
  next: number;
  items: number[];
  na?: true;
}

export interface BundledMysticCode {
  name: string;
  iconM: string;
  iconF: string;
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

/**
 * Maps non-zero rarity to CCBorder and CCBackground
 * @params rarity
 * @returns Borders enum value
 */
export function mapCCRarityToBorder(rarity: number): CCBorder {
  switch (rarity) {
    case 1:
    case 2:
      return Borders.BRONZE;
    case 3:
      return Borders.SILVER;
    default:
      return Borders.GOLD;
  }
}
