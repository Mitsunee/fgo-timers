import Link from "next/link";
import { Card, TimerList, TimerListItem } from "~/components/Card";
import { DisplayDate, DisplayDelta } from "~/components/TimeDisplay";
import { useCurrentTime } from "~/hooks/useCurrentTime";
import { useIsClient } from "~/hooks/useIsClient";
import { useRecurringMonthly } from "~/hooks/useRecurringMonthly";
import { Borders } from "~/types/borders";
import type { ShopInfo } from "~/pages/HomePage/static/getShopInfoProps";

interface ShopsInfoCardProps {
  shops: ShopInfo[];
}

interface MonthlyInfoProps {
  monthly: NonNullable<ShopInfo["monthly"]>[number];
}

interface LimitedInfoProps {
  limited: NonNullable<ShopInfo["limited"]>[number];
}

function MonthlyInfo({ monthly }: MonthlyInfoProps) {
  const isClient = useIsClient();
  const next = useRecurringMonthly({ day: monthly.day, hour: monthly.hour });

  return (
    <>
      {monthly.title && (
        <li data-wide>
          <h4>{monthly.title}</h4>
        </li>
      )}
      <li data-wide={isClient ? undefined : true}>
        <b>Next:</b> <DisplayDate time={isClient ? next : monthly.next} />
      </li>
      {isClient && (
        <li>
          <b>In:</b> <DisplayDelta time={next} />
        </li>
      )}
    </>
  );
}

function LimitedInfo({ limited }: LimitedInfoProps) {
  const { current } = useCurrentTime();
  const isClient = useIsClient();

  const [start, end] = limited.date;
  const isUpcoming = isClient && current < start;
  const hasStarted = isClient && current >= start;
  const isOngoing = hasStarted && current < end;
  const hasEnded = isClient && current >= end;

  return (
    <>
      {limited.title && (
        <li data-wide>
          <h4>{limited.title}</h4>
        </li>
      )}
      <li data-wide={isUpcoming ? undefined : true}>
        <b>Start{hasStarted ? "ed" : "s"}:</b> <DisplayDate time={start} />
      </li>
      {isUpcoming && (
        <li>
          <b>In:</b> <DisplayDelta time={start} />
        </li>
      )}
      <li data-wide={isOngoing ? undefined : true}>
        <b>End{hasEnded ? "ed" : "s"}:</b> <DisplayDate time={end} />
      </li>
      {isOngoing && (
        <li>
          <b>In:</b> <DisplayDelta time={end} />
        </li>
      )}
    </>
  );
}

export function ShopsInfoCard({ shops }: ShopsInfoCardProps) {
  return (
    <Card
      title="Shops"
      icon="/assets/icon_prisms.png"
      color={Borders.GOLD}
      id="shops">
      <TimerList>
        {shops.map(shop => (
          <TimerListItem key={shop.slug} title={shop.title}>
            {shop.monthly && (
              <>
                <li data-wide>
                  <h3>
                    Monthly Inventor{shop.monthly.length > 1 ? "ies" : "y"}
                  </h3>
                </li>
                {shop.monthly.map((monthly, idx) => (
                  <MonthlyInfo key={idx} monthly={monthly} />
                ))}
              </>
            )}
            {shop.limited && shop.limited.length > 0 && (
              <>
                <li data-wide>
                  <h3>
                    Limited Inventor{shop.limited.length > 1 ? "ies" : "y"}
                  </h3>
                </li>
                {shop.limited.map((limited, idx) => (
                  <LimitedInfo key={idx} limited={limited} />
                ))}
              </>
            )}
            <li data-wide>
              See <Link href={`/shops/${shop.slug}`}>{shop.title}</Link> for
              more information
            </li>
          </TimerListItem>
        ))}
      </TimerList>
    </Card>
  );
}
