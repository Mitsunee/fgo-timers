import { test } from "uvu";
import { equal, throws } from "uvu/assert";
import { parseTicketMonth } from "../../../src/scripts/utils/data-assets/parseTicketMonth.mjs";

test("can parse months", () => {
  const itemIdMap = {
    $1000: 1000,
    $1001: 1001,
    $1002: 1002,
    $1003: 1003
  };
  const niceItem = [
    {
      id: 1000,
      name: "item1000",
      background: "gold",
      icon: "https://static.atlasacademy.io/item1000"
    },
    {
      id: 1001,
      name: "item1001",
      background: "gold",
      icon: "https://static.atlasacademy.io/item1001"
    },
    {
      id: 1002,
      name: "item1002",
      background: "silver",
      icon: "https://static.atlasacademy.io/item1002"
    },
    {
      id: 1003,
      name: "item1003",
      background: "bronze",
      icon: "https://static.atlasacademy.io/item1003"
    }
  ];
  equal(
    parseTicketMonth(["$1001", "$1002", "$1003"], { itemIdMap, niceItem }),
    [
      { id: 1001, name: "item1001", background: "gold", icon: "item1001" },
      { id: 1002, name: "item1002", background: "silver", icon: "item1002" },
      { id: 1003, name: "item1003", background: "bronze", icon: "item1003" }
    ]
  );
});

test("rejects when item not in map", () => {
  const itemIdMap = { $1001: 1001 };
  const niceItem = [];
  throws(() => parseTicketMonth(["bad item"], { itemIdMap, niceItem }));
});

test("reject when item not in niceItem", () => {
  const itemIdMap = { $1001: 1001 };
  const niceItem = [];
  throws(() => parseTicketMonth(["$1001"], { itemIdMap, niceItem }));
});

test.run();
