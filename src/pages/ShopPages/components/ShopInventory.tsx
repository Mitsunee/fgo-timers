import type { AnyShopInventory } from "src/schema/ShopSchema";
import { useIsClient } from "src/client/utils/hooks/useIsClient";
import { useCurrentTime } from "src/client/utils/hooks/useCurrentTime";
import { DisplayDate, DisplayDelta } from "src/client/components/TimeDisplay";
import { TimerListItem } from "src/client/components/Card";
import { ShopInventoryList } from "./ShopInventoryList";
import { useRecurringEvent } from "@utils/hooks/useRecurringEvent";
import { formatDayOfMonth } from "src/time/formatDayOfMonth";

interface ShopInventoryProps {
  inventory: AnyShopInventory;
}

function LimitedInventoryTimer({
  date: [start, end]
}: {
  date: [number, number];
}) {
  const isClient = useIsClient();
  const { current } = useCurrentTime();

  if (!isClient) {
    return (
      <>
        <li data-wide>
          <b>Available starting:</b> <DisplayDate time={start} />
        </li>
        <li data-wide>
          <b>Available until:</b> <DisplayDate time={end} />
        </li>
      </>
    );
  }

  const hasStarted = current >= start;
  const hasEnded = current >= end;

  return (
    <>
      <li data-wide={hasStarted ? true : undefined}>
        <b>Available {hasStarted ? "since" : "starting"}:</b>{" "}
        <DisplayDate time={start} />
      </li>
      {!hasStarted && (
        <li>
          <b>In:</b> <DisplayDelta time={start} />
        </li>
      )}
      <li data-wide={hasEnded ? true : undefined}>
        <b>Available until:</b> <DisplayDate time={end} />
      </li>
      {!hasEnded && (
        <li>
          <b>In:</b> <DisplayDelta time={end} />
        </li>
      )}
    </>
  );
}

function MonthlyInventoryTimer({ day, hour }: { day: number; hour: number }) {
  const nextOccurence = useRecurringEvent({ day, hour });
  const isClient = useIsClient();

  return (
    <>
      <li data-wide={isClient ? undefined : true}>
        {isClient ? (
          <>
            <b>Next Rotation:</b> <DisplayDate time={nextOccurence} />
          </>
        ) : (
          `Every ${formatDayOfMonth(day)} of the month at ${hour}:00 UTC`
        )}
      </li>
      {isClient && (
        <li>
          <b>In:</b> <DisplayDelta time={nextOccurence} />
        </li>
      )}
    </>
  );
}

export function ShopInventory({ inventory }: ShopInventoryProps) {
  return (
    <TimerListItem title={inventory.title}>
      {inventory.date && <LimitedInventoryTimer date={inventory.date} />}
      {typeof inventory.day == "number" &&
        typeof inventory.hour == "number" && (
          <MonthlyInventoryTimer day={inventory.day} hour={inventory.hour} />
        )}
      <ShopInventoryList
        items={inventory.items}
        currency={inventory.currency}
      />
    </TimerListItem>
  );
}
