import { getCurrentTime } from "../utils/time";
import { getCurrentMasterMissions } from "./getCurrentMasterMissions";

// WIP: migrate to ./src/pages/HomePage/
export async function getStaticProps() {
  const now = getCurrentTime();
  const [masterMissions] = await Promise.all([getCurrentMasterMissions(now)]);

  return { masterMissions };
}
