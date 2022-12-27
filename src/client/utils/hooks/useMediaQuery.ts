import { Queries, queryMap } from "src/client/styles/media";
import { useState, useEffect } from "react";

//type DimensionQuery = `(${"min"|"max"}-${"width"|"height"}: ${number}px)`;

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
