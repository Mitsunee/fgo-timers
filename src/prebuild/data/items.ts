import { getNiceItem } from "~/atlas-api/cache/data/niceItem";
import { shortenAtlasUrl } from "~/atlas-api/urls";
import { mapItemBackgroundToBorder } from "~/items/types";
import { getCustomItem } from "~/static/customItems";
import { ItemsFile } from "~/static/data/items";
import { Log } from "~/utils/log";
import type { BundledItem } from "~/items/types";
import { DataBundler } from "../utils/dataBundlers";

const ItemsBundle = new DataBundler({
  file: ItemsFile,
  transform: async id => {
    const [item, itemNA, customItem] = await Promise.all([
      getNiceItem(id),
      getNiceItem(id, "NA"),
      getCustomItem(id)
    ]);

    if (customItem) return customItem;

    if (!item) {
      Log.error(`Could not find item with id ${id}`);
      return;
    }

    const data: BundledItem = {
      name: itemNA?.name || item.name,
      icon: shortenAtlasUrl(item.icon),
      border: mapItemBackgroundToBorder(item.background)
    };

    if (itemNA) data.na = true;

    return data;
  }
});

export const bundleItemsData = ItemsBundle.processBundle.bind(ItemsBundle);
