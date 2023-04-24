import { z } from "zod";
import { Borders } from "../types/borders";

const zBorderEnum = z.enum([
  "black",
  "bronze",
  "silver",
  "gold",
  "blue",
  "green",
  "red",
  "zero"
]);

const transformEnumVal = (val?: z.input<typeof zBorderEnum>) => {
  switch (val) {
    case "black":
      return Borders.BLACK;
    case "bronze":
      return Borders.BRONZE;
    case "silver":
      return Borders.SILVER;
    case "gold":
      return Borders.GOLD;
    case "blue":
      return Borders.BLUE;
    case "green":
      return Borders.GREEN;
    case "red":
      return Borders.RED;
    default:
      return Borders.ZERO;
  }
};

export const zBorder = zBorderEnum.transform(transformEnumVal);
/**
 * Optional Border enum value using Borders.ZERO as default
 */
export const zBorderOptional = zBorderEnum
  .optional()
  .transform(transformEnumVal);
