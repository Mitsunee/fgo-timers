import { createHash } from "crypto";
import { readFileJson, writeFile } from "@foxkit/node-util/fs";
import { atlasExport } from "./api.mjs";

export const cachePath = ".next/cache/atlasacademy";

export const cacheTargets = {
  NA: [
    "nice_servant.json",
    "nice_item.json",
    "nice_master_mission.json"
    //,"nice_equip.json"
  ],
  JP: [
    "nice_servant_lang_en.json",
    "nice_item_lang_en.json"
    //,"nice_equip_lang_en.json"
  ]
};

export const cacheVersion = createHash("md5")
  .update(JSON.stringify(cacheTargets))
  .digest("hex");

export async function readFromCache(region, file) {
  return readFileJson(`${cachePath}/${region}/${file}`);
}

export async function updateCacheFile(region, file) {
  const data = await atlasExport[region](file);
  if (!data) {
    throw new Error(`Could not retrieve ${file} for region ${region}`);
  }

  await writeFile(`${cachePath}/${region}/${file}`, data);
}
