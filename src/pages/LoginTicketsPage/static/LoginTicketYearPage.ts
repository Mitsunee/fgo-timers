import type { GetStaticPaths, GetStaticProps } from "next";
import type { ParsedUrlQuery } from "querystring";
import { createItemRecord } from "~/static/data/items";
import { getBundledTickets } from "~/static/exchangeTickets";
import type { BundledItem, BundledLoginTicket } from "~/items/types";
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
  const tickets = await getBundledTickets();
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
  const tickets = await getBundledTickets();
  const thisYearTickets = new Array<BundledLoginTicket>();
  const prev = year - 1;
  let hasPrev = false;
  const next = year + 1;
  let hasNext = false;

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
  const items: DataMap<BundledItem> = await createItemRecord(
    new Set(thisYearTickets.flatMap(ticket => ticket.items))
  );

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
