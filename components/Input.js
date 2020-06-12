import React, { useRef, useState } from "reactn";
import {
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
} from "react-native";
import Title from "./Title";
import HelperText from "./HelperText";

export default function Input({
  style = {},
  label = null,
  description = null,
  ...props
}) {
  const inputEl = useRef();
  const [isFocused, setIsFocused] = useState(false);

  const handlePress = () => {
    inputEl.current.focus();
  };
  const focusUp = (e) => {
    setIsFocused(true);
  };
  const focusOff = (e) => {
    setIsFocused(false);
  };

  return (
    <TouchableOpacity
      style={[inputStyles.wrapper, style]}
      onPress={handlePress}
    >
      {label && <Title text={label} />}
      <TextInput
        {...props}
        style={[inputStyles.input, isFocused ? inputStyles.focus : {}]}
        ref={inputEl}
        numberOfLines={props.multiline ? 2 : 1}
        placeholdercolor={"#FFFFFFb7"}
        onFocus={focusUp}
        onBlur={focusOff}
      />
      {description && (
        <HelperText text={description} style={{ marginBottom: 0 }} />
      )}
    </TouchableOpacity>
  );
}

const inputStyles = StyleSheet.create({
  wrapper: {
    borderColor: "transparent",
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: 20,
    overflow: "hidden",
    ...Platform.select({
      web: {
        outlineStyle: "none",
      },
    }),
  },
  input: {
    color: "#FFF",
    fontSize: 15,
    width: "100%",
    backgroundColor: "#282A38",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    padding: 10,
    marginBottom: 10,
    justifyContent: "flex-start",
    textAlignVertical: "top",
    borderRadius: 3,
    fontFamily: "SpaceGrotesk",
    ...Platform.select({
      web: {
        outlineStyle: "none",
      },
    }),
  },
  focus: {
    backgroundColor: "#2F3242",
  },
});
