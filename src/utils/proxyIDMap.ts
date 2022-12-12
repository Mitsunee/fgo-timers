import { Log } from "./log";

export function safeProxyIDMap<T>(
  map: IDMap<T>,
  errMessage: string
): Record<number, T> {
  return new Proxy(map, {
    get(target, key: `${number}`) {
      const res = target[+key];
      if (!res) {
        Log.error(errMessage.replace("%KEY%", key));
        throw new Error("Invalid data");
      }
      return res;
    }
  }) as Record<number | `${number}`, T>;
}
