import { DisplayDate, DisplayDeltaBetween } from "~/components/TimeDisplay";

export default function Result({ text, time, from }) {
  return (
    <p>
      {text} in:
      <br />
      <DisplayDeltaBetween from={from} time={time} /> (
      <DisplayDate time={time} format="withSec" serverTz="never" />)
    </p>
  );
}
