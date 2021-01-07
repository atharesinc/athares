import React from "react";

import { View, StyleSheet } from "react-native";
import Suggestion from "./Suggestion";

export default function Suggestions({ suggestions, addTag }) {
  console.log({ suggestions });
  return (
    <View style={styles.suggestionItem}>
      {suggestions.map((item) => (
        <Suggestion key={item.id} item={item} addTag={addTag} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  suggestionItems: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#FFFFFFb7",
    flexDirection: "row",
  },
});
