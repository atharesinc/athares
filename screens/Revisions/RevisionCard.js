import React, { useGlobal } from "reactn";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import RevisionCategory from "../../components/RevisionCategory";
import * as RootNavigation from "../../navigation/RootNavigation";
import DisclaimerText from "../../components/DisclaimerText";
import Card from "../../components/Card";
import VotesCounter from "../../components/VotesCounter";

const RevisionCard = ({
  revision: {
    amendment = null,
    newText,
    createdAt,
    backer,
    votes = [],
    title,
    id,
    repeal = false,
  },
}) => {
  const [, setActiveRevision] = useGlobal("activeRevision");
  const [activeCircle] = useGlobal("activeCircle");

  const goToRevision = () => {
    setActiveRevision(id, () => {
      RootNavigation.navigate("viewRevision", {
        circle: activeCircle,
        revision: id,
      });
    });
  };

  // useEffect(() => {
  //   if (activeRevision) {
  //     RootNavigation.navigate("viewRevision", {circle: activeCircle, revision: activeRevision});
  //   }
  // }, [activeRevision]);

  const support = votes.items.filter(({ support }) => support).length;
  const img = backer
    ? { uri: backer.icon }
    : require("../../assets/images/user-default.png");

  return (
    <TouchableOpacity style={styles.cardWrapper} onPress={goToRevision}>
      <View style={styles.cardHeader}>
        <DisclaimerText text={title} style={styles.marginBottomZero} />
      </View>
      <Card>
        <View style={styles.cardStats}>
          <RevisionCategory amendment={amendment} repeal={repeal} />
          <VotesCounter
            support={support}
            reject={votes.items.length - support}
          />
        </View>
        <DisclaimerText
          ellipsizeMode={"tail"}
          numberOfLines={3}
          text={newText}
        />
        <View style={styles.backerWrapper}>
          <View style={styles.backerImgWrapper}>
            <Image style={styles.backerImg} source={img} />
          </View>
          <DisclaimerText
            text={new Date(createdAt).toLocaleString()}
            style={styles.marginBottomZero}
          />
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default RevisionCard;

const styles = StyleSheet.create({
  cardWrapper: {
    width: 300,
    marginBottom: 15,
  },
  cardHeader: {
    backgroundColor: "#3a3e52",
    padding: 10,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  marginBottomZero: { marginBottom: 0 },
  cardBody: {
    width: "100%",
    padding: 10,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "#282a38",
  },
  cardStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  backerWrapper: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  backerImgWrapper: {
    borderRadius: 9999,
    height: 40,
    width: 40,
    marginRight: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderColor: "#FFF",
  },
  backerImg: {
    height: 40,
    width: 40,
  },
  proposedDate: {
    fontSize: 15,
    color: "#FFFFFFb7",
  },
  greenText: {
    color: "#9eebcf",
  },
  redText: {
    color: "#ff725c",
  },
  greenBorder: {
    borderColor: "#9eebcf",
  },
  redBorder: {
    borderColor: "#ff725c",
  },
});
