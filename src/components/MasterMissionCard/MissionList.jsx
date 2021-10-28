//import styles from "./MissionList.module.css";
import { useFormattedDelta } from "@utils/hooks/useFormattedDelta";
import { useFormattedTimestamp } from "@utils/hooks/useFormattedTimestamp";

export default function MissionList({ data, interval = null }) {
  const delta = useFormattedDelta(interval, data.endedAt * 1000);
  const date = useFormattedTimestamp(data.endedAt * 1000, "short");

  if (interval && data.endedAt * 1000 < interval) return null;

  return (
    <>
      <ul>
        {data.missions
          .sort((a, b) => a.dispNo - b.dispNo)
          .map(mission => (
            <li key={mission.id}>{mission.detail}</li>
          ))}
      </ul>
      {interval && (
        <p>
          Available until:
          <br />
          {date} ({delta})
        </p>
      )}
    </>
  );
}
