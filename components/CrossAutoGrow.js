import React, { useState, useRef } from "reactn";
import {
  StyleSheet,
  Platform,
  TextInput,
  TouchableOpacity,
} from "react-native";

import TextareaAutosize from "react-autosize-textarea";
import Title from "./Title";
import HelperText from "./HelperText";

export default function CrossAutoGrow({
  onChangeText,
  value,
  label = null,
  description = null,
  style,
  ...props
}) {
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

  const _updateTextForWeb = (e) => {
    onChangeText(e.currentTarget.value);
  };

  // useEffect(() => {
  //   // override weird unsetting of max height on web
  //   if (Platform.OS === "web") {
  //     inputEl.current.style.maxHeight = "300px !important";
  //   }
  // }, []);

  if (Platform.OS === "web") {
    const webStyles = {
      // padding: 10,
      // color: "#FFFFFF",
      // fontFamily: "SpaceGrotesk",
      // // flex: 1,
      // backgroundColor: isFocused ? "#3a3e52" : "transparent",
      // border: "none",
      // outlineStyle: "none",
      // fontSize: "inherit",
      // maxHeight: "300px",
      // boxSizing: "border-box",
      resize: "none",
      overflowWrap: "break-word",
      backgroundColor: isFocused ? "#3a3e52" : "#2f3242",
      borderWidth: 0,
      width: "calc(100% - 20px)",
      padding: 10,
      fontSize: 15,
      borderRadius: 3,
      marginBottom: 10,
      color: "#FFFFFF",
      fontFamily: "SpaceGrotesk",
      textAlignVertical: "top",
      ...Platform.select({
        web: {
          outlineStyle: "none",
        },
      }),
      boxShadow: "rgba(0, 0, 0, 0.29) 0px 3px 4.65px",
    };

    return (
      <TouchableOpacity style={[styles.wrapper]} onPress={handlePress}>
        {label && <Title text={label} />}
        <TextareaAutosize
          {...props}
          value={value}
          style={webStyles}
          onChange={_updateTextForWeb}
          maxRows={3}
          ref={inputEl}
        />
        {description && (
          <HelperText text={description} style={{ marginBottom: 0 }} />
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={[styles.wrapper, style]} onPress={handlePress}>
      {label && <Title text={label} />}
      <TextInput
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
        {...props}
      />
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
  input: {
    color: "#FFF",
    fontSize: 15,
    width: "100%",
    backgroundColor: "#2f3242",
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
    backgroundColor: "#3a3e52",
  },
});
