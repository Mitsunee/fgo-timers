import { DataContext } from "~/client/contexts";
import { CardGrid } from "~/components/Card";
import { Clocks } from "~/components/Clocks";
import { EventList } from "~/components/EventList";
import Headline from "~/components/Headline";
import Meta from "~/components/Meta";
import { NoSSR } from "~/components/NoSSR";
import ChaldeaGateCard from "~/pages/HomePage/components/ChaldeaGateCard";
import { LoginInfoCard } from "~/pages/HomePage/components/LoginInfoCard";
import MasterMissionCard from "~/pages/HomePage/components/MasterMissionCard";
import { ShopsInfoCard } from "~/pages/HomePage/components/ShopsInfoCard";
import { SpecialTimer } from "~/pages/HomePage/components/SpecialTimer";
// import type { HomePageProps } from "~/pages/HomePage/static";

export { getStaticProps } from "~/pages/HomePage/static";

export default function HomePage({
  special,
  events,
  loginTicket,
  items,
  milestones,
  masterMissions,
  shops
}) {
  return (
    <>
      <Meta
        title="FGO Timers"
        description="Timers for Fate/Grand Order Global Version"
        noTitleSuffix
      />
      <Clocks />
      {special && (
        <NoSSR>
          <SpecialTimer
            startsAt={special.date}
            text={special.title}
            icon={"/assets/icon_game.png"}
          />
        </NoSSR>
      )}
      {events.length > 0 && <EventList events={events} loading="eager" />}
      <Headline>Timers</Headline>
      <CardGrid>
        <DataContext items={items}>
          <LoginInfoCard ticket={loginTicket} milestones={milestones} />
        </DataContext>
        <MasterMissionCard data={masterMissions} />
        <NoSSR>
          <ChaldeaGateCard />
        </NoSSR>
        <ShopsInfoCard shops={shops} />
      </CardGrid>
    </>
  );
}
