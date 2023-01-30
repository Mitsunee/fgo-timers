import type { GetStaticPaths, GetStaticProps } from "next";
import {
  getBundledEvents,
  getBundledCEMap,
  getBundledServantMap
} from "src/utils/getBundles";
import type { BundledEvent } from "src/events/types";
import { getEventProps } from "./getEventProps";
import type { PageContext, EventPageProps, StaticPath } from "./types";

type EventWithBanners = BundledEvent & {
  banners: Exclude<BundledEvent["banners"], undefined>;
};

export interface EventBannersPageProps extends EventPageProps {
  event: EventWithBanners;
}

function hasBanners(event: BundledEvent): event is EventWithBanners {
  return Boolean(event.banners);
}

export const getStaticPaths: GetStaticPaths<PageContext> = async () => {
  const events = await getBundledEvents();
  const paths: StaticPath[] = events
    .filter(hasBanners)
    .map(({ slug }) => ({ params: { slug } }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<
  EventBannersPageProps,
  PageContext
> = async ({ params }) => {
  const { slug } = params!;
  const [servantMap, ceMap, event] = await Promise.all([
    getBundledServantMap(),
    getBundledCEMap(),
    getEventProps(slug, hasBanners)
  ]);

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
