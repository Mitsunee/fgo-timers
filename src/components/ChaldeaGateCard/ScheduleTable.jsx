import styles from "./ScheduleTable.module.css";
import { schedules, servantClasses } from "./schedules";
import CollapsableSection from "@components/CollapsableSection";
import ScheduleRow from "./ScheduleRow";

export default function ScheduleTable({ weekday }) {
  return (
    <CollapsableSection summary="Schedule">
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Day</th>
            <th>Training</th>
            <th>Embers</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map(({ name, training, embers }) => (
            <ScheduleRow
              key={name}
              short={name}
              training={servantClasses.get(training)}
              embers={embers.map(className => servantClasses.get(className))}
              activeDay={weekday === name}
            />
          ))}
        </tbody>
      </table>
    </CollapsableSection>
  );
}
