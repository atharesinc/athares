import React from "reactn";
import { View, Text, StyleSheet } from "react-native";
import SingleSearchItem from "./SingleSearchItem";

export default function SearchSection(props) {
  let { data, clearSearch } = props;

  // If the user hasn't entered any search terms, or there are no results for this section, don't display the section
  if (props.search.trim() === "" || data.length === 0) {
    return null;
  }

  return (
    <View style={styles.suggestionItemsWrapper}>
      <View style={styles.suggestionBackground}>
        <Text style={styles.suggestionHeader}>{props.title}</Text>
      </View>
      <View style={styles.suggestionItems}>
        {data.map((item) => (
          <SingleSearchItem
            key={item.id}
            item={item}
            clearSearch={clearSearch}
            category={props.title}
            searchOn={props.searchOn}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  suggestionItemsWrapper: {
    backgroundColor: "#282a38",
  },
  suggestionBackground: {
    backgroundColor: "#3a3e52",
  },
  suggestionHeader: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    color: "#FFFFFF",
    fontFamily: "SpaceGrotesk",
    textTransform: "uppercase",
  },
  suggestionItems: { backgroundColor: "#282a38" },
});
