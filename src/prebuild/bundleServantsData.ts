import { List } from "@foxkit/util/object";
import { EntityType } from "@atlasacademy/api-connector/dist/Schema/Entity.js";
import { Log } from "../utils/log";
import type { BundledServant } from "../servants/types";
import { nameServant } from "../servants/nameServant";
import { mapServantRarityToBorder } from "../servants/borders";
import { atlasCache } from "../atlas-api/cache";
import { shortenAtlasUrl } from "../atlas-api/urls";
import type { DataBundler } from "./dataBundlers";

export const bundleServantsData: DataBundler<
  BundledServant
> = async bundles => {
  const [basicServant, basicServantNA] = await Promise.all([
    atlasCache.JP.getBasicServant(),
    atlasCache.NA.getBasicServant()
  ]);
  const servantQueue = new List<number>(); // to be processed
  const knownServants = new Set<number>(); // are queued or processed
  const res = new Map<number, BundledServant>(); // result of processing

  for (const bundle of bundles) {
    if (!bundle.servants) continue;
    for (const id of bundle.servants) {
      if (knownServants.has(id)) continue;
      servantQueue.push(id);
      knownServants.add(id);
    }
  }

  while (servantQueue.length > 0) {
    const servantId = servantQueue.shift()!;
    const servant = basicServant.find(servant => servant.id == servantId);
    if (!servant || servant.type != EntityType.NORMAL) {
      Log.error(`Could not find servant id ${servantId}`);
      return false;
    }

    const servantNA = basicServantNA.find(servant => servant.id == servantId);
    const { name, search } = await nameServant(servant.id);
    const data: BundledServant = {
      name,
      search,
      icon: shortenAtlasUrl(servant.face),
      className: servant.className,
      border: mapServantRarityToBorder(servant.rarity)
    };

    if (servantNA) data.na = true;

    res.set(servantId, data);
  }

  Log.info(`Mapped data for ${res.size} Servants`);
  return {
    name: "Servants",
    path: "servants.json",
    data: res
  };
};
