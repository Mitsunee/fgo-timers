import styles from "./CardHero.module.css";
import CardHeroIcon from "./CardHeroIcon";

export default function CardHero({
  icon,
  background,
  backgroundImage,
  title,
  forceRoundIcon
}) {
  const style = {
    backgroundColor: background ?? "white"
  };
  if (backgroundImage) style.backgroundImage = `url("${backgroundImage}")`;

  return (
    <header className={styles.hero} style={style}>
      {icon && (
        <CardHeroIcon icon={icon} alt={title} forceRoundIcon={forceRoundIcon} />
      )}
    </header>
  );
}
