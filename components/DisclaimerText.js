import React from "react";
import { Text, StyleSheet } from "react-native";

export default function DisclaimerText(props) {
  const computedStyles = [
    styles.disclaimer,
    props.upper ? styles.upperCase : {},
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
