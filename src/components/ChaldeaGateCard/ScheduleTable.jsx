import { useState } from "react";

import styles from "./ScheduleTable.module.css";
import { svgArrow } from "@utils/svgIcons";
import { schedules, servantClasses } from "./schedules";
import { Button } from "@components/Button";
import ScheduleRow from "./ScheduleRow";

export default function ScheduleTable({ weekday }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(state => !state)}
        disableDefaultStyle
        className={open ? `${styles.header} ${styles.open}` : styles.header}
        iconSvg={svgArrow}
        iconSize="0.75em">
        Schedule
      </Button>
      {open && (
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
      )}
    </>
  );
}
