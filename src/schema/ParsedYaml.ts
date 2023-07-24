import { ParsedFile } from "@foxkit/node-util/fs-extra";
import YAML from "yaml";
import { ZodError } from "zod";
import type { output as ZodOutput, ZodSchema } from "zod";
import { Log } from "~/utils/log";

export class ParsedYaml<
  S extends ZodSchema,
  T = ZodOutput<S>
> extends ParsedFile<T> {
  limitPath: string;

  constructor(options: {
    schema: S;
    limitPath: string;
    transform?: (value: ZodOutput<S>) => T | Promise<T>;
  }) {
    async function parse(contentStr: string, filePath: string) {
      try {
        const content = YAML.parse(contentStr);
        const parsed = options.schema.parse(content);
        if (!options.transform) return parsed as T;
        return options.transform(parsed);
      } catch (e) {
        if (e instanceof ZodError) {
          Log.zodError(e, filePath);
          throw new Error(`Schema Parse Error in ${filePath}`);
        }
        throw e;
      }
    }

    super({
      parse,
      limitPath: options.limitPath,
      extensions: [".yml"],
      cache: true
    });

    this.limitPath = options.limitPath; // re-set for typescript to be happy :)
  }
}
