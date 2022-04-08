/* parsePrismShopInventory
 * Parses inventory and limitedInventory props of Prism Exchange Shop data for parsePrismShopData
 */

import { shortenStaticUrl } from "./shortenStaticUrl.mjs";
import { parseDate } from "./parseDate.mjs";

const baseProps = new Map([
  ["name", "string"],
  ["icon", "string"],
  ["background", "string"],
  ["cost", "number"],
  ["amount", "number"]
]);

const limitedProps = new Map([...baseProps.entries(), ["endsAt", "string"]]);

export function parseShopInventory(data, limited = false) {
  const requiredProps = limited ? limitedProps : baseProps;
  const parsedData = new Array();

  for (const rawItem of data) {
    const parsedItem = new Object();

    // required properties
    for (const [prop, expectedType] of requiredProps) {
      if (typeof rawItem[prop] !== expectedType) {
        throw new TypeError(
          `Expected required property ${prop} to be type ${expectedType}`
        );
      }

      switch (prop) {
        case "icon":
          parsedItem.icon = shortenStaticUrl(rawItem.icon);
          break;
        case "endsAt":
          parsedItem.ends = parseDate(rawItem.endsAt, {
            allowDuration: false,
            flat: true
          });
          break;
        default:
          parsedItem[prop] = rawItem[prop];
      }
    }

    // optional properties
    if (rawItem.stack != null) {
      if (typeof rawItem.stack !== "number") {
        throw new TypeError(
          `Expected optional property stack to be type number`
        );
      }
      parsedItem.stack = rawItem.stack;
    }

    parsedData.push(parsedItem);
  }

  return parsedData;
}
