import { useFormattedDelta } from "@utils/hooks/useFormattedDelta";
import { useFormattedTimestamp } from "@utils/hooks/useFormattedTimestamp";

export default function Result({ data }) {
  const { text, time, from } = data; // TODO: refactor to just have this deconstruction on props instead of two steps
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
