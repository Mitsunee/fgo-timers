import type { GetStaticPaths, GetStaticProps } from "next";
import { eventCollectIDs } from "~/events/collectIDs";
import { serverApi } from "~/server/api/root";
import { createCraftEssenceRecord } from "~/static/data/craftEssences";
import { createServantRecord } from "~/static/data/servants";
import type { BundledEvent } from "~/events/types";
import { getEventProps, NOT_FOUND } from "./getEventProps";
import type { EventPageProps, PageContext, StaticPath } from "./types";

type EventWithBanners = BundledEvent & {
  banners: NonNullable<BundledEvent["banners"]>;
};

export interface EventBannersPageProps
  extends Omit<EventPageProps, "items" | "ccs" | "costumes"> {
  event: EventWithBanners;
}

function hasBanners(event: BundledEvent): event is EventWithBanners {
  return Boolean(event.banners);
}

export const getStaticPaths: GetStaticPaths<PageContext> = async () => {
  const events = await serverApi.events.full.fetch({ exclude: "inactive" });
  const paths: StaticPath[] = events
    .filter(hasBanners)
    .map(({ slug }) => ({ params: { slug } }));

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<
  EventBannersPageProps,
  PageContext
> = async ({ params }) => {
  if (!params) return NOT_FOUND;

  const { slug } = params;
  const event = await getEventProps(slug, hasBanners);
  if (!event) return NOT_FOUND;

  const ids = eventCollectIDs(event, {
    banners: true,
    times: false,
    schedules: false
  });

  const [servants, ces] = await Promise.all([
    createServantRecord(ids.servants),
    createCraftEssenceRecord(ids.ces)
  ]);

  return { props: { event, servants, ces } };
};
