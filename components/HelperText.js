import React from "react";
import { Text, StyleSheet } from "react-native";

export default function HelperText({ text, style = {} }) {
  return <Text style={[styles.text, style]}>{text}</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    color: "#FFFFFFb7",
    fontFamily: "SpaceGrotesk",
    marginBottom: 15,
  },
});
