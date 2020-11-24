import React, { useGlobal } from "reactn";
import { View, StyleSheet, Text } from "react-native";
import Switch from "react-native-switch-pro";

const SwitchLine = ({ label, value = false, onPress = () => {} }) => {
  const [activeTheme] = useGlobal("activeTheme");

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Switch
        onSyncPress={onPress}
        backgroundActive={activeTheme.COLORS["BLUE1"]}
        backgroundInactive={activeTheme.COLORS.LIGHT}
        value={value}
      />
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
