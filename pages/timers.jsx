import spacetime from "spacetime";

import { getTicketFileList } from "@utils/server/loginTickets/getTicketFileList";
import { getItemIdMap } from "@utils/server/loginTickets/getItemIdMap";
import { parseTicketFile } from "@utils/server/loginTickets/parseTicketFile";
import { parseShopFile } from "@utils/server/parseShopFile";

//import styles from "@styles/TimersPage.module.css";
import { useInterval } from "@utils/hooks/useInterval";
import { useRecurringEvent } from "@utils/hooks/useRecurringEvent";
import Meta from "@components/Meta";
import Clocks from "@components/Clocks";
import { CardGrid } from "@components/Card";
import LoginTicketCard from "@components/LoginTicketCard";
import ShopCard from "@components/ShopCard";
import ChaldeaGateCard from "@components/ChaldeaGateCard";

export default function TimersPage({
  tickets,
  itemData,
  mpShopData,
  rpShopData
}) {
  const interval = useInterval(1000);
  const mpShopReset = useRecurringEvent(
    { day: 1, hour: 0, tz: "utc" },
    interval
  );
  const rpShopReset = useRecurringEvent(
    { day: 15, hour: 0, tz: "utc" },
    interval
  );

  /* TODO:
   * - Recurring stuff like dailies needs a section
   * - AP Calc
   * - idk what else rn lol
   */

  return (
    <>
      <Meta title="Timers" description="Timers for Fate/Grand Order" />
      <Clocks interval={interval} />
      <CardGrid>
        <LoginTicketCard
          tickets={tickets}
          itemData={itemData}
          interval={interval}
        />
        <ChaldeaGateCard
          interval={interval}
          border={mpShopData.border}
          background={mpShopData.background}
        />
        <ShopCard
          shopData={mpShopData}
          endsAt={mpShopReset}
          interval={interval}
        />
        <ShopCard
          shopData={rpShopData}
          endsAt={rpShopReset}
          interval={interval}
        />
      </CardGrid>
    </>
  );
}

export async function getStaticProps() {
  const ticketFileList = await getTicketFileList();
  const itemIdMap = await getItemIdMap();

  // find files for current and next year
  const currentYear = spacetime.now().year();
  const currentYearFile = ticketFileList.find(ticketFile =>
    ticketFile.includes(currentYear)
  );
  const nextYearFile = ticketFileList.find(ticketFile =>
    ticketFile.includes(currentYear + 1)
  );

  // parse tickets
  const tickets = new Object();
  if (currentYearFile) {
    const { key, data } = await parseTicketFile(currentYearFile, itemIdMap);
    tickets[key] = data;
  } else {
    throw new Error("Error while loading ticket file for year " + currentYear);
  }
  if (nextYearFile) {
    const { key, data } = await parseTicketFile(nextYearFile, itemIdMap);
    tickets[key] = data;
  } else {
    throw new Error(
      "Error while loading ticket file for year " + (currentYear + 1)
    );
  }

  // fetch item data
  const res = await fetch(
    "https://api.atlasacademy.io/export/JP/nice_item_lang_en.json"
  );
  if (!res.ok) throw new Error("Error while fetch Atlas Item Data");
  const niceItem = await res.json();

  // generate itemData map
  const itemIds = Object.keys(tickets)
    .flatMap(year =>
      Object.keys(tickets[year]).flatMap(month => tickets[year][month])
    )
    .filter((value, index, self) => index === self.indexOf(value));
  const itemData = new Object();
  for (const id of itemIds) {
    const { name, icon, background } = niceItem.find(item => item.id === id);
    itemData[id] = { id, name, icon, background };
  }

  // parse shop data
  const mpShopData = await parseShopFile("assets/data/manaPrismShop.yml");
  const rpShopData = await parseShopFile("assets/data/rarePrismShop.yml");

  return { props: { tickets, itemData, mpShopData, rpShopData } };
}
