import React from "reactn";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

import * as RootNavigation from "../../navigation/RootNavigation";

export default function CircleTitle({ belongsToCircle = false, title }) {
  const nav = () => {
    RootNavigation.navigate("circleSettings");
  };
  return (
    <View style={styles.row}>
      <Text style={styles.circleTitle}>{title}</Text>
      {belongsToCircle ? (
        <TouchableOpacity onPress={nav}>
          <Feather name="more-vertical" size={20} color={"#FFFFFF"} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: "100%",
  },
  circleTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "SpaceGrotesk",
  },
});
