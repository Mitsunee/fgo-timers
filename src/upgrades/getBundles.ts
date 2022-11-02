import { join } from "path";
import { readFileJson } from "@foxkit/node-util/fs";
import type { BundledQuest, Upgrade } from "./types";
import { Log } from "src/utils/log";

const questsPath = join("assets", "static", "data", "quests.json");
export async function getBundledQuests(): Promise<IDMap<BundledQuest>> {
  const data = await readFileJson<IDMap<BundledQuest>>(questsPath);
  if (!data) {
    Log.error(`Could not read ${questsPath}`);
    throw new Error("File not found");
  }
  return data;
}

const upgradesPath = join("assets", "static", "upgrades.json");
export async function getBundledUpgrades(): Promise<Upgrade[]> {
  const data = await readFileJson<Upgrade[]>(upgradesPath);
  if (!data) {
    Log.error(`Could not read ${upgradesPath}`);
    throw new Error("File not found");
  }
  return data;
}
