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
};

export const settingsMap = persistentMap<SettingsStored>("fgoTools:", {
  alternativeClockFormat: "false", // use 12h AM/PM time format instead of 24h format
  showServerTimes: "false", // show server times instead of local time
  userMaxAP: "142",
  userNodeCost: "40",
  userMaxCost: "113",
  perPage: "10",
  showSpoiler: SpoilerLevels.SOME
});

export const settingsStore = computed(settingsMap, store => ({
  alternativeClockFormat: store.alternativeClockFormat === "true",
  showServerTimes: store.showServerTimes === "true",
  userMaxAP: Number(store.userMaxAP),
  userNodeCost: Number(store.userNodeCost),
  userMaxCost: Number(store.userMaxCost),
  perPage: Number(store.perPage) as PageSize,
  showSpoiler: store.showSpoiler
}));

// WIP: Phase out setSetting in favour of properly typed actions
export const setSetting = (key: keyof SettingsStored, value: any) => {
  settingsMap.setKey(key, `${value}`);
};

export const setSpoilerLevel = action(
  settingsMap,
  "Set Spoiler Level",
  (store, value: SpoilerLevelSelectable) => {
    store.setKey("showSpoiler", value);
  }
);
