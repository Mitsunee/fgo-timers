/* parsePrismShopData
 * Parses Prism Exchange shop data file given path
 */

import { readFileYaml } from "@foxkit/node-util/fs-yaml";

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
      throw new TypeError(
        `Expected required property ${prop} to be type ${expectedType} in '${filePath}'`
      );
    }

    if (prop !== "icon" || prop !== "inventory") parsedData[prop] = data[prop];
  }

  // icon prop
  parsedData.icon = shortenStaticUrl(data.icon);

  // inventory property
  parsedData.inventory = parsePrismShopInventory(data.inventory, {
    parent: filePath
  });

  // limitedInventory property
  if (data.limitedInventory !== undefined) {
    if (!(data.limitedInventory instanceof Array)) {
      throw new Error(
        `Expected optional property limitedInventory to be Array in ${filePath}`
      );
    }
    parsedData.limited = parsePrismShopData(data.limitedInventory, {
      parent: filePath,
      limited: true
    });
  }

  return parsedData;
}
