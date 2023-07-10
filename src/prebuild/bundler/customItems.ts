import { getFileName } from "@foxkit/node-util/fs";
import { shortenAtlasUrl } from "~/atlas-api/urls";
import { CustomItemFile } from "~/schema/CustomItem";
import { CustomItemsFile } from "~/static/customItems";
import { Borders } from "~/types/borders";
import { Log } from "~/utils/log";
import type { BundledItem, CustomItem } from "~/items/types";
import { DirectoryBundler } from "../utils/bundlers";

/**
 * Maps rarity as string to Borders enum value
 * @param rarity rarity as string
 * @returns Borders enum value
 */
export function mapCustomItemRarityToBorder(
  rarity: CustomItem[number]["rarity"]
): BundledItem["border"] {
  switch (rarity) {
    case "bronze":
      return Borders.BRONZE;
    case "silver":
      return Borders.SILVER;
    case "gold":
      return Borders.GOLD;
    default:
      return Borders.BLUE;
  }
}

const CustomItemsBundler = new DirectoryBundler({
  name: "Custom Items",
  inputFile: CustomItemFile,
  outputFile: CustomItemsFile,
  bundle: async files => {
    let success = true;
    const entries = Object.entries(files);
    const items: DataMap<BundledItem> = {};
    let itemCount = 0;

    for (const [filePath, res] of entries) {
      const fileName = getFileName(filePath, true);
      if (!res?.success) {
        Log.warn(`Could not parse file '${fileName}'. Skipping...`);
        success = false;
        continue;
      }

      const fileParsed = res.data;

      for (const customItem of fileParsed) {
        const data: BundledItem = {
          name: customItem.name,
          icon: shortenAtlasUrl(customItem.icon),
          border: mapCustomItemRarityToBorder(customItem.rarity),
          na: true
        };
        items[customItem.id] = data;
        itemCount++;
      }
    }

    if (!success) throw new Error("Could not parse all custom item files");

    return { data: items, size: itemCount, ids: {} };
  }
});

export const bundleCustomItems =
  CustomItemsBundler.processBundle.bind(CustomItemsBundler);
