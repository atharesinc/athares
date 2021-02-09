import React, { useGlobal, memo } from "reactn";
import * as RootNavigation from "../../navigation/RootNavigation";
import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import DisclaimerText from "../../components/DisclaimerText";
import GlowButton from "../../components/GlowButton";
import Title from "../../components/Title";
import Card from "../../components/Card";
import Feather from "@expo/vector-icons/Feather";
import useFocus from "../../utils/useFocus";
import MarkdownCard from "../../components/MarkdownCard";

export default memo(function Amendment({ amendment, belongsToCircle = false }) {
  const [, setActiveAmendment] = useGlobal("activeAmendment");
  const [, setActiveRevision] = useGlobal("activeRevision");
  const [activeCircle] = useGlobal("activeCircle");
  const { ref, isFocused, focusUp, focusOff } = useFocus();

  const goToRevision = () => {
    setActiveRevision(amendment.revision.id, () => {
      RootNavigation.navigate("editRevision", {
        revision: amendment.revision.id,
        circle: activeCircle,
      });
    });
  };

  const editAmendment = () => {
    if (hasOutstandingRevision) {
      return false;
    }

    setActiveAmendment(amendment.id, () => {
      RootNavigation.navigate("editAmendment", {
        amendment: amendment.id,
        circle: activeCircle,
      });
    });
  };

  const hasOutstandingRevision =
    amendment.revision !== null && amendment.revision.passed === null;

  return (
    // <TouchableOpacity
    //   disabled={hasOutstandingRevision || !belongsToCircle}
    //   onPress={selectThisAmendment}
    //   delayPressIn={0}
    //   accessible={false}
    // >
    <Card light>
      <View style={styles.amendmentWrapper}>
        <View style={styles.row}>
          <Title text={amendment.title} style={styles.title} />
          {belongsToCircle && !hasOutstandingRevision && (
            <TouchableOpacity
              onPress={editAmendment}
              style={[styles.centeredRow, styles.removeOutline]}
              onFocus={focusUp}
              onBlur={focusOff}
            >
              <View
                style={[styles.button, isFocused ? styles.focusButton : {}]}
              >
                <Feather
                  ref={ref}
                  name={"git-branch"}
                  size={22}
                  color={isFocused ? "#282a38" : "#00DFFC"}
                />
              </View>
              {/* <Text style={styles.buttonText}>REVISE</Text> */}
            </TouchableOpacity>
          )}
        </View>
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
        <MarkdownCard noStyle value={amendment.text} />
        {hasOutstandingRevision && (
          <GlowButton onPress={goToRevision} text={"Current Revision"} />
        )}
      </View>
    </Card>
  );
});

const styles = StyleSheet.create({
  amendmentWrapper: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "stretch",
    width: "100%",
    marginBottom: 20,
  },
  title: {
    width: "90%",
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
  focusButton: {
    backgroundColor: "#00DFFC",
  },
  button: {
    padding: 5,
    height: 35,
    width: 35,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#00dffc",
    borderRadius: 9999,
  },
  removeOutline: {
    ...Platform.select({
      web: {
        outlineStyle: "none",
      },
    }),
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
    justifyContent: "space-between",
  },
  centeredRow: {
    alignItems: "center",
  },
});
