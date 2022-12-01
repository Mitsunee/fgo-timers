import { useStore } from "@nanostores/react";
import spacetime from "spacetime";
import { intervalStore } from "src/client/stores/intervalStore";
import { NoSSR } from "src/client/components/NoSSR";

interface DisplayDeltaProps {
  time: number;
  endedText?: "---" | "Ended" | string;
}

export function DisplayDelta({ time, endedText = "---" }: DisplayDeltaProps) {
  const { s } = useStore(intervalStore);
  const { days, hours, minutes, seconds } = s.diff(spacetime(time));

  return (
    <NoSSR>
      {seconds <= 0
        ? endedText
        : `${days == 0 ? "" : `${days}d `}${
            hours == 0 ? "" : `${hours % 24}h `
          }${minutes % 60}m ${seconds % 60}s`}
    </NoSSR>
  );
}
