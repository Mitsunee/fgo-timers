import { List } from "@foxkit/util/object";
import { atlasCache } from "../atlas-api/cache";
import { shortenAtlasUrl } from "../atlas-api/urls";
import { Log } from "../utils/log";
import { mapServantRarityToBorder } from "../servants/borders";
import type { DataBundler } from "./dataBundlers";
import { BundledCE } from "src/items/types";

// TODO: implement availability and maybe rarity? (see servants)

export const bundleCEsData: DataBundler<BundledCE> = async bundles => {
  const [basicCE, basicCENA] = await Promise.all([
    atlasCache.JP.getBasicCE(),
    atlasCache.NA.getBasicCE()
  ]);
  const ceQueue = new List<number>(); // to be processed
  const knownCEs = new Set<number>(); // are queued or processed
  const res = new Map<number, BundledCE>(); // result of processing

  for (const bundle of bundles) {
    if (!bundle.ces) continue;
    for (const id of bundle.ces) {
      if (knownCEs.has(id)) continue;
      ceQueue.push(id);
      knownCEs.add(id);
    }
  }

  while (ceQueue.length > 0) {
    const ceId = ceQueue.shift()!;
    const ce = basicCE.find(ce => ce.id == ceId);
    const ceNA = basicCENA.find(ceNA => ceNA.id == ceId);
    if (!ce) {
      Log.error(`Could not find ce id ${ceId}`);
      return false;
    }

    const data: BundledCE = {
      name: ceNA?.name || ce.name,
      icon: shortenAtlasUrl(ce.face),
      border: mapServantRarityToBorder(ce.rarity)
    };

    if (ceNA) data.na = true;

    res.set(ceId, data);
  }

  Log.info(`Mapped data for ${res.size} CEs`);
  return {
    name: "CEs",
    path: "ces.json",
    data: res
  };
};
