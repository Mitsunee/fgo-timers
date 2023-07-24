import path from "path";
import { z } from "zod";
import { ParsedYaml } from "./ParsedYaml";
import { zBorderOptional } from "./zBorder";
import { zDurationStrict } from "./zDate";

const zShopItem = z.object({
  type: z
    .enum(["item", "ce", "cc", "servant", "mc", "costume"])
    .default("item"),
  id: z.number(),
  name: z.string().optional(),
  requires: z.string().optional(),
  cost: z.number(),
  amount: z.number().default(1),
  stack: z.number().optional()
});

const zShopInventory = z.object({
  title: z.string().optional(),
  currency: z.number(),
  items: z.array(zShopItem)
});

const zShopInventoryMonthly = zShopInventory.extend({
  day: z.number().int().min(0).max(30),
  hour: z.number().int().min(0).max(23)
});

const zShopInventoryLimited = zShopInventory.extend({
  date: zDurationStrict
});

export const ShopSchema = z.object({
  title: z.string(),
  color: zBorderOptional,
  inventory: z.array(zShopInventory),
  monthly: z.array(zShopInventoryMonthly).min(1).optional(),
  limited: z.array(zShopInventoryLimited).min(1).optional()
});

export type AnyShopInventory = z.output<typeof zShopInventory> &
  Partial<z.output<typeof zShopInventoryMonthly>> &
  Partial<z.output<typeof zShopInventoryLimited>>;

export type ShopItem = z.output<typeof zShopItem>;

export function checkShopPath(path: string): boolean {
  return /assets\/data\/shop\/[\w-]+\.yml$/.test(path);
}

export const ShopFile = new ParsedYaml({
  schema: ShopSchema,
  limitPath: path.join(process.cwd(), "assets/data/shops")
});
