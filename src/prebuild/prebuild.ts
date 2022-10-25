import { Log } from "../utils/log";
import { prepareCache } from "../atlas-api/prepare";
import { bundleBackgrounds } from "./bundleBackgrounds";
import { bundleEvents } from "./bundleEvents.mjs";
import { bundleLoginTickets } from "./bundleLoginTickets.mjs";
import { bundlePrismShops } from "./bundlePrismShops.mjs";
import { PrebuildBundlersRes, runLegacyBundler, writeBundle } from "./bundlers";
import { bundleUpgrades } from "./bundleUpgrades";
import { bundleQuestsData } from "./bundleQuestsData";
import { DataBundlersRes, writeDataBundle } from "./dataBundlers";
import { bundleServantsData } from "./bundleServantsData";
import { bundleSkillsData } from "./bundleSkillsData";
import { bundleNPsData } from "./bundleNPsData";
import { bundleCEsData } from "./bundleCEsData";
import { bundleCustomItems } from "./bundleCustomItems";

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
  const bundlersRes: PrebuildBundlersRes = await Promise.all([
    bundleUpgrades(),
    bundleCustomItems()
  ]);
  if (!isSuccessful(bundlersRes)) {
    Log.die("Quitting early because of error in bundler");
  }
  if (!isSuccessful(await Promise.all(bundlersRes.map(writeBundle)))) {
    Log.error("Quitting early due to bundle write failure");
    Log.warn("Current static bundles may be in an invalid state");
    process.exit(1);
  }

  // Phase 3 - static data bundles
  // TODO: data bundles: materials
  // TODO: figure out something for embers and fous
  Log.info("Running Data Bundlers");
  const dataRes: DataBundlersRes = await Promise.all([
    bundleQuestsData(bundlersRes),
    bundleServantsData(bundlersRes),
    bundleSkillsData(bundlersRes),
    bundleNPsData(bundlersRes),
    bundleCEsData(bundlersRes)
  ]);
  if (!isSuccessful(dataRes)) {
    Log.die("Quitting early because of error in data bundler");
  }
  if (!isSuccessful(await Promise.all(dataRes.map(writeDataBundle)))) {
    Log.error("Quitting early due to data bundle write failure");
    Log.warn("Current static bundles may be in an invalid state");
    process.exit(1);
  }
  Log.die("Static Data Bundlers not yet fully implemented", {
    Missing: ["materials"]
  });

  // TODO: Phase 4 - build info
  // TODO: print build date and maybe checksums of bundles into a file
})();
