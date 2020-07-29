import React from "react";
import { View, StyleSheet } from "react-native";
import Title from "./Title";
import DisclaimerText from "./DisclaimerText";

export default function Statistic({ header, text, style = {}, ...props }) {
  return (
    <View style={[styles.statWrapper, style]} {...props}>
      <DisclaimerText grey text={header} style={styles.marginBottomZero} />
      <Title text={text} />
    </View>
  );
}

const styles = StyleSheet.create({
  statWrapper: {
    marginBottom: 15,
  },
  marginBottomZero: {
    marginBottom: 0,
  },
});
