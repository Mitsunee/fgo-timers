import { prepareAtlasCache } from "../utils/atlasacademy/prepareCache.mjs";
import { bundleBackgrounds } from "./bundleBackgrounds.mjs";

(async function main() {
  // update cache
  await prepareAtlasCache();

  // TODO: bundle static data (backgrounds, events, login ticket)
  // TOOD: prepare master missions in redis

  // run bundlers
  await Promise.all([bundleBackgrounds()]);
})();
