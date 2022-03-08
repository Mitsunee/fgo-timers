import { test } from "uvu";
import { ok, not, is } from "uvu/assert";
import { resolvePath } from "@foxkit/node-util/path";
import {
  isEventFile,
  isTicketFile,
  isShopFile,
  isDataFile,
  getDataFileType
} from "../../src/scripts/utils/data-assets/isDataFile.mjs";

test("isEventFile - reject bad paths", () => {
  not(isEventFile("/outside-project/assets/data/events/test-event.yml"));
  not(isEventFile(resolvePath("assets/data/wrong-dir/test-event.yml")));
  not(isEventFile(resolvePath("assets/data/events/bad_filename.yml")));
});

test("isEventFile - allow correct paths", () => {
  ok(isEventFile(resolvePath("assets/data/events/testevent.yml")));
  ok(isEventFile(resolvePath("assets/data/events/test-event.yml")));
  ok(isEventFile(resolvePath("assets/data/events/test-event-2.yml")));
});

test("isTicketFile - reject bad paths", () => {
  not(isTicketFile("/outside-project/assets/data/login-tickets/2022.yml"));
  not(isTicketFile(resolvePath("assets/data/wrong-dir/2022.yml")));
  not(isTicketFile(resolvePath("assets/data/login-tickets/NaN.yml")));
});

test("isTicketFile - allow correct paths", () => {
  ok(isTicketFile(resolvePath("assets/data/login-tickets/2019.yml")));
  ok(isTicketFile(resolvePath("assets/data/login-tickets/2022.yml")));
});

test("isShopFile - reject bad paths", () => {
  not(isShopFile("/outside-project/assets/data/manaPrismShop.yml"));
  not(isShopFile(resolvePath("assets/data/somefile.yml")));
  not(isShopFile(resolvePath("assets/data/wrong-dir/manaPrismShop.yml")));
});

test("isShopFile - allow correct paths", () => {
  ok(isShopFile(resolvePath("assets/data/manaPrismShop.yml")));
  ok(isShopFile(resolvePath("assets/data/rarePrismShop.yml")));
});

test("isDataFile - reject bad paths", () => {
  not(isDataFile("/outside-project/assets/data/manaPrismShop.yml"));
  not(isDataFile(resolvePath("assets/data/wrong-dir/test-event.yml")));
  not(isDataFile(resolvePath("assets/data/events/bad_filename.yml")));
  not(isDataFile(resolvePath("assets/data/wrong-dir/2022.yml")));
  not(isDataFile(resolvePath("assets/data/login-tickets/NaN.yml")));
  not(isDataFile(resolvePath("assets/data/somefile.yml")));
});

test("isDataFile - allow correct paths", () => {
  ok(isDataFile(resolvePath("assets/data/events/testevent.yml")));
  ok(isDataFile(resolvePath("assets/data/events/test-event.yml")));
  ok(isDataFile(resolvePath("assets/data/events/test-event-2.yml")));
  ok(isDataFile(resolvePath("assets/data/login-tickets/2019.yml")));
  ok(isDataFile(resolvePath("assets/data/login-tickets/2022.yml")));
  ok(isDataFile(resolvePath("assets/data/manaPrismShop.yml")));
  ok(isDataFile(resolvePath("assets/data/rarePrismShop.yml")));
});

test("getDataFileType", () => {
  is(getDataFileType(resolvePath("assets/data/events/testevent.yml")), "event");
  is(
    getDataFileType(resolvePath("assets/data/events/test-event.yml")),
    "event"
  );
  is(
    getDataFileType(resolvePath("assets/data/events/test-event-2.yml")),
    "event"
  );
  is(
    getDataFileType(resolvePath("assets/data/login-tickets/2019.yml")),
    "ticketFile"
  );
  is(
    getDataFileType(resolvePath("assets/data/login-tickets/2022.yml")),
    "ticketFile"
  );
  is(getDataFileType(resolvePath("assets/data/manaPrismShop.yml")), "shopFile");
  is(getDataFileType(resolvePath("assets/data/rarePrismShop.yml")), "shopFile");
  not(getDataFileType(resolvePath("assets/data/somefile.yml")));
});

test.run();
