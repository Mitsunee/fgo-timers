//import styles from "./EventTimeRow.module.css";
import { useFormattedDelta } from "@utils/hooks/useFormattedDelta";
import { useFormattedTimestamp } from "@utils/hooks/useFormattedTimestamp";

export default function EventTimeRow({ title, target }) {
  const delta = useFormattedDelta(target * 1000);
  const date = useFormattedTimestamp(target * 1000, "full");

  return (
    <tr>
      <td>{title}</td>
      <td>{delta}</td>
      <td>{date}</td>
    </tr>
  );
}
