import spacetime from "spacetime";
import { useEffect } from "react";

import { getTicketFileList } from "@utils/server/loginTickets/getTicketFileList";
import { getItemIdMap } from "@utils/server/loginTickets/getItemIdMap";
import { parseTicketFile } from "@utils/server/loginTickets/parseTicketFile";
import { parseShopFile } from "@utils/server/parseShopFile";

//import styles from "@styles/TimersPage.module.css";
import { useInterval } from "@utils/hooks/useInterval";
import Meta from "@components/Meta";
import Clocks from "@components/Clocks";
import Headline from "@components/Headline";
import TimersLoginTicketSection from "@components/TimersLoginTicketSection";

export default function TimersPage({
  tickets,
  itemData,
  mpShopData,
  rpShopData
}) {
  const interval = useInterval(1000);

  // DEBUG
  useEffect(() => {
    console.log("IN REACT", { mpShopData, rpShopData });
    console.log(JSON.stringify(mpShopData, null, 2));
    console.log(JSON.stringify(rpShopData, null, 2));
  }, [mpShopData, rpShopData]);

  return (
    <>
      <Meta title="Timers" description="Timers for Fate/Grand Order" />
      <Clocks interval={interval} />
      <Headline>Login Exchange Tickets</Headline>
      <TimersLoginTicketSection
        tickets={tickets}
        itemData={itemData}
        interval={interval}
      />
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
