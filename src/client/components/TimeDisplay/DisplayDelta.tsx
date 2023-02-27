import spacetime from "spacetime";
import { NoSSR } from "src/client/components/NoSSR";
import { diffToDateTimeAttribute, formatDiff } from "src/time/formatDiff";
import { useCurrentTime } from "src/client/utils/hooks/useCurrentTime";

interface DisplayDeltaProps {
  /**
   * Target time in seconds
   */
  time: number;
  /**
   * Text to display if specified time is in the past
   */
  endedText?: "---" | "Ended" | (string & {});
}

export function DisplayDelta({ time, endedText }: DisplayDeltaProps) {
  const { s } = useCurrentTime();
  const diff = s.diff(spacetime(time * 1000));

  return (
    <NoSSR>
      <time dateTime={diffToDateTimeAttribute(diff)}>
        {formatDiff(diff, endedText)}
      </time>
    </NoSSR>
  );
}
