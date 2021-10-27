import { useState, useEffect, useRef } from "react";

//import styles from "./MasterMissionCard.module.css";
import { WEEKLY_MM_LEN, WEEKLY_MM_OFFSET } from "@utils/globals";
import { Card } from "@components/Card";
import Pending from "@components/Pending";

export default function MasterMissionCard({ interval }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState();
  const ref = useRef(0);
  const [weeklies, setWeeklies] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    fetch("https://api.atlasacademy.io/export/NA/nice_master_mission.json", {
      signal
    })
      .then(res => res.json())
      .then(res => {
        setData(res);
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

  useEffect(() => {
    if (error || !data) return;

    const s = Math.trunc(interval / 1000);
    const expectedStart = s - ((s - WEEKLY_MM_OFFSET) % WEEKLY_MM_LEN);

    if (ref.current !== expectedStart) {
      const weeklies = data.find(
        ({ id, startedAt }) => id !== 10001 && startedAt === expectedStart
      );

      if (!weeklies) {
        setError({ message: "Could not find Weekly Missions" });
      }

      setWeeklies(weeklies);
      setLoading(false);

      ref.current = expectedStart;
    }
  }, [data, interval, error]);

  return (
    <Card title="Master Missions" icon="/assets/icon_mm.png" color="blue">
      {error ? (
        <>
          <h2>An Error occured</h2>
          <p>{error.message}</p>
        </>
      ) : loading ? (
        <Pending />
      ) : (
        // DEBUG
        weeklies && (
          <code>
            <pre style={{ whiteSpace: "pre-wrap" }}>
              {JSON.stringify(weeklies, null, 2)}
            </pre>
          </code>
        )
      )}
    </Card>
  );
}
