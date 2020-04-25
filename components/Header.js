import React, { useGlobal } from "reactn";

import { Text, TouchableOpacity, StyleSheet, View, Image } from "react-native";
import * as RootNavigation from "../navigation/RootNavigation";
import { Feather } from "@expo/vector-icons";

import AsyncImageAnimated from "react-native-async-image-animated";

function Header({
  // loggedIn = false,
  // belongsToCircle = false,
  scene,
  ...props
}) {
  const [showSearch, setShowSearch] = useGlobal("showSearch");
  const [dmSettings, setDMSettings] = useGlobal("dmSettings");
  const [user, setUser] = useGlobal("user");
  const [activeChannel, setActiveChannel] = useGlobal("activeChannel");
  const [activeRevision, setActiveRevision] = useGlobal("activeRevision");
  const [viewUser, setViewUser] = useGlobal("viewUser");

  // replace this with a query hook
  const data = null;

  const toggleDrawer = () => {
    props.navigation.toggleDrawer();
  };
  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };
  const back = () => {
    props.navigation.goBack(null);
  };
  const more = () => {
    let { name } = scene.route;
    if (name === "DMChannel") {
      setDMSettings(!dmSettings);
    }
  };
  const createRevision = () => {
    props.navigation.navigate("CreateRevision");
  };

  const { name } = scene.route;
  const routeTitleIndex = /[A-Z]/.exec("createChannel").index;

  const simpleChannelsArr = [
    "createCircle",
    "circleSettings",
    "constitution",
    "createChannel",
    "addUser",
    "revisions",
    "createDM",
    "createRevision",
    "editAmendment",
  ];

  const simpleChannelsObj = {
    createCircle: "Create Circle",
    circleSettings: "Circle Settings",
    constitution: "Constitution",
    createChannel: "Create Channel",
    addUser: "Add User",
    revisions: "Revisions",
    createDM: "New Message",
    createRevision: "Create Revision",
    editAmendment: "Edit Amendment",
  };
  // render screen name and back
  if (simpleChannelsArr.indexOf(name) !== -1) {
    return (
      <View
        style={[
          styles.header,
          styles.headerThemeDark,
          name === "Revisions" ? styles.headerTheme : {},
        ]}
      >
        <TouchableOpacity onPress={back}>
          <Feather name="chevron-left" size={25} color={"#FFFFFF"} />
        </TouchableOpacity>
        <Text style={styles.headerText} numberOfLines={1}>
          {simpleChannelsObj[name]}
        </Text>
        {name === "Constitution" ? (
          <TouchableOpacity onPress={createRevision}>
            <Feather name="plus" size={25} color={"#FFFFFF"} />
          </TouchableOpacity>
        ) : (
          <Feather name="more-vertical" size={25} color={"transparent"} />
        )}
      </View>
    );
  }
  // render channelName and back
  if (["Channel", "DMChannel"].indexOf(name) !== -1) {
    return (
      <View style={[styles.header, styles.headerThemeDark]}>
        <TouchableOpacity onPress={back}>
          <Feather name="chevron-left" size={25} color={"#FFFFFF"} />
        </TouchableOpacity>
        {data.Channel && (
          <Text style={styles.headerText} numberOfLines={1}>
            {data.Channel.name}
          </Text>
        )}
        {name === "DMChannel" ? (
          <TouchableOpacity onPress={more}>
            <Feather name="more-vertical" size={25} color={"#FFFFFF"} />
          </TouchableOpacity>
        ) : (
          <Feather name="more-vertical" size={25} color={"transparent"} />
        )}
      </View>
    );
  }
  // render revision name and back
  if (name === "ViewRevision") {
    return (
      <View style={[styles.header, styles.headerThemeDark]}>
        <TouchableOpacity onPress={back}>
          <Feather name="chevron-left" size={25} color={"#FFFFFF"} />
        </TouchableOpacity>
        {data.Revision && (
          <Text style={styles.headerText} numberOfLines={1}>
            {data.Revision.title}
          </Text>
        )}
        <Feather name="more-vertical" size={25} color={"transparent"} />
      </View>
    );
  }
  // render username and back
  if (["ViewUser", "ViewOtherUser"].indexOf(name) !== -1) {
    return (
      <View style={[styles.header, styles.headerThemeDark]}>
        <TouchableOpacity onPress={back}>
          <Feather name="chevron-left" size={25} color={"#FFFFFF"} />
        </TouchableOpacity>
        {data.User && (
          <Text style={styles.headerText} numberOfLines={1}>
            {data.User.firstName + " " + data.User.lastName}
          </Text>
        )}
        <Feather name="more-vertical" size={25} color={"transparent"} />
      </View>
    );
  }
  // render dashboard with user drawer

  // if (data.User) {
  let img = require("../assets/images/user-default.png");

  if (data && data.User) {
    img = { uri: data.User.icon };
  }

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={toggleDrawer}>
        <View style={styles.userIconWrapper}>
          <AsyncImageAnimated
            source={img}
            style={styles.userIcon}
            placeholderColor={"#3a3e52"}
          />
        </View>
      </TouchableOpacity>
      <Text
        style={{
          color: "#FFF",
          fontSize: 15,
          letterSpacing: 2,
          padding: 5,
          paddingHorizontal: 10,
        }}
        numberOfLines={1}
        ellipsizeMode={"middle"}
      >
        {name}
      </Text>
      {!showSearch ? (
        <TouchableOpacity onPress={toggleSearch}>
          <Feather name="search" size={25} color={"#FFFFFF"} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={toggleSearch}>
          <Feather name="x" size={25} color={"#FFFFFF"} numberOfLines={1} />
        </TouchableOpacity>
      )}
    </View>
  );
  // }
  // return <View style={styles.header} />;
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#282a38",
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    width: "100%",
    zIndex: 0,
  },
  headerThemeDark: {
    backgroundColor: "#282a38",
  },
  headerTheme: {
    backgroundColor: "#2f3242",
  },
  headerThemeLighter: {
    backgroundColor: "#3a3e52",
  },
  headerText: {
    color: "#FFFFFF",
    fontSize: 15,
  },
  userIcon: {
    height: 35,
    width: 35,
  },
  userIconWrapper: {
    borderRadius: 9999,
    borderColor: "#FFFFFF",
    borderWidth: 3,
    height: 40,
    width: 40,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Header;
