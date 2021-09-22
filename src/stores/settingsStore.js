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
  userNodeCost: "40",
  userMaxCost: "113"
});

export const settingsStore = createDerived(settingsMap, store => ({
  alternativeClockFormat: store.alternativeClockFormat === "true",
  showServerTimes: store.showServerTimes === "true",
  userMaxAP: Number(store.userMaxAP),
  userNodeCost: Number(store.userNodeCost),
  userMaxCost: Number(store.userMaxCost)
}));

export const setAlternativeClockFormat = value => {
  settingsMap.setKey("alternativeClockFormat", value ? "true" : "false");
};

export const setShowServerTimes = value => {
  settingsMap.setKey("showServerTimes", value ? "true" : "false");
};

export const setUserKey = (key, value) => {
  settingsMap.setKey(key, `${value}`);
};
