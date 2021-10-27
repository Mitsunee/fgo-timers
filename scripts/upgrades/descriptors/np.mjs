import { borderColors } from "../borderColors.mjs";

export const describeNP = (npData, npDataNA) => ({
  name: npDataNA?.name || npData.name,
  type: npData.card,
  border: borderColors.get(npData.priority),
  na: npDataNA ? true : undefined
});
