import { Card } from "src/client/components/Card";
import type { BundledEvent } from "src/events/types";
import type { EventPageProps } from "../getStaticProps";

interface EventTimesCardProps {
  times: Exclude<BundledEvent["times"], undefined>;
  servants: EventPageProps["servants"];
  ces: EventPageProps["ces"];
}

export function EventTimesCard({
  times /*, servants, ces */
}: EventTimesCardProps) {
  return (
    <Card
      icon="https://static.atlasacademy.io/JP/Faces/f_4014000.png" // PLACEHOLDER
      title="Timers"
      forceRound
      bypassSpoilers>
      <ul>
        {times.map((time, i) => (
          // PLACEHOLDER
          <li key={i}>
            {time.title}: {JSON.stringify(time.date)}
          </li>
        ))}
      </ul>
    </Card>
  );
}
