import React from "reactn";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import WithBadge from "./WithBadge";

const MenuLink = ({ icon, label, details = "", badge = false, ...props }) => {
  return (
    <TouchableOpacity style={styles.menuLink} {...props}>
      <WithBadge showBadge={badge}>
        <Feather style={styles.icon} name={icon} color={"#FFFFFF"} size={25} />
      </WithBadge>
      <View>
        <Text style={styles.header}>{label}</Text>
        {details ? <Text style={styles.disclaimer}>{details}</Text> : null}
      </View>
    </TouchableOpacity>
  );
};

export default MenuLink;

const styles = StyleSheet.create({
  menuLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 20,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FFFFFFb7",
    marginVertical: 10,
  },
  icon: {
    marginRight: 20,
    marginLeft: 20,
  },
  header: {
    fontSize: 18,
    color: "#FFFFFF",
    fontFamily: "SpaceGrotesk",
  },
  disclaimer: {
    fontSize: 14,
    color: "#FFFFFFb7",
    fontFamily: "SpaceGrotesk",
  },
});
