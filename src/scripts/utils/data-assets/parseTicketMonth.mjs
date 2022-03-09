import { shortenStaticUrl } from "./shortenStaticUrl.mjs";

const itemProps = new Set(["id", "name", "background", "icon"]);

export function parseTicketMonth(rawData, { niceItem, itemIdMap }) {
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
    for (const prop of itemProps) {
      if (prop === "icon") {
        parsedItem.icon = shortenStaticUrl(item.icon);
        continue;
      }
      parsedItem[prop] = item[prop];
    }
    parsedData.push(parsedItem);
  }

  return parsedData;
}
