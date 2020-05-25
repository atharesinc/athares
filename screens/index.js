import React, { useGlobal } from "reactn";

import { createStackNavigator } from "@react-navigation/stack";

import Channels from "./Channels";
import News from "./News";
import CreateCircle from "./CreateCircle";
import CreateChannel from "./CreateChannel";

import Constitution from "./Constitution";
import Portal from "./Portal";

import Header from "../components/Header";
import { pushTransition } from "../navigation/transitionConfigs";

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
        ...pushTransition(activeTheme),
      }}
    >
      {/* This is where all the screens go */}
      <Stack.Screen
        name="app"
        component={shouldDisplayNewsAsApp}
        options={appOptions}
      />
      <Stack.Screen
        name="portal"
        component={Portal}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="createCircle" component={CreateCircle} />
      <Stack.Screen name="createChannel" component={CreateChannel} />
      <Stack.Screen name="constitution" component={Constitution} />
      <Stack.Screen name="news" component={News} options={newsOptions} />
    </Stack.Navigator>
  );
}
