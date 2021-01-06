import React from "react";
import { View, StyleSheet, Text } from "react-native";

export default function OfflineBanner() {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.text}>OFFLINE</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#FF725C",
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: "SpaceGrotesk",
    fontSize: 15,
    color: "#282a38",
  },
});
