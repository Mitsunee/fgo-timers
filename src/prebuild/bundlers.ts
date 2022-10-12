import { writeFile } from "@foxkit/node-util/fs";
import { resolvePath } from "@foxkit/node-util/path";

import { Log } from "../utils/log";

// BUG: types accept Set, WeakMap, Map and such, but should only accept serializable types

export interface PrebuildBundle<T extends object> {
  data: T; // Data type
  name: string; // static export filename
  servants?: number[]; // as ID
  quests?: number[]; // as ID
  ces?: number[]; // as ID
}

export type PrebuildBundler<T extends object> = () =>
  | PrebuildBundle<T>
  | Promise<PrebuildBundle<T>>
  | false;

export async function runLegacyBundler(
  bundler: () => Promise<boolean>
): Promise<boolean> {
  try {
    return await bundler();
  } catch (e) {
    Log.error(e);
    return false;
  }
}

export async function writeBundle<K extends object>(bundle: PrebuildBundle<K>) {
  const filePath = resolvePath("assets", "static", bundle.name);
  try {
    await writeFile(filePath, bundle.data);
    return true;
  } catch (e) {
    Log.error(e);
    return false;
  }
}
