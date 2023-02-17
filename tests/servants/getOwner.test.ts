import type { Servant } from "@atlasacademy/api-connector/dist/Schema/Servant";
import { atlasCacheNA } from "src/atlas-api/cache";
import { getNPOwner, getSkillOwners } from "src/servants/getOwner";

let servants: Servant[];

beforeAll(async () => {
  const niceServant = await atlasCacheNA.getNiceServant();
  const res = [
    niceServant.find(servant => servant.id === 103000), // 0 - Suzuka Gozen
    niceServant.find(servant => servant.id == 200100) // 1 - Emiya Archer - tested for typechanged NP
  ];
  if (res.some(servant => !servant)) throw new Error("Invalid test data");
  servants = res as Servant[];
});

describe("getOwner", () => {
  it("finds owners of Skill", async () => {
    const [suzuka, emiya] = servants;
    expect(getSkillOwners(suzuka.skills[0], "NA")).resolves.toEqual([suzuka]);
    const mindsEyeTrueOwners = await getSkillOwners(
      emiya.skills.find(skill => skill.id == 37450)!
    );
    expect(mindsEyeTrueOwners.length).toBeGreaterThanOrEqual(3);
  });
  it("finds owner of NP", () => {
    const [suzuka] = servants;
    expect(getNPOwner(suzuka.noblePhantasms[0], "NA")).resolves.toEqual(suzuka);
  });
});
