import { basename, extname } from "path";

import { parseYamlFile } from "@utils/server/parseYamlFile";

export async function parseTicketFile(filePath, itemIdMap) {
  // read and parse data
  const fileData = await parseYamlFile(filePath);

  // grab key
  const key = basename(filePath, extname(filePath));

  // build data
  const data = new Object();
  for (const month in fileData) {
    data[month] = fileData[month].map(name => itemIdMap.get(name) || name);
  }

  return { key, data };
}
