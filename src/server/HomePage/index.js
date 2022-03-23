import { getCurrentTime } from "../utils/time";
import { readStaticBundle } from "../utils/static";
import { getCurrentEvents } from "./getCurrentEvents";
import { getCurrentTicketData } from "./getCurrentTicketData";
import { getCurrentMasterMissions } from "./getCurrentMasterMissions";

export async function getStaticProps() {
  const now = getCurrentTime();
  // TODO: re-implement event hiding!
  const [backgrounds, events, loginTicket, shopData, masterMissions] =
    await Promise.all([
      readStaticBundle("backgrounds"),
      getCurrentEvents(now),
      getCurrentTicketData(now),
      readStaticBundle("prismShops"),
      getCurrentMasterMissions(now)
    ]);

  return {
    props: { backgrounds, events, loginTicket, masterMissions, shopData },
    revalidate: 3600
  };
}
