import { Log } from "../utils/log";
import { prepareCache } from "../atlas-api/prepare";
import { bundleBackgrounds } from "./bundleBackgrounds";
import { bundleEvents } from "./bundleEvents.mjs";
import { bundleLoginTickets } from "./bundleLoginTickets.mjs";
import { bundlePrismShops } from "./bundlePrismShops.mjs";
import { PrebuildBundler, runLegacyBundler, writeBundle } from "./bundlers";
import { bundleUpgrades } from "./bundleUpgrades";
import { bundleQuestsData } from "./bundleQuestsData";
import { DataBundler, writeDataBundle } from "./dataBundlers";

function isSuccessful<T>(arr: Array<T | false>): arr is Array<T> {
  return arr.every(el => el !== false);
}

(async function main() {
  // Phase 0 - Prepare Cache
  await prepareCache();

  // Phase 1 - Run legacy bundlers
  Log.info("Running Legacy Bundlers");
  const resLegacy: boolean[] = await Promise.all([
    runLegacyBundler(bundleBackgrounds),
    runLegacyBundler(bundleEvents),
    runLegacyBundler(bundleLoginTickets),
    runLegacyBundler(bundlePrismShops)
  ]);
  if (!isSuccessful(resLegacy)) {
    Log.die("Quitting early because of error in legacy bundler");
  }

  // Phase 2 - bundlers
  Log.info("Running Bundlers");
  const bundlersRes: Awaited<ReturnType<PrebuildBundler<object>>>[] =
    await Promise.all([bundleUpgrades()]);
  if (!isSuccessful(bundlersRes)) {
    Log.die("Quitting early because of error in bundler");
  }
  if (!isSuccessful(await Promise.all(bundlersRes.map(writeBundle)))) {
    Log.error("Quitting early due to bundle write failure");
    Log.warn("Current static bundles may be in an invalid state");
    process.exit(1);
  }

  // Phase 3 - static data bundles
  // TODO: data bundles: quests, servants, ces, skills, nps
  Log.info("Running Data Bundlers");
  const dataRes: Awaited<ReturnType<DataBundler<object>>>[] = await Promise.all(
    [bundleQuestsData(bundlersRes)]
  );
  if (!isSuccessful(dataRes)) {
    Log.die("Quitting early because of error in data bundler");
  }
  if (!isSuccessful(await Promise.all(dataRes.map(writeDataBundle)))) {
    Log.error("Quitting early due to data bundle write failure");
    Log.warn("Current static bundles may be in an invalid state");
    process.exit(1);
  }
  Log.die("Static Data Bundlers not yet fully implemented", {
    Missing: ["servants", "skills", "nps", "ces"]
  });
})();
