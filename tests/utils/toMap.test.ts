import { toMap } from "src/utils/toMap";

describe("toMap", () => {
  it("correctly converts Record to Map", () => {
    const record: IDMap<string | boolean> = {
      "1": "foobar",
      "2": true,
      "31": false
    };

    const map = toMap(record);

    expect(map.size).toBe(3);
    expect(map.has(1)).toBeTruthy();
    expect(map.has(2)).toBeTruthy();
    expect(map.has(31)).toBeTruthy();
    expect(map.get(1)).toBe("foobar");
    expect(map.get(2)).toBe(true);
    expect(map.get(31)).toBe(false);
    expect(map.get(4)).toBeFalsy();
  });
});
