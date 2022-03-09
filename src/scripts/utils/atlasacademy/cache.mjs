import { createHash } from "crypto";
import { readFileJson } from "@foxkit/node-util/fs";

export const cachePath = ".next/cache/atlasacademy";

export const cacheTargets = {
  NA: [
    "nice_servant.json",
    "nice_item.json"
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
