import prettierPkg from "prettier";
import { dedent } from "foxkit/dedent";

export const dd = dedent({
  tabWidth: 2,
  useTabs: false,
  trim: true
});

const configPromise = prettierPkg.resolveConfig(process.cwd());
let configCache;

export async function getConfig() {
  if (configCache) return configCache;

  configCache = {
    parser: "babel",
    ...(await configPromise)
  };

  return configCache;
}

export async function prettier(dirtyCode) {
  const config = await getConfig();
  return prettierPkg.format(dd(dirtyCode), config);
}
