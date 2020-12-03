import React from "react";
import { View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import Title from "../../components/Title";
import LinkButton from "../../components/LinkButton";
import * as RootNavigation from "../../navigation/RootNavigation";
// import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

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

  const goToPolicy = () => {
    const link = `https://app.termly.io/document/privacy-policy/a5978d1c-8a56-4910-b0b5-32b1ff526936`;
    if (Platform.OS === "web") {
      window.open(link, "_blank");
      return;
    }
    WebBrowser.openBrowserAsync(link);
  };
  const goToGitHub = () => {
    const link = "https://github.com/atharesinc";

    if (Platform.OS === "web") {
      window.open(link, "_blank");
      return;
    }
    WebBrowser.openBrowserAsync(link);
  };

  return (
    <View style={styles.wrapper}>
      <View>
        <View style={styles.centeredWrapper}>
          <TouchableOpacity onPress={goToPolicy}>
            <Title
              grey
              style={styles.disclaimerOverride}
              text={"Privacy Policy"}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={goToGitHub}>
            <Title
              grey
              style={styles.disclaimerOverride}
              text={"Athares Open Source"}
            />
          </TouchableOpacity>
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
