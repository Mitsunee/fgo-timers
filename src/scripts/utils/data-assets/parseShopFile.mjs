import { readFileYaml } from "@foxkit/node-util/fs-yaml";

import { shortenStaticUrl } from "./shortenStaticUrl.mjs";
import { parseShopInventory } from "./parseShopInventory.mjs";

const requiredProps = new Map([
  ["title", "string"],
  ["color", "string"],
  ["icon", "string"],
  ["inventory", "object"]
]);

export async function parseShopFile(filePath) {
  const rawData = await readFileYaml(filePath);
  if (!rawData) throw new Error(`Couldn't read Prism Shop file`);
  const parsedData = new Object();

  // required properties
  for (const [prop, expectedType] of requiredProps) {
    if (typeof rawData[prop] !== expectedType) {
      throw new TypeError(
        `Expected required property ${prop} to be type ${expectedType}`
      );
    }

    switch (prop) {
      case "icon":
        parsedData.icon = shortenStaticUrl(rawData.icon);
        break;
      case "inventory":
        parsedData.inventory = parseShopInventory(rawData.inventory);
        break;
      default:
        parsedData[prop] = rawData[prop];
    }
  }

  // limitedInventory property (optional)
  if (rawData.limitedInventory !== undefined) {
    if (!(rawData.limitedInventory instanceof Array)) {
      throw new TypeError(
        `Expected optional property limitedInventory to be Array`
      );
    }
    if (rawData.limitedInventory.length > 0) {
      parsedData.limited = parseShopInventory(rawData.limitedInventory, true);
    }
  }

  return parsedData;
}
