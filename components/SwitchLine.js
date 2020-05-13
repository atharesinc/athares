import React, { useGlobal } from "reactn";
import { View, StyleSheet, Text } from "react-native";
import Switch from "react-native-switch-pro";

const SwitchLine = ({
  label,
  value = false,
  onPress = console.log,
  ...props
}) => {
  const [activeTheme] = useGlobal("activeTheme");

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Switch
        onSyncPress={onPress}
        backgroundActive={activeTheme.COLORS["BLUE0"]}
        backgroundInactive={activeTheme.COLORS.DARK}
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
  },
});
