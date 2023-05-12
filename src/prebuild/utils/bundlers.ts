import { writeFile } from "@foxkit/node-util/fs";
import { resolvePath } from "@foxkit/node-util/path";
import { join } from "path";
import { Log } from "../../utils/log";

export interface PrebuildBundle<T extends {}> {
  data: T; // Data type
  name: string; // name (only used in log right now)
  path: string; // filename
  servants?: Set<number>;
  quests?: Set<number>;
  skills?: Set<number>;
  nps?: Set<number>;
  ces?: Set<number>;
  items?: Set<number>;
  ccs?: Set<number>;
  mcs?: Set<number>;
  costumes?: Set<number>;
}

export type PrebuildBundler<T extends {}> = () =>
  | PrebuildBundle<T>
  | false
  | Promise<PrebuildBundle<T> | false>;

export type PrebuildBundlersRes = Array<false | PrebuildBundle<{}>>;

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

export async function writeBundle<K extends {}>(bundle: PrebuildBundle<K>) {
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
