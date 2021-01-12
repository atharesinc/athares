import React, { useGlobal } from "reactn";
import { View, Text, StyleSheet } from "react-native";

export default function ContrastTitle({
  text,
  spaced = false,
  red = false,
  center = false,
  style = {},
  textStyle = {},
}) {
  const [activeTheme] = useGlobal("activeTheme");

  const textStyles = [
    styles.title,
    spaced ? styles.spaced : {},
    red ? { color: activeTheme.COLORS.RED } : {},
    textStyle,
  ];

  const viewStyle = [styles.row, center ? styles.center : {}, style];

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
    paddingVertical: 5,
  },
  title: {
    fontSize: 18,
    color: "#282a38",
    fontFamily: "SpaceGrotesk",
    paddingLeft: 15,
  },
  spaced: {
    letterSpacing: 2,
  },
  center: {
    justifyContent: "center",
  },
});
