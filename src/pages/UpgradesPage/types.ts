export type Highlight =
  | { index: number; length: number; match: string }
  | { index?: undefined; length?: undefined; match?: undefined };
