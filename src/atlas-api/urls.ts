const URLs = {
  API: { long: "https://api.atlasacademy.io", short: "%API%" },
  STATIC: { long: "https://static.atlasacademy.io/", short: "%CDN%" }
};

export function shortenAtlasUrl(url: string): string {
  return url
    .replace(new RegExp(`^${URLs.API.long}`), URLs.API.short)
    .replace(new RegExp(`^${URLs.STATIC.long}`), URLs.STATIC.short);
}

export function expandAtlasUrl(url: string): string {
  return url
    .replace(new RegExp(`^${URLs.API.short}`), URLs.API.long)
    .replace(new RegExp(`^${URLs.STATIC.short}`), URLs.STATIC.long);
}
