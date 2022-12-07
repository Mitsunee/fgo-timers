// TODO: phase out this component in favour of new typed component in ../Input
import { useState, useEffect } from "react";
//import styles from "./InputNumber.module.css";
import Input from "@components/Input";

export default function InputNumber({
  value,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  ...props
}) {
  const [isInvalid, setIsInvalid] = useState(false);

  useEffect(() => {
    setIsInvalid(value < min || value > max);
  }, [value, min, max]);

  return (
    <Input
      type="number"
      value={value}
      isInvalid={isInvalid}
      min={min}
      max={max}
      {...props}
    />
  );
}
