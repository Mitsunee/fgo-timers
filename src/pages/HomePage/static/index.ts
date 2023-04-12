import type { GetStaticPropsResult, InferGetStaticPropsType } from "next";
import * as Legacy from "src/server/HomePage";
import { msToSeconds } from "src/time/msToSeconds";
import { getBundledItemMap } from "src/utils/getBundles";
import { getEventProps } from "./getEventProps";
import { getLoginTicketProps } from "./getLoginTicketProps";
import { getMilestoneProps } from "./getMilestoneProps";

export const getStaticProps = async () => {
  const now = msToSeconds(Date.now());
  const [legacyProps, itemMap, events, loginTicket, milestones] =
    await Promise.all([
      Legacy.getStaticProps(),
      getBundledItemMap(),
      getEventProps(now),
      getLoginTicketProps(now),
      getMilestoneProps(now)
    ]);

  const itemIds = new Set<number>([...loginTicket.items]);
  const items: typeof itemMap = {};

  for (const id of Array.from(itemIds)) {
    items[id] = itemMap[id];
  }

  const props = { ...legacyProps, events, loginTicket, items, milestones };
  const res: GetStaticPropsResult<typeof props> = { props, revalidate: 3600 };
  return res;
};

export type HomePageProps = InferGetStaticPropsType<typeof getStaticProps>;
