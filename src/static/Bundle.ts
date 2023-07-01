import { ParsedFile } from "@foxkit/node-util/fs-extra";

export class BundleFile<T> {
  readonly filePath: string;
  readonly File: ParsedFile<T>;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.File = new ParsedFile<T>({
      limitPath: filePath,
      parse: JSON.parse,
      stringify: JSON.stringify,
      cache: true
    });
  }

  async readFile() {
    const res = await this.File.readFile(this.filePath);
    if (!res.success) throw res.error;
    return res.data;
  }

  async writeFile(data: T) {
    return this.File.writeFile(this.filePath, data);
  }
}
