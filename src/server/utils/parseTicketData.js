/* parseTicketData
 * Maps Array of item names (itemIdMap.yml) to data nice nice_item_lang_en
 */

import { readFileJson } from "@foxkit/node-util/fs";
import { readFileYaml } from "@foxkit/node-util/fs-yaml";

import { shortenStaticUrl } from "./shortenStaticUrl";

const promise_niceItem = readFileJson("cache/JP/nice_item_lang_en.json");
const promise_itemIdMap = readFileYaml("assets/data/itemIdMap.yml");

export async function parseTicketData(data) {
  const niceItem = await promise_niceItem;
  const itemIdMap = await promise_itemIdMap;

  if (!niceItem) {
    throw new TypeError("Could not read nice_item_lang_en from cache");
  }

  const parsedData = new Array();

  for (const item of data) {
    const parsedItem = new Object();
    const id = itemIdMap[item];
    const nice = niceItem.find(i => i.id === id);
    if (!nice) {
      throw new Error(
        `Could not find item ${item} (id: ${id}) in nice_item_lang_en`
      );
    }
    parsedItem.name = nice.name;
    parsedItem.bg = nice.background;
    parsedItem.url = shortenStaticUrl(nice.icon);
    parsedData.push(parsedItem);
  }

  return parsedData;
}
