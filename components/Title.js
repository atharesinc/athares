import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Title({ text, underline = false, spaced = false }) {
  return (
    <View
      style={[
        styles.row,
        underline ? styles.underline : {},
        spaced ? styles.spaced : {},
      ]}
    >
      <Text style={styles.channelTitle}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  channelTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: "#FFFFFF",
    fontFamily: "SpaceGrotesk",
  },
  underline: {
    borderColor: "#FFFFFF",
    borderBottomWidth: 1,
  },
  spaced: {
    letterSpacing: 2,
  },
});
