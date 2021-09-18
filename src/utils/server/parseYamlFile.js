import YAML from "yaml";
import { readFile } from "fs/promises";

import { resolveFilePath } from "@utils/server/resolveFilePath";

export async function parseYamlFile(filePath) {
  const fullPath = resolveFilePath(filePath);
  const fileContent = await readFile(fullPath, "utf8");
  const data = YAML.parse(fileContent);

  return data;
}
