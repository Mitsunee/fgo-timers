import type { InferGetStaticPropsType } from "next";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "src/server/api/root";

export async function getStaticProps() {
  const [api] = await Promise.all([
    createProxySSGHelpers({ router: appRouter, ctx: {} })
  ]);

  const fallback = await api.events.basic.fetch({ limit: 10 });

  return { props: { fallback } };
}

export type EventsPageProps = InferGetStaticPropsType<typeof getStaticProps>;
