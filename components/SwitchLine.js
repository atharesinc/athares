import React, { useGlobal } from "reactn";
import { View, StyleSheet, Text, Switch, TouchableOpacity } from "react-native";
import useFocus from "../utils/useFocus";

const SwitchLine = ({ label, value = false, onPress = () => {} }) => {
  const [activeTheme] = useGlobal("activeTheme");
  const { ref, isFocused, handlePress, focusUp, focusOff } = useFocus();

  const trackColor = {
    false: activeTheme.COLORS.LIGHT,
    true: activeTheme.COLORS["BLUE1"],
  };
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        onPress={handlePress}
        accessible={false}
        onFocus={focusUp}
        onBlur={focusOff}
        style={[
          isFocused
            ? { borderWidth: 2, borderColor: "#00DFFC", borderRadius: 9999 }
            : {},
        ]}
      >
        <Switch
          ref={ref}
          onValueChange={onPress}
          trackColor={trackColor}
          value={value}
          thumbColor={"#FFFFFF"}
          ios_backgroundColor="#2f3242"
        />
      </TouchableOpacity>
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
