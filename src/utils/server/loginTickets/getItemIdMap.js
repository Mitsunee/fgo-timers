import YAML from "yaml";
import { readFile } from "fs/promises";
import { join } from "path";

export async function getItemIdMap() {
  const itemIdMapFile = await readFile(
    join(process.cwd(), "assets/data/itemIdMap.yml"),
    "utf8"
  );
  const itemIdMap = new Map(Object.entries(YAML.parse(itemIdMapFile)));

  return itemIdMap;
}
