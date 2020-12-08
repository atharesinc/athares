import React, { memo } from "react";

import { View, Text, StyleSheet } from "react-native";

export default memo(function Pill({ text }) {
  return (
    <View style={styles.pillStyle}>
      <Text style={styles.textStyle} numberOfLines={1}>
        {text}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  textStyle: {
    color: "#282a38",
    fontSize: 13,
    letterSpacing: 2,
  },
  pillStyle: {
    borderRadius: 9999,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
});
