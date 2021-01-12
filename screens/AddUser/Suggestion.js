import React from "react";

import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import AsyncImage from "../../components/AsyncImage";

export default function Suggestion({ item, addTag }) {
  const _addTag = () => {
    addTag(item);
  };

  return (
    <TouchableOpacity
      style={styles.suggestionItem}
      key={item.id}
      onPress={_addTag}
    >
      <View style={styles.suggestionItemUser}>
        <View style={styles.userIcon}>
          <AsyncImage
            source={{ uri: item.icon }}
            style={styles.userIcon}
            placeholderColor={"#3a3e52"}
          />
        </View>
        <Text style={styles.suggestionText}>
          {item.firstName + " " + item.lastName}
        </Text>
        <Text></Text>
        {item.uname ? (
          <Text style={styles.suggestionText}>- {item.uname}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  suggestionItem: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#FFFFFFb7",
    flexDirection: "row",
    backgroundColor: "#282a38",
  },
  suggestionItemUser: {
    flexDirection: "row",
    alignItems: "center",
  },
  suggestionText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: "SpaceGrotesk",
    marginLeft: 15,
  },
  userIcon: {
    height: 30,
    width: 30,
  },
});
