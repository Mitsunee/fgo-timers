import type { Quest } from "@atlasacademy/api-connector/dist/Schema/Quest";
import { getNiceQuest } from "~/atlas-api/cache/data/niceWar";
import { parseUnlockCond } from "~/upgrades/parseUnlockCond";

let quests: Quest[];

beforeAll(async () => {
  const res = await Promise.all([
    getNiceQuest(91103002, "NA"), // Interlude 'I Think of Ears, Therefore I Have Ears' (has all props)
    getNiceQuest(94014411, "NA") // Rank Up Quest 'Mysterious Heroine X' (has no bond or quest requirement)
  ]);
  if (res.some(quest => !quest)) throw new Error("Invalid test data");
  quests = res as Quest[];
});

describe("parseUnlockCond", () => {
  it("parses Unlock conditions", () => {
    const unlock = parseUnlockCond(quests[0]);
    expect(typeof unlock.bond).toBe("number");
    expect(unlock.bond).toBeGreaterThan(0);
    expect(typeof unlock.asc).toBe("number");
    expect(unlock.asc).toBeGreaterThan(0);
    expect(Array.isArray(unlock.quests)).toBeTruthy();
    unlock.quests!.forEach(quest => expect(typeof quest).toBe("number"));
  });
  it("skips not needed properties", () => {
    const unlock = parseUnlockCond(quests[1]);
    expect(unlock.quests).not.toBeDefined();
    expect(unlock.bond).not.toBeDefined();
    expect(unlock.asc).toBe(4);
  });
});
