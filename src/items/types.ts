import type { z } from "zod";
import type { CustomItemSchema } from "~/schema/CustomItem";
import type { ServantBorder } from "~/servants/types";
import type { Borders } from "~/types/borders";
import type { Availability } from "~/types/enum";

export type ItemBorder =
  | Borders.BRONZE
  | Borders.SILVER
  | Borders.GOLD
  | Borders.BLUE
  | Borders.ZERO;

export type CommandCodeBorder = Borders.BRONZE | Borders.SILVER | Borders.GOLD;

interface ItemBase {
  name: string;
  icon: string;
  na?: true;
}

export interface BundledCraftEssence extends ItemBase {
  border: ServantBorder;
  rarity: number;
  availability?: Availability;
}

export interface BundledCommandCode extends ItemBase {
  rarity: number;
  border: CommandCodeBorder;
}

export interface BundledItem extends ItemBase {
  border: ItemBorder;
}

export type CustomItem = z.infer<typeof CustomItemSchema>;

export interface BundledExchangeTicket {
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

export interface BundledCostume extends ItemBase {
  border: ServantBorder;
}
