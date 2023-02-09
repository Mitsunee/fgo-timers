import { getCurrentTime } from "../utils/time";
import { readStaticBundle } from "../utils/static";
import { getCurrentTicketData } from "./getCurrentTicketData";
import { getCurrentMasterMissions } from "./getCurrentMasterMissions";

// WIP: migrate to ./src/pages/HomePage/
export async function getStaticProps() {
  const now = getCurrentTime();
  const [backgrounds, loginTicket, shopData, masterMissions] =
    await Promise.all([
      readStaticBundle("backgrounds"),
      getCurrentTicketData(now),
      readStaticBundle("prismShops"),
      getCurrentMasterMissions(now)
    ]);

  return { backgrounds, loginTicket, masterMissions, shopData };
}
