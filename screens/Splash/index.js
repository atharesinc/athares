import React from "react";

import DisclaimerText from "../../components/DisclaimerText";

import { ScrollView, StyleSheet, Text, View } from "react-native";
import GhostButton from "../../components/GhostButton";
import * as RootNavigation from "../../navigation/RootNavigation";

export default function Splash() {
  const goToAbout = () => {
    RootNavigation.navigate("about");
  };
  const goToLogin = () => {
    RootNavigation.navigate("portal", { screen: "login" });
  };
  return (
    <ScrollView contentContainerStyle={[styles.wrapper]}>
      <View style={styles.innerWrapper}>
        <Text style={styles.bigText}>Good Government is Democratic.</Text>
        <DisclaimerText blue style={{ fontSize: 15 }}>
          Athares helps you build better groups. Participate in organizations
          directly, secured with distributed technology.
        </DisclaimerText>
        <View style={styles.buttonRow}>
          <GhostButton
            text={"Learn More"}
            lowercase
            blue
            style={{ marginRight: 10, marginBottom: 0 }}
            onPress={goToAbout}
          />
          <DisclaimerText grey noMargin>
            or
          </DisclaimerText>
          <GhostButton
            text={"Get Started"}
            lowercase
            style={{ marginLeft: 10, marginBottom: 0 }}
            onPress={goToLogin}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "stretch",
    justifyContent: "flex-start",
    width: "100%",
    flex: 1,
  },
  bigText: {
    fontSize: 40,
    color: "#FFFFFF",
    fontFamily: "SpaceGrotesk",
    marginBottom: 30,
  },
  innerWrapper: {
    alignItems: "stretch",
    justifyContent: "center",
    width: "100%",
    padding: 15,
    flex: 1,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
