import { useCostumeMap } from "src/client/contexts";
import type { ComponentPropsCC } from "src/types/ComponentProps";
import { BorderedIcon } from "./BorderedIcon";
import { IconFace } from "./IconFace";

interface BorderedCostumeIconProps extends ComponentPropsCC<"div"> {
  title?: undefined;
  costumeId: number;
  disableSpoilers?: boolean;
}

export function BorderedCostumeIcon({
  children,
  costumeId,
  disableSpoilers,
  ...props
}: BorderedCostumeIconProps) {
  const costumeMap = useCostumeMap();
  const costume = costumeMap[costumeId];

  return (
    <BorderedIcon {...props} border={costume.border}>
      <IconFace
        id={costumeId}
        name={costume.name}
        src={costume.icon}
        placeholder="Costume"
        na={costume.na}
        forceIcon={disableSpoilers}
      />
      {children}
    </BorderedIcon>
  );
}
