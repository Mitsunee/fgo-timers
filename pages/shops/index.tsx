import Headline from "~/client/components/Headline";
import Meta from "~/client/components/Meta";
import Section from "~/client/components/Section";
import { DisplayDelta } from "~/client/components/TimeDisplay";
import { DataContext } from "~/client/contexts";
import { useIsClient } from "~/client/utils/hooks/useIsClient";
import { useRecurringMonthly } from "~/client/utils/hooks/useRecurringMonthly";
import { ShopLinkButton } from "~/pages/ShopsPage/components/ShopLinkButton";
import { formatDayOfMonth } from "~/time/formatDayOfMonth";
import type { ShopsPageProps } from "~/pages/ShopsPage/static";
import styles from "~/pages/ShopsPage/ShopsPage.module.css";

export { getStaticProps } from "~/pages/ShopsPage/static";

export default function ShopsPage({ items, resets }: ShopsPageProps) {
  const isClient = useIsClient();
  const mpNext = useRecurringMonthly(resets.mp);
  const rpNext = useRecurringMonthly(resets.rp);

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
        <ShopLinkButton id={80059} slug="dress-making" title="Dress Making" />
      </Section>
    </DataContext>
  );
}
