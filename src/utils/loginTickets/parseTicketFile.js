import YAML from "yaml";
import { readFile } from "fs/promises";
import { basename, extname } from "path";

export async function parseTicketFile(filePath, itemIdMap) {
  // read and parse data
  const fileContent = await readFile(filePath, "utf8");
  const fileData = YAML.parse(fileContent);

  // grab key
  const key = basename(filePath).substring(0, extname(filePath).length);

  // build data
  const data = new Object();
  for (const month in fileData) {
    data[month] = fileData[month].map(name => itemIdMap.get(name) || name);
  }

  return { key, data };
}
