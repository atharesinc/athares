import React, { useGlobal } from "reactn";
import { Platform } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";

import Channels from "./Channels";

import Login from "./Login";
import Register from "./Register";
import News from "./News";

import Header from "../components/Header";

const Stack = createStackNavigator();

export default function RootStack(props) {
  const [dimensions] = useGlobal("dimensions");

  const shouldRenderSideBar = Platform.OS == "web" && dimensions.width > 576;
  //   { scene, previous, navigation }

  const shouldDisplayNewsAsApp = shouldRenderSideBar ? News : Channels;
  const appOptions = shouldRenderSideBar ? {} : { headerShown: false };

  return (
    <Stack.Navigator
      headerMode="screen"
      screenOptions={{
        header: (props) => <Header {...props} />,
      }}
      options={{ cardStyle: { backgroundColor: "transparent" } }}
    >
      {/* This is where all the screens go */}
      <Stack.Screen
        name="app"
        component={shouldDisplayNewsAsApp}
        options={appOptions}
      />
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
      <Stack.Screen name="news" component={News} />
    </Stack.Navigator>
  );
}
