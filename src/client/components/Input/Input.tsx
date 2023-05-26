import cc from "classcat";
import type { ComponentPropsCC } from "~/types/ComponentProps";
import styles from "./Input.module.css";

interface SharedProps<T extends Stringable> {
  isInvalid?: boolean;
  customValidation?: (val: T) => boolean;
  required?: boolean;
}
interface InputProps<T extends Stringable>
  extends SharedProps<T>,
    Omit<ComponentPropsCC<"input">, "value"> {
  type: string;
  value: T;
}
interface TextAreaProps<T extends Stringable>
  extends SharedProps<T>,
    Omit<ComponentPropsCC<"textarea">, "value"> {
  type: "textarea";
  value: T;
}

function isInput<T extends Stringable>(
  props: InputProps<T> | TextAreaProps<T>
): props is InputProps<T> {
  return props.type !== "textarea";
}

export function Input<T extends Stringable>(
  props: InputProps<T> | TextAreaProps<T>
) {
  if (isInput(props)) {
    const { value, customValidation, isInvalid, className, ...passedProps } =
      props;
    const checkIsInvalid = isInvalid || customValidation?.(value) === false;
    return (
      <input
        {...passedProps}
        name={props.name || props.id}
        value={`${value}`}
        className={cc([
          styles.input,
          checkIsInvalid && styles.invalid,
          className
        ])}
        data-input-invalid={checkIsInvalid ? "true" : undefined}
      />
    );
  }

  const {
    value,
    customValidation,
    isInvalid,
    className,
    type: _type,
    ...passedProps
  } = props;
  const checkIsInvalid = isInvalid || customValidation?.(value) === false;

  return (
    <textarea
      {...passedProps}
      name={props.name || props.id}
      value={`${value}`}
      className={cc([
        styles.input,
        checkIsInvalid && styles.invalid,
        className
      ])}
      data-input-invalid={checkIsInvalid ? "true" : undefined}
    />
  );
}
