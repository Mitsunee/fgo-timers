import { writeFile } from "@foxkit/node-util/fs";

import { parseShopFile } from "../../scripts/utils/data-assets/parseShopFile.mjs";
import { ready } from "../../scripts/utils/log.mjs";

export async function bundlePrismShops() {
  const [manaPrismShop, rarePrismShop] = await Promise.all([
    parseShopFile("assets/data/manaPrismShop.yml"),
    parseShopFile("assets/data/rarePrismShop.yml")
  ]);
  const data = { manaPrismShop, rarePrismShop };

  await writeFile("assets/static/prismShops.json", data);

  ready("Built Prism shops bundle", "assets/static/prismShops.json");
  return true;
}
