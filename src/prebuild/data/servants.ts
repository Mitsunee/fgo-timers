import { join } from "path";
import { getBasicServant } from "~/atlas-api/cache/data/basicServant";
import { shortenAtlasUrl } from "~/atlas-api/urls";
import { getAvailabilityMap } from "~/schema/AvailabilityMap";
import { mapServantRarityToBorder } from "~/servants/borders";
import { ServantsFile } from "~/static/data/servants";
import { getBundledServantNames } from "~/static/servantNames";
import { Log } from "~/utils/log";
import type { AvailabilityMatcher } from "~/schema/AvailabilityMap";
import type { BundledServant } from "~/servants/types";
import { DataBundler } from "../utils/dataBundlers";

const avMapPath = join(process.cwd(), "assets/data/availability/servants.yml");
let availabilityMap: AvailabilityMatcher;
let servantNames: Awaited<ReturnType<typeof getBundledServantNames>>;

const ServantsBundle = new DataBundler({
  file: ServantsFile,
  transform: async id => {
    availabilityMap ??= await getAvailabilityMap(avMapPath);
    servantNames ??= await getBundledServantNames();
    const [servant, servantNA] = await Promise.all([
      getBasicServant(id),
      getBasicServant(id, "NA")
    ]);

    if (!servant) {
      Log.error(`Could not find servant with id ${id}`);
      return;
    }

    const availability = availabilityMap.match(id);
    const data: BundledServant = {
      name: servantNames[servant.id] || servantNA?.name || servant.name,
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
