import React from "reactn";
import {
  StyleSheet,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import TextareaAutosize from "react-autosize-textarea";
import Title from "./Title";
import HelperText from "./HelperText";
import useFocus from "../utils/useFocus";

export default function CrossAutoGrow({
  onChangeText,
  value,
  label = null,
  description = null,
  style,
  numberOfLines,
  ...props
}) {
  const { ref, isFocused, handlePress, focusUp, focusOff } = ref
    ? props
    : useFocus();

  const _updateTextForWeb = (e) => {
    onChangeText(e.currentTarget.value);
  };

  if (Platform.OS === "web") {
    const webStyles = {
      borderColor: "#00DFFC",
      resize: "none",
      overflowWrap: "break-word",
      backgroundColor: isFocused ? "#00dffc" : "#2f3242",
      borderWidth: 0,
      width: "calc(100% - 24px)",
      padding: 10,
      fontSize: 15,
      borderRadius: 3,
      marginBottom: 10,
      color: isFocused ? "#282a38" : "#FFF",
      fontFamily: "SpaceGrotesk",
      textAlignVertical: "top",
      border: "2px solid #00dffc",
      ...Platform.select({
        web: {
          outlineStyle: "none",
        },
      }),
    };

    return (
      <TouchableOpacity
        style={[styles.wrapper]}
        onPress={handlePress}
        accessible={false}
      >
        {label && <Title text={label} />}
        <TextareaAutosize
          {...props}
          value={value}
          style={webStyles}
          onChange={_updateTextForWeb}
          maxRows={3}
          ref={ref}
          onFocus={focusUp}
          onBlur={focusOff}
        />
        {description && (
          <HelperText text={description} style={{ marginBottom: 0 }} />
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.wrapper, style]}
      onPress={handlePress}
      accessible={false}
    >
      {label && <Title text={label} />}
      <View style={styles.border}>
        <TextInput
          ref={ref}
          nativeID="chat-input"
          multiline={true}
          value={value}
          onChangeText={onChangeText}
          style={[
            styles.input,
            isFocused ? styles.focus : {},
            { maxHeight: 150, paddingHorizontal: 15 },
          ]}
          placeholderTextColor={"#FFFFFFb7"}
          onFocus={focusUp}
          onBlur={focusOff}
          numberOfLines={numberOfLines}
          {...props}
        />
      </View>
      {description && (
        <HelperText text={description} style={{ marginBottom: 0 }} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
  border: {
    borderColor: "#00DFFC",
  },
  input: {
    color: "#FFF",
    fontSize: 15,
    width: "100%",
    backgroundColor: "#2f3242",
    padding: 10,
    marginBottom: 10,
    justifyContent: "flex-start",
    textAlignVertical: "top",
    borderRadius: 3,
    borderColor: "#00DFFC",
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
