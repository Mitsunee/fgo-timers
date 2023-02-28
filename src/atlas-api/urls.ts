const URLs = {
  API: { long: "https://api.atlasacademy.io", short: "%API%" },
  STATIC: { long: "https://static.atlasacademy.io/", short: "%CDN%" }
};

/**
 * Shortens url by replacing known urls with shorthands
 * @param url url to shorten
 * @returns shortened url
 */
export function shortenAtlasUrl(url: string): string {
  return url
    .replace(new RegExp(`^${URLs.API.long}`), URLs.API.short)
    .replace(new RegExp(`^${URLs.STATIC.long}`), URLs.STATIC.short);
}

/**
 * Unshortens shortened url referencing shorthands
 * @param url url to unshorten
 * @returns unshortened url
 */
export function expandAtlasUrl(url: string): string {
  return url
    .replace(new RegExp(`^${URLs.API.short}`), URLs.API.long)
    .replace(new RegExp(`^${URLs.STATIC.short}`), URLs.STATIC.long);
}

/**
 * Converts url to Entity face to url to bordered Entity face
 * @param url url to Entity face
 * @returns url to bordered Entity face
 */
export function faceToBordered(url: string): string {
  return url.replace(/f_(\d+)\.png$/, "f_$1_bordered.png");
}
