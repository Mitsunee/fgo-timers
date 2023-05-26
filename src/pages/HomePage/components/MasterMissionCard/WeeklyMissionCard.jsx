import { Card } from "~/client/components/Card";
import { MissionList } from "./MissionList";

export default function WeeklyMissionCard({ data }) {
  return (
    <Card
      title="Weekly Master Missions"
      icon="/assets/icon_mm.png"
      color={5 /* blue */}
      id="weekly-missions">
      <MissionList data={data} />
    </Card>
  );
}
