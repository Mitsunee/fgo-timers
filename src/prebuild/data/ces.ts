import { join } from "path";
import { getBasicCraftEssence } from "~/atlas-api/cache/data/basicCraftEssence";
import { shortenAtlasUrl } from "~/atlas-api/urls";
import { mapServantRarityToBorder } from "~/servants/borders";
import { CraftEssencesFile } from "~/static/data/craftEssences";
import { Log } from "~/utils/log";
import type { BundledCE } from "~/items/types";
import { DataBundler } from "../utils/dataBundlers";
import { getAvailabilityMap } from "../utils/getAvailabilityMap";
import type { AvailabilityMatcher } from "../utils/getAvailabilityMap";

const avMapPath = join(process.cwd(), "assets/data/ces/availability.yml");
let availabilityMap: AvailabilityMatcher;

export const CraftEssencesBundle = new DataBundler({
  file: CraftEssencesFile,
  transform: async id => {
    availabilityMap ??= await getAvailabilityMap(avMapPath);
    const [craftEssenceJP, craftEssenceNA] = await Promise.all([
      getBasicCraftEssence(id, "JP"),
      getBasicCraftEssence(id, "NA")
    ]);

    // we need to handle NA-only CEs in this one
    const craftEssence = craftEssenceJP || craftEssenceNA;

    if (!craftEssence) {
      Log.error(`Could not find craft essence with id ${id}`);
      return;
    }

    const availability = availabilityMap.match(id);
    const data: BundledCE = {
      name: craftEssenceNA?.name || craftEssence.name,
      icon: shortenAtlasUrl(craftEssence.face),
      border: mapServantRarityToBorder(craftEssence.rarity),
      rarity: craftEssence.rarity
    };

    if (craftEssenceNA) data.na = true;
    if (availability) data.availability = availability;

    return data;
  }
});

export const bundleCEsData =
  CraftEssencesBundle.processBundle.bind(CraftEssencesBundle);
