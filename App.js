import React, { useState, useGlobal, useEffect, setGlobal } from "reactn";

import {
  StatusBar,
  StyleSheet,
  View,
  Dimensions,
  Platform,
  ImageBackground,
} from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";

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
// theming
import { themes } from "./constants/themes";

import {
  SafeAreaProvider,
  initialWindowSafeAreaInsets,
  SafeAreaView,
} from "react-native-safe-area-context";

// screens that can appear outside of the stack
import Channels from "./screens/Channels";
import Drawer from "./components/Drawer";

// apollo graphql
import { ApolloProvider, ApolloClient } from "@apollo/client";
import { link, cache } from "./graphql";

// initialize storage
MeshStore.init();

const client = new ApolloClient({
  link,
  cache,
});

// initialize global state
setGlobal(defaultState);

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [initialNavigationState] = useState();
  const [dimensions, setDimensions] = useGlobal("dimensions");
  const [, setActiveTheme] = useGlobal("activeTheme");
  const [isMobile, setIsMobile] = useGlobal("isMobile");
  const [, setSearchedCircles] = useGlobal("searchedCircles");

  // const { getInitialState } = useLinking(navigationRef);

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        // Load our initial navigation state
        // setInitialNavigationState(await getInitialState());

        // Load fonts
        await Font.loadAsync({
          SpaceGrotesk: require("./assets/fonts/SpaceGrotesk_SemiBold.otf"),
        });

        // get preferred theme, and recent searches from storage
        let prom1 = MeshStore.getItem("theme");
        let prom2 = MeshStore.getItem("searched_circles");

        let [res, searches] = await Promise.all([prom1, prom2]);

        // if we have a preferred theme in storage, set it before we load the app
        if (res !== null) {
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
        SplashScreen.hideAsync();
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
  // isMenuOpen ? { overflow: "hidden" } : {};

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    return (
      <ApolloProvider client={client}>
        <ImageBackground
          source={require("./assets/images/iss-master.jpg")}
          style={[styles.container, { width: dimensions.width }]}
          progressiveRenderingEnabled
          onLayout={onRotate}
        >
          <View style={styles.container} onLayout={onRotate}>
            <StatusBar barStyle="light-content" />
            <SafeAreaProvider
              initialSafeAreaInsets={initialWindowSafeAreaInsets}
            >
              <NavigationContainer
                ref={navigationRef}
                initialState={initialNavigationState}
                linking={linkingConfig}
              >
                <Drawer>
                  <SafeAreaView style={styles.container}>
                    {shouldRenderSideBar}
                    <RootStack />
                  </SafeAreaView>
                </Drawer>
              </NavigationContainer>
            </SafeAreaProvider>
          </View>
        </ImageBackground>
        {/* Put non-rendering components here so they mount after other components*/}
        <AutoLoginHandler />
        <OnlineMonitor />
        <RevisionMonitor />
        <ChannelUpdateMonitor />
        <InviteMonitor />
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
  // imageContainer: {
  //   flex: 1,
  //   width: Dimensions.get("window").width,
  //   height: Dimensions.get("window").height,
  //   backgroundColor: "transparent",
  //   flexDirection: "row",
  //   justifyContent: "flex-start",
  //   alignItems: "stretch",
  // },
  image: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
});
