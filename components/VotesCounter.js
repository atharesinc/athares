import React from "react";
import { View, StyleSheet } from "react-native";
import DisclaimerText from "./DisclaimerText";

export default function VotesCounter({ support, reject }) {
  return (
    <View style={styles.cardVotesWrapper}>
      <DisclaimerText green text={`+${support}`} style={styles.text} />
      <DisclaimerText text={" / "} style={styles.text} />
      <DisclaimerText red text={`-${reject}`} style={styles.text} />
    </View>
  );
}
const styles = StyleSheet.create({
  cardVotesWrapper: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  slash: {
    color: "#FFFFFF",
    marginHorizontal: 5,
  },
  text: {
    marginBottom: 0,
  },
});
