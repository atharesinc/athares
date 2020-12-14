import React, { useGlobal } from "reactn";

import { Text, TouchableOpacity, StyleSheet, View, Image } from "react-native";
import * as RootNavigation from "../navigation/RootNavigation";
import Feather from "@expo/vector-icons/Feather";
import {
  GET_CHANNEL_NAME_BY_ID,
  GET_REVISION_BY_ID,
  GET_USER_BY_ID,
} from "../graphql/queries";
import { useQuery } from "@apollo/client";
import RevisionCategory from "./RevisionCategory";
import WithBadge from "./WithBadge";
import LinkButton from "./LinkButton";

import AsyncImage from "./AsyncImage";
import Pill from "./Pill";

function Header({
  // loggedIn = false,
  // belongsToCircle = false,
  scene,
  // ...props
}) {
  const [showSearch, setShowSearch] = useGlobal("showSearch");
  const [dmSettings, setDMSettings] = useGlobal("dmSettings");
  const [user] = useGlobal("user");
  const [activeChannel] = useGlobal("activeChannel");
  const [activeRevision] = useGlobal("activeRevision");
  const [activeViewUser] = useGlobal("activeViewUser");
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

  const goToLogin = () => {
    RootNavigation.navigate("portal", { screen: "login" });
  };

  const goToApp = () => {
    RootNavigation.navigate("app");
  };

  const back = () => {
    // if (!props.previous) {
    RootNavigation.navigate("app");
    //   return;
    // }
    // props.navigation.goBack(null);
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
    "news",
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
    news: "News",
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
      variables: { id: activeRevision },
      skip: !activeRevision,
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
  if (name === "viewUser") {
    // const { data } = useQuery(GET_USER_BY_ID, {
    //   variables: { id: user || "" },
    // });

    return (
      <View style={[styles.header, styles.headerThemeDark]}>
        <TouchableOpacity onPress={back}>
          <Feather name="chevron-left" size={30} color={"#FFFFFF"} />
        </TouchableOpacity>

        <Text style={styles.headerText} numberOfLines={1}>
          Profile
        </Text>

        <Feather name="more-vertical" size={30} color={"transparent"} />
      </View>
    );
  }

  // render other user's profile
  if (name === "viewOtherUser") {
    const { data } = useQuery(GET_USER_BY_ID, {
      variables: { id: activeViewUser || "" },
    });
    return (
      <View style={[styles.header, styles.headerThemeDark]}>
        <TouchableOpacity onPress={back}>
          <Feather name="chevron-left" size={30} color={"#FFFFFF"} />
        </TouchableOpacity>
        {data && data.user && (
          <Text style={styles.headerText} numberOfLines={1}>
            {data.user.firstName + " " + data.user.lastName}
          </Text>
        )}
        <Feather name="more-vertical" size={30} color={"transparent"} />
      </View>
    );
  }

  // Render Portal
  // render channelName and back
  if (["portal"].indexOf(name) !== -1) {
    return (
      <View style={[styles.header, styles.bgTransparent]}>
        <TouchableOpacity onPress={back}>
          <Feather name="chevron-left" size={30} color={"#FFFFFF"} />
        </TouchableOpacity>

        <Feather name="more-vertical" size={30} color={"transparent"} />
      </View>
    );
  }

  if (["splash", "privacy", "about"].indexOf(name) !== -1) {
    return (
      <View style={styles.transparentHeader}>
        <Image
          source={require("../assets/images/Athares-type-small-white.png")}
          style={styles.logoType}
        />
        {user ? (
          <LinkButton onPress={goToApp} text={"App"} style={{ margin: 0 }} />
        ) : (
          <LinkButton
            onPress={goToLogin}
            text={"Login"}
            style={{ margin: 0 }}
          />
        )}
      </View>
    );
  }

  if (name === "notFound") {
    return null;
  }

  // render dashboard with user drawer

  let img = require("../assets/images/user-default.png");

  if (data && data.user) {
    img = { uri: data.user.icon };
  }
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
      <Pill text={"DEV"} />
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
  bgTransparent: {
    backgroundColor: "transparent",
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
  logoType: {
    height: 20,
    width: 125,
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
  transparentHeader: {
    backgroundColor: "transparent",
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    width: "100%",
    zIndex: 0,
  },
});

export default Header;
