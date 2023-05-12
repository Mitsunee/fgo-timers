import { getDataFileType } from "./isDataFile.mjs";

export const parserMap = new Map();

/**
 * @deprecated
 */
export function findLegacyParser(filePath) {
  // attempt to get from map
  if (parserMap.has(filePath)) return parserMap.get(filePath);

  // check types
  let parser;
  const fileType = getDataFileType(filePath);
  switch (fileType) {
    default:
      return [null, false];
  }

  /* eslint-disable no-unreachable */
  // handle result
  parserMap.set(filePath, [fileType, parser]);
  return [fileType, parser];
}
