import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function AddTag({ id, firstName, lastName, ...props }) {
  const removeTag = () => {
    props.removeTag(id);
  };

  return (
    <View style={styles.tag} key={id}>
      <Text style={styles.tagText}>{`${firstName} ${lastName}`}</Text>
      <TouchableOpacity onPress={removeTag} style={styles.buttonWrapper}>
        <Feather name={"x"} size={18} color={"#00DFFC"} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    borderColor: "#00DFFC",
    borderWidth: 1,
    borderRadius: 9999,
    paddingVertical: 3,
    paddingHorizontal: 10,
    marginRight: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tagText: {
    color: "#00DFFC",
    fontSize: 15,
    fontFamily: "SpaceGrotesk",
  },
  buttonWrapper: {
    marginLeft: 5,
    alignItems: "center",
    justifyContent: "space-between",
  },
});
