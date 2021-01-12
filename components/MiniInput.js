import React from "react";
import {
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
} from "react-native";
import useFocus from "../utils/useFocus";

export default function MiniInput({ style = {}, onChangeText, ...props }) {
  const { ref, isFocused, handlePress, focusUp, focusOff } = useFocus();

  return (
    <TouchableOpacity
      style={[styles.wrapper, style]}
      onPress={handlePress}
      accessible={false}
      onFocus={focusUp}
      onBlur={focusOff}
    >
      <TextInput
        {...props}
        style={[styles.input, isFocused ? styles.focus : {}]}
        ref={ref}
        numberOfLines={1}
        placeholderTextColor={isFocused ? "transparent" : "#FFFFFFb7"}
        onFocus={focusUp}
        onBlur={focusOff}
        onChangeText={onChangeText}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderColor: "transparent",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    overflow: "hidden",
    ...Platform.select({
      web: {
        outlineStyle: "none",
      },
    }),
  },
  input: {
    textAlign: "right",
    color: "#FFF",
    fontSize: 15,
    width: "100%",
    backgroundColor: "#2f3242",
    borderColor: "#00DFFC",
    borderWidth: 2,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 5,
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
