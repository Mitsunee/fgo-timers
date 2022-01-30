/* shortenStaticUrl
 * Shortens urls to static.atlasacademy.io
 */

import { log } from "@foxkit/node-util/log";

const ATLAS_STATIC = "https://static.atlasacademy.io/";

export function shortenStaticUrl(url) {
  if (!url.startsWith(ATLAS_STATIC)) {
    log.warn(
      `URL '${url} is not using domain ${ATLAS_STATIC} and has not been altered'`
    );
    return url;
  }

  return url.slice(ATLAS_STATIC.length);
}
