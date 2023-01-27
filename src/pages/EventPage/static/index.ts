import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType
} from "next";
import {
  getBundledEvents,
  getBundledCEMap,
  getBundledServantMap
} from "src/utils/getBundles";
import { getEventProps } from "./getEventProps";
import type { PageContext, PageProps, StaticPath } from "./types";

export const getStaticPaths: GetStaticPaths<PageContext> = async () => {
  const events = await getBundledEvents();
  const paths: StaticPath[] = events.map(({ slug }) => ({ params: { slug } }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<PageProps, PageContext> = async ({
  params
}) => {
  const { slug } = params!;
  const [servantMap, ceMap] = await Promise.all([
    getBundledServantMap(),
    getBundledCEMap()
  ]);

  const event = await getEventProps(slug);
  const servants: PageProps["servants"] = {};
  const ces: PageProps["ces"] = {};

  // browse event data for related servants and ces
  event.times?.forEach(time => {
    time.servants?.forEach(id => {
      servants[id] = servantMap[id];
    });
    time.ces?.forEach(id => {
      ces[id] = ceMap[id];
    });
  });
  event.banners?.forEach(banner => {
    banner.servants?.forEach(id => {
      servants[id] = servantMap[id];
    });
    banner.ces?.forEach(id => {
      ces[id] = ceMap[id];
    });
  });

  return { props: { event, servants, ces } };
};

export type EventPageProps = InferGetStaticPropsType<typeof getStaticProps>;
