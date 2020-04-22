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
} from "react-native";
import { SplashScreen } from "expo";
import * as Font from "expo-font";
import { Feather } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef } from "./navigation/RootNavigation";

import { createStackNavigator } from "@react-navigation/stack";
import defaultState from "./constants/defaultState";
import { setCustomText, setCustomTextInput } from "react-native-global-props";

import useLinking from "./navigation/useLinking";

import {
  SafeAreaProvider,
  initialWindowSafeAreaInsets,
  SafeAreaView,
} from "react-native-safe-area-context";

const Stack = createStackNavigator();

// initialize global state
setGlobal(defaultState);

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [initialNavigationState, setInitialNavigationState] = useState();
  const [dimensions, setDimensions] = useGlobal("dimensions");

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
          ...Feather.font,
          SpaceGrotesk: require("./assets/fonts/SpaceGrotesk-SemiBold.otf"),
        });

        // Make sure to use this font EVERYWHERE so we don't have to manually assign it
        const customTextProps = {
          style: {
            fontFamily: "SpaceGrotesk",
          },
        };
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
      return <Channels />;
    }
    return null;
  };

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    return (
      <View style={styles.container} onLayout={onRotate}>
        <StatusBar barStyle="light-content" />
        <SafeAreaProvider initialSafeAreaInsets={initialWindowSafeAreaInsets}>
          <NavigationContainer
            ref={navigationRef}
            initialState={initialNavigationState}
          >
            <SafeAreaView style={styles.container}>
              {shouldRenderSideBar()}
              <Stack.Navigator
                headerMode={"screen"}
                // options={{
                //   header: ({ scene, previous, navigation }) => {
                //     const { options } = scene.descriptor;
                //     const title =
                //       options.headerTitle !== undefined
                //         ? options.headerTitle
                //         : options.title !== undefined
                //         ? options.title
                //         : scene.route.name;

                //     return (
                //       <MyHeader
                //         title={title}
                //         leftButton={
                //           previous ? (
                //             <MyBackButton onPress={navigation.goBack} />
                //           ) : undefined
                //         }
                //         style={options.headerStyle}
                //       />
                //     );
                //   },
                // }
                // }
              >
                {/* This is where all the screens go */}
                {/* <Stack.Screen name="Root" component={BottomTabNavigator} /> */}
                <Stack.Screen name="app" component={Main} />
                <Stack.Screen name="login" component={Login} />
              </Stack.Navigator>
            </SafeAreaView>
          </NavigationContainer>
        </SafeAreaProvider>
      </View>
    );
  }
}

const RootNavigation = require("./navigation/RootNavigation");

const Channels = () => {
  const toLogin = () => {
    RootNavigation.navigate("login");

    // return navigation.navigate("Login");
  };
  const toMain = () => {
    RootNavigation.navigate("app");
    // return navigation.navigate("Login");
  };
  return (
    <View style={channelStyles.wrapper}>
      <Text>Channels List</Text>
      <TouchableOpacity onPress={toLogin}>
        <Text>Login </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={toMain}>
        <Text>Login </Text>
      </TouchableOpacity>
    </View>
  );
};

const Main = ({ navigation }) => {
  const toLogin = () => {
    return navigation.navigate("login");
  };
  return (
    <View style={styles.container}>
      <Text>Main</Text>
      <TouchableOpacity onPress={navigation.goBack}>
        <Text>Back </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={toLogin}>
        <Text>Login </Text>
      </TouchableOpacity>
    </View>
  );
};

const Login = ({ navigation }) => {
  const toMain = () => navigation.navigate("app");

  return (
    <View style={styles.container}>
      <Text>Login</Text>
      <TouchableOpacity onPress={navigation.goBack}>
        <Text>Back </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={toMain}>
        <Text>Main </Text>
      </TouchableOpacity>
    </View>
  );
};
const channelStyles = StyleSheet.create({
  wrapper: {
    flex: 0,
    flexGrow: 1 / 3,
    backgroundColor: "#fff",
    flexDirection: "column",
    minWidth: 250,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
});
