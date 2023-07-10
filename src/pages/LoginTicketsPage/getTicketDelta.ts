import { clamp } from "@foxkit/util/clamp";
import spacetime from "spacetime";
import { Global, GlobalNums } from "~/types/enum";
import type { BundledExchangeTicket } from "~/items/types";

export function getTicketDelta(ticket: BundledExchangeTicket, now?: number) {
  const startTs = clamp({
    min: ticket.start,
    value: now ?? ticket.start,
    max: ticket.next
  });
  const start = spacetime(startTs * 1000, Global.UTC_TZ);
  const next = spacetime(ticket.next * 1000, Global.UTC_TZ);
  const diff = start.diff(next).days;
  const hasDailyMissions =
    startTs >= GlobalNums.EXCHANGE_TICKET_DAILY_QUEST_RELEASE;

  if (hasDailyMissions) return diff * 4;
  return diff;
}
