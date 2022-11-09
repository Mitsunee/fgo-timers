import useSWR from "swr";
import {
  DataApiResponse,
  DataSets,
  fetcher,
  makeDataApiUrl
} from "src/server/DataApi";

export function useDataApi<
  Fallback extends Partial<DataSets>,
  Keys extends Extract<keyof Fallback, keyof DataSets>
>(
  sets: Keys[],
  fallback: Fallback,
  cacheKey: string
): {
  data: Pick<DataSets, Keys> & { success?: boolean };
  error: boolean;
  loading: boolean;
} {
  const url = makeDataApiUrl(sets, cacheKey);
  const res = useSWR<DataApiResponse<Keys>>(url, fetcher);

  return {
    data: res.data?.data || (fallback as Pick<DataSets, Keys>),
    error: res.error,
    loading: !res.data
  };
}
