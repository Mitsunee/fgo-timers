import type { GetStaticPaths, InferGetStaticPropsType } from "next";
import type { BundledEvent } from "src/events/types";
import { getBundledEvents } from "src/utils/getBundles";
import type { PageContext, StaticPath } from "./types";
import { getStaticProps } from "./";

type EventWithBanners = BundledEvent & {
  banners: Exclude<BundledEvent["banners"], undefined>;
};

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

export { getStaticProps };
export interface EventPageProps
  extends InferGetStaticPropsType<typeof getStaticProps> {
  event: EventWithBanners;
}
