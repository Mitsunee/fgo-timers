import type { Quest } from "@atlasacademy/api-connector/dist/Schema/Quest";
import { atlasCache } from "../atlas-api/cache";
import { SupportedRegion } from "../atlas-api/api";

const niceQuestMap: {
  NA?: Quest[];
  JP?: Quest[];
} = {};

export async function getQuestData(id: number, region: SupportedRegion) {
  if (!niceQuestMap[region]) {
    const niceWar = await atlasCache[region].getNiceWar();
    niceQuestMap[region] = niceWar.flatMap(war =>
      war.spots.flatMap(spot => spot.quests)
    );
  }

  const niceQuest = niceQuestMap[region] as Quest[];
  return niceQuest.find(quest => quest.id === id);
}
