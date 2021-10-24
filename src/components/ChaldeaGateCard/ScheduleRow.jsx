import cc from "classcat";

import styles from "./ScheduleRow.module.css";
import FGOIcon from "@components/FGOIcon";

export default function ScheduleRow({
  short,
  training,
  embers,
  activeDay = false
}) {
  return (
    <tr className={cc(activeDay && styles.active)}>
      <th>{short}</th>
      <td>
        <div className={styles.iconRow}>
          <FGOIcon
            name={training.class}
            icon={training.icon}
            background="clear"
            className={styles.icon}
          />
        </div>
      </td>
      <td>
        <div className={styles.iconRow}>
          {embers.map(({ class: className, icon }, idx) => (
            <FGOIcon
              key={idx}
              name={className}
              icon={icon}
              background="clear"
              className={styles.icon}
            />
          ))}
        </div>
      </td>
    </tr>
  );
}
