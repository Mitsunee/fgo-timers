import { parseYamlFile } from "@utils/server/parseYamlFile";
import { parseDate } from "@utils/server/events/parseDate";

export async function parseShopFile(filePath) {
  const { limitedInventory, ...props } = await parseYamlFile(filePath);

  const parsedFile = {
    ...props,
    limitedInventory: limitedInventory.map(({ endsAt, ...props }) => ({
      ...props,
      endsAt: parseDate(endsAt)
    }))
  };

  return parsedFile;
}
