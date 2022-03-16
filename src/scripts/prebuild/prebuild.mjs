import { prepareAtlasCache } from "../utils/atlasacademy/prepareCache.mjs";
import { bundleBackgrounds } from "./bundleBackgrounds.mjs";
import { bundleEvents } from "./bundleEvents.mjs";
import { bundleLoginTickets } from "./bundleLoginTickets.mjs";
import { bundlePrismShops } from "./bundlePrismShops.mjs";
import { buildSVGComponents } from "./buildSVGComponents.mjs";

(async function main() {
  // update cache
  await prepareAtlasCache();

  // TODO: prepare master missions in redis
  // TODO: handle returns below (where false means an error occured)

  // run bundlers
  await Promise.all([
    buildSVGComponents(),
    bundleBackgrounds(),
    bundleEvents(),
    bundleLoginTickets(),
    bundlePrismShops()
  ]);
})();
