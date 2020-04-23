import React, { Component } from "reactn";

import { Text, TouchableOpacity, StyleSheet } from "react-native";
import * as RootNavigation from "../navigation/RootNavigation";
import { Feather } from "@expo/vector-icons";

const Footer = ({ loggedIn = false, belongsToCircle = false, ...props }) => {
  const goToAddUser = () => {
    RootNavigation.navigate("AddUser");
  };
  const goToLogin = () => {
    RootNavigation.navigate("Login");
  };
  if (!loggedIn) {
    return (
      <TouchableOpacity style={styles.footer} onPress={goToLogin}>
        <Feather name="log-in" color="#FFFFFF" size={25} style={styles.icon} />
        <Text style={styles.footerText}>Log in or Register</Text>
      </TouchableOpacity>
    );
  }
  if (!belongsToCircle) {
    return (
      <TouchableOpacity style={styles.footer}>
        <Feather name="slash" color="#FFFFFF80" size={25} style={styles.icon} />
        <Text style={[styles.footerText, { color: "#FFFFFF80" }]}>
          You are not in this Circle
        </Text>
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity style={styles.footer} onPress={goToAddUser}>
      <Feather name="user-plus" color="#FFFFFF" size={25} style={styles.icon} />
      <Text style={styles.footerText}>Add User to Circle</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: "#282a38",
    height: "10%",
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  footerText: {
    color: "#FFF",
    fontSize: 18,
  },
  icon: {
    marginRight: 25,
  },
});

export default Footer;
