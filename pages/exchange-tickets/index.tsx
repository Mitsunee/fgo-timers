import { useMemo } from "react";
import { useIsClient } from "src/client/utils/hooks/useIsClient";
import { useCurrentTime } from "src/client/utils/hooks/useCurrentTime";
import { useRecurringDaily } from "src/client/utils/hooks/useRecurringDaily";
import Meta from "src/client/components/Meta";
import Headline from "src/client/components/Headline";
import Section from "src/client/components/Section";
import {
  TimerList,
  TimerListEntities,
  TimerListItem
} from "src/client/components/Card";
import { BorderedItemIcon } from "src/client/components/BorderedIcon";
import { DisplayDate, DisplayDelta } from "src/client/components/TimeDisplay";
import { LinkButton } from "src/client/components/Button";
import styles from "src/pages/LoginTicketsPage/LoginTicketsPage.module.css";
import { getTicketDelta } from "src/pages/LoginTicketsPage/getTicketDelta";
import type { LoginTicketsPageProps } from "src/pages/LoginTicketsPage/static/LoginTicketsPage";

// Next page configs
export { getStaticProps } from "src/pages/LoginTicketsPage/static/LoginTicketsPage";

export default function LoginTicketsPage({
  currentTicket,
  nextTicket,
  years,
  items
}: LoginTicketsPageProps) {
  const isClient = useIsClient();
  const { current: currentTime } = useCurrentTime();
  const nextTicketTime = useRecurringDaily(4);
  const yearsArr = useMemo(() => {
    return Array.from(
      { length: years.max - years.min + 1 },
      (_, n) => years.min + n
    );
  }, [years]);

  return (
    <>
      <Meta
        title="Login Exchange Tickets"
        description="Information on Login Exchange Tickets for Fate/Grand Order Global Version"
      />
      <Headline>Login Exchange Tickets</Headline>
      <Section background="blue">
        <TimerList className={styles.col}>
          <TimerListItem title={`Current: ${currentTicket.name}`}>
            <li data-wide={isClient ? undefined : true}>
              <b>Since:</b> <DisplayDate time={currentTicket.start} />
            </li>
            {isClient && (
              <li>
                <b>Next in:</b> <DisplayDelta time={nextTicketTime} />
              </li>
            )}
            <li data-wide>
              Tickets Available: {getTicketDelta(currentTicket)}
              {isClient &&
                ` (${getTicketDelta(currentTicket, currentTime)} left)`}
            </li>
            <TimerListEntities>
              {currentTicket.items.map(id => (
                <BorderedItemIcon key={id} itemId={id} {...items[id]} />
              ))}
            </TimerListEntities>
            {!currentTicket.na && (
              <li data-wide className={styles.small}>
                Item Data based on JP Version
              </li>
            )}
          </TimerListItem>
          {nextTicket && (
            <TimerListItem title={`Next: ${nextTicket.name}`}>
              <li data-wide={isClient ? undefined : true}>
                <b>Starting:</b> <DisplayDate time={nextTicket.start} />
              </li>
              {isClient && (
                <li>
                  <b>In:</b> <DisplayDelta time={nextTicket.start} />
                </li>
              )}
              <li data-wide>Tickets Available: {getTicketDelta(nextTicket)}</li>
              <TimerListEntities>
                {nextTicket.items.map(id => (
                  <BorderedItemIcon key={id} itemId={id} {...items[id]} />
                ))}
              </TimerListEntities>
              {!nextTicket.na && (
                <li data-wide className={styles.small}>
                  Item Data based on JP Version
                </li>
              )}
            </TimerListItem>
          )}
        </TimerList>
      </Section>
      <Headline>Tickets by Year</Headline>
      <nav className={styles.nav}>
        {yearsArr.map(year => (
          <LinkButton
            key={year}
            href={`/exchange-tickets/${year}`}
            className={[year == years.current && styles.current]}>
            {year}
          </LinkButton>
        ))}
      </nav>
    </>
  );
}