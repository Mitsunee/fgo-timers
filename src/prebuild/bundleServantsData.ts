import { List } from "@foxkit/util/object";
import { EntityType } from "@atlasacademy/api-connector/dist/Schema/Entity.js";
import { join } from "path";
import { readFileYaml } from "@foxkit/node-util/fs-yaml";
import { Log } from "../utils/log";
import { BundledServant, ServantAvailability } from "../servants/types";
import { nameServant } from "../servants/nameServant";
import { mapServantRarityToBorder } from "../servants/borders";
import { atlasCache } from "../atlas-api/cache";
import { shortenAtlasUrl } from "../atlas-api/urls";
import {
  ServantAvailabilityMap,
  ServantAvailabilitySchema
} from "../schema/ServantAvailabilityMap";
import { verifySchema } from "../schema/verifySchema";
import type { DataBundler } from "./dataBundlers";

async function getAvailabilityMap() {
  const filePath = join("assets", "data", "servants", "availability.yml");
  const data = await readFileYaml<Partial<ServantAvailabilityMap>>(filePath);
  if (!data || !verifySchema(data, ServantAvailabilitySchema, filePath)) {
    return false;
  }
  return data;
}

export const bundleServantsData: DataBundler<
  BundledServant
> = async bundles => {
  const [basicServant, basicServantNA, availabilityMap] = await Promise.all([
    atlasCache.JP.getBasicServant(),
    atlasCache.NA.getBasicServant(),
    getAvailabilityMap()
  ]);

  if (!availabilityMap) return false;

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
      classId: servant.className,
      border: mapServantRarityToBorder(servant.rarity),
      rarity: servant.rarity
    };

    if (servantNA) data.na = true;

    if (availabilityMap.storylocked.includes(servant.id)) {
      data.availability = ServantAvailability.STORYLOCKED;
    } else if (availabilityMap.limited.includes(servant.id)) {
      data.availability = ServantAvailability.LIMITED;
    } else if (availabilityMap.welfare.includes(servant.id)) {
      data.availability = ServantAvailability.WELFARE;
    } else if (availabilityMap.fp_pool.includes(servant.id)) {
      data.availability = ServantAvailability.FP_POOL;
    } else if (availabilityMap.fp_limited.includes(servant.id)) {
      data.availability = ServantAvailability.FP_LIMITED;
    } else if (availabilityMap.fp_storylocked.includes(servant.id)) {
      data.availability = ServantAvailability.FP_LOCKED;
    }

    res.set(servantId, data);
  }

  Log.info(`Mapped data for ${res.size} Servants`);
  return {
    name: "Servants",
    path: "servants.json",
    data: res
  };
};
