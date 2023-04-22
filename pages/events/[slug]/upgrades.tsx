import {
  ServantContext,
  SkillContext,
  NPContext,
  QuestContext
} from "src/client/contexts";
import { CardGrid } from "src/client/components/Card";
import { EventPageLayout } from "src/pages/EventPage/components/EventPageLayout";
import type { EventUpgradesPageProps } from "src/pages/EventPage/static/upgrades";
import { UpgradeCard } from "src/pages/UpgradesPage/components";

// Next Page configs
export {
  getStaticPaths,
  getStaticProps
} from "src/pages/EventPage/static/upgrades";

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
      <ServantContext value={servants}>
        <SkillContext value={skills}>
          <NPContext value={nps}>
            <QuestContext value={quests}>
              <CardGrid>
                {upgrades.map(upgrade => (
                  <UpgradeCard
                    key={upgrade.quest}
                    upgrade={upgrade}
                    bypassSpoilers
                  />
                ))}
              </CardGrid>
            </QuestContext>
          </NPContext>
        </SkillContext>
      </ServantContext>
    </EventPageLayout>
  );
}
