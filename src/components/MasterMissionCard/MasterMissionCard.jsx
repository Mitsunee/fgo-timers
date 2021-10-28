import { useState, useEffect, useRef } from "react";

//import styles from "./MasterMissionCard.module.css";
import { WEEKLY_MM_LEN, WEEKLY_MM_OFFSET } from "@utils/globals";
import { useFormattedDelta } from "@utils/hooks/useFormattedDelta";
import { useFormattedTimestamp } from "@utils/hooks/useFormattedTimestamp";
import { Card } from "@components/Card";
import Pending from "@components/Pending";
import MissionList from "./MissionList";

export default function MasterMissionCard({ interval }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState();
  const startRef = useRef(0);
  const [weeklies, setWeeklies] = useState(false);
  const [limitedMissions, setLimitedMissions] = useState([]);
  const weeklyEndTimestamp = data
    ? weeklies === false
      ? null
      : data[weeklies].endedAt * 1000
    : null;
  const weeklyDelta = useFormattedDelta(interval, weeklyEndTimestamp);
  const weeklyDate = useFormattedTimestamp(weeklyEndTimestamp, "short");

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    fetch("https://api.atlasacademy.io/export/NA/nice_master_mission.json", {
      signal
    })
      .then(res => res.json())
      .then(res => {
        setData(res.filter(({ id }) => id !== 10001));
        setLoading(false);
      })
      .catch(e => {
        if (e instanceof DOMException && e.code === DOMException.ABORT_ERR) {
          // cleanup func was called, no op
          return;
        }
        setError(e);
      });

    return () => controller.abort();
  }, []);

  // effect to find weekly missions
  useEffect(() => {
    if (error || !data) return;

    const s = Math.trunc(interval / 1000);
    const expectedStart = s - ((s - WEEKLY_MM_OFFSET) % WEEKLY_MM_LEN);
    // replace offset with 313200 to use JP data for testing purposes

    if (startRef.current !== expectedStart) {
      const weeklies = data.findIndex(
        ({ startedAt }) => startedAt === expectedStart
      );

      if (weeklies < 0) {
        setError({ message: "Could not find Weekly Missions" });
      }

      setWeeklies(weeklies);
      startRef.current = expectedStart;
    }
  }, [error, data, interval]);

  // effect to find limited missions
  useEffect(() => {
    if (error || !data) return;

    const limitedMissions = Object.keys(data).filter(
      key => data[key].missions[0]?.type === "limited"
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
          weeklies !== false && (
            <>
              <MissionList data={data[weeklies]} />
              <p>
                Next Weekly Mission Rotation:
                <br />
                {weeklyDelta} ({weeklyDate})
              </p>
            </>
          )
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
              interval={interval}
            />
          ))}
        </Card>
      )}
    </>
  );
}
