//import styles from "./LimitedMissionCard.module.css";
import { Card } from "@components/Card";
import MissionList from "./MissionList";

export default function LimitedMissionCard({ data }) {
  return (
    <Card
      title="Limited Master Missions"
      icon="/assets/icon_mm.png"
      color="gold">
      <MissionList key={data.id} data={data} />
    </Card>
  );
}
