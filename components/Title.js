import React, { useGlobal } from "reactn";
import { View, Text, StyleSheet } from "react-native";

export default function Title({
  text,
  underline = false,
  spaced = false,
  red = false,
  indent = false,
  center = false,
}) {
  const [activeTheme] = useGlobal(activeTheme);

  const textStyles = [
    styles.title,
    spaced ? styles.spaced : {},
    red ? { color: activeTheme.COLORS.RED } : {},
    indent ? styles.indent : {},
  ];

  return (
    <View
      style={[
        styles.row,
        underline ? styles.underline : {},
        center ? styles.center : {},
      ]}
    >
      <Text style={textStyles}>{text}</Text>
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
  title: {
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
  indent: {
    paddingLeft: 15,
  },
  center: {
    justifyContent: "center",
  },
});
