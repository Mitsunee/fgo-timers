import { TimerList } from "~/components/Card";
import Section from "~/components/Section";
import { BorderColours } from "~/types/borders";
import type { AnyShopInventory } from "~/schema/ShopSchema";
import type { BundledShop } from "~/shops/types";
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
