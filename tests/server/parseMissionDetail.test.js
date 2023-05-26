import { parseMissionDetail } from "~/server/HomePage/getCurrentMasterMissions/parseMasterMission";

describe("parseMissionDetail", () => {
  // string only
  it("passes string with no tokens as string", () => {
    expect(parseMissionDetail("Lorem Ipsum Dolor Sit Amet")).toBe(
      "Lorem Ipsum Dolor Sit Amet"
    );
  });
  it("transforms string with useless clear token as string", () => {
    expect(parseMissionDetail("Lorem Ipsum[-]Dolor Sit Amet")).toBe(
      "Lorem IpsumDolor Sit Amet"
    );
  });
  it("transforms string with no colors as string", () => {
    expect(parseMissionDetail("[Lorem Ipsum][-]Dolor Sit Amet")).toBe(
      "Lorem Ipsum: Dolor Sit Amet"
    );
  });
  it("transforms name token without clear tokens", () => {
    expect(parseMissionDetail("[17M DL Campaign] Complete Something")).toBe(
      "17M DL Campaign: Complete Something"
    );
  });
  it("removes brackets around name tags not at start of string", () => {
    expect(
      parseMissionDetail("Complete all [17M DL Campaign] Master Missions")
    ).toBe("Complete all 17M DL Campaign Master Missions");
  });

  // don't break on bad syntax
  it("ignore stray open bracket", () => {
    expect(parseMissionDetail("[This] [ should stay")).toBe(
      "This: [ should stay"
    );
  });
  it("ignore stray close bracket", () => {
    expect(parseMissionDetail("[This] ] should stay")).toBe(
      "This: ] should stay"
    );
  });

  // with colors
  it("transforms colors at around name token at start", () => {
    expect(parseMissionDetail("[ff8800][Test][-] Pass this test")).toEqual([
      { color: "ff8800", text: "Test: " },
      "Pass this test"
    ]);
  });
  it("transforms color at start", () => {
    expect(parseMissionDetail("[ddaa33]Test[-] this module")).toEqual([
      { color: "ddaa33", text: "Test" },
      " this module"
    ]);
  });
  it("transforms colors not at start", () => {
    expect(parseMissionDetail("Pass all [ff8800]color[-] tests")).toEqual([
      "Pass all ",
      { color: "ff8800", text: "color" },
      " tests"
    ]);
  });
  it("transforms color without clear token", () => {
    expect(parseMissionDetail("Forgot clear tag [ff0000]here")).toEqual([
      "Forgot clear tag ",
      { color: "ff0000", text: "here" }
    ]);
  });
});
