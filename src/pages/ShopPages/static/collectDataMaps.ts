import type { WithMaps } from "src/client/contexts";
import type { AnyShop, AnyShopItem } from "src/shops/types";
import {
  getBundledCCMap,
  getBundledCEMap,
  getBundledItemMap,
  getBundledMysticCodeMap,
  getBundledServantMap
} from "src/utils/getBundles";

export async function collectDataMaps(shop: AnyShop) {
  const [servantMap, itemMap, ceMap, ccMap, mcMap] = await Promise.all([
    getBundledServantMap(),
    getBundledItemMap(),
    getBundledCEMap(),
    getBundledCCMap(),
    getBundledMysticCodeMap()
  ]);

  const data: WithMaps<"servants" | "items" | "ces" | "ccs" | "mcs"> = {
    servants: {},
    items: {},
    ces: {},
    ccs: {},
    mcs: {}
  };

  function collectData(item: AnyShopItem) {
    switch (item.type) {
      case "servant":
        data.servants[item.id] = servantMap[item.id];
        break;
      case "item":
        data.items[item.id] = itemMap[item.id];
        break;
      case "ce":
        data.ces[item.id] = ceMap[item.id];
        break;
      case "cc":
        data.ccs[item.id] = ccMap[item.id];
        break;
      case "mc":
        data.mcs[item.id] = mcMap[item.id];
        break;
    }

    if (item.currency) {
      data.items[item.currency] = itemMap[item.currency];
    }
  }

  shop.inventory.forEach(collectData);
  shop.monthly?.forEach(collectData);
  shop.limited?.forEach(collectData);

  if (shop.currency) {
    data.items[shop.currency] = itemMap[shop.currency];
  }

  return data;
}
