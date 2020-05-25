import React, { useGlobal } from "reactn";

import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  View,
} from "react-native";
import * as RootNavigation from "../navigation/RootNavigation";
import { Feather } from "@expo/vector-icons";
import CircleIcon from "./CircleIcon";

import { GET_CIRCLES_BY_USER_ID } from "../graphql/queries";
import { useQuery } from "@apollo/react-hooks";

const Circles = ({ loggedIn = false, ...props }) => {
  const [activeCircle, setActiveCircle] = useGlobal("activeCircle");
  const [user] = useGlobal("user");
  const [, setActiveRevision] = useGlobal("activeRevision");
  const [, setActiveChannel] = useGlobal("activeChannel");

  const selectCircle = (id = null) => {
    setActiveCircle(id);

    // deselect if different from current
    if (id !== activeCircle) {
      setActiveRevision(null);
      setActiveChannel(null);
    }
    RootNavigation.navigate("app");
  };

  const goToCreateCircle = () => {
    if (loggedIn) {
      RootNavigation.navigate("createCircle");
    }
  };

  let circles = [];

  const { loading, error, data } = useQuery(GET_CIRCLES_BY_USER_ID, {
    variables: {
      id: user || "",
    },
  });

  if (data) {
    circles = data.user.circles.items;
  }

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.addCircleWrapper}
        onPress={goToCreateCircle}
      >
        <View style={styles.iconWrapper}>
          <Feather
            name="plus-circle"
            color={loggedIn ? "#FFFFFF" : "#2f3242"}
            size={25}
          />
        </View>
        <Text numberOfLines={1} style={styles.circleLabel}>
          New
        </Text>
      </TouchableOpacity>
      <ScrollView horizontal={true} contentContainerStyle={styles.circlesList}>
        {circles.map((c) => (
          <CircleIcon
            selected={c.id === activeCircle}
            selectCircle={selectCircle}
            circle={c}
            key={c.id}
          />
        ))}
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
});

export default Circles;
