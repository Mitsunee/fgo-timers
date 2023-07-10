import type { InferGetStaticPropsType } from "next";
import { serverApi } from "~/server/api/root";
import { getQuestMap } from "~/static/data/quests";
import { getServantMap } from "~/static/data/servants";
import { getBundledUpgrades } from "~/static/upgrades";
import { createUpgradeFilter, createUpgradeSorter } from "./filters";
import { formFiltersDefault } from "./filtersReducer";

export const getStaticProps = async () => {
  const [upgradesList, questMap, servantMap] = await Promise.all([
    getBundledUpgrades(),
    getQuestMap(),
    getServantMap()
  ]);

  const sorter = createUpgradeSorter(questMap);
  const filter = createUpgradeFilter(formFiltersDefault, servantMap, questMap);
  const upgradeIds = upgradesList
    .sort(sorter)
    .filter(filter)
    .slice(0, 10)
    .map(upgrade => upgrade.quest);
  const fallback = await serverApi.upgrades.select.fetch({
    id: upgradeIds
  });

  return {
    props: { fallback }
  };
};

export type UpgradesPageProps = InferGetStaticPropsType<typeof getStaticProps>;
