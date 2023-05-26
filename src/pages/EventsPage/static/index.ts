import type { InferGetStaticPropsType } from "next";
import { serverApi } from "~/server/api/root";
import { msToSeconds } from "~/time/msToSeconds";

export async function getStaticProps() {
  const now = msToSeconds(Date.now());
  const active = await serverApi.events.basic.fetch({
    exclude: "inactive",
    now
  });
  const fallback = await serverApi.events.basic.fetch({
    limit: 10,
    exclude: "active",
    now
  });

  return { props: { active, fallback, now }, revalidate: 18000 };
}

export type EventsPageProps = InferGetStaticPropsType<typeof getStaticProps>;
