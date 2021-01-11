import React, { useGlobal, useRef, useState } from "reactn";
import { View, StyleSheet, Text, Switch, TouchableOpacity } from "react-native";

const SwitchLine = ({ label, value = false, onPress = () => {} }) => {
  const [activeTheme] = useGlobal("activeTheme");
  const [isFocused, setIsFocused] = useState(false);
  const inputEl = useRef();

  const handlePress = () => {
    inputEl.current.focus();
  };
  const focusUp = () => {
    setIsFocused(true);
  };
  const focusOff = () => {
    setIsFocused(false);
  };
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
          ref={inputEl}
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
