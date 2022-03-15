import { readFileJson } from "@foxkit/node-util/fs";

import { getCurrentTicketData } from "./getCurrentTicketData";
import { generateMasterMissionData } from "./generateMasterMissionData";

export async function getStaticProps() {
  // TODO: re-implement event hiding!
  const [backgrounds, events, loginTicket, shopData, masterMissions] =
    await Promise.all([
      readFileJson("assets/static/backgrounds.json"),
      readFileJson("assets/static/events.json"),
      getCurrentTicketData(),
      readFileJson("assets/static/prismShops.json"),
      generateMasterMissionData()
    ]);

  return {
    props: { backgrounds, events, loginTicket, masterMissions, shopData },
    revalidate: 3600
  };
}
