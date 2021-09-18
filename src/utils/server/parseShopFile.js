import { parseYamlFile } from "@utils/server/parseYamlFile";
import { parseDate } from "@utils/server/events/parseDate";

export async function parseShopFile(filePath) {
  const { limitedInventory, ...props } = await parseYamlFile(filePath);

  const parsedFile = {
    ...props,
    limitedInventory: await Promise.all(
      limitedInventory.map(async ({ endsAt, ...props }) => ({
        ...props,
        endsAt: await parseDate(endsAt)
      }))
    )
  };

  return parsedFile;
}
