import React, { Component, useState, Fragment } from "reactn";
import { View, Text, TextInput, StyleSheet } from "react-native";
import * as RootNavigation from "../../navigation/RootNavigation";

import { Feather } from "@expo/vector-icons";

import { UIActivityIndicator } from "react-native-indicators";
//
// import { updateSearchParams } from '../../store/ui/actions';
import { SearchResults } from "./SearchResults";

export const Search = () => {
  const [searchParams, setSearchParams] = useState("");

  const updateText = (text) => {
    setSearchParams(text);
  };

  return (
    <Fragment>
      {/* input */}
      <View style={styles.searchInputWrapper}>
        <Feather
          name="search"
          size={20}
          color={"#FFFFFFb7"}
          numberOfLines={1}
          style={styles.searchIcon}
        />
        <TextInput
          value={searchParams}
          style={styles.searchInput}
          onChangeText={updateText}
          placeholder={"Enter Search Text"}
          numberOfLines={1}
          placeholderTextColor={"#FFFFFFb7"}
        />
        {loading ? (
          <UIActivityIndicator
            color={"#FFFFFF"}
            size={20}
            style={styles.searchIcon}
          />
        ) : (
          <Feather
            name="x"
            size={20}
            color={"#00000000"}
            numberOfLines={1}
            style={styles.searchIcon}
          />
        )}
      </View>
      {/* results */}
      {searchParams.length > 2 && !loading && (
        <SearchResults {...data} searchParams={searchParams} />
      )}
    </Fragment>
  );
};

const styles = StyleSheet.create({
  searchWrapper: {},
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#2f3242",
  },
  searchIcon: {
    marginRight: 10,
    flex: 1,
  },
  searchInput: {
    color: "#FFFFFF",
    fontSize: 15,
    flex: 8,
  },
});
