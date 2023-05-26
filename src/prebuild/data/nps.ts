import { List } from "@foxkit/util/object";
import { atlasCache } from "../../atlas-api/cache";
import { mapUpgradeLevelToSkillBorder } from "../../servants/borders";
import { getNPType } from "../../servants/getNPType";
import { getNPOwner } from "../../servants/getOwner";
import { findEoRNPName } from "../../upgrades/findEoRNPName";
import { getUpgradeLevel } from "../../upgrades/getUpgradeLevel";
import { Log } from "../../utils/log";
import type { SupportedRegion } from "../../atlas-api/api";
import type { BundledNP } from "../../servants/types";
import type { DataBundler } from "../utils/dataBundlers";

async function flatMapNPs(region: SupportedRegion) {
  const niceServant = await atlasCache[region].getNiceServant();
  return niceServant.flatMap(servant => servant.noblePhantasms);
}

export const bundleNPsData: DataBundler<BundledNP> = async ids => {
  const [niceNoblePhantasm, niceNoblePhantasmNA] = await Promise.all([
    flatMapNPs("JP"),
    flatMapNPs("NA")
  ]);
  const npQueue = List.fromArray([...ids]); // to be processed
  const res = new Map<number, BundledNP>(); // result of processing

  while (npQueue.length > 0) {
    const npId = npQueue.shift()!;
    const np = niceNoblePhantasm.find(np => np.id == npId);
    if (!np) {
      Log.error(`Could not find NP id ${npId}`);
      return false;
    }

    const servant = await getNPOwner(np, "JP");
    if (!servant) {
      Log.error(`Could not find owner of NP id ${npId}`);
      return false;
    }

    const npNA = niceNoblePhantasmNA.find(np => np.id == npId);
    const servantNA = npNA ? await getNPOwner(npNA, "NA") : undefined;
    const name = servantNA
      ? findEoRNPName(npNA!, servantNA)
      : findEoRNPName(np, servant);
    const upgradeLevel = getUpgradeLevel(servant, np);

    const data: BundledNP = {
      name,
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
