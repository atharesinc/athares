import React from "react";

import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import AsyncImage from "../../components/AsyncImage";

export default function Suggestions({ suggestions, addTag }) {
  return (
    <View style={styles.suggestionItems}>
      {suggestions.map((item) => (
        <TouchableOpacity
          style={styles.suggestionItem}
          key={item.id}
          onPress={() => {
            addTag(item);
          }}
        >
          <View style={styles.suggestionItemUser}>
            <AsyncImage
              source={{ uri: item.icon }}
              style={styles.userIcon}
              placeholderColor={"#3a3e52"}
            />
            <Text style={styles.suggestionText}>
              {item.firstName + " " + item.lastName}
            </Text>
            {item.uname !== "" && <Text>- {item.uname}</Text>}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  suggestionItem: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#FFFFFFb7",
    flexDirection: "row",
  },
  suggestionItemUser: {
    flexDirection: "row",
    alignItems: "center",
  },
  suggestionText: {
    fontSize: 16,
    color: "#FFFFFFb7",
    fontFamily: "SpaceGrotesk",
  },
  userIcon: {
    height: 30,
    width: 30,
    marginRight: 15,
  },
});
