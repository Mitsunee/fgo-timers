import type { GetStaticPaths, GetStaticProps } from "next";
import { eventCollectIDs } from "~/events/collectIDs";
import { serverApi } from "~/server/api/root";
import { createCommandCodeRecord } from "~/static/data/commandCodes";
import { createCostumeRecord } from "~/static/data/costumes";
import { createCraftEssenceRecord } from "~/static/data/craftEssences";
import { createItemRecord } from "~/static/data/items";
import { createServantRecord } from "~/static/data/servants";
import { getEventProps, NOT_FOUND } from "./getEventProps";
import type { EventPageProps, PageContext, StaticPath } from "./types";

export type { EventPageProps };

export const getStaticPaths: GetStaticPaths<PageContext> = async () => {
  const events = await serverApi.events.full.fetch({ exclude: "inactive" });
  const paths: StaticPath[] = events.map(({ slug }) => ({ params: { slug } }));

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<
  EventPageProps,
  PageContext
> = async ({ params }) => {
  if (!params) return NOT_FOUND;

  const { slug } = params;
  const event = await getEventProps(slug);
  if (!event) return NOT_FOUND;

  const ids = eventCollectIDs(event, {
    times: true,
    schedules: true,
    banners: false
  });

  const [servants, ces, items, ccs, costumes] = await Promise.all([
    createServantRecord(ids.servants),
    createCraftEssenceRecord(ids.ces),
    createItemRecord(ids.items),
    createCommandCodeRecord(ids.ccs),
    createCostumeRecord(ids.costumes)
  ]);

  return { props: { event, servants, ces, items, ccs, costumes } };
};
