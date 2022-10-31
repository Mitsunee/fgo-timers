import { cacheVersion } from "src/atlas-api/cache";
import { makeBuildVer } from "src/prebuild/saveBuildInfo";

const buildVerReg = /[a-z0-9]+:[a-z0-9]+\.[a-z0-9_]+/;

describe("makeBuildVer", () => {
  it("generates expected result for sample data", () => {
    const sample = {
      NA: 1667189130,
      JP: 1667206881,
      version: "0.3.0",
      lastChecked: 1667209812
    };
    const ver = makeBuildVer(sample);
    expect(ver).toBe("m129:lnd6.30");
    expect(ver).toMatch(buildVerReg);
  });

  it("always includes at least 1 digit for api data timestamps", () => {
    const now = Math.floor(Date.now() / 1000);
    const ver = makeBuildVer({
      JP: now,
      NA: now,
      lastChecked: now,
      version: cacheVersion
    });
    expect(ver).toMatch(buildVerReg);
  });
});
