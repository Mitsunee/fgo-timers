import path from "path";
import type { BundledUpgrade } from "~/upgrades/types";
import { BundleFile } from "./Bundle";

export const name = "Upgrades";
export const filePath = path.join(process.cwd(), "assets/static/upgrades.json");
export const File = new BundleFile<BundledUpgrade[]>(filePath);

/**
 * Reads Upgrades bundle
 * @returns Bundled data
 */
export const getBundledUpgrades = File.readFile.bind(File);

/**
 * Writes to Upgrades bundle
 * @param data Array of bundled Upgrades
 * @returns FileWriteResult
 */
export const writeBundledUpgrades = File.writeFile.bind(File);
