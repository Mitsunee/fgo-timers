import spacetime from "spacetime";
import { NoSSR } from "src/client/components/NoSSR";
import { diffToDateTimeAttribute, formatDiff } from "src/time/formatDiff";

interface DisplayDeltaBetweenProps {
  time: number;
  from: number;
  endedText?: "---" | "Ended" | string;
}

export function DisplayDeltaBetween({
  time,
  from,
  endedText
}: DisplayDeltaBetweenProps) {
  const diff = spacetime(from).diff(spacetime(time));

  return (
    <NoSSR>
      <time dateTime={diffToDateTimeAttribute(diff)}>
        {formatDiff(diff, endedText)}
      </time>
    </NoSSR>
  );
}
