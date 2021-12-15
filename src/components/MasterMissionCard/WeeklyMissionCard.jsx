import { useState, useEffect } from "react";

//import styles from "./WeeklyMissionList.module.css";
import { useRecurringInterval } from "@utils/hooks/useRecurringInterval";
import { WEEKLY_MM_LEN, WEEKLY_MM_OFFSET } from "@utils/globals";
import { useFormattedDelta } from "@utils/hooks/useFormattedDelta";
import { useFormattedTimestamp } from "@utils/hooks/useFormattedTimestamp";
import { Card } from "@components/Card";
import MissionList from "./MissionList";

export default function WeeklyMissionCard({ data }) {
  const [error, setError] = useState(false);
  const expectedEnd = useRecurringInterval({
    length: WEEKLY_MM_LEN,
    offset: WEEKLY_MM_OFFSET
  });
  const [index, setIndex] = useState(false);
  const [timestamp, setTimestamp] = useState(null);
  const weeklyDelta = useFormattedDelta(timestamp);
  const weeklyDate = useFormattedTimestamp(timestamp, "short");

  useEffect(() => {
    if (!data || expectedEnd === null) return;

    const expected = Math.trunc(expectedEnd / 1000) - 1;
    const index = data.findIndex(({ endedAt }) => endedAt === expected);

    if (index < 0) {
      setError({
        message: `Could not find Weekly Missions for ${expectedEnd}`
      });
      return;
    }

    setIndex(index);
    setTimestamp((data[index].endedAt + 1) * 1000);
  }, [data, expectedEnd]);

  return (
    <Card
      title="Weekly Master Missions"
      icon="/assets/icon_mm.png"
      color="blue">
      {error ? (
        <>
          <h2>An Error occured</h2>
          <p>{error.message}</p>
        </>
      ) : (
        index && (
          <>
            <MissionList data={data[index]} />
            {timestamp && (
              <p>
                Next Weekly Mission Rotation:
                <br />
                {weeklyDelta} ({weeklyDate})
              </p>
            )}
          </>
        )
      )}
    </Card>
  );
}
