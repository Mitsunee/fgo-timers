import { ItemBackgroundType } from "@atlasacademy/api-connector/dist/Schema/Item";
import { getNiceItem } from "~/atlas-api/cache/data/niceItem";
import { shortenAtlasUrl } from "~/atlas-api/urls";
import { getCustomItem } from "~/static/customItems";
import { ItemsFile } from "~/static/data/items";
import { Borders } from "~/types/borders";
import { Log } from "~/utils/log";
import type { BundledItem } from "~/items/types";
import { DataBundler } from "../utils/dataBundlers";

/**
 * Maps ItemBackgroundType used in API data to Borders enum value
 * @param background background property of API's item data
 * @returns Borders enum value
 */
export function mapItemBackgroundToBorder(
  background: ItemBackgroundType
): BundledItem["border"] {
  switch (background) {
    case ItemBackgroundType.BRONZE:
      return Borders.BRONZE;
    case ItemBackgroundType.GOLD:
      return Borders.GOLD;
    case ItemBackgroundType.QUEST_CLEAR_QP_REWARD:
      return Borders.BLUE;
    case ItemBackgroundType.ZERO:
      return Borders.ZERO;
    case ItemBackgroundType.SILVER:
    default:
      return Borders.SILVER;
  }
}

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
