import React from "react";
import { View, StyleSheet } from "react-native";

import Title from "./Title";
import { Feather } from "@expo/vector-icons";

export default function CenteredErrorLoader({ size = 25, text = null }) {
  return (
    <View style={styles.view}>
      <Feather name={"alert-circle"} size={size} color={"#FFFFFF"} />
      {text && <Title center text={text} style={styles.centerText} />}
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  centerText: {
    padding: 15,
    textAlign: "center",
  },
});
