import type { GetStaticPaths, GetStaticProps } from "next";
import {
  getBundledEvents,
  getBundledCEMap,
  getBundledServantMap,
  getBundledItemMap
} from "src/utils/getBundles";
import { getEventProps } from "./getEventProps";
import type { PageContext, EventPageProps, StaticPath } from "./types";

export type { EventPageProps };

export const getStaticPaths: GetStaticPaths<PageContext> = async () => {
  const events = await getBundledEvents();
  const paths: StaticPath[] = events.map(({ slug }) => ({ params: { slug } }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<
  EventPageProps,
  PageContext
> = async ({ params }) => {
  const { slug } = params!;
  const [servantMap, ceMap, itemMap, event] = await Promise.all([
    getBundledServantMap(),
    getBundledCEMap(),
    getBundledItemMap(),
    getEventProps(slug)
  ]);

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
