import path from "path";
import type { FileWriteResult } from "@foxkit/node-util/fs-extra";
import { List } from "@foxkit/util/object";
import { Log } from "~/utils/log";
import type { BundleFile } from "~/static/Bundle";

export interface DataBundlerResult {
  name: string;
  result: FileWriteResult;
}

export type DataTransformer<T> = (
  /**
   * id to process
   */
  id: number,
  /**
   * Callback function to add an id to queue. The id will be checked against a
   * set to avoid duplicate entries.
   */
  add: (id: number) => void
) => T | undefined | Promise<T | undefined>;

//export type DataBundler = (ids: Set<number>) => DataBundlerResult | undefined;

export class DataBundler<T> {
  file: BundleFile<PartialDataMap<T>>;
  transform: DataTransformer<T>;

  constructor(options: {
    file: BundleFile<PartialDataMap<T>>;
    transform: DataTransformer<T>;
  }) {
    this.file = options.file;
    this.transform = options.transform;
  }

  /**
   * Processes set of AtlasAcademy API data by id
   * @param set Set of ids to bundle
   * @throws Throws when any id was not found
   * @returns Bundled data
   */
  async process(set: Set<number>) {
    const knownId = new Set(set);
    const queue = List.fromArray(Array.from(set));
    let current = queue.getNode(0) || null; // TEMP: ListNode type is not exported right now, so I put `|| null` to set the inferred type
    const data = new Map<number, T>();
    const addToQueue = (id: number) => {
      if (knownId.has(id)) return;
      queue.push(id);
      knownId.add(id);
    };

    while (current) {
      const res = await this.transform(current.value, addToQueue);
      if (!res) {
        throw new Error(`Error while Bundling ${this.file.name}`);
      }

      data.set(current.value, res);
      current = current.next;
    }

    return data;
  }

  /**
   * Prebuild function to process set of ids and automatically write bundle
   * @param set Set of ids
   * @returns DataBundlerResult
   */
  async processBundle(set: Set<number>): Promise<DataBundlerResult> {
    try {
      const dataMap = await this.process(set);
      const data = Object.fromEntries(dataMap.entries());
      const res = await this.file.writeBundle(data);

      if (!res.success) Log.error(res.error);

      Log.ready(
        `Mapped data for ${dataMap.size} ${this.file.name} ${Log.styleParent(
          path.relative(process.cwd(), this.file.filePath)
        )}`
      );

      return { name: this.file.name, result: res };
    } catch (e) {
      return { name: this.file.name, result: { success: false, error: e } };
    }
  }
}
