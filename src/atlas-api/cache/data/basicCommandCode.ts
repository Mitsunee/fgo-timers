import path from "path";
import type { CommandCodeBasic } from "@atlasacademy/api-connector/dist/Schema/CommandCode";
import { cachedJson } from "../cachedFile";
import type { PathsMap } from "../types";

export const paths = {
  JP: path.join(
    process.cwd(),
    ".next/cache/atlasacademy/commandCode/basic_command_code_jp.json"
  ),
  NA: path.join(
    process.cwd(),
    ".next/cache/atlasacademy/commandCode/basic_command_code_na.json"
  )
} satisfies PathsMap;

export const File = cachedJson<CommandCodeBasic[]>({ paths });

/**
 * Gets basic Command Code export
 * @param region Region `"NA"` or `"JP"` (default: `"JP"`)
 * @returns basic Command Code export
 */
export async function getBasicCommandCodesFull(region: SupportedRegion = "JP") {
  const filePath = paths[region];
  const res = await File.readFile(filePath);
  if (!res.success) throw res.error;
  return res.data;
}

/**
 * Gets basic data of Command Codes by id
 * @param ids ids of Command Codes to get
 * @param region Region `"NA"` or `"JP"` (default: `"JP"`)
 * @returns Array of Command Codes (may include undefined if any id was not found)
 */
export async function getBasicCommandCodes(
  ids: number[],
  region: SupportedRegion = "JP"
) {
  const basicCommandCodes = await getBasicCommandCodesFull(region);
  return ids.map(id =>
    basicCommandCodes.find(commandCode => commandCode.id == id)
  );
}

/**
 * Gets basic Command Code data by id
 * @param id id of Command Code to get
 * @param region Region `"NA"` or `"JP"` (default: `"JP"`)
 * @returns Command Code or undefined if not found
 */
export async function getBasicCommandCode(
  id: number,
  region: SupportedRegion = "JP"
) {
  const basicCommandCodes = await getBasicCommandCodesFull(region);
  return basicCommandCodes.find(commandCode => commandCode.id == id);
}
