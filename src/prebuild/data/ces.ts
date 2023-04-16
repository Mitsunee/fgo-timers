import { List } from "@foxkit/util/object";
import { join } from "path";
import { atlasCache } from "../../atlas-api/cache";
import { shortenAtlasUrl } from "../../atlas-api/urls";
import { Log } from "../../utils/log";
import { getAvailabilityMap } from "../../utils/availabilityMaps";
import { mapServantRarityToBorder } from "../../servants/borders";
import type { DataBundler } from "../utils/dataBundlers";
import type { BundledCE } from "../../items/types";

const avMapPath = join("assets", "data", "ces", "availability.yml");

export const bundleCEsData: DataBundler<BundledCE> = async ids => {
  const [basicCE, basicCENA, availabilityMap] = await Promise.all([
    atlasCache.JP.getBasicCE(),
    atlasCache.NA.getBasicCE(),
    getAvailabilityMap(avMapPath)
  ]);

  if (!availabilityMap) {
    Log.error(`Could not find availability map at '${avMapPath}'`);
    return false;
  }

  const ceQueue = List.fromArray([...ids]); // to be processed
  const res = new Map<number, BundledCE>(); // result of processing

  while (ceQueue.length > 0) {
    const ceId = ceQueue.shift()!;
    const ce = basicCE.find(ce => ce.id == ceId);
    if (!ce) {
      Log.error(`Could not find ce id ${ceId}`);
      return false;
    }

    const ceNA = basicCENA.find(ceNA => ceNA.id == ceId);
    const availability = availabilityMap.match(ceId);
    const data: BundledCE = {
      name: ceNA?.name || ce.name,
      icon: shortenAtlasUrl(ce.face),
      border: mapServantRarityToBorder(ce.rarity),
      rarity: ce.rarity
    };

    if (ceNA) data.na = true;
    if (availability) data.availability = availability;

    res.set(ceId, data);
  }

  Log.info(`Mapped data for ${res.size} CEs`);
  return {
    name: "CEs",
    path: "ces.json",
    data: res
  };
};
