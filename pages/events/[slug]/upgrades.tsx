import { CardGrid } from "~/client/components/Card";
import { DataContext } from "~/client/contexts";
import { EventPageLayout } from "~/pages/EventPage/components/EventPageLayout";
import { UpgradeCard } from "~/pages/UpgradesPage/components";
import type { EventUpgradesPageProps } from "~/pages/EventPage/static/upgrades";

// Next Page configs
export {
  getStaticPaths,
  getStaticProps
} from "~/pages/EventPage/static/upgrades";

export default function EventUpgradesPage({
  event,
  upgrades,
  quests,
  servants,
  nps,
  skills
}: EventUpgradesPageProps) {
  return (
    <EventPageLayout
      event={event}
      current="Upgrades"
      description={`Rank Up Quests and Interludes released during ${event.title}`}>
      <h1>Upgrades</h1>
      <DataContext
        servants={servants}
        skills={skills}
        nps={nps}
        quests={quests}>
        <CardGrid>
          {upgrades.map(upgrade => (
            <UpgradeCard key={upgrade.quest} upgrade={upgrade} bypassSpoilers />
          ))}
        </CardGrid>
      </DataContext>
    </EventPageLayout>
  );
}
