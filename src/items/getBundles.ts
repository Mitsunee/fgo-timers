import { join } from "path";
import { readFileJson } from "@foxkit/node-util/fs";

import { Log } from "src/utils/log";
import { BundledCE, BundledItem } from "./types";

const itemsPath = join("assets", "static", "data", "items.json");
export async function getBundledItems(): Promise<IDMap<BundledItem>> {
  const data = await readFileJson<IDMap<BundledItem>>(itemsPath);
  if (!data) {
    Log.error(`Could not read ${itemsPath}`);
    throw new Error("File not found");
  }
  return data;
}

const cesPath = join("assets", "static", "data", "ces.json");
export async function getBundledCEs(): Promise<IDMap<BundledCE>> {
  const data = await readFileJson<IDMap<BundledCE>>(cesPath);
  if (!data) {
    Log.error(`Could not read ${cesPath}`);
    throw new Error("File not found");
  }
  return data;
}
