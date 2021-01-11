import React, { useGlobal } from "reactn";
import { View, Text, StyleSheet } from "react-native";

export default function ContrastTitle({
  text,
  underline = false,
  spaced = false,
  red = false,
  indent = false,
  center = false,
  style = {},
  textStyle = {},
}) {
  const [activeTheme] = useGlobal("activeTheme");

  const textStyles = [
    styles.title,
    spaced ? styles.spaced : {},
    red ? { color: activeTheme.COLORS.RED } : {},
    indent ? styles.indent : {},
    textStyle,
  ];

  const viewStyle = [
    styles.row,
    underline ? styles.underline : {},
    center ? styles.center : {},
    style,
  ];

  return (
    <View style={viewStyle}>
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
    backgroundColor: "#00dffc",
    paddingVertical: 10,
  },
  title: {
    fontSize: 18,
    color: "#282a38",
    fontFamily: "SpaceGrotesk",
  },
  underline: {
    borderColor: "#2f3242",
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
