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
  unchangedText = {},
  containerStyle = {},
  addedColor = "lightgreen",
  removedColor = "salmon",
  unchangedColor = "transparent",
}) {
  const diff = fnMap[type](inputA, inputB);

  const result = diff.map((part, index) => {
    // const spanStyle = part.added
    //   ? styles.addedText
    //   : part.removed
    //   ? styles.removedText
    //   : { ...styles.defaultText, ...unchangedText };

    // var computedViewStyle = {
    //   ...viewStyle,
    //   backgroundColor: part.added
    //     ? addedColor
    //     : part.removed
    //     ? removedColor
    //     : unchangedColor,
    // };

    if (part.added) {
      return (
        <View key={index} style={[viewStyle, { backgroundColor: addedColor }]}>
          <Text style={[styles.defaultText, styles.addedText, textStyle]}>
            {part.value}
          </Text>
        </View>
      );
    }

    if (part.removed) {
      return (
        <View
          key={index}
          style={[viewStyle, { backgroundColor: removedColor }]}
        >
          <Text style={[styles.defaultText, styles.removedText, textStyle]}>
            {part.value}
          </Text>
        </View>
      );
    }

    return (
      <View
        key={index}
        style={[viewStyle, { backgroundColor: unchangedColor }]}
      >
        <Text style={[styles.defaultText, unchangedText, textStyle]}>
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
    color: "#FFFFFF",
    fontSize: 14,
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
    flexDirection: "column",
    flexWrap: "wrap",
    alignItems: "flex-end",
  },
});
