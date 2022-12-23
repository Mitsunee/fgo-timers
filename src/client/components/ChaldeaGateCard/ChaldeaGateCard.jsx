import { useStore } from "@nanostores/react";

//import styles from "./ChaldeaGateCard.module.css";
import { intervalStore } from "src/client/stores/intervalStore";
import { useRecurringDaily } from "src/client/utils/hooks/useRecurringDaily";
import { findScheduleByDay } from "./schedules";
import { Card } from "src/client/components/Card";
import { NoSSR } from "src/client/components/NoSSR";
import { DisplayDelta, DisplayDate } from "src/client/components/TimeDisplay";
import TrainingLootList from "./TrainingLootList";
import EmberLootList from "./EmberLootList";
import ScheduleTable from "./ScheduleTable";

export default function ChaldeaGateCard() {
  const { s } = useStore(intervalStore);
  const weekday = s.goto("utc").format("day-short");
  const currentDay = findScheduleByDay(weekday);
  const nextRotation = useRecurringDaily({ hour: 0, tz: "utc" });

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
          <DisplayDelta time={nextRotation} /> (
          <DisplayDate time={nextRotation} format="short" />)
        </p>
        <ScheduleTable weekday={weekday} />
      </NoSSR>
    </Card>
  );
}
