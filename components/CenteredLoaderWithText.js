import React from "react";
import { View, StyleSheet } from "react-native";

import Title from "./Title";
import Loader from "./Loader";

export default function CenteredLoaderWithText({
  size,
  text = null,
  ...props
}) {
  return (
    <View style={styles.view}>
      <Loader size={size} />
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
