import { generateBackgroundList } from "./generateBackgroundList";
import { generateEventData } from "./generateEventData";
import { generateLoginTicketData } from "./generateLoginTicketData";
import { generatePrismShopData } from "./generatePrismShopData";

export async function getStaticProps() {
  const backgrounds = await generateBackgroundList();
  const events = await generateEventData();
  const loginTicket = await generateLoginTicketData();
  const { mpShopData, rpShopData } = await generatePrismShopData();

  // TODO: variable revalidate length?
  // TODO: comments in utils describing their purpose
  // TODO: implement createServerError where needed

  return {
    props: { backgrounds, events, loginTicket, mpShopData, rpShopData },
    revalidate: 60
  };
}
