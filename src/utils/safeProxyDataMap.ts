import { Log } from "./log";

export function safeProxyDataMap<T>(
  map: PartialDataMap<T>,
  errMessage: string
): Record<number, T> {
  return new Proxy(map, {
    get(target, key: `${number}`) {
      // @ts-ignore
      if (key == "then") return undefined; // even the await keyword will try to access "then". Thanks JavaScript.
      const res = target[+key];
      if (!res) {
        Log.error(errMessage.replace("%KEY%", key));
        throw new Error("Invalid data");
      }
      return res;
    }
  }) as Record<number | `${number}`, T>;
}
