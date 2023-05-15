import type { BundledSkill } from "src/servants/types";
import type { ComponentPropsCC } from "src/types/ComponentProps";
import { BorderedIcon } from "./BorderedIcon";
import { IconFace } from "./IconFace";
import { useSkillMap } from "src/client/contexts";
import { getSkillNum } from "src/servants/getSkillNum";

interface BorderedSkillIconProps extends ComponentPropsCC<"div"> {
  skillId: number;
  servantId: number;
  title?: undefined;
  disableSpoilers?: boolean;
}

export function BorderedSkillIcon({
  children,
  disableSpoilers,
  skillId,
  servantId,
  ...props
}: BorderedSkillIconProps) {
  const skillMap = useSkillMap();
  const skill: BundledSkill = skillMap[skillId];
  const skillNum = getSkillNum(skill, servantId);

  return (
    <BorderedIcon {...props} border={skill.border}>
      <IconFace
        id={skillId}
        name={skill.name}
        src={skill.icon}
        placeholder={`Skill ${skillNum}`}
        na={skill.na}
        forceIcon={disableSpoilers}
      />
      {children}
    </BorderedIcon>
  );
}
