import React, { useEffect, useState, useGlobal } from "reactn";
import { ScrollView, Image, StyleSheet } from "react-native";
import TitleTabs from "../../components/TitleTabs";
import { fadeTransition } from "../../navigation/transitionConfigs";
import { createStackNavigator } from "@react-navigation/stack";

import Login from "./Login";
import Register from "./Register";

const Stack = createStackNavigator();

export default function Portal(props) {
  const [isMobile] = useGlobal("isMobile");
  const [, setActiveChannel] = useGlobal("activeChannel");
  const [, setActiveCircle] = useGlobal("activeCircle");
  const [, setActiveRevision] = useGlobal("activeRevision");

  const [screen, setScreen] = useState("login");

  useEffect(() => {
    setActiveChannel(null);
    setActiveCircle(null);
    setActiveRevision(null);
  }, []);

  useEffect(() => {
    props.navigation.navigate("portal", { screen });
  }, [screen]);

  const onUpdateTab = (tab) => {
    setScreen(tab);
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.wrapper,
        !isMobile ? { paddingHorizontal: "20%" } : {},
      ]}
    >
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
          ...fadeTransition(),
        }}
      >
        <Stack.Screen
          name="register"
          component={Register}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="login"
          component={Login}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "stretch",
    justifyContent: "flex-start",
    width: "100%",
    flex: 1,
    padding: 13,
  },
});
