import { createDerived } from "nanostores";
import { createPersistentMap } from "@nanostores/persistent";

/*
 * This store uses persistence which requires all values to be string.
 * A derived store that converts types automatically is provided.
 */

// main store [key] => string
export const settingsMap = createPersistentMap("fgoTools:", {
  alternativeClockFormat: "false", // use 12h AM/PM time format instead of 24h format
  showServerTimes: "false", // show server times instead of local time
  userMaxAP: "142",
  userMaxCost: "113"
});

export const settingsStore = createDerived(settingsMap, store => ({
  alternativeClockFormat: store.alternativeClockFormat === "true",
  showServerTimes: store.showServerTimes === "true",
  userMaxAP: Number(store.userMaxAP),
  userMaxCost: Number(store.userMaxCost)
}));

export const setAlternativeClockFormat = value => {
  settingsStore.setKey("alternativeClockFormat", value ? "true" : "false");
};

export const setShowServerTimes = value => {
  settingsStore.setKey("showServerTimes", value ? "true" : "false");
};

export const setUserMaxAP = value => {
  settingsStore.setKey("userMaxAP", `${value}`);
};

export const setUserMaxCost = value => {
  settingsStore.setKey("userMaxCost", `${value}`);
};
