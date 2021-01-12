import React, { useGlobal } from "reactn";
import * as RootNavigation from "../navigation/RootNavigation";
import { ScrollView, StyleSheet, View } from "react-native";
import { useQuery, useApolloClient, useMutation } from "@apollo/client";
import UserLink from "./UserLink";
import NoUserLink from "./NoUserLink";
import MenuLink from "./MenuLink";
import MeshStore from "../utils/meshStore";
import ContrastTitle from "./ContrastTitle";
import DisclaimerText from "./DisclaimerText";
import { GET_USER_BY_ID } from "../graphql/queries";
import { REMOVE_USER_EXPO_TOKEN } from "../graphql/mutations";
import { persistor } from "../graphql";

import packageJSON from "../package.json";

function SideMenu() {
  const [, setActiveChannel] = useGlobal("activeChannel");
  const [, setActiveCircle] = useGlobal("activeCircle");
  const [, setActiveRevision] = useGlobal("activeRevision");
  const [user, setUser] = useGlobal("user");
  const [, setPub] = useGlobal("pub");
  const [, setActiveAmendment] = useGlobal("setActiveAmendment");
  const [, setChannels] = useGlobal("setChannels");
  const [, setUnreadChannels] = useGlobal("setUnreadChannels");
  const [, setDMs] = useGlobal("setDMs");
  const [, setUnreadDMs] = useGlobal("setUnreadDMs");

  const [invites] = useGlobal("invites");
  const [token] = useGlobal("token");

  const [removeToken] = useMutation(REMOVE_USER_EXPO_TOKEN);

  const navigateToScreen = (route, params = null) => {
    if (route === "login") {
      RootNavigation.navigate("portal", { screen: "login" });
    } else {
      RootNavigation.navigate(route, params);
    }
  };

  const apolloClient = useApolloClient();

  const logout = async () => {
    // remove this device/apps push token from user's list
    try {
      if (token) {
        await removeToken({ variables: { user, token } });
      }
    } catch (err) {
      console.error(Error(err));
    }
    setActiveChannel(null);
    setActiveCircle(null);
    setActiveRevision(null);
    setUser(null);
    setPub(null);
    setActiveAmendment(null);
    setChannels([]);
    setUnreadChannels([]);
    setDMs([]);
    setUnreadDMs([]);

    try {
      await MeshStore.clear();
      await persistor.purge();
    } catch (e) {
      console.error(Error(e));
    }

    apolloClient.clearStore();

    navigateToScreen("app", { circle: null });
  };

  const goToLogin = () => {
    navigateToScreen("login");
  };

  const goToProfile = () => {
    navigateToScreen("viewUser");
  };

  const goToInvites = () => {
    navigateToScreen("viewInvites");
  };

  const goToAbout = () => {
    navigateToScreen("about");
  };

  const goToPolicy = () => {
    navigateToScreen("privacy");
  };

  const { data } = useQuery(GET_USER_BY_ID, {
    variables: { id: user },
    skip: !user,
  });

  let userObj = null;
  if (data) {
    userObj = data.user;
  }

  return (
    <View style={[styles.wrapper]}>
      <View>
        {/* User */}
        {userObj ? (
          <UserLink onPress={goToProfile} user={userObj} />
        ) : (
          <NoUserLink onPress={goToLogin} />
        )}
        <ContrastTitle text={"Settings"} />
        <ScrollView>
          {/* Links */}
          {userObj && (
            <MenuLink
              icon="mail"
              label="Invites"
              details="View and Accept Invites to Circles"
              onPress={goToInvites}
              badge={invites.length !== 0}
            />
          )}
          <MenuLink
            icon="help-circle"
            label="About"
            details="FAQs and Us"
            onPress={goToAbout}
          />
          <MenuLink
            icon="info"
            label="Privacy"
            details="Privacy Policy and Terms of Use"
            onPress={goToPolicy}
          />
          {userObj && (
            <MenuLink icon="log-out" label="Log out" onPress={logout} />
          )}
        </ScrollView>
      </View>

      <View style={{ marginLeft: 10 }}>
        <DisclaimerText grey text={"App Version: " + packageJSON.version} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "stretch",
    justifyContent: "space-between",
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#282a38",
  },
  userLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 5,
  },
  image: {
    height: 40,
    width: 40,
    borderRadius: 9999,
  },
  header: {
    fontSize: 18,
    color: "#FFFFFF",
  },
  disclaimer: {
    fontSize: 14,
    color: "#FFFFFFb7",
  },
});

export default SideMenu;
