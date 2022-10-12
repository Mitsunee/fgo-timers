import { prepareCache } from "../atlas-api/prepare";
import { bundleBackgrounds } from "./bundleBackgrounds";
import { bundleEvents } from "./bundleEvents.mjs";
import { bundleLoginTickets } from "./bundleLoginTickets.mjs";
import { bundlePrismShops } from "./bundlePrismShops.mjs";
import { runLegacyBundler } from "./bundlers";

(async function main() {
  // Phase 0 - Prepare Cache
  await prepareCache();

  // Phase 1 - Run legacy bundlers
  const resLegacy: boolean[] = await Promise.all([
    runLegacyBundler(bundleBackgrounds),
    runLegacyBundler(bundleEvents),
    runLegacyBundler(bundleLoginTickets),
    runLegacyBundler(bundlePrismShops)
  ]);

  // TODO: only exit on error, otherwise continue to Phase 2
  process.exit(resLegacy.every(res => res === true) ? 0 : 1);
})();
