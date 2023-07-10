import type { GetStaticPropsResult, InferGetStaticPropsType } from "next";
import { serverApi } from "~/server/api/root";
import * as Legacy from "~/server/HomePage";
import { createItemRecord } from "~/static/data/items";
import { msToSeconds } from "~/time/msToSeconds";
//import { parseDate } from "~/time/parseDate";
import { getLoginTicketProps } from "./getLoginTicketProps";
import { getMilestoneProps } from "./getMilestoneProps";
import { getShopInfoProps } from "./getShopInfoProps";

export const getStaticProps = async () => {
  const now = msToSeconds(Date.now());
  const [legacyProps, events, loginTicket, milestones, shops] =
    await Promise.all([
      Legacy.getStaticProps(),
      serverApi.events.basic.fetch({ exclude: "inactive", now }),
      getLoginTicketProps(now),
      getMilestoneProps(now),
      getShopInfoProps(now)
    ]);

  const items = await createItemRecord(new Set<number>(loginTicket.items));

  /* const special = {
    title: "FGO and Type Moon Panel at Anime Expo",
    date: parseDate("2023-07-02 19:00 PDT")
  }; */

  const props = {
    //special,
    ...legacyProps,
    events,
    loginTicket,
    items,
    milestones,
    shops
  };
  const res: GetStaticPropsResult<typeof props> = { props, revalidate: 3600 };
  return res;
};

export type HomePageProps = InferGetStaticPropsType<typeof getStaticProps>;
