import { prepareAtlasCache } from "../utils/atlasacademy/prepareCache.mjs";

(async function main() {
  await prepareAtlasCache();
  // TODO: bundle static data (backgrounds, events, login ticket)
})();
