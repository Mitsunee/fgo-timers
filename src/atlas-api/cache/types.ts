import type { ApiConnector } from "@atlasacademy/api-connector";

export type PathsMap = Record<SupportedRegion, string>;
export type ApiDataFetcher<T> = (connector: ApiConnector) => T | Promise<T>;
