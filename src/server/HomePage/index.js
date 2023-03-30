import { getCurrentTime } from "../utils/time";
import { readStaticBundle } from "../utils/static";
import { getCurrentMasterMissions } from "./getCurrentMasterMissions";

// WIP: migrate to ./src/pages/HomePage/
export async function getStaticProps() {
  const now = getCurrentTime();
  const [backgrounds, shopData, masterMissions] = await Promise.all([
    readStaticBundle("backgrounds"),
    readStaticBundle("prismShops"),
    getCurrentMasterMissions(now)
  ]);

  return { backgrounds, masterMissions, shopData };
}
