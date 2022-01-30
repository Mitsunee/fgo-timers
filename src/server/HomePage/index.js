import { generateBackgroundList } from "./generateBackgroundList";
import { generateEventData } from "./generateEventData";
import { generateLoginTicketData } from "./generateLoginTicketData";
import { generatePrismShopData } from "./generatePrismShopData";
import { generateMasterMissionData } from "./generateMasterMissionData";

export async function getStaticProps() {
  const backgrounds = await generateBackgroundList();
  const events = await generateEventData();
  const loginTicket = await generateLoginTicketData();
  const { mpShopData, rpShopData } = await generatePrismShopData();
  const masterMissions = await generateMasterMissionData();

  return {
    props: {
      backgrounds,
      events,
      loginTicket,
      mpShopData,
      rpShopData,
      masterMissions
    },
    revalidate: 3600
  };
}
