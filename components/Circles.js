import React, { useGlobal, useEffect } from "reactn";

import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  View,
} from "react-native";
import * as RootNavigation from "../navigation/RootNavigation";
import Feather from "@expo/vector-icons/Feather";
import CircleIcon from "./CircleIcon";

import { GET_CIRCLES_BY_USER_ID } from "../graphql/queries";
import { SUB_TO_USERS_CIRCLES } from "../graphql/subscriptions";

import { useQuery, useSubscription } from "@apollo/client";

const Circles = ({ loggedIn = false }) => {
  const [activeCircle, setActiveCircle] = useGlobal("activeCircle");
  const [user] = useGlobal("user");
  const [, setActiveRevision] = useGlobal("activeRevision");
  const [, setActiveChannel] = useGlobal("activeChannel");

  const selectCircle = (id = null) => {
    // deselect if different from current
    if (id !== activeCircle) {
      setActiveRevision(null);
      setActiveChannel(null);
    }
    setActiveCircle(id, () => {
      RootNavigation.navigate("app");
    });
  };

  const goToCreateCircle = () => {
    if (loggedIn) {
      RootNavigation.navigate("createCircle");
      return;
    }
    RootNavigation.navigate("portal", { screen: "login" });
  };

  let circles = [];

  const { loading, data, refetch } = useQuery(GET_CIRCLES_BY_USER_ID, {
    variables: {
      id: user,
    },
    skip: !user,
  });

  useSubscription(SUB_TO_USERS_CIRCLES, {
    variables: { id: user },
    skip: !user,
    onSubscriptionData,
  });

  function onSubscriptionData({ subscriptionData }) {
    if (!user) {
      return;
    }

    if (subscriptionData.data) {
      // fire off query again  vs. just add the new value to candidates
      refetch({
        id: user,
      });
    }
  }

  if (data) {
    circles = data.user.circles.items;
  }

  // this may come back to haunt me
  // set the first result to active
  // UPDATE: This was super great and worked real well
  // BUT it' breaks the ability to put navigate to a page via link
  // So if any params are set, we'll let the router use those, otherwise
  // give the user something to look at
  // UPDATE THE SECOND: since params are available first,
  // the screen should always set the activeCircle before login is complete,
  // So we only need to set te circle if a param hasn't done it already
  useEffect(() => {
    // console.log(RootNavigation.getRoute());
    // const route = RootNavigation.getRoute();
    // http://localhost:19006/ckhy6dkc101oa07mfewj16ulj/settings
    // if (route?.params) {
    //   return;
    // }

    if (circles.length > 0 && !activeCircle) {
      setActiveCircle(circles[0].id);
    }
  }, [circles]);

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.addCircleWrapper}
        onPress={goToCreateCircle}
      >
        <View style={styles.iconWrapper}>
          <Feather
            name="plus-circle"
            color={loggedIn ? "#FFFFFF" : "#FFFFFFb7"}
            size={25}
          />
        </View>
        <Text numberOfLines={1} style={styles.circleLabel}>
          New
        </Text>
      </TouchableOpacity>
      <ScrollView horizontal={true} contentContainerStyle={styles.circlesList}>
        {loading ? (
          <>
            <View style={[styles.placeholderCircleWrapper, { borderWidth: 4 }]}>
              <View style={styles.placeholderCircle} />
            </View>
            <View style={[styles.placeholderCircleWrapper]}>
              <View style={styles.placeholderCircle} />
            </View>
          </>
        ) : (
          circles.map((c) => (
            <CircleIcon
              selected={c.id === activeCircle}
              selectCircle={selectCircle}
              circle={c}
              key={c.id}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  addCircleWrapper: {
    width: 30,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: 15,
  },
  iconWrapper: {
    width: 30,
    height: 60,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  circlesList: {
    justifyContent: "flex-start",
    alignItems: "center",
  },
  wrapper: {
    backgroundColor: "#282a38",
    paddingHorizontal: 15,
    paddingVertical: 10,
    // height: "15%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  circleLabel: {
    fontSize: 13,
    color: "#ffffffb7",
    fontFamily: "SpaceGrotesk",
  },
  placeholderCircle: {
    height: 60,
    width: 60,
    backgroundColor: "#3a3e52",
  },
  placeholderCircleWrapper: {
    width: 60,
    height: 60,
    borderRadius: 9999,
    marginBottom: 5,
    borderColor: "#00dffc",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginRight: 15,
  },
});

export default Circles;
