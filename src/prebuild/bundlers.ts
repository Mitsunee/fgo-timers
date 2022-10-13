import { writeFile } from "@foxkit/node-util/fs";
import { resolvePath } from "@foxkit/node-util/path";
import { join } from "path";

import { Log } from "../utils/log";

// BUG: types accept Set, WeakMap, Map and such, but should only accept serializable types

export interface PrebuildBundle<T extends object> {
  data: T; // Data type
  name: string; // name (only used in log right now)
  path: string; // filename
  servants?: number[]; // as ID
  quests?: number[]; // as ID
  skills?: number[]; // as ID
  nps?: number[]; // as ID
  ces?: number[]; // as ID
}

export type PrebuildBundler<T extends object> = () =>
  | PrebuildBundle<T>
  | false
  | Promise<PrebuildBundle<T> | false>;

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
  const relativePath = join("assets", "static", bundle.path);
  const filePath = resolvePath(relativePath);
  try {
    await writeFile(filePath, bundle.data);
    Log.ready(
      `Built ${bundle.name} bundle in ${Log.styleParent(relativePath)}`
    );
    return true;
  } catch (e) {
    Log.error(e);
    return false;
  }
}
