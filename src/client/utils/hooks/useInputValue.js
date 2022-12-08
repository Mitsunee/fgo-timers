import { useState } from "react";

// TODO: phase out untyped hook
export function useInputValue(initialValue = "") {
  const [value, setValue] = useState(initialValue);

  const handleInput = event => setValue(event.target.value);

  return [value, handleInput];
}
