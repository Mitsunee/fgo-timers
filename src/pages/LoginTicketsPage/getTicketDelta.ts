import spacetime from "spacetime";
import { clamp } from "@foxkit/util/clamp";
import { Global, GlobalNums } from "src/types/enum";
import type { BundledLoginTicket } from "src/items/types";

export function getTicketDelta(ticket: BundledLoginTicket, now?: number) {
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
