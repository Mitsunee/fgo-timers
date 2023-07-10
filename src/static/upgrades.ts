import path from "path";
import type { BundledUpgrade } from "~/upgrades/types";
import { BundleFile } from "./Bundle";

const filePath = path.join(process.cwd(), "assets/static/upgrades.json");
export const UpgradesFile = new BundleFile<BundledUpgrade[]>({
  name: "Upgrades",
  filePath
});

/**
 * Reads Upgrades bundle
 * @returns Bundled data
 */
export const getBundledUpgrades = UpgradesFile.readBundle.bind(UpgradesFile);

/**
 * Writes to Upgrades bundle
 * @param data Array of bundled Upgrades
 * @returns FileWriteResult
 */
export const writeBundledUpgrades = UpgradesFile.writeBundle.bind(UpgradesFile);
