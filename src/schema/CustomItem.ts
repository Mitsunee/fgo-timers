import path from "path";
import { z } from "zod";
import { ParsedYaml } from "./ParsedYaml";

export const CustomItemSchema = z.array(
  z.object({
    id: z.number().describe("Item ID as number"),
    name: z.string().describe("Item name as string"),
    icon: z.string().describe("Full icon url as string"),
    rarity: z
      .enum(["bronze", "silver", "gold", "blue"])
      .describe("Item rarity as word")
  })
);

export function checkCustomItemPath(path: string): boolean {
  return /assets\/data\/items\/[\w-]+\.yml$/.test(path);
}

export const CustomItemFile = new ParsedYaml({
  name: "Custom Item",
  schema: CustomItemSchema,
  limitPath: path.join(process.cwd(), "assets/data/items")
});
