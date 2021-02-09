import React, { useState } from "reactn";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import TitleTabs from "./TitleTabs";
import MarkdownCard from "./MarkdownCard";

import BigInput from "./BigInput";
import useFocus from "../utils/useFocus";

export default function MarkdownAutoGrow({ value, onChangeText }) {
  const [isEditing, setIsEditing] = useState(true);
  const [selection, setSelection] = useState({
    start: 0,
    end: 0,
  });

  const { ref, isFocused, handlePress, focusUp, focusOff } = useFocus();
  const updateEditing = (tab) => {
    setIsEditing(tab === "write");
  };

  // selection is an object: { start:number, end:number }
  const handleSelectionChange = ({ nativeEvent: { selection } }) => {
    setSelection({ selection });
  };

  const injectText = (markup) => {
    ref.current.focus();
    onChangeText(value + markup);
  };

  const addHeading = () => {
    injectText("# ");
  };
  const addBold = () => {
    injectText("**bold**");
  };
  const addItalic = () => {
    injectText("_italics_");
  };
  const addCode = () => {
    injectText("``");
  };
  const addList = () => {
    injectText("\n* ");
  };
  const addLink = () => {
    injectText("[]()");
  };
  const activeTab = isEditing ? "write" : "preview";

  return (
    <View>
      <View style={styles.editorRow}>
        {/* Switcher */}
        <TitleTabs
          activeTab={activeTab}
          tabs={["write", "preview"]}
          onUpdateTab={updateEditing}
        />

        <View style={styles.wygRow}>
          <TouchableOpacity onPress={addHeading} style={styles.wygButton}>
            <Text style={styles.wygText}>H</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={addBold} style={styles.wygButton}>
            <Feather name={"bold"} color={"#FFFFFF"} size={20} />
          </TouchableOpacity>
          <TouchableOpacity onPress={addItalic} style={styles.wygButton}>
            <Feather name={"italic"} color={"#FFFFFF"} size={20} />
          </TouchableOpacity>

          <TouchableOpacity onPress={addCode} style={styles.wygButton}>
            <Feather name={"code"} color={"#FFFFFF"} size={20} />
          </TouchableOpacity>
          <TouchableOpacity onPress={addList} style={styles.wygButton}>
            <Feather name={"list"} color={"#FFFFFF"} size={20} />
          </TouchableOpacity>
          <TouchableOpacity onPress={addLink} style={styles.wygButton}>
            <Feather name={"link"} color={"#FFFFFF"} size={20} />
          </TouchableOpacity>
        </View>
        {/* Row of Inputs */}
      </View>
      {isEditing ? (
        <BigInput
          value={value}
          onChangeText={onChangeText}
          onSelectionChange={handleSelectionChange}
          // style={{ margin: 0 }}
          description={"Styling with Markdown is supported"}
          selection={selection}
          ref={ref}
          isFocused={isFocused}
          handlePress={handlePress}
          focusUp={focusUp}
          focusOff={focusOff}
        />
      ) : (
        <MarkdownCard value={value} />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  wygRow: { flexDirection: "row" },
  editorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    // width: "100%",
    // flex: 1,
    alignItems: "flex-start",
  },
  wygText: {
    color: "#FFFFFF",
    fontSize: 20,
  },
  wygButton: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 7,
  },
});
