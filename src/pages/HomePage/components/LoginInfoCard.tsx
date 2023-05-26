import Link from "next/link";
import {
  Card,
  TimerList,
  TimerListEntities,
  TimerListItem
} from "~/client/components/Card";
import { BorderedItemIcon } from "~/components/BorderedIcon";
import { DisplayDate, DisplayDelta } from "~/components/TimeDisplay";
import { useIsClient } from "~/hooks/useIsClient";
import { useRecurringDaily } from "~/hooks/useRecurringDaily";
import type { BundledLoginTicket } from "~/items/types";
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
        See <Link href="/exchange-tickets/">Exchange Tickets</Link> for more
        information
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
      id="logins-and-milestones"
      style={{ "--border": "var(--light)", "--bg": "white" }}>
      <TimerList>
        <ExchangeTicketsInfo ticket={ticket} isClient={isClient} />
        <LoginInfo milestones={milestones} isClient={isClient} />
      </TimerList>
    </Card>
  );
}
