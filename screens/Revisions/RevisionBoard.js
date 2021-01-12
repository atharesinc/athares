import React, { useGlobal } from "reactn";
import { View, StyleSheet, ScrollView } from "react-native";
import RevisionCard from "./RevisionCard";
import GlowButton from "../../components/GlowButton";
import ContrastTitle from "../../components/ContrastTitle";

import * as RootNavigation from "../../navigation/RootNavigation";

const RevisionBoard = ({
  boardName = "",
  revisions = [],
  user,
  belongsToCircle = false,
  ...props
}) => {
  const [activeCircle] = useGlobal("activeCircle");

  const goToCreateRevision = () => {
    RootNavigation.navigate("createRevision", { circle: activeCircle });
  };

  return (
    <View style={styles.revisionBoard}>
      <ContrastTitle text={boardName} style={styles.boardHeader} />
      {boardName === "New Revisions" && user && belongsToCircle && (
        <GlowButton text={"+ Create Revision"} onPress={goToCreateRevision} />
      )}
      <ScrollView style={styles.revisionScroll}>
        {revisions.map((r) => (
          <RevisionCard key={r.id} revision={r} navigation={props.navigation} />
        ))}
      </ScrollView>
    </View>
  );
};

export default RevisionBoard;

const styles = StyleSheet.create({
  revisionBoard: {
    width: 300,
    marginRight: 20,
  },
  boardHeader: {
    marginBottom: 15,
  },
  buttonWrapper: {
    borderRadius: 9999,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    marginLeft: 10,
  },
  revisionScroll: {
    width: "100%",
    flex: 1,
  },
});
