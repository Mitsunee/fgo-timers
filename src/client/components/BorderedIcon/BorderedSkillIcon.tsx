import { useSkillMap } from "~/client/contexts";
import { getSkillNum } from "~/servants/getSkillNum";
import type { BundledSkill } from "~/servants/types";
import type { ComponentPropsCC } from "~/types/ComponentProps";
import { BorderedIcon } from "./BorderedIcon";
import { IconFace } from "./IconFace";

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
