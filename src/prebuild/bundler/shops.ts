import path from "path";
import { readdir } from "fs/promises";
import { readFileYaml } from "@foxkit/node-util/fs-yaml";
import { getFileName } from "@foxkit/node-util/path";
import type { z } from "zod";
import { ShopSchema } from "../../schema/ShopSchema";
import type { BundledShop, AnyShopInventory } from "../../schema/ShopSchema";
import { parseSchema } from "../../schema/verifySchema";
import { Log } from "../../utils/log";
import type { PrebuildBundler } from "../utils/bundlers";

const shopsDir = path.join(process.cwd(), "assets/data/shops");

export const bundleShops: PrebuildBundler<BundledShop[]> = async function () {
  const shops = new Array<BundledShop>();
  const servants = new Set<number>();
  const ces = new Set<number>();
  const items = new Set<number>();
  const ccs = new Set<number>();
  const mcs = new Set<number>();
  const dir = await readdir(shopsDir);
  const files = dir.filter(file => file.endsWith(".yml"));

  function collectIDs(inventory: AnyShopInventory) {
    items.add(inventory.currency);
    inventory.items.forEach(item => {
      switch (item.type) {
        case "servant":
          servants.add(item.id);
          break;
        case "ce":
          ces.add(item.id);
          break;
        case "item":
          items.add(item.id);
          break;
        case "cc":
          ccs.add(item.id);
          break;
        case "mc":
          mcs.add(item.id);
          break;
      }
    });
  }

  for (const fileName of files) {
    const filePath = path.join(shopsDir, fileName);
    const slug = getFileName(fileName, false);
    const fileContent = await readFileYaml<z.input<typeof ShopSchema>>(
      filePath
    );
    if (!fileContent) {
      Log.warn(`Could not parse file '${fileName}'. Skipping...`);
      continue;
    }

    const fileParsed = parseSchema(fileContent, ShopSchema, filePath);
    if (!fileParsed) return false;

    fileParsed.inventory.forEach(collectIDs);
    fileParsed.monthly?.forEach(collectIDs);
    fileParsed.limited?.forEach(collectIDs);

    const shop: BundledShop = {
      slug,
      ...fileParsed
    };

    shops.push(shop);
  }

  Log.info(`Mapped data for ${shops.length} Shops`);
  return {
    name: "Shops",
    path: "shops.json",
    data: shops,
    servants,
    ces,
    items,
    ccs,
    mcs
  };
};
