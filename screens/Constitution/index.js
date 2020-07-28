import React, { Component, useGlobal } from "reactn";
import Amendment from "../../components/Amendment";
import { GET_AMENDMENTS_FROM_CIRCLE_ID } from "../../graphql/queries";

import { Text, ScrollView, StyleSheet, View } from "react-native";
import { useQuery } from "@apollo/client";
import CenteredLoaderWithText from "../../components/CenteredLoaderWithText";

export default function Constitution({ ...props }) {
  const [activeTheme] = useGlobal("activeTheme");
  const [activeCircle] = useGlobal("activeCircle");

  const { loading, error, data } = useQuery(GET_AMENDMENTS_FROM_CIRCLE_ID, {
    variables: {
      id: activeCircle || "",
    },
  });

  // _subToMore = (subscribeToMore) => {
  //   subscribeToMore({
  //     document: SUB_TO_CIRCLES_AMENDMENTS,
  //     variables: { id: activeCircle || "" },
  //     updateQuery: (prev, { subscriptionData }) => {
  //       let {
  //         previousValues,
  //         mutation,
  //         node: amendment,
  //       } = subscriptionData.data.Amendment;
  //       switch (mutation) {
  //         case "CREATED":
  //           let ind = prev.Circle.amendments.findIndex(
  //             (a) => a.id === amendment.id
  //           );
  //           // if the new node isn't in the data set
  //           if (ind === -1) {
  //             prev.Circle.amendments = [...prev.Circle.amendments, amendment];
  //           }
  //           break;
  //         case "UPDATED":
  //           let index = prev.Circle.amendments.findIndex(
  //             (a) => a.id === amendment.id
  //           );
  //           prev.Circle.amendments[index] = amendment;
  //           break;
  //         case "DELETED":
  //           let i = prev.Circle.amendments.findIndex(
  //             (a) => a.id === previousValues.id
  //           );
  //           prev.Circle.amendments.splice(i, 1);
  //           break;
  //         default:
  //           break;
  //       }
  //       return prev;
  //     },
  //   });
  // };

  let circle = null;
  let amendments = [];

  if (data && data.circle) {
    circle = data.circle;
    amendments = circle.amendments.items;

    return (
      <View
        styles={[styles.wrapper, { backgroundColor: activeTheme.COLORS.DARK }]}
      >
        <Text style={styles.preamble}>{circle.preamble}</Text>
        <ScrollView styles={[styles.wrapper]}>
          {amendments.map((amendment, i) => (
            <Amendment key={amendment.id} amendment={amendment} />
          ))}
        </ScrollView>
      </View>
    );
  } else {
    return <CenteredLoaderWithText text={"Getting Constitution"} />;
  }
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "stretch",
    justifyContent: "flex-start",
    width: "100%",
    flex: 1,
    padding: 15,
  },
  preamble: {
    color: "#FFFFFF",
    fontSize: 15,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 20,
    color: "#FFFFFF",
    marginTop: 15,
    width: "100%",
    textAlign: "center",
  },
});
