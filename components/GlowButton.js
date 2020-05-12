import React, { useGlobal } from "reactn";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Platform,
} from "react-native";

export default function GlowButton({
  style = {},
  textStyle = {},
  text = "",
  red = false,
  green = false,
  ...props
}) {
  const [activeTheme] = useGlobal("activeTheme");
  const wrapperStyle = [styles.wrapper, style];

  const buttonStyles = [
    styles.wrapperInner,
    red
      ? {
          backgroundColor: "transparent",
          borderWidth: 3,
          borderColor: activeTheme.COLORS.RED,
          shadowColor: activeTheme.COLORS.RED,
        }
      : {},
    green
      ? {
          backgroundColor: "transparent",
          borderWidth: 3,
          borderColor: activeTheme.COLORS.GREEN,
          shadowColor: activeTheme.COLORS.GREEN,
        }
      : {},
  ];

  const finalTextStyle = [
    styles.text,
    red
      ? {
          color: activeTheme.COLORS.RED,
        }
      : {},
    green
      ? {
          color: activeTheme.COLORS.GREEN,
        }
      : {},
    textStyle,
  ];

  return (
    <TouchableOpacity style={wrapperStyle} {...props}>
      <View style={buttonStyles}>
        <Text style={finalTextStyle}>{text.toUpperCase()}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  wrapperInner: {
    borderRadius: 9999,
    backgroundColor: "#00DFFC",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    ...Platform.select({
      ios: {
        shadowColor: "#00DFFC",
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.55,
        shadowRadius: 12,
      },
      web: {
        shadowColor: "#00DFFC",
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.55,
        shadowRadius: 12,
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
