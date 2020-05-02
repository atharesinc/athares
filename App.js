import React, {
  useState,
  useGlobal,
  useEffect,
  useRef,
  setGlobal,
} from "reactn";
import {
  StatusBar,
  StyleSheet,
  View,
  Text,
  Dimensions,
  Platform,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { SplashScreen } from "expo";
import * as Font from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef } from "./navigation/RootNavigation";
import RootStack from "./screens";
import defaultState from "./constants/defaultState";
import { setCustomText, setCustomTextInput } from "react-native-global-props";
import useLinking from "./navigation/useLinking";

// theming
import { themes } from "./constants/themes";
import AsyncStorage from "@react-native-community/async-storage";

import {
  SafeAreaProvider,
  initialWindowSafeAreaInsets,
  SafeAreaView,
} from "react-native-safe-area-context";

// screens that can appear outside of the stack
import Channels from "./screens/Channels";

// apollo graphql
import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloClient } from "apollo-client";
import { link, cache } from "./graphql";

const client = new ApolloClient({
  link,
  cache,
});

// initialize global state
setGlobal(defaultState);

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [initialNavigationState, setInitialNavigationState] = useState();
  const [dimensions, setDimensions] = useGlobal("dimensions");
  const [activeTheme, setActiveTheme] = useGlobal("activeTheme");
  const { getInitialState } = useLinking(navigationRef);

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();

        // Load our initial navigation state
        // setInitialNavigationState(await getInitialState());

        // Load fonts
        await Font.loadAsync({
          SpaceGrotesk: require("./assets/fonts/SpaceGrotesk_SemiBold.otf"),
        });

        // get preferred theme from storage
        let res = await AsyncStorage.getItem("theme");

        // if we have a preferred theme in storage, set it before we load the app
        if (res !== null) {
          setActiveTheme(themes[res]);
        }

        // Make sure to use this font EVERYWHERE so we don't have to manually assign it
        const customTextProps = {
          style: {
            fontFamily: "SpaceGrotesk",
          },
        };
        Text.defaultProps = Text.defaultProps || {};
        Text.defaultProps.style = { fontFamily: "SpaceGrotesk" };

        setCustomText(customTextProps);
        setCustomTextInput(customTextProps);
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    }

    loadResourcesAndDataAsync();
    Dimensions.addEventListener("change", resize);

    return () => {
      Dimensions.removeEventListener("change", resize);
    };
  }, []);

  const resize = ({ window }) => {
    setDimensions({
      width: window.width,
      height: window.height,
    });
  };

  const onRotate = () => {
    setDimensions({
      width: Dimensions.get("window").width,
      height: Dimensions.get("window").height,
    });
  };

  const shouldRenderSideBar = () => {
    if (Platform.OS == "web" && dimensions.width > 576) {
      return <Channels renderAsSidebar />;
    }
    return null;
  };

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    return (
      <ApolloProvider client={client}>
        <ImageBackground
          source={require("./assets/images/iss-master.jpg")}
          style={styles.image}
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
              >
                <SafeAreaView style={styles.container}>
                  {shouldRenderSideBar()}
                  <RootStack />
                </SafeAreaView>
              </NavigationContainer>
            </SafeAreaProvider>
          </View>
        </ImageBackground>
      </ApolloProvider>
    );
  }
}

// import * as RootNavigation from "./navigation/RootNavigation";

// const Channels = () => {
//   const toLogin = () => {
//     RootNavigation.navigate("login");

//     // return navigation.navigate("Login");
//   };
//   const toMain = () => {
//     RootNavigation.navigate("app");
//     // return navigation.navigate("Login");
//   };
//   return (
//     <View style={channelStyles.wrapper}>
//       <Text>Channels List</Text>
//       <TouchableOpacity onPress={toLogin}>
//         <Text>Login </Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={toMain}>
//         <Text>Login </Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const Main = ({ navigation }) => {
//   const toLogin = () => {
//     return navigation.navigate("login");
//   };
//   return (
//     <View style={styles.container}>
//       <Text>Main</Text>
//       <TouchableOpacity onPress={navigation.goBack}>
//         <Text>Back </Text>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={toLogin}>
//         <Text>Login </Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const Login = ({ navigation }) => {
//   const toMain = () => navigation.navigate("app");

//   return (
//     <View style={styles.container}>
//       <Text>Login</Text>
//       <TouchableOpacity onPress={navigation.goBack}>
//         <Text>Back </Text>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={toMain}>
//         <Text>Main </Text>
//       </TouchableOpacity>
//     </View>
//   );
// };
// const channelStyles = StyleSheet.create({
//   wrapper: {
//     flex: 0,
//     flexGrow: 1 / 3,
//     backgroundColor: "#fff",
//     flexDirection: "column",
//     minWidth: 250,
//   },
// });

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
  image: {
    flex: 1,
    height: "100%",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
});
