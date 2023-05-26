import { useCEMap } from "~/client/contexts";
import type { ComponentPropsCC } from "~/types/ComponentProps";
import { BorderedIcon } from "./BorderedIcon";
import { BorderedIconAvailability } from "./BorderedIconAvailability";
import { BorderedIconRarity } from "./BorderedIconRarity";
import { IconFace } from "./IconFace";

interface BorderedCEIconProps extends ComponentPropsCC<"div"> {
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
  disableSpoilers,
  ...props
}: BorderedCEIconProps) {
  const ceMap = useCEMap();
  const ce = ceMap[ceId];

  return (
    <BorderedIcon {...props} border={ce.border} forceBig={showAvailability}>
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
