import { useFormattedDeltaFrom } from "@utils/hooks/useFormattedDeltaFrom";
import { useFormattedTimestamp } from "@utils/hooks/useFormattedTimestamp";

export default function Result({ text, time, from }) {
  // BUG: using unsupported second argument
  const delta = useFormattedDeltaFrom(from, time);
  const date = useFormattedTimestamp(time, "short");

  return (
    <p>
      {text} in:
      <br />
      {delta} ({date})
    </p>
  );
}
