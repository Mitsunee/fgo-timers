import {
  getBundledCCMap,
  getBundledCEMap,
  getBundledCostumeMap,
  getBundledItemMap,
  getBundledMysticCodeMap,
  getBundledServantMap
} from "src/utils/getBundles";
import type { WithMaps } from "src/client/contexts";
import type { AnyShopInventory, BundledShop } from "src/schema/ShopSchema";

export async function collectDataMaps(shop: BundledShop | BundledShop[]) {
  const [servantMap, itemMap, ceMap, ccMap, mcMap, costumeMap] =
    await Promise.all([
      getBundledServantMap(),
      getBundledItemMap(),
      getBundledCEMap(),
      getBundledCCMap(),
      getBundledMysticCodeMap(),
      getBundledCostumeMap()
    ]);

  const data: WithMaps<
    "servants" | "items" | "ces" | "ccs" | "mcs" | "costumes"
  > = {
    servants: {},
    items: {},
    ces: {},
    ccs: {},
    mcs: {},
    costumes: {}
  };

  function handleInventory(inventory: AnyShopInventory) {
    data.items[inventory.currency] = itemMap[inventory.currency];
    inventory.items.forEach(item => {
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
        case "costume":
          data.costumes[item.id] = costumeMap[item.id];
          break;
      }
    });
  }

  function handleShop(shop: BundledShop) {
    shop.inventory.forEach(handleInventory);
    shop.monthly?.forEach(handleInventory);
    shop.limited?.forEach(handleInventory);
  }

  if (Array.isArray(shop)) {
    shop.forEach(handleShop);
  } else {
    handleShop(shop);
  }

  return data;
}
