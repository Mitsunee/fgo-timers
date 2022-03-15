import { prepareAtlasCache } from "../utils/atlasacademy/prepareCache.mjs";
import { bundleBackgrounds } from "./bundleBackgrounds.mjs";
import { bundleEvents } from "./bundleEvents.mjs";
import { bundleLoginTickets } from "./bundleLoginTickets.mjs";
import { bundlePrismShops } from "./bundlePrismShops.mjs";

(async function main() {
  // update cache
  await prepareAtlasCache();

  // TODO: prepare master missions in redis

  // run bundlers
  await Promise.all([
    bundleBackgrounds(),
    bundleEvents(),
    bundleLoginTickets(),
    bundlePrismShops()
  ]);
})();
