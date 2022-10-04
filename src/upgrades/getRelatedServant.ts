import { atlasCache } from "../atlas-api/cache";
import { SupportedRegion } from "../atlas-api/api";

export async function getRelatedServant(
  questId: number,
  region: SupportedRegion
) {
  const niceServant = await atlasCache[region].getNiceServant();
  return niceServant.find(servant => servant.relateQuestIds.includes(questId));
}
