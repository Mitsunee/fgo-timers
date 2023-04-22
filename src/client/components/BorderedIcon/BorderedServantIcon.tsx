import { nameServantClass } from "src/servants/classNames";
import type { ComponentPropsCC } from "src/types/ComponentProps";
import { useServantMap } from "src/client/contexts";
import { BorderedIcon } from "./BorderedIcon";
import { BorderedIconAvailability } from "./BorderedIconAvailability";
import { BorderedIconClass } from "./BorderedIconClass";
import { BorderedIconRarity } from "./BorderedIconRarity";
import { IconFace } from "./IconFace";

interface BorderedServantIconProps extends ComponentPropsCC<"div"> {
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
  disableSpoilers,
  ...props
}: BorderedServantIconProps) {
  const servantMap = useServantMap();
  const servant = servantMap[servantId];
  const classDisplay = nameServantClass(servant.classId);

  return (
    <BorderedIcon
      {...props}
      border={servant.border}
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
        <BorderedIconClass classId={servant.classId} rarity={servant.rarity} />
      )}
      {showRarity && <BorderedIconRarity rarity={servant.rarity} />}
      {children}
    </BorderedIcon>
  );
}
