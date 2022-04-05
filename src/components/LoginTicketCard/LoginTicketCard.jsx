import { useMemo } from "react";
import spacetime from "spacetime";
import Link from "next/link";

// import styles from "./LoginTicketCard.module.css";
import { useFormattedSpacetime } from "@utils/hooks/useFormattedSpacetime";
import { useFormattedDelta } from "@utils/hooks/useFormattedDelta";
import { Card } from "@components/Card";
import { FGOItemList, FGOItemListItem } from "@components/FGOItemList";
import NoSSR from "@components/NoSSR";
import NextLogin from "./NextLogin";
import NextServerMilestone from "./NextServerMilestone";

export default function LoginTicketCard({ items, next }) {
  const nextMonth = useMemo(() => spacetime(next * 1000), [next]);
  const nextMonthDate = useFormattedSpacetime(nextMonth, "short");
  const nextMonthDelta = useFormattedDelta(nextMonth);

  return (
    <Card
      title="Login Exchange Tickets"
      icon="https://static.atlasacademy.io/NA/Items/10000.png">
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
          {nextMonthDelta} ({nextMonthDate})
          <br />
          <Link href={`/exchange-tickets/${nextMonth.year()}`} passHref>
            <a style={{ textDecoration: "underline" }}>More Information</a>
          </Link>
        </p>
        <NextServerMilestone />
      </NoSSR>
    </Card>
  );
}
