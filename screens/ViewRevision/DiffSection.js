import React, { useState } from "reactn";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Diff from "../../components/Diff";
import Feather from "@expo/vector-icons/Feather";
import Card from "../../components/Card";
import MarkdownCard from "../../components/MarkdownCard";

function DiffSection({ oldText = "", newText = "" }) {
  const [mode, setMode] = useState(0);

  const renderTab = () => {
    switch (mode) {
      case 1:
        return (
          <ScrollView containerStyle={styles.textContainerStyle}>
            <Diff
              unchangedText={styles.unchangedText}
              inputA={oldText}
              inputB={newText}
              textStyle={styles.sideBySideText}
              containerStyle={styles.sideBySide}
              type="words"
            />
          </ScrollView>
        );
      case 2:
        return (
          <ScrollView containerStyle={styles.textContainerStyle}>
            <View style={styles.sideBySideWrapper}>
              <Diff
                unchangedText={styles.unchangedText}
                inputA={oldText}
                inputB={""}
                type="words"
                containerStyle={styles.sideBySide}
              />
              <Diff
                containerStyle={styles.sideBySide}
                unchangedText={styles.unchangedText}
                inputA={""}
                inputB={newText}
                type="words"
              />
            </View>
          </ScrollView>
        );
      default:
        return <MarkdownCard value={newText} noStyle />;
    }
  };

  return (
    <Card>
      {renderTab()}
      <View style={styles.tabWrapper}>
        <TouchableOpacity
          onPress={() => {
            setMode(0);
          }}
          style={[styles.tab, mode === 0 ? styles.selectedTab : {}]}
        >
          <Feather
            size={20}
            color={mode === 0 ? "#FFFFFF" : "#FFFFFFb7"}
            name="check"
            style={styles.tabIcon}
          />
          <Text style={[styles.tabText, mode === 0 ? styles.selectedText : {}]}>
            Final
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setMode(1);
          }}
          style={[styles.tab, mode === 1 ? styles.selectedTab : {}]}
        >
          <Feather
            size={20}
            color={mode === 1 ? "#FFFFFF" : "#FFFFFFb7"}
            name="code"
            style={styles.tabIcon}
          />
          <Text style={[styles.tabText, mode === 1 ? styles.selectedText : {}]}>
            Diff
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setMode(2);
          }}
          style={[styles.tab, mode === 2 ? styles.selectedTab : {}]}
        >
          <Feather
            size={20}
            color={mode === 2 ? "#FFFFFF" : "#FFFFFFb7"}
            name="layout"
            style={styles.tabIcon}
          />
          <Text style={[styles.tabText, mode === 2 ? styles.selectedText : {}]}>
            Side-By-Side
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

export default DiffSection;

const styles = StyleSheet.create({
  tabWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 15,
  },
  tab: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    width: "30%",
    backgroundColor: "#282a38",
    paddingVertical: 10,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: "#2f3242",
  },
  selectedTab: {
    backgroundColor: "#2f3242",
    borderColor: "#FFFFFF",
  },
  selectedText: {
    color: "#FFFFFF",
  },
  tabText: {
    color: "#FFFFFFb7",
    fontSize: 10,
    fontFamily: "SpaceGrotesk",
  },
  tabIcon: {
    marginRight: 10,
  },
  unchangedText: {
    color: "#FFFFFF",
    fontFamily: "SpaceGrotesk",
  },
  sideBySideWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  sideBySide: {
    alignItems: "flex-start",
    // padding: 5,
    flex: 1,
  },
  sideBySideText: {
    fontFamily: "SpaceGrotesk",
  },
  textContainerStyle: {
    marginBottom: 20,
  },
});
