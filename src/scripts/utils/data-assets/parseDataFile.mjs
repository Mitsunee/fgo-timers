import { findLegacyParser } from "./findLegacyParser.mjs";

export async function parseDataFile(filePath) {
  const [fileType, parser] = findLegacyParser(filePath);
  if (!parser) throw new Error("Could not find parser");
  const data = await parser(filePath);
  return { type: fileType, data };
}
