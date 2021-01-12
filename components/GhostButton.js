import React, { useGlobal, useState } from "reactn";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Platform,
} from "react-native";

export default function GhostButton({
  style = {},
  textStyle = {},
  text = "",
  wide = false,
  lowercase = false,
  blue = false,
  ...props
}) {
  const [activeTheme] = useGlobal("activeTheme");
  const wrapperStyle = [styles.wrapper, wide ? { width: "100%" } : {}, style];
  const [isFocused, setIsFocused] = useState(false);

  const buttonStyles = [
    styles.wrapperInner,
    wide ? { width: "100%" } : {},
    blue
      ? { borderColor: activeTheme.COLORS.BLUE1, backgroundColor: "#282a38aa" }
      : {},
    isFocused ? { backgroundColor: "#FFFFFF" } : {},
  ];

  const finalTextStyle = [
    styles.text,
    textStyle,
    blue ? { color: activeTheme.COLORS.BLUE1 } : {},
    isFocused ? { color: activeTheme.COLORS.DARK } : {},
  ];

  const focusUp = () => {
    setIsFocused(true);
  };
  const focusOff = () => {
    setIsFocused(false);
  };

  const finalText = lowercase ? text : text.toUpperCase();
  return (
    <TouchableOpacity
      style={wrapperStyle}
      {...props}
      onFocus={focusUp}
      onBlur={focusOff}
    >
      <View style={buttonStyles}>
        <Text style={finalTextStyle}>{finalText}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    ...Platform.select({
      web: {
        outlineStyle: "none",
      },
    }),
  },
  wrapperInner: {
    borderRadius: 9999,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#FFFFFF",
    borderWidth: 2,
    paddingHorizontal: 15,
  },
  text: {
    fontSize: 15,
    color: "#FFFFFF",
    marginVertical: 10,
    fontFamily: "SpaceGrotesk",
  },
});
