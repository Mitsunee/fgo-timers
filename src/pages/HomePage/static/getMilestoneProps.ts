import { GlobalNums } from "src/types/enum";

export function getMilestoneProps(now: number) {
  const nextServerTime =
    now +
    GlobalNums.SERVER_DAY_LEN -
    ((now - GlobalNums.SERVER_DAY_OFFSET) % GlobalNums.SERVER_DAY_LEN);
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
