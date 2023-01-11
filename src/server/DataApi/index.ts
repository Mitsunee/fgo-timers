//import { sleep } from "@foxkit/util/sleep";

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
