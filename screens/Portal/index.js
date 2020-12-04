import React, { useEffect, useState, useGlobal } from "reactn";
import { View, Image, StyleSheet } from "react-native";
import TitleTabs from "./TitleTabs";
import { noTransition } from "../../navigation/transitionConfigs";
import { createStackNavigator } from "@react-navigation/stack";

import Login from "./Login";
import Register from "./Register";
import Reset from "./Reset";
import ResetConfirm from "./ResetConfirm";

import Forgot from "./Forgot";

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
          name="register"
          component={Register}
          options={{ headerShown: false, title: "Register" }}
        />
        <Stack.Screen
          name="login"
          component={Login}
          options={{ headerShown: false, title: "Login" }}
        />
        <Stack.Screen
          name="forgot"
          component={Forgot}
          options={{ headerShown: false, title: "Forgot Password" }}
        />
        <Stack.Screen
          name="resetConfirm"
          component={ResetConfirm}
          options={{ headerShown: false, title: "Confirm Reset" }}
        />
        <Stack.Screen
          name="reset"
          component={Reset}
          options={{ headerShown: false, title: "Reset" }}
        />
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
