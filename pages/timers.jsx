import spacetime from "spacetime";

//import styles from "@styles/TimersPage.module.css";
import { getTicketFileList } from "@utils/loginTickets/getTicketFileList";
import { getItemIdMap } from "@utils/loginTickets/getItemIdMap";
import { parseTicketFile } from "@utils/loginTickets/parseTicketFile";
import { useInterval } from "@utils/hooks/useInterval";
import Meta from "@components/Meta";
import Headline from "@components/Headline";
import TimersLoginTicketSection from "@components/TimersLoginTicketSection";

export default function TimersPage({ tickets, itemData }) {
  const interval = useInterval(1000);

  return (
    <>
      <Meta title="Timers" description="Timers for Fate/Grand Order" />
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

  return { props: { tickets, itemData } };
}
