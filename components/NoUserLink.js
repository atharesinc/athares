import React from "reactn";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import AsyncImage from "./AsyncImage";

export default function NoUserLink(props) {
  const userImage = require("../assets/images/user-default.png");

  return (
    <TouchableOpacity style={styles.userLink} onPress={props.onPress}>
      <View style={styles.imageWrapper}>
        <AsyncImage
          source={userImage}
          style={styles.image}
          placeholderColor={"#3a3e52"}
        />
      </View>
      <View>
        <Text style={styles.header}>Hello There</Text>
        <Text style={styles.disclaimer}>Login or Register Here</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  userLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 10,
  },
  image: {
    height: 55,
    width: 55,
  },
  imageWrapper: {
    marginRight: 15,
    borderRadius: 9999,
    height: 60,
    width: 60,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 18,
    color: "#FFFFFF",
    fontFamily: "SpaceGrotesk",
  },
  disclaimer: {
    fontSize: 14,
    color: "#FFFFFFb7",
    fontFamily: "SpaceGrotesk",
  },
});
