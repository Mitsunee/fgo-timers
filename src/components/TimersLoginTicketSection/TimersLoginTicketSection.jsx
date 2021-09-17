import { useState, useRef, useEffect } from "react";
import spacetime from "spacetime";
import lt from "long-timeout";

import LoginTicketSection from "@components/LoginTicketSection";

export default function TimersLoginTicketSection({
  tickets,
  itemData,
  interval
}) {
  const [currentMonth, setCurrentMonth] = useState(null);
  const timeoutRef = useRef(null);

  // effect that find currentMonth in tickets and manages timeout to update
  useEffect(() => {
    const update = () => {
      // set data for current month
      const now = spacetime.now("America/Los_Angeles");
      setCurrentMonth(tickets[now.year()][now.format("month-short")]);

      // find delta to next login ticket cycle
      const next = now
        .next("month")
        .time(`${now.isDST() ? 21 : 20}:00:05`, true);
      const timeDelta = next.epoch - now.epoch;

      // in client-only schedule timeout to update page when next month starts
      if (typeof window !== "undefined") {
        timeoutRef.current = lt.setTimeout(update, timeDelta);
      }

      // cleanup function
      return () => {
        if (timeoutRef.current !== null) {
          lt.clearTimeout(timeoutRef.current);
        }
      };
    };

    return update();
  }, [tickets]);

  return currentMonth === null ? null : (
    <>
      <LoginTicketSection data={currentMonth.map(id => itemData[id])} />
      <span
      // DEBUG
      // WIP
      >
        DEBUG: {interval}
      </span>
    </>
  );
}
