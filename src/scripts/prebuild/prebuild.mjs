//import { prepareAtlasCache } from "../utils/atlasacademy/prepareCache.mjs";
import { bundleBackgrounds } from "./bundleBackgrounds.mjs";

(async function main() {
  // TEMP: don't update cache while it's not in use
  // update cache
  //await prepareAtlasCache();

  // TODO: bundle static data (backgrounds, events, login ticket)

  // run bundlers
  await Promise.all([bundleBackgrounds()]);
})();
