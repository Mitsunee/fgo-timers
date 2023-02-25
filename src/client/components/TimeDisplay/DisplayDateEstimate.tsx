import spacetime from "spacetime";
import { Global } from "src/types/enum";

interface DisplayDateEstimateProps {
  time: number;
}

export function DisplayDateEstimate({ time }: DisplayDateEstimateProps) {
  const s = spacetime(time, Global.SERVER_TZ);
  const d = s.date();

  return (
    <>
      {d <= 10 ? "Early" : d <= 20 ? "Mid" : "Late"}
      {s.format(" {month} {year}")}
    </>
  );
}
