import { createServerSideHelpers } from "@trpc/react-query/server";
import type { InferGetStaticPropsType } from "next";
import { appRouter } from "src/server/api/root";
import {
  getBundledQuestMap,
  getBundledServantMap,
  getBundledUpgrades
} from "src/utils/getBundles";
import { createUpgradeFilter, createUpgradeSorter } from "./filters";
import { formFiltersDefault } from "./filtersReducer";

export const getStaticProps = async () => {
  const [upgradesList, questMap, servantMap, api] = await Promise.all([
    getBundledUpgrades(),
    getBundledQuestMap(),
    getBundledServantMap(),
    createServerSideHelpers({ router: appRouter, ctx: {} })
  ]);

  const sorter = createUpgradeSorter(questMap);
  const filter = createUpgradeFilter(formFiltersDefault, servantMap, questMap);
  const upgradeIds = upgradesList
    .sort(sorter)
    .filter(filter)
    .slice(0, 10)
    .map(upgrade => upgrade.quest);
  const fallback = await api.upgrades.select.fetch({
    id: upgradeIds
  });

  return {
    props: { fallback }
  };
};

export type UpgradesPageProps = InferGetStaticPropsType<typeof getStaticProps>;
