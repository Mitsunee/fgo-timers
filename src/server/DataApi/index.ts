import { BundledNP, BundledServant, BundledSkill } from "src/servants/types";
import { BundledQuest } from "src/upgrades/types";

export interface DataSets {
  servants: IDMap<BundledServant>;
  quests: IDMap<BundledQuest>;
  skills: IDMap<BundledSkill>;
  nps: IDMap<BundledNP>;
}

export type ResponseError = { data?: undefined; success: false; error: string };

export interface ResponseData<Keys extends keyof DataSets = any> {
  success: true;
  data: Pick<DataSets, Keys>;
}

export type DataApiResponse<Keys extends keyof DataSets = any> =
  | ResponseError
  | ResponseData<Keys>;

export const fetcher = async (url: URL) => {
  const res = await fetch(url);
  if (!res.ok) {
    try {
      const { error } = await res.json();
      throw new Error(error);
    } catch {
      throw new Error("Unexpected Error");
    }
  }

  return res.json();
};

export function makeDataApiUrl(
  sets: readonly (keyof DataSets)[] | (keyof DataSets)[],
  cacheKey: string
): string {
  return `/api/data?${[...sets, `_=${cacheKey}`].sort().join("&")}`;
}
