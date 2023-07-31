/* please keep in sync with ./media.css */
const queries = [
  ["x-large", "(min-width: 1280px)"],
  ["large", "(min-width: 992px)"],
  ["medium", "(min-width: 768px)"],
  ["small", "(min-width: 512px)"],
  ["only-small", "(max-width: 511.99999px)"]
] as const;

// eslint-disable-next-line @typescript-eslint/ban-types
export type Queries = (typeof queries)[number][0] | (string & {});

export const queryMap = new Map<Queries, string /*DimensionQuery*/>(queries);
