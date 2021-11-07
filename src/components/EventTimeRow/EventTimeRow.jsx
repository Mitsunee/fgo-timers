//import styles from "./EventTimeRow.module.css";
import { useFormattedDelta } from "@utils/hooks/useFormattedDelta";
import { useFormattedTimestamp } from "@utils/hooks/useFormattedTimestamp";

export default function EventTimeRow({ title, target }) {
  const delta = useFormattedDelta(target);
  const date = useFormattedTimestamp(target, "full");

  return (
    <tr>
      <td>{title}</td>
      <td>{delta}</td>
      <td>{date}</td>
    </tr>
  );
}
