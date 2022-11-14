import type { BundledServant } from "src/servants/types";
import type { ComponentPropsCC } from "src/types/ComponentProps";
import { BorderedIcon } from "./BorderedIcon";
import { BorderedIconClass } from "./BorderedIconClass";
import { BorderedIconRarity } from "./BorderedIconRarity";

interface BorderedServantIconProps
  extends ComponentPropsCC<"div">,
    BundledServant {
  showRarity?: boolean;
  //showAvailablity?: boolean;
  showClass?: boolean;
  title?: undefined;
}

export function BorderedServantIcon({
  showRarity,
  //showAvailability, // TODO
  showClass,
  name,
  search,
  icon,
  classId,
  rarity,
  na,
  availability,
  ...props
}: BorderedServantIconProps) {
  const servant = {
    name,
    search,
    icon,
    classId,
    border: props.border,
    rarity,
    na,
    availability
  };

  return (
    <BorderedIcon
      {...props}
      title={servant.name} // TODO: consider spoilers
      forceBig={showRarity /*|| showAvailability*/ || showClass}>
      {/* TODO: BorderedIconFace component*/}
      {/* TODO: BorderedIconAvailability component*/}
      {showClass && <BorderedIconClass classId={servant.classId} />}
      {showRarity && <BorderedIconRarity rarity={servant.rarity} />}
    </BorderedIcon>
  );
}
