import { findParser } from "./findParser.mjs";
import { error } from "../log.mjs";

export async function checkDataFile(filePath) {
  const [, parser] = findParser(filePath);
  if (!parser) {
    error("Could not find parser", filePath);
    return false;
  }
  try {
    await parser(filePath);
    return true;
  } catch (e) {
    error(e.message, filePath);
    console.error(e);
    return false;
  }
}
