import type { ApiConnector } from "@atlasacademy/api-connector";
import type { ParsedFile } from "@foxkit/node-util/fs-extra";

export type PathsMap = Record<SupportedRegion, string>;
export type ApiDataFetcher<T> = (connector: ApiConnector) => T | Promise<T>;
export interface CacheFile<T> {
  name: string;
  paths: Partial<PathsMap>;
  File: ParsedFile<T>;
  Fetcher: ApiDataFetcher<T>;
}
