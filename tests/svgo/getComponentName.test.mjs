/* eslint-env jest */
import { getComponentName } from "src/svgo/getComponentName.mjs";

describe("getComponentName", () => {
  it("correctly generates properly camelcased names", () => {
    expect(getComponentName("lorem-ipsum-symbol")).toBe("IconLoremIpsumSymbol");
    expect(getComponentName("lorem-ipsum-69")).toBe("IconLoremIpsum");
    expect(getComponentName("lorem_ipsum_underscored")).toBe(
      "IconLoremIpsumUnderscored"
    );
    expect(getComponentName("alreadyCamelCased")).toBe("IconAlreadyCamelCased");
  });
});
