import { ItemType } from "@atlasacademy/api-connector/dist/Schema/Item.js";
import spacetime from "spacetime";
import { getNiceItemsFull } from "~/atlas-api/cache/data/niceItem";
import { LoginTicketsFile } from "~/static/exchangeTickets";
import { msToSeconds } from "~/time/msToSeconds";
import { Global } from "~/types/enum";
import type { BundledExchangeTicket } from "~/items/types";
import { PrebuildBundler } from "../utils/bundlers";

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

const ExchangeTicketsBundler = new PrebuildBundler({
  name: "Exchange Tickets",
  outputFile: LoginTicketsFile,
  bundle: async () => {
    const [niceItem, niceItemNA] = await Promise.all([
      getNiceItemsFull(),
      getNiceItemsFull("NA")
    ]);
    const items = new Set<number>();
    const tickets = new Array<BundledExchangeTicket>();
    let i = 9999;
    let item: ReturnType<(typeof niceItem)["find"]>;

    while ((i++, (item = niceItem.find(item => item.id == i)))) {
      if (item.type !== ItemType.ITEM_SELECT || item.itemSelects.length < 1) {
        break;
      }
      const dates = getTicketDatesFromName(item.name);
      if (!dates) break;
      const [start, next] = dates;
      const name = `Exchange Ticket (${spacetime(start * 1000, Global.UTC_TZ)
        .format("{month-short} {year}")
        .toUpperCase()})`;
      const itemNA = niceItemNA.find(item => item.id == i);
      const itemSelects =
        itemNA && itemNA.itemSelects.length > 0
          ? itemNA.itemSelects
          : item.itemSelects;
      const ticketItems = itemSelects.map(select => select.gifts[0].objectId);

      const ticket: BundledExchangeTicket = {
        name,
        start,
        next,
        items: ticketItems
      };

      // check for NA ticket
      if (itemSelects == itemNA?.itemSelects) ticket.na = true;

      // add items to set
      ticketItems.forEach(id => items.add(id));

      // add to data collection
      tickets.push(ticket);
    }

    return { data: tickets, size: tickets.length, ids: { items } };
  }
});

export const bundleExchangeTickets = ExchangeTicketsBundler.processBundle.bind(
  ExchangeTicketsBundler
);
