import type { BundledSkill } from "src/servants/types";
import type { ComponentPropsCC } from "src/types/ComponentProps";
import { BorderedIcon } from "./BorderedIcon";
import { IconFace } from "./IconFace";
import { useSkillMap } from "src/client/contexts";

interface BorderedSkillIconProps extends ComponentPropsCC<"div"> {
  skillId: number;
  title?: undefined;
  disableSpoilers?: boolean;
}

export function BorderedSkillIcon({
  children,
  disableSpoilers,
  skillId,
  ...props
}: BorderedSkillIconProps) {
  const skillMap = useSkillMap();
  const skill: BundledSkill = skillMap[skillId];

  return (
    <BorderedIcon {...props} border={skill.border}>
      <IconFace
        id={skillId}
        name={skill.name}
        src={skill.icon}
        placeholder={`Skill ${skill.num}`}
        na={skill.na}
        forceIcon={disableSpoilers}
      />
      {children}
    </BorderedIcon>
  );
}
