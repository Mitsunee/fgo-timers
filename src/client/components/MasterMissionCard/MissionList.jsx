import { NoSSR } from "src/client/components/NoSSR";
import { DisplayDelta, DisplayDate } from "src/client/components/TimeDisplay";
import MissionListItem from "./MissionListItem";

export function MissionList({ data }) {
  const timestamp = data.end * 1000;

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
          <DisplayDate time={timestamp} format="short" /> (
          <DisplayDelta time={timestamp} endedText="Ended" />)
        </p>
      </NoSSR>
    </>
  );
}
