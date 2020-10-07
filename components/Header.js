import React, { useGlobal } from "reactn";

import { Text, TouchableOpacity, StyleSheet, View } from "react-native";
import * as RootNavigation from "../navigation/RootNavigation";
import { Feather } from "@expo/vector-icons";
import { GET_CHANNEL_NAME_BY_ID, GET_REVISION_BY_ID } from "../graphql/queries";
import { useQuery } from "@apollo/client";
import RevisionCategory from "./RevisionCategory";
import WithBadge from "./WithBadge";

import AsyncImage from "./AsyncImage";

function Header({
  // loggedIn = false,
  // belongsToCircle = false,
  scene,
  ...props
}) {
  const [showSearch, setShowSearch] = useGlobal("showSearch");
  const [dmSettings, setDMSettings] = useGlobal("dmSettings");
  // const [user, setUser] = useGlobal("user");
  const [activeChannel] = useGlobal("activeChannel");
  const [activeRevision] = useGlobal("activeRevision");
  // const [viewUser, setViewUser] = useGlobal("viewUser");
  const [, setIsMenuOpen] = useGlobal("isMenuOpen");
  const [showConstSearch, setShowConstSearch] = useGlobal("showConstSearch");
  const [invites] = useGlobal("invites");

  // replace this with a query hook
  const data = null;

  const toggleDrawer = () => {
    setIsMenuOpen(true);
  };
  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };
  const back = () => {
    if (!props.previous) {
      RootNavigation.navigate("app");
    }
    props.navigation.goBack(null);
  };
  const more = () => {
    let { name } = scene.route;
    if (name === "DMChannel") {
      setDMSettings(!dmSettings);
    }
  };
  // const createRevision = () => {
  //     props.navigation.navigate("createRevision");
  // };

  const toggleSearchConst = () => {
    setShowConstSearch(!showConstSearch);
  };

  const { name } = scene.route;

  const simpleChannelsArr = [
    "createCircle",
    "circleSettings",
    "createChannel",
    "addUser",
    "revisions",
    "createDM",
    "createRevision",
    "editAmendment",
    "viewInvites",
  ];

  const simpleChannelsObj = {
    createCircle: "Create Circle",
    circleSettings: "Circle Settings",
    createChannel: "Create Channel",
    addUser: "Invite User",
    revisions: "Revisions",
    createDM: "New Message",
    createRevision: "Create Revision",
    editAmendment: "Edit Amendment",
    viewInvites: "Invites",
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
          <Feather name="chevron-left" size={30} color={"#FFFFFF"} />
        </TouchableOpacity>
        <Text style={styles.headerText} numberOfLines={1}>
          {simpleChannelsObj[name]}
        </Text>

        <Feather name="search" size={30} color={"transparent"} />
      </View>
    );
  }

  if (name === "constitution") {
    return (
      <View style={[styles.header, styles.headerThemeDark, styles.headerTheme]}>
        <TouchableOpacity onPress={back}>
          <Feather name="chevron-left" size={30} color={"#FFFFFF"} />
        </TouchableOpacity>
        <Text style={styles.headerText} numberOfLines={1}>
          CONSTITUTION
        </Text>
        <TouchableOpacity onPress={toggleSearchConst}>
          <Feather
            name={showConstSearch ? "x" : "search"}
            size={30}
            color={"#FFFFFF"}
          />
        </TouchableOpacity>
      </View>
    );
  }

  // render channelName and back
  if (["channel", "DMChannel"].indexOf(name) !== -1) {
    const { loading, data } = useQuery(GET_CHANNEL_NAME_BY_ID, {
      variables: {
        id: activeChannel || "",
      },
    });

    return (
      <View style={[styles.header, styles.headerThemeDark]}>
        <TouchableOpacity onPress={back}>
          <Feather name="chevron-left" size={30} color={"#FFFFFF"} />
        </TouchableOpacity>
        {data && data.channel && (
          <Text style={styles.headerText} numberOfLines={1}>
            {loading ? "" : data.channel.name}
          </Text>
        )}
        {name === "DMChannel" ? (
          <TouchableOpacity onPress={more}>
            <Feather name="more-vertical" size={30} color={"#FFFFFF"} />
          </TouchableOpacity>
        ) : (
          <Feather name="more-vertical" size={30} color={"transparent"} />
        )}
      </View>
    );
  }
  // render revision name and back
  if (name === "viewRevision") {
    const { data: revisionData } = useQuery(GET_REVISION_BY_ID, {
      variables: { id: activeRevision || "" },
    });

    return (
      <View style={[styles.header, styles.headerThemeDark]}>
        <TouchableOpacity onPress={back}>
          <Feather name="chevron-left" size={30} color={"#FFFFFF"} />
        </TouchableOpacity>

        {revisionData && revisionData.revision ? (
          <RevisionCategory
            repeal={revisionData.revision.repeal}
            amendment={revisionData.revision.amendment}
          />
        ) : (
          <Feather name="more-vertical" size={30} color={"transparent"} />
        )}
      </View>
    );
  }
  // render username and back
  if (["viewUser", "viewOtherUser"].indexOf(name) !== -1) {
    return (
      <View style={[styles.header, styles.headerThemeDark]}>
        <TouchableOpacity onPress={back}>
          <Feather name="chevron-left" size={30} color={"#FFFFFF"} />
        </TouchableOpacity>
        {data.User && (
          <Text style={styles.headerText} numberOfLines={1}>
            {data.User.firstName + " " + data.User.lastName}
          </Text>
        )}
        <Feather name="more-vertical" size={30} color={"transparent"} />
      </View>
    );
  }
  // render dashboard with user drawer

  // if (data.User) {
  let img = require("../assets/images/user-default.png");

  if (data && data.user) {
    img = { uri: data.user.icon };
  }
  console.log("invites", invites, "shoul show badge", invites.length !== 0);

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={toggleDrawer}>
        <WithBadge showBadge={invites.length !== 0} top={25} left={25}>
          <View style={styles.userIconWrapper}>
            <AsyncImage
              source={img}
              style={styles.userIcon}
              placeholderColor={"#3a3e52"}
            />
          </View>
        </WithBadge>
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
          <Feather name="search" size={30} color={"#FFFFFF"} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={toggleSearch}>
          <Feather name="x" size={30} color={"#FFFFFF"} numberOfLines={1} />
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
    textTransform: "uppercase",
    fontFamily: "SpaceGrotesk",
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
