import type { Quest } from "@atlasacademy/api-connector/dist/Schema/Quest";
import { atlasCache } from "~/atlas-api/cache";
import type { SupportedRegion } from "~/atlas-api/api";

const niceQuestMap: {
  NA?: Quest[];
  JP?: Quest[];
} = {};

async function flatMapWar(region: SupportedRegion) {
  const niceWar = await atlasCache[region].getNiceWar();
  return niceWar.flatMap(war => war.spots.flatMap(spot => spot.quests));
}

export async function getQuestData(id: number, region: SupportedRegion) {
  niceQuestMap[region] ??= await flatMapWar(region);
  return niceQuestMap[region]?.find(quest => quest.id === id);
}
