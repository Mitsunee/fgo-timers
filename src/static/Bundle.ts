import { ParsedFile } from "@foxkit/node-util/fs-extra";
import { Log } from "~/utils/log";

export class BundleFile<T> extends ParsedFile<T> {
  readonly filePath: string;
  readonly name: string;

  constructor(options: { name: string; filePath: string }) {
    if (!/assets\/static(\/data)?\/[a-z_]+\.json$/.test(options.filePath)) {
      Log.error(`Invalid BundleFile path passed for ${options.name}`);
      Log.debug({ options });
      Log.throw(
        `Invalid BundleFile passed. Path must be located in assets/static/ and be a .json file`
      );
    }

    super({
      limitPath: options.filePath,
      parse: file => JSON.parse(file),
      stringify: JSON.stringify,
      cache: true
    });

    this.name = options.name;
    this.filePath = options.filePath;
  }

  async readBundle() {
    const res = await this.readFile(this.filePath);
    if (!res.success) throw res.error;
    return res.data;
  }

  async writeBundle(data: T) {
    return this.writeFile(this.filePath, data);
  }
}
