import path from "path";
import type { BundledShop } from "~/schema/ShopSchema";
import { BundleFile } from "./Bundle";

export const name = "Shops";
export const filePath = path.join(process.cwd(), "assets/static/shops.json");
export const File = new BundleFile<BundledShop[]>(filePath);

/**
 * Reads Shops bundle
 * @returns Bundled data
 */
export const getBundledShops = File.readFile.bind(File);

/**
 * Writes to Shops bundle
 * @param data Array of bundled Shops
 * @returns FileWriteResult
 */
export const writeBundledShops = File.writeFile.bind(File);
