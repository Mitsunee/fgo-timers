import { findParser } from "./findParser.mjs";

export async function parseDataFile(filePath) {
  const [fileType, parser] = findParser(filePath);
  if (!parser) throw new Error("Could not find parser");
  const data = await parser(filePath);
  return { type: fileType, data };
}
