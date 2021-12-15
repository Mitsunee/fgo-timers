//import styles from "./MasterMissionCard.module.css";
import { useFetch } from "@utils/hooks/useFetch";
import { ATLAS_API } from "@utils/globals";
import { Card } from "@components/Card";
import Pending from "@components/Pending";
import WeeklyMissionCard from "./WeeklyMissionCard";
import LimitedMissionCard from "./LimitedMissionCard";

export default function MasterMissionCard() {
  const [loading, data, error] = useFetch(
    `${ATLAS_API}export/NA/nice_master_mission.json`
  );

  return data ? (
    <>
      <WeeklyMissionCard data={data} />
      <LimitedMissionCard data={data} />
    </>
  ) : (
    <Card
      title="Weekly Master Missions"
      icon="/assets/icon_mm.png"
      color="blue">
      {error && (
        <>
          <h2>An Error occured</h2>
          <p>{error.message}</p>
        </>
      )}
      {loading && <Pending />}
    </Card>
  );
}
