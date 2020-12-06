import React, { useGlobal, useEffect, useState } from "reactn";
import Amendment from "../../components/Amendment";
import { GET_AMENDMENTS_FROM_CIRCLE_ID } from "../../graphql/queries";

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
import useBelongsInCircle from "../../utils/useBelongsInCircle";

export default function Constitution({ route, navigation }) {
  // const [activeTheme] = useGlobal("activeTheme");
  const [activeCircle, setActiveCircle] = useGlobal("activeCircle");
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

  // Update Title after loading data if we don't already have it
  useEffect(() => {
    if (data && data.circle && !route.params.name) {
      const {
        circle: { name },
      } = data;
      navigation.setParams({ name });
    }
  }, [data]);

  const belongsToCircle = useBelongsInCircle({
    user: user || "",
    circle: route.params.circle,
  });

  useEffect(() => {
    if (activeCircle !== route.params.circle) {
      setActiveCircle(route.params.activeCircle);
    }

    setActiveRevision(null);
  }, []);

  const selectAmendment = (id) => {
    setSelectedAmendment(id);
  };

  let circle = null;
  let amendments = [];

  if (loading) {
    <CenteredLoaderWithText text={"Getting Constitution"} />;
  }

  // Network Error
  if (error) {
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

        <ConstitutionFooter belongsToCircle={belongsToCircle} />
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
