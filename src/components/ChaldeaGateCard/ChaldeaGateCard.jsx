import { useStore } from "nanostores/react";

//import styles from "./ChaldeaGateCard.module.css";
import { intervalStore } from "@stores/intervalStore";
import { useRecurringDaily } from "@utils/hooks/useRecurringDaily";
import { useFormattedDelta } from "@utils/hooks/useFormattedDelta";
import { useFormattedTimestamp } from "@utils/hooks/useFormattedTimestamp";
import { findScheduleByDay } from "./schedules";
import { Card } from "@components/Card";
import TrainingLootList from "./TrainingLootList";
import EmberLootList from "./EmberLootList";
import ScheduleTable from "./ScheduleTable";
import NoSSR from "@components/NoSSR";

export default function ChaldeaGateCard() {
  const { s } = useStore(intervalStore);
  const weekday = s.goto("utc").format("day-short");
  const currentDay = findScheduleByDay(weekday);
  const nextRotation = useRecurringDaily({ hour: 0, tz: "utc" });
  const nextRotationDelta = useFormattedDelta(nextRotation);
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
