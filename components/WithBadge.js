import React from "react";
import { StyleSheet, View } from "react-native";

export default function WithBadge({
  showBadge = false,
  badgeStyles = {},
  top = null,
  left = null,
  wrapperStyles = {},
  children,
}) {
  const finalStyle = [
    styles.badge,
    badgeStyles,
    top ? { marginTop: top } : {},
    left ? { marginLeft: left } : {},
  ];

  return (
    <View style={wrapperStyles}>
      {children}
      {showBadge && <View style={finalStyle}></View>}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: "#00DFFC",
    height: 18,
    width: 18,
    borderRadius: "100%",
    borderWidth: 3,
    borderColor: "#2f3242",
    marginLeft: 35,
    position: "absolute",
    marginTop: 12,
  },
});
