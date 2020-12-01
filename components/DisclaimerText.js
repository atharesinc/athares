import React, { useGlobal } from "reactn";
import { Text, StyleSheet } from "react-native";

export default function DisclaimerText({
  red = false,
  green = false,
  upper = false,
  grey = false,
  spaced = false,
  blue = false,
  noMargin = false,
  style = {},
  text,
  ...props
}) {
  const [activeTheme] = useGlobal("activeTheme");

  const computedStyles = [
    styles.disclaimer,
    upper ? styles.upperCase : {},
    spaced ? styles.spaced : {},
    grey ? styles.grey : {},
    red ? { color: activeTheme.COLORS.RED } : {},
    green ? { color: activeTheme.COLORS.GREEN } : {},
    blue ? { color: activeTheme.COLORS.BLUE1 } : {},
    noMargin ? styles.noMargin : {},
    style,
  ];
  return (
    <Text style={computedStyles} {...props}>
      {props.children || text}
    </Text>
  );
}

const styles = StyleSheet.create({
  disclaimer: {
    fontSize: 13,
    color: "#FFFFFF",
    marginBottom: 20,
    fontFamily: "SpaceGrotesk",
  },
  upperCase: {
    textTransform: "uppercase",
  },
  grey: {
    color: "#FFFFFFb7",
  },
  spaced: {
    letterSpacing: 2,
  },
  noMargin: {
    marginBottom: 0,
  },
});
