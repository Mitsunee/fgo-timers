import path from "path";
import { readFileYaml } from "@foxkit/node-util/fs-yaml";
import type { z } from "zod";
import { MixedShopSchema, ShopSchema } from "../../schema/ShopSchema";
import { parseSchema } from "../../schema/verifySchema";
import type { MixedShop, Shop } from "../../schema/ShopSchema";
import { Log } from "../../utils/log";
import type { PrebuildBundler } from "../utils/bundlers";

type ShopIndex = { path: string; isMixed?: boolean };

const ShopsIndex = {
  "mana-prism": { path: "assets/data/shops/mana-prism.yml" },
  "rare-prism": { path: "assets/data/shops/rare-prism.yml" },
  "pure-prism": { path: "assets/data/shops/pure-prism.yml" }
} satisfies Record<string, ShopIndex>;

type Shops = keyof typeof ShopsIndex;

type BundledShops = {
  [Key in Shops]: (typeof ShopsIndex)[Key] extends { isMixed: true }
    ? MixedShop
    : Shop;
};

type AnyShopItem = Shop["inventory"][number] &
  Partial<NonNullable<Shop["limited"]>[number]> &
  Partial<MixedShop["inventory"][number]> &
  Partial<NonNullable<MixedShop["limited"]>[number]>;

export const bundleShops: PrebuildBundler<BundledShops> = async function () {
  const servants = new Set<number>();
  const ces = new Set<number>();
  const items = new Set<number>();
  const ccs = new Set<number>();
  const mcs = new Set<number>();

  function collectIDs(val: AnyShopItem) {
    switch (val.type) {
      case "servant":
        servants.add(val.id);
        break;
      case "ce":
        ces.add(val.id);
        break;
      case "item":
        items.add(val.id);
        break;
      case "cc":
        ccs.add(val.id);
        break;
      case "mc":
        mcs.add(val.id);
        break;
    }

    if (val.currency) {
      items.add(val.currency);
    }
  }

  async function handleShop({
    path: filePath
  }: {
    path: string;
    isMixed?: false;
  }) {
    const fileContent = await readFileYaml<z.input<typeof ShopSchema>>(
      filePath
    );
    if (!fileContent) {
      Log.error(`Could not parse file '${path.basename(filePath)}'`);
      return false;
    }

    const fileParsed = parseSchema(fileContent, ShopSchema, filePath);
    if (!fileParsed) return false;
    items.add(fileParsed.currency);
    fileParsed.inventory.forEach(collectIDs);
    fileParsed.monthly?.forEach(collectIDs);
    fileParsed.limited?.forEach(collectIDs);

    return fileParsed;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function handleMixedShop({
    path: filePath
  }: {
    path: string;
    isMixed: true;
  }) {
    const fileContent = await readFileYaml<z.input<typeof MixedShopSchema>>(
      filePath
    );
    if (!fileContent) {
      Log.error(`Could not parse file '${path.basename(filePath)}'`);
      return false;
    }

    const fileParsed = parseSchema(fileContent, MixedShopSchema, filePath);
    if (!fileParsed) return false;
    fileParsed.inventory.forEach(collectIDs);
    fileParsed.monthly?.forEach(collectIDs);
    fileParsed.limited?.forEach(collectIDs);

    return fileParsed;
  }

  const [mpShop, rpShop, ppShop] = await Promise.all([
    handleShop(ShopsIndex["mana-prism"]),
    handleShop(ShopsIndex["rare-prism"]),
    handleShop(ShopsIndex["pure-prism"])
  ]);
  // TODO: find better way to typeguard this
  if (!(mpShop && rpShop && ppShop)) return false;

  const data: BundledShops = {
    "mana-prism": mpShop,
    "rare-prism": rpShop,
    "pure-prism": ppShop
  };

  Log.info(`Mapped data for ${Object.keys(data).length} Shops`);
  return {
    name: "Shops",
    path: "shops.json",
    data,
    servants,
    ces,
    items,
    ccs,
    mcs
  };
};
