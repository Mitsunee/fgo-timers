import styles from "./Input.module.css";

export default function Input({
  type = "text",
  id,
  value,
  className,
  isInvalid,
  customValidation,
  required,
  ...props
}) {
  const classNames = [styles.input];
  if (
    isInvalid === true ||
    (typeof customValidation === "function" &&
      customValidation(value) === false)
  ) {
    classNames.push(styles.invalid);
  }
  if (className) classNames.push(className);

  return type === "textarea" ? (
    <textarea
      id={id}
      name={id}
      value={value}
      className={classNames.join(" ")}
      required={required ? "true" : undefined}
      {...props}
    />
  ) : (
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      className={classNames.join(" ")}
      required={required ? "true" : undefined}
      {...props}
    />
  );
}
