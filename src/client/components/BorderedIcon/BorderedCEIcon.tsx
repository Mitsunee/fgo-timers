import type { BundledCE } from "src/items/types";
import type { ComponentPropsCC } from "src/types/ComponentProps";
import { BorderedIcon } from "./BorderedIcon";
import { BorderedIconAvailability } from "./BorderedIconAvailability";
import { BorderedIconRarity } from "./BorderedIconRarity";
import { IconFace } from "./IconFace";

interface BorderedCEIconProps extends ComponentPropsCC<"div">, BundledCE {
  showAvailability?: boolean;
  showRarity?: boolean;
  title?: undefined;
  ceId: number;
  disableSpoilers?: boolean;
}

export function BorderedCEIcon({
  children,
  showAvailability,
  showRarity,
  ceId,
  name,
  icon,
  rarity,
  na,
  disableSpoilers,
  availability,
  ...props
}: BorderedCEIconProps) {
  const ce: BundledCE = { name, icon, rarity, border: props.border };
  if (na) ce.na = true;
  if (availability) ce.availability = availability;

  return (
    <BorderedIcon {...props} forceBig={showAvailability}>
      <IconFace
        id={ceId}
        name={ce.name}
        src={ce.icon}
        placeholder={`${ce.rarity}* Craft Essence`}
        na={ce.na}
        forceIcon={disableSpoilers}
      />
      {showAvailability && (
        <BorderedIconAvailability availability={ce.availability} />
      )}
      {showRarity && <BorderedIconRarity rarity={ce.rarity} />}
      {children}
    </BorderedIcon>
  );
}
