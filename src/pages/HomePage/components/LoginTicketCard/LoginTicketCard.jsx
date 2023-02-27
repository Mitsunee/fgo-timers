import spacetime from "spacetime";
import Link from "next/link";

import { msToSeconds } from "src/time/msToSeconds";
import { Card } from "src/client/components/Card";
import {
  FGOItemList,
  FGOItemListItem
} from "src/client/components/FGOItemList";
import { NoSSR } from "src/client/components/NoSSR";
import { DisplayDelta, DisplayDate } from "src/client/components/TimeDisplay";
import NextLogin from "./NextLogin";
import NextServerMilestone from "./NextServerMilestone";

export default function LoginTicketCard({ items, next }) {
  const nextMonth = spacetime(next * 1000);
  const nextTime = msToSeconds(nextMonth.epoch);

  return (
    <Card
      title="Login Exchange Tickets"
      icon="https://static.atlasacademy.io/NA/Items/10000.png"
      style={{ "--border": "var(--light)", "--bg": "white" }}>
      <FGOItemList>
        {items.map(item => {
          const data = {
            ...item,
            icon: `https://static.atlasacademy.io/${item.icon}`
          };
          return <FGOItemListItem key={item.id} data={data} />;
        })}
      </FGOItemList>
      <NoSSR>
        <NextLogin />
        <p>
          Next Exchange Ticket Rotation:
          <br />
          <DisplayDelta time={nextTime} /> (
          <DisplayDate time={nextTime} format="short" />)
          <br />
          <Link
            href={`/exchange-tickets/${nextMonth.year()}`}
            style={{ textDecoration: "underline" }}>
            More Information
          </Link>
        </p>
        <NextServerMilestone />
      </NoSSR>
    </Card>
  );
}
