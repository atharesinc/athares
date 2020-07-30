import React, { useGlobal } from "reactn";
import { View, StyleSheet } from "react-native";

export default function Card({ style = {}, light = false, ...props }) {
  const [activeTheme] = useGlobal("activeTheme");

  const computedStyle = [
    styles.card,
    light ? { backgroundColor: activeTheme.COLORS.MID } : {},
    style,
  ];

  return <View style={computedStyle}>{props.children}</View>;
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#282A38",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    padding: 10,
    marginBottom: 10,
    borderRadius: 3,
  },
});
