import type { BundledSkill } from "src/servants/types";
import type { ComponentPropsCC } from "src/types/ComponentProps";
import { BorderedIcon } from "./BorderedIcon";
import { IconFace } from "./IconFace";

interface BorderedSkillIconProps extends ComponentPropsCC<"div">, BundledSkill {
  skillId: number;
  title?: undefined;
}

export function BorderedSkillIcon({
  children,
  name,
  num,
  icon,
  na,
  skillId,
  ...props
}: BorderedSkillIconProps) {
  const skill: BundledSkill = {
    name,
    num,
    icon,
    border: props.border
  };
  if (na) skill.na = true;

  return (
    <BorderedIcon {...props}>
      <IconFace
        id={skillId}
        name={skill.name}
        src={skill.icon}
        placeholder={`Skill ${skill.num}`}
        na={skill.na}
      />
      {children}
    </BorderedIcon>
  );
}
