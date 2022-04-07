import { readFileYaml } from "@foxkit/node-util/fs-yaml";
import { readFromCache } from "../atlasacademy/cache.mjs";
import { shortenStaticUrl } from "./shortenStaticUrl.mjs";

let niceItem = null;
async function prepareNiceItem() {
  if (niceItem == null) {
    niceItem = await readFromCache("JP", "nice_item_lang_en.json");
    if (!niceItem) {
      throw new Error("Could not read nice_item_lang_en from cache");
    }
  }
}

let niceItemNa = null;
async function prepareNiceItemNa() {
  if (niceItemNa == null) {
    niceItemNa = await readFromCache("NA", "nice_item.json");
    if (!niceItemNa) {
      throw new Error("Could not read nice_item from cache");
    }
  }
}

let itemIdMap = null;
async function prepareIdMap() {
  if (itemIdMap == null) {
    itemIdMap = await readFileYaml("assets/data/itemIdMap.yml");
    if (!itemIdMap) {
      throw new Error("Could not read assets/data/itemIdMap.yml");
    }
  }
}

const itemProps = new Set(["id", "name", "background", "icon", "na"]);

export async function parseTicketMonth(rawData) {
  await Promise.all([prepareNiceItem(), prepareNiceItemNa(), prepareIdMap()]);
  const parsedData = new Array();

  for (const nickName of rawData) {
    const parsedItem = new Object();
    const itemId = itemIdMap[nickName];
    if (!itemId) {
      throw new Error(`Could not find item ${nickName} in itemIdMap`);
    }
    const item = niceItem.find(({ id }) => id === itemId);
    if (!item) {
      throw new Error(
        `Could not find item ${nickName} (id: ${itemId}) in nice_item_lang_en`
      );
    }
    const itemNa = niceItemNa.find(({ id }) => id === itemId);

    for (const prop of itemProps) {
      // use NA name where possible
      if (prop === "name" && itemNa) {
        parsedItem.name = itemNa.name;
        continue;
      }

      // shorten icon url
      if (prop === "icon") {
        parsedItem.icon = shortenStaticUrl(item.icon);
        continue;
      }

      if (prop === "na") {
        parsedItem.na = itemNa ? true : false;
        continue;
      }

      parsedItem[prop] = item[prop];
    }
    parsedData.push(parsedItem);
  }

  return parsedData;
}
