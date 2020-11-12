import React, { useGlobal } from "reactn";
import { useQuery } from "@apollo/client";

import Statistic from "../../components/Statistic";
import Title from "../../components/Title";
import DisclaimerText from "../../components/DisclaimerText";

import { GET_USER_BY_ID_ALL } from "../../graphql/queries";

import { View, ScrollView, StyleSheet, Image } from "react-native";

import CenteredLoaderWithText from "../../components/CenteredLoaderWithText";
import CenteredErrorLoader from "../../components/CenteredErrorLoader";

export default function ViewOtherUser() {
  const [activeViewUser] = useGlobal("activeViewUser");

  let user,
    stats = null;

  const { data, loading, error } = useQuery(GET_USER_BY_ID_ALL, {
    variables: {
      id: activeViewUser || "",
    },
  });

  if (loading) {
    return <CenteredLoaderWithText text={"Loading User Info"} />;
  }

  if (error) {
    return <CenteredErrorLoader text={"Error Fetching User"} />;
  }

  if (data && data.user) {
    user = data.user;
    stats = {
      voteCount: user.votes.items.length,
      circleCount: user.circles.items.length,
      revisionCount: user.revisions.items.length,
      passedRevisionCount: user.revisions.items.filter((r) => r.passed).length,
    };
  }

  return (
    <ScrollView contentContainerStyle={[styles.wrapper]}>
      <View style={styles.userAndImageWrapper}>
        <View style={[styles.previewWrapper]}>
          <Image source={{ uri: user.icon }} style={styles.preview} />
        </View>
      </View>

      {/* Stats */}
      <View style={styles.section}>
        <Title
          text={user.firstName + " " + user.lastName}
          textStyle={{ marginBottom: 0 }}
        />
        {user.uname && (
          <DisclaimerText
            grey
            text={"@" + user.uname}
            style={styles.disclaimer}
          />
        )}
        <Statistic header="Circles" text={stats.circleCount} />
        <Statistic header="Revisions Proposed" text={stats.revisionCount} />
        <Statistic
          header="Revisions Accepted"
          text={stats.passedRevisionCount}
        />
        <Statistic header="Times Voted" text={stats.voteCount} />
        <Statistic
          header="User Since"
          text={new Date(user.createdAt).toLocaleDateString()}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    textTransform: "uppercase",
    letterSpacing: 2,
    fontSize: 13,
    color: "#FFFFFFb7",
    marginBottom: 25,
  },
  wrapper: {
    alignItems: "stretch",
    justifyContent: "flex-start",
    width: "100%",
    flex: 1,
  },
  userNameText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  disclaimer: {
    width: "100%",
  },
  userAndImageWrapper: {
    flex: 1,
    padding: 15,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    marginTop: 15,
    marginHorizontal: 15,
    marginBottom: 10,
  },
  marginTop: {
    marginTop: 15,
  },
  preview: {
    height: 150,
    width: 150,
    resizeMode: "stretch",
    padding: 0,
    margin: 0,
  },
  previewWrapper: {
    backgroundColor: "transparent",
    height: 150,
    width: 150,
    padding: 0,
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: 9999,
    borderColor: "#FFFFFF",
    borderWidth: 5,
  },
});
