import { generateBackgroundList } from "./generateBackgroundList";
import { generateEventData } from "./generateEventData";
import { filterHiddenEvents } from "../utils/filterHiddenEvents";
import { generateLoginTicketData } from "./generateLoginTicketData";
import { generatePrismShopData } from "./generatePrismShopData";

export async function getStaticProps() {
  const backgrounds = await generateBackgroundList();
  const eventsAll = await generateEventData();
  const events = await filterHiddenEvents(eventsAll);
  const loginTicket = await generateLoginTicketData();
  const { mpShopData, rpShopData } = await generatePrismShopData();

  // TODO: Master Missions
  // TODO: update index.jsx and components to match new data structure and
  //       remove anything that causes SSR missmatches (i.e. client autohiding)

  return {
    props: { backgrounds, events, loginTicket, mpShopData, rpShopData },
    revalidate: 3600
  };
}
