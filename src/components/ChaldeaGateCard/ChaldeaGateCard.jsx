import { useMemo } from "react";

//import styles from "./ChaldeaGateCard.module.css";
import { useRecurringDaily } from "@utils/hooks/useRecurringDaily";
import { useFormattedDelta } from "@utils/hooks/useFormattedDelta";
import { useFormattedTimestamp } from "@utils/hooks/useFormattedTimestamp";
import { getWeekday, findScheduleByDay } from "./schedules";
import { Card } from "@components/Card";
import TrainingLootList from "./TrainingLootList";
import EmberLootList from "./EmberLootList";
import ScheduleTable from "./ScheduleTable";
import NoSSR from "@components/NoSSR";

export default function ChaldeaGateCard({ interval }) {
  const weekday = useMemo(() => getWeekday(interval), [interval]);
  const currentDay = useMemo(() => findScheduleByDay(weekday), [weekday]);
  const nextRotation = useRecurringDaily({ hour: 0, tz: "utc" }, interval);
  const nextRotationDelta = useFormattedDelta(interval, nextRotation);
  const nextRotationDate = useFormattedTimestamp(nextRotation, "short");

  return (
    <Card
      title="Daily Quests"
      icon="/assets/icon_chaldeagate.png"
      color="green">
      <TrainingLootList data={currentDay.training} />
      <EmberLootList data={currentDay.embers} />
      <NoSSR>
        <p>
          Next Daily Quest Rotation in:
          <br />
          {nextRotationDelta} ({nextRotationDate})
        </p>
      </NoSSR>
      <ScheduleTable weekday={weekday} />
    </Card>
  );
}
