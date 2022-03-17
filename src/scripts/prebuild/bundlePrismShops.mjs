import { writeFile } from "@foxkit/node-util/fs";

import { parseShopFile } from "../utils/data-assets/parseShopFile.mjs";
import { ready } from "../utils/log.mjs";

export async function bundlePrismShops() {
  const [mpShopData, rpShopData] = await Promise.all([
    parseShopFile("assets/data/manaPrismShop.yml"),
    parseShopFile("assets/data/rarePrismShop.yml")
  ]);
  const data = { mp: mpShopData, rp: rpShopData };

  await writeFile("assets/static/prismShops.json", data);

  ready("Built Prism shops bundle", "assets/static/prismShops.json");
  return true;
}
