import spacetime from "spacetime";
import { NoSSR } from "~/components/NoSSR";
import { useCurrentTime } from "~/hooks/useCurrentTime";
import { diffToDateTimeAttribute, formatDiff } from "~/time/formatDiff";

interface DisplayDeltaProps {
  /**
   * Target time in seconds
   */
  time: number;
  /**
   * Text to display if specified time is in the past
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
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
