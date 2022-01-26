import { getFileName } from "@foxkit/node-util/path";
import { readFileJson } from "@foxkit/node-util/fs";

import { getFileList } from "@utils/server/getFileList";
import { getEventFileList } from "@utils/server/events/getEventFileList";
import { parseEventFile } from "@utils/server/events/parseEventFile";
import { getTicketFileList } from "@utils/server/loginTickets/getTicketFileList";
import { getItemIdMap } from "@utils/server/loginTickets/getItemIdMap";
import { parseTicketFile } from "@utils/server/loginTickets/parseTicketFile";
import { parseShopFile } from "@utils/server/parseShopFile";

import { useEffect } from "react";
import spacetime from "spacetime";

import styles from "@styles/HomePage.module.css";
import { useRecurringEvent } from "@utils/hooks/useRecurringEvent";
import Meta from "@components/Meta";
import Clocks from "@components/Clocks";
import Headline from "@components/Headline";
import EventCard from "@components/EventCard";
import { CardGrid } from "@components/Card";
import LoginTicketCard from "@components/LoginTicketCard";
import MasterMissionCard from "@components/MasterMissionCard";
import ChaldeaGateCard from "@components/ChaldeaGateCard";
import ShopCard from "@components/ShopCard";

export default function HomePage({
  backgrounds,
  events,
  tickets,
  itemData,
  mpShopData,
  rpShopData
}) {
  const mpShopReset = useRecurringEvent({ day: 1, hour: 0, tz: "utc" });
  const rpShopReset = useRecurringEvent({ day: 15, hour: 0, tz: "utc" });

  // BUG: causes SSR missmatch; possible fix: additional state that triggeres second effect
  useEffect(() => {
    // only in client
    if (typeof document === "undefined") return;

    // pick random background
    const backgroundFile =
      backgrounds[Math.floor(Math.random() * backgrounds.length)];
    const background = `url("${backgroundFile}")`;

    // set css property and attach className
    document.body.style.setProperty("--landing-bg", background);
    document.body.classList.add(styles.body);

    return () => {
      document.body.classList.remove(styles.body);
    };
  }, [backgrounds]);

  return (
    <>
      <Meta
        title="FGO Timers"
        description="Timers for Fate/Grand Order NA"
        image="/assets/meta/landing.jpg"
        noTitleSuffix
      />
      <Clocks />
      <Headline>Current Events</Headline>
      <section className={styles.grid}>
        {events.map(event => (
          <EventCard key={event.shortTitle} {...event} />
        ))}
      </section>
      <Headline>Timers</Headline>
      <CardGrid>
        <LoginTicketCard tickets={tickets} itemData={itemData} />
        <MasterMissionCard />
        <ChaldeaGateCard />
        <ShopCard shopData={mpShopData} endsAt={mpShopReset} />
        <ShopCard shopData={rpShopData} endsAt={rpShopReset} />
      </CardGrid>
    </>
  );
}

export async function getStaticProps() {
  // backgrounds
  const backgroundFiles = await getFileList(
    "public/assets/backgrounds/landing"
  );
  const backgrounds = backgroundFiles.map(
    file => `/assets/backgrounds/landing/${getFileName(file)}`
  );

  // events
  const fileList = await getEventFileList();
  const buildTime = Date.now();
  let events = new Array();

  for (const file of fileList) {
    const data = await parseEventFile(file);
    const event = {
      title: data.title,
      shortTitle: data.shortTitle,
      slug: getFileName(file, false),
      banner: data.banner,
      startsAt: data.startsAt,
      displayOrder: data.displayOrder ?? 0
    };

    if (typeof data.endsAt !== "undefined") {
      event.endsAt = data.endsAt;
    }

    // don't include events in data that are hidden already
    if (data.hideWhenDone === true) {
      if (
        (typeof data.endsAt === "undefined" && data.startsAt < buildTime) ||
        (typeof data.endsAt === "number" && data.endsAt < buildTime)
      ) {
        continue;
      }

      event.hideWhenDone = true;
    }

    events.push(event);
  }

  events = events.sort((a, b) => {
    if (a.startsAt === b.startsAt) {
      return a.displayOrder - b.displayOrder;
    }

    return b.startsAt - a.startsAt;
  });

  // cards data
  const ticketFileList = await getTicketFileList();
  const itemIdMap = await getItemIdMap();

  // find files for current and next year
  const currentYear = spacetime.now().goto("America/Los_Angeles").year();
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
    throw new Error(`Error while loading ticket file for year ${currentYear}`);
  }
  if (nextYearFile) {
    const { key, data } = await parseTicketFile(nextYearFile, itemIdMap);
    tickets[key] = data;
  } else {
    throw new Error(
      `Error while loading ticket file for year ${currentYear + 1}`
    );
  }

  // generate itemData map
  const niceItem = await readFileJson("cache/JP/nice_item_lang_en.json");
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

  return {
    props: { backgrounds, events, tickets, itemData, mpShopData, rpShopData }
  };
}
