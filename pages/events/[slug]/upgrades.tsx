import { CardGrid } from "src/client/components/Card";
import { EventPageLayout } from "src/pages/EventPage/components/EventPageLayout";
import type { EventPageProps } from "src/pages/EventPage/static/upgrades";
import { UpgradeCard } from "src/pages/UpgradesPage/components";
import { upgradeIsNPUpgrade, upgradeIsSkillUpgrade } from "src/upgrades/types";

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
}: EventPageProps) {
  return (
    <EventPageLayout event={event}>
      <h1>Upgrades</h1>
      <CardGrid>
        {upgrades.map(upgrade => {
          if (upgradeIsSkillUpgrade(upgrade)) {
            const { id, newId } = upgrade.upgrades;
            return (
              <UpgradeCard
                key={upgrade.quest}
                upgrade={upgrade}
                servant={servants[upgrade.servant]}
                quest={quests[upgrade.quest]}
                from={skills[id ?? 0]}
                to={skills[newId]}
              />
            );
          }

          if (upgradeIsNPUpgrade(upgrade)) {
            const { id, newId } = upgrade.upgrades;
            return (
              <UpgradeCard
                key={upgrade.quest}
                upgrade={upgrade}
                servant={servants[upgrade.servant]}
                quest={quests[upgrade.quest]}
                from={nps[id]}
                to={nps[newId]}
              />
            );
          }

          return (
            <UpgradeCard
              key={upgrade.quest}
              upgrade={upgrade}
              servant={servants[upgrade.servant]}
              quest={quests[upgrade.quest]}
            />
          );
        })}
      </CardGrid>
    </EventPageLayout>
  );
}
