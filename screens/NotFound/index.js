import React from "react";
import { View, Text, StyleSheet } from "react-native";
import DisclaimerText from "../../components/DisclaimerText";
import LinkButton from "../../components/LinkButton";
import * as RootNavigation from "../../navigation/RootNavigation";

export default function NotFound() {
  const links = [
    {
      text: "Login",
      route: "login",
    },
    {
      text: "Home",
      route: "app",
    },
    {
      text: "About",
      route: "about",
    },
    {
      text: "Privacy",
      route: "privacy",
    },
  ];

  const nav = (route) => {
    if (route === "login") {
      RootNavigation.navigate("portal", { screen: "login" });
      return;
    }
    RootNavigation.navigate(route);
  };

  return (
    <View style={styles.wrapper}>
      <View>
        <View style={styles.centeredWrapper}>
          {/* <View style={styles.borderRight}> */}
          <Text style={styles.bold}>404</Text>
          {/* </View> */}
          <DisclaimerText grey style={styles.disclaimerOverride} noMargin>
            This resource could not be found.
          </DisclaimerText>
        </View>
        {/* list of links */}
        <View style={styles.styleRow}>
          {links.map((link) => (
            <LinkButton
              text={link.text}
              key={link.route}
              onPress={() => nav(link.route)}
              style={styles.marginHorizontal}
              textStyle={styles.kerning}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    flex: 1,
    padding: 5,
  },
  bold: {
    fontWeight: "bold",
    color: "#FFFFFF",
    fontSize: 50,
    marginBottom: 10,
  },
  styleRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    flex: 1,
  },
  centeredWrapper: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginBottom: 10,
  },
  borderRight: {
    borderRightWidth: 1,
    borderRightColor: "#FFFFFFb7",
    marginRight: 10,
    paddingRight: 10,
  },
  disclaimerOverride: {
    fontSize: 15,
  },
  marginHorizontal: {
    marginHorizontal: 20,
  },
  kerning: {
    letterSpacing: 2,
  },
});
