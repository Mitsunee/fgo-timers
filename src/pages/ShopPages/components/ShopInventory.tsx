import type { AnyShopInventory } from "src/schema/ShopSchema";
import { useIsClient } from "src/client/utils/hooks/useIsClient";
import { useCurrentTime } from "src/client/utils/hooks/useCurrentTime";
import { DisplayDate, DisplayDelta } from "src/client/components/TimeDisplay";
import { TimerListItem } from "src/client/components/Card";
import { ShopInventoryList } from "./ShopInventoryList";

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

export function ShopInventory({ inventory }: ShopInventoryProps) {
  return (
    <TimerListItem title={inventory.title}>
      {inventory.date && <LimitedInventoryTimer date={inventory.date} />}
      {/* TODO: MonthlyInventoryTimer */}
      <ShopInventoryList
        items={inventory.items}
        currency={inventory.currency}
      />
    </TimerListItem>
  );
}
