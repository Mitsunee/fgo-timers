import { BorderedItemIcon } from "src/client/components/BorderedIcon";
import { ActionButton, LinkButton } from "src/client/components/Button";
import {
  Card,
  CardGrid,
  TimerList,
  TimerListEntities,
  TimerListItem
} from "src/client/components/Card";
import { IconArrow } from "src/client/components/icons";
import Meta from "src/client/components/Meta";
import Section from "src/client/components/Section";
import { DisplayDate, DisplayDelta } from "src/client/components/TimeDisplay";
import { DataContext } from "src/client/contexts";
import { useCurrentTime } from "src/client/utils/hooks/useCurrentTime";
import { useIsClient } from "src/client/utils/hooks/useIsClient";
import { useRecurringDaily } from "src/client/utils/hooks/useRecurringDaily";
import { getTicketDelta } from "src/pages/LoginTicketsPage/getTicketDelta";
import { Borders } from "src/types/borders";
import type { LoginTicketYearPageProps } from "src/pages/LoginTicketsPage/static/LoginTicketYearPage";
import styles from "src/pages/LoginTicketsPage/LoginTicketYearPage.module.css";

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
  const hasDailyMissionsNote = year >= 2024;
  const hasNotesSection = hasFutureTickets || hasDailyMissionsNote;

  return (
    <>
      <Meta
        title={`Exchange Tickets ${year}`}
        description={`All monthly Exchange Tickets in ${year} for Fate/Grand Order Global Version`}
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
          const cardId = ticket.name
            .slice(ticket.name.indexOf("(") + 1, ticket.name.indexOf(")"))
            .replace(" ", "-")
            .toLowerCase();

          return (
            <Card
              key={ticket.start}
              title={ticket.name}
              icon="https://static.atlasacademy.io/NA/Items/10000.png"
              color={color}
              id={cardId}>
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
                  <DataContext items={items}>
                    <TimerListEntities>
                      {ticket.items.map(id => (
                        <BorderedItemIcon key={id} itemId={id} />
                      ))}
                    </TimerListEntities>
                  </DataContext>
                </TimerListItem>
              </TimerList>
            </Card>
          );
        })}
      </CardGrid>
      {hasNotesSection && (
        <Section background="black">
          {hasFutureTickets && (
            <p>
              <b>Note:</b> Some of the tickets displayed on this page are
              estimates based on which items the JP version of FGO had. Since
              the (early) introduction of Append Skills and Pure Prisms these
              items are subject to change. They are usually announced ingame a
              few days before starting.
            </p>
          )}
          {hasDailyMissionsNote && (
            <p>
              <b>Note:</b> Starting with 7th Anniversary Exchange Tickets are
              also available through Daily Quests (for a total of 4 Tickets a
              day). It is not yet clear how this will done on the Global version
              since our Anniversary happens earlier.
            </p>
          )}
        </Section>
      )}
    </>
  );
}
