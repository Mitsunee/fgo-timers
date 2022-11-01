import { findLegacyParser } from "./findLegacyParser.mjs";
import { Log } from "../../../utils/log";
import {
  checkCustomItemPath,
  CustomItemSchema
} from "../../../schema/CustomItem";
import { readFileYaml } from "@foxkit/node-util/fs-yaml";
import { z } from "zod";

export async function checkDataFile(filePath) {
  // handle legacy files
  const [, parser] = findLegacyParser(filePath);
  if (parser) {
    try {
      await parser(filePath);
      return true;
    } catch (e) {
      Log.error(e, filePath);
      return false;
    }
  }

  // handle custom item files
  if (checkCustomItemPath(filePath)) {
    // attempt to read data
    const data = await readFileYaml(filePath);
    if (!data) {
      Log.error(`Could not read data file ${Log.styleParent(filePath)}`);
      return false;
    }

    const res = CustomItemSchema.safeParse(data);
    if (res.success) return true;
    Log.zodError(res.error);
    return false;
  }

  Log.error(`Could not find parser ${Log.styleParent(filePath)}`);
  return false;
}
