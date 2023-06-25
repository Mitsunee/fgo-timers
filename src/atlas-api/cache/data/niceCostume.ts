import type { CostumeDetail } from "@atlasacademy/api-connector/dist/Schema/Profile";
import type { ServantWithLore } from "@atlasacademy/api-connector/dist/Schema/Servant";
import { getNiceServantsFull } from "./niceServant";

interface Costume extends CostumeDetail {
  face: string;
  owner: number;
}

const niceCostumesCache: {
  JP?: Costume[];
  NA?: Costume[];
} = {};

function mapCostumesOfServant(servant: ServantWithLore) {
  const costumeFaces = servant.extraAssets.faces.costume;
  if (!costumeFaces) return [];
  return Object.entries(servant.profile.costume).map(
    ([key, detail]): Costume =>
      Object.assign({}, detail, { owner: servant.id, face: costumeFaces[+key] })
  );
}

/**
 * Generates nice Costume export from niceServantWithLore
 * @param region Region `"NA"` or `"JP"` (default: `"JP"`)
 * @returns nice Costume export
 */
export async function getNiceCostumesFull(region: SupportedRegion = "JP") {
  return (niceCostumesCache[region] ??= (
    await getNiceServantsFull(region)
  ).flatMap(mapCostumesOfServant));
}

/**
 * Gets nice data of Costumes by id
 * @param ids ids of Costumes to get
 * @param region Region `"NA"` or `"JP"` (default: `"JP"`)
 * @returns Array of Costumes (may include undefined if any id was not found)
 */
export async function getNiceCostumes(
  ids: number[],
  region: SupportedRegion = "JP"
) {
  const niceCostumes = await getNiceCostumesFull(region);
  return ids.map(id => niceCostumes.find(costume => costume.id == id));
}

/**
 * Gets nice Costume data by id
 * @param id id of Costume to get
 * @param region Region `"NA"` or `"JP"` (default: `"JP"`)
 * @returns Costume or undefined if not found
 */
export async function getNiceCostume(
  id: number,
  region: SupportedRegion = "JP"
) {
  const niceCostumes = await getNiceCostumesFull(region);
  return niceCostumes.find(costume => costume.id == id);
}
