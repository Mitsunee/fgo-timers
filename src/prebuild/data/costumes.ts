import { getNiceCostume } from "~/atlas-api/cache/data/niceCostume";
import { getNiceServant } from "~/atlas-api/cache/data/niceServant";
import { shortenAtlasUrl } from "~/atlas-api/urls";
import { mapServantRarityToBorder } from "~/servants/borders";
import { CostumesFile } from "~/static/data/costumes";
import { Log } from "~/utils/log";
import type { BundledCostume } from "~/items/types";
import { DataBundler } from "../utils/dataBundlers";

export const CostumesBundle = new DataBundler({
  file: CostumesFile,
  transform: async id => {
    const [costume, costumeNA] = await Promise.all([
      getNiceCostume(id),
      getNiceCostume(id, "NA")
    ]);

    if (!costume) {
      Log.error(`Could not find costume with id ${id}`);
      return;
    }

    const servant = await getNiceServant(costume.owner);
    if (!servant) {
      Log.error(`Could not find any servant with costume id ${id}`);
      return;
    }

    let iconUrl = servant.extraAssets.faces.costume?.[`${id}`];
    if (!iconUrl) {
      Log.warn(`Using fallback icon for costume '${id}'`);
      iconUrl = "https://static.atlasacademy.io/JP/Items/23.png";
    }

    const data: BundledCostume = {
      name: costumeNA?.shortName || costume.shortName,
      icon: shortenAtlasUrl(iconUrl),
      border: mapServantRarityToBorder(servant.rarity)
    };

    if (costumeNA) data.na = true;

    return data;
  }
});

export const bundleCostumesData =
  CostumesBundle.processBundle.bind(CostumesBundle);
