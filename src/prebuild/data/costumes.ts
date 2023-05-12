import { List } from "@foxkit/util/object";
import { atlasCache } from "../../atlas-api/cache";
import { shortenAtlasUrl } from "../../atlas-api/urls";
import { mapServantRarityToBorder } from "../../servants/borders";
import type { BundledCostume } from "../../items/types";
import { Log } from "../../utils/log";
import type { DataBundler } from "../utils/dataBundlers";

export const bundleCostumesData: DataBundler<BundledCostume> = async ids => {
  const [niceServant, niceServantNA] = await Promise.all([
    atlasCache.JP.getNiceServant(),
    atlasCache.NA.getNiceServant()
  ]);

  const costumeQueue = List.fromArray([...ids]); // to be processed
  const res = new Map<number, BundledCostume>(); // result of processing

  let costumeId: number | undefined;
  while ((costumeId = costumeQueue.shift())) {
    const servant = niceServant.find(
      servant => servant.profile.costume[`${costumeId}`]
    );
    if (!servant) {
      Log.error(`Could not find any servant with costume id ${costumeId}`);
      return false;
    }

    const costume = servant.profile.costume[`${costumeId}`];
    const servantNA = niceServantNA.find(
      servantNA => servantNA.id == servant.id
    );
    const costumeNA = servantNA?.profile.costume[`${costumeId}`];
    let iconUrl = servant.extraAssets.faces.costume?.[`${costumeId}`];

    if (!iconUrl) {
      Log.warn(`Using fallback icon for costume '${costumeId}'`);
      iconUrl = "https://static.atlasacademy.io/JP/Items/23.png";
    }

    const data: BundledCostume = {
      name: costumeNA?.shortName || costume.shortName,
      icon: shortenAtlasUrl(iconUrl),
      border: mapServantRarityToBorder(servant.rarity)
    };

    if (costumeNA) data.na = true;

    res.set(costumeId, data);
  }

  Log.info(`Mapped data for ${res.size} Costumes`);
  return {
    name: "Costumes",
    path: "costumes.json",
    data: res
  };
};
