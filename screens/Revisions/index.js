import React, { useEffect, useGlobal } from "reactn";

import { ScrollView, StyleSheet } from "react-native";

import RevisionBoard from "./RevisionBoard";
import {
  GET_REVISIONS_FROM_CIRCLE_ID,
  IS_USER_IN_CIRCLE,
} from "../../graphql/queries";
import { useQuery } from "@apollo/client";

import CenteredLoaderWithText from "../../components/CenteredLoaderWithText";
import GhostButton from "../../components/GhostButton";
import DisclaimerText from "../../components/DisclaimerText";

import { unixTime } from "../../utils/transform";

export default function Revisions(props) {
  const [, setActiveChannel] = useGlobal("activeChannel");
  const [activeCircle] = useGlobal("activeCircle");
  const [user] = useGlobal("user");

  useEffect(() => {
    setActiveChannel(null);
  }, []);

  let belongsToCircle = false;
  // see if the user actually belongs to this circle
  const { loading: loading, error: e2, data: belongsToCircleData } = useQuery(
    IS_USER_IN_CIRCLE,
    {
      variables: {
        circle: activeCircle || "",
        user: user || "",
      },
    }
  );

  const { data, loading: loading2 } = useQuery(GET_REVISIONS_FROM_CIRCLE_ID, {
    variables: {
      id: activeCircle || "",
    },
  });

  if (
    belongsToCircleData &&
    belongsToCircleData.circlesList &&
    belongsToCircleData.circlesList.items.length !== 0 &&
    belongsToCircleData.circlesList.items[0].id === activeCircle
  ) {
    belongsToCircle = true;
  }

  const goToSettings = () => {
    props.navigation.navigate("circleSettings");
  };

  let allRevisions = [];

  if (data && data.circle) {
  }

  if (loading || loading2) {
    return <CenteredLoaderWithText />;
  }

  // Network Error
  if (!data) {
    return <CenteredErrorLoader text={"Unable to connect to network"} />;
  }

  allRevisions = data.circle.revisions.items;

  allRevisions = allRevisions.map((r) => {
    return {
      votes: r.votes.items.filter((v) => v.revision === r.id),
      ...r,
    };
  });
  let now = unixTime();

  // all non-expired revisions
  let newRevisions = allRevisions.filter(
    (r) => r.passed === null && now < unixTime(r.expires)
  );
  // passed in the last week
  let recentlyPassed = allRevisions.filter(
    (r) => r.passed === true && now - unixTime(r.expires) <= 604800000
  );
  // rejected in the last week
  let recentlyRejected = allRevisions.filter(
    (r) => r.passed === false && now - unixTime(r.expires) <= 604800000
  );

  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <DisclaimerText
        upper
        grey
        text={`Review proposed legislation and changes to existing laws`}
      />

      <GhostButton
        text={"Subscribe to Revisions"}
        onPress={goToSettings}
        style={styles.button}
        textStyle={styles.buttonText}
      />

      <ScrollView horizontal={true} style={styles.boardsWrapper}>
        <RevisionBoard
          boardName="New Revisions"
          revisions={newRevisions}
          circleID={activeCircle}
          user={user}
          belongsToCircle={belongsToCircle}
        />
        <RevisionBoard
          boardName="Recently Passed"
          revisions={recentlyPassed}
          circleID={activeCircle}
          user={user}
          belongsToCircle={belongsToCircle}
        />
        <RevisionBoard
          boardName="Recently Rejected"
          revisions={recentlyRejected}
          circleID={activeCircle}
          user={user}
          belongsToCircle={belongsToCircle}
        />
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    flex: 1,
    padding: 15,
    flexDirection: "column",
  },
  buttonText: {
    fontSize: 12,
  },
  boardsWrapper: {
    width: "100%",
    // marginHorizontal: 15,
  },
});
