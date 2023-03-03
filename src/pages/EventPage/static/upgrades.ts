import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import type { GetStaticPaths, GetStaticProps } from "next";
import { appRouter } from "src/server/api/root";
import type { BundledEvent } from "src/events/types";
import type { BundledQuest, BundledUpgrade } from "src/upgrades/types";
import type { BundledNP, BundledSkill } from "src/servants/types";
import { getBundledEvents } from "src/utils/getBundles";
import { Log } from "src/utils/log";
import { getEventProps } from "./getEventProps";
import type { PageContext, EventPageProps, StaticPath } from "./types";

type EventWithUpgrades = BundledEvent & {
  upgrades: NonNullable<BundledEvent["upgrades"]>;
};
export interface EventUpgradesPageProps
  extends Omit<EventPageProps, "ces" | "items"> {
  event: EventWithUpgrades;
  upgrades: BundledUpgrade[];
  quests: Record<number, BundledQuest>;
  skills: Record<number, BundledSkill>;
  nps: Record<number, BundledNP>;
}

function hasUpgrades(event: BundledEvent): event is EventWithUpgrades {
  return Boolean(event.upgrades);
}

export const getStaticPaths: GetStaticPaths<PageContext> = async () => {
  const events = await getBundledEvents();
  const paths: StaticPath[] = events
    .filter(hasUpgrades)
    .map(({ slug }) => ({ params: { slug } }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<
  EventUpgradesPageProps,
  PageContext
> = async ({ params }) => {
  const { slug } = params!;
  const [event, api] = await Promise.all([
    getEventProps(slug, hasUpgrades),
    createProxySSGHelpers({ router: appRouter, ctx: {} })
  ]);
  if (!hasUpgrades(event)) {
    Log.throw(
      `Event ${slug} has no upgrades, but upgrades sub page was rendered`
    );
  }

  const data = await api.upgrades.select.fetch({
    id: event.upgrades
  });

  return { props: { event, ...data } };
};
