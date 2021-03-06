import { useFormattedDeltaFrom } from "@utils/hooks/useFormattedDeltaFrom";
import { useFormattedTimestamp } from "@utils/hooks/useFormattedTimestamp";

export default function Result({ text, time, from }) {
  const delta = useFormattedDeltaFrom(from, time);
  const date = useFormattedTimestamp(time, "short-sec", true); // ignores server time setting

  return (
    <p>
      {text} in:
      <br />
      {delta} ({date})
    </p>
  );
}
