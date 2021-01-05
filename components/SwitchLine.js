import React, { useGlobal } from "reactn";
import { View, StyleSheet, Text, Switch } from "react-native";

const SwitchLine = ({ label, value = false, onPress = () => {} }) => {
  const [activeTheme] = useGlobal("activeTheme");

  const trackColor = {
    false: activeTheme.COLORS.LIGHT,
    true: activeTheme.COLORS["BLUE1"],
  };
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Switch onValueChange={onPress} trackColor={trackColor} value={value} />
    </View>
  );
};

export default SwitchLine;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "SpaceGrotesk",
  },
});
