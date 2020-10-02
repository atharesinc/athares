import React from "reactn";
import { View, Image, StyleSheet } from "react-native";
import ChannelGroupHeader from "../../components/ChannelGroupHeader";

export default function News() {
  // const [isMobile] = useGlobal("isMobile");
  return (
    <View style={styles.wrapper}>
      <Image
        style={{
          height: 30,
          width: 180,
          marginTop: 60,
          marginBottom: 25,
        }}
        source={require("../../assets/images/Athares-type-small-white.png")}
      />
      <ChannelGroupHeader title={"News"} displayPlus={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "stretch",
    justifyContent: "flex-start",
    width: "100%",
    flex: 1,
    padding: 15,
  },
});
