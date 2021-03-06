import React, { useGlobal, memo, useCallback } from "reactn";

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
import IconButton from "./IconButton";

export default memo(function Header({
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
  const [showConstSearch, setShowConstSearch] = useGlobal("showConstSearch");
  const [invites] = useGlobal("invites");

  // replace this with a query hook
  const data = null;

  const toggleDrawer = useCallback(() => {
    RootNavigation.navigate("settings");
  }, [RootNavigation]);

  const toggleSearch = useCallback(() => {
    setShowSearch(!showSearch);
  }, [setShowSearch]);

  const goToLogin = useCallback(() => {
    RootNavigation.navigate("portal", { screen: "login" });
  }, [RootNavigation]);

  const goToApp = useCallback(() => {
    RootNavigation.navigate("app");
  }, [RootNavigation]);

  const back = useCallback(() => {
    // if (!props.previous) {
    RootNavigation.navigate("app");
    //   return;
    // }
    // props.navigation.goBack(null);
  }, [RootNavigation]);

  const more = useCallback(() => {
    let { name } = scene.route;
    if (name === "DMChannel") {
      setDMSettings(!dmSettings);
    }
  }, [setDMSettings]);

  // const createRevision = () => {
  //     props.navigation.navigate("createRevision");
  // };

  const toggleSearchConst = useCallback(() => {
    setShowConstSearch(!showConstSearch);
  }, [setShowConstSearch]);

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
        <IconButton
          onPress={back}
          name="chevron-left"
          size={30}
          color={"#FFFFFF"}
        />
        <Text style={styles.headerText} numberOfLines={1}>
          {simpleChannelsObj[name]}
        </Text>

        <Feather name="search" size={30} color={"transparent"} />
      </View>
    );
  }

  if (name === "constitution") {
    const searchIcon = showConstSearch ? "x" : "search";
    return (
      <View style={[styles.header, styles.headerThemeDark, styles.headerTheme]}>
        <IconButton
          onPress={back}
          name="chevron-left"
          size={30}
          color={"#FFFFFF"}
        />

        <Text style={styles.headerText} numberOfLines={1}>
          CONSTITUTION
        </Text>

        <IconButton
          onPress={toggleSearchConst}
          name={searchIcon}
          size={30}
          color={"#FFFFFF"}
        />
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
        <IconButton
          onPress={back}
          name="chevron-left"
          size={30}
          color={"#FFFFFF"}
        />
        {data && data.channel && (
          <Text style={styles.headerText} numberOfLines={1}>
            {loading ? "" : data.channel.name}
          </Text>
        )}
        {name === "DMChannel" ? (
          <IconButton
            onPress={more}
            name="more-vertical"
            size={30}
            color={"#FFFFFF"}
          />
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
        <IconButton
          onPress={back}
          name="chevron-left"
          size={30}
          color={"#FFFFFF"}
        />

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
        <IconButton
          onPress={back}
          name="chevron-left"
          size={30}
          color={"#FFFFFF"}
        />

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
        <IconButton
          onPress={back}
          name="chevron-left"
          size={30}
          color={"#FFFFFF"}
        />
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
  if (["portal"].indexOf(name) !== -1) {
    return (
      <View style={[styles.header, styles.bgTransparent]}>
        <IconButton
          onPress={back}
          name="chevron-left"
          size={30}
          color={"#FFFFFF"}
        />

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
          <LinkButton
            onPress={goToApp}
            text={"App"}
            style={styles.marginZero}
          />
        ) : (
          <LinkButton
            onPress={goToLogin}
            text={"Login"}
            style={styles.marginZero}
          />
        )}
      </View>
    );
  }

  // Render Portal
  // render channelName and back
  if (name === "settings") {
    return (
      <View style={[styles.header, styles.bgTransparent]}>
        <IconButton
          onPress={back}
          name="chevron-left"
          size={30}
          color={"#FFFFFF"}
        />

        <Feather name="more-vertical" size={30} color={"transparent"} />
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
  const shouldShowBadge = invites.length !== 0;
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={toggleDrawer}>
        <WithBadge showBadge={shouldShowBadge} top={25} left={25}>
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
        <IconButton
          onPress={toggleSearch}
          name="search"
          size={30}
          color={"#FFFFFF"}
          numberOfLines={1}
        />
      ) : (
        <IconButton
          onPress={toggleSearch}
          name="x"
          size={30}
          color={"#FFFFFF"}
          numberOfLines={1}
        />
      )}
    </View>
  );
});

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
    borderWidth: 2,
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
  marginZero: { margin: 0 },
});
