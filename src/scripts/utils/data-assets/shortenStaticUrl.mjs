import { warn } from "../log.mjs";

const ATLAS_STATIC = "https://static.atlasacademy.io/";

export function shortenStaticUrl(url) {
  if (!url.startsWith(ATLAS_STATIC)) {
    warn(
      `URL '${url} is not using domain ${ATLAS_STATIC} and has not been altered'`
    );
    return url;
  }

  return url.slice(ATLAS_STATIC.length);
}
