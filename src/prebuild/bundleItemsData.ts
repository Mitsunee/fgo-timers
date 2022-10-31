import { readFileJson } from "@foxkit/node-util/fs";
import { join } from "path";
import { List } from "@foxkit/util/object";
import { BundledItem, mapItemBackgroundToBorder } from "../items/types";
import { atlasCache } from "../atlas-api/cache";
import { shortenAtlasUrl } from "../atlas-api/urls";
import { Log } from "../utils/log";
import { toMap } from "../utils/toMap";
import { DataBundler } from "./dataBundlers";

async function getCustomItems() {
  const data = await readFileJson<IDMap<BundledItem>>(
    join("assets", "static", "custom_items.json")
  );
  return data && toMap(data);
}

export const bundleItemsData: DataBundler<BundledItem> = async bundles => {
  const [customItems, niceItems, niceItemsNA] = await Promise.all([
    getCustomItems(),
    atlasCache.JP.getNiceItem(),
    atlasCache.NA.getNiceItem()
  ]);

  if (!customItems) {
    Log.error("Could not read custom_items.json static file");
    return false;
  }

  const itemQueue = new List<number>(); // to be processed
  const knownItems = new Set<number>(); // are queued or processed
  const res = new Map<number, BundledItem>(); // result of processing

  for (const bundle of bundles) {
    if (!bundle.items) continue;
    for (const id of bundle.items) {
      if (knownItems.has(id)) continue;
      itemQueue.push(id);
      knownItems.add(id);
    }
  }

  while (itemQueue.length > 0) {
    const itemId = itemQueue.shift()!;
    const customItem = customItems.get(itemId);
    if (customItem) {
      res.set(itemId, customItem);
      continue;
    }

    const item = niceItems.find(item => item.id == itemId);
    const itemNA = niceItemsNA.find(item => item.id == itemId);
    if (!item) {
      Log.error(`Could not find item id ${itemId}`);
      return false;
    }

    const data: BundledItem = {
      name: itemNA?.name || item.name,
      icon: shortenAtlasUrl(item.icon),
      border: mapItemBackgroundToBorder(item.background)
    };
    if (itemNA) data.na = true;

    res.set(itemId, data);
  }

  Log.info(`Mapped data for ${res.size} Items`);
  return {
    name: "Items",
    path: "items.json",
    data: res
  };
};
