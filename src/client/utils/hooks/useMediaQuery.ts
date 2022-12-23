import { useState, useEffect } from "react";

//type DimensionQuery = `(${"min"|"max"}-${"width"|"height"}: ${number}px)`;

/* please keep in sync with styles/media.css */
const queries = [
  ["x-large", "(min-width: 1280px)"],
  ["large", "(min-width: 992px)"],
  ["medium", "(min-width: 768px)"],
  ["small", "(min-width: 512px)"],
  ["only-small", "(max-width: 511.99999px)"]
] as const;
type Queries = typeof queries[number][0];
const queryMap = new Map<string, string /*DimensionQuery*/>(queries);

export function useMediaQuery(
  queryName: Queries | (string & {}),
  assumeTrue: boolean = false
) {
  const [matches, setMatches] = useState<boolean>(assumeTrue);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const query: string = queryMap.get(queryName) || queryName;
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    listener();
    if (media.addEventListener) {
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    }
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [queryName]);

  return matches;
}
