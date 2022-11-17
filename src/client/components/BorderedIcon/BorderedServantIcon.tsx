import type { BundledServant } from "src/servants/types";
import type { ComponentPropsCC } from "src/types/ComponentProps";
import { BorderedIcon } from "./BorderedIcon";
import { BorderedIconClass } from "./BorderedIconClass";
import { BorderedIconRarity } from "./BorderedIconRarity";
import { IconFace } from "./IconFace";

interface BorderedServantIconProps
  extends ComponentPropsCC<"div">,
    BundledServant {
  showRarity?: boolean;
  //showAvailablity?: boolean;
  showClass?: boolean;
  title?: undefined;
  servantId: number;
}

export function BorderedServantIcon({
  children,
  showRarity,
  //showAvailability, // TODO
  showClass,
  servantId,
  name,
  search,
  icon,
  classId,
  rarity,
  na,
  availability,
  ...props
}: BorderedServantIconProps) {
  const servant: BundledServant = {
    name,
    search,
    icon,
    classId,
    border: props.border,
    rarity,
    availability
  };
  if (na) servant.na = true;

  return (
    <BorderedIcon
      {...props}
      forceBig={showRarity /*|| showAvailability*/ || showClass}>
      <IconFace
        id={servantId}
        name={servant.name}
        src={servant.icon}
        placeholder="Servant"
        na={servant.na}
      />
      {/* TODO: BorderedIconAvailability component*/}
      {showClass && <BorderedIconClass classId={servant.classId} />}
      {showRarity && <BorderedIconRarity rarity={servant.rarity} />}
      {children}
    </BorderedIcon>
  );
}
