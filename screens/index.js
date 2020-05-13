import React, { useGlobal } from "reactn";
import { Platform } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";

import Channels from "./Channels";
import Login from "./Login";
import Register from "./Register";
import News from "./News";
import CreateCircle from "./CreateCircle";
import Constitution from "./Constitution";

import Header from "../components/Header";

const Stack = createStackNavigator();

export default function RootStack(props) {
  const [isMobile] = useGlobal("isMobile");
  const [activeTheme] = useGlobal("activeTheme");

  const shouldDisplayNewsAsApp = isMobile ? Channels : News;
  const newsOptions = isMobile ? {} : { headerShown: false };
  const appOptions = { headerShown: false };
  return (
    <Stack.Navigator
      headerMode="screen"
      // props =  { scene, previous, navigation }
      screenOptions={{
        header: (props) => <Header {...props} />,
        cardStyle: { backgroundColor: activeTheme.COLORS.DARK, flex: 1 },
        //   cardStyleInterpolator: ({ layouts, index, current }) => {
        //     const {
        //       screen: { width },
        //     } = layouts;

        //     const translateX = current.progress.interpolate({
        //       inputRange: [index - 1, index, index + 1],
        //       outputRange: [width, 0, -width],
        //     });

        //     return {
        //       transform: [{ translateX }],
        //     };
        //   },
      }}
      // style={{ backgroundColor: activeTheme.COLORS.DARK }}
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
      <Stack.Screen name="createCircle" component={CreateCircle} />
      <Stack.Screen name="constitution" component={Constitution} />

      <Stack.Screen name="news" component={News} options={newsOptions} />
    </Stack.Navigator>
  );
}
