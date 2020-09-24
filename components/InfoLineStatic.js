import React from "reactn";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

const InfoLineText = ({ value = "", icon, label, style = {}, ...props }) => (
  <View style={{ ...styles.touchWrap, ...style }}>
    <View style={[styles.wrapper]}>
      <View style={styles.linePre}>
        <Feather name={icon} size={25} color={"#FFFFFF"} styles={styles.icon} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text {...props} style={styles.input}>
        {value || "Not set"}
      </Text>
    </View>
  </View>
);

export default InfoLineText;

const styles = StyleSheet.create({
  touchWrap: {
    marginBottom: 20,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#FFFFFF",
    paddingBottom: 10,
    backgroundColor: "transparent",
  },
  wrapper: {
    marginVertical: 5,
    // marginHorizontal: 15,
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  icon: {
    marginRight: 15,
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
  },
  label: {
    fontSize: 16,
    color: "#FFF",
    marginLeft: 10,
  },
});
