import { createHash } from "crypto";

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
