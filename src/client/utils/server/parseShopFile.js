import { readFileYaml } from "@foxkit/node-util/fs-yaml";

import { parseDate } from "@utils/server/events/parseDate";

export async function parseShopFile(filePath) {
  const { limitedInventory, ...props } = await readFileYaml(filePath);

  const parsedFile = {
    ...props,
    limitedInventory: limitedInventory.map(({ endsAt, ...props }) => ({
      ...props,
      endsAt: parseDate(endsAt)
    }))
  };

  return parsedFile;
}
