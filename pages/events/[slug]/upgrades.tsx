import { useMemo } from "react";
import { CardGrid } from "src/client/components/Card";
import { EventPageLayout } from "src/pages/EventPage/components/EventPageLayout";
import type { EventUpgradesPageProps } from "src/pages/EventPage/static/upgrades";
import {
  UpgradeContextProvider,
  UpgradeCard
} from "src/pages/UpgradesPage/components";

// Next Page configs
export {
  getStaticPaths,
  getStaticProps
} from "src/pages/EventPage/static/upgrades";
export const config = {
  unstable_includeFiles: [
    "assets/static/events.json",
    "assets/static/data/servants.json",
    "assets/static/data/ces.json"
  ]
};

export default function EventUpgradesPage({
  event,
  upgrades,
  quests,
  servants,
  nps,
  skills
}: EventUpgradesPageProps) {
  // create memoized context value for UpgradeCard
  const upgradeContextVal = useMemo(() => {
    return {
      questMap: quests,
      servantMap: servants,
      skillMap: skills,
      npMap: nps
    } satisfies React.ComponentProps<typeof UpgradeContextProvider>["value"];
  }, [quests, servants, nps, skills]);

  return (
    <EventPageLayout
      event={event}
      current="Upgrades"
      description={`Rank Up Quests and Interludes released during ${event.title}`}>
      <h1>Upgrades</h1>
      <UpgradeContextProvider value={upgradeContextVal}>
        <CardGrid>
          {upgrades.map(upgrade => (
            <UpgradeCard key={upgrade.quest} upgrade={upgrade} bypassSpoilers />
          ))}
        </CardGrid>
      </UpgradeContextProvider>
    </EventPageLayout>
  );
}
