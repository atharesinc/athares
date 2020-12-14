import React, { useEffect, useGlobal } from "reactn";

import { ScrollView, StyleSheet } from "react-native";

import RevisionBoard from "./RevisionBoard";
import { GET_REVISIONS_FROM_CIRCLE_ID } from "../../graphql/queries";
import { useQuery } from "@apollo/client";

import CenteredLoaderWithText from "../../components/CenteredLoaderWithText";
import CenteredErrorLoader from "../../components/CenteredErrorLoader";
import GhostButton from "../../components/GhostButton";
import DisclaimerText from "../../components/DisclaimerText";

import useBelongsInCircle from "../../utils/useBelongsInCircle";

import { unixTime } from "../../utils/transform";

export default function Revisions(props) {
  const [, setActiveChannel] = useGlobal("activeChannel");
  const [activeCircle, setActiveCircle] = useGlobal("activeCircle");
  const [user] = useGlobal("user");

  useEffect(() => {
    setActiveChannel(null);
    if (activeCircle !== props.route.params.circle) {
      setActiveCircle(props.route.params.circle);
    }
  }, []);

  const belongsToCircle = useBelongsInCircle({
    user: user,
    circle: props.route.params.circle,
  });

  const { data, loading, error } = useQuery(GET_REVISIONS_FROM_CIRCLE_ID, {
    variables: {
      id: props.route.params.circle,
    },
  });

  // Update Title after loading data if we don't already have it
  useEffect(() => {
    if (data && data.circle && !props.route.params.name) {
      const {
        circle: { name },
      } = data;
      props.navigation.setParams({ name });
    }
  }, [data]);

  const goToSettings = () => {
    props.navigation.navigate("circleSettings", { circle: activeCircle });
  };

  let allRevisions = [];

  // if (data && data.circle) {
  // }

  if (loading) {
    return <CenteredLoaderWithText />;
  }

  // Network Error
  if (!data || error) {
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
        text={"Review proposed legislation and changes to existing laws"}
      />

      <GhostButton
        text={"Subscribe to Revisions"}
        onPress={goToSettings}
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
  },
});
