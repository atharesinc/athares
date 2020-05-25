import React from "reactn";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as RootNavigation from "../../navigation/RootNavigation";

const GovernanceChannelItem = ({ link, title, ...props }) => {
  const nav = () => {
    props.navigation.navigate(link);
  };
  return (
    <TouchableOpacity style={styles.row} onPress={nav}>
      <View>
        <Text style={styles.channelTitle}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default GovernanceChannelItem;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    width: "100%",
    paddingVertical: 10,
  },
  channelTitle: {
    color: "#FFFFFF80",
    fontSize: 16,
    fontFamily: "SpaceGrotesk",
  },
  // channelText: {
  //   color: "#FFFFFF80",
  //   fontSize: 15,
  //   maxWidth: "90%",
  //   fontFamily: "SpaceGrotesk",
  // },
  unread: {
    color: "#FFF",
  },
});
