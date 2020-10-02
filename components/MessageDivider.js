import React from "react";
import { StyleSheet, View, Text } from "react-native";

export default function MessageDivider({ date }) {
  return (
    <View style={styles.messageDividerWrapper}>
      <View style={styles.messageDividerLine}>
        <Text>&nbsp;</Text>
      </View>
      <Text style={styles.messageDividerContent}>{date}</Text>
      <View style={styles.messageDividerLine}>
        <Text>&nbsp;</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  messageDividerWrapper: {
    flexDirection: "row",
    width: "100%",
    marginVertical: 20,
    justifyContent: "center",
  },
  messageDividerLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#FFFFFF",
    flex: 0.5,
    height: 10,
  },
  messageDividerContent: {
    color: "#FFF",
    textAlign: "center",
    flex: 1,
    height: 20,
    fontFamily: "SpaceGrotesk",
  },
});
