import { useRecurringEvent } from "src/client/utils/hooks/useRecurringEvent";
import { useIsClient } from "src/client/utils/hooks/useIsClient";
import Meta from "src/client/components/Meta";
import { DataContext } from "src/client/contexts";
import Headline from "src/client/components/Headline";
import Section from "src/client/components/Section";
import { DisplayDelta } from "src/client/components/TimeDisplay";
import { formatDayOfMonth } from "src/time/formatDayOfMonth";
import { ShopLinkButton } from "src/pages/ShopsPage/components/ShopLinkButton";
import type { ShopsPageProps } from "src/pages/ShopsPage/static";
import styles from "src/pages/ShopsPage/ShopsPage.module.css";

export { getStaticProps } from "src/pages/ShopsPage/static";

export default function ShopsPage({ items, resets }: ShopsPageProps) {
  const isClient = useIsClient();
  const mpNext = useRecurringEvent(resets.mp);
  const rpNext = useRecurringEvent(resets.rp);

  return (
    <DataContext items={items}>
      <Meta
        title="Shops"
        description="Overview of Shops available in the Global version of Fate/Grand Order"
      />
      <Headline>Shops</Headline>
      <Section className={styles.grid}>
        <ShopLinkButton id={3} slug="mana-prism" title="Mana Prism Shop">
          <b>Monthly Shop Reset:</b>
          <span>
            {isClient ? (
              <DisplayDelta time={mpNext} />
            ) : (
              `Every ${formatDayOfMonth(resets.mp.day)} at ${
                resets.mp.hour
              }:00 UTC`
            )}
          </span>
        </ShopLinkButton>
        <ShopLinkButton id={18} slug="rare-prism" title="Rare Prism Shop">
          <b>Monthly Shop Reset:</b>
          <span>
            {isClient ? (
              <DisplayDelta time={rpNext} />
            ) : (
              `Every ${formatDayOfMonth(resets.rp.day)} at ${
                resets.rp.hour
              }:00 UTC`
            )}
          </span>
        </ShopLinkButton>
        <ShopLinkButton id={46} slug="pure-prism" title="Pure Prism Shop" />
      </Section>
    </DataContext>
  );
}
