import spacetime from "spacetime";
import { NoSSR } from "~/components/NoSSR";
import { diffToDateTimeAttribute, formatDiff } from "~/time/formatDiff";

interface DisplayDeltaBetweenProps {
  /**
   * Target time in seconds
   */
  time: number;
  /**
   * Current time in seconds
   */
  from: number;
  /**
   * Text to display if specified time is in the past
   */
  endedText?: "---" | "Ended" | string;
}

export function DisplayDeltaBetween({
  time,
  from,
  endedText
}: DisplayDeltaBetweenProps) {
  const diff = spacetime(from * 1000).diff(spacetime(time * 1000));

  return (
    <NoSSR>
      <time dateTime={diffToDateTimeAttribute(diff)}>
        {formatDiff(diff, endedText)}
      </time>
    </NoSSR>
  );
}
