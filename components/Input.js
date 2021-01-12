import React from "reactn";
import {
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
} from "react-native";
import Title from "./Title";
import HelperText from "./HelperText";
import useFocus from "../utils/useFocus";

export default function Input({
  style = {},
  label = null,
  description = null,
  textStyle = {},
  nextSibling = null,
  ...props
}) {
  const { ref, isFocused, handlePress, focusUp, focusOff } = useFocus();

  return (
    <TouchableOpacity
      style={[inputStyles.wrapper, style]}
      onPress={handlePress}
      onFocus={focusUp}
      onBlur={focusOff}
      accessible={false}
    >
      {label && <Title text={label} />}
      <TextInput
        {...props}
        style={[
          inputStyles.input,
          isFocused ? inputStyles.focus : {},
          textStyle,
        ]}
        ref={ref}
        numberOfLines={props.multiline ? 2 : 1}
        placeholderTextColor={"#FFFFFFb7"}
        onFocus={focusUp}
        onBlur={focusOff}
      />
      {description && (
        <HelperText text={description} style={{ marginBottom: 0 }} />
      )}
      {nextSibling || null}
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
    backgroundColor: "#2f3242",
    borderWidth: 2,
    borderColor: "#00DFFC",
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
    backgroundColor: "#00DFFC",
    color: "#282a38",
  },
});
