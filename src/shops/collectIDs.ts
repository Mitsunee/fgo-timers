import type { IDCollection } from "~/prebuild/utils/collectIds";
import type { AnyShopInventory } from "~/schema/ShopSchema";
import type { BundledShop } from "./types";

type ShopIDCollection = Pick<
  IDCollection,
  "servants" | "ces" | "items" | "ccs" | "mcs" | "costumes"
>;

function createCollection() {
  const collection: ShopIDCollection = {
    servants: new Set(),
    ces: new Set(),
    items: new Set(),
    ccs: new Set(),
    mcs: new Set(),
    costumes: new Set()
  };
  return collection;
}

function inventoryCollectIDs(
  inventory: AnyShopInventory,
  collection: ShopIDCollection
) {
  collection.items.add(inventory.currency);
  inventory.items.forEach(item => {
    switch (item.type) {
      case "servant":
        collection.servants.add(item.id);
        break;
      case "ce":
        collection.ces.add(item.id);
        break;
      case "item":
        collection.items.add(item.id);
        break;
      case "cc":
        collection.ccs.add(item.id);
        break;
      case "mc":
        collection.mcs.add(item.id);
        break;
      case "costume":
        collection.costumes.add(item.id);
        break;
    }
  });
}

export function shopCollectIDs(shop: BundledShop) {
  const collection = createCollection();

  shop.inventory.forEach(inventory =>
    inventoryCollectIDs(inventory, collection)
  );

  shop.monthly?.forEach(inventory =>
    inventoryCollectIDs(inventory, collection)
  );

  shop.limited?.forEach(inventory =>
    inventoryCollectIDs(inventory, collection)
  );

  return collection;
}

export function shopsCollectIDs(shops: BundledShop[]) {
  const collection = createCollection();

  for (const shop of shops) {
    shop.inventory.forEach(inventory =>
      inventoryCollectIDs(inventory, collection)
    );

    shop.monthly?.forEach(inventory =>
      inventoryCollectIDs(inventory, collection)
    );

    shop.limited?.forEach(inventory =>
      inventoryCollectIDs(inventory, collection)
    );
  }

  return collection;
}
