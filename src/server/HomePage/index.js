import { readFileJson } from "@foxkit/node-util/fs";

import { generateEventData } from "./generateEventData";
import { generateLoginTicketData } from "./generateLoginTicketData";
import { generateMasterMissionData } from "./generateMasterMissionData";
import { generatePrismShopData } from "./generatePrismShopData";

export async function getStaticProps() {
  const backgrounds = await readFileJson("assets/static/backgrounds.json");
  const events = await generateEventData();
  const loginTicket = await generateLoginTicketData();
  const masterMissions = await generateMasterMissionData();
  const shopData = await generatePrismShopData();

  return {
    props: { backgrounds, events, loginTicket, masterMissions, shopData } //,
    //revalidate: 3600
    // TEMP: disable ISR as it does not have filesystem access
  };
}
