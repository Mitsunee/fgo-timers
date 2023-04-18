import { createServerSideHelpers } from "@trpc/react-query/server";
import type { GetStaticPaths, GetStaticProps } from "next";
import { appRouter } from "src/server/api/root";
import type { BundledEvent } from "src/events/types";
import type { BundledQuest, BundledUpgrade } from "src/upgrades/types";
import type { BundledNP, BundledSkill } from "src/servants/types";
import { getBundledEvents } from "src/utils/getBundles";
import {
  createEventActiveFilter,
  getEventProps,
  NOT_FOUND
} from "./getEventProps";
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
  const [events, isActive] = await Promise.all([
    getBundledEvents(),
    createEventActiveFilter()
  ]);
  const paths: StaticPath[] = events
    .filter(hasUpgrades)
    .filter(isActive)
    .map(({ slug }) => ({ params: { slug } }));

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<
  EventUpgradesPageProps,
  PageContext
> = async ({ params }) => {
  if (!params) return NOT_FOUND;

  const { slug } = params;
  const [event, api] = await Promise.all([
    getEventProps(slug, hasUpgrades),
    createServerSideHelpers({ router: appRouter, ctx: {} })
  ]);

  if (!event) return NOT_FOUND;

  const data = await api.upgrades.select.fetch({
    id: event.upgrades
  });

  return { props: { event, ...data } };
};
