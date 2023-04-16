import { writeFile } from "@foxkit/node-util/fs";
import { resolvePath } from "@foxkit/node-util/path";
import { join } from "path";
import { Log } from "../../utils/log";

export interface DataBundle<T extends object> {
  data: Map<number, T>;
  name: string;
  path: string;
}

export type DataBundler<T extends object> = (
  ids: Set<number>
) => DataBundle<T> | false | Promise<DataBundle<T> | false>;

export type DataBundlersRes = Array<false | DataBundle<object>>;

export async function writeDataBundle<K extends object>(
  bundle: DataBundle<K>
): Promise<boolean> {
  const relativePath = join("assets", "static", "data", bundle.path);
  const filePath = resolvePath(relativePath);
  try {
    await writeFile(filePath, Object.fromEntries(bundle.data.entries()));
    Log.ready(
      `Built ${bundle.name} bundle in ${Log.styleParent(relativePath)}`
    );
    return true;
  } catch (e) {
    Log.error(e);
    return false;
  }
}
