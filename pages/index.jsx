import { useEffect } from "react";
import { useRecurringEvent } from "@utils/hooks/useRecurringEvent";
import Meta from "@components/Meta";
import Clocks from "@components/Clocks";
import Headline from "@components/Headline";
import { CardGrid } from "@components/Card";
import { EventList } from "src/client/components/EventList";
//import { NoSSR } from "@components/NoSSR";
//import { SpecialTimer } from "@components/SpecialTimer";
import LoginTicketCard from "src/pages/HomePage/components/LoginTicketCard";
import MasterMissionCard from "src/pages/HomePage/components/MasterMissionCard";
import ChaldeaGateCard from "src/pages/HomePage/components/ChaldeaGateCard";
import ShopCard from "src/pages/HomePage/components/ShopCard";
import styles from "src/pages/HomePage/HomePage.module.css";
// import type { HomePageProps } from "src/pages/HomePage/static";

export { getStaticProps } from "src/pages/HomePage/static";
export const config = {
  unstable_includeFiles: [
    "assets/static/backgrounds.json",
    "assets/static/events.json",
    "assets/static/loginTickets.json",
    "assets/static/prismShops.json",
    ".next/cache/atlasacademy/info.json",
    ".next/cache/atlasacademy/NA/nice_master_mission.json"
  ]
};

export default function HomePage({
  backgrounds,
  events,
  loginTicket,
  masterMissions,
  shopData
}) {
  const mpShopReset = useRecurringEvent({ day: 1, hour: 0 });
  const rpShopReset = useRecurringEvent({ day: 15, hour: 0 });

  // Effect sets random background to state to avoid SSR missmatches
  useEffect(() => {
    // only in client
    if (typeof document === "undefined") return;

    // pick random background
    const background =
      backgrounds[Math.floor(Math.random() * backgrounds.length)];
    const backgroundUrl = `url("/assets/backgrounds/landing/${background}")`;

    // set css property and attach className
    document.body.style.setProperty("--landing-bg", backgroundUrl);
    document.body.classList.add(styles.body);

    return () => {
      document.body.classList.remove(styles.body);
    };
  }, [backgrounds]);

  return (
    <>
      <Meta
        title="FGO Timers"
        description="Timers for Fate/Grand Order Global Version"
        noTitleSuffix
      />
      <Clocks />
      {/*<NoSSR>
        <SpecialTimer
          startsAt={1668901500000}
          text={"Fate/Grand Order Anime NYC 2022 Panel"}
          icon={"/assets/icon_game.png"}
        />
      </NoSSR>*/}
      {events.length > 0 && <EventList events={events} />}
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
