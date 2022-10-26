import { join } from "path";
import { readdir } from "fs/promises";
import { readFileYaml } from "@foxkit/node-util/fs-yaml";
import { Log } from "../utils/log";
import {
  BundledItem,
  CustomItem,
  mapCustomItemRarityToBorder
} from "../items/types";
import { CustomItemSchema } from "../schema/CustomItem";
import { verifySchema } from "../schema/verifySchema";
import { shortenAtlasUrl } from "../atlas-api/urls";
import type { PrebuildBundler } from "./bundlers";

export const bundleCustomItems: PrebuildBundler<
  IDMap<BundledItem>
> = async () => {
  const res = new Map<number, BundledItem>();
  const dir = await readdir(join(process.cwd(), "assets", "data", "items"));
  const files = dir.filter(file => file.endsWith(".yml"));

  for (const fileName of files) {
    const filePath = join("assets", "data", "items", fileName);
    const items = await readFileYaml<Partial<CustomItem>[]>(filePath);
    if (!items) {
      Log.warn(`Could not parse file '${fileName}'. Skipping...`);
      continue;
    }

    for (const item of items) {
      if (!verifySchema(item, CustomItemSchema, filePath)) return false;
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
