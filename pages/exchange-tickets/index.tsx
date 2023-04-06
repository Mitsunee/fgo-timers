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
import styles from "src/pages/LoginTicketsPage/LoginTicketsPage.module.css";
import { getTicketDelta } from "src/pages/LoginTicketsPage/getTicketDelta";
import type { LoginTicketsPageProps } from "src/pages/LoginTicketsPage/static/LoginTicketsPage";

// Next page configs
export { getStaticProps } from "src/pages/LoginTicketsPage/static/LoginTicketsPage";

// WIP
export default function LoginTicketsPage({
  updatedAt,
  tickets,
  current,
  next,
  items
}: LoginTicketsPageProps) {
  const isClient = useIsClient();
  const { current: currentTime } = useCurrentTime();
  const nextTicketTime = useRecurringDaily(4);
  const currentTicket = tickets[current];
  const nextTicket =
    typeof next == "number" ? next >= 0 && tickets[next] : next;

  return (
    <>
      <Meta
        title="Login Exchange Tickets"
        description="Information on Login Exchange Tickets for Fate/Grand Order Global Version"
      />
      <Headline>Login Exchange Tickets</Headline>
      <Section background>
        {/* PLACEHOLDER */}
        <b>PLACEHOLDER:</b> Thinking about putting some kind of description
        section here. Should probably explain that future items are subject to
        change and that this page automatically re-renders on 24hr intervals
        (although I might lower that frequency?). I&apos;m also not displaying
        the Exchange Ticket item icon anywhere yet. Also needed is some way to
        link to per-year sub pages.
      </Section>
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
            </TimerListItem>
          )}
        </TimerList>
      </Section>
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
