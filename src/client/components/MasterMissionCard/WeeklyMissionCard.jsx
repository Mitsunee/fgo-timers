import { Card } from "src/client/components/Card";
import { MissionList } from "./MissionList";

export default function WeeklyMissionCard({ data }) {
  return (
    <Card
      title="Weekly Master Missions"
      icon="/assets/icon_mm.png"
      color="blue">
      <MissionList data={data} />
    </Card>
  );
}
