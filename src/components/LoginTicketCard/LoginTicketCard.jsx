import { useState, useRef, useEffect } from "react";
import spacetime from "spacetime";
import lt from "long-timeout";

// import styles from "./LoginTicketCard.module.css";
import { useFormattedSpacetime } from "@utils/hooks/useFormattedSpacetime";
import { useFormattedDelta } from "@utils/hooks/useFormattedDelta";
import { Card } from "@components/Card";
import { FGOItemList, FGOItemListItem } from "@components/FGOItemList";
import NoSSR from "@components/NoSSR";
import NextLogin from "./NextLogin";
import NextServerMilestone from "./NextServerMilestone";

export default function LoginTicketCard({ tickets, itemData, interval }) {
  const timeoutRef = useRef(null);
  const [currentMonth, setCurrentMonth] = useState(null);
  const [nextMonth, setNextMonth] = useState(null);
  const nextMonthDate = useFormattedSpacetime(nextMonth, "short");
  const nextMonthDelta = useFormattedDelta(interval, nextMonth);

  // effect that find currentMonth in tickets and manages timeout to update
  useEffect(() => {
    const update = () => {
      // set data for current month
      const now = spacetime.now("America/Los_Angeles");
      setCurrentMonth(tickets[now.year()][now.format("month-short")]);

      // find delta to next login ticket cycle
      const next = now.next("month").time(`${now.isDST() ? 21 : 20}:00`, true);
      const timeDelta = next.epoch - now.epoch;
      setNextMonth(next.goto());

      // in client-only schedule timeout to update page when next month starts
      if (typeof window !== "undefined") {
        timeoutRef.current = lt.setTimeout(update, timeDelta);
      }

      // return cleanup function to effect
      return () => {
        if (timeoutRef.current !== null) {
          lt.clearTimeout(timeoutRef.current);
        }
      };
    };

    return update(); // runs function, which returns cleanup function
  }, [tickets]);

  return currentMonth === null ? null : (
    <Card
      title="Login Exchange Tickets"
      icon="https://static.atlasacademy.io/NA/Items/10000.png">
      <FGOItemList>
        {currentMonth
          .map(id => itemData[id])
          .map(item => (
            <FGOItemListItem key={item.id} data={item} />
          ))}
      </FGOItemList>
      <NoSSR>
        <NextLogin interval={interval} />
        <p>
          Next Exchange Ticket Rotation:
          <br />
          {nextMonthDelta} ({nextMonthDate})
        </p>
        <NextServerMilestone interval={interval} />
      </NoSSR>
    </Card>
  );
}
