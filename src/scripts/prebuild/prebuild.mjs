import { prepareCache } from "../../atlas-api/prepare.ts";
import { bundleBackgrounds } from "./bundleBackgrounds.mjs";
import { bundleEvents } from "./bundleEvents.mjs";
import { bundleLoginTickets } from "./bundleLoginTickets.mjs";
import { bundlePrismShops } from "./bundlePrismShops.mjs";

(async function main() {
  // update cache
  await prepareCache();

  // run bundlers
  const success = await Promise.all([
    bundleBackgrounds(),
    bundleEvents(),
    bundleLoginTickets(),
    bundlePrismShops()
  ]);

  // exit with 0 or 1 depending on if all build steps completed correctly
  process.exit(success.every(res => res === true) ? 0 : 1);
})();
