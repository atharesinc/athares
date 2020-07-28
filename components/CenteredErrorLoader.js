import React from "react";
import { View, StyleSheet } from "react-native";

import Title from "./Title";
import { Feather } from "@expo/vector-icons";

export default function CenteredErrorLoader({
  size = 25,
  text = null,
  ...props
}) {
  return (
    <View style={styles.view}>
      <Feather name={"alert"} size={size} color={"#FFFFFF"} />
      {text && <Title center text={text} />}
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
});
