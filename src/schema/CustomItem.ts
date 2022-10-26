import { z } from "zod";

export const CustomItemSchema = z.object({
  id: z.number().describe("Item ID as number"),
  name: z.string().describe("Item name as string"),
  icon: z.string().describe("Full icon url as string"),
  rarity: z
    .enum(["bronze", "silver", "gold", "blue"])
    .describe("Item rarity as word")
});

export function checkCustomItemPath(path: string): boolean {
  return /assets\/data\/items\/[\w-]+\.yml$/.test(path);
}
