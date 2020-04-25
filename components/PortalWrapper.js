import React from "reactn";
import { StyleSheet, View } from "react-native";

export default function PortalWrapper(props) {
  return <View style={styles.wrapper}>{props.children}</View>;
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: "column",
    width: "100%",
    justifyContent: "flex-start",
    backgroundColor: "#282a3899",
    alignItems: "center",
  },
});
