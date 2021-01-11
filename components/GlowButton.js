import React, { useGlobal, useState } from "reactn";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Platform,
} from "react-native";

export default function GlowButton({
  style = {},
  textStyle = {},
  text = "",
  red = false,
  green = false,
  ghost = false,
  ...props
}) {
  const [activeTheme] = useGlobal("activeTheme");
  const wrapperStyle = [styles.wrapper, style];
  const [isFocused, setIsFocused] = useState(false);

  const redButton = {
    backgroundColor: "transparent",
    borderWidth: 3,
    borderColor: activeTheme.COLORS.RED,
    shadowColor: activeTheme.COLORS.RED,
  };

  const greenButton = {
    backgroundColor: "transparent",
    borderWidth: 3,
    borderColor: activeTheme.COLORS.GREEN,
    shadowColor: activeTheme.COLORS.GREEN,
  };

  const ghostButton = {
    backgroundColor: "transparent",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowColor: "transparent",
  };

  const focusedButton = {
    backgroundColor: activeTheme.COLORS.GREEN,
    shadowColor: activeTheme.COLORS.GREEN,
  };

  const focusedRedButton = {
    backgroundColor: activeTheme.COLORS.RED,
    shadowColor: activeTheme.COLORS.RED,
  };

  const buttonStyles = [
    styles.wrapperInner,
    red ? redButton : {},
    green ? greenButton : {},
    ghost ? ghostButton : {},
    isFocused ? focusedButton : {},
    isFocused && red ? focusedRedButton : {},
  ];

  const finalTextStyle = [
    styles.text,
    red ? { color: activeTheme.COLORS.RED } : {},
    green ? { color: activeTheme.COLORS.GREEN } : {},
    ghost ? { color: "#FFFFFF" } : {},
    isFocused ? { color: activeTheme.COLORS.DARK } : {},
    textStyle,
  ];

  const focusUp = () => {
    setIsFocused(true);
  };
  const focusOff = () => {
    setIsFocused(false);
  };

  return (
    <TouchableOpacity
      style={wrapperStyle}
      {...props}
      onFocus={focusUp}
      onBlur={focusOff}
    >
      <View style={buttonStyles}>
        <Text style={finalTextStyle}>{text.toUpperCase()}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
    ...Platform.select({
      web: {
        outlineStyle: "none",
      },
    }),
  },
  wrapperInner: {
    borderRadius: 9999,
    backgroundColor: "#00DFFC",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  text: {
    fontSize: 15,
    color: "#282A38",
    marginVertical: 10,
    fontFamily: "SpaceGrotesk",
  },
});
