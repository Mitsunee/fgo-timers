import type { InferGetStaticPropsType } from "next";
import { serverApi } from "~/server/api/root";
import {
  getBundledQuestMap,
  getBundledServantMap,
  getBundledUpgrades
} from "~/utils/getBundles";
import { createUpgradeFilter, createUpgradeSorter } from "./filters";
import { formFiltersDefault } from "./filtersReducer";

export const getStaticProps = async () => {
  const [upgradesList, questMap, servantMap] = await Promise.all([
    getBundledUpgrades(),
    getBundledQuestMap(),
    getBundledServantMap()
  ]);

  const sorter = createUpgradeSorter(questMap);
  const filter = createUpgradeFilter(formFiltersDefault, servantMap, questMap);
  const upgradeIds = upgradesList
    .sort(sorter)
    .filter(filter)
    .slice(0, 100)
    .map(upgrade => upgrade.quest);
  const fallback = await serverApi.upgrades.select.fetch({
    id: upgradeIds
  });

  return {
    props: { fallback }
  };
};

export type UpgradesPageProps = InferGetStaticPropsType<typeof getStaticProps>;
