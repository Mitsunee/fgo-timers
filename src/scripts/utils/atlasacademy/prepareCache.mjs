import fetch from "node-fetch";
import { readFileJson, writeFile } from "@foxkit/node-util/fs";
import { atlasExport } from "./api.mjs";
import { log } from "@foxkit/node-util/log";

export const cachePath = ".next/cache/atlasacademy";

async function fetchApiInfo() {
  const res = await fetch("https://api.atlasacademy.io/info");
  const { NA, JP } = await res.json();

  return { NA: NA.timestamp, JP: JP.timestamp };
}

async function getCacheStatus() {
  const infoLocal = await readFileJson(`${cachePath}/info.json`);
  const info = await fetchApiInfo();
  const updateNa = !infoLocal || infoLocal.NA < info.NA;
  const updateJp = !infoLocal || infoLocal.JP < info.JP;

  if (!info) {
    throw new Error("Could not reach AtlasAcademy API");
  }

  if (!infoLocal) {
    log("No local cache found");
  }

  return { info, updateNa, updateJp };
}

async function updateCacheFile(region, file) {
  const data = await atlasExport[region](file);
  if (!data) {
    throw new Error(`Could not retrieve ${file} for region ${region}`);
  }

  await writeFile(`${cachePath}/${region}/${file}`, data);
}

export async function prepareAtlasCache() {
  const { info, updateNa, updateJp } = await getCacheStatus();

  if (updateNa) {
    await updateCacheFile("NA", "nice_servant.json");
    await updateCacheFile("NA", "nice_item.json");
    //await updateCacheFile("NA","nice_equip.json");
    log.success("Updated AtlasAcademy API NA Cache");
  }

  if (updateJp) {
    await updateCacheFile("JP", "nice_servant_lang_en.json");
    await updateCacheFile("JP", "nice_item_lang_en.json");
    //await updateCacheFile("JP","nice_equip_lang_en.json");
    log.success("Updated AtlasAcademy API JP Cache");
  }

  // update local info
  if (updateNa || updateJp) {
    await writeFile(`${cachePath}/info.json`, info);
  }
}
