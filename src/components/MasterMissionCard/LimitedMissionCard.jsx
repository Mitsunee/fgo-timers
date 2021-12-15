import { useStore } from "@nanostores/react";

//import styles from "./LimitedMissionCard.module.css";
import { intervalStore } from "@stores/intervalStore";
import { Card } from "@components/Card";
import MissionList from "./MissionList";

export default function LimitedMissionCard({ data }) {
  const { seconds } = useStore(intervalStore);
  const limitedMissions = data.filter(
    ({ id, missions, endedAt }) =>
      id !== 10001 && missions[0]?.type === "limited" && endedAt > seconds
  );

  if (limitedMissions.length < 1) return null;

  return (
    <Card
      title="Limited Master Missions"
      icon="/assets/icon_mm.png"
      color="gold">
      {limitedMissions.map(limitedMission => (
        <MissionList key={limitedMission.id} data={limitedMission} />
      ))}
    </Card>
  );
}
