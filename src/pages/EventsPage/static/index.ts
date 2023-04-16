import { createServerSideHelpers } from "@trpc/react-query/server";
import type { InferGetStaticPropsType } from "next";
import { appRouter } from "src/server/api/root";

export async function getStaticProps() {
  const [api] = await Promise.all([
    createServerSideHelpers({ router: appRouter, ctx: {} })
  ]);

  const fallback = await api.events.basic.fetch({ limit: 10 });

  return { props: { fallback } };
}

export type EventsPageProps = InferGetStaticPropsType<typeof getStaticProps>;
