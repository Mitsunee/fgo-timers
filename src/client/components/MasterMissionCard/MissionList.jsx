//import styles from "./MissionList.module.css";
import { useFormattedDelta } from "@utils/hooks/useFormattedDelta";
import { useFormattedTimestamp } from "@utils/hooks/useFormattedTimestamp";
import MissionListItem from "./MissionListItem";
import NoSSR from "@components/NoSSR";

export default function MissionList({ data }) {
  const timestamp = data.end * 1000;
  const delta = useFormattedDelta(timestamp);
  const date = useFormattedTimestamp(timestamp, "short");

  return (
    <>
      <ul>
        {data.missions.map(mission => (
          <MissionListItem key={mission.id} detail={mission.detail} />
        ))}
      </ul>
      <NoSSR>
        <p>
          Available until:
          <br />
          {date} ({delta === "---" ? "Ended" : delta})
        </p>
      </NoSSR>
    </>
  );
}
