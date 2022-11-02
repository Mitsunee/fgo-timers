import { join } from "path";
import { readFileJson } from "@foxkit/node-util/fs";

import { Log } from "src/utils/log";
import { BundledNP, BundledServant, BundledSkill } from "./types";

const servantsPath = join("assets", "static", "data", "servants.json");
export async function getBundledServants(): Promise<IDMap<BundledServant>> {
  const data = await readFileJson<IDMap<BundledServant>>(servantsPath);
  if (!data) {
    Log.error(`Could not read ${servantsPath}`);
    throw new Error("File not found");
  }
  return data;
}

const skillsPath = join("assets", "static", "data", "skills.json");
export async function getBundledSkills(): Promise<IDMap<BundledSkill>> {
  const data = await readFileJson<IDMap<BundledSkill>>(skillsPath);
  if (!data) {
    Log.error(`Could not read ${skillsPath}`);
    throw new Error("File not found");
  }
  return data;
}

const npsPath = join("assets", "static", "data", "nps.json");
export async function getBundledNPs(): Promise<IDMap<BundledNP>> {
  const data = await readFileJson<IDMap<BundledNP>>(npsPath);
  if (!data) {
    Log.error(`Could not read ${npsPath}`);
    throw new Error("File not found");
  }
  return data;
}
