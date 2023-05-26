import { Card } from "~/components/Card";
import { MissionList } from "./MissionList";

export default function LimitedMissionCard({ data }) {
  return (
    <Card
      title="Limited Master Missions"
      icon="/assets/icon_mm.png"
      color={3 /* gold */}>
      <MissionList key={data.id} data={data} />
    </Card>
  );
}
