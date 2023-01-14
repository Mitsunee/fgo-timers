import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";

import type { DataApiFallback } from "src/server/DataApi";
import type { ExpandedUpgrades } from "src/server/api/routers/upgrades";
import { appRouter } from "src/server/api/root";
import { apiUrl } from "./constants";
import {
  getBundledQuestMap,
  getBundledServantMap,
  getBundledUpgrades
} from "src/utils/getBundles";
import { createUpgradeFilter, createUpgradeSorter } from "./filters";
import { formFiltersDefault } from "./filtersReducer";

type PageProps = DataApiFallback<typeof apiUrl, ExpandedUpgrades>;

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const [upgradesList, questMap, servantMap, api] = await Promise.all([
    getBundledUpgrades(),
    getBundledQuestMap(),
    getBundledServantMap(),
    createProxySSGHelpers({ router: appRouter, ctx: {} })
  ]);

  const sorter = createUpgradeSorter(questMap);
  const filter = createUpgradeFilter(formFiltersDefault, servantMap, questMap);
  const upgradeIds = upgradesList
    .sort(sorter)
    .filter(filter)
    .slice(0, 10)
    .map(upgrade => upgrade.quest);
  const data: ExpandedUpgrades = await api.upgrades.select.fetch({
    id: upgradeIds
  });

  return {
    props: {
      fallback: { [apiUrl]: data }
    }
  };
};

export type UpgradesPageProps = InferGetStaticPropsType<typeof getStaticProps>;
