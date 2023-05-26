import { join } from "path";
import { readFileJson } from "@foxkit/node-util/fs";
import { List } from "@foxkit/util/object";
import { atlasCache } from "~/atlas-api/cache";
import { shortenAtlasUrl } from "~/atlas-api/urls";
import { mapItemBackgroundToBorder } from "~/items/types";
import { Log } from "~/utils/log";
import type { BundledItem } from "~/items/types";
import type { DataBundler } from "../utils/dataBundlers";

async function getCustomItems() {
  const data = await readFileJson<PartialDataMap<BundledItem>>(
    join("assets", "static", "custom_items.json")
  );
  return data;
}

export const bundleItemsData: DataBundler<BundledItem> = async ids => {
  const [customItems, niceItems, niceItemsNA] = await Promise.all([
    getCustomItems(),
    atlasCache.JP.getNiceItem(),
    atlasCache.NA.getNiceItem()
  ]);

  if (!customItems) {
    Log.error("Could not read custom_items.json static file");
    return false;
  }

  const itemQueue = List.fromArray([...ids]); // to be processed
  const res = new Map<number, BundledItem>(); // result of processing

  while (itemQueue.length > 0) {
    const itemId = itemQueue.shift()!;
    const customItem = customItems[itemId];
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
