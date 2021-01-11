import { useState, useRef } from "react";

export default function useFocus() {
  const inputEl = useRef();
  const [isFocused, setIsFocused] = useState(false);

  const handlePress = () => {
    inputEl.current.focus();
  };
  const focusUp = () => {
    setIsFocused(true);
  };
  const focusOff = () => {
    setIsFocused(false);
  };

  return { inputEl, isFocused, handlePress, focusUp, focusOff };
}
