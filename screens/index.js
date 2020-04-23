import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Login from "./Login";
import Header from "../components/Header";

const Stack = createStackNavigator();

export default function RootStack(props) {
  //     const shouldRenderChannels = () => {
  //     if (Platform.OS !== "web" || dimensions.width <= 576) {
  //       return <Channels />;
  //     }
  //     return null;
  //   };
  return (
    <Stack.Navigator
      headerMode={"screen"}
      options={{
        //   { scene, previous, navigation }
        header: (props) => <Header {...props} />,
      }}
    >
      {/* This is where all the screens go */}
      {/* <Stack.Screen name="Root" component={BottomTabNavigator} /> */}
      {/* <Stack.Screen name="app" component={Main} /> */}
      <Stack.Screen name="login" component={Login} />
      {/* {shouldRenderChannels()} */}
    </Stack.Navigator>
  );
}
