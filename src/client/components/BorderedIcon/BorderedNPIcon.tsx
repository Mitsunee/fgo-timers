import { useNPMap } from "~/client/contexts";
import { ServantCard } from "~/servants/types";
import type { BundledNoblePhantasm } from "~/servants/types";
import type { ComponentPropsCC } from "~/types/ComponentProps";
import { BorderedIcon } from "./BorderedIcon";
import { IconFace } from "./IconFace";

interface BorderedNPIconProps extends ComponentPropsCC<"div"> {
  npId: number;
  title?: undefined;
}

function getNPIconPath(type: BundledNoblePhantasm["type"]): string {
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
  npId,
  ...props
}: BorderedNPIconProps) {
  const npMap = useNPMap();
  const np: BundledNoblePhantasm = npMap[npId];
  const icon = getNPIconPath(np.type);

  return (
    <BorderedIcon {...props} border={np.border}>
      <IconFace
        id={npId}
        name={np.name}
        src={icon}
        placeholder={`Noble Phantasm`}
        na={np.na}
        forceIcon
      />
      {children}
    </BorderedIcon>
  );
}
