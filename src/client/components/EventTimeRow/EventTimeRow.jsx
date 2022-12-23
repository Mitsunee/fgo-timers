import { DisplayDelta, DisplayDate } from "src/client/components/TimeDisplay";

export default function EventTimeRow({ title, target }) {
  return (
    <tr>
      <td>{title}</td>
      <td>
        <DisplayDelta time={target * 1000} />
      </td>
      <td>
        <DisplayDate time={target * 1000} format="full" />
      </td>
    </tr>
  );
}
