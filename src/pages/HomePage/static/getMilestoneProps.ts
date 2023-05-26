import { nextIntervalOccurence } from "~/time/nextIntervalOccurence";
import { GlobalNums } from "~/types/enum";

export function getMilestoneProps(now: number) {
  const nextServerTime = nextIntervalOccurence(
    now,
    GlobalNums.SERVER_DAY_LEN,
    GlobalNums.SERVER_DAY_OFFSET
  );
  const nextServerDay =
    Math.ceil(
      (nextServerTime - GlobalNums.SERVER_DAY_ZERO) / GlobalNums.SERVER_DAY_LEN
    ) * 100;

  const milestones = {
    updatedAt: now,
    nextServerTime,
    nextServerDay
  } as const;

  return milestones;
}
