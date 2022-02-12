import { generateBackgroundList } from "./generateBackgroundList";
import { generateEventData } from "./generateEventData";
import { generateLoginTicketData } from "./generateLoginTicketData";
import { generateMasterMissionData } from "./generateMasterMissionData";
import { generatePrismShopData } from "./generatePrismShopData";

export async function getStaticProps() {
  const backgrounds = await generateBackgroundList();
  const events = await generateEventData();
  const loginTicket = await generateLoginTicketData();
  const masterMissions = await generateMasterMissionData();
  const shopData = await generatePrismShopData();

  // TEMP: include build time for debugging purposes
  const builtAt = Date.now();

  return {
    // prettier-ignore
    props: { backgrounds, events, loginTicket, masterMissions, shopData, builtAt },
    revalidate: 3600
  };
}
