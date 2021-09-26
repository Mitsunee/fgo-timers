import styles from "./FormField.module.css";

export default function FormField({ children, label, htmlFor }) {
  return (
    <div className={styles.formField}>
      {label && <label htmlFor={htmlFor}>{label}</label>}
      {children}
    </div>
  );
}
