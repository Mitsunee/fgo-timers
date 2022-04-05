import { useState, useEffect } from "react";

export { getStaticProps } from "src/server/HomePage/";

export const config = {
  unstable_includeFiles: [
    "assets/static/backgrounds.json",
    "assets/static/events.json",
    "assets/static/loginTickets.json",
    "assets/static/prismShops.json"
  ]
};

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
  loginTicket,
  masterMissions,
  shopData
}) {
  const [background, setBackground] = useState(null);
  const mpShopReset = useRecurringEvent({ day: 1, hour: 0, tz: "utc" });
  const rpShopReset = useRecurringEvent({ day: 15, hour: 0, tz: "utc" });

  // Effect sets random background to state to avoid SSR missmatches
  useEffect(() => {
    // only in client
    if (typeof document === "undefined") return;

    // pick random background
    setBackground(backgrounds[Math.floor(Math.random() * backgrounds.length)]);
  }, [backgrounds]);

  // Effect that sets background upon state changing
  useEffect(() => {
    // only in client
    if (typeof document === "undefined" || background === null) return;

    const backgroundUrl = `url("/assets/backgrounds/landing/${background}")`;

    // set css property and attach className
    document.body.style.setProperty("--landing-bg", backgroundUrl);
    document.body.classList.add(styles.body);

    return () => {
      document.body.classList.remove(styles.body);
    };
  }, [background]);

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
        <LoginTicketCard items={loginTicket.data} next={loginTicket.next} />
        <MasterMissionCard data={masterMissions} />
        <ChaldeaGateCard />
        <ShopCard shopData={shopData.manaPrismShop} endsAt={mpShopReset} />
        <ShopCard shopData={shopData.rarePrismShop} endsAt={rpShopReset} />
      </CardGrid>
    </>
  );
}
