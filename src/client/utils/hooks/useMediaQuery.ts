import { useEffect, useState } from "react";
import { queryMap } from "~/client/styles/media";
import type { Queries } from "~/client/styles/media";

//type DimensionQuery = `(${"min"|"max"}-${"width"|"height"}: ${number}px)`;

/**
 * Media query subscription hook
 * @param queryName Either query alias (same as custom queries set in media.css) or query as string
 * @param assumeTrue Default value to assume on first render
 * @returns boolean
 */
export function useMediaQuery(
  // eslint-disable-next-line @typescript-eslint/ban-types
  queryName: Queries | (string & {}),
  assumeTrue = false
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
