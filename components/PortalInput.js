import React, { useRef } from "reactn";
import { StyleSheet } from "react-native";
// import { TouchableOpacity, TextInput, View } from "react-native";
// import { Feather } from "@expo/vector-icons";
import { Input, theme } from "galio-framework";

function PortalInput({ icon, iconStyles = {}, type = "default", ...props }) {
  return (
    <Input
      rounded
      type={type}
      family="feather"
      icon={icon}
      left
      color={theme.COLORS.WHITE}
      style={{ borderColor: theme.COLORS.WHITE }}
      bgColor={theme.COLORS.TRANSPARENT}
      placeholderTextColor={theme.COLORS.NEUTRAL}
      {...props}
    />
    // <TouchableOpacity
    //   style={{ ...styles.touchWrap, ...style }}
    //   onPress={handleClick}
    // >
    //   <View style={[styles.wrapper]}>
    //     <Feather name={icon} size={20} color={"#FFFFFF"} styles={styles.icon} />
    //     <TextInput
    //       {...props}
    //       style={styles.input}
    //       ref={inputEl}
    //       placeholderTextColor={"#FFFFFFb7"}
    //     />
    //   </View>
    // </TouchableOpacity>
  );
}

export default PortalInput;

const styles = StyleSheet.create({
  touchWrap: {
    marginBottom: 10,
    width: "100%",
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    backgroundColor: "#3a3e5290",
  },
  wrapper: {
    marginVertical: 5,
    marginRight: 15,
    marginLeft: 7,
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    overflow: "hidden",
  },
  icon: {
    marginRight: 20,
  },
  input: {
    color: "#FFF",
    marginLeft: 20,
    fontSize: 15,
  },
});
