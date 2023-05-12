import { readFileYaml } from "@foxkit/node-util/fs-yaml";
import { Log } from "../../../utils/log";
import {
  checkCustomItemPath,
  CustomItemSchema
} from "../../../schema/CustomItem";
import { checkEventPath, EventSchema } from "../../../schema/EventSchema.js";
import { checkShopPath } from "../../../schema/ShopSchema.js";
import { findLegacyParser } from "./findLegacyParser.mjs";

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
    Log.zodError(res.error, filePath);
    return false;
  }

  if (checkEventPath(filePath)) {
    const data = await readFileYaml(filePath);
    if (!data) {
      Log.error(`Could not read data file ${Log.styleParent(filePath)}`);
      return false;
    }

    const res = EventSchema.strict().safeParse(data);
    if (res.success) return true;
    Log.zodError(res.error, filePath);
    return false;
  }

  if (checkShopPath(filePath)) {
    Log.warn("Shop files are currently not supported");
  }

  Log.error(`Could not find parser ${Log.styleParent(filePath)}`);
  return false;
}
