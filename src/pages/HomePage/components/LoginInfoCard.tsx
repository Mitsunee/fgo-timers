import Link from "next/link";
import { useIsClient } from "src/client/utils/hooks/useIsClient";
import {
  Card,
  TimerList,
  TimerListEntities,
  TimerListItem
} from "src/client/components/Card";
import { DisplayDate, DisplayDelta } from "src/client/components/TimeDisplay";
import { BorderedItemIcon } from "src/client/components/BorderedIcon";
import { useRecurringDaily } from "src/client/utils/hooks/useRecurringDaily";
import type { BundledLoginTicket } from "src/items/types";
import type { HomePageProps } from "../static";

interface LoginInfoCardProps {
  milestones: HomePageProps["milestones"];
  ticket: BundledLoginTicket;
}

type ExchangeTicketsInfoProps = Pick<LoginInfoCardProps, "ticket"> & {
  isClient: boolean;
};

type LoginInfoProps = Pick<LoginInfoCardProps, "milestones"> & {
  isClient: boolean;
};

function ExchangeTicketsInfo({ ticket, isClient }: ExchangeTicketsInfoProps) {
  return (
    <TimerListItem title="Login Exchange Ticket">
      <TimerListEntities title={ticket.name}>
        {ticket.items.map(id => (
          <BorderedItemIcon key={id} itemId={id} />
        ))}
      </TimerListEntities>
      <li data-wide={isClient ? undefined : true}>
        <b>Next Ticket:</b> <DisplayDate time={ticket.next} />
      </li>
      {isClient && (
        <li>
          <b>Next in:</b> <DisplayDelta time={ticket.next} />
        </li>
      )}
      <li data-wide>
        See{" "}
        <Link href="/exchange-tickets/" style={{ textDecoration: "underline" }}>
          Exchange Tickets
        </Link>{" "}
        for more information
      </li>
    </TimerListItem>
  );
}

function LoginInfo({ milestones, isClient }: LoginInfoProps) {
  const nextLogin = useRecurringDaily(4);

  return (
    <TimerListItem>
      {isClient ? (
        <>
          <li>
            <b>Next Login Reset:</b> <DisplayDate time={nextLogin} />
          </li>
          <li>
            <b>In:</b> <DisplayDelta time={nextLogin} />
          </li>
        </>
      ) : (
        <li data-wide>
          <b>Last Updated:</b>{" "}
          <DisplayDate time={milestones.updatedAt} format="full" />
        </li>
      )}
      <li data-wide={isClient ? undefined : true}>
        <b>Server Day {milestones.nextServerDay}:</b>{" "}
        <DisplayDate time={milestones.nextServerTime} />
      </li>
      {isClient && (
        <li>
          <b>In:</b> <DisplayDelta time={milestones.nextServerTime} />
        </li>
      )}
    </TimerListItem>
  );
}

export function LoginInfoCard({ ticket, milestones }: LoginInfoCardProps) {
  const isClient = useIsClient();

  return (
    <Card
      title="Login & Milestones"
      icon="https://static.atlasacademy.io/NA/Items/10000.png"
      style={{ "--border": "var(--light)", "--bg": "white" }}>
      <TimerList>
        <ExchangeTicketsInfo ticket={ticket} isClient={isClient} />
        <LoginInfo milestones={milestones} isClient={isClient} />
      </TimerList>
    </Card>
  );
}
