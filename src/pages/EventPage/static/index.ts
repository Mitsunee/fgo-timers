import type { GetStaticPaths, GetStaticProps } from "next";
import { serverApi } from "~/server/api/root";
import {
  getBundledCCMap,
  getBundledCEMap,
  getBundledItemMap,
  getBundledServantMap
} from "~/utils/getBundles";
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
  const [servantMap, ceMap, itemMap, ccMap, event] = await Promise.all([
    getBundledServantMap(),
    getBundledCEMap(),
    getBundledItemMap(),
    getBundledCCMap(),
    getEventProps(slug)
  ]);

  if (!event) return NOT_FOUND;

  const servants: EventPageProps["servants"] = {};
  const ces: EventPageProps["ces"] = {};
  const items: EventPageProps["items"] = {};
  const ccs: EventPageProps["ccs"] = {};

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
    time.ccs?.forEach(id => {
      ccs[id] = ccMap[id];
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
      time.ccs?.forEach(id => {
        ccs[id] = ccMap[id];
      });
    });
  });

  return { props: { event, servants, ces, items, ccs } };
};
