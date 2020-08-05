import React, { useState, Fragment, useEffect, useRef } from "reactn";
import { View, Text, TextInput, StyleSheet, Platform } from "react-native";
import * as RootNavigation from "../../navigation/RootNavigation";
import Loader from "../../components/Loader";
import { SEARCH_ALL } from "../../graphql/queries";
import { useLazyQuery } from "@apollo/client";
import { Feather } from "@expo/vector-icons";

import SearchResults from "./SearchResults";

export const Search = () => {
  const [searchParams, setSearchParams] = useState("");
  const inputRef = useRef();

  const [search, { loading, data, error }] = useLazyQuery(SEARCH_ALL);

  const updateText = (text) => {
    setSearchParams(text);
  };

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    if (searchParams.trim() !== "") {
      search({
        variables: {
          text: searchParams || "",
          id: searchParams || "",
        },
      });
    }
  }, [searchParams]);

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
          ref={inputRef}
        />
        {loading ? (
          <Loader size={20} style={styles.searchIcon} />
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
      {searchParams.length > 2 && (
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
    ...Platform.select({
      web: {
        outlineStyle: "none",
      },
    }),
    fontFamily: "SpaceGrotesk",
  },
});
