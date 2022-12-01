import spacetime from "spacetime";
import { useStore } from "@nanostores/react";
import { settingsStore } from "src/client/stores/settingsStore";
import { useIsClient } from "src/client/utils/hooks/useIsClient";
import { SERVER_TZ } from "src/types/constants";
import { NoSSR } from "src/client/components/NoSSR";

interface DisplayDateEstimateProps {
  time: number;
}

export function DisplayDateEstimate({ time }: DisplayDateEstimateProps) {
  const settings = useStore(settingsStore);
  const isClient = useIsClient();
  const s = spacetime(
    time,
    settings.showServerTimes || !isClient ? SERVER_TZ : undefined
  );
  const d = s.date();

  return (
    <NoSSR>
      {d <= 10 ? "Early" : d <= 20 ? "Mid" : "Late"}
      {s.format(" {month} {year}")}
    </NoSSR>
  );
}
