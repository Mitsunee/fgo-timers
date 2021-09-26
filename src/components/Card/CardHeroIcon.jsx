import styles from "./CardHeroIcon.module.css";

export default function CardHeroIcon({ icon, alt }) {
  return (
    <div className={styles.wrapper}>
      <img src={icon} alt={alt} />
    </div>
  );
}
