import { shortenStaticUrl } from "./shortenStaticUrl.mjs";

const itemProps = new Set(["id", "name", "background", "icon", "na"]);

export function parseTicketMonth(rawData, { itemIdMap, niceItem, niceItemNa }) {
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
        if (itemNa) parsedItem.na = true;
        continue;
      }

      parsedItem[prop] = item[prop];
    }
    parsedData.push(parsedItem);
  }

  return parsedData;
}
