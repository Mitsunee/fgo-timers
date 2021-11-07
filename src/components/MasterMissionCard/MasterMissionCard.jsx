import { useState, useEffect } from "react";

//import styles from "./MasterMissionCard.module.css";
import { useFetch } from "@utils/hooks/useFetch";
import { ATLAS_API } from "@utils/globals";
import { Card } from "@components/Card";
import Pending from "@components/Pending";
import WeeklyMissionList from "./WeeklyMissionList";
import MissionList from "./MissionList";

export default function MasterMissionCard() {
  const [loading, data, error] = useFetch(
    `${ATLAS_API}export/NA/nice_master_mission.json`
  );
  const [limitedMissions, setLimitedMissions] = useState([]);

  // effect to find limited missions
  useEffect(() => {
    if (error || !data) return;

    const limitedMissions = Object.keys(data).filter(
      key => data[key].id !== 10001 && data[key].missions[0]?.type === "limited"
    );
    setLimitedMissions(limitedMissions);
  }, [error, data]);

  return (
    <>
      <Card
        title="Weekly Master Missions"
        icon="/assets/icon_mm.png"
        color="blue">
        {error ? (
          <>
            <h2>An Error occured</h2>
            <p>{error.message}</p>
          </>
        ) : loading ? (
          <Pending />
        ) : (
          <WeeklyMissionList data={data} />
        )}
      </Card>
      {limitedMissions.length > 0 && (
        <Card
          title="Limited Master Missions"
          icon="/assets/icon_mm.png"
          color="gold">
          {limitedMissions.map(limitedMission => (
            <MissionList
              key={data[limitedMission].id}
              data={data[limitedMission]}
            />
          ))}
        </Card>
      )}
    </>
  );
}
