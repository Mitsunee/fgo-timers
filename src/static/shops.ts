import path from "path";
import type { BundledShop } from "~/shops/types";
import { BundleFile } from "./Bundle";

const filePath = path.join(process.cwd(), "assets/static/shops.json");
export const ShopsFile = new BundleFile<BundledShop[]>({
  name: "Shops",
  filePath
});

/**
 * Reads Shops bundle
 * @returns Bundled data
 */
export const getBundledShops = ShopsFile.readBundle.bind(ShopsFile);

/**
 * Writes to Shops bundle
 * @param data Array of bundled Shops
 * @returns FileWriteResult
 */
export const writeBundledShops = ShopsFile.writeBundle.bind(ShopsFile);
