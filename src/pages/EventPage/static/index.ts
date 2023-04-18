import type { GetStaticPaths, GetStaticProps } from "next";
import {
  getBundledEvents,
  getBundledCEMap,
  getBundledServantMap,
  getBundledItemMap
} from "src/utils/getBundles";
import {
  createEventActiveFilter,
  getEventProps,
  NOT_FOUND
} from "./getEventProps";
import type { PageContext, EventPageProps, StaticPath } from "./types";

export type { EventPageProps };

export const getStaticPaths: GetStaticPaths<PageContext> = async () => {
  const [events, isActive] = await Promise.all([
    getBundledEvents(),
    createEventActiveFilter()
  ]);
  const paths: StaticPath[] = events
    .filter(isActive)
    .map(({ slug }) => ({ params: { slug } }));

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<
  EventPageProps,
  PageContext
> = async ({ params }) => {
  if (!params) return NOT_FOUND;

  const { slug } = params;
  const [servantMap, ceMap, itemMap, event] = await Promise.all([
    getBundledServantMap(),
    getBundledCEMap(),
    getBundledItemMap(),
    getEventProps(slug)
  ]);

  if (!event) return NOT_FOUND;

  const servants: EventPageProps["servants"] = {};
  const ces: EventPageProps["ces"] = {};
  const items: EventPageProps["items"] = {};

  // browse event times for related entities
  event.times?.forEach(time => {
    time.servants?.forEach(id => {
      servants[id] = servantMap[id];
    });
    time.ces?.forEach(id => {
      ces[id] = ceMap[id];
    });
    time.items?.forEach(id => {
      items[id] = itemMap[id];
    });
  });

  // browse schedule for related entities
  event.schedules?.forEach(schedule => {
    schedule.times.forEach(time => {
      time.servants?.forEach(id => {
        servants[id] = servantMap[id];
      });
      time.ces?.forEach(id => {
        ces[id] = ceMap[id];
      });
      time.items?.forEach(id => {
        items[id] = itemMap[id];
      });
    });
  });

  return { props: { event, servants, ces, items } };
};
