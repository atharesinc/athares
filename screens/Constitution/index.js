import React, { useGlobal, useState } from "reactn";
import Amendment from "../../components/Amendment";
import { GET_AMENDMENTS_FROM_CIRCLE_ID } from "../../graphql/queries";

import {
  Text,
  ScrollView,
  StyleSheet,
  View,
  KeyboardAvoidingView,
} from "react-native";
import { useQuery } from "@apollo/client";
import CenteredLoaderWithText from "../../components/CenteredLoaderWithText";
import ConstitutionFooter from "./ConstitutionFooter";
import Input from "../../components/Input";
import { useEffect } from "react";

export default function Constitution({ ...props }) {
  const [activeTheme] = useGlobal("activeTheme");
  const [activeCircle] = useGlobal("activeCircle");
  const [showConstSearch] = useGlobal("showConstSearch");
  const [, setActiveRevision] = useGlobal("activeRevision");

  const [searchParams, setSearchParams] = useState("");

  const [selectedAmendment, setSelectedAmendment] = useState(null);

  const { loading, error, data } = useQuery(GET_AMENDMENTS_FROM_CIRCLE_ID, {
    variables: {
      id: activeCircle || "",
    },
  });

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

  if (loading) {
    <CenteredLoaderWithText text={"Getting Constitution"} />;
  }

  if (data && data.circle) {
    circle = data.circle;
    amendments = circle.amendments.items;

    amendments =
      showConstSearch && searchParams.trim() !== ""
        ? amendments.filter(
            (a) =>
              a.title.includes(searchParams) || a.text.includes(searchParams)
          )
        : amendments;

    // { backgroundColor: activeTheme.COLORS.DARK
    return (
      <View style={[styles.wrapper]}>
        <View>
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
