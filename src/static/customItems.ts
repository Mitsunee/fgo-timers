import path from "path";
import type { BundledItem } from "~/items/types";
import { BundleFile } from "./Bundle";

const filePath = path.join(process.cwd(), "assets/static/custom_items.json");
export const CustomItemFile = new BundleFile<BundledItem[]>({
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
