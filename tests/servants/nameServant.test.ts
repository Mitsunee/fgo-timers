import { nameServant } from "~/servants/nameServant";

describe("nameServant", () => {
  it("handles Saber Altrias correctly", async () => {
    const altria = await nameServant(100100);
    expect(altria).toBe("Altria Pendragon (Saber)");
    const salter = await nameServant(100200);
    expect(salter).toBe("Altria Pendragon (Alter) (Saber)");
    const lily = await nameServant(100300);
    expect(lily).toBe("Altria Pendragon (Lily)");
  });
  it("handles BBs correctly", async () => {
    const welfareBB = await nameServant(2300100);
    expect(welfareBB).toBe("BB");
    const summerBB = await nameServant(2300200);
    expect(summerBB).toBe("BB (Summer)");
  });
  it("handles Abigails correctly", async () => {
    const abby = await nameServant(2500100);
    expect(abby).toBe("Abigail Williams");
    const summer = await nameServant(2500700);
    expect(summer).toBe("Abigail Williams (Summer)");
  });
  it("handles Scathachs & Skadis correctly", async () => {
    const shishou = await nameServant(301300);
    expect(shishou).toBe("Scáthach (Lancer)");
    const welfare = await nameServant(602400);
    expect(welfare).toBe("Scáthach (Assassin)");
    const skadiCaster = await nameServant(503900);
    expect(skadiCaster).toBe("Scáthach-Skadi (Caster)");
    const skadiSummer = await nameServant(901400);
    expect(skadiSummer).toBe("Scáthach-Skadi (Ruler)");
  });
});
