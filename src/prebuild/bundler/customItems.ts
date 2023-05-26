import { readdir } from "fs/promises";
import { join } from "path";
import { readFileYaml } from "@foxkit/node-util/fs-yaml";
import { shortenAtlasUrl } from "../../atlas-api/urls";
import { mapCustomItemRarityToBorder } from "../../items/types";
import { CustomItemSchema } from "../../schema/CustomItem";
import { verifySchema } from "../../schema/verifySchema";
import { Log } from "../../utils/log";
import type { BundledItem, CustomItem } from "../../items/types";
import type { PrebuildBundler } from "../utils/bundlers";

export const bundleCustomItems: PrebuildBundler<
  PartialDataMap<BundledItem>
> = async () => {
  const res = new Map<number, BundledItem>();
  const dir = await readdir(join(process.cwd(), "assets", "data", "items"));
  const files = dir.filter(file => file.endsWith(".yml"));

  for (const fileName of files) {
    const filePath = join("assets", "data", "items", fileName);
    const items = await readFileYaml<CustomItem>(filePath);
    if (!items) {
      Log.warn(`Could not parse file '${fileName}'. Skipping...`);
      continue;
    }
    if (!verifySchema(items, CustomItemSchema, filePath)) return false;

    for (const item of items) {
      const data: BundledItem = {
        name: item.name,
        icon: shortenAtlasUrl(item.icon),
        border: mapCustomItemRarityToBorder(item.rarity),
        na: true
      };
      res.set(item.id, data);
    }
  }

  Log.info(`Built data for ${res.size} Custom items`);
  return {
    data: Object.fromEntries(res.entries()),
    name: "Custom Items",
    path: "custom_items.json"
  };
};
