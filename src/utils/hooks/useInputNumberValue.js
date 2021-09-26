import { useState } from "react";

export function useInputNumberValue(initialValue = 0) {
  const [value, setValue] = useState(+initialValue);

  const handleInput = event => {
    const input = event.target.value;
    setValue(+input.replace(/[^0-9]/g, ""));
  };

  return [value, handleInput];
}
