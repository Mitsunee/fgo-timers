import { ParsedFile } from "@foxkit/node-util/fs-extra";

export class BundleFile<T> {
  File: ParsedFile<T>;
  cache?: T;

  constructor(filePath: string) {
    this.File = new ParsedFile<T>({
      limitPath: filePath,
      parse: JSON.parse,
      stringify: JSON.stringify
    });
  }

  // this should replace the public method when ParsedFile has its own caching
  async #readFile() {
    const res = await this.File.readFile(this.File.limitPath!);
    if (!res.success) throw res.error;
    return res.data;
  }

  async readFile() {
    return (this.cache ??= await this.#readFile());
  }

  async writeFile(data: T) {
    const res = await this.File.writeFile(this.File.limitPath!, data);
    if (res.success) this.cache = data;
    return res;
  }
}
