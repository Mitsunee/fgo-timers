import { join } from "path";
import { readFileYaml } from "@foxkit/node-util/fs-yaml";

export async function getItemIdMap() {
  const itemIdMapFile = await readFileYaml(
    join(process.cwd(), "assets/data/itemIdMap.yml"),
    "utf8"
  );
  const itemIdMap = new Map(Object.entries(itemIdMapFile));

  return itemIdMap;
}
