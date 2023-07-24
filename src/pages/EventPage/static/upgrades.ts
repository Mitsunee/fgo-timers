import type { GetStaticPaths, GetStaticProps } from "next";
import { serverApi } from "~/server/api/root";
import type { BundledEvent } from "~/events/types";
import type { BundledNoblePhantasm, BundledSkill } from "~/servants/types";
import type { BundledQuest, BundledUpgrade } from "~/upgrades/types";
import { getEventProps, NOT_FOUND } from "./getEventProps";
import type { EventPageProps, PageContext, StaticPath } from "./types";

type EventWithUpgrades = BundledEvent & {
  upgrades: NonNullable<BundledEvent["upgrades"]>;
};
export interface EventUpgradesPageProps
  extends Omit<EventPageProps, "ces" | "items" | "ccs" | "costumes"> {
  event: EventWithUpgrades;
  upgrades: BundledUpgrade[];
  quests: Record<number, BundledQuest>;
  skills: Record<number, BundledSkill>;
  nps: Record<number, BundledNoblePhantasm>;
}

function hasUpgrades(event: BundledEvent): event is EventWithUpgrades {
  return Boolean(event.upgrades);
}

export const getStaticPaths: GetStaticPaths<PageContext> = async () => {
  const events = await serverApi.events.full.fetch({ exclude: "inactive" });
  const paths: StaticPath[] = events
    .filter(hasUpgrades)
    .map(({ slug }) => ({ params: { slug } }));

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<
  EventUpgradesPageProps,
  PageContext
> = async ({ params }) => {
  if (!params) return NOT_FOUND;

  const { slug } = params;
  const event = await getEventProps(slug, hasUpgrades);
  if (!event) return NOT_FOUND;

  const data = await serverApi.upgrades.select.fetch({
    id: event.upgrades
  });

  return { props: { event, ...data } };
};
