import { z } from "zod";
import { zDurationStrict } from "./zDate";
import { zBorderOptional } from "./zBorder";

const ShopItem = z.object({
  type: z.enum(["item", "ce", "cc", "servant", "mc"]).default("item"), // TODO: support for costumes
  id: z.number(),
  name: z.string().optional(),
  requires: z.string().optional(),
  cost: z.number(),
  amount: z.number().default(1),
  stack: z.number().optional()
});

const ShopInventory = z.object({
  title: z.string().optional(),
  currency: z.number(),
  items: z.array(ShopItem)
});

const ShopInventoryLimited = ShopInventory.extend({
  date: zDurationStrict
});

export const ShopSchema = z.object({
  title: z.string(),
  color: zBorderOptional,
  inventory: z.array(ShopInventory),
  monthly: z.array(ShopInventory).min(1).optional(),
  limited: z.array(ShopInventoryLimited).min(1).optional()
});

type ParsedShop = z.output<typeof ShopSchema>;
export interface BundledShop extends ParsedShop {
  slug: string;
}
