//import styles from "./UpgradeCard.module.css";
/*import { Card } from "@components/Card";

const colorMap = new Map([
  ["black", {}],
  ["gold", { border: "#f0ce02", background: "#f9e677" }],
  ["red", { border: "#e22b52", background: "" }],
  ["sq", { border: "#1e7552", background: "#71ca8a" }]
]);*/

export default function UpgradeCard({
  target,
  quest,
  servant,
  //initial,
  skill
  //np
}) {
  //const background = backgrounds.get(skill?.border || np?.border || "green");
  //const border = borderColors.get(skill?.border || np?.border || "green");

  if (target === "np") {
    return (
      <li>
        {servant.name} - NP - {quest.id}: {quest.name}
      </li>
    );
  }

  if (target === "skill") {
    return (
      <li>
        {servant.name} - S{skill.num} - {quest.id}: {quest.name}
      </li>
    );
  }

  return (
    <li>
      {servant.name} - SQ - {quest.id}: {quest.name}
    </li>
  );

  /*return (
    <Card
      icon={servant.icon}
      title={quest.name}
      background={background}
      border={border}
      forceRoundIcon>
      // TODO: UpgradeCard Card design and layout
      </Card>
  );*/
}
