import spacetime from "spacetime";
import { SERVER_TZ } from "src/types/constants";
import { NoSSR } from "src/client/components/NoSSR";

interface DisplayDateEstimateProps {
  time: number;
}

export function DisplayDateEstimate({ time }: DisplayDateEstimateProps) {
  const s = spacetime(time, SERVER_TZ);
  const d = s.date();

  return (
    <NoSSR>
      {d <= 10 ? "Early" : d <= 20 ? "Mid" : "Late"}
      {s.format(" {month} {year}")}
    </NoSSR>
  );
}
