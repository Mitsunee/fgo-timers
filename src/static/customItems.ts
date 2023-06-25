import path from "path";
import type { BundledItem } from "~/items/types";
import { BundleFile } from "./Bundle";

export const name = "Custom Items";
export const filePath = path.join(
  process.cwd(),
  "assets/static/custom_items.json"
);
export const File = new BundleFile<BundledItem[]>(filePath);

/**
 * Reads Custom Items bundle
 * @returns Bundled data
 */
export const getBundledItems = File.readFile.bind(File);

/**
 * Writes to Custom Items bundle
 * @param data Array of bundled Custom Items
 * @returns FileWriteResult
 */
export const writeBundledItems = File.writeFile.bind(File);
