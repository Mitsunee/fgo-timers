import Headline from "src/client/components/Headline";
import Meta from "src/client/components/Meta";
import type { LoginTicketsPageProps } from "src/pages/LoginTicketsPage/static/LoginTicketsPage";

// Next page configs
export { getStaticProps } from "src/pages/LoginTicketsPage/static/LoginTicketsPage";
export const config = {
  unstable_includeFiles: [
    "assets/static/login_tickets.json",
    "assest/static/data/items.json"
  ]
};

export default function LoginTicketsPage({
  updatedAt,
  tickets,
  current,
  next,
  items
}: LoginTicketsPageProps) {
  return (
    <>
      <Meta
        title="Login Exchange Tickets"
        description="Information on Login Exchange Tickets for Fate/Grand Order Global Version"
      />
      <Headline>Debug</Headline>
      <code>
        <pre>
          {JSON.stringify(
            { updatedAt, tickets, current, next, items },
            null,
            2
          )}
        </pre>
      </code>
    </>
  );
}
