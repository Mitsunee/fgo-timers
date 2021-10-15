//import styles from "./UpgradeCard.module.css";
import { Card } from "@components/Card";
import { borderColors, backgroundColors } from "@styles/fgoIconTheme";
import { toTitleCase } from "@utils/toTitleCase";

export default function UpgradeCard({
  //target,
  quest,
  servant,
  //initial,
  skill,
  np
}) {
  const background = backgroundColors.get(
    skill?.border || np?.border || "blue"
  );
  const border = borderColors.get(skill?.border || np?.border || "blue");

  return (
    <Card
      title={`${servant.name}${
        skill ? ` Skill ${skill.num}` : np ? ` NP` : ""
      }`}
      icon={servant.icon}
      forceRoundIcon
      border={border}
      background={background}>
      {quest.name} ({toTitleCase(quest.type)})
    </Card>
  );
}
