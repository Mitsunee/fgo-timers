type IDMap<T> = { [key: number]: T | undefined };
type PlainObject<T = any> = { [key: string]: T };
interface BuildInfo {
  date: number;
  version: string;
}
type Stringable = string | number | { toString(): string };
