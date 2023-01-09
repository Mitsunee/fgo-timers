import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType
} from "next";
import type { ParsedUrlQuery } from "querystring";
import type { BundledEvent } from "src/events/types";
import { getBundledEvents } from "src/events/getBundle";
import type { BundledCE } from "src/items/types";
import { getBundledCEs } from "src/items/getBundles";
import type { BundledServant } from "src/servants/types";
import { getBundledServants } from "src/servants/getBundles";
import { safeProxyIDMap } from "src/utils/proxyIDMap";

interface PageContext extends Partial<ParsedUrlQuery> {
  slug: string;
}

interface PageProps {
  event: BundledEvent;
  servants: Record<number, BundledServant>;
  ces: Record<number, BundledCE>;
}

interface StaticPath {
  params: PageContext;
}

export const getStaticPaths: GetStaticPaths<PageContext> = async () => {
  const events = await getBundledEvents();
  const paths: StaticPath[] = events.map(({ slug }) => ({ params: { slug } }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<PageProps, PageContext> = async ({
  params
}) => {
  const { slug } = params!;
  const [events, _servantMap, _ceMap] = await Promise.all([
    getBundledEvents(),
    getBundledServants(),
    getBundledCEs()
  ]);

  const servantMap = safeProxyIDMap(
    _servantMap,
    "Could not find servant id %KEY% in prebuild data"
  );
  const ceMap = safeProxyIDMap(
    _ceMap,
    "Could not find CE id %KEY% in prebuild data"
  );

  const event: PageProps["event"] = events.find(event => event.slug == slug)!;
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
