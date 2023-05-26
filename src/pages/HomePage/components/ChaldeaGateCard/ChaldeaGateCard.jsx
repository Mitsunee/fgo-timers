import { Card } from "src/client/components/Card";
import { NoSSR } from "src/client/components/NoSSR";
import { DisplayDate, DisplayDelta } from "src/client/components/TimeDisplay";
import { useCurrentTime } from "src/client/utils/hooks/useCurrentTime";
import { useRecurringDaily } from "src/client/utils/hooks/useRecurringDaily";
import EmberLootList from "./EmberLootList";
import { findScheduleByDay } from "./schedules";
import ScheduleTable from "./ScheduleTable";
import TrainingLootList from "./TrainingLootList";

export default function ChaldeaGateCard() {
  const { s } = useCurrentTime();
  const weekday = s.goto("utc").format("day-short");
  const currentDay = findScheduleByDay(weekday);
  const nextRotation = useRecurringDaily(0);

  return (
    <Card
      title="Daily Quests"
      icon="/assets/icon_chaldeagate.png"
      color={7 /*green*/}
      id="daily-quests">
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
