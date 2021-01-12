import { useState, useRef } from "react";

export default function useFocus() {
  // attach the ref to the input/element we want to have focus
  const ref = useRef();

  // use isFocused to conditionally render visual feedback for being focused
  const [isFocused, setIsFocused] = useState(false);

  // apply this function to any onPress-able element that can focus the thing we're targeting
  const handlePress = () => {
    ref.current.focus();
  };

  // attach this to the onFocus event
  const focusUp = () => {
    setIsFocused(true);
  };

  // attach this to the onBlur event
  const focusOff = () => {
    setIsFocused(false);
  };

  return { ref, isFocused, handlePress, focusUp, focusOff };
}
