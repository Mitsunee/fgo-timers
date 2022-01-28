import { generateBackgroundList } from "./generateBackgroundList";
import { generateEventData } from "./generateEventData";
import { generateLoginTicketData } from "./generateLoginTicketData";

export async function getStaticProps() {
  const backgrounds = await generateBackgroundList();
  const events = await generateEventData();
  const loginTicket = await generateLoginTicketData();

  /* TODO: rewrite other HomePage properties
   - itemData?
   - mpShopData
   - rpShopData
   - variable revalidate length?
  */

  return {
    props: { backgrounds, events, loginTicket },
    revalidate: 60
  };
}
