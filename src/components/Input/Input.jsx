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
  const checkIsInvalid =
    isInvalid === true ||
    (typeof customValidation === "function" &&
      customValidation(value) === false);
  const classNames = [styles.input];
  if (checkIsInvalid) classNames.push(styles.invalid);
  if (className) classNames.push(className);

  const commonProps = {
    id: id,
    name: id,
    value: value,
    className: classNames.join(" "),
    "data-input-invalid": checkIsInvalid ? "true" : undefined,
    required: required ? true : undefined
  };

  return type === "textarea" ? (
    <textarea {...commonProps} {...props} />
  ) : (
    <input type={type} {...commonProps} {...props} />
  );
}
