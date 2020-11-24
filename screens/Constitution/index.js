import React, { useGlobal, useState } from "reactn";
import Amendment from "../../components/Amendment";
import {
  GET_AMENDMENTS_FROM_CIRCLE_ID,
  IS_USER_IN_CIRCLE,
} from "../../graphql/queries";

import {
  SUB_TO_CIRCLES_AMENDMENTS,
  SUB_TO_AMENDMENTS_REVISONS,
} from "../../graphql/subscriptions";

import {
  Text,
  ScrollView,
  StyleSheet,
  View,
  KeyboardAvoidingView,
} from "react-native";
import { useQuery, useSubscription } from "@apollo/client";
import CenteredLoaderWithText from "../../components/CenteredLoaderWithText";
import CenteredErrorLoader from "../../components/CenteredErrorLoader";

import ConstitutionFooter from "./ConstitutionFooter";
import Input from "../../components/Input";
import { useEffect } from "react";

export default function Constitution({ route }) {
  // const [activeTheme] = useGlobal("activeTheme");
  const [activeCircle] = useGlobal("activeCircle");
  const [showConstSearch] = useGlobal("showConstSearch");
  const [, setActiveRevision] = useGlobal("activeRevision");
  const [user] = useGlobal("user");

  const [searchParams, setSearchParams] = useState("");

  const [selectedAmendment, setSelectedAmendment] = useState(null);

  const { loading, error, data, refetch } = useQuery(
    GET_AMENDMENTS_FROM_CIRCLE_ID,
    {
      variables: {
        id: route.params.circle,
      },
      fetchPolicy: "cache-and-network",
    }
  );

  // see if the user actually belongs to this circle
  const { loading: loading2, error: e2, data: belongsToCircleData } = useQuery(
    IS_USER_IN_CIRCLE,
    {
      variables: {
        circle: route.params.circle,
        user: user || "",
      },
    }
  );

  // listen for changes to amendments
  useSubscription(SUB_TO_CIRCLES_AMENDMENTS, {
    variables: { id: route.params.circle },
    onSubscriptionData,
  });

  function onSubscriptionData({ subscriptionData }) {
    if (subscriptionData.data) {
      refetch({
        id: route.params.circle,
      });
    }
  }

  // listen to changes on amendments (specifically to see if amendment has outstanding revision)
  useSubscription(SUB_TO_AMENDMENTS_REVISONS, {
    variables: { id: route.params.circle },
    onSubscriptionData: onSubscriptionData2,
  });

  function onSubscriptionData2({ subscriptionData }) {
    if (subscriptionData.data) {
      refetch({
        id: activeCircle,
      });
    }
  }

  let belongsToCircle = false;

  if (
    belongsToCircleData &&
    belongsToCircleData.circlesList &&
    belongsToCircleData.circlesList.items.length !== 0 &&
    belongsToCircleData.circlesList.items[0].id === activeCircle
  ) {
    belongsToCircle = true;
  }

  useEffect(() => {
    setActiveRevision(null);
  }, []);

  const selectAmendment = (id) => {
    setSelectedAmendment(id);
  };
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

  if (loading || loading2) {
    <CenteredLoaderWithText text={"Getting Constitution"} />;
  }

  // Network Error
  if (e2 || error) {
    return <CenteredErrorLoader text={"Unable to connect to network"} />;
  }
  if (data && data.circle) {
    circle = data.circle;
    amendments = circle.amendments.items;

    if (showConstSearch && searchParams.trim() !== "") {
      const filteredAmendments = amendments.filter(
        (a) => a.title.includes(searchParams) || a.text.includes(searchParams)
      );
      amendments = filteredAmendments;
    }

    return (
      <View style={[styles.wrapper]}>
        <View
          style={{
            flex: 0.95,
          }}
        >
          {showConstSearch && (
            <Input
              placeholder={"Search Amendments"}
              value={searchParams}
              onChangeText={setSearchParams}
            />
          )}
          <ScrollView>
            {/* Only show preamble if we're not searching */}
            {!showConstSearch && (
              <Text style={styles.preamble}>{circle.preamble}</Text>
            )}
            <KeyboardAvoidingView behavior="padding">
              {amendments.map((amendment) => (
                <Amendment
                  key={amendment.id}
                  amendment={amendment}
                  onPress={selectAmendment}
                  isSelected={selectedAmendment === amendment.id}
                  belongsToCircle={belongsToCircle}
                />
              ))}
            </KeyboardAvoidingView>
          </ScrollView>
        </View>

        <ConstitutionFooter />
      </View>
    );
  } else {
    return <CenteredLoaderWithText text={"Getting Constitution"} />;
  }
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "stretch",
    justifyContent: "space-between",
    width: "100%",
    flex: 1,
    padding: 15,
  },
  amendmentsList: {
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
    fontFamily: "SpaceGrotesk",
  },
});
