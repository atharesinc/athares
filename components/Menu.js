import React, { useGlobal } from "reactn";
import * as RootNavigation from "../navigation/RootNavigation";
import { ScrollView, StyleSheet, View } from "react-native";
import { Linking } from "expo";
import { useQuery } from "@apollo/client";
import UserLink from "./UserLink";
import NoUserLink from "./NoUserLink";
import MenuLink from "./MenuLink";
import MeshStore from "../utils/meshStore";
import Title from "./Title";
import DisclaimerText from "./DisclaimerText";
import { GET_USER_BY_ID } from "../graphql/queries";
import packageJSON from "../package.json";

function SideMenu(props) {
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
  const [isMobile] = useGlobal("isMobile");
  const [isMenuOpen, setIsMenuOpen] = useGlobal("isMenuOpen");

  const navigateToScreen = (route) => {
    if (route === "login") {
      RootNavigation.navigate("portal", { screen: "login" });
    } else {
      RootNavigation.navigate(route);
    }
    setIsMenuOpen(false);
  };

  const logout = async () => {
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
    await MeshStore.clear();

    navigateToScreen("app");
  };

  const goToLogin = () => {
    navigateToScreen("login");
  };

  const goToProfile = () => {
    navigateToScreen("viewUser");
  };

  const goToAbout = () => {
    Linking.openURL("https://www.athar.es/about");
  };

  const goToPolicy = () => {
    Linking.openURL("https://www.athar.es/policy");
  };

  const { loading, error, data } = useQuery(GET_USER_BY_ID, {
    variables: { id: user || "" },
  });

  let userObj = null;
  if (data) {
    userObj = data.user;
  }

  const responsiveWidth = {
    width: isMobile ? "100%" : 300,
  };

  if (!isMenuOpen) {
    return null;
  }
  return (
    <View style={[styles.wrapper, responsiveWidth]}>
      <View>
        {/* User */}
        {userObj ? (
          <UserLink onPress={goToProfile} user={userObj} />
        ) : (
          <NoUserLink onPress={goToLogin} />
        )}
        <Title text={"Settings"} indent underline />
        <ScrollView>
          {/* Links */}
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
    backgroundColor: "#2f3242",
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
