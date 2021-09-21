import { useState } from "react";

export function useInputValue(initialValue = "") {
  const [value, setValue] = useState(initialValue);

  const handleInput = event => setValue(event.target.value);

  return [value, handleInput];
}
