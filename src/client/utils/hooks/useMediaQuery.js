import { useState, useEffect } from "react";

/* please keep in sync with styles/media.css */
const queryMap = new Map([
  ["x-large", "(min-width: 1280px)"],
  ["large", "(min-width: 992px)"],
  ["medium", "(min-width: 768px)"],
  ["small", "(min-width: 512px)"]
]);

export function useMediaQuery(queryName, assumeTrue = false) {
  const [matches, setMatches] = useState(assumeTrue);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const query = queryMap.get(queryName) || queryName;
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
