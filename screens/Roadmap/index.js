import React from "react";

import DisclaimerText from "../../components/DisclaimerText";

import { ScrollView, StyleSheet, Text, View } from "react-native";
import GhostButton from "../../components/GhostButton";
import GlowButton from "../../components/GlowButton";

export default function RoadMap() {
  // const [isMobile] = useGlobal("isMobile");

  return (
    <ScrollView contentContainerStyle={[styles.wrapper]}>
      <View style={styles.innerWrapper}>
        <Text style={styles.bigText}>Good Government is Democratic.</Text>
        <DisclaimerText blue>
          Athares helps you build good democracies. Participate in organizations
          directly, secured with distributed technology.
        </DisclaimerText>
        <View style={styles.buttonRow}>
          <GhostButton text={"Learn More"} />
          <DisclaimerText grey>or</DisclaimerText>
          <GlowButton text={"Get Started"} />
        </View>
      </View>
      <View style={styles.footer}>
        <DisclaimerText grey>Footer</DisclaimerText>
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
  innerWrapper: {
    alignItems: "stretch",
    justifyContent: "flex-start",
    width: "100%",
    padding: 5,
  },
  header: {
    fontSize: 13,
    color: "#FFFFFF",
    marginBottom: 25,
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footer: {
    height: 60,
    backgroundColor: "#FFFFFF",
  },
});
