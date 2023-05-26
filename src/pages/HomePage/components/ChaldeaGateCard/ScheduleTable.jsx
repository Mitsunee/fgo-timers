//import styles from "./ScheduleTable.module.css";
import CollapsableSection from "~/components/CollapsableSection";
import { InfoTable } from "~/components/InfoTable";
import ScheduleRow from "./ScheduleRow";
import { schedules } from "./schedules";

export default function ScheduleTable({ weekday }) {
  return (
    <CollapsableSection summary="Schedule">
      <InfoTable>
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
              training={training}
              embers={embers}
              activeDay={weekday === name}
            />
          ))}
        </tbody>
      </InfoTable>
    </CollapsableSection>
  );
}
