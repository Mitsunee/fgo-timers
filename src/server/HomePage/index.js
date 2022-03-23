import { getCurrentTicketData } from "./getCurrentTicketData";
import { getCurrentMasterMissions } from "./getCurrentMasterMissions";
import { readStaticBundle } from "../utils/static";

export async function getStaticProps() {
  // TODO: re-implement event hiding!
  const [backgrounds, events, loginTicket, shopData, masterMissions] =
    await Promise.all([
      readStaticBundle("backgrounds"),
      readStaticBundle("events"),
      getCurrentTicketData(),
      readStaticBundle("prismShops"),
      getCurrentMasterMissions()
    ]);

  return {
    props: { backgrounds, events, loginTicket, masterMissions, shopData },
    revalidate: 3600
  };
}
