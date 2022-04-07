import { readStaticBundle } from "src/server/utils/static";

export async function getStaticPaths() {
  const loginTickets = await readStaticBundle("loginTickets");
  const paths = Object.keys(loginTickets).map(year => ({ params: { year } }));

  return { paths, fallback: false };
}

export async function getStaticProps(context) {
  const loginTickets = await readStaticBundle("loginTickets");
  const { year } = context.params;

  const years = Object.keys(loginTickets);

  const data = loginTickets[year];
  if (!data) return { notFound: true };
  const tickets = Object.entries(data).map(([month, items]) => ({
    month,
    items
  }));

  return { props: { tickets, years, self: year } };
}
