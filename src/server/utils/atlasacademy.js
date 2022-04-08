import { createApi } from "picoapi";
import { readFileJson } from "@foxkit/node-util/fs";

import { createServerError } from "./createServerError";

// TODO: add default headers when that feature is added to picoapi

const basePath = "https://api.atlasacademy.io";
export const cachePath = ".next/cache/atlasacademy";

// nice endpoints
export const atlasNa = createApi(`${basePath}/nice/NA`);
export const atlasJp = createApi(`${basePath}/nice/JP`);

// basic endpoints
export const atlasBasicNa = createApi(`${basePath}/basic/NA`);
export const atlasBasicJp = createApi(`${basePath}/basic/JP`);

// exports endpoints
export const atlasExport = createApi(`${basePath}/export`); // NOTE: add transformer to enforce .json ext

// cache helper functions
export async function readFromCache(region, file) {
  const data = await readFileJson(`${cachePath}/${region}/${file}`);

  if (!data) {
    throw createServerError(
      `Could not find ${file} for region ${region} in atlasacademy cache`
    );
  }

  return data;
}

export async function readCacheInfo() {
  return readFileJson(`${cachePath}/info.json`);
}
