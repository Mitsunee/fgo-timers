import { useMemo } from "react";
import { BorderedItemIcon } from "src/client/components/BorderedIcon";
import { LinkButton } from "src/client/components/Button";
import {
  TimerList,
  TimerListEntities,
  TimerListItem
} from "src/client/components/Card";
import Headline from "src/client/components/Headline";
import Meta from "src/client/components/Meta";
import Section from "src/client/components/Section";
import { DisplayDate, DisplayDelta } from "src/client/components/TimeDisplay";
import { DataContext } from "src/client/contexts";
import { useCurrentTime } from "src/client/utils/hooks/useCurrentTime";
import { useIsClient } from "src/client/utils/hooks/useIsClient";
import { useRecurringDaily } from "src/client/utils/hooks/useRecurringDaily";
import { getTicketDelta } from "src/pages/LoginTicketsPage/getTicketDelta";
import type { LoginTicketsPageProps } from "src/pages/LoginTicketsPage/static/LoginTicketsPage";
import styles from "src/pages/LoginTicketsPage/LoginTicketsPage.module.css";

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
        title="Exchange Tickets"
        description="Information on monthly Exchange Tickets for Fate/Grand Order Global Version"
      />
      <Headline>Exchange Tickets</Headline>
      <Section background="black">
        <p>
          Exchange Tickets are available through login bonuses. The available
          items change each month. This page uses item data from the JP version
          to estimate future tickets the Global version may get, but these are
          subject to change since the (early) introduction of Append Skills and
          Pure Prisms.
        </p>
        <p>
          <b>Note:</b> Starting with 7th Anniversary Exchange Tickets are also
          available through Daily Quests (for a total of 4 Tickets a day). It is
          not yet clear how this will done on the Global version since our
          Anniversary happens earlier.
        </p>
      </Section>
      <DataContext items={items}>
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
                  <BorderedItemIcon key={id} itemId={id} />
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
                <li data-wide>
                  Tickets Available: {getTicketDelta(nextTicket)}
                </li>
                <TimerListEntities>
                  {nextTicket.items.map(id => (
                    <BorderedItemIcon key={id} itemId={id} />
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
      </DataContext>
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
