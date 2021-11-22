import { computed } from "nanostores";
import { persistentMap } from "@nanostores/persistent";

/*
 * This store uses persistence which requires all values to be string.
 * A derived store that converts types automatically is provided.
 */

// main store [key] => string
export const settingsMap = persistentMap("fgoTools:", {
  alternativeClockFormat: "false", // use 12h AM/PM time format instead of 24h format
  showServerTimes: "false", // show server times instead of local time
  userMaxAP: "142",
  userNodeCost: "40",
  userMaxCost: "113",
  perPage: "10"
});

export const settingsStore = computed(settingsMap, store => ({
  alternativeClockFormat: store.alternativeClockFormat === "true",
  showServerTimes: store.showServerTimes === "true",
  userMaxAP: Number(store.userMaxAP),
  userNodeCost: Number(store.userNodeCost),
  userMaxCost: Number(store.userMaxCost),
  perPage: Number(store.perPage)
}));

export const setSetting = (key, value) => {
  settingsMap.setKey(key, `${value}`);
};
