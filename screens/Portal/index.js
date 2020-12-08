import React, { lazy, useEffect, useState, useGlobal, Suspense } from "reactn";
import { View, Image, StyleSheet } from "react-native";
import TitleTabs from "./TitleTabs";
import { noTransition } from "../../navigation/transitionConfigs";
import { createStackNavigator } from "@react-navigation/stack";
import CenteredLoaderWithText from "../../components/CenteredLoaderWithText";
import Login from "./Login";
const Register = lazy(() => import("./Register"));
const Reset = lazy(() => import("./Reset"));
const ResetConfirm = lazy(() => import("./ResetConfirm"));

const Forgot = lazy(() => import("./Forgot"));

const Stack = createStackNavigator();

export default function Portal(props) {
  const [, setActiveChannel] = useGlobal("activeChannel");
  const [, setActiveCircle] = useGlobal("activeCircle");
  const [, setActiveRevision] = useGlobal("activeRevision");
  const [screen, setScreen] = useState(
    props.route?.state?.routes[0]?.name || "login"
  );

  useEffect(() => {
    setActiveChannel(null);
    setActiveCircle(null);
    setActiveRevision(null);
  }, []);

  useEffect(() => {
    // This is to account for screen changes not handled by button presses (hardware back on android)
    //  or a default route given by navigating here directly
    setScreen(
      props.route?.state?.routes[props.route?.state?.routes.length - 1 || 0]
        ?.name || props.route.params?.screen
    );
  }, [props.route]);

  const onUpdateTab = (tab) => {
    props.navigation.navigate("portal", { screen: tab });
  };

  return (
    <View style={styles.wrapper}>
      <Image
        style={{ height: 30, width: 180, marginTop: 60, marginBottom: 25 }}
        source={require("../../assets/images/Athares-type-small-white.png")}
      />

      <TitleTabs
        activeTab={screen}
        tabs={["login", "register"]}
        onUpdateTab={onUpdateTab}
      />
      <Stack.Navigator
        headerMode="screen"
        screenOptions={{
          header: "none",
          ...noTransition(),
        }}
      >
        <Stack.Screen
          name="login"
          component={Login}
          options={{ headerShown: false, title: "Login" }}
        />
        <Stack.Screen
          name="register"
          options={{ headerShown: false, title: "Register" }}
        >
          {(props) => (
            <Suspense fallback={<CenteredLoaderWithText />}>
              <Register {...props} />
            </Suspense>
          )}
        </Stack.Screen>
        <Stack.Screen
          name="forgot"
          options={{ headerShown: false, title: "Forgot Password" }}
        >
          {(props) => (
            <Suspense fallback={<CenteredLoaderWithText />}>
              <Forgot {...props} />
            </Suspense>
          )}
        </Stack.Screen>
        <Stack.Screen
          name="resetConfirm"
          options={{ headerShown: false, title: "Confirm Reset" }}
        >
          {(props) => (
            <Suspense fallback={<CenteredLoaderWithText />}>
              <ResetConfirm {...props} />
            </Suspense>
          )}
        </Stack.Screen>
        <Stack.Screen
          name="reset"
          options={{ headerShown: false, title: "Reset" }}
        >
          {(props) => (
            <Suspense fallback={<CenteredLoaderWithText />}>
              <Reset {...props} />
            </Suspense>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "stretch",
    justifyContent: "flex-start",
    width: "100%",
    flex: 1,
    padding: 15,
  },
});
