import { writeFile } from "@foxkit/node-util/fs";

import { parseShopFile } from "../utils/data-assets/parseShopFile.mjs";
import { ready } from "../utils/log.mjs";

export async function bundlePrismShops() {
  const start = Date.now();
  const [mpShopData, rpShopData] = await Promise.all([
    parseShopFile("assets/data/manaPrismShop.yml"),
    parseShopFile("assets/data/rarePrismShop.yml")
  ]);
  const data = { mp: mpShopData, rp: rpShopData };

  await writeFile("assets/static/prismShops.json", data);
  const duration = Date.now() - start;
  ready(
    `Built Prism shops bundle (in ${duration}ms)`,
    "assets/static/prismShops.json"
  );
}
