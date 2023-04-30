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

const MixedShopItem = ShopItem.extend({
  currency: z.number()
});

const ShopItemLimited = ShopItem.extend({
  date: zDurationStrict
});

const MixedShopItemLimited = ShopItemLimited.extend({
  currency: z.number()
});

export const ShopSchema = z.object({
  title: z.string(),
  currency: z.number(),
  color: zBorderOptional,
  inventory: z.array(ShopItem),
  monthly: z.array(ShopItem).optional(),
  limited: z.array(ShopItemLimited).optional()
});

export const MixedShopSchema = ShopSchema.pick({
  title: true,
  color: true
}).extend({
  inventory: z.array(MixedShopItem),
  monthly: z.array(MixedShopItem).optional(),
  limited: z.array(MixedShopItemLimited).optional()
});

export type Shop = z.output<typeof ShopSchema>;
export type MixedShop = z.output<typeof MixedShopSchema>;
