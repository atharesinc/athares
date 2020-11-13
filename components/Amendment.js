import React, { useGlobal } from "reactn";
import * as RootNavigation from "../navigation/RootNavigation";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import DisclaimerText from "./DisclaimerText";
import GhostButton from "./GhostButton";
import GlowButton from "./GlowButton";
import Title from "./Title";
import Card from "./Card";

export default function Amendment({
  amendment,
  isSelected,
  onPress,
  belongsToCircle = false,
}) {
  const [, setActiveAmendment] = useGlobal("activeAmendment");
  const [, setActiveRevision] = useGlobal("activeRevision");
  const [activeCircle] = useGlobal("activeCircle");

  const goToRevision = () => {
    setActiveRevision(amendment.revision.id, () => {
      RootNavigation.navigate("editRevision", {
        revision: amendment.revision.id,
        circle: activeCircle,
      });
    });
  };

  // useEffect(() => {
  //   if (activeRevision) {
  //     RootNavigation.navigate("viewRevision", { revision: activeRevision });
  //   }
  // }, [activeRevision]);

  const selectThisAmendment = () => {
    onPress(amendment.id);
  };

  const editAmendment = () => {
    if (hasOutstandingRevision) {
      return false;
    }
    setActiveAmendment(amendment.id);
    RootNavigation.navigate("editAmendment", {
      amendment: amendment.id,
      circle: activeCircle,
    });
  };

  const hasOutstandingRevision =
    amendment.revision !== null && amendment.revision.passed === null;

  return (
    <TouchableOpacity
      disabled={hasOutstandingRevision || !belongsToCircle}
      onPress={selectThisAmendment}
    >
      <Card light>
        <View style={styles.amendmentWrapper}>
          <Title text={amendment.title} />
          <View style={styles.timeDataWrapper}>
            <DisclaimerText
              grey
              text={`Created - ${new Date(
                amendment.createdAt
              ).toLocaleDateString()}`}
            />
            <DisclaimerText
              grey
              text={`Updated - ${new Date(
                amendment.updatedAt
              ).toLocaleDateString()}`}
            />
          </View>
          <DisclaimerText text={amendment.text} />
          {hasOutstandingRevision && (
            <GlowButton onPress={goToRevision} text={"Current Revision"} />
          )}
        </View>
        {isSelected && belongsToCircle && !hasOutstandingRevision && (
          <View style={styles.row}>
            <GhostButton
              onPress={editAmendment}
              text={"Edit or Repeal"}
              textStyle={styles.buttonText}
              style={styles.row}
            />
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  amendmentWrapper: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "stretch",
    width: "100%",
    marginBottom: 20,
  },
  moreButton: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    color: "#FFFFFF",
    fontSize: 20,
  },
  timeDataWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomColor: "#FFFFFFb7",
    borderBottomWidth: 1,
    marginBottom: 15,
  },
  time: {
    flex: 1,
    color: "#FFFFFFb7",
    fontSize: 12,
  },
  amendmentText: {
    color: "#FFFFFF",
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 12,
  },
  row: {
    flexDirection: "row",
  },
});
