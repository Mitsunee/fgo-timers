export const hostUrl = (() => {
  const domain =
    process.env.NEXT_PUBLIC_DOMAIN ??
    process.env.NEXT_PUBLIC_VERCEL_URL ??
    "http://localhost:3000";
  return domain.startsWith("http") ? "" : `https://${domain}`;
})();

export function getHostUrl() {
  return new URL(hostUrl);
}
