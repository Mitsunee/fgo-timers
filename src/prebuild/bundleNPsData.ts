import { List } from "@foxkit/util/object";
import type { SupportedRegion } from "../atlas-api/api";
import { atlasCache } from "../atlas-api/cache";
import { Log } from "../utils/log";
import type { BundledNP } from "../servants/types";
import { getOwner } from "../servants/getOwner";
import { mapUpgradeLevelToSkillBorder } from "../servants/borders";
import { getNPType } from "../servants/getNPType";
import { getUpgradeLevel } from "../upgrades/getUpgradeLevel";
import type { DataBundler } from "./dataBundlers";

async function flatMapNPs(region: SupportedRegion) {
  const niceServant = await atlasCache[region].getNiceServant();
  return niceServant.flatMap(servant => servant.noblePhantasms);
}

export const bundleNPsData: DataBundler<BundledNP> = async bundles => {
  const [niceNoblePhantasm, niceNoblePhantasmNA] = await Promise.all([
    flatMapNPs("JP"),
    flatMapNPs("NA")
  ]);
  const npQueue = new List<number>(); // to be processed
  const knownNPs = new Set<number>(); // are queued or processed
  const res = new Map<number, BundledNP>(); // result of processing

  for (const bundle of bundles) {
    if (!bundle.nps) continue;
    for (const id of bundle.nps) {
      if (knownNPs.has(id)) continue;
      npQueue.push(id);
      knownNPs.add(id);
    }
  }

  while (npQueue.length > 0) {
    const npId = npQueue.shift()!;
    const np = niceNoblePhantasm.find(np => np.id == npId);
    if (!np) {
      Log.error(`Could not find NP id ${npId}`);
      return false;
    }

    const servant = await getOwner(np);
    if (!servant) {
      Log.error(`Could not find owner of NP id ${npId}`);
      return false;
    }

    const npNA = niceNoblePhantasmNA.find(np => np.id == npId);
    const upgradeLevel = getUpgradeLevel(servant, np);

    const data: BundledNP = {
      name: npNA?.name || np.name,
      type: getNPType(np),
      border: mapUpgradeLevelToSkillBorder(upgradeLevel)
    };

    if (npNA) data.na = true;

    res.set(npId, data);
  }

  Log.info(`Mapped data for ${res.size - 1} NPs`);
  return {
    name: "NPs",
    path: "nps.json",
    data: res
  };
};
