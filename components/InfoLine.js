import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MiniInput from "./MiniInput";

function InfoLine({ defaultValue = "", onChangeText, label, style = {} }) {
  return (
    <View style={[styles.wrapper, style]}>
      <Text style={styles.label}>{label}</Text>
      <MiniInput
        defaultValue={defaultValue || ""}
        placeholder="Not set"
        onChangeText={onChangeText}
      />
    </View>
  );
}

export default InfoLine;

const styles = StyleSheet.create({
  touchWrap: {
    marginBottom: 10,
    width: "100%",
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    backgroundColor: "transparent",
  },
  wrapper: {
    marginVertical: 5,
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  overrideInput: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 0,
    width: "auto",
  },
  linePre: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  input: {
    color: "#FFF",
    fontSize: 16,
    width: "50%",
    textAlign: "right",
    fontFamily: "SpaceGrotesk",
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    color: "#FFF",
    fontFamily: "SpaceGrotesk",
  },
});
