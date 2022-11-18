import { BundledCE } from "src/items/types";
import { ComponentPropsCC } from "src/types/ComponentProps";
import { BorderedIcon } from "./BorderedIcon";
import { BorderedIconAvailability } from "./BorderedIconAvailability";
import { IconFace } from "./IconFace";

interface BorderedCEIconProps extends ComponentPropsCC<"div">, BundledCE {
  showAvailability: boolean;
  title?: undefined;
  ceId: number;
}

export function BorderedCEIcon({
  children,
  showAvailability,
  ceId,
  name,
  icon,
  rarity,
  na,
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
      />
      {showAvailability && (
        <BorderedIconAvailability availability={ce.availability} />
      )}
      {children}
    </BorderedIcon>
  );
}
