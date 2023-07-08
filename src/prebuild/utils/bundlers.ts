import path from "path";
import type { FileWriteResult } from "@foxkit/node-util/fs-extra";
import type { AnyZodObject, output as ZodOutput } from "zod";
import { Log } from "~/utils/log";
import type { ParsedYaml } from "~/schema/ParsedYaml";
import type { BundleFile } from "~/static/Bundle";
import type { IDCollection } from "./collectIds";

export interface PrebuildBundlerResult {
  name: string;
  success: boolean;
  ids: Partial<IDCollection>;
}

/**
 * Handles logging and normalising of bundle results
 * @param bundleResult Object that should contain a name, size, result and ids
 * @returns Normalized PrebuildBundlerResult
 */
export function handleBundlerResult({
  name,
  size,
  result,
  ids = {},
  outputPath
}: {
  /**
   * Name in log
   */
  name: string; // name (only used in log right now)
  /**
   * Amount of thing mapped, omitting this fails build!
   */
  size?: number;
  /**
   * Result should be a FileWriteResult (success status is handled), omitting
   * this fails build!
   */
  result?: FileWriteResult;
  /**
   * Collection of ids used in data
   */
  ids?: Partial<IDCollection>;
  /**
   * File path of where output has been saved, omitting this fails build!
   */
  outputPath?: string;
}): PrebuildBundlerResult {
  if (!result || !size || !outputPath) {
    Log.error(`Encountered error while bundling ${name}`);
    return { name, success: false, ids: {} };
  }

  if (!result.success) {
    Log.error(`Encountered write failure while bundling ${name}`);
    Log.error(result.error);
    return { name, success: false, ids: {} };
  }

  Log.ready(
    `Mapped data for ${size} ${name} ${Log.styleParent(
      path.relative(process.cwd(), outputPath)
    )}`
  );
  return { name, success: true, ids };
}

type ReadDirResult<S extends AnyZodObject, T = ZodOutput<S>> = Awaited<
  ReturnType<ParsedYaml<S, T>["readDir"]>
>;

interface BundlerResult<B> {
  data: B;
  size: number;
  ids: Partial<IDCollection>;
}

type BundlerTransformer<B, S extends AnyZodObject, T = ZodOutput<S>> = (
  files: ReadDirResult<S, T>
) => BundlerResult<B> | Promise<BundlerResult<B>>;

/**
 * PrebuildBundler class to use for handling directories of yaml files
 */
export class DirectoryBundler<B, S extends AnyZodObject, T = ZodOutput<S>> {
  /**
   * Name in log
   */
  name: string;
  /**
   * Set `true` to enable recursive directory traversal
   */
  recursive?: true;
  /**
   * `ParsedYaml` adapter to the type of file to bundle
   */
  inputFile: ParsedYaml<S, T>;
  /**
   * `BundleFile` for the bundle target
   */
  outputFile: BundleFile<B>;
  /**
   * Transformer function that takes result of `readDir` and creates bundle in
   * correct format as per type of outputFile
   */
  bundle: BundlerTransformer<B, S, T>;

  constructor(options: {
    name: string;
    recursive?: boolean;
    inputFile: ParsedYaml<S, T>;
    outputFile: BundleFile<B>;
    bundle: BundlerTransformer<B, S, T>;
  }) {
    this.name = options.name;
    this.inputFile = options.inputFile;
    this.outputFile = options.outputFile;
    this.bundle = options.bundle;
    if (options.recursive) this.recursive = true;
  }

  async processBundle() {
    try {
      const files = await this.inputFile.readDir(this.inputFile.limitPath, {
        recursive: this.recursive
      });
      const bundled = await this.bundle(files);
      const result = await this.outputFile.writeBundle(bundled.data);
      return handleBundlerResult(
        Object.assign({}, bundled, {
          result,
          name: this.name,
          outputPath: this.outputFile.filePath
        })
      );
    } catch (error) {
      Log.error(`Encountered error while bundling ${this.name}`);
      Log.error(error);
      return handleBundlerResult({ name: this.name });
    }
  }
}

/**
 * PrebuildBundler class to use for bundles without input files
 */
export class PrebuildBundler<T> {
  name: string;
  outputFile: BundleFile<T>;
  bundle: () => Promise<BundlerResult<T>>;

  constructor(options: {
    /**
     * Name in log
     */
    name: string;
    /**
     * `BundleFile` for the bundle target
     */
    outputFile: BundleFile<T>;
    /**
     * Method that generates bundle data as was as ID collection
     */
    bundle: () => Promise<BundlerResult<T>>;
  }) {
    this.name = options.name;
    this.outputFile = options.outputFile;
    this.bundle = options.bundle;
  }

  async processBundle() {
    try {
      const bundled = await this.bundle();
      const result = await this.outputFile.writeBundle(bundled.data);
      return handleBundlerResult(
        Object.assign({}, bundled, {
          result,
          name: this.name,
          outputPath: this.outputFile.filePath
        })
      );
    } catch (error) {
      Log.error(`Encountered error while bundling ${this.name}`);
      Log.error(error);
      return handleBundlerResult({ name: this.name });
    }
  }
}
