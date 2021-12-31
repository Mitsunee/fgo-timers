import { getFileName } from "@foxkit/node-util/path";
import { readFileYaml } from "@foxkit/node-util/fs-yaml";

export async function parseTicketFile(filePath, itemIdMap) {
  // read and parse data
  const fileData = await readFileYaml(filePath);

  // grab key
  const key = getFileName(filePath, false);

  // build data
  const data = new Object();
  for (const month in fileData) {
    data[month] = fileData[month].map(name => itemIdMap.get(name) || name);
  }

  return { key, data };
}
