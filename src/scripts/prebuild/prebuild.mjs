import { prepareAtlasCache } from "../utils/atlasacademy/prepareCache.mjs";
import { bundleBackgrounds } from "./bundleBackgrounds.mjs";
import { bundleEvents } from "./bundleEvents.mjs";
import { bundleLoginTickets } from "./bundleLoginTickets.mjs";
import { bundlePrismShops } from "./bundlePrismShops.mjs";
import { buildSVGComponents } from "./buildSVGComponents.mjs";

(async function main() {
  // update cache
  await prepareAtlasCache();

  // TODO: prepare master missions in redis?

  // run bundlers
  const success = await Promise.all([
    buildSVGComponents(),
    bundleBackgrounds(),
    bundleEvents(),
    bundleLoginTickets(),
    bundlePrismShops()
  ]);

  // exit with 0 or 1 depending on if all build steps completed correctly
  process.exit(success.every(res => res === true) ? 0 : 1);
})();
