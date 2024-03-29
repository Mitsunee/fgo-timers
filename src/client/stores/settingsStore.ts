import { persistentMap } from "@nanostores/persistent";
import { action, computed } from "nanostores";
import { SpoilerLevels } from "~/types/enum";

/*
 * This store uses persistence which requires all values to be string.
 * A derived store that converts types automatically is provided.
 */

type PageSize = 10 | 25 | 50 | 100;
type SpoilerLevelSelectable = Exclude<SpoilerLevels, SpoilerLevels.PRERENDER>;
type PlayerGender = "M" | "F"; // binary :(

type SettingsStored = {
  alternativeClockFormat: `${boolean}`;
  showServerTimes: `${boolean}`;
  userMaxAP: `${number}`;
  userNodeCost: `${number}`;
  userMaxCost: `${number}`;
  perPage: `${PageSize}`;
  showSpoiler: SpoilerLevelSelectable;
  autoInfiniteScroll: `${boolean}`;
  discordMd: `${boolean}`;
  playerGender: PlayerGender;
};

export const settingsMap = persistentMap<SettingsStored>("fgoTools:", {
  alternativeClockFormat: "false", // use 12h AM/PM time format instead of 24h format
  showServerTimes: "false", // show server times instead of local time
  userMaxAP: "142",
  userNodeCost: "40",
  userMaxCost: "113",
  perPage: "10",
  showSpoiler: SpoilerLevels.SOME,
  autoInfiniteScroll: "false",
  discordMd: "true",
  playerGender: "F"
});

export const settingsStore = computed(settingsMap, store => ({
  alternativeClockFormat: store.alternativeClockFormat === "true",
  showServerTimes: store.showServerTimes === "true",
  userMaxAP: Number(store.userMaxAP),
  userNodeCost: Number(store.userNodeCost) || 3,
  userMaxCost: Number(store.userMaxCost),
  perPage: Number(store.perPage) as PageSize,
  showSpoiler: store.showSpoiler,
  autoInfiniteScroll: store.autoInfiniteScroll === "true",
  discordMd: store.discordMd === "true",
  playerGender: store.playerGender
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

export const toggleDiscordMarkdown = action(
  settingsMap,
  "Toggle new Discord Markdown Support",
  (store, state?: boolean) => {
    const { discordMd: oldStateStr } = store.get();
    const oldState = oldStateStr === "true";
    store.setKey("discordMd", `${state ?? !oldState}`);
  }
);

export const setPlayerGender = action(
  settingsMap,
  "Set Player Gender",
  (store, state: PlayerGender) => {
    store.setKey("playerGender", state);
    return;
  }
);
