import { join } from "path";
import { getBasicServant } from "~/atlas-api/cache/data/basicServant";
import { shortenAtlasUrl } from "~/atlas-api/urls";
import { mapServantRarityToBorder } from "~/servants/borders";
import { nameServant } from "~/servants/nameServant";
import { ServantsFile } from "~/static/data/servants";
import { Log } from "~/utils/log";
import type { BundledServant } from "~/servants/types";
import { DataBundler } from "../utils/dataBundlers";
import { getAvailabilityMap } from "../utils/getAvailabilityMap";
import type { AvailabilityMatcher } from "../utils/getAvailabilityMap";

const avMapPath = join(process.cwd(), "assets/data/servants/availability.yml");
let availabilityMap: AvailabilityMatcher;

const ServantsBundle = new DataBundler({
  file: ServantsFile,
  transform: async id => {
    availabilityMap ??= await getAvailabilityMap(avMapPath);
    const [servant, servantNA, servantName] = await Promise.all([
      getBasicServant(id),
      getBasicServant(id, "NA"),
      nameServant(id)
    ]);

    if (!servant) {
      Log.error(`Could not find servant with id ${id}`);
      return;
    }

    const availability = availabilityMap.match(id);
    const data: BundledServant = {
      name: servantName,
      icon: shortenAtlasUrl(servant.face),
      classId: servant.className,
      border: mapServantRarityToBorder(servant.rarity),
      rarity: servant.rarity
    };

    if (servantNA) data.na = true;
    if (availability) data.availability = availability;

    return data;
  }
});

export const bundleServantsData =
  ServantsBundle.processBundle.bind(ServantsBundle);
