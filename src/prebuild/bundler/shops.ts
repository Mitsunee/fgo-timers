import { getFileName } from "@foxkit/node-util/fs";
import { ShopFile } from "~/schema/ShopSchema";
import { shopsCollectIDs } from "~/shops/collectIDs";
import { ShopsFile } from "~/static/shops";
import { Log } from "~/utils/log";
import type { BundledShop } from "~/shops/types";
import { DirectoryBundler } from "../utils/bundlers";

const ShopsBundler = new DirectoryBundler({
  name: "Shops",
  inputFile: ShopFile,
  outputFile: ShopsFile,
  bundle: async files => {
    let success = true;
    const entries = Object.entries(files);
    const shops = entries.flatMap<BundledShop>(([filePath, res]) => {
      const fileName = getFileName(filePath, true);
      const slug = getFileName(filePath, false);
      if (!res?.success) {
        Log.warn(`Could not parse file '${fileName}'. Skipping...`);
        success = false;
        return [];
      }

      const fileParsed = res.data;
      const shop = Object.assign({}, fileParsed, { slug });
      return shop;
    });

    if (!success) throw new Error("Could not parse all shop files");

    const ids = shopsCollectIDs(shops);
    ids.items.add(80059); // NOTE: always include Costume Key for ShopsPage

    return { data: shops, size: shops.length, ids };
  }
});

export const bundleShops = ShopsBundler.processBundle.bind(ShopsBundler);
