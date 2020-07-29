import React from "react";

import { StyleSheet, View, Text } from "react-native";

export default function RevisionCategory({ repeal = false, amendment = null }) {
  if (repeal) {
    return (
      <View style={[styles.cardCategory, styles.redBorder]}>
        <Text style={[styles.cardCategoryText, styles.redText]}>REPEAL</Text>
      </View>
    );
  }
  if (amendment !== null) {
    return (
      <View style={styles.cardCategory}>
        <Text style={styles.cardCategoryText}>REVISION</Text>
      </View>
    );
  }

  return (
    <View style={[styles.cardCategory, styles.greenBorder]}>
      <Text style={[styles.cardCategoryText, styles.greenText]}>NEW</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  greenText: {
    color: "#9eebcf",
  },
  redText: {
    color: "#ff725c",
  },
  greenBorder: {
    borderColor: "#9eebcf",
  },
  redBorder: {
    borderColor: "#ff725c",
  },
  cardCategory: {
    borderRadius: 9999,
    borderWidth: 2,
    paddingVertical: 2,
    paddingHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#00DFFC",
  },
  cardCategoryText: {
    textTransform: "uppercase",
    color: "#00DFFC",
    fontFamily: "SpaceGrotesk",
    fontSize: 13,
  },
});
