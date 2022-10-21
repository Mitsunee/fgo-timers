import { Servant } from "@atlasacademy/api-connector/dist/Schema/Servant";
import { atlasCacheJP } from "src/atlas-api/cache";
import { getOwner } from "src/servants/getOwner";

let suzuka: Servant;

beforeAll(async () => {
  const niceServant = await atlasCacheJP.getNiceServant();
  const servant = niceServant.find(servant => servant.id === 103000);
  if (!servant) throw new Error("Invalid test data");
  suzuka = servant;
});

describe("getOwner", () => {
  it("finds owner of Skill", () => {
    expect(getOwner(suzuka.skills[0])).resolves.toEqual(suzuka);
  });
  it("finds owner of NP", () => {
    expect(getOwner(suzuka.noblePhantasms[0])).resolves.toEqual(suzuka);
  });
});
