import type { GetStaticPaths, GetStaticProps } from "next";
import {
  getBundledEvents,
  getBundledCEMap,
  getBundledServantMap
} from "src/utils/getBundles";
import type { BundledEvent } from "src/events/types";
import {
  createEventActiveFilter,
  getEventProps,
  NOT_FOUND
} from "./getEventProps";
import type { PageContext, EventPageProps, StaticPath } from "./types";

type EventWithBanners = BundledEvent & {
  banners: NonNullable<BundledEvent["banners"]>;
};

export interface EventBannersPageProps extends Omit<EventPageProps, "items"> {
  event: EventWithBanners;
}

function hasBanners(event: BundledEvent): event is EventWithBanners {
  return Boolean(event.banners);
}

export const getStaticPaths: GetStaticPaths<PageContext> = async () => {
  const [events, isActive] = await Promise.all([
    getBundledEvents(),
    createEventActiveFilter()
  ]);
  const paths: StaticPath[] = events
    .filter(hasBanners)
    .filter(isActive)
    .map(({ slug }) => ({ params: { slug } }));

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<
  EventBannersPageProps,
  PageContext
> = async ({ params }) => {
  if (!params) return NOT_FOUND;

  const { slug } = params;
  const [servantMap, ceMap, event] = await Promise.all([
    getBundledServantMap(),
    getBundledCEMap(),
    getEventProps(slug, hasBanners)
  ]);

  if (!event) return NOT_FOUND;

  const servants: EventPageProps["servants"] = {};
  const ces: EventPageProps["ces"] = {};

  // browse event data for related servants and ces
  event.banners.forEach(banner => {
    banner.servants?.forEach(id => {
      servants[id] = servantMap[id];
    });
    banner.ces?.forEach(id => {
      ces[id] = ceMap[id];
    });
  });

  return { props: { event, servants, ces } };
};
