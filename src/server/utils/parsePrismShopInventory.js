/* parsePrismShopInventory
 * Parses inventory and limitedInventory props of Prism Exchange Shop data for parsePrismShopData
 */

import { createServerError } from "./createServerError";
import { shortenStaticUrl } from "./shortenStaticUrl";
import { parseEventDate } from "./parseEventDate";

const baseProps = new Map([
  ["name", "string"],
  ["icon", "string"],
  ["background", "string"],
  ["cost", "number"],
  ["amount", "number"]
]);

const limitedProps = new Map([...baseProps.entries(), ["endsAt", "string"]]);

export async function parsePrismShopInventory(
  data,
  { parent = null, limited = false }
) {
  const requiredProps = limited ? limitedProps : baseProps;
  const parsedData = new Array();

  for (const rawItem of data) {
    const parsedItem = new Object();

    // required properties
    for (const [prop, expectedType] of requiredProps) {
      if (typeof rawItem[prop] !== expectedType) {
        throw createServerError(
          `Expected required property ${prop} to be type ${expectedType}`,
          parent
        );
      }
      switch (prop) {
        case "icon":
          parsedItem.icon = shortenStaticUrl(rawItem.icon);
          break;
        case "endsAt":
          parsedItem.ends = parseEventDate(rawItem.endsAt, {
            allowDuration: false,
            flat: true,
            parent
          });
          break;
        default:
          parsedItem[prop] = rawItem[prop];
      }
    }

    // optional properties
    if (rawItem.stack != null) {
      if (typeof rawItem.stack !== "number") {
        throw createServerError(
          `Expected optional property stack to be type number`,
          parent
        );
      }
      parsedItem.stack = rawItem.stack;
    }

    parsedData.push(parsedItem);
  }

  return parsedData;
}
