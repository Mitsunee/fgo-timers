import { EntityType } from "@atlasacademy/api-connector/dist/Schema/Entity";
import { atlasCacheJP } from "src/atlas-api/cache";

let niceItem: Awaited<ReturnType<(typeof atlasCacheJP)["getNiceItem"]>>;
let niceServant: Awaited<ReturnType<(typeof atlasCacheJP)["getNiceServant"]>>;
let niceSkills: (typeof niceServant)[number]["skills"];

beforeAll(async () => {
  niceItem = await atlasCacheJP.getNiceItem();
  niceServant = await atlasCacheJP.getNiceServant();

  niceSkills = niceServant
    .filter(servant => servant.type == EntityType.NORMAL)
    .flatMap(servant => servant.skills);
});

describe("items", () => {
  it("Item ID Range 90000 to 91999 is unused", () => {
    const usedIds = new Set(niceItem.map(item => item.id));
    for (let i = 90000; i <= 99999; i++) {
      expect(usedIds.has(i)).toBeFalsy();
    }
  });
});

describe("skills", () => {
  it("all skills have an icon", () => {
    for (const skill of niceSkills) {
      expect(skill.icon).toBeDefined();
      expect(typeof skill.icon).toBe("string");
    }
  });
  it("all skills have a num", () => {
    for (const skill of niceSkills) {
      expect(skill.num).toBeDefined();
      expect(typeof skill.num).toBe("number");
    }
  });
  it("Suzuka S2 not upgraded (used in tests)", () => {
    expect(
      niceServant
        .find(servant => servant.id == 103000)
        ?.skills.filter(skill => skill.num == 2).length
    ).toBe(1);
  });
  it("upgrade level of reused skills is consistent", () => {
    const byOccurence = niceSkills.reduce((list, skill) => {
      list[skill.id] = (list[skill.id] || 0) + 1;
      return list;
    }, {} as { [id: string]: number });
    const reused = Object.entries(byOccurence)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, n]) => n >= 2)
      .map(([id]) => +id);
    for (const id of reused) {
      const owners = niceServant.filter(servant =>
        servant.skills.some(skill => skill.id == id)
      );
      let expectedLevel: null | number = null;
      for (const owner of owners) {
        const theirVersion = owner.skills.find(skill => skill.id == id)!;
        const sameNum = owner.skills
          .filter(skill => skill.num == theirVersion.num)
          .sort((a, b) => a.id - b.id);
        const theirUpgradeLevel = sameNum.findIndex(skill => skill.id == id);
        if (expectedLevel === null) expectedLevel = theirUpgradeLevel;
        expect(theirUpgradeLevel).toBe(expectedLevel);
      }
    }
  });
});

describe("NPs", () => {
  it("NPs are not reused", () => {
    const niceNPs = niceServant
      .filter(servant => servant.type == EntityType.NORMAL)
      .flatMap(servant => servant.noblePhantasms);
    const byOccurence = niceNPs.reduce((list, np) => {
      list[np.id] = (list[np.id] || 0) + 1;
      return list;
    }, {} as { [id: string]: number });
    const reused = Object.entries(byOccurence)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, n]) => n >= 2).length;
    expect(reused).toBeLessThan(1);
  });
});
