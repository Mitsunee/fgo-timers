import type { InferGetStaticPropsType } from "next";
import { serverApi } from "~/server/api/root";
import { msToSeconds } from "~/time/msToSeconds";

export async function getStaticProps() {
  const now = msToSeconds(Date.now());
  const fallback = await serverApi.events.basic.fetch({
    limit: 10,
    now
  });

  return { props: { active: [], fallback, now } };
}

export type EventsPageProps = InferGetStaticPropsType<typeof getStaticProps>;
