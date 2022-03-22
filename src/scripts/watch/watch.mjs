import { prepareAtlasCache } from "../utils/atlasacademy/prepareCache.mjs";
import { watchSvgs } from "./watchSvgs.mjs";
import { watchBackgrounds } from "./watchBackgrounds.mjs";
import { watchBundle } from "./watchBundle.mjs";
import { buildToArray, buildToObject } from "./builders.mjs";

// TODO: add the other things prebuild does

(async function main() {
  await prepareAtlasCache();

  watchSvgs();
  watchBackgrounds();
  watchBundle(
    "assets/data/events/*.yml",
    "assets/static/events.json",
    buildToArray
  );
  watchBundle(
    "assets/data/login-tickets/*.yml",
    "assets/static/loginTickets.json",
    buildToObject
  );
  watchBundle(
    ["assets/data/manaPrismShop.yml", "assets/data/rarePrismShop.yml"],
    "assets/static/prismShops.json",
    buildToObject,
    { disableGlobbing: true }
  );
})();
