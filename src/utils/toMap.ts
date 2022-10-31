export function toMap<T>(obj: IDMap<T | undefined>): Map<number, T> {
  return new Map(
    Object.entries(obj)
      .filter(entry => typeof entry[1] !== "undefined")
      .map(([key, val]) => [+key, val!])
  );
}
