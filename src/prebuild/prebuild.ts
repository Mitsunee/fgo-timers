import { prepareCache } from "~/atlas-api/prepare";
import { Log } from "~/utils/log";
import { bundleCustomItems } from "./bundler/customItems";
import { bundleEvents } from "./bundler/events";
import { bundleExchangeTickets } from "./bundler/exchangeTickets";
import { bundleShops } from "./bundler/shops";
import { bundleUpgrades } from "./bundler/upgrades";
import { bundleCCsData } from "./data/ccs";
import { bundleCEsData } from "./data/ces";
import { bundleCostumesData } from "./data/costumes";
import { bundleItemsData } from "./data/items";
import { bundleMysticCodesData } from "./data/mcs";
import { bundleNPsData } from "./data/nps";
import { bundleQuestsData } from "./data/quests";
import { bundleServantsData } from "./data/servants";
import { bundleSkillsData } from "./data/skills";
import { writeBundle } from "./utils/bundlers";
import { collectIDs } from "./utils/collectIds";
import { writeDataBundle } from "./utils/dataBundlers";
import { saveBuildInfo } from "./utils/saveBuildInfo";
import type { PrebuildBundlersRes } from "./utils/bundlers";
import type { DataBundlersRes } from "./utils/dataBundlers";

function isSuccessful<T>(arr: Array<T | false>): arr is Array<T> {
  return arr.every(el => el !== false);
}

(async function main() {
  // Phase 0 - Prepare Cache
  const cacheInfo = await prepareCache();

  // Phase 1 - bundlers
  Log.info("Running Bundlers");
  const bundlersRes: PrebuildBundlersRes = await Promise.all([
    bundleUpgrades(),
    bundleCustomItems(),
    bundleEvents(),
    bundleExchangeTickets(),
    bundleShops()
  ]);
  if (!isSuccessful(bundlersRes)) {
    Log.die("Quitting early because of error in bundler");
  }
  if (!isSuccessful(await Promise.all(bundlersRes.map(writeBundle)))) {
    Log.error("Quitting early due to bundle write failure");
    Log.warn("Current static bundles may be in an invalid state");
    process.exit(1);
  }

  // Phase 2 - static data bundles
  const ids = collectIDs(bundlersRes);
  Log.info("Running Data Bundlers");
  const dataRes: DataBundlersRes = await Promise.all([
    bundleServantsData(ids.servants),
    bundleQuestsData(ids.quests),
    bundleSkillsData(ids.skills),
    bundleNPsData(ids.nps),
    bundleCEsData(ids.ces),
    bundleItemsData(ids.items),
    bundleCCsData(ids.ccs),
    bundleMysticCodesData(ids.mcs),
    bundleCostumesData(ids.costumes)
  ]);
  if (!isSuccessful(dataRes)) {
    Log.die("Quitting early because of error in data bundler");
  }
  if (!isSuccessful(await Promise.all(dataRes.map(writeDataBundle)))) {
    Log.error("Quitting early due to data bundle write failure");
    Log.warn("Current static bundles may be in an invalid state");
    process.exit(1);
  }

  // Phase 3 - build info
  await saveBuildInfo(cacheInfo);
})();
