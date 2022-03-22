import { getCurrentTicketData } from "./getCurrentTicketData";
import { generateMasterMissionData } from "./generateMasterMissionData";
import { readStaticBundle } from "../utils/static";

export async function getStaticProps() {
  // TODO: re-implement event hiding!
  const [backgrounds, events, loginTicket, shopData, masterMissions] =
    await Promise.all([
      readStaticBundle("backgrounds"),
      readStaticBundle("events"),
      getCurrentTicketData(),
      readStaticBundle("prismShops"),
      generateMasterMissionData()
    ]);

  return {
    props: { backgrounds, events, loginTicket, masterMissions, shopData },
    revalidate: 3600
  };
}
