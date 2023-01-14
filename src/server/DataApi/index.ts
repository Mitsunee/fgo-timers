/**
 * ! DEPRECATED !
 */
import type {
  BundledNP,
  BundledServant,
  BundledSkill
} from "src/servants/types";
import type { BundledQuest, Upgrade } from "src/upgrades/types";

export interface UpgradesPageData {
  upgrades: Upgrade[];
  servants: IDMap<BundledServant>;
  quests: IDMap<BundledQuest>;
  skills: IDMap<BundledSkill>;
  nps: IDMap<BundledNP>;
}

export type ResponseError = { data?: undefined; success: false; error: string };
export interface ResponseData<T extends {}> {
  success: true;
  data: T;
  error?: undefined;
}
export type DataApiResponse<T extends {}> = ResponseError | ResponseData<T>;
export type DataApiFallback<U extends string, T extends {}> = {
  fallback: Pick<Record<U, T>, U>;
};

function isSuccess<T extends {}>(
  data: DataApiResponse<T>
): data is ResponseData<T> {
  return data.success == true;
}

export const fetcher = async <T extends {}>(url: URL | string) => {
  //await sleep(5000);
  const res = await fetch(url);
  const data: DataApiResponse<T> = await res.json();
  if (!res.ok || !isSuccess(data)) {
    throw new Error(data.error);
  }

  return data.data;
};
