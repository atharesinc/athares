import React, { useGlobal } from "reactn";
import { Text, StyleSheet } from "react-native";

export default function DisclaimerText({ red = false, ...props }) {
  const [activeTheme] = useGlobal(activeTheme);

  const computedStyles = [
    styles.disclaimer,
    props.upper ? styles.upperCase : {},
    red ? { color: activeTheme.COLORS.RED } : {},
  ];
  return <Text style={computedStyles}>{props.text}</Text>;
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
    letterSpacing: 2,
  },
});
