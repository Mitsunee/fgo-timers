import fetch from "node-fetch";
import { readFileJson, writeFile } from "@foxkit/node-util/fs";
import { atlasExport } from "./api.mjs";

import * as log from "../log.mjs";
import { cachePath, cacheTargets, cacheVersion } from "./cache.mjs";

async function fetchApiInfo() {
  const res = await fetch("https://api.atlasacademy.io/info");
  const { NA, JP } = await res.json();

  return { NA: NA.timestamp, JP: JP.timestamp };
}

async function getCacheStatus() {
  // TODO: add a way to skip checking api based on cache age somehow
  let infoLocal = await readFileJson(`${cachePath}/info.json`);
  const info = await fetchApiInfo();

  // throw on unavailable API
  if (!info) {
    throw new Error("Could not reach AtlasAcademy API");
  }

  // invalidate local info on hash missmatch
  if (infoLocal.version !== cacheVersion) {
    infoLocal = false;
  }

  const updateNa = !infoLocal || infoLocal.NA < info.NA;
  const updateJp = !infoLocal || infoLocal.JP < info.JP;

  if (!infoLocal) {
    log.info("No local cache found or version missmatched");
  }

  return { info: { ...info, version: cacheVersion }, updateNa, updateJp };
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
    await Promise.all(cacheTargets.NA.map(file => updateCacheFile("NA", file)));
    log.ready("Updated AtlasAcademy API NA Export Cache");
  }

  if (updateJp) {
    await Promise.all(cacheTargets.JP.map(file => updateCacheFile("JP", file)));
    log.ready("Updated AtlasAcademy API JP Export Cache");
  }

  // update local info
  if (updateNa || updateJp) {
    await writeFile(`${cachePath}/info.json`, info);
  }
}
