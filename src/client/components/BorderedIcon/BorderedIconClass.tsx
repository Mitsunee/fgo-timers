import type ClassName from "@atlasacademy/api-connector/dist/Enum/ClassName.js";
import { getClassIconPath, nameServantClass } from "~/servants/classNames";
import styles from "./BorderedIconClass.module.css";

interface BorderedIconClassProps {
  classId: ClassName;
  rarity?: number;
}

export function BorderedIconClass({ classId, rarity }: BorderedIconClassProps) {
  const name = nameServantClass(classId);
  const path = getClassIconPath(classId, rarity);

  return <img src={path} className={styles.icon} alt={name} title={name} />;
}
