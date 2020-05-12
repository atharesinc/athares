import React, { useGlobal } from "reactn";

import { StyleSheet, View } from "react-native";

const ScreenWrapper = ({
  dark = true,
  light = false,
  theme = false,
  styles = {},
  ...props
}) => {
  const [activeTheme] = useGlobal("activeTheme");
  return (
    <View
      style={[
        baseStyles.base,
        theme ? activeTheme.COLORS.MED : {},
        light ? activeTheme.COLORS.LIGHT : {},
        styles,
      ]}
    >
      {props.children}
    </View>
  );
};

export default ScreenWrapper;

const baseStyles = StyleSheet.create({
  base: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#282a38",
    padding: 15,
  },
});
