import React, { useState, useGlobal, useEffect, setGlobal } from "reactn";

// something react-navigation recommends
import { enableScreens } from "react-native-screens";
enableScreens();

import {
  StatusBar,
  StyleSheet,
  View,
  Dimensions,
  Platform,
  ImageBackground,
} from "react-native";
import { Asset } from "expo-asset";
import { preventAutoHideAsync, hideAsync } from "expo-splash-screen";
import * as Font from "expo-font";
import * as Notifications from "expo-notifications";
import { NavigationContainer } from "@react-navigation/native";

import { navigationRef } from "./navigation/RootNavigation";
import RootStack from "./screens";
import defaultState from "./constants/defaultState";
import { linkingConfig } from "./navigation/useLinking";

import AutoLoginHandler from "./components/AutoLoginHandler";
import OnlineMonitor from "./components/OnlineMonitor";
import RevisionMonitor from "./components/RevisionMonitor";
import ChannelUpdateMonitor from "./components/ChannelUpdateMonitor";
import InviteMonitor from "./components/InviteMonitor";

import MeshStore from "./utils/meshStore";
import getImageSize from "./utils/getImageSize";

// theming
import { themes } from "./constants/themes";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// screens that can appear outside of the stack
import Channels from "./screens/Channels";

// apollo graphql
import { ApolloProvider, ApolloClient } from "@apollo/client";
import { link, cache, persistor } from "./graphql";

// Expo notifications
import NotificationListener from "./components/NotificationListener";

const client = new ApolloClient({
  link,
  cache,
});

// if (process.env.NODE_ENV === "development") {
//   const whyDidYouRender = require("@welldone-software/why-did-you-render");
//   whyDidYouRender(React, {
//     trackAllPureComponents: true,
//   });
// }

// initialize global state
setGlobal(defaultState);

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [initialNavigationState] = useState();
  const [dimensions, setDimensions] = useGlobal("dimensions");
  const [, setActiveTheme] = useGlobal("activeTheme");
  const [isMobile, setIsMobile] = useGlobal("isMobile");
  const [, setSearchedCircles] = useGlobal("searchedCircles");
  const [user] = useGlobal("user");

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    // Clear badge count on load
    Notifications.setBadgeCountAsync(0);

    async function loadResourcesAndDataAsync() {
      try {
        // start persisting apollo cache

        preventAutoHideAsync();

        // Load fonts
        await Font.loadAsync({
          SpaceGrotesk: require("./assets/fonts/SpaceGrotesk_SemiBold.otf"),
        });

        await persistor.restore();
        await Asset.loadAsync([getImageSize(Dimensions.get("window").width)]);

        // get preferred theme, and recent searches from storage
        let res = MeshStore.getItemSync("theme");
        let searches = MeshStore.getItemSync("searched_circles");

        // if we have a preferred theme in storage, set it before we load the app
        if (res) {
          setActiveTheme(themes[res]);
        }

        // if we have a list of searches set it before we load the app
        if (searches !== null) {
          setSearchedCircles(JSON.parse(searches));
        }
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        hideAsync();
      }
    }

    loadResourcesAndDataAsync();
    Dimensions.addEventListener("change", resize);

    return () => {
      Dimensions.removeEventListener("change", resize);
    };
  }, []);

  // on browser resize, or in the bizarre case of the app resizing on a tablet or some nonsense
  const resize = ({ window }) => {
    setDimensions({
      width: window.width,
      height: window.height,
    });
  };

  // if the device's orientation is flipped
  const onRotate = () => {
    setDimensions({
      width: Dimensions.get("window").width,
      height: Dimensions.get("window").height,
    });
  };

  // effect to display mobile features or not based on resize or orientation
  useEffect(() => {
    setIsMobile(Platform.OS !== "web" || dimensions.width <= 576);
  }, [dimensions]);

  const shouldRenderSideBar = isMobile ? null : <Channels renderAsSidebar />;

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    return (
      <ApolloProvider client={client}>
        <SafeAreaProvider>
          <SafeAreaView style={[styles.container, styles.safeAreaContainer]}>
            <ImageBackground
              source={getImageSize(dimensions.width)}
              style={[
                styles.container,
                { width: dimensions.width, overflow: "hidden" },
              ]}
              progressiveRenderingEnabled
              onLayout={onRotate}
            >
              <StatusBar barStyle="light-content" />
              <NavigationContainer
                ref={navigationRef}
                initialState={initialNavigationState}
                linking={linkingConfig}
              >
                <View style={styles.container} onLayout={onRotate}>
                  {shouldRenderSideBar}
                  <RootStack />
                </View>
              </NavigationContainer>
            </ImageBackground>
            {/* Put non-rendering components here so they mount after other components*/}
            <AutoLoginHandler />
            <OnlineMonitor />
            <RevisionMonitor />
            <ChannelUpdateMonitor />
            <InviteMonitor />
            {user && Platform.OS !== "web" && (
              <NotificationListener user={user} />
            )}
          </SafeAreaView>
        </SafeAreaProvider>
      </ApolloProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  safeAreaContainer: {
    backgroundColor: "#282a38",
  },
  image: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  bgImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 16,
    bottom: 0,
  },
});
