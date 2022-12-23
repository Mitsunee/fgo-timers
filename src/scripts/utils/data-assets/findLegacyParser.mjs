import { parseEventFile } from "./parseEventFile.mjs";
import { parseShopFile } from "./parseShopFile.mjs";
import { parseTicketFile } from "./parseTicketFile.mjs";
import { getDataFileType } from "./isDataFile.mjs";

export const parserMap = new Map();

export function findLegacyParser(filePath) {
  // attempt to get from map
  if (parserMap.has(filePath)) return parserMap.get(filePath);

  // check types
  let parser;
  const fileType = getDataFileType(filePath);
  switch (fileType) {
    case "event":
      parser = parseEventFile;
      break;
    case "shopFile":
      parser = parseShopFile;
      break;
    case "ticketFile":
      parser = parseTicketFile;
      break;
    default:
      return [null, false];
  }

  // handle result
  parserMap.set(filePath, [fileType, parser]);
  return [fileType, parser];
}
