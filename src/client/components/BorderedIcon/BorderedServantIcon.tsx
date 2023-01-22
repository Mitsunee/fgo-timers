import { nameServantClass } from "src/servants/classNames";
import type { BundledServant } from "src/servants/types";
import type { ComponentPropsCC } from "src/types/ComponentProps";
import { BorderedIcon } from "./BorderedIcon";
import { BorderedIconAvailability } from "./BorderedIconAvailability";
import { BorderedIconClass } from "./BorderedIconClass";
import { BorderedIconRarity } from "./BorderedIconRarity";
import { IconFace } from "./IconFace";

interface BorderedServantIconProps
  extends ComponentPropsCC<"div">,
    BundledServant {
  showRarity?: boolean;
  showAvailability?: boolean;
  showClass?: boolean;
  title?: undefined;
  servantId: number;
  disableSpoilers?: boolean;
}

export function BorderedServantIcon({
  children,
  showRarity,
  showAvailability,
  showClass,
  servantId,
  name,
  icon,
  classId,
  rarity,
  na,
  disableSpoilers,
  availability,
  ...props
}: BorderedServantIconProps) {
  const servant: BundledServant = {
    name,
    icon,
    classId,
    border: props.border,
    rarity
  };
  if (na) servant.na = true;
  if (availability) servant.availability = availability;
  const classDisplay = nameServantClass(servant.classId);

  return (
    <BorderedIcon
      {...props}
      forceBig={showRarity || showAvailability || showClass}>
      <IconFace
        id={servantId}
        name={servant.name}
        src={servant.icon}
        placeholder={`${servant.rarity}* ${classDisplay} Servant`}
        na={servant.na}
        forceIcon={disableSpoilers}
      />
      {showAvailability && (
        <BorderedIconAvailability availability={servant.availability} />
      )}
      {showClass && (
        <BorderedIconClass classId={servant.classId} rarity={rarity} />
      )}
      {showRarity && <BorderedIconRarity rarity={servant.rarity} />}
      {children}
    </BorderedIcon>
  );
}
