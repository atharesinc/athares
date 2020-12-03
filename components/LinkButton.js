import React, { useGlobal, useState } from "reactn";
import { TouchableOpacity, Text, StyleSheet, Platform } from "react-native";

export default function LinkButton({
  style = {},
  textStyle = {},
  text = "",
  wide = false,
  ...props
}) {
  const [activeTheme] = useGlobal("activeTheme");
  const wrapperStyle = [styles.wrapper, wide ? { width: "100%" } : {}, style];
  const [isFocused, setIsFocused] = useState(false);

  const finalTextStyle = [
    styles.text,
    textStyle,
    isFocused ? { color: activeTheme.COLORS.BLUE1 } : {},
  ];

  const focusUp = () => {
    setIsFocused(true);
  };
  const focusOff = () => {
    setIsFocused(false);
  };

  return (
    <TouchableOpacity
      style={wrapperStyle}
      {...props}
      onFocus={focusUp}
      onBlur={focusOff}
    >
      <Text style={finalTextStyle}>{text.toUpperCase()}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    ...Platform.select({
      web: {
        outlineStyle: "none",
      },
    }),
  },
  text: {
    fontSize: 15,
    color: "#FFFFFF",
    marginVertical: 10,
    fontFamily: "SpaceGrotesk",
  },
});
