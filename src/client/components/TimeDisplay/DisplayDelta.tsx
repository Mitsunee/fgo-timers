import { useStore } from "@nanostores/react";
import spacetime from "spacetime";
import { intervalStore } from "src/client/stores/intervalStore";
import { NoSSR } from "src/client/components/NoSSR";
import { formatDiff } from "src/time/formatDiff";

interface DisplayDeltaProps {
  time: number;
  endedText?: "---" | "Ended" | string;
}

export function DisplayDelta({ time, endedText = "---" }: DisplayDeltaProps) {
  const { s } = useStore(intervalStore);
  const diff = s.diff(spacetime(time));

  return <NoSSR>{formatDiff(diff, endedText)}</NoSSR>;
}
