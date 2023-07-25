import { join } from "path";
import { getBasicCraftEssence } from "~/atlas-api/cache/data/basicCraftEssence";
import { shortenAtlasUrl } from "~/atlas-api/urls";
import { getAvailabilityMap } from "~/schema/AvailabilityMap";
import { mapServantRarityToBorder } from "~/servants/borders";
import { CraftEssencesFile } from "~/static/data/craftEssences";
import { Log } from "~/utils/log";
import type { BundledCraftEssence } from "~/items/types";
import type { AvailabilityMatcher } from "~/schema/AvailabilityMap";
import { DataBundler } from "../utils/dataBundlers";

const avMapPath = join(process.cwd(), "assets/data/availability/ces.yml");
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
    const data: BundledCraftEssence = {
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
