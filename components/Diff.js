import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { diffChars, diffWords, diffSentences } from "diff";

const fnMap = {
  chars: diffChars,
  words: diffWords,
  sentences: diffSentences,
};

export default function Diff({
  inputA = "",
  inputB = "",
  type = "chars",
  textStyle = {},
  viewStyle = {},
  addedText = {},
  removedText = {},
  unchangedText = {},
  containerStyle = {},
  addedColor = "lightgreen",
  removedColor = "salmon",
  unchangedColor = "transparent",
}) {
  var diff = fnMap[type](inputA, inputB);
  var result = diff.map(function (part, index) {
    var spanStyle = part.added
      ? { ...styles.addedText, ...addedText }
      : part.removed
        ? { ...styles.removedText, ...removedText }
        : { ...styles.defaultText, ...unchangedText };

    var computedViewStyle = {
      ...viewStyle,
      backgroundColor: part.added
        ? addedColor
        : part.removed
          ? removedColor
          : unchangedColor,
    };

    return (
      <View key={index} style={computedViewStyle}>
        <Text style={[styles.defaultText, spanStyle, textStyle]}>
          {part.value}
        </Text>
      </View>
    );
  });
  return (
    <View style={[styles.defaultContainerStyle, containerStyle]}>{result}</View>
  );
}

var styles = StyleSheet.create({
  defaultText: {
    fontFamily: "SpaceGrotesk",
  },
  addedText: {
    color: "#000000",
  },
  removedText: {
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
    color: "#000000",
  },
  defaultContainerStyle: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-end",
  },
});
