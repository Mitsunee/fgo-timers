import fetch from "node-fetch";
import { readFileJson } from "@foxkit/node-util/fs";

import { getCurrentTime } from "../getCurrentTime.mjs";
import * as log from "../log.mjs";
import { cachePath, cacheVersion } from "./cache.mjs";

async function fetchApiInfo() {
  const res = await fetch("https://api.atlasacademy.io/info");
  const { NA, JP } = await res.json();

  return { NA: NA.timestamp, JP: JP.timestamp };
}

export async function getCacheStatus() {
  const now = getCurrentTime();
  const infoLocal = await readFileJson(`${cachePath}/info.json`);
  const cacheVersionMatch = infoLocal?.version === cacheVersion;

  // log if no cache or version missmatch
  if (!infoLocal) {
    log.info("No local API cache found");
  } else if (!cacheVersionMatch) {
    log.info("API Cache version missmatch");
  }

  // skip if cache version matches and last check was within the past hour
  if (infoLocal && cacheVersionMatch && infoLocal.lastChecked + 3600 > now) {
    log.info("Skipped API Cache update");
    return {}; //{ info: infoLocal };
  }

  const info = await fetchApiInfo();
  // throw on unavailable API
  if (!info) {
    throw new Error("Could not reach AtlasAcademy API");
  }

  const updateNa = !infoLocal || !cacheVersionMatch || infoLocal.NA < info.NA;
  const updateJp = !infoLocal || !cacheVersionMatch || infoLocal.JP < info.JP;

  return {
    newInfo: { ...info, version: cacheVersion, lastChecked: now },
    updateNa,
    updateJp
  };
}
