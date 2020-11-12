import React from "react";
import { StyleSheet, View, Text } from "react-native";

export default function MessageDivider({ date }) {
  return (
    <View style={styles.container}>
      <View style={styles.messageWrapper}>
        <Text style={styles.messageContent}>{date}</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 20,
    justifyContent: "center",
  },
  messageWrapper: {
    justifyContent: "center",
    backgroundColor: "#FFF",
    borderRadius: 9999,
  },
  messageContent: {
    color: "#282A38",
    textAlign: "center",
    height: 20,
    fontFamily: "SpaceGrotesk",
    paddingHorizontal: 10,
  },
});
