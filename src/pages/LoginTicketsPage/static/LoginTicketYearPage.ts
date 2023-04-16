import type { ParsedUrlQuery } from "querystring";
import type { GetStaticPaths, GetStaticProps } from "next";
import type { BundledItem, BundledLoginTicket } from "src/items/types";
import {
  getBundledItemMap,
  getBundledLoginTickets
} from "src/utils/getBundles";
import { getTicketsYears } from "../getTicketsYears";
import { getTicketYear } from "../getTicketYear";

export interface LoginTicketYearPageProps {
  tickets: BundledLoginTicket[];
  items: Record<number, BundledItem>;
  prev?: true;
  year: number;
  next?: true;
}

export interface PageContext extends Partial<ParsedUrlQuery> {
  year: `${number}`;
}

export const getStaticPaths: GetStaticPaths<PageContext> = async () => {
  const tickets = await getBundledLoginTickets();
  const years = getTicketsYears(tickets);
  const paths = years.map(year => ({
    params: { year: year.toString() as `${number}` }
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<
  LoginTicketYearPageProps,
  PageContext
> = async ({ params }) => {
  const year = +params!.year;
  const [tickets, itemMap] = await Promise.all([
    getBundledLoginTickets(),
    getBundledItemMap()
  ]);
  const thisYearTickets = new Array<BundledLoginTicket>();
  const prev = year - 1;
  let hasPrev: boolean = false;
  const next = year + 1;
  let hasNext: boolean = false;

  // iterate through tickets to check if previous/next years exist and find all tickets for this year
  for (const ticket of tickets) {
    const ticketYear = getTicketYear(ticket);
    if (ticketYear == prev) {
      hasPrev = true;
    } else if (ticketYear == year) {
      thisYearTickets.push(ticket);
    } else if (ticketYear == next) {
      hasNext = true;
    }
  }

  // map used items
  const items: Record<number, BundledItem> = {};
  const itemsSeen = new Set<number>(
    thisYearTickets.flatMap(ticket => ticket.items)
  );
  for (const itemId of itemsSeen) {
    items[itemId] ||= itemMap[itemId];
  }

  // create props object
  const props: LoginTicketYearPageProps = {
    tickets: thisYearTickets,
    items,
    year
  };

  if (hasPrev) props.prev = true;
  if (hasNext) props.next = true;

  return { props };
};
