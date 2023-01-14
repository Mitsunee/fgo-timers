import { CardGrid } from "src/client/components/Card";
import Headline from "src/client/components/Headline";
import { Pending } from "src/client/components/Pending";
import Section from "src/client/components/Section";
import { api } from "src/client/api";
import { upgradeIsNPUpgrade, upgradeIsSkillUpgrade } from "src/upgrades/types";
import { createQuestUnlockMapper } from "src/pages/UpgradesPage/mapQuestUnlocks";
import { UpgradeCard } from "src/pages/UpgradesPage/components";
import { useMemo } from "react";

interface RelatedUpgradesProps {
  upgrades: Array<{ id: number; date?: number }>;
}

type MappedBundledQuest = ReturnType<
  ReturnType<typeof createQuestUnlockMapper>
>;

export function RelatedUpgrades({ upgrades }: RelatedUpgradesProps) {
  const data = api.upgrades.select.useQuery({
    id: upgrades.map(upgrade => upgrade.id),
    disableSpoilers: true
  });

  const quests = useMemo(() => {
    const mappedQuests: Record<number, MappedBundledQuest> = {};
    if (!data.data) return mappedQuests;

    const { quests } = data.data;
    const questMapper = createQuestUnlockMapper(quests);

    for (const id in quests) {
      const mapped = questMapper(+id);
      const date = upgrades.find(upgrade => upgrade.id == +id)?.date;
      if (date) {
        mapped.open = date;
        mapped.na = true as const;
      }

      mappedQuests[+id] = mapped;
    }

    return mappedQuests;
  }, [data.data, upgrades]);

  if (data.isLoading) {
    return (
      <>
        <Pending />
      </>
    );
  }

  if (data.error) {
    return (
      <Section background>
        <Headline>Internal Server Error</Headline>
        <p>An Error occured while fetching the data for this section</p>
      </Section>
    );
  }

  const { servants, skills, nps } = data.data;

  return (
    <CardGrid>
      {data.data.upgrades.map(upgrade => {
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
  );
}
