import { getCurrentTime } from "../utils/time";
import { getCurrentTicketData } from "./getCurrentTicketData";
import { getCurrentMasterMissions } from "./getCurrentMasterMissions";
import { readStaticBundle } from "../utils/static";

export async function getStaticProps() {
  const now = getCurrentTime();
  // TODO: re-implement event hiding!
  const [backgrounds, events, loginTicket, shopData, masterMissions] =
    await Promise.all([
      readStaticBundle("backgrounds"),
      readStaticBundle("events"),
      getCurrentTicketData(now),
      readStaticBundle("prismShops"),
      getCurrentMasterMissions(now)
    ]);

  return {
    props: { backgrounds, events, loginTicket, masterMissions, shopData },
    revalidate: 3600
  };
}
