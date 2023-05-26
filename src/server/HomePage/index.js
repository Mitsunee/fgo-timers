import { readStaticBundle } from "../utils/static";
import { getCurrentTime } from "../utils/time";
import { getCurrentMasterMissions } from "./getCurrentMasterMissions";

// WIP: migrate to ./src/pages/HomePage/
export async function getStaticProps() {
  const now = getCurrentTime();
  const [backgrounds, masterMissions] = await Promise.all([
    readStaticBundle("backgrounds"),
    getCurrentMasterMissions(now)
  ]);

  return { backgrounds, masterMissions };
}
