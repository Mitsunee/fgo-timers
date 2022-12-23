import { computed, action } from "nanostores";
import { persistentMap } from "@nanostores/persistent";
import { SpoilerLevels } from "src/types/enum";

/*
 * This store uses persistence which requires all values to be string.
 * A derived store that converts types automatically is provided.
 */

type PageSize = 10 | 25 | 50 | 100;
type SpoilerLevelSelectable = Exclude<SpoilerLevels, SpoilerLevels.PRERENDER>;

type SettingsStored = {
  alternativeClockFormat: `${boolean}`;
  showServerTimes: `${boolean}`;
  userMaxAP: `${number}`;
  userNodeCost: `${number}`;
  userMaxCost: `${number}`;
  perPage: `${PageSize}`;
  showSpoiler: SpoilerLevelSelectable;
  autoInfiniteScroll: `${boolean}`;
};

export const settingsMap = persistentMap<SettingsStored>("fgoTools:", {
  alternativeClockFormat: "false", // use 12h AM/PM time format instead of 24h format
  showServerTimes: "false", // show server times instead of local time
  userMaxAP: "142",
  userNodeCost: "40",
  userMaxCost: "113",
  perPage: "10",
  showSpoiler: SpoilerLevels.SOME,
  autoInfiniteScroll: "false"
});

export const settingsStore = computed(settingsMap, store => ({
  alternativeClockFormat: store.alternativeClockFormat === "true",
  showServerTimes: store.showServerTimes === "true",
  userMaxAP: Number(store.userMaxAP),
  userNodeCost: Number(store.userNodeCost),
  userMaxCost: Number(store.userMaxCost),
  perPage: Number(store.perPage) as PageSize,
  showSpoiler: store.showSpoiler,
  autoInfiniteScroll: store.autoInfiniteScroll === "true"
}));

export const toggleClockFormat = action(
  settingsMap,
  "Toggle alternativeClockFormat",
  (store, state?: boolean) => {
    const { alternativeClockFormat: oldStateStr } = store.get();
    const oldState = oldStateStr === "true";
    store.setKey("alternativeClockFormat", `${state ?? !oldState}`);
  }
);

export const toggleServerTimes = action(
  settingsMap,
  "Toggle showServerTimes",
  (store, state?: boolean) => {
    const { showServerTimes: oldStateStr } = store.get();
    const oldState = oldStateStr === "true";
    store.setKey("showServerTimes", `${state ?? !oldState}`);
  }
);

export const setUserMaxAP = action(
  settingsMap,
  "Set user max AP",
  (store, value: number) => {
    store.setKey("userMaxAP", `${value}`);
  }
);

export const setUserNodeCost = action(
  settingsMap,
  "Set user node cost",
  (store, value: number) => {
    store.setKey("userNodeCost", `${value}`);
  }
);

export const setUserMaxCost = action(
  settingsMap,
  "Set user max cost",
  (store, value: number) => {
    store.setKey("userMaxCost", `${value}`);
  }
);

export const setPageSize = action(
  settingsMap,
  "Set Page size",
  (store, value: PageSize) => {
    store.setKey("perPage", `${value}`);
  }
);

export const setSpoilerLevel = action(
  settingsMap,
  "Set Spoiler Level",
  (store, value: SpoilerLevelSelectable) => {
    store.setKey("showSpoiler", value);
  }
);

export const toggleInfiniteScrollMode = action(
  settingsMap,
  "Toggle automatic Infinite Scroll",
  (store, state?: boolean) => {
    const { autoInfiniteScroll: oldStateStr } = store.get();
    const oldState = oldStateStr === "true";
    store.setKey("autoInfiniteScroll", `${state ?? !oldState}`);
  }
);
