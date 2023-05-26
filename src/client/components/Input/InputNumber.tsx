import { isClamped } from "@foxkit/util/clamp";
import type { ComponentPropsCC } from "~/types/ComponentProps";
import { Input } from "./Input";

interface InputNumberProps
  extends Omit<ComponentPropsCC<"input">, "value" | "min" | "max" | "type"> {
  value: number;
  min?: number;
  max?: number;
  forceInt?: true;
}

export function InputNumber({
  value,
  min,
  max,
  forceInt,
  ...props
}: InputNumberProps) {
  const clampCheck = isClamped({ value, min, max });
  const intCheck = forceInt ? Number.isInteger(value) : true;
  const isInvalid = !(clampCheck && intCheck);

  return (
    <Input<number>
      type="number"
      {...props}
      value={value}
      min={min}
      max={max}
      isInvalid={isInvalid}
    />
  );
}
