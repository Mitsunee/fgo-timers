import Section from "src/client/components/Section";
import { TimerList } from "src/client/components/Card";
import type { AnyShopInventory } from "src/schema/ShopSchema";
import { ShopInventory } from "./ShopInventory";

interface ShopInventorySectionProps {
  inventories: AnyShopInventory[];
}

export function ShopInventorySection({
  inventories
}: ShopInventorySectionProps) {
  return (
    <Section background="blue">
      <TimerList>
        {inventories.map((inventory, idx) => (
          <ShopInventory key={idx} inventory={inventory} />
        ))}
      </TimerList>
    </Section>
  );
}
