import { useIsClient } from "src/client/utils/hooks/useIsClient";
import { useCurrentTime } from "src/client/utils/hooks/useCurrentTime";
import { useRecurringDaily } from "src/client/utils/hooks/useRecurringDaily";
import Meta from "src/client/components/Meta";
import { ActionButton, LinkButton } from "src/client/components/Button";
import { IconArrow } from "src/client/components/icons";
import {
  Card,
  CardGrid,
  TimerList,
  TimerListEntities,
  TimerListItem
} from "src/client/components/Card";
import { Borders } from "src/types/borders";
import styles from "src/pages/LoginTicketsPage/LoginTicketYearPage.module.css";
import type { LoginTicketYearPageProps } from "src/pages/LoginTicketsPage/static/LoginTicketYearPage";
import { DisplayDate, DisplayDelta } from "@components/TimeDisplay";
import { BorderedItemIcon } from "@components/BorderedIcon";
import Section from "@components/Section";
import { getTicketDelta } from "src/pages/LoginTicketsPage/getTicketDelta";

// Next page config
export {
  getStaticPaths,
  getStaticProps
} from "src/pages/LoginTicketsPage/static/LoginTicketYearPage";

export default function LoginTicketYearPage({
  tickets,
  items,
  year,
  prev,
  next
}: LoginTicketYearPageProps) {
  const isClient = useIsClient();
  const { current } = useCurrentTime();
  const nextTicketTime = useRecurringDaily(4);
  const prevYear = year - 1;
  const nextYear = year + 1;
  const hasFutureTickets = tickets.some(ticket => !ticket.na);

  return (
    <>
      <Meta
        title={`Login Exchange Tickets ${year}`}
        description={`All Login Exchange Tickets in ${year} for Fate/Grand Order Global Version`}
      />
      <nav className={styles.nav}>
        {prev ? (
          <LinkButton
            icon={IconArrow}
            href={`/exchange-tickets/${prevYear}`}
            className={styles.left}
          />
        ) : (
          <ActionButton icon={IconArrow} className={styles.left} disabled />
        )}
        <h1>{year}</h1>
        {next ? (
          <LinkButton
            icon={IconArrow}
            href={`/exchange-tickets/${nextYear}`}
            className={styles.right}
          />
        ) : (
          <ActionButton icon={IconArrow} className={styles.right} disabled />
        )}
      </nav>
      <CardGrid className={styles.grid}>
        {tickets.map(ticket => {
          const isUpcoming = isClient && current < ticket.start;
          const hasStarted = isClient && current >= ticket.start;
          const isOngoing = hasStarted && current < ticket.next;
          const isWide = isUpcoming || isOngoing;
          const color = isOngoing ? Borders.GOLD : Borders.BLUE;

          return (
            <Card
              key={ticket.start}
              title={ticket.name}
              icon="https://static.atlasacademy.io/NA/Items/10000.png"
              color={color}>
              <TimerList>
                <TimerListItem>
                  <li data-wide={isWide ? undefined : true}>
                    <b>Start{hasStarted ? "ed" : "s"}:</b>{" "}
                    <DisplayDate time={ticket.start} />
                  </li>
                  {isUpcoming && (
                    <li>
                      <b>Starts in:</b> <DisplayDelta time={ticket.start} />
                    </li>
                  )}
                  {isOngoing && (
                    <li>
                      <b>Next in:</b> <DisplayDelta time={nextTicketTime} />
                    </li>
                  )}
                  <li data-wide>
                    Tickets Available: {getTicketDelta(ticket)}
                    {isOngoing && ` (${getTicketDelta(ticket, current)} left)`}
                  </li>
                </TimerListItem>
                <TimerListItem title="Available Items">
                  <TimerListEntities>
                    {ticket.items.map(id => (
                      <BorderedItemIcon key={id} itemId={id} {...items[id]} />
                    ))}
                  </TimerListEntities>
                </TimerListItem>
              </TimerList>
            </Card>
          );
        })}
      </CardGrid>
      {hasFutureTickets && (
        <Section background="black">
          <b>Note:</b> Some of the tickets displayed on this page are estimates
          based on which items the JP version of FGO had. Since the (early)
          introduction of Append Skills and Pure Prisms these items are subject
          to change. They are usually announced ingame a few days before
          starting.
        </Section>
      )}
    </>
  );
}