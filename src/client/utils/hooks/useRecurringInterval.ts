import { useCurrentTime } from "src/client/utils/hooks/useCurrentTime";

export function useRecurringInterval({
  length,
  offset
}: {
  length: number;
  offset: number;
}) {
  const { current } = useCurrentTime();
  const next = current - ((current - offset) % length) + length;
  return next * 1000;
}
