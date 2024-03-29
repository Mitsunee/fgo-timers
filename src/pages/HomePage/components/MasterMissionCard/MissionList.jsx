import { NoSSR } from "~/components/NoSSR";
import { DisplayDate, DisplayDelta } from "~/components/TimeDisplay";
import MissionListItem from "./MissionListItem";

export function MissionList({ data }) {
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
          <DisplayDate time={data.end} format="short" /> (
          <DisplayDelta time={data.end} endedText="Ended" />)
        </p>
      </NoSSR>
    </>
  );
}
