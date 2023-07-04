import path from "path";
import type { BundledItem } from "~/items/types";
import { BundleFile } from "./Bundle";

const filePath = path.join(process.cwd(), "assets/static/custom_items.json");
export const CustomItemFile = new BundleFile<PartialDataMap<BundledItem>>({
  name: "Custom Items",
  filePath
});

/**
 * Reads Custom Items bundle
 * @returns Bundled data
 */
export const getBundledItems = CustomItemFile.readBundle.bind(CustomItemFile);

/**
 * Writes to Custom Items bundle
 * @param data Array of bundled Custom Items
 * @returns FileWriteResult
 */
export const writeBundledItems =
  CustomItemFile.writeBundle.bind(CustomItemFile);

/**
 * Gets custom Item data by id
 * @param id id of custom Item
 * @returns Item or undefined
 */
export async function getCustomItem(id: number) {
  const items = await getBundledItems();
  return items[id];
}
