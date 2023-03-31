import { ItemType } from "@atlasacademy/api-connector/dist/Schema/Item.js";
import spacetime from "spacetime";
import { atlasCache } from "../atlas-api/cache";
import type { BundledLoginTicket } from "../items/types";
import { Log } from "../utils/log";
import { msToSeconds } from "../time/msToSeconds";
import type { PrebuildBundler } from "./bundlers";

const ticketNameReg = /Exchange Ticket \((?<month>[A-Z]{3}) (?<year>\d{4})\)/;
// prettier-ignore
const monthNameMap: ReadonlyArray<null|string> = [null, "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const ticketNameRegJP = /(?<month>\d{1,2})月交換券\((?<year>\d{4})\)/;

/**
 * Matches Exchange Ticket date from JP item name. Two Years will be added to the match result.
 * @param name JP Ticket Item Name
 * @returns false or tuple of start date as well as start next of next ticket
 */
function getTicketDatesFromName(name: string): [number, number] | false {
  let match: RegExpMatchArray | null;

  if ((match = name.match(ticketNameReg))) {
    const monthNum = monthNameMap.indexOf(match.groups!.month);
    if (monthNum < 1) return false;
    const month = monthNum.toString().padStart(2, "0");
    const { year } = match.groups!;
    const start = spacetime(`${year}/${month}/01`, "etc/UTC")
      .add(2, "years")
      .startOf("day")
      .time("4:00", true);
    const end = start.next("month").startOf("day").time("4:00", true);

    return [msToSeconds(start.epoch), msToSeconds(end.epoch)];
  }

  if ((match = name.match(ticketNameRegJP))) {
    const month = match.groups!.month.padStart(2, "0");
    const { year } = match.groups!;
    const start = spacetime(`${year}/${month}/01`, "etc/UTC")
      .add(2, "years")
      .startOf("day")
      .time("4:00", true);
    const end = start.next("month").startOf("day").time("4:00", true);

    return [msToSeconds(start.epoch), msToSeconds(end.epoch)];
  }

  return false;
}

export const bundleLoginTickets: PrebuildBundler<
  BundledLoginTicket[]
> = async () => {
  const [niceItem, niceItemNA] = await Promise.all([
    atlasCache.JP.getNiceItem(),
    atlasCache.NA.getNiceItem()
  ]);
  const items = new Set<number>();
  const tickets = new Array<BundledLoginTicket>();
  let i = 9999;
  let item: ReturnType<(typeof niceItem)["find"]>;

  while ((i++, (item = niceItem.find(item => item.id == i)))) {
    if (item.type !== ItemType.ITEM_SELECT || item.itemSelects.length < 1) {
      break;
    }
    const dates = getTicketDatesFromName(item.name);
    if (!dates) break;
    const itemNA = niceItemNA.find(item => item.id == i);
    const ticketItems = (itemNA || item).itemSelects.map(
      select => select.gifts[0].objectId
    );

    const ticket: BundledLoginTicket = {
      start: dates[0],
      next: dates[1],
      items: ticketItems
    };

    // check for NA ticket
    if (itemNA) ticket.na = true;

    // add items to set
    ticketItems.forEach(id => items.add(id));

    // add to data collection
    tickets.push(ticket);
  }

  Log.info(`Mapped data for ${tickets.length} Login Exchange Tickets`);
  return {
    name: "Login Tickets",
    path: "login_tickets.json",
    data: tickets,
    items: Array.from(items)
  };
};
