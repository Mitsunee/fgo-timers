import type { Quest } from "@atlasacademy/api-connector/dist/Schema/Quest";
import { UpgradeQuestType } from "src/types/upgrades";
import { getQuestData } from "src/upgrades/getQuestData";
import { parseQuestType } from "src/upgrades/parseQuestType";

let quests: Quest[];

beforeAll(async () => {
  const res = await Promise.all([
    getQuestData(91103002, "NA"), // 0 - Interlude
    getQuestData(94051272, "NA"), // 1 - Rank Up
    getQuestData(1000011, "NA"), // 2 - Main Quest
    getQuestData(94041930, "NA"), // 3 - unrelated Event Quest
    getQuestData(93030601, "NA") // 4 - Free Quest
  ]);
  if (res.some(quest => !quest)) throw new Error("Invalid test data");
  quests = res as Quest[];
});

describe("parseQuestType", () => {
  it("maps Interludes", () => {
    expect(parseQuestType(quests[0])).toBe(UpgradeQuestType.INTERLUDE);
  });
  it("maps Rank Up Quests", () => {
    expect(parseQuestType(quests[1])).toBe(UpgradeQuestType.RANKUP);
  });
  it("maps Main Quests", () => {
    expect(parseQuestType(quests[2])).toBe(UpgradeQuestType.MAIN);
  });
  it("maps other Quests as unknown", () => {
    expect(parseQuestType(quests[3])).toBe(UpgradeQuestType.UNKNOWN);
    expect(parseQuestType(quests[4])).toBe(UpgradeQuestType.UNKNOWN);
  });
});
