import { TimerList } from "src/client/components/Card";
import Section from "src/client/components/Section";
import { BorderColours } from "src/types/borders";
import type { AnyShopInventory, BundledShop } from "src/schema/ShopSchema";
import { ShopInventory } from "./ShopInventory";

interface ShopInventorySectionProps {
  inventories: AnyShopInventory[];
  color: BundledShop["color"];
}

export function ShopInventorySection({
  inventories,
  color
}: ShopInventorySectionProps) {
  const borderColor = BorderColours[color];
  return (
    <Section background="blue" style={{ borderColor }}>
      <TimerList>
        {inventories.map((inventory, idx) => (
          <ShopInventory key={idx} inventory={inventory} />
        ))}
      </TimerList>
    </Section>
  );
}
