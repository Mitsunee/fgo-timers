import { BundledCE } from "src/items/types";
import { ComponentPropsCC } from "src/types/ComponentProps";
import { BorderedIcon } from "./BorderedIcon";
import { IconFace } from "./IconFace";

interface BorderedCEIconProps extends ComponentPropsCC<"div">, BundledCE {
  //showAvailability: boolean;
  title?: undefined;
  ceId: number;
}

export function BorderedCEIcon({
  children,
  //showAvailability,
  ceId,
  name,
  icon,
  na,
  ...props
}: BorderedCEIconProps) {
  const ce: BundledCE = { name, icon, border: props.border };
  if (na) ce.na = true;

  return (
    <BorderedIcon
      {...props}
      /*forceBig={showAvailability}*/
    >
      <IconFace
        id={ceId}
        name={ce.name}
        src={ce.icon}
        placeholder="Craft Essence"
        na={ce.na}
      />
      {/* TODO: BorderedIconAvailability component*/}
      {children}
    </BorderedIcon>
  );
}
