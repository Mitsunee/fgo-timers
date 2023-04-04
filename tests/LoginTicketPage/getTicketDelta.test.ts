import type { BundledLoginTicket } from "src/items/types";
import { getTicketDelta } from "src/pages/LoginTicketsPage/getTicketDelta";

const mockTicket: BundledLoginTicket = {
  name: "Exchange Ticket (APR 2023)",
  start: 1680321600,
  next: 1682913600,
  items: [6545, 6510, 6516],
  na: true
};
const mockTicketExpectedTotal = 30;
const mockNow = 1680603975;
const mockNowExpectedLeft = 26;
const mockTicket2: BundledLoginTicket = {
  name: "Exchange Ticket (MAY 2023)",
  start: 1682913600,
  next: 1685592000,
  items: [6535, 6514, 6522]
};
const mockTicket2ExpectedTotal = 31;

describe("getTicketDelta", () => {
  it("gets correct total ticket value", () => {
    expect(getTicketDelta(mockTicket)).toBe(mockTicketExpectedTotal);
    expect(getTicketDelta(mockTicket2)).toBe(mockTicket2ExpectedTotal);
  });
  it("gets correct diff", () => {
    expect(getTicketDelta(mockTicket, mockNow)).toBe(mockNowExpectedLeft);
  });
  it("doesn't give too high value for case now < ticket.start", () => {
    expect(getTicketDelta(mockTicket2, mockTicket.start)).toBe(
      mockTicket2ExpectedTotal
    );
  });
  it("doesn't give value under 0 for case now > ticket.end", () => {
    expect(getTicketDelta(mockTicket, mockTicket2.next)).toBe(0);
  });
});
