import React from "react";
import cc from "classcat";
import { ActionButton } from "@components/Button";
import type { OptionalButtonIconProps } from "@components/Button";
import type { ComponentPropsCC } from "~/types/ComponentProps";
import styles from "./Selector.module.css";

export type SelectorOption<T> = {
  value: T;
  label?: React.ReactNode;
} & OptionalButtonIconProps;

interface SelectorProps<T> extends Omit<ComponentPropsCC<"div">, "onChange"> {
  options: SelectorOption<T>[];
  onChange: (value: T) => void;
  value: T;
}

export function Selector<T>({
  options,
  onChange,
  value,
  className
}: SelectorProps<T>) {
  return (
    <div className={cc([styles.select, className])}>
      {options.map(({ value: optionValue, label, ...iconProps }, idx) => (
        <ActionButton
          key={`${optionValue}-${idx}`}
          onClick={() => onChange(optionValue)}
          className={[
            styles.button,
            optionValue === value ? styles.selected : styles.unselected
          ]}
          {...iconProps}>
          {label}
        </ActionButton>
      ))}
    </div>
  );
}
