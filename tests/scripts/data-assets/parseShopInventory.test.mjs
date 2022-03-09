import { test } from "uvu";
import { equal, throws } from "uvu/assert";
import { parseDate } from "../../../src/scripts/utils/data-assets/parseDate.mjs";
import { parseShopInventory } from "../../../src/scripts/utils/data-assets/parsers/shopFile/parseShopInventory.mjs";

test("can parse regular shop", () => {
  equal(
    parseShopInventory([
      {
        name: "Test 1",
        icon: "https://static.atlasacademy.io/some-icon-1",
        background: "a-color-1",
        cost: 500,
        amount: 5
      },
      {
        name: "Test 2",
        icon: "https://static.atlasacademy.io/some-icon-2",
        background: "a-color-2",
        cost: 100,
        amount: 10,
        stack: 5
      }
    ]),
    [
      {
        name: "Test 1",
        icon: "some-icon-1",
        background: "a-color-1",
        cost: 500,
        amount: 5
      },
      {
        name: "Test 2",
        icon: "some-icon-2",
        background: "a-color-2",
        cost: 100,
        amount: 10,
        stack: 5
      }
    ]
  );
});

test("can parse limitedInventory", () => {
  equal(
    parseShopInventory(
      [
        {
          name: "Test 3",
          icon: "https://static.atlasacademy.io/some-icon-3",
          background: "a-color-3",
          cost: 1000,
          amount: 5,
          endsAt: "2022-02-01 19:00 PST"
        }
      ],
      true
    )[0],
    {
      name: "Test 3",
      icon: "some-icon-3",
      background: "a-color-3",
      cost: 1000,
      amount: 5,
      ends: parseDate("2022-02-01 19:00 PST", { flat: true })
    }
  );
});

test("rejects with missing prop", () => {
  throws(() => {
    parseShopInventory([
      {
        name: "test",
        background: "a-color-3",
        cost: 1000,
        amount: 5
      }
    ]);
  });
});

test("rejects duration in endsAt prop", () => {
  throws(() => {
    parseShopInventory(
      [
        {
          name: "test",
          icon: "https://static.atlasacademy.io/some-icon-3",
          background: "a-color-3",
          cost: 1000,
          amount: 5,
          endsAt: "2022-03-02 18:00 - 03-02 19:00 PST"
        }
      ],
      true
    );
  });
});

test("rejects non-array", () => {
  throws(() => {
    parseShopInventory({ hello: "world" });
  });
  throws(() => {
    parseShopInventory("hello, world!");
  });
});

test.run();
