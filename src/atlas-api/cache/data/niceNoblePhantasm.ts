import type { NoblePhantasm } from "@atlasacademy/api-connector/dist/Schema/NoblePhantasm";
import { getNiceServantsFull } from "./niceServant";

const niceNoblePhantasmCache: {
  JP?: NoblePhantasm[];
  NA?: NoblePhantasm[];
} = {};

/**
 * Generates nice Noble Phantasm export from niceServantWithLore
 * @param region Region `"NA"` or `"JP"` (default: `"JP"`)
 * @returns nice Noble Phantasm export
 */
export async function getNiceNoblePhantasmsFull(
  region: SupportedRegion = "JP"
) {
  return (niceNoblePhantasmCache[region] ??= (await getNiceServantsFull(region))
    .flatMap(servant => servant.noblePhantasms)
    // filter typechanged NPs
    .filter(noblePhantasm => noblePhantasm.priority > 0));
}

/**
 * Gets nice data of Noble Phantasms by id
 * @param ids ids of Noble Phantasms to get
 * @param region Region `"NA"` or `"JP"` (default: `"JP"`)
 * @returns Array of Noble Phantasms (may include undefined if any id was not found)
 */
export async function getNiceNoblePhantasms(
  ids: number[],
  region: SupportedRegion = "JP"
) {
  const niceNoblePhantasms = await getNiceNoblePhantasmsFull(region);
  return ids.map(id =>
    niceNoblePhantasms.find(noblePhantasm => noblePhantasm.id == id)
  );
}

/**
 * Gets nice Noble Phantasm data by id
 * @param id id of Noble Phantasm to get
 * @param region Region `"NA"` or `"JP"` (default: `"JP"`)
 * @returns Noble Phantasm or undefined if not found
 */
export async function getNiceNoblePhantasm(
  id: number,
  region: SupportedRegion = "JP"
) {
  const niceNoblePhantasms = await getNiceNoblePhantasmsFull(region);
  return niceNoblePhantasms.find(noblePhantasm => noblePhantasm.id == id);
}
