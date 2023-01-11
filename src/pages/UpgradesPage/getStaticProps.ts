import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";

import type { DataApiFallback } from "src/server/DataApi";
import type { ExpandedUpgrades } from "src/server/api/routers/upgrades";
import { appRouter } from "src/server/api/root";
import { apiUrl } from "./constants";

type PageProps = DataApiFallback<typeof apiUrl, ExpandedUpgrades>;

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const api = createProxySSGHelpers({ router: appRouter, ctx: {} });
  const data: ExpandedUpgrades = await api.upgrades.ssgFallback.fetch();

  return {
    props: {
      fallback: { [apiUrl]: data }
    }
  };
};

export type UpgradesPageProps = InferGetStaticPropsType<typeof getStaticProps>;
