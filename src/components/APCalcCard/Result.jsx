import { useFormattedDelta } from "@utils/hooks/useFormattedDelta";
import { useFormattedTimestamp } from "@utils/hooks/useFormattedTimestamp";

export default function Result({ text, time, from }) {
  const delta = useFormattedDelta(from, time);
  const date = useFormattedTimestamp(time, "short");

  return (
    <p>
      {text} in:
      <br />
      {delta} ({date})
    </p>
  );
}
