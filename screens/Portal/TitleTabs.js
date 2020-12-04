import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function TitleTabs({ tabs = ["tab"], activeTab, ...props }) {
  const updateTab = (tab) => {
    props.onUpdateTab && props.onUpdateTab(tab);
  };

  return (
    <View style={styles.row}>
      {tabs.map((tab) => {
        // use the provided tab for controlled state and current tab for independent state
        const active = activeTab === tab;
        return (
          <TouchableOpacity
            disabled={active}
            key={tab}
            onPress={() => {
              updateTab(tab);
            }}
            style={styles.tabButton}
          >
            <View style={[styles.tabView, active ? styles.underlined : {}]}>
              <Text style={[styles.tabText, active ? styles.white : {}]}>
                {tab[0].toUpperCase() + tab.substring(1, tab.length)}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 20,
  },
  tabButton: {
    marginRight: 10,
  },
  tabView: {
    paddingBottom: 5,
    borderBottomColor: "transparent",
    borderBottomWidth: 3,
  },
  underlined: {
    borderBottomColor: "#00DFFC",
  },
  tabText: {
    fontFamily: "SpaceGrotesk",
    color: "#FFFFFFb7",
    fontSize: 18,
  },
  white: {
    color: "#FFFFFF",
  },
});
