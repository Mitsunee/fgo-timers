import { BundledNP, ServantCard } from "src/servants/types";
import type { ComponentPropsCC } from "src/types/ComponentProps";
import { BorderedIcon } from "./BorderedIcon";
import { IconFace } from "./IconFace";

interface BorderedNPIconProps extends ComponentPropsCC<"div">, BundledNP {
  npId: number;
  title?: undefined;
}

function getNPIconPath(type: BundledNP["type"]): string {
  switch (type) {
    case ServantCard.BUSTER:
      return "/assets/icon_buster.png";
    case ServantCard.ARTS:
      return "/assets/icon_arts.png";
    case ServantCard.QUICK:
      return "/assets/icon_quick.png";
  }
}

export function BorderedNPIcon({
  children,
  name,
  type,
  na,
  npId,
  ...props
}: BorderedNPIconProps) {
  const np: BundledNP = {
    name,
    type,
    border: props.border,
    na
  };
  const icon = getNPIconPath(np.type);

  return (
    <BorderedIcon {...props}>
      <IconFace
        id={npId}
        name={np.name}
        src={icon}
        placeholder={`Noble Phantasm`}
        na={true} // FIXME: this leaks the name in strict mode I think
      />
      {children}
    </BorderedIcon>
  );
}
