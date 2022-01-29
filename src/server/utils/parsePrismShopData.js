/* parsePrismShopData
 * Parses Prism Exchange shop data file given path
 */

import { readFileYaml } from "@foxkit/node-util/fs-yaml";

import { createServerError } from "./createServerError";
import { shortenStaticUrl } from "./shortenStaticUrl";
import { parsePrismShopInventory } from "./parsePrismShopInventory";

const requiredProps = new Map([
  ["title", "string"],
  ["color", "string"],
  ["icon", "string"],
  ["inventory", "object"]
]);

export async function parsePrismShopData(filePath) {
  const data = await readFileYaml(filePath);
  if (!data) {
    throw new Error(`Couldn't read Prism Shop data file '${filePath}'`);
  }

  const parsedData = new Object();

  // required properties
  for (const [prop, expectedType] of requiredProps) {
    if (typeof data[prop] !== expectedType) {
      throw createServerError(
        `Expected required property ${prop} to be type ${expectedType}`,
        filePath
      );
    }

    switch (prop) {
      case "icon":
        parsedData.icon = shortenStaticUrl(data.icon);
        break;
      case "inventory":
        parsedData.inventory = parsePrismShopInventory(data.inventory, {
          parent: filePath
        });
        break;
      default:
        parsedData[prop] = data[prop];
    }
  }

  // limitedInventory property (optional)
  if (data.limitedInventory !== undefined) {
    if (!(data.limitedInventory instanceof Array)) {
      throw createServerError(
        `Expected optional property limitedInventory to be Array`,
        filePath
      );
    }
    parsedData.limited = parsePrismShopData(data.limitedInventory, {
      parent: filePath,
      limited: true
    });
  }

  return parsedData;
}
