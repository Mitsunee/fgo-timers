import { useStore } from "@nanostores/react";

//import styles from "./MissionList.module.css";
import { intervalStore } from "@stores/intervalStore";
import { useFormattedDelta } from "@utils/hooks/useFormattedDelta";
import { useFormattedTimestamp } from "@utils/hooks/useFormattedTimestamp";
import MissionListItem from "./MissionListItem";

export default function MissionList({ data }) {
  const { seconds } = useStore(intervalStore);
  const delta = useFormattedDelta(data.endedAt * 1000);
  const date = useFormattedTimestamp(data.endedAt * 1000, "short");

  // NOTE: missing workaround for limited missions that ended already
  // currently they always display with the line below commented out
  // as otherwise there would be an empty card.

  //if (seconds && data.endedAt < seconds) return null;

  return (
    <>
      <ul>
        {data.missions
          .sort((a, b) => a.dispNo - b.dispNo)
          .map(mission => (
            <MissionListItem key={mission.id} detail={mission.detail} />
          ))}
      </ul>
      {seconds && (
        <p>
          Available until:
          <br />
          {date} ({delta === "---" ? "Ended" : delta})
        </p>
      )}
    </>
  );
}
