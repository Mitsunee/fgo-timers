import type { GetStaticPaths, GetStaticProps } from "next";
import {
  getBundledEvents,
  getBundledCEMap,
  getBundledServantMap
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
  const [servantMap, ceMap, event] = await Promise.all([
    getBundledServantMap(),
    getBundledCEMap(),
    getEventProps(slug)
  ]);

  const servants: EventPageProps["servants"] = {};
  const ces: EventPageProps["ces"] = {};

  // browse event data for related servants and ces
  event.times?.forEach(time => {
    time.servants?.forEach(id => {
      servants[id] = servantMap[id];
    });
    time.ces?.forEach(id => {
      ces[id] = ceMap[id];
    });
  });

  return { props: { event, servants, ces } };
};
